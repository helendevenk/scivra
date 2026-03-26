#!/usr/bin/env python3
"""
auto_planner.py - 自动计划生成器 [v2.0]

从 YAML 加载数据流规则，支持自动获取远程 skill

v2.0 新增:
- 集成 skill_resolver 自动解析缺失 skill
- 支持远程搜索、安全审计、自动安装
"""

import yaml
import json
import sys
import re
from pathlib import Path
from datetime import datetime


class DataFlowRules:
    """从 YAML 加载数据流规则"""
    
    def __init__(self, rules_file=None):
        self._rules = {}
        self._patterns = {}
        self._defaults = {}
        
        # 查找规则文件
        if rules_file is None:
            script_dir = Path(__file__).parent
            rules_file = script_dir.parent / "config" / "data-flow-rules.yaml"
        
        rules_path = Path(rules_file)
        if rules_path.exists():
            self._load_rules(rules_path)
    
    def _load_rules(self, rules_path):
        """加载规则文件"""
        with open(rules_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        # 加载规则映射
        for rule in data.get("rules", []):
            key = (rule["from"], rule["to"])
            self._rules[key] = rule["mapping"]
        
        # 加载预定义模式
        self._patterns = data.get("patterns", {})
        
        # 加载默认配置
        self._defaults = data.get("defaults", {})
    
    def get(self, from_skill, to_skill):
        """获取两个 skill 之间的数据流映射"""
        return self._rules.get((from_skill, to_skill))
    
    def get_pattern(self, pattern_name):
        """获取预定义工作流模式"""
        return self._patterns.get(pattern_name)
    
    def match_pattern(self, user_input):
        """根据用户输入匹配工作流模式"""
        user_input_lower = user_input.lower()
        
        for name, pattern in self._patterns.items():
            keywords = pattern.get("trigger_keywords", [])
            for kw in keywords:
                if kw in user_input_lower:
                    return name, pattern
        
        return None, None
    
    @property
    def defaults(self):
        return self._defaults


class AutoPlanner:
    """自动生成执行计划"""

    def __init__(self, auto_resolve: bool = True):
        self.rules = DataFlowRules()
        self.auto_resolve = auto_resolve
        self.warnings = []
        self.resolver = None

        # 延迟加载 resolver
        if auto_resolve:
            try:
                from skill_resolver import SkillResolver
                self.resolver = SkillResolver()
            except ImportError:
                self.warnings.append("skill_resolver 模块不可用，跳过自动获取功能")
    
    def parse_triage_output(self, triage_text):
        """
        解析 skillforge triage 输出
        支持 YAML 格式和自由文本格式
        """
        skills = []
        
        # 尝试解析 YAML
        try:
            data = yaml.safe_load(triage_text)
            if isinstance(data, dict):
                # 标准格式: recommended_skills 列表
                if "recommended_skills" in data:
                    for item in data["recommended_skills"]:
                        if isinstance(item, dict):
                            skills.append(item.get("skill") or item.get("name", ""))
                        elif isinstance(item, str):
                            skills.append(item)
                # 简化格式: skills 列表
                elif "skills" in data:
                    skills = data["skills"]
            elif isinstance(data, list):
                skills = [s if isinstance(s, str) else s.get("skill", "") for s in data]
        except yaml.YAMLError:
            pass
        
        # 如果 YAML 解析失败，尝试从文本提取
        if not skills:
            # 匹配 skill 名称模式 (xxx-xxx 或 xxx_xxx)
            pattern = r'[\w]+-[\w\-]+|[\w]+_[\w_]+'
            skills = re.findall(pattern, triage_text)
            # 过滤掉明显不是 skill 的内容
            skills = [s for s in skills if len(s) > 3 and not s.startswith('--')]
        
        return skills
    
    def generate(self, user_input, triage_output=None):
        """
        生成执行计划

        Args:
            user_input: 用户原始输入
            triage_output: skillforge triage 的输出 (可选)

        Returns:
            计划字典
        """
        skills = []

        # 1. 尝试从 triage 输出解析 skills
        if triage_output:
            skills = self.parse_triage_output(triage_output)

        # 2. 如果没有解析到，尝试匹配预定义模式
        if not skills:
            pattern_name, pattern = self.rules.match_pattern(user_input)
            if pattern:
                skills = pattern.get("skills", [])

        # 3. 如果还是没有，返回空计划
        if not skills:
            return {
                "metadata": {
                    "name": f"空计划: {user_input[:30]}...",
                    "created_at": datetime.now().isoformat(),
                    "dag_type": "linear",
                    "warning": "未能识别需要的 skills，请手动配置"
                },
                "steps": []
            }

        # [v2.0 新增] 4. 解析缺失 skill，自动获取
        if self.resolver:
            print("🔍 检查 skill 可用性...")
            resolve_result = self.resolver.resolve(skills, auto_install=self.auto_resolve)

            if resolve_result.warnings:
                self.warnings.extend(resolve_result.warnings)

            if resolve_result.installed_skills:
                print(f"📦 新安装 {len(resolve_result.installed_skills)} 个 skill")

            if resolve_result.missing_skills:
                print(f"⚠️  {len(resolve_result.missing_skills)} 个 skill 不可用: {', '.join(resolve_result.missing_skills)}")
                # 从列表中移除不可用的 skill
                skills = [s for s in skills if s not in resolve_result.missing_skills]

            if not skills:
                return {
                    "metadata": {
                        "name": f"计划失败: {user_input[:30]}...",
                        "created_at": datetime.now().isoformat(),
                        "dag_type": "linear",
                        "warning": "所有需要的 skill 都不可用",
                        "missing_skills": resolve_result.missing_skills,
                        "errors": resolve_result.errors
                    },
                    "steps": []
                }

        # 5. 构建步骤
        nodes = []
        defaults = self.rules.defaults
        
        for idx, skill in enumerate(skills):
            step_id = f"step-{idx+1:03d}"
            inputs = {}
            deps = []
            
            # 处理数据流
            if idx > 0:
                prev_skill = skills[idx - 1]
                rule = self.rules.get(prev_skill, skill)
                
                if rule:
                    # 使用规则定义的映射
                    prev_id = f"step-{idx:03d}"
                    inputs[rule["to_field"]] = f"$outputs.{prev_id}.{rule['from_field']}"
                    deps = [prev_id]
                else:
                    # 使用默认映射
                    fallback = defaults.get("fallback_mapping", {})
                    if fallback:
                        prev_id = f"step-{idx:03d}"
                        to_field = fallback.get("to_field", "input")
                        from_field = fallback.get("from_field", "output")
                        inputs[to_field] = f"$outputs.{prev_id}.{from_field}"
                        deps = [prev_id]
            
            # 第一个步骤的输入
            if idx == 0:
                first_field = defaults.get("first_step_input_field", "topic")
                inputs[first_field] = user_input
            
            nodes.append({
                "id": step_id,
                "skill": skill,
                "inputs": inputs,
                "depends_on": deps,
                "timeout": 300,
                "retries": 2
            })
        
        return {
            "metadata": {
                "name": f"自动编排: {user_input[:30]}...",
                "created_at": datetime.now().isoformat(),
                "dag_type": "linear",  # [P1-3] 明确声明
                "user_input": user_input,
                "skill_count": len(skills)
            },
            "steps": nodes
        }
    
    def save(self, plan, path=".claude/workflow/master-plan.yaml"):
        """保存计划到文件"""
        plan_path = Path(path)
        plan_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(plan_path, "w", encoding="utf-8") as f:
            yaml.dump(plan, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
        
        print(f"✅ 计划已保存: {path}")
        return plan_path


def main():
    """主入口"""
    if len(sys.argv) < 2:
        print("用法: auto_planner.py <用户输入> [triage输出]")
        sys.exit(1)
    
    user_input = sys.argv[1]
    triage_output = sys.argv[2] if len(sys.argv) > 2 else None
    
    planner = AutoPlanner()
    plan = planner.generate(user_input, triage_output)
    
    if not plan["steps"]:
        print("⚠️  警告: 未能生成有效计划")
        print("请检查输入或手动配置 master-plan.yaml")
    
    planner.save(plan)


if __name__ == "__main__":
    main()
