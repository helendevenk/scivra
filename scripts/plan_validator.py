#!/usr/bin/env python3
"""
plan_validator.py - 统一校验层 [CTO 新增建议]
验证 skill 存在、数据流完整、循环依赖检测
"""

import yaml
import sys
from pathlib import Path
from typing import List, Set, Dict, Any


class PlanValidator:
    """计划校验器"""
    
    def __init__(self, skills_dir="~/.claude/skills"):
        self.skills_dir = Path(skills_dir).expanduser()
        self.errors: List[str] = []
        self.warnings: List[str] = []
    
    def validate(self, plan_file: str) -> bool:
        """
        校验计划文件
        
        检查项:
        1. 文件格式是否正确
        2. Skill 是否存在
        3. 数据流引用是否有效
        4. 是否存在循环依赖
        
        Returns:
            True 如果校验通过，False 如果有错误
        """
        self.errors = []
        self.warnings = []
        
        # 读取计划文件
        plan_path = Path(plan_file)
        if not plan_path.exists():
            self.errors.append(f"计划文件不存在: {plan_file}")
            return self._report()
        
        try:
            with open(plan_path, 'r', encoding='utf-8') as f:
                plan = yaml.safe_load(f)
        except yaml.YAMLError as e:
            self.errors.append(f"YAML 解析错误: {e}")
            return self._report()
        
        if not plan:
            self.errors.append("计划文件为空")
            return self._report()
        
        # 获取步骤列表
        steps = plan.get("steps", [])
        if not steps:
            self.warnings.append("计划没有任何步骤")
            return self._report()
        
        # 校验元数据
        self._validate_metadata(plan.get("metadata", {}))
        
        # 收集所有步骤 ID
        step_ids: Set[str] = set()
        outputs: Set[str] = set()
        
        for idx, step in enumerate(steps):
            step_id = step.get("id", f"step-{idx}")
            skill = step.get("skill", "")
            
            # 检查 step_id 唯一性
            if step_id in step_ids:
                self.errors.append(f"重复的步骤 ID: {step_id}")
            step_ids.add(step_id)
            
            # 1. 验证 skill 存在
            self._validate_skill_exists(skill, step_id)
            
            # 2. 验证 $ref 引用
            self._validate_references(step, outputs, step_id)
            
            # 3. 验证依赖
            self._validate_dependencies(step, outputs, step_id)
            
            # 步骤完成后，其输出可用
            outputs.add(step_id)
        
        # 4. 检测循环依赖
        self._detect_cycles(steps)
        
        return self._report()
    
    def _validate_metadata(self, metadata: Dict[str, Any]):
        """验证元数据"""
        dag_type = metadata.get("dag_type")
        if dag_type and dag_type != "linear":
            self.warnings.append(f"DAG 类型 '{dag_type}' 目前仅支持 'linear'")
    
    def _validate_skill_exists(self, skill: str, step_id: str):
        """验证 skill 是否存在"""
        if not skill:
            self.errors.append(f"[{step_id}] 未指定 skill")
            return
        
        skill_path = self.skills_dir / skill / "SKILL.md"
        if not skill_path.exists():
            self.errors.append(f"[{step_id}] Skill 不存在: {skill}")
    
    def _validate_references(self, step: Dict, available_outputs: Set[str], step_id: str):
        """验证 $outputs 引用"""
        inputs = step.get("inputs", {})
        
        for key, val in inputs.items():
            if isinstance(val, str) and val.startswith("$outputs."):
                # 解析引用: $outputs.step-001.field
                parts = val.split(".")
                if len(parts) < 3:
                    self.errors.append(f"[{step_id}] 无效的引用格式: {val}")
                    continue
                
                ref_step = parts[1]
                if ref_step not in available_outputs:
                    self.errors.append(f"[{step_id}] 数据流断链: 引用了不存在的输出 '{val}'")
    
    def _validate_dependencies(self, step: Dict, available_outputs: Set[str], step_id: str):
        """验证 depends_on 依赖"""
        deps = step.get("depends_on", [])
        
        for dep in deps:
            if dep not in available_outputs:
                self.errors.append(f"[{step_id}] 依赖了不存在的步骤: {dep}")
    
    def _detect_cycles(self, steps: List[Dict]):
        """检测循环依赖"""
        # 构建依赖图
        graph: Dict[str, List[str]] = {}
        for step in steps:
            step_id = step.get("id", "")
            deps = step.get("depends_on", [])
            graph[step_id] = deps
        
        # DFS 检测环
        visited: Set[str] = set()
        rec_stack: Set[str] = set()
        
        def has_cycle(node: str) -> bool:
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    if has_cycle(neighbor):
                        return True
                elif neighbor in rec_stack:
                    self.errors.append(f"检测到循环依赖: {node} -> {neighbor}")
                    return True
            
            rec_stack.remove(node)
            return False
        
        for node in graph:
            if node not in visited:
                has_cycle(node)
    
    def _report(self) -> bool:
        """输出校验结果"""
        # 输出警告
        if self.warnings:
            print("⚠️  警告:")
            for w in self.warnings:
                print(f"  • {w}")
        
        # 输出错误
        if self.errors:
            print("❌ 校验失败:")
            for e in self.errors:
                print(f"  • {e}")
            return False
        
        step_count = len(self.warnings) == 0 and "✓" or ""
        print(f"✅ 校验通过")
        return True


def main():
    """主入口"""
    if len(sys.argv) < 2:
        print("用法: plan_validator.py <计划文件>")
        print("示例: plan_validator.py .claude/workflow/master-plan.yaml")
        sys.exit(1)
    
    plan_file = sys.argv[1]
    validator = PlanValidator()
    
    success = validator.validate(plan_file)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
