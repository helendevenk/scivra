#!/usr/bin/env python3
"""
Skill Manifest 标准化工具 (Phase 1)

从 SKILL.md 生成标准化 skill.yaml manifest。
支持降级策略：完整 yaml > frontmatter > 自然语言抽取。

Usage:
    python skill_manifest.py ~/.claude/skills/api-documenter/
    python skill_manifest.py --all
    python skill_manifest.py --validate ~/.claude/skills/api-documenter/skill.yaml
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional
import hashlib

# Try to import yaml, fallback to json output
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


@dataclass
class Result:
    """Standard result pattern for script outputs."""
    success: bool
    message: str
    data: dict = field(default_factory=dict)
    errors: list = field(default_factory=list)


@dataclass
class SkillManifest:
    """skill.yaml 标准结构"""
    name: str
    version: str = "1.0.0"
    description: str = ""
    tags: list = field(default_factory=list)
    triggers: list = field(default_factory=list)
    negative_triggers: list = field(default_factory=list)
    capabilities: list = field(default_factory=list)
    inputs: list = field(default_factory=list)
    outputs: list = field(default_factory=list)
    tools: list = field(default_factory=list)
    examples: list = field(default_factory=list)
    metadata: dict = field(default_factory=dict)


def hash_skill_files(skill_path: Path) -> str:
    """计算 skill 目录的文件哈希（用于增量更新）"""
    hasher = hashlib.md5()

    for file in sorted(skill_path.rglob("*")):
        if file.is_file() and not file.name.startswith("."):
            hasher.update(file.name.encode())
            hasher.update(str(file.stat().st_mtime).encode())

    return hasher.hexdigest()[:12]


def parse_frontmatter(content: str) -> dict:
    """解析 SKILL.md 的 YAML frontmatter"""
    if not content.startswith("---"):
        return {}

    try:
        end = content.index("---", 3)
        frontmatter_text = content[3:end].strip()

        if HAS_YAML:
            return yaml.safe_load(frontmatter_text) or {}
        else:
            # 简单解析（无 yaml 库时）
            result = {}
            for line in frontmatter_text.split("\n"):
                if ":" in line:
                    key, value = line.split(":", 1)
                    result[key.strip()] = value.strip().strip('"\'')
            return result
    except (ValueError, Exception):
        return {}


def extract_triggers_from_content(content: str) -> list:
    """从 SKILL.md 正文提取触发词"""
    triggers = []

    # 查找 Triggers 部分
    trigger_patterns = [
        r"##\s*Triggers?\s*\n(.*?)(?=\n##|\Z)",
        r"##\s*触发条件\s*\n(.*?)(?=\n##|\Z)",
        r"\*\*触发词\*\*[：:]\s*(.*?)(?=\n\n|\Z)",
    ]

    for pattern in trigger_patterns:
        match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
        if match:
            section = match.group(1)
            # 提取列表项
            for line in section.split("\n"):
                line = line.strip()
                if line.startswith("- ") or line.startswith("* "):
                    trigger = line[2:].strip().strip("`\"'")
                    if trigger and len(trigger) < 50:
                        triggers.append(trigger)

    return triggers[:10]  # 最多 10 个


def extract_tags_from_content(content: str, frontmatter: dict) -> list:
    """从 frontmatter 和正文提取标签"""
    tags = []

    # 从 frontmatter.metadata.domains 提取
    if "metadata" in frontmatter:
        domains = frontmatter["metadata"].get("domains", [])
        if isinstance(domains, list):
            tags.extend(domains)

    # 从 frontmatter.domains 提取
    if "domains" in frontmatter:
        domains = frontmatter["domains"]
        if isinstance(domains, list):
            tags.extend(domains)

    return list(set(tags))[:15]


def extract_examples_from_content(content: str) -> list:
    """从 SKILL.md 提取示例任务"""
    examples = []

    # 查找 Examples 或 Quick Start 部分
    example_patterns = [
        r"##\s*Examples?\s*\n(.*?)(?=\n##|\Z)",
        r"##\s*Quick Start\s*\n(.*?)(?=\n##|\Z)",
        r"##\s*使用示例\s*\n(.*?)(?=\n##|\Z)",
    ]

    for pattern in example_patterns:
        match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
        if match:
            section = match.group(1)
            # 提取代码块中的任务描述
            for code_match in re.finditer(r"`([^`]+)`", section):
                task = code_match.group(1).strip()
                if 5 < len(task) < 100:
                    examples.append({
                        "task": task,
                        "expected_match": True
                    })

    return examples[:5]


def generate_manifest(skill_path: Path) -> Result:
    """从 skill 目录生成 manifest"""
    skill_md = skill_path / "SKILL.md"

    if not skill_md.exists():
        return Result(
            success=False,
            message=f"SKILL.md not found in {skill_path}",
            errors=[f"Missing SKILL.md"]
        )

    content = skill_md.read_text(encoding="utf-8")
    frontmatter = parse_frontmatter(content)

    # 构建 manifest
    manifest = SkillManifest(
        name=frontmatter.get("name", skill_path.name),
        version=frontmatter.get("version", "1.0.0"),
        description=frontmatter.get("description", "")[:500],
        tags=extract_tags_from_content(content, frontmatter),
        triggers=extract_triggers_from_content(content),
        negative_triggers=[],  # 需要手动添加
        capabilities=[],
        examples=extract_examples_from_content(content),
        metadata={
            "author": frontmatter.get("metadata", {}).get("author", "unknown"),
            "created_at": datetime.now().strftime("%Y-%m-%d"),
            "quality_tier": "draft",  # draft | community | verified
            "source_path": str(skill_path),
            "file_hash": hash_skill_files(skill_path),
        }
    )

    return Result(
        success=True,
        message=f"Generated manifest for {manifest.name}",
        data=asdict(manifest)
    )


def validate_manifest(manifest_path: Path) -> Result:
    """验证 skill.yaml manifest"""
    if not manifest_path.exists():
        return Result(
            success=False,
            message=f"Manifest not found: {manifest_path}",
            errors=["File not found"]
        )

    try:
        content = manifest_path.read_text(encoding="utf-8")
        if HAS_YAML:
            data = yaml.safe_load(content)
        else:
            data = json.loads(content)
    except Exception as e:
        return Result(
            success=False,
            message=f"Failed to parse manifest",
            errors=[str(e)]
        )

    errors = []

    # 必填字段
    required = ["name", "description", "tags", "triggers"]
    for field in required:
        if field not in data or not data[field]:
            errors.append(f"Missing required field: {field}")

    # 字段格式
    if "name" in data and not re.match(r"^[a-z0-9-]+$", data["name"]):
        errors.append("name must be lowercase with hyphens only")

    if "triggers" in data and len(data["triggers"]) < 2:
        errors.append("At least 2 triggers required")

    if "examples" in data:
        for i, ex in enumerate(data["examples"]):
            if "task" not in ex:
                errors.append(f"examples[{i}] missing 'task' field")

    if errors:
        return Result(
            success=False,
            message=f"Validation failed with {len(errors)} errors",
            errors=errors
        )

    return Result(
        success=True,
        message="Manifest is valid",
        data=data
    )


def save_manifest(manifest_data: dict, skill_path: Path) -> Path:
    """保存 manifest 到 skill.yaml"""
    output_path = skill_path / "skill.yaml"

    if HAS_YAML:
        content = yaml.dump(manifest_data, allow_unicode=True, sort_keys=False)
    else:
        content = json.dumps(manifest_data, ensure_ascii=False, indent=2)
        output_path = skill_path / "skill.json"

    output_path.write_text(content, encoding="utf-8")
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate or validate skill.yaml manifests"
    )
    parser.add_argument(
        "path",
        nargs="?",
        help="Skill directory path or manifest file path"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Generate manifests for all skills in ~/.claude/skills/"
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Validate existing manifest"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output as JSON"
    )

    args = parser.parse_args()

    if args.all:
        skills_dir = Path.home() / ".claude" / "skills"
        results = []

        for skill_dir in skills_dir.iterdir():
            if skill_dir.is_dir() and (skill_dir / "SKILL.md").exists():
                result = generate_manifest(skill_dir)
                if result.success:
                    save_manifest(result.data, skill_dir)
                results.append({
                    "skill": skill_dir.name,
                    "success": result.success,
                    "message": result.message
                })

        print(json.dumps(results, ensure_ascii=False, indent=2))
        sys.exit(0)

    if not args.path:
        parser.print_help()
        sys.exit(1)

    path = Path(args.path).expanduser()

    if args.validate:
        result = validate_manifest(path)
    else:
        result = generate_manifest(path)
        if result.success and not args.json:
            output_path = save_manifest(result.data, path)
            result.message += f" → {output_path}"

    if args.json:
        print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
    else:
        print(f"{'✓' if result.success else '✗'} {result.message}")
        for error in result.errors:
            print(f"  - {error}")

    sys.exit(0 if result.success else 1)


if __name__ == "__main__":
    main()
