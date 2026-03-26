#!/usr/bin/env python3
"""
两阶段 Skill 匹配器 (Phase 3-4)

召回（高 recall）→ 重排（高 precision）
支持多路召回、统一评分、交互式消歧。

=====================================
【设计决策 #1】为什么需要两阶段匹配？
=====================================
问题背景：
  - Skill 数量可能很多（几十到上百个）
  - 精确匹配需要计算复杂的相似度
  - 对每个 Skill 都做精确匹配太慢

解决方案：召回 → 重排 两阶段
  - Stage 1 召回（高 recall）：快速过滤，宁可多选不漏选
  - Stage 2 重排（高 precision）：精确评分，选出最佳

为什么这样设计？
  - 召回阶段用简单规则，O(n) 复杂度
  - 重排阶段只处理候选集（通常 5-10 个），可以用复杂算法
  - 这是搜索引擎的经典架构（Lucene/Elasticsearch 也是这样）

=====================================
【设计决策 #2】为什么不用 embedding 向量匹配？
=====================================
问题背景：
  - 语义匹配通常用 embedding 向量
  - 但 embedding 需要额外的模型调用
  - 增加延迟和成本

解决方案：多信号融合的规则匹配
  - 规则匹配（正则表达式）：30% 权重
  - 触发词匹配：25% 权重
  - 标签匹配（Jaccard）：20% 权重
  - Token 重叠：15% 权重
  - 负向惩罚：10% 权重

为什么这样设计？
  - 规则匹配可以捕获明确的意图（如"设计 API"）
  - 触发词是 Skill 作者定义的关键词
  - 多信号融合比单一信号更鲁棒
  - 无需外部依赖，纯 Python 实现

=====================================
【设计决策 #3】为什么需要消歧机制？
=====================================
问题背景：
  - 用户输入可能匹配多个 Skill
  - 自动选择可能选错
  - 但每次都问用户太烦

解决方案：三级决策
  - 高置信度（≥0.85）：自动选择，不问用户
  - 中等置信度（0.5-0.85）：推荐但允许修改
  - 低置信度或接近（差距<0.15）：触发消歧，让用户选择

为什么阈值是 0.85 和 0.15？
  - 经验值，可以通过配置调整
  - 0.85 表示"非常确定"
  - 0.15 表示"两个选项太接近，无法自动决策"

=====================================
【设计决策 #4】为什么用 2-gram 而不是单字？
=====================================
问题背景：
  - 中文没有空格分隔词语
  - 单字匹配噪音太大（"的"、"是"到处都有）
  - 专业分词库（jieba）是额外依赖

解决方案：2-gram + 停用字过滤
  - 中文：提取连续两个字作为 token
  - 英文：按空格分割，过滤停用字
  - 2-gram 权重比单字高 1.5 倍

为什么不用 jieba？
  - 减少外部依赖
  - 2-gram 对于 Skill 匹配场景足够好
  - 避免分词错误导致的问题

Usage:
    python skill_matcher.py --step "为用户认证 API 生成 OpenAPI 规范"
    python skill_matcher.py --step "实现用户注册" --tags api,backend
    python skill_matcher.py --batch steps.json
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional

# 加载 common 共享类型
sys.path.insert(0, str(Path(__file__).parent))
from common import Result  # noqa: E402

# 中文停用字（高频无意义字）
CHINESE_STOPWORDS = set("的是在了不和有大这主中人上为们个用时要出就分对成会可以能都")

# 英文停用字
ENGLISH_STOPWORDS = {
    "the", "a", "an", "is", "are", "was", "were", "be", "been",
    "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "and", "or", "but", "if", "then", "else", "when", "where",
    "this", "that", "these", "those", "it", "its"
}

# 默认评分配置
DEFAULT_SCORING = {
    "weights": {
        "rule_match": 0.30,
        "trigger_match": 0.25,
        "tag_match": 0.20,
        "token_overlap": 0.15,
        "negative_penalty": 0.10,
    },
    "thresholds": {
        "min_confidence": 0.5,
        "disambiguation": 0.15,
        "auto_select": 0.85,
    }
}

# 内置兜底规则（yaml 加载失败时使用）
_FALLBACK_RULES = [
    {"pattern": r"(设计|定义).*(API|接口)", "skill": "api-documenter", "confidence": 0.9},
    {"pattern": r"(编写|写).*(测试|test)", "skill": "test-driven-development", "confidence": 0.85},
    {"pattern": r"(代码审查|review|CR)", "skill": "code-review", "confidence": 0.9},
    {"pattern": r"(实现|开发).*(后端|backend|服务)", "skill": "backend-developer", "confidence": 0.8},
    {"pattern": r"(实现|开发).*(前端|frontend|UI|界面)", "skill": "frontend-developer", "confidence": 0.8},
    {"pattern": r"(部署|deploy|发布)", "skill": "devops-engineer", "confidence": 0.8},
    {"pattern": r"(性能|优化|performance)", "skill": "backend-developer", "confidence": 0.7},
]

_RULES_CACHE: list = []


def load_matching_rules() -> list:
    """从 config/matching-rules.yaml 加载规则，失败时回退到内置规则"""
    global _RULES_CACHE
    if _RULES_CACHE:
        return _RULES_CACHE

    rules_file = Path(__file__).parent.parent / "config" / "matching-rules.yaml"
    if rules_file.exists():
        try:
            import yaml
            with open(rules_file, encoding="utf-8") as f:
                data = yaml.safe_load(f)
            _RULES_CACHE = data.get("rules", _FALLBACK_RULES)
            return _RULES_CACHE
        except Exception:
            pass

    _RULES_CACHE = _FALLBACK_RULES
    return _RULES_CACHE


@dataclass
class MatchScore:
    """匹配分数"""
    skill_name: str
    final_score: float
    components: dict = field(default_factory=dict)
    confidence_level: str = "low"  # high / medium / low
    reason: str = ""


@dataclass
class MatchResult:
    """匹配结果"""
    skill: Optional[str]
    method: str  # auto_selected / recommended / disambiguation_needed / below_threshold
    confidence: float = 0.0
    alternatives: list = field(default_factory=list)
    candidates: list = field(default_factory=list)
    needs_user_input: bool = False
    message: str = ""


def tokenize_simple_v2(text: str) -> set:
    """
    简单分词 v2：停用字过滤 + 最小长度 + 优先 2-gram
    无需外部依赖（jieba 等）
    """
    tokens = set()

    # 英文：按空格和标点分割，过滤停用字和短词
    english_tokens = re.findall(r'[a-zA-Z]+', text.lower())
    for token in english_tokens:
        if token not in ENGLISH_STOPWORDS and len(token) >= 2:
            tokens.add(token)

    # 中文：优先使用 2-gram，单字作为补充
    chinese_chars = re.findall(r'[\u4e00-\u9fff]', text)

    # 2-gram（主要）
    for i in range(len(chinese_chars) - 1):
        bigram = chinese_chars[i] + chinese_chars[i + 1]
        if not (chinese_chars[i] in CHINESE_STOPWORDS and chinese_chars[i + 1] in CHINESE_STOPWORDS):
            tokens.add(bigram)

    # 单字（补充，仅非停用字）
    for char in chinese_chars:
        if char not in CHINESE_STOPWORDS:
            tokens.add(char)

    # 过滤数字
    tokens = {t for t in tokens if not t.isdigit()}

    return tokens


def simple_token_overlap(query: str, skill: dict) -> float:
    """简化版 token 重叠（v2：加权 2-gram）"""
    query_tokens = tokenize_simple_v2(query)
    skill_text = skill.get("description", "") + " " + " ".join(skill.get("triggers", []))
    skill_tokens = tokenize_simple_v2(skill_text)

    if len(query_tokens) == 0:
        return 0.0

    overlap = query_tokens & skill_tokens

    # 加权：2-gram 权重更高
    bigram_overlap = len({t for t in overlap if len(t) == 2})
    unigram_overlap = len(overlap) - bigram_overlap

    weighted_overlap = bigram_overlap * 1.5 + unigram_overlap * 1.0

    bigram_query = len({t for t in query_tokens if len(t) == 2})
    unigram_query = len(query_tokens) - bigram_query
    weighted_total = bigram_query * 1.5 + unigram_query * 1.0

    if weighted_total == 0:
        return 0.0

    return min(1.0, weighted_overlap / weighted_total)


def compute_rule_score(step: dict, skill: dict) -> float:
    """计算规则匹配分数"""
    description = step.get("description", "")
    skill_name = skill.get("name", "")

    for rule in load_matching_rules():
        if re.search(rule["pattern"], description, re.IGNORECASE):
            if rule["skill"] == skill_name:
                return rule["confidence"]

    return 0.0


def compute_trigger_score(description: str, triggers: list) -> float:
    """计算触发词匹配分数"""
    if not triggers:
        return 0.0

    description_lower = description.lower()
    matches = sum(1 for t in triggers if t.lower() in description_lower)

    return min(1.0, matches / len(triggers) * 2)  # 放宽计算，2 个触发词命中即满分


def compute_tag_score(domain_hints: list, tags: list) -> float:
    """计算标签匹配分数（Jaccard 相似度）"""
    if not domain_hints or not tags:
        return 0.0

    set_a = set(h.lower() for h in domain_hints)
    set_b = set(t.lower() for t in tags)

    intersection = len(set_a & set_b)
    union = len(set_a | set_b)

    return intersection / union if union > 0 else 0.0


def handle_negative_triggers(step: dict, skill: dict, stage: str) -> tuple:
    """
    分层处理 negative_triggers
    Returns: (should_exclude, penalty_score)
    """
    description = step.get("description", "").lower()
    negative_triggers = skill.get("negative_triggers", [])
    quality_tier = skill.get("quality_tier", "draft")

    # 检查是否命中
    hits = [neg for neg in negative_triggers if neg.lower() in description]
    if not hits:
        return (False, 0.0)

    # 根据 quality_tier 决策
    if quality_tier == "verified":
        if stage == "recall":
            return (True, 0.0)  # 硬排除
        else:
            return (False, 0.0)

    elif quality_tier == "community":
        if stage == "recall":
            return (False, 0.0)
        else:
            return (False, 0.3)  # 惩罚 0.3

    else:  # draft
        if stage == "recall":
            return (False, 0.0)
        else:
            return (False, 0.5)  # 更高惩罚


def recall_stage(step: dict, skills: list, config: dict) -> list:
    """Stage 1: 高召回率过滤"""
    candidates = []

    description_lower = step.get("description", "").lower()
    domain_hints = set(h.lower() for h in step.get("domain_hints", []))

    for skill in skills:
        # 排除: 负向触发词命中（仅 verified skill）
        should_exclude, _ = handle_negative_triggers(step, skill, "recall")
        if should_exclude:
            continue

        include = False

        # 条件 1: 标签有交集
        skill_tags = set(t.lower() for t in skill.get("tags", []))
        if domain_hints & skill_tags:
            include = True

        # 条件 2: 触发词命中
        for trigger in skill.get("triggers", []):
            if trigger.lower() in description_lower:
                include = True
                break

        # 条件 3: 规则命中
        if compute_rule_score(step, skill) > 0:
            include = True

        # 条件 4: Token 重叠 > 阈值
        if simple_token_overlap(description_lower, skill) > 0.2:
            include = True

        if include:
            candidates.append(skill)

    return candidates


def compute_unified_score(step: dict, skill: dict, config: dict) -> MatchScore:
    """统一评分函数"""
    weights = config.get("weights", DEFAULT_SCORING["weights"])

    # 1. 规则匹配分数 (0-1)
    rule_score = compute_rule_score(step, skill)

    # 2. 触发词匹配分数 (0-1)
    trigger_score = compute_trigger_score(
        step.get("description", ""),
        skill.get("triggers", [])
    )

    # 3. 标签匹配分数 (0-1, Jaccard)
    tag_score = compute_tag_score(
        step.get("domain_hints", []),
        skill.get("tags", [])
    )

    # 4. Token 重叠分数 (0-1)
    token_score = simple_token_overlap(
        step.get("description", ""),
        skill
    )

    # 5. 负向惩罚 (0-1)
    _, negative_penalty = handle_negative_triggers(step, skill, "rerank")

    # 加权汇总
    final_score = (
        weights["rule_match"] * rule_score +
        weights["trigger_match"] * trigger_score +
        weights["tag_match"] * tag_score +
        weights["token_overlap"] * token_score -
        weights["negative_penalty"] * negative_penalty
    )

    # 归一化到 0-1
    final_score = max(0, min(1, final_score))

    # 确定置信度级别
    thresholds = config.get("thresholds", DEFAULT_SCORING["thresholds"])
    if final_score >= thresholds["auto_select"]:
        confidence_level = "high"
    elif final_score >= thresholds["min_confidence"]:
        confidence_level = "medium"
    else:
        confidence_level = "low"

    # 构建原因说明
    reasons = []
    if rule_score > 0:
        reasons.append(f"rule:{rule_score:.2f}")
    if trigger_score > 0:
        reasons.append(f"trigger:{trigger_score:.2f}")
    if tag_score > 0:
        reasons.append(f"tag:{tag_score:.2f}")
    if token_score > 0:
        reasons.append(f"token:{token_score:.2f}")

    return MatchScore(
        skill_name=skill.get("name", "unknown"),
        final_score=final_score,
        components={
            "rule": rule_score,
            "trigger": trigger_score,
            "tag": tag_score,
            "token": token_score,
            "negative": negative_penalty,
        },
        confidence_level=confidence_level,
        reason=", ".join(reasons) if reasons else "low overlap"
    )


def two_stage_match(step: dict, registry: dict, config: dict = None) -> list:
    """两阶段检索"""
    if config is None:
        config = DEFAULT_SCORING

    skills = registry.get("skills", [])

    # Stage 1: 召回
    candidates = recall_stage(step, skills, config)

    # Stage 2: 重排
    scored = [
        compute_unified_score(step, skill, config)
        for skill in candidates
    ]

    # 排序
    scored.sort(key=lambda x: x.final_score, reverse=True)

    return scored[:5]  # Top-5


def select_skill(step: dict, top_matches: list, config: dict = None) -> MatchResult:
    """智能选择或消歧"""
    if config is None:
        config = DEFAULT_SCORING

    thresholds = config.get("thresholds", DEFAULT_SCORING["thresholds"])

    if not top_matches:
        return MatchResult(
            skill=None,
            method="no_candidates",
            needs_user_input=True,
            message="无法找到匹配的 skill"
        )

    top1 = top_matches[0]
    top2 = top_matches[1] if len(top_matches) > 1 else None

    # Case 1: 高置信度，自动选择
    if top1.final_score >= thresholds["auto_select"]:
        return MatchResult(
            skill=top1.skill_name,
            method="auto_selected",
            confidence=top1.final_score,
            message=f"自动选择: {top1.skill_name} ({top1.reason})"
        )

    # Case 2: 低置信度，需要用户确认
    if top1.final_score < thresholds["min_confidence"]:
        return MatchResult(
            skill=None,
            method="below_threshold",
            confidence=top1.final_score,
            needs_user_input=True,
            candidates=[asdict(m) for m in top_matches[:3]],
            message=f"无法找到匹配的 skill (最高分: {top1.final_score:.2f})"
        )

    # Case 3: top1 和 top2 太接近，触发消歧
    if top2 and (top1.final_score - top2.final_score) < thresholds["disambiguation"]:
        return MatchResult(
            skill=None,
            method="disambiguation_needed",
            confidence=top1.final_score,
            needs_user_input=True,
            candidates=[asdict(m) for m in top_matches[:3]],
            message=generate_disambiguation_message(step, top_matches[:3])
        )

    # Case 4: 中等置信度，推荐但可改
    return MatchResult(
        skill=top1.skill_name,
        method="recommended",
        confidence=top1.final_score,
        alternatives=[m.skill_name for m in top_matches[1:3]],
        message=f"推荐: {top1.skill_name} ({top1.reason})"
    )


def generate_disambiguation_message(step: dict, candidates: list) -> str:
    """生成消歧问题"""
    msg = f"步骤「{step.get('name', step.get('description', '')[:30])}」有多个匹配的 skill:\n\n"

    for i, match in enumerate(candidates, 1):
        msg += f"  [{i}] {match.skill_name} (分数: {match.final_score:.2f})\n"
        msg += f"      {match.reason}\n"

    msg += "\n请选择 [1/2/3] 或输入其他 skill 名称"

    return msg


def load_registry() -> dict:
    """加载 skill 索引"""
    registry_file = Path.home() / ".cache" / "reliable-workflow" / "skill-registry.json"

    if not registry_file.exists():
        return {"skills": []}

    with open(registry_file, encoding="utf-8") as f:
        return json.load(f)


def match_step(step: dict, config: dict = None) -> Result:
    """为单个步骤匹配 skill"""
    registry = load_registry()

    if not registry.get("skills"):
        return Result(
            success=False,
            message="Skill registry is empty. Run: python skill_registry.py --scan",
            errors=["Empty registry"]
        )

    # 两阶段匹配
    top_matches = two_stage_match(step, registry, config)

    # 选择或消歧
    match_result = select_skill(step, top_matches, config)

    return Result(
        success=match_result.skill is not None,
        message=match_result.message,
        data=asdict(match_result)
    )


def main():
    parser = argparse.ArgumentParser(
        description="Two-stage skill matching (recall → rerank)"
    )
    parser.add_argument("--step", type=str, help="Step description to match")
    parser.add_argument("--tags", type=str, help="Domain hints (comma-separated)")
    parser.add_argument("--batch", type=str, help="JSON file with multiple steps")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--verbose", action="store_true", help="Show detailed scores")

    args = parser.parse_args()

    if args.step:
        step = {
            "description": args.step,
            "domain_hints": args.tags.split(",") if args.tags else [],
        }

        result = match_step(step)

        if args.json:
            print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
        else:
            print(f"\n{'✓' if result.success else '⚠'} {result.message}\n")

            if args.verbose and result.data.get("candidates"):
                print("Candidates:")
                for c in result.data["candidates"]:
                    print(f"  - {c['skill_name']}: {c['final_score']:.2f} ({c['reason']})")

        sys.exit(0 if result.success else 1)

    if args.batch:
        with open(args.batch, encoding="utf-8") as f:
            steps = json.load(f)

        results = []
        for step in steps:
            result = match_step(step)
            results.append({
                "step": step.get("description", "")[:50],
                "matched_skill": result.data.get("skill"),
                "confidence": result.data.get("confidence", 0),
                "method": result.data.get("method"),
            })

        print(json.dumps(results, ensure_ascii=False, indent=2))
        sys.exit(0)

    parser.print_help()
    sys.exit(1)


if __name__ == "__main__":
    main()
