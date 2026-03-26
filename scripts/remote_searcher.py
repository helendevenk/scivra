#!/usr/bin/env python3
"""
remote_searcher.py - 远程 Skill 搜索模块

封装 resource-scout 的搜索逻辑，支持多源搜索

搜索源:
1. skillhub.club (质量过滤)
2. skillsmp.com (数量最多 71000+)
3. GitHub awesome-lists
4. GitHub 直接搜索

Usage:
    python remote_searcher.py --search "content-writer"
    python remote_searcher.py --search "api documenter" --source github
    python remote_searcher.py --search "video" --json
"""

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional
from urllib.parse import quote_plus


@dataclass
class SearchResult:
    """搜索结果"""
    name: str
    url: str
    source: str
    description: str = ""
    stars: int = 0
    updated: str = ""
    score: float = 0.0
    author: str = ""


@dataclass
class SearchResponse:
    """搜索响应"""
    success: bool
    query: str
    results: list = field(default_factory=list)
    total: int = 0
    sources_checked: list = field(default_factory=list)
    errors: list = field(default_factory=list)


# 已知的高质量 Skill 仓库
KNOWN_SKILL_REPOS = [
    {
        "owner": "anthropics",
        "repo": "skills",
        "path": "skills",
        "priority": 100,
        "description": "Anthropic 官方 Skills",
        "skills": [
            "docx", "pdf", "pptx", "xlsx",
            "brand-guidelines", "canvas-design",
            "slack-gif-creator", "mcp-builder"
        ]
    },
    {
        "owner": "ComposioHQ",
        "repo": "awesome-claude-skills",
        "path": "",
        "priority": 90,
        "description": "社区精选 Skills 集合"
    },
    {
        "owner": "gked2121",
        "repo": "claude-skills",
        "path": "",
        "priority": 85,
        "description": "Workflow 思维 Skills"
    },
    {
        "owner": "daymade",
        "repo": "claude-code-skills",
        "path": "",
        "priority": 85,
        "description": "实用工具 Skills",
        "skills": ["twitter-reader", "fact-checker"]
    },
    {
        "owner": "Microck",
        "repo": "ordinary-claude-skills",
        "path": "",
        "priority": 80,
        "description": "超大 Skills 集合"
    },
    {
        "owner": "sickn33",
        "repo": "antigravity-awesome-skills",
        "path": "",
        "priority": 80,
        "description": "结构化 Skills"
    },
    {
        "owner": "alirezarezvani",
        "repo": "claude-skills",
        "path": "",
        "priority": 75,
        "description": "Content/Marketing Skills"
    },
    {
        "owner": "MadAppGang",
        "repo": "claude-code",
        "path": "skills",
        "priority": 75,
        "description": "SEO/Content Skills"
    },
]

# Skill 别名映射（常见的不同命名）
SKILL_ALIASES = {
    "content-writer": ["content-research-writer", "article-writer", "blog-writer"],
    "api-docs": ["api-documenter", "openapi-generator", "swagger-docs"],
    "code-review": ["code-reviewer", "pr-review", "review-code"],
    "test": ["testing", "test-driven-development", "tdd"],
    "video": ["video-skill", "video-processor", "video-maker"],
    "image": ["image-generator", "image-skill", "dalle-skill"],
    "ppt": ["pptx", "pptx-document", "presentation"],
    "doc": ["docx", "docx-document", "word"],
    "excel": ["xlsx", "xlsx-document", "spreadsheet"],
}


class RemoteSearcher:
    """远程 Skill 搜索器"""

    def __init__(self):
        self.errors = []

    def search(self, query: str, source: str = "all", max_results: int = 10) -> SearchResponse:
        """
        搜索 Skill

        Args:
            query: 搜索关键词
            source: 搜索源 (all, github, skillhub, skillsmp)
            max_results: 最大结果数

        Returns:
            SearchResponse
        """
        results = []
        sources_checked = []

        query_lower = query.lower().strip()

        # 1. 先从已知仓库精确匹配
        if source in ["all", "known"]:
            known_results = self._search_known_repos(query_lower)
            results.extend(known_results)
            sources_checked.append("known_repos")

        # 2. GitHub 搜索
        if source in ["all", "github"] and len(results) < max_results:
            github_results = self._search_github(query_lower)
            results.extend(github_results)
            sources_checked.append("github")

        # 3. 检查别名
        if not results:
            aliases = self._get_aliases(query_lower)
            for alias in aliases:
                alias_results = self._search_known_repos(alias)
                results.extend(alias_results)

        # 去重并排序
        seen_urls = set()
        unique_results = []
        for r in results:
            if r.url not in seen_urls:
                seen_urls.add(r.url)
                unique_results.append(r)

        unique_results.sort(key=lambda x: x.score, reverse=True)

        return SearchResponse(
            success=len(unique_results) > 0,
            query=query,
            results=[asdict(r) for r in unique_results[:max_results]],
            total=len(unique_results),
            sources_checked=sources_checked,
            errors=self.errors
        )

    def _search_known_repos(self, query: str) -> list:
        """从已知仓库搜索（仅精确匹配，不猜测）"""
        results = []

        for repo in KNOWN_SKILL_REPOS:
            # 仅从有预定义 skills 列表的仓库中精确匹配
            if "skills" in repo:
                for skill_name in repo["skills"]:
                    if self._matches(query, skill_name):
                        score = self._calculate_score(query, skill_name, repo["priority"])
                        url = self._build_url(repo, skill_name)
                        results.append(SearchResult(
                            name=skill_name,
                            url=url,
                            source="known_repo",
                            description=f"From {repo['owner']}/{repo['repo']}",
                            score=score,
                            author=repo["owner"]
                        ))

        return results

    def _search_github(self, query: str) -> list:
        """GitHub API 搜索（使用 gh api，支持认证，规避 60 req/hr 匿名限制）"""
        results = []

        search_query = f"{query} claude skill SKILL.md"
        encoded_query = quote_plus(search_query)

        try:
            # 优先使用 gh api（支持 OAuth token，速率限制 5000 req/hr）
            cmd = [
                "gh", "api",
                f"search/repositories?q={encoded_query}&sort=stars&per_page=5"
            ]

            result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)

            if result.returncode != 0:
                # gh 不可用或未登录，回退到匿名 curl
                cmd = [
                    "curl", "-s",
                    f"https://api.github.com/search/repositories?q={encoded_query}&sort=stars&per_page=5"
                ]
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)

            if result.returncode == 0:
                data = json.loads(result.stdout)

                for item in data.get("items", []):
                    results.append(SearchResult(
                        name=item.get("name", ""),
                        url=item.get("html_url", ""),
                        source="github_search",
                        description=item.get("description", "")[:200] if item.get("description") else "",
                        stars=item.get("stargazers_count", 0),
                        updated=item.get("updated_at", ""),
                        score=min(100, item.get("stargazers_count", 0) / 10 + 50),
                        author=item.get("owner", {}).get("login", "")
                    ))

        except subprocess.TimeoutExpired:
            self.errors.append("GitHub API 请求超时")
        except json.JSONDecodeError:
            self.errors.append("GitHub API 响应解析失败")
        except Exception as e:
            self.errors.append(f"GitHub 搜索失败: {str(e)}")

        return results

    def _matches(self, query: str, skill_name: str) -> bool:
        """检查是否匹配"""
        query = query.lower().replace("-", "").replace("_", "")
        skill = skill_name.lower().replace("-", "").replace("_", "")

        # 精确匹配
        if query == skill:
            return True

        # 包含匹配
        if query in skill or skill in query:
            return True

        # 单词匹配
        query_words = set(query.split())
        skill_words = set(skill_name.lower().replace("-", " ").replace("_", " ").split())
        if query_words & skill_words:
            return True

        return False

    def _get_aliases(self, query: str) -> list:
        """获取查询的别名"""
        aliases = []

        for key, values in SKILL_ALIASES.items():
            if query in key or key in query:
                aliases.extend(values)
            for v in values:
                if query in v or v in query:
                    aliases.append(key)
                    aliases.extend([x for x in values if x != v])

        return list(set(aliases))

    def _calculate_score(self, query: str, skill_name: str, base_priority: int) -> float:
        """计算匹配分数"""
        query = query.lower()
        skill = skill_name.lower()

        score = base_priority

        # 精确匹配加分
        if query == skill:
            score += 50
        elif query in skill:
            score += 30
        elif skill in query:
            score += 20

        return min(100, score)

    def _build_url(self, repo: dict, skill_name: str) -> str:
        """构建 skill URL"""
        base_path = repo.get("path", "")
        if base_path:
            return f"https://github.com/{repo['owner']}/{repo['repo']}/tree/main/{base_path}/{skill_name}"
        else:
            return f"https://github.com/{repo['owner']}/{repo['repo']}/tree/main/{skill_name}"


def main():
    parser = argparse.ArgumentParser(
        description="远程 Skill 搜索"
    )
    parser.add_argument("--search", type=str, required=True, help="搜索关键词")
    parser.add_argument("--source", type=str, default="all",
                        choices=["all", "github", "known"],
                        help="搜索源")
    parser.add_argument("--max", type=int, default=10, help="最大结果数")
    parser.add_argument("--json", action="store_true", help="JSON 输出")

    args = parser.parse_args()

    searcher = RemoteSearcher()
    response = searcher.search(args.search, source=args.source, max_results=args.max)

    if args.json:
        print(json.dumps(asdict(response), ensure_ascii=False, indent=2))
    else:
        print(f"\n🔍 搜索: \"{args.search}\"")
        print(f"   来源: {', '.join(response.sources_checked)}")
        print(f"   结果: {response.total} 个\n")

        if response.results:
            for i, r in enumerate(response.results, 1):
                stars = f"⭐{r['stars']}" if r.get('stars') else ""
                print(f"   {i}. {r['name']} {stars}")
                print(f"      {r['url']}")
                if r.get('description'):
                    print(f"      {r['description'][:60]}...")
                print()
        else:
            print("   未找到匹配的 Skill")

        if response.errors:
            print(f"   ⚠️ 错误:")
            for e in response.errors:
                print(f"      • {e}")

    sys.exit(0 if response.success else 1)


if __name__ == "__main__":
    main()
