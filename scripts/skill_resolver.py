#!/usr/bin/env python3
"""
skill_resolver.py - Skill 自动解析与获取

核心模块：检测缺失 skill，协调搜索→审计→安装流程
实现业务需求到 skill 编排的完整闭环

Usage:
    python skill_resolver.py --check "brainstorming,content-writer,unknown-skill"
    python skill_resolver.py --resolve "brainstorming,content-writer,unknown-skill"
    python skill_resolver.py --resolve "skill-name" --auto
"""

import argparse
import json
import sys
import subprocess
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


@dataclass
class SkillCandidate:
    """远程 skill 候选"""
    name: str
    url: str
    source: str  # skillhub, skillsmp, github
    description: str = ""
    stars: int = 0
    updated: str = ""
    score: float = 0.0


@dataclass
class ResolveResult:
    """解析结果"""
    success: bool
    message: str
    available_skills: list = field(default_factory=list)
    missing_skills: list = field(default_factory=list)
    installed_skills: list = field(default_factory=list)
    warnings: list = field(default_factory=list)
    errors: list = field(default_factory=list)

    @property
    def has_missing(self) -> bool:
        return len(self.missing_skills) > 0


# 配置
SKILL_DIRS = [
    Path.home() / ".claude" / "skills",
    Path.cwd() / ".claude" / "skills",
]

CACHE_DIR = Path.home() / ".cache" / "reliable-workflow"
REGISTRY_FILE = CACHE_DIR / "skill-registry.json"


def load_config() -> dict:
    """加载解析器配置"""
    config_path = Path(__file__).parent.parent / "config" / "resolver.yaml"

    default_config = {
        "resolver": {
            "auto_install": True,
            "require_confirmation": False,
            "max_search_results": 5,
            "search_sources": [
                {"name": "skillhub", "url": "https://skillhub.club", "priority": 100},
                {"name": "skillsmp", "url": "https://skillsmp.com", "priority": 90},
                {"name": "github", "url": "https://github.com", "priority": 80},
            ],
            "audit": {
                "enabled": True,
                "block_on_warning": False,
                "risk_threshold": "medium",
            },
            "install": {
                "target_dir": str(Path.home() / ".claude" / "skills"),
                "backup_existing": True,
            }
        }
    }

    if config_path.exists() and HAS_YAML:
        try:
            with open(config_path, encoding="utf-8") as f:
                user_config = yaml.safe_load(f)
                if user_config:
                    # 深度合并
                    for key in user_config.get("resolver", {}):
                        default_config["resolver"][key] = user_config["resolver"][key]
        except Exception:
            pass

    return default_config


def load_registry() -> dict:
    """加载 skill 注册表"""
    if not REGISTRY_FILE.exists():
        # 尝试重建索引
        try:
            registry_script = Path(__file__).parent / "skill_registry.py"
            if registry_script.exists():
                subprocess.run(
                    [sys.executable, str(registry_script), "--scan"],
                    capture_output=True,
                    timeout=30
                )
        except Exception:
            pass

    if REGISTRY_FILE.exists():
        try:
            with open(REGISTRY_FILE, encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    return {"skills": []}


def check_local_exists(skill_name: str, registry: dict = None) -> Optional[str]:
    """
    检查 skill 是否存在于本地

    Returns:
        skill 路径 if exists, None otherwise
    """
    if registry is None:
        registry = load_registry()

    # 1. 从注册表查找
    for skill in registry.get("skills", []):
        if skill.get("name", "").lower() == skill_name.lower():
            path = skill.get("path", "")
            if path and Path(path).exists():
                return path

    # 2. 直接扫描目录
    for skill_dir in SKILL_DIRS:
        if not skill_dir.exists():
            continue

        # 精确匹配
        candidate = skill_dir / skill_name
        if candidate.exists() and (candidate / "SKILL.md").exists():
            return str(candidate)

        # 模糊匹配 (xxx-skill, skill-xxx)
        for subdir in skill_dir.iterdir():
            if not subdir.is_dir():
                continue
            name_lower = subdir.name.lower()
            skill_lower = skill_name.lower()
            if (name_lower == skill_lower or
                name_lower == f"{skill_lower}-skill" or
                name_lower == f"skill-{skill_lower}" or
                name_lower.replace("-", "") == skill_lower.replace("-", "")):
                if (subdir / "SKILL.md").exists():
                    return str(subdir)

    return None


def search_remote(skill_name: str, config: dict = None) -> list:
    """
    搜索远程 skill

    调用 remote_searcher.py 或直接使用 WebSearch
    """
    if config is None:
        config = load_config()

    candidates = []

    # 尝试调用 remote_searcher.py
    searcher_script = Path(__file__).parent / "remote_searcher.py"
    if searcher_script.exists():
        try:
            result = subprocess.run(
                [sys.executable, str(searcher_script), "--search", skill_name, "--json"],
                capture_output=True,
                text=True,
                timeout=60
            )
            if result.returncode == 0:
                data = json.loads(result.stdout)
                for item in data.get("results", []):
                    candidates.append(SkillCandidate(
                        name=item.get("name", skill_name),
                        url=item.get("url", ""),
                        source=item.get("source", "unknown"),
                        description=item.get("description", ""),
                        stars=item.get("stars", 0),
                        score=item.get("score", 0.0)
                    ))
        except Exception:
            pass

    # 如果没有结果，使用内置的 GitHub 搜索
    if not candidates:
        candidates = _search_github_fallback(skill_name)

    # 按分数排序
    candidates.sort(key=lambda x: x.score, reverse=True)

    max_results = config["resolver"].get("max_search_results", 5)
    return candidates[:max_results]


def _search_github_fallback(skill_name: str) -> list:
    """
    GitHub 搜索回退方案
    使用已知的 awesome-skills 仓库
    """
    candidates = []

    # 已知的 skill 仓库列表
    known_repos = [
        {
            "owner": "anthropics",
            "repo": "skills",
            "base_url": "https://github.com/anthropics/skills/tree/main/skills",
        },
        {
            "owner": "ComposioHQ",
            "repo": "awesome-claude-skills",
            "base_url": "https://github.com/ComposioHQ/awesome-claude-skills",
        },
        {
            "owner": "gked2121",
            "repo": "claude-skills",
            "base_url": "https://github.com/gked2121/claude-skills",
        },
        {
            "owner": "daymade",
            "repo": "claude-code-skills",
            "base_url": "https://github.com/daymade/claude-code-skills",
        },
    ]

    # 生成候选 URL
    skill_lower = skill_name.lower().replace("_", "-")

    for repo in known_repos:
        candidates.append(SkillCandidate(
            name=skill_name,
            url=f"{repo['base_url']}/{skill_lower}",
            source="github",
            description=f"From {repo['owner']}/{repo['repo']}",
            score=0.5  # 默认分数
        ))

    return candidates


def audit_skill(url: str, config: dict = None) -> dict:
    """
    安全审计

    调用 skill_auditor.py
    """
    if config is None:
        config = load_config()

    if not config["resolver"]["audit"].get("enabled", True):
        return {"safe": True, "risk_level": "skipped", "warnings": []}

    auditor_script = Path(__file__).parent / "skill_auditor.py"
    if auditor_script.exists():
        try:
            result = subprocess.run(
                [sys.executable, str(auditor_script), "--url", url, "--json"],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode == 0:
                return json.loads(result.stdout)
        except Exception:
            pass

    # 默认返回安全（如果审计模块不可用）
    return {"safe": True, "risk_level": "unknown", "warnings": ["审计模块不可用"]}


def download_and_install(url: str, config: dict = None) -> dict:
    """
    下载并安装 skill

    调用 downloader skill 的脚本
    """
    if config is None:
        config = load_config()

    target_dir = config["resolver"]["install"].get(
        "target_dir",
        str(Path.home() / ".claude" / "skills")
    )

    # 查找 downloader 脚本
    downloader_paths = [
        Path.home() / ".claude" / "skills" / "downloader" / "scripts" / "download_from_github.py",
        Path.home() / ".claude" / "skills" / "downloader" / "scripts" / "download_skill.py",
    ]

    downloader_script = None
    for path in downloader_paths:
        if path.exists():
            downloader_script = path
            break

    if not downloader_script:
        return {
            "success": False,
            "error": "downloader skill 未找到，请先安装 downloader skill"
        }

    try:
        # 解析 GitHub URL
        if "github.com" in url:
            # 格式: https://github.com/owner/repo/tree/main/path/to/skill
            parts = url.replace("https://github.com/", "").split("/")
            if len(parts) >= 2:
                owner = parts[0]
                repo = parts[1]
                skill_path = "/".join(parts[4:]) if len(parts) > 4 else ""

                repo_url = f"https://github.com/{owner}/{repo}"

                cmd = [
                    sys.executable,
                    str(downloader_script),
                    repo_url,
                    skill_path or ".",
                    "--output", target_dir
                ]

                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=120
                )

                if result.returncode == 0:
                    return {"success": True, "path": target_dir, "output": result.stdout}
                else:
                    return {"success": False, "error": result.stderr or result.stdout}

        return {"success": False, "error": f"不支持的 URL 格式: {url}"}

    except subprocess.TimeoutExpired:
        return {"success": False, "error": "下载超时"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def update_registry():
    """更新 skill 注册表"""
    registry_script = Path(__file__).parent / "skill_registry.py"
    if registry_script.exists():
        try:
            subprocess.run(
                [sys.executable, str(registry_script), "--scan"],
                capture_output=True,
                timeout=30
            )
        except Exception:
            pass


class SkillResolver:
    """Skill 解析器主类"""

    def __init__(self, config: dict = None):
        self.config = config or load_config()
        self.registry = load_registry()

    def check(self, skill_names: list) -> dict:
        """
        检查 skill 可用性

        Returns:
            {
                "available": ["skill1", "skill2"],
                "missing": ["skill3"]
            }
        """
        available = []
        missing = []

        for name in skill_names:
            name = name.strip()
            if not name:
                continue

            path = check_local_exists(name, self.registry)
            if path:
                available.append({"name": name, "path": path})
            else:
                missing.append(name)

        return {"available": available, "missing": missing}

    def resolve(self, skill_names: list, auto_install: bool = None) -> ResolveResult:
        """
        解析并获取 skill

        Args:
            skill_names: 需要的 skill 列表
            auto_install: 是否自动安装（覆盖配置）

        Returns:
            ResolveResult
        """
        if auto_install is None:
            auto_install = self.config["resolver"].get("auto_install", True)

        result = ResolveResult(
            success=True,
            message="",
            available_skills=[],
            missing_skills=[],
            installed_skills=[],
            warnings=[],
            errors=[]
        )

        # 1. 检查本地
        check_result = self.check(skill_names)
        result.available_skills = [s["name"] for s in check_result["available"]]

        if not check_result["missing"]:
            result.message = f"所有 {len(skill_names)} 个 skill 都可用"
            return result

        # 2. 处理缺失的 skill
        for skill_name in check_result["missing"]:
            print(f"🔍 搜索远程 skill: {skill_name}")

            # 搜索
            candidates = search_remote(skill_name, self.config)

            if not candidates:
                result.missing_skills.append(skill_name)
                result.warnings.append(f"未找到 skill: {skill_name}")
                continue

            # 选择候选
            selected = candidates[0]  # 默认选第一个
            print(f"   找到候选: {selected.name} ({selected.source})")

            if not auto_install:
                result.missing_skills.append(skill_name)
                result.warnings.append(f"需要手动安装: {skill_name} -> {selected.url}")
                continue

            # 安全审计
            print(f"   🔒 安全审计...")
            audit_result = audit_skill(selected.url, self.config)

            if not audit_result.get("safe", True):
                risk = audit_result.get("risk_level", "unknown")
                threshold = self.config["resolver"]["audit"].get("risk_threshold", "medium")

                if self._risk_exceeds_threshold(risk, threshold):
                    result.missing_skills.append(skill_name)
                    result.errors.append(f"安全风险过高: {skill_name} (风险级别: {risk})")
                    continue
                else:
                    result.warnings.extend(audit_result.get("warnings", []))

            # 下载安装
            print(f"   📦 下载安装...")
            install_result = download_and_install(selected.url, self.config)

            if install_result.get("success"):
                result.installed_skills.append(skill_name)
                result.available_skills.append(skill_name)
                print(f"   ✅ 安装成功: {skill_name}")
            else:
                result.missing_skills.append(skill_name)
                result.errors.append(f"安装失败: {skill_name} - {install_result.get('error', '未知错误')}")
                print(f"   ❌ 安装失败: {install_result.get('error', '未知错误')}")

        # 3. 更新注册表
        if result.installed_skills:
            update_registry()

        # 4. 生成结果消息
        if result.missing_skills:
            result.success = False
            result.message = f"部分 skill 不可用: {', '.join(result.missing_skills)}"
        else:
            result.message = f"所有 skill 已就绪 (新安装: {len(result.installed_skills)})"

        return result

    def _risk_exceeds_threshold(self, risk: str, threshold: str) -> bool:
        """检查风险是否超过阈值"""
        levels = {"low": 1, "medium": 2, "high": 3, "critical": 4}
        return levels.get(risk, 0) > levels.get(threshold, 2)


def main():
    parser = argparse.ArgumentParser(
        description="Skill 自动解析与获取"
    )
    parser.add_argument("--check", type=str, help="检查 skill 可用性 (逗号分隔)")
    parser.add_argument("--resolve", type=str, help="解析并获取 skill (逗号分隔)")
    parser.add_argument("--auto", action="store_true", help="自动安装缺失 skill")
    parser.add_argument("--json", action="store_true", help="JSON 输出")

    args = parser.parse_args()

    resolver = SkillResolver()

    if args.check:
        skills = [s.strip() for s in args.check.split(",")]
        result = resolver.check(skills)

        if args.json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            print(f"\n✅ 可用 ({len(result['available'])}):")
            for s in result["available"]:
                print(f"   • {s['name']} -> {s['path']}")

            if result["missing"]:
                print(f"\n❌ 缺失 ({len(result['missing'])}):")
                for s in result["missing"]:
                    print(f"   • {s}")

        sys.exit(0)

    if args.resolve:
        skills = [s.strip() for s in args.resolve.split(",")]
        result = resolver.resolve(skills, auto_install=args.auto)

        if args.json:
            print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
        else:
            print(f"\n{'✅' if result.success else '⚠️'} {result.message}")

            if result.installed_skills:
                print(f"\n📦 新安装:")
                for s in result.installed_skills:
                    print(f"   • {s}")

            if result.warnings:
                print(f"\n⚠️ 警告:")
                for w in result.warnings:
                    print(f"   • {w}")

            if result.errors:
                print(f"\n❌ 错误:")
                for e in result.errors:
                    print(f"   • {e}")

        sys.exit(0 if result.success else 1)

    parser.print_help()
    sys.exit(1)


if __name__ == "__main__":
    main()
