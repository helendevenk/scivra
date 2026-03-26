#!/usr/bin/env python3
"""
评测集生成与评估 (Phase 9)

从 skill.yaml.examples 自动生成评测集，运行匹配器评测。
支持正向/负向用例、三层评测集、防止自证偏差。

Usage:
    python evaluate_matcher.py --generate                    # 生成评测集
    python evaluate_matcher.py --run                         # 运行评测
    python evaluate_matcher.py --run test/manual_curated.yaml  # 指定评测集
"""

import argparse
import json
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

# Try to import yaml
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False

# Import local modules
try:
    from skill_registry import load_registry
    from skill_matcher import two_stage_match, select_skill, DEFAULT_SCORING
except ImportError:
    # Fallback for standalone execution
    def load_registry():
        registry_file = Path.home() / ".cache" / "reliable-workflow" / "skill-registry.json"
        if registry_file.exists():
            with open(registry_file) as f:
                return json.load(f)
        return {"skills": []}

    DEFAULT_SCORING = {
        "thresholds": {"min_confidence": 0.5, "disambiguation": 0.15, "auto_select": 0.85}
    }


@dataclass
class Result:
    """Standard result pattern."""
    success: bool
    message: str
    data: dict = field(default_factory=dict)
    errors: list = field(default_factory=list)


@dataclass
class EvalResult:
    """评测结果"""
    total: int
    positive_cases: int
    negative_cases: int

    # 正向指标
    top1_hits: int
    top3_hits: int

    # 负向指标
    true_negatives: int
    false_positives: int

    # 详细
    misses: list = field(default_factory=list)

    @property
    def metrics(self) -> dict:
        return {
            "top1_accuracy": self.top1_hits / self.positive_cases if self.positive_cases > 0 else 0,
            "top3_accuracy": self.top3_hits / self.positive_cases if self.positive_cases > 0 else 0,
            "true_negative_rate": self.true_negatives / self.negative_cases if self.negative_cases > 0 else 0,
            "false_positive_rate": self.false_positives / self.negative_cases if self.negative_cases > 0 else 0,
            "overall_accuracy": (self.top1_hits + self.true_negatives) / self.total if self.total > 0 else 0,
        }


def load_skill_yaml(skill_path: str) -> Optional[dict]:
    """加载 skill.yaml"""
    path = Path(skill_path)

    for fname in ["skill.yaml", "skill.json"]:
        fpath = path / fname
        if fpath.exists():
            try:
                with open(fpath, encoding="utf-8") as f:
                    if fname.endswith(".yaml") and HAS_YAML:
                        return yaml.safe_load(f)
                    else:
                        return json.load(f)
            except Exception:
                pass

    return None


def generate_evaluation_set(registry: dict, output_path: str) -> dict:
    """从 skill.yaml.examples 生成评测集（修正版：防止自证偏差）"""
    test_cases = []
    tc_id = 1

    for skill in registry.get("skills", []):
        skill_yaml = load_skill_yaml(skill.get("path", ""))
        if not skill_yaml or "examples" not in skill_yaml:
            continue

        for example in skill_yaml.get("examples", []):
            # 修正：优先使用显式提供的 domain_hints
            # 如果没有，留空（不从 tags 复制，防止自证偏差）
            domain_hints = example.get("domain_hints", [])

            expected_match = example.get("expected_match", True)

            test_cases.append({
                "id": f"tc-{tc_id:03d}",
                "step_description": example.get("task", ""),
                "domain_hints": domain_hints,
                "expected_skill": skill.get("name") if expected_match else None,
                "expected_in_top3": expected_match,
                "source": f"{skill.get('name')}/skill.yaml",
                "auto_generated": True,
                "has_hints": len(domain_hints) > 0
            })
            tc_id += 1

    evaluation_set = {
        "version": "1.1",
        "description": "Auto-generated from skill.yaml examples",
        "generated_at": datetime.now().isoformat(),
        "test_cases": test_cases,
        "statistics": {
            "total": len(test_cases),
            "positive": len([tc for tc in test_cases if tc["expected_skill"]]),
            "negative": len([tc for tc in test_cases if not tc["expected_skill"]]),
            "with_hints": len([tc for tc in test_cases if tc["has_hints"]]),
            "without_hints": len([tc for tc in test_cases if not tc["has_hints"]])
        }
    }

    # 保存
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    if HAS_YAML and output_path.endswith(".yaml"):
        with open(output, "w", encoding="utf-8") as f:
            yaml.dump(evaluation_set, f, allow_unicode=True)
    else:
        with open(output, "w", encoding="utf-8") as f:
            json.dump(evaluation_set, f, ensure_ascii=False, indent=2)

    return evaluation_set


def is_negative_case_pass(tc: dict, match_result: dict, config: dict) -> bool:
    """
    负向用例通过条件（三选一满足即可）：
    1. select_skill() 返回 below_threshold (skill=None)
    2. top1_score < min_confidence
    3. 返回了 disambiguation_needed 且用户未选择
    """
    if tc.get("expected_skill") is not None:
        return False  # 这不是负向用例

    thresholds = config.get("thresholds", DEFAULT_SCORING["thresholds"])

    # 条件 1: 返回 None
    if match_result.get("skill") is None:
        return True

    # 条件 2: 分数低于阈值
    if match_result.get("confidence", 0) < thresholds["min_confidence"]:
        return True

    # 条件 3: 需要消歧
    if match_result.get("method") == "disambiguation_needed":
        return True

    return False


def run_evaluation(test_cases: list, registry: dict, config: dict = None) -> EvalResult:
    """运行评测"""
    if config is None:
        config = DEFAULT_SCORING

    positive_cases = [tc for tc in test_cases if tc.get("expected_skill")]
    negative_cases = [tc for tc in test_cases if not tc.get("expected_skill")]

    top1_hits = 0
    top3_hits = 0
    true_negatives = 0
    false_positives = 0
    misses = []

    # 正向用例
    for tc in positive_cases:
        step = {
            "description": tc.get("step_description", ""),
            "domain_hints": tc.get("domain_hints", []),
            "name": tc.get("id", "")
        }

        try:
            from skill_matcher import two_stage_match, select_skill
            matches = two_stage_match(step, registry, config)
            match_result = select_skill(step, matches, config)

            top1 = match_result.skill if hasattr(match_result, 'skill') else matches[0].skill_name if matches else None
            top3 = [m.skill_name for m in matches[:3]] if matches else []
        except Exception:
            top1 = None
            top3 = []

        expected = tc.get("expected_skill")
        alternatives = tc.get("acceptable_alternatives", [])
        acceptable = [expected] + alternatives if expected else []

        # Top-1 命中
        if top1 in acceptable:
            top1_hits += 1

        # Top-3 命中
        if any(s in acceptable for s in top3):
            top3_hits += 1
        else:
            misses.append({
                "id": tc.get("id"),
                "expected": expected,
                "got": top3,
                "description": tc.get("step_description", "")[:50]
            })

    # 负向用例
    for tc in negative_cases:
        step = {
            "description": tc.get("step_description", ""),
            "domain_hints": tc.get("domain_hints", []),
            "name": tc.get("id", "")
        }

        try:
            from skill_matcher import two_stage_match, select_skill
            matches = two_stage_match(step, registry, config)
            match_result = select_skill(step, matches, config)
            result_dict = asdict(match_result) if hasattr(match_result, '__dataclass_fields__') else {
                "skill": match_result.skill,
                "confidence": match_result.confidence,
                "method": match_result.method
            }
        except Exception:
            result_dict = {"skill": None, "confidence": 0, "method": "error"}

        if is_negative_case_pass(tc, result_dict, config):
            true_negatives += 1
        else:
            false_positives += 1
            misses.append({
                "id": tc.get("id"),
                "expected": None,
                "got": result_dict.get("skill"),
                "description": tc.get("step_description", "")[:50],
                "type": "false_positive"
            })

    return EvalResult(
        total=len(test_cases),
        positive_cases=len(positive_cases),
        negative_cases=len(negative_cases),
        top1_hits=top1_hits,
        top3_hits=top3_hits,
        true_negatives=true_negatives,
        false_positives=false_positives,
        misses=misses[:10]  # 只保留前 10 个
    )


def print_report(result: EvalResult):
    """打印评测报告"""
    metrics = result.metrics

    print("=" * 60)
    print("Skill Matcher Evaluation Report")
    print("=" * 60)
    print(f"Total test cases: {result.total}")

    print(f"\nPositive Cases ({result.positive_cases}):")
    print(f"  Top-1 accuracy:   {metrics['top1_accuracy']:.1%} ({result.top1_hits}/{result.positive_cases})")
    print(f"  Top-3 accuracy:   {metrics['top3_accuracy']:.1%} ({result.top3_hits}/{result.positive_cases})")

    if result.negative_cases > 0:
        print(f"\nNegative Cases ({result.negative_cases}):")
        print(f"  True Negative Rate:  {metrics['true_negative_rate']:.1%} ({result.true_negatives}/{result.negative_cases})  ✓ 正确拒绝")
        print(f"  False Positive Rate: {metrics['false_positive_rate']:.1%} ({result.false_positives}/{result.negative_cases})  ⚠ 误匹配")

    print(f"\nOverall Accuracy: {metrics['overall_accuracy']:.1%}")

    if result.misses:
        print(f"\nMisses ({len(result.misses)} shown):")
        for miss in result.misses[:5]:
            miss_type = miss.get("type", "miss")
            if miss_type == "false_positive":
                print(f"  - {miss['id']}: should reject, got {miss['got']}")
            else:
                print(f"  - {miss['id']}: expected {miss['expected']}, got {miss['got']}")

    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="Generate evaluation sets and run matcher evaluation"
    )
    parser.add_argument("--generate", action="store_true", help="Generate evaluation set from skill.yaml examples")
    parser.add_argument("--run", nargs="?", const="auto", help="Run evaluation (optional: specify test file)")
    parser.add_argument("--output", type=str, default="test/auto_generated.yaml", help="Output path for generated set")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--threshold", type=float, default=0.8, help="Minimum Top-1 accuracy to pass")

    args = parser.parse_args()

    registry = load_registry()

    if args.generate:
        eval_set = generate_evaluation_set(registry, args.output)
        print(f"✓ Generated evaluation set: {args.output}")
        print(f"  Total: {eval_set['statistics']['total']}")
        print(f"  Positive: {eval_set['statistics']['positive']}")
        print(f"  Negative: {eval_set['statistics']['negative']}")
        sys.exit(0)

    if args.run:
        # 加载评测集
        if args.run == "auto":
            # 自动生成
            eval_set = generate_evaluation_set(registry, "/tmp/eval_temp.json")
            test_cases = eval_set.get("test_cases", [])
        else:
            # 从文件加载
            eval_file = Path(args.run)
            if not eval_file.exists():
                print(f"✗ Evaluation file not found: {args.run}")
                sys.exit(1)

            with open(eval_file, encoding="utf-8") as f:
                if eval_file.suffix == ".yaml" and HAS_YAML:
                    eval_set = yaml.safe_load(f)
                else:
                    eval_set = json.load(f)

            test_cases = eval_set.get("test_cases", [])

        if not test_cases:
            print("✗ No test cases found")
            sys.exit(1)

        # 运行评测
        result = run_evaluation(test_cases, registry)

        if args.json:
            output = {
                "total": result.total,
                "positive_cases": result.positive_cases,
                "negative_cases": result.negative_cases,
                "metrics": result.metrics,
                "misses": result.misses,
            }
            print(json.dumps(output, ensure_ascii=False, indent=2))
        else:
            print_report(result)

        # 检查阈值
        if result.metrics["top1_accuracy"] < args.threshold:
            sys.exit(1)

        sys.exit(0)

    parser.print_help()
    sys.exit(1)


if __name__ == "__main__":
    main()
