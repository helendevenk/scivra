#!/usr/bin/env python3
"""
skill_auditor.py - Skill 安全审计模块

在下载安装 skill 之前进行安全检查，识别潜在风险

检查项:
1. 危险命令模式 (rm -rf, curl|bash, eval)
2. 敏感文件访问 (/etc/passwd, ~/.ssh)
3. 可疑网络请求
4. 代码注入风险

Usage:
    python skill_auditor.py --url "https://github.com/user/repo/skill-name"
    python skill_auditor.py --path "/path/to/skill"
    python skill_auditor.py --content "script content to check"
"""

import argparse
import json
import re
import sys
import subprocess
import tempfile
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse


@dataclass
class AuditWarning:
    """审计警告"""
    severity: str  # low, medium, high, critical
    category: str  # command, file_access, network, code_injection
    message: str
    location: str = ""
    line_number: int = 0


@dataclass
class AuditResult:
    """审计结果"""
    safe: bool
    risk_level: str  # low, medium, high, critical
    warnings: list = field(default_factory=list)
    checked_files: list = field(default_factory=list)
    summary: str = ""


# 危险模式定义
DANGEROUS_PATTERNS = {
    "critical": [
        # 系统破坏
        (r'rm\s+(-rf?|--recursive)\s+[/~]', "危险删除: rm -rf /"),
        (r'rm\s+-rf?\s+\$', "危险删除: rm -rf 变量"),
        (r'mkfs\s+', "磁盘格式化命令"),
        (r'dd\s+if=.*of=/dev/', "直接写入设备"),
        # 远程代码执行
        (r'curl\s+.*\|\s*(ba)?sh', "远程代码执行: curl | bash"),
        (r'wget\s+.*\|\s*(ba)?sh', "远程代码执行: wget | bash"),
        (r'curl\s+.*\|\s*python', "远程代码执行: curl | python"),
        # 反弹 shell
        (r'/dev/tcp/', "反弹 shell 模式"),
        (r'nc\s+-[e]', "Netcat 反弹 shell"),
        (r'bash\s+-i\s+>&', "Bash 反弹 shell"),
    ],
    "high": [
        # 敏感文件访问
        (r'[/~]\.ssh/', "SSH 密钥访问"),
        (r'/etc/passwd', "系统密码文件访问"),
        (r'/etc/shadow', "系统影子密码访问"),
        (r'\.env\b', "环境变量文件访问"),
        (r'credentials?\.json', "凭证文件访问"),
        (r'\.aws/credentials', "AWS 凭证访问"),
        # 动态执行
        (r'\beval\s*\(', "eval 动态执行"),
        (r'\bexec\s*\(', "exec 动态执行"),
        (r'subprocess\..*shell\s*=\s*True', "Shell 注入风险"),
        (r'os\.system\s*\(', "os.system 命令执行"),
        (r'__import__\s*\(', "动态导入"),
    ],
    "medium": [
        # 可疑操作
        (r'chmod\s+777', "危险权限设置: 777"),
        (r'chmod\s+\+s', "SUID 权限设置"),
        (r'sudo\s+', "需要 sudo 权限"),
        (r'--no-verify', "跳过验证"),
        (r'--force', "强制操作"),
        # 网络操作
        (r'socket\s*\(', "原始 socket 操作"),
        (r'requests?\.(get|post|put|delete)', "HTTP 请求 (需审查目标)"),
        (r'urllib', "URL 请求"),
    ],
    "low": [
        # 提醒级别
        (r'input\s*\(', "用户输入 (潜在注入)"),
        (r'open\s*\([^)]*[\'"]w', "文件写入操作"),
        (r'pickle\.load', "Pickle 反序列化 (潜在风险)"),
        (r'yaml\.load\s*\([^)]*\)', "YAML 加载 (使用 safe_load)"),
    ]
}

# 安全模式白名单
SAFE_PATTERNS = [
    r'# safe:',  # 明确标记为安全
    r'# audit-ignore',  # 审计忽略
]


class SkillAuditor:
    """Skill 安全审计器"""

    def __init__(self):
        self.warnings = []
        self.checked_files = []

    def audit_content(self, content: str, filename: str = "unknown") -> list:
        """
        审计代码内容

        Args:
            content: 代码内容
            filename: 文件名

        Returns:
            警告列表
        """
        warnings = []
        lines = content.split('\n')

        in_multiline_comment = False  # 跟踪 /* ... */ 或 """ ... """ 块
        multiline_end_token = None

        for line_num, line in enumerate(lines, 1):
            stripped = line.strip()

            # ── 多行注释状态机 ──────────────────────────────────────────
            if in_multiline_comment:
                if multiline_end_token and multiline_end_token in line:
                    in_multiline_comment = False
                    multiline_end_token = None
                continue  # 跳过注释块内的行

            # 进入 Python docstring: """ 或 '''
            for quote in ('"""', "'''"):
                if stripped.startswith(quote):
                    remainder = stripped[3:]
                    if quote not in remainder:  # 未在同一行结束
                        in_multiline_comment = True
                        multiline_end_token = quote
                    # 单行 docstring (开关在同一行) 直接跳过整行
                    continue

            # 进入 C/JS 风格块注释: /* ... */
            if '/*' in line:
                before_comment = line[:line.index('/*')]
                if '*/' not in line[line.index('/*'):]:
                    in_multiline_comment = True
                    multiline_end_token = '*/'
                # 只审计 /* 之前的部分（如有）
                line = before_comment

            # ── 单行注释跳过 ──────────────────────────────────────────
            stripped = line.strip()

            # 跳过白名单模式
            if any(re.search(p, line, re.IGNORECASE) for p in SAFE_PATTERNS):
                continue

            # 跳过纯注释行 (#, //)
            if stripped.startswith('#') or stripped.startswith('//'):
                continue

            # 去掉行内 # 注释（粗略：取第一个 # 之前的部分；不处理字符串中的 #）
            if ' #' in line:
                line = line[:line.index(' #')]

            # 检查危险模式
            for severity, patterns in DANGEROUS_PATTERNS.items():
                for pattern, message in patterns:
                    if re.search(pattern, line, re.IGNORECASE):
                        warnings.append(AuditWarning(
                            severity=severity,
                            category=self._categorize_pattern(pattern),
                            message=message,
                            location=filename,
                            line_number=line_num
                        ))

        return warnings

    def audit_file(self, file_path: Path) -> list:
        """审计单个文件"""
        if not file_path.exists():
            return []

        # 只审计代码文件
        code_extensions = {'.py', '.sh', '.bash', '.js', '.ts', '.rb', '.pl'}
        if file_path.suffix.lower() not in code_extensions:
            return []

        try:
            content = file_path.read_text(encoding='utf-8')
            self.checked_files.append(str(file_path))
            return self.audit_content(content, str(file_path))
        except Exception:
            return []

    def audit_directory(self, dir_path: Path) -> list:
        """审计目录下所有文件"""
        warnings = []

        if not dir_path.exists():
            return warnings

        # 递归扫描
        for file_path in dir_path.rglob('*'):
            if file_path.is_file():
                # 跳过隐藏文件和常见非代码目录
                if any(part.startswith('.') for part in file_path.parts):
                    continue
                if any(part in ['node_modules', '__pycache__', 'venv', '.git']
                       for part in file_path.parts):
                    continue

                warnings.extend(self.audit_file(file_path))

        return warnings

    def audit_url(self, url: str) -> AuditResult:
        """
        审计远程 URL 的 skill

        先尝试获取元数据，再进行深度审计
        """
        parsed = urlparse(url)

        if 'github.com' in parsed.netloc:
            return self._audit_github_url(url)
        else:
            # 其他 URL 暂时返回警告
            return AuditResult(
                safe=True,
                risk_level="unknown",
                warnings=[asdict(AuditWarning(
                    severity="medium",
                    category="unknown",
                    message=f"非 GitHub URL，无法进行深度审计: {url}"
                ))],
                summary="无法验证非 GitHub URL 的安全性"
            )

    def _audit_github_url(self, url: str) -> AuditResult:
        """审计 GitHub URL"""
        # 解析 GitHub URL
        # 格式: https://github.com/owner/repo/tree/branch/path
        parts = url.replace('https://github.com/', '').split('/')

        if len(parts) < 2:
            return AuditResult(
                safe=False,
                risk_level="high",
                warnings=[asdict(AuditWarning(
                    severity="high",
                    category="invalid",
                    message=f"无效的 GitHub URL: {url}"
                ))],
                summary="URL 格式无效"
            )

        owner = parts[0]
        repo = parts[1]

        # 检查仓库信誉（简化版）
        warnings = []

        # 已知可信仓库
        trusted_owners = ['anthropics', 'modelcontextprotocol', 'ComposioHQ']
        if owner in trusted_owners:
            return AuditResult(
                safe=True,
                risk_level="low",
                warnings=[],
                summary=f"来自可信来源: {owner}"
            )

        # 尝试获取 SKILL.md 内容进行审计
        try:
            skill_path = '/'.join(parts[4:]) if len(parts) > 4 else ''
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{skill_path}/SKILL.md"

            result = subprocess.run(
                ['curl', '-s', '-f', raw_url],
                capture_output=True,
                text=True,
                timeout=10
            )

            if result.returncode == 0:
                skill_warnings = self.audit_content(result.stdout, "SKILL.md")
                warnings.extend([asdict(w) for w in skill_warnings])
        except Exception:
            pass

        # 计算风险级别
        risk_level = self._calculate_risk_level(warnings)

        return AuditResult(
            safe=risk_level not in ['high', 'critical'],
            risk_level=risk_level,
            warnings=warnings,
            checked_files=self.checked_files,
            summary=f"审计完成: {len(warnings)} 个警告"
        )

    def audit_path(self, path: str) -> AuditResult:
        """审计本地路径"""
        path_obj = Path(path)

        if path_obj.is_file():
            warnings = [asdict(w) for w in self.audit_file(path_obj)]
        elif path_obj.is_dir():
            warnings = [asdict(w) for w in self.audit_directory(path_obj)]
        else:
            return AuditResult(
                safe=False,
                risk_level="high",
                warnings=[asdict(AuditWarning(
                    severity="high",
                    category="invalid",
                    message=f"路径不存在: {path}"
                ))],
                summary="路径无效"
            )

        risk_level = self._calculate_risk_level(warnings)

        return AuditResult(
            safe=risk_level not in ['high', 'critical'],
            risk_level=risk_level,
            warnings=warnings,
            checked_files=self.checked_files,
            summary=f"审计完成: 检查 {len(self.checked_files)} 个文件, {len(warnings)} 个警告"
        )

    def _categorize_pattern(self, pattern: str) -> str:
        """分类模式"""
        if any(k in pattern for k in ['rm', 'dd', 'mkfs', 'chmod']):
            return "command"
        if any(k in pattern for k in ['ssh', 'passwd', 'env', 'credentials']):
            return "file_access"
        if any(k in pattern for k in ['curl', 'wget', 'socket', 'request']):
            return "network"
        if any(k in pattern for k in ['eval', 'exec', 'import', 'system']):
            return "code_injection"
        return "other"

    def _calculate_risk_level(self, warnings: list) -> str:
        """计算整体风险级别（基于最高严重度）"""
        if not warnings:
            return "low"

        severity_scores = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        score_to_level = {4: "critical", 3: "high", 2: "medium", 1: "low"}
        max_score = 0

        for w in warnings:
            severity = w.get("severity", "low") if isinstance(w, dict) else w.severity
            max_score = max(max_score, severity_scores.get(severity, 0))

        return score_to_level.get(max_score, "low")


def main():
    parser = argparse.ArgumentParser(
        description="Skill 安全审计"
    )
    parser.add_argument("--url", type=str, help="审计远程 URL")
    parser.add_argument("--path", type=str, help="审计本地路径")
    parser.add_argument("--content", type=str, help="审计代码内容")
    parser.add_argument("--json", action="store_true", help="JSON 输出")

    args = parser.parse_args()

    auditor = SkillAuditor()

    if args.url:
        result = auditor.audit_url(args.url)
    elif args.path:
        result = auditor.audit_path(args.path)
    elif args.content:
        warnings = auditor.audit_content(args.content, "stdin")
        risk_level = auditor._calculate_risk_level(warnings)
        result = AuditResult(
            safe=risk_level not in ['high', 'critical'],
            risk_level=risk_level,
            warnings=[asdict(w) for w in warnings],
            summary=f"检查完成: {len(warnings)} 个警告"
        )
    else:
        parser.print_help()
        sys.exit(1)

    if args.json:
        print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
    else:
        icon = "✅" if result.safe else "⚠️"
        print(f"\n{icon} 安全审计结果")
        print(f"   风险级别: {result.risk_level}")
        print(f"   {result.summary}")

        if result.warnings:
            print(f"\n   警告 ({len(result.warnings)}):")
            for w in result.warnings[:10]:  # 最多显示10个
                severity = w.get("severity", "unknown")
                message = w.get("message", "")
                location = w.get("location", "")
                line = w.get("line_number", 0)

                icon = {"critical": "🔴", "high": "🟠", "medium": "🟡", "low": "🔵"}.get(severity, "⚪")
                print(f"   {icon} [{severity}] {message}")
                if location:
                    print(f"      @ {location}:{line}")

        if result.checked_files:
            print(f"\n   检查的文件 ({len(result.checked_files)}):")
            for f in result.checked_files[:5]:
                print(f"   • {f}")
            if len(result.checked_files) > 5:
                print(f"   • ... 还有 {len(result.checked_files) - 5} 个")

    sys.exit(0 if result.safe else 1)


if __name__ == "__main__":
    main()
