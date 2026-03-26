#!/usr/bin/env python3
"""
Handoff 安全校验器 (Phase 6)

验证并清理 skill 链式执行的 handoff.json。
防止路径穿越、伪造，关键字段由 orchestrator 计算。

Usage:
    python validate_handoff.py --raw '{"step_id":"step-001",...}' --project-root /path --step-id step-001
    python validate_handoff.py --file handoff.json --project-root /path --step-id step-001
"""

import argparse
import json
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional


@dataclass
class Result:
    """Standard result pattern."""
    success: bool
    message: str
    data: dict = field(default_factory=dict)
    errors: list = field(default_factory=list)


@dataclass
class HandoffValidationResult:
    """Handoff 校验结果"""
    valid: bool
    errors: list = field(default_factory=list)
    sanitized: dict = field(default_factory=dict)


def validate_and_sanitize_handoff(
    raw_handoff: dict,
    project_root: Path,
    step_id: str
) -> HandoffValidationResult:
    """验证并清理 handoff.json"""
    errors = []

    # 1. 基础结构校验
    required_fields = ["step_id", "status", "summary", "artifacts"]
    for fld in required_fields:
        if fld not in raw_handoff:
            errors.append(f"缺少必填字段: {fld}")

    if errors:
        return HandoffValidationResult(valid=False, errors=errors, sanitized={})

    # 2. step_id 必须匹配
    if raw_handoff["step_id"] != step_id:
        errors.append(f"step_id 不匹配: 期望 {step_id}, 得到 {raw_handoff['step_id']}")

    # 3. artifacts 路径安全校验
    sanitized_artifacts = []
    for i, artifact in enumerate(raw_handoff.get("artifacts", [])):
        path = artifact.get("path", "")

        # 规则 3a: 必须是相对路径
        if path.startswith("/") or path.startswith("~"):
            errors.append(f"artifacts[{i}].path 必须是相对路径: {path}")
            continue

        # 规则 3b: 禁止 .. 路径穿越
        if ".." in path:
            errors.append(f"artifacts[{i}].path 禁止包含 '..': {path}")
            continue

        # 规则 3c: 解析后必须在项目根内
        resolved = (project_root / path).resolve()
        try:
            resolved.relative_to(project_root.resolve())
        except ValueError:
            errors.append(f"artifacts[{i}].path 路径穿越出项目根: {path}")
            continue

        # 规则 3d: 文件必须存在（可选，设为警告）
        if not resolved.exists():
            # 作为警告而非错误，因为文件可能稍后创建
            pass

        # 通过校验，添加到清理后的列表
        # 注意：size_bytes 由 orchestrator 重新计算，不信任 skill 输出
        size_bytes = 0
        if resolved.exists():
            size_bytes = resolved.stat().st_size

        sanitized_artifacts.append({
            "type": artifact.get("type", "file"),
            "path": path,
            "description": artifact.get("description", "")[:200],  # 限长
            "size_bytes": size_bytes  # orchestrator 计算！
        })

    # 4. summary 限长
    summary = raw_handoff.get("summary", "")[:200]

    # 5. next_prompt_hints 限条
    hints = raw_handoff.get("next_prompt_hints", [])[:5]
    hints = [str(h)[:100] for h in hints]  # 每条也限长

    # 6. 构建清理后的 handoff（关键字段由 orchestrator 填充）
    sanitized = {
        "$schema": "handoff-v1.0",
        "step_id": step_id,
        "skill_name": raw_handoff.get("skill_name", "unknown"),
        "status": raw_handoff.get("status", "completed"),
        "timestamp": datetime.now().isoformat(),  # orchestrator 生成！
        "artifacts": sanitized_artifacts,
        "summary": summary,
        "next_prompt_hints": hints,
        "context_for_next": raw_handoff.get("context_for_next", {}),
        "metrics": {
            # 这些由 orchestrator 计算，不信任 skill 输出
            "tokens_used": None,  # 从 API 响应获取
            "duration_seconds": None,  # orchestrator 计时
            "artifacts_count": len(sanitized_artifacts),
            "total_size_bytes": sum(a["size_bytes"] for a in sanitized_artifacts)
        }
    }

    return HandoffValidationResult(
        valid=len(errors) == 0,
        errors=errors,
        sanitized=sanitized
    )


def main():
    parser = argparse.ArgumentParser(
        description="Validate and sanitize handoff.json for skill chaining"
    )
    parser.add_argument("--raw", type=str, help="Raw JSON string to validate")
    parser.add_argument("--file", type=str, help="JSON file to validate")
    parser.add_argument("--project-root", type=str, required=True, help="Project root path")
    parser.add_argument("--step-id", type=str, required=True, help="Expected step ID")
    parser.add_argument("--output", type=str, help="Output file for sanitized handoff")

    args = parser.parse_args()

    # 读取输入
    if args.raw:
        try:
            raw_handoff = json.loads(args.raw)
        except json.JSONDecodeError as e:
            print(json.dumps({
                "valid": False,
                "errors": [f"Invalid JSON: {e}"]
            }))
            sys.exit(1)
    elif args.file:
        try:
            with open(args.file, encoding="utf-8") as f:
                raw_handoff = json.load(f)
        except Exception as e:
            print(json.dumps({
                "valid": False,
                "errors": [f"Failed to read file: {e}"]
            }))
            sys.exit(1)
    else:
        parser.print_help()
        sys.exit(1)

    # 校验
    project_root = Path(args.project_root).resolve()
    result = validate_and_sanitize_handoff(raw_handoff, project_root, args.step_id)

    # 输出
    output = asdict(result)

    if args.output and result.valid:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(result.sanitized, f, ensure_ascii=False, indent=2)
        output["output_file"] = args.output

    print(json.dumps(output, ensure_ascii=False, indent=2))
    sys.exit(0 if result.valid else 1)


if __name__ == "__main__":
    main()
