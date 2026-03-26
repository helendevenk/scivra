#!/usr/bin/env python3
"""
resolve_refs.py - 解析步骤输入中的 $outputs 引用

从 workflow state 中解析 $outputs.step-001.field 格式的引用，
替换为实际的步骤输出值。

Usage:
    python resolve_refs.py '<json_inputs>' '<state_file>'
    echo '{"topic": "$outputs.step-001.result"}' | python resolve_refs.py - state.yaml
"""

import json
import sys
from pathlib import Path

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


def resolve(inputs: dict, state_file: str) -> dict:
    """解析输入中的 $outputs 引用"""
    state_path = Path(state_file)
    if not state_path.exists() or not HAS_YAML:
        return inputs

    with open(state_path, encoding="utf-8") as f:
        state = yaml.safe_load(f)

    if not state:
        return inputs

    for key, val in inputs.items():
        if isinstance(val, str) and val.startswith("$outputs."):
            parts = val.split(".")
            if len(parts) >= 3:
                ref_step = parts[1]
                for s in state.get("steps", []):
                    if s.get("id") == ref_step and "output" in s:
                        inputs[key] = s["output"]
                        break

    return inputs


def main():
    if len(sys.argv) < 3:
        print("Usage: resolve_refs.py '<json_inputs>' '<state_file>'", file=sys.stderr)
        sys.exit(1)

    inputs_str = sys.argv[1]
    state_file = sys.argv[2]

    try:
        inputs = json.loads(inputs_str)
    except json.JSONDecodeError:
        # 透传无效 JSON
        print(inputs_str)
        sys.exit(0)

    if inputs is None:
        print("{}")
        sys.exit(0)

    resolved = resolve(inputs, state_file)
    print(json.dumps(resolved, ensure_ascii=False))


if __name__ == "__main__":
    main()
