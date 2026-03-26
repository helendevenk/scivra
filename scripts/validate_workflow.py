#!/usr/bin/env python3
"""
Validate workflow plan and state files.

Usage:
    python validate_workflow.py master-plan.yaml
    python validate_workflow.py workflow.state.yaml --state

Exit codes:
    0  - Validation passed
    1  - General error
    10 - Validation failed
"""

import sys
import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml")
    sys.exit(1)


@dataclass
class Result:
    success: bool
    message: str
    errors: List[str]
    warnings: List[str]


def validate_plan(path: Path) -> Result:
    """Validate a master-plan.yaml file."""
    errors = []
    warnings = []

    try:
        with open(path) as f:
            plan = yaml.safe_load(f)
    except yaml.YAMLError as e:
        return Result(False, f"YAML parse error: {e}", [str(e)], [])
    except FileNotFoundError:
        return Result(False, f"File not found: {path}", [f"File not found: {path}"], [])

    # Check required fields
    if not plan:
        errors.append("Plan file is empty")
        return Result(False, "Plan file is empty", errors, warnings)

    if "steps" not in plan:
        errors.append("Missing 'steps' field")
    elif not isinstance(plan["steps"], list):
        errors.append("'steps' must be a list")
    elif len(plan["steps"]) == 0:
        errors.append("'steps' list is empty")
    else:
        step_ids = set()
        for i, step in enumerate(plan["steps"]):
            # Check required step fields
            if "id" not in step:
                errors.append(f"Step {i}: missing 'id' field")
            else:
                if step["id"] in step_ids:
                    errors.append(f"Step {i}: duplicate id '{step['id']}'")
                step_ids.add(step["id"])

            if "name" not in step:
                errors.append(f"Step {i}: missing 'name' field")

            if "description" not in step:
                warnings.append(f"Step {i}: missing 'description' field")

            # Check depends_on references
            if "depends_on" in step and step["depends_on"]:
                for dep in step["depends_on"]:
                    if dep not in step_ids:
                        # Check if it's defined later
                        later_ids = {s.get("id") for s in plan["steps"][i+1:]}
                        if dep not in later_ids:
                            errors.append(f"Step {step.get('id', i)}: depends on unknown step '{dep}'")

            # Check acceptance criteria
            if "acceptance" in step:
                for j, check in enumerate(step["acceptance"]):
                    if "type" not in check:
                        errors.append(f"Step {step.get('id', i)}: acceptance[{j}] missing 'type'")
                    elif check["type"] not in ["file_exists", "file_not_empty", "command", "json_field", "regex_match"]:
                        warnings.append(f"Step {step.get('id', i)}: unknown acceptance type '{check['type']}'")

    # Check metadata
    if "metadata" not in plan:
        warnings.append("Missing 'metadata' field (recommended)")

    success = len(errors) == 0
    message = "Plan validation passed" if success else f"Plan validation failed: {len(errors)} errors"

    return Result(success, message, errors, warnings)


def validate_state(path: Path) -> Result:
    """Validate a workflow.state.yaml file."""
    errors = []
    warnings = []

    try:
        with open(path) as f:
            state = yaml.safe_load(f)
    except yaml.YAMLError as e:
        return Result(False, f"YAML parse error: {e}", [str(e)], [])
    except FileNotFoundError:
        return Result(False, f"File not found: {path}", [f"File not found: {path}"], [])

    if not state:
        errors.append("State file is empty")
        return Result(False, "State file is empty", errors, warnings)

    # Check required fields
    required = ["workflow_id", "status", "total_steps", "completed_steps"]
    for field in required:
        if field not in state:
            errors.append(f"Missing required field: '{field}'")

    # Validate status
    valid_statuses = ["initialized", "running", "paused", "completed", "failed"]
    if "status" in state and state["status"] not in valid_statuses:
        errors.append(f"Invalid status: '{state['status']}' (must be one of {valid_statuses})")

    # Validate step counts
    if "total_steps" in state and "completed_steps" in state:
        if state["completed_steps"] > state["total_steps"]:
            errors.append(f"completed_steps ({state['completed_steps']}) > total_steps ({state['total_steps']})")

    success = len(errors) == 0
    message = "State validation passed" if success else f"State validation failed: {len(errors)} errors"

    return Result(success, message, errors, warnings)


def main():
    parser = argparse.ArgumentParser(description="Validate workflow files")
    parser.add_argument("file", type=Path, help="Path to YAML file to validate")
    parser.add_argument("--state", action="store_true", help="Validate as state file (default: plan file)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    if args.state:
        result = validate_state(args.file)
    else:
        result = validate_plan(args.file)

    if args.json:
        import json
        print(json.dumps({
            "success": result.success,
            "message": result.message,
            "errors": result.errors,
            "warnings": result.warnings
        }, indent=2))
    else:
        print(f"{'✓' if result.success else '✗'} {result.message}")

        if result.errors:
            print("\nErrors:")
            for error in result.errors:
                print(f"  ✗ {error}")

        if result.warnings:
            print("\nWarnings:")
            for warning in result.warnings:
                print(f"  ⚠ {warning}")

    sys.exit(0 if result.success else 10)


if __name__ == "__main__":
    main()
