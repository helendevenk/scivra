#!/usr/bin/env python3
"""
Skill Registry 管理器 (Phase 2)

分离索引存储 + 增量更新。
轻量 JSON 索引快速加载，embedding 按需加载。

=====================================
【设计决策 #1】为什么需要 Skill 注册表？
=====================================
问题背景：
  - Skill 可能分布在多个目录（全局、项目、插件缓存）
  - 每次匹配都扫描文件系统太慢
  - 需要快速查找和搜索 Skill

解决方案：预构建索引
  - 扫描所有 Skill 目录，提取元数据
  - 保存为 JSON 索引文件
  - 匹配时只读索引，不扫描文件系统

索引内容：
  - name, description, tags, triggers
  - negative_triggers, quality_tier
  - file_hash（用于增量更新）

=====================================
【设计决策 #2】为什么需要优先级机制？
=====================================
问题背景：
  - 同名 Skill 可能存在于多个目录
  - 例如：全局有 "api-documenter"，项目也有 "api-documenter"
  - 需要决定使用哪个版本

解决方案：基于优先级的冲突解决
  - 每个 Skill 根目录有优先级（priority）
  - 项目级（120）> 全局级（100）> 插件缓存（80）
  - 同名 Skill 取优先级最高的

为什么项目级优先？
  - 项目可能需要定制版本的 Skill
  - 项目级覆盖全局是常见需求
  - 类似于 PATH 环境变量的覆盖机制

=====================================
【设计决策 #3】为什么要记录冲突？
=====================================
问题背景：
  - 用户可能不知道存在同名 Skill
  - 被覆盖的 Skill 可能是用户想要的
  - 需要透明地展示冲突情况

解决方案：冲突报告
  - 扫描时记录所有同名冲突
  - 保存 winner（生效的）和 losers（被覆盖的）
  - 提供 --conflicts 命令查看冲突

冲突报告内容：
  - 冲突的 Skill 名称
  - 生效的路径和优先级
  - 被覆盖的路径列表

=====================================
【设计决策 #4】为什么支持多种元数据格式？
=====================================
问题背景：
  - 不同 Skill 可能使用不同的元数据格式
  - skill.yaml（结构化）、skill.json、SKILL.md（frontmatter）
  - 需要兼容所有格式

解决方案：多格式加载
  - 优先级：skill.yaml > skill.json > SKILL.md
  - SKILL.md 从 frontmatter 提取元数据
  - 统一转换为内部格式

为什么 SKILL.md 优先级最低？
  - SKILL.md 的 frontmatter 信息可能不完整
  - skill.yaml/json 是专门的元数据文件，更可靠

Usage:
    python skill_registry.py --scan              # 扫描并更新索引
    python skill_registry.py --list              # 列出所有已索引 skill
    python skill_registry.py --search "API"      # 搜索 skill
    python skill_registry.py --conflicts         # 显示同名冲突
"""

import argparse
import json
import os
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

# 加载 common 共享类型
sys.path.insert(0, str(Path(__file__).parent))
from common import Result  # noqa: E402


@dataclass
class SkillConflict:
    """同名 Skill 冲突记录"""
    name: str
    winner: str
    winner_priority: int
    losers: list = field(default_factory=list)


# 默认配置
DEFAULT_CONFIG = {
    "registry": {
        "roots": [
            {"path": "${HOME}/.claude/skills", "priority": 100, "enabled": True},
            {"path": "${HOME}/.claude/plugins/cache", "priority": 80, "enabled": True},
            {"path": "${PROJECT_ROOT}/.claude/skills", "priority": 120, "enabled": True},
        ],
        "auto_discover": {
            "enabled": True,
            "patterns": ["**/SKILL.md", "**/skill.yaml"],
            "exclude": ["**/node_modules/**", "**/.git/**"],
        }
    }
}

CACHE_DIR = Path.home() / ".cache" / "reliable-workflow"
REGISTRY_FILE = CACHE_DIR / "skill-registry.json"
LAST_SCAN_FILE = CACHE_DIR / "last_scan.json"


def get_skill_roots(config: dict = None) -> list:
    """获取所有 skill 根目录（按优先级排序）"""
    if config is None:
        config = DEFAULT_CONFIG

    roots = []
    project_root = os.environ.get("PROJECT_ROOT", os.getcwd())

    for root_config in config["registry"]["roots"]:
        if not root_config.get("enabled", True):
            continue

        path_str = root_config["path"]
        path_str = path_str.replace("${HOME}", str(Path.home()))
        path_str = path_str.replace("${PROJECT_ROOT}", project_root)
        path = Path(path_str)

        if path.exists():
            roots.append((path, root_config.get("priority", 50)))

    # 按优先级排序（高优先级在前）
    roots.sort(key=lambda x: x[1], reverse=True)
    return roots


def load_skill_metadata(skill_dir: Path) -> Optional[dict]:
    """加载 skill 元数据"""
    # 优先读取 skill.yaml
    skill_yaml = skill_dir / "skill.yaml"
    skill_json = skill_dir / "skill.json"
    skill_md = skill_dir / "SKILL.md"

    if skill_yaml.exists() and HAS_YAML:
        try:
            with open(skill_yaml, encoding="utf-8") as f:
                data = yaml.safe_load(f)
                data["_source"] = "skill.yaml"
                data["_path"] = str(skill_dir)
                return data
        except Exception:
            pass

    if skill_json.exists():
        try:
            with open(skill_json, encoding="utf-8") as f:
                data = json.load(f)
                data["_source"] = "skill.json"
                data["_path"] = str(skill_dir)
                return data
        except Exception:
            pass

    if skill_md.exists():
        # 从 SKILL.md frontmatter 提取基本信息
        try:
            content = skill_md.read_text(encoding="utf-8")
            if content.startswith("---"):
                end = content.index("---", 3)
                frontmatter_text = content[3:end].strip()

                if HAS_YAML:
                    data = yaml.safe_load(frontmatter_text) or {}
                else:
                    data = {}
                    for line in frontmatter_text.split("\n"):
                        if ":" in line:
                            key, value = line.split(":", 1)
                            data[key.strip()] = value.strip().strip('"\'')

                data["_source"] = "SKILL.md"
                data["_path"] = str(skill_dir)
                data.setdefault("name", skill_dir.name)
                return data
        except Exception:
            pass

    return None


def hash_skill_files(skill_path: Path) -> str:
    """计算 skill 文件哈希"""
    import hashlib
    hasher = hashlib.md5()

    for file in sorted(skill_path.rglob("*")):
        if file.is_file() and not file.name.startswith("."):
            hasher.update(file.name.encode())
            hasher.update(str(file.stat().st_mtime).encode())

    return hasher.hexdigest()[:12]


def scan_all_skills_with_conflicts(config: dict = None) -> tuple:
    """扫描所有 skill，记录冲突（修正版：正确聚合）"""
    skills = []
    conflicts_dict: dict = {}  # name -> SkillConflict
    seen = {}  # name -> (skill, path, priority)

    for root, priority in get_skill_roots(config):
        for skill_dir in root.iterdir():
            if not skill_dir.is_dir():
                continue

            skill = load_skill_metadata(skill_dir)
            if not skill:
                continue

            name = skill.get("name", skill_dir.name)
            path = str(skill_dir)

            if name in seen:
                existing_skill, existing_path, existing_priority = seen[name]

                if priority > existing_priority:
                    # 新的优先级更高，替换 winner
                    if name in conflicts_dict:
                        conflicts_dict[name].losers.append(existing_path)
                        conflicts_dict[name].winner = path
                        conflicts_dict[name].winner_priority = priority
                    else:
                        conflicts_dict[name] = SkillConflict(
                            name=name,
                            winner=path,
                            winner_priority=priority,
                            losers=[existing_path]
                        )

                    seen[name] = (skill, path, priority)
                    skills = [s for s in skills if s.get("name") != name]
                    skills.append(skill)

                else:
                    # 现有的优先级更高，新的成为 loser
                    if name in conflicts_dict:
                        conflicts_dict[name].losers.append(path)
                    else:
                        conflicts_dict[name] = SkillConflict(
                            name=name,
                            winner=existing_path,
                            winner_priority=existing_priority,
                            losers=[path]
                        )
            else:
                seen[name] = (skill, path, priority)
                skills.append(skill)

    return skills, list(conflicts_dict.values())


def build_registry(config: dict = None) -> Result:
    """构建完整索引"""
    skills, conflicts = scan_all_skills_with_conflicts(config)

    # 构建索引
    registry = {
        "version": "2.1",
        "updated_at": datetime.now().isoformat(),
        "skills": [],
        "conflicts": [asdict(c) for c in conflicts],
        "statistics": {
            "total": len(skills),
            "with_manifest": 0,
            "with_frontmatter": 0,
            "minimal": 0,
        }
    }

    for skill in skills:
        source = skill.get("_source", "unknown")
        if source == "skill.yaml" or source == "skill.json":
            registry["statistics"]["with_manifest"] += 1
        elif source == "SKILL.md":
            registry["statistics"]["with_frontmatter"] += 1
        else:
            registry["statistics"]["minimal"] += 1

        # 构建索引条目
        entry = {
            "name": skill.get("name", "unknown"),
            "path": skill.get("_path", ""),
            "description": skill.get("description", "")[:200],
            "tags": skill.get("tags", [])[:10],
            "triggers": skill.get("triggers", [])[:10],
            "negative_triggers": skill.get("negative_triggers", [])[:5],
            "quality_tier": skill.get("metadata", {}).get("quality_tier", "draft"),
            "source": source,
            "file_hash": hash_skill_files(Path(skill.get("_path", ""))),
        }
        registry["skills"].append(entry)

    # 保存索引
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)

    # 保存扫描状态
    with open(LAST_SCAN_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "scanned_at": datetime.now().isoformat(),
            "skill_count": len(skills),
            "conflict_count": len(conflicts),
        }, f)

    return Result(
        success=True,
        message=f"Indexed {len(skills)} skills ({len(conflicts)} conflicts)",
        data=registry
    )


def load_registry() -> dict:
    """加载现有索引"""
    if not REGISTRY_FILE.exists():
        return {"skills": [], "conflicts": []}

    with open(REGISTRY_FILE, encoding="utf-8") as f:
        return json.load(f)


def search_skills(query: str, registry: dict = None) -> list:
    """简单搜索 skill"""
    if registry is None:
        registry = load_registry()

    query_lower = query.lower()
    results = []

    for skill in registry.get("skills", []):
        score = 0

        # 名称匹配
        if query_lower in skill.get("name", "").lower():
            score += 10

        # 描述匹配
        if query_lower in skill.get("description", "").lower():
            score += 5

        # 标签匹配
        for tag in skill.get("tags", []):
            if query_lower in tag.lower():
                score += 3

        # 触发词匹配
        for trigger in skill.get("triggers", []):
            if query_lower in trigger.lower():
                score += 8

        if score > 0:
            results.append({
                "name": skill["name"],
                "score": score,
                "description": skill.get("description", "")[:100],
                "path": skill.get("path", ""),
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:10]


def print_conflict_report(conflicts: list):
    """打印冲突报告"""
    if not conflicts:
        print("✓ No skill name conflicts found.")
        return

    print(f"\n⚠️ Skill 名称冲突报告 ({len(conflicts)} conflicts):")
    print("=" * 60)

    for c in conflicts:
        print(f"\n  名称: {c['name']}")
        print(f"  生效: {c['winner']} (优先级: {c['winner_priority']})")
        print(f"  被覆盖:")
        for loser in c['losers']:
            print(f"    - {loser}")

    print("\n提示: 如需使用被覆盖的版本，请调整优先级配置")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="Manage skill registry with conflict detection"
    )
    parser.add_argument("--scan", action="store_true", help="Scan and update registry")
    parser.add_argument("--list", action="store_true", help="List all indexed skills")
    parser.add_argument("--search", type=str, help="Search skills by keyword")
    parser.add_argument("--conflicts", action="store_true", help="Show name conflicts")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    if args.scan:
        result = build_registry()
        if args.json:
            print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
        else:
            print(f"{'✓' if result.success else '✗'} {result.message}")
            if result.data.get("conflicts"):
                print_conflict_report(result.data["conflicts"])
        sys.exit(0 if result.success else 1)

    if args.list:
        registry = load_registry()
        skills = registry.get("skills", [])

        if args.json:
            print(json.dumps(skills, ensure_ascii=False, indent=2))
        else:
            print(f"\n📦 Indexed Skills ({len(skills)} total):\n")
            for skill in skills:
                tier = skill.get("quality_tier", "draft")
                icon = {"verified": "✓", "community": "○", "draft": "·"}.get(tier, "·")
                print(f"  {icon} {skill['name']}")
                if skill.get("description"):
                    print(f"      {skill['description'][:60]}...")
        sys.exit(0)

    if args.search:
        results = search_skills(args.search)

        if args.json:
            print(json.dumps(results, ensure_ascii=False, indent=2))
        else:
            print(f"\n🔍 Search results for '{args.search}':\n")
            for r in results:
                print(f"  [{r['score']:2d}] {r['name']}")
                if r.get("description"):
                    print(f"       {r['description']}")
        sys.exit(0)

    if args.conflicts:
        registry = load_registry()
        conflicts = registry.get("conflicts", [])

        if args.json:
            print(json.dumps(conflicts, ensure_ascii=False, indent=2))
        else:
            print_conflict_report(conflicts)
        sys.exit(0)

    parser.print_help()
    sys.exit(1)


if __name__ == "__main__":
    main()
