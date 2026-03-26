#!/usr/bin/env python3
"""
capability_cache.py - Skill 能力缓存 [P1-2]
基于 mtime 智能刷新，避免重复解析 SKILL.md
"""

import json
import os
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional, List


class CapabilityCache:
    """
    Skill 能力缓存管理器
    
    特性:
    - 基于 mtime 自动失效
    - 按需解析，懒加载
    - 支持批量预热
    """
    
    def __init__(self, 
                 skills_dir: str = "~/.claude/skills",
                 cache_dir: str = "~/.claude/cache/capabilities"):
        self.skills_dir = Path(skills_dir).expanduser()
        self.cache_dir = Path(cache_dir).expanduser()
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # 内存缓存
        self._memory_cache: Dict[str, Dict[str, Any]] = {}
        
        # 缓存索引文件
        self._index_file = self.cache_dir / "index.json"
        self._index = self._load_index()
    
    def _load_index(self) -> Dict[str, Any]:
        """加载缓存索引"""
        if self._index_file.exists():
            try:
                with open(self._index_file, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                pass
        return {"version": "1.0", "entries": {}}
    
    def _save_index(self):
        """保存缓存索引"""
        with open(self._index_file, 'w') as f:
            json.dump(self._index, f, indent=2)
    
    def _get_skill_mtime(self, skill_name: str) -> Optional[float]:
        """获取 skill 的 SKILL.md 修改时间"""
        skill_file = self.skills_dir / skill_name / "SKILL.md"
        if skill_file.exists():
            return skill_file.stat().st_mtime
        return None
    
    def _get_cache_file(self, skill_name: str) -> Path:
        """获取缓存文件路径"""
        return self.cache_dir / f"{skill_name}.json"
    
    def _is_cache_valid(self, skill_name: str) -> bool:
        """检查缓存是否有效 (基于 mtime)"""
        entry = self._index.get("entries", {}).get(skill_name)
        if not entry:
            return False
        
        current_mtime = self._get_skill_mtime(skill_name)
        if current_mtime is None:
            return False
        
        cached_mtime = entry.get("mtime", 0)
        return current_mtime <= cached_mtime
    
    def _parse_skill_capabilities(self, skill_name: str) -> Dict[str, Any]:
        """
        解析 skill 能力
        
        调用 skill-capability-parser 或简单解析
        """
        skill_file = self.skills_dir / skill_name / "SKILL.md"
        
        if not skill_file.exists():
            return {"error": "SKILL.md not found"}
        
        # 简单解析 SKILL.md
        content = skill_file.read_text(encoding='utf-8')
        
        capabilities = {
            "name": skill_name,
            "file": str(skill_file),
            "mtime": self._get_skill_mtime(skill_name),
            "parsed_at": datetime.now().isoformat(),
            "capabilities": [],
            "triggers": [],
            "inputs": [],
            "outputs": []
        }
        
        # 提取能力描述
        lines = content.split('\n')
        in_capabilities = False
        in_triggers = False
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # 检测段落
            if '能力' in line or 'capabilities' in line_lower:
                in_capabilities = True
                in_triggers = False
            elif '触发' in line or 'trigger' in line_lower:
                in_capabilities = False
                in_triggers = True
            elif line.startswith('#'):
                in_capabilities = False
                in_triggers = False
            
            # 提取列表项
            if line.strip().startswith('- '):
                item = line.strip()[2:].strip()
                if in_capabilities:
                    capabilities["capabilities"].append(item)
                elif in_triggers:
                    capabilities["triggers"].append(item)
        
        return capabilities
    
    def get(self, skill_name: str, force_refresh: bool = False) -> Dict[str, Any]:
        """
        获取 skill 能力信息
        
        Args:
            skill_name: skill 名称
            force_refresh: 强制刷新缓存
        
        Returns:
            能力信息字典
        """
        # 1. 检查内存缓存
        if not force_refresh and skill_name in self._memory_cache:
            if self._is_cache_valid(skill_name):
                return self._memory_cache[skill_name]
        
        # 2. 检查文件缓存
        cache_file = self._get_cache_file(skill_name)
        if not force_refresh and self._is_cache_valid(skill_name) and cache_file.exists():
            try:
                with open(cache_file, 'r') as f:
                    data = json.load(f)
                self._memory_cache[skill_name] = data
                return data
            except json.JSONDecodeError:
                pass
        
        # 3. 重新解析
        data = self._parse_skill_capabilities(skill_name)
        
        # 4. 更新缓存
        with open(cache_file, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        self._memory_cache[skill_name] = data
        self._index["entries"][skill_name] = {
            "mtime": self._get_skill_mtime(skill_name),
            "cached_at": datetime.now().isoformat()
        }
        self._save_index()
        
        return data
    
    def get_all(self, force_refresh: bool = False) -> Dict[str, Dict[str, Any]]:
        """获取所有 skill 的能力信息"""
        result = {}
        
        if not self.skills_dir.exists():
            return result
        
        for skill_dir in self.skills_dir.iterdir():
            if skill_dir.is_dir() and (skill_dir / "SKILL.md").exists():
                skill_name = skill_dir.name
                result[skill_name] = self.get(skill_name, force_refresh)
        
        return result
    
    def warmup(self, skill_names: Optional[List[str]] = None):
        """
        预热缓存
        
        Args:
            skill_names: 要预热的 skill 列表，None 表示全部
        """
        if skill_names is None:
            self.get_all()
        else:
            for name in skill_names:
                self.get(name)
    
    def invalidate(self, skill_name: Optional[str] = None):
        """
        使缓存失效
        
        Args:
            skill_name: skill 名称，None 表示清除全部
        """
        if skill_name is None:
            # 清除全部
            self._memory_cache.clear()
            self._index["entries"] = {}
            self._save_index()
            
            for cache_file in self.cache_dir.glob("*.json"):
                if cache_file.name != "index.json":
                    cache_file.unlink()
        else:
            # 清除单个
            self._memory_cache.pop(skill_name, None)
            self._index["entries"].pop(skill_name, None)
            self._save_index()
            
            cache_file = self._get_cache_file(skill_name)
            if cache_file.exists():
                cache_file.unlink()
    
    def stats(self) -> Dict[str, Any]:
        """获取缓存统计信息"""
        entries = self._index.get("entries", {})
        
        valid_count = sum(1 for name in entries if self._is_cache_valid(name))
        stale_count = len(entries) - valid_count
        
        return {
            "total_cached": len(entries),
            "valid": valid_count,
            "stale": stale_count,
            "memory_cached": len(self._memory_cache),
            "cache_dir": str(self.cache_dir)
        }


def main():
    """命令行入口"""
    import sys
    
    cache = CapabilityCache()
    
    if len(sys.argv) < 2:
        print("用法:")
        print("  capability_cache.py get <skill>     获取 skill 能力")
        print("  capability_cache.py list            列出所有缓存")
        print("  capability_cache.py warmup          预热全部缓存")
        print("  capability_cache.py invalidate      清除全部缓存")
        print("  capability_cache.py stats           显示统计信息")
        sys.exit(0)
    
    cmd = sys.argv[1]
    
    if cmd == "get" and len(sys.argv) > 2:
        skill_name = sys.argv[2]
        data = cache.get(skill_name)
        print(json.dumps(data, indent=2, ensure_ascii=False))
    
    elif cmd == "list":
        all_data = cache.get_all()
        for name, data in all_data.items():
            caps = len(data.get("capabilities", []))
            print(f"  {name}: {caps} capabilities")
    
    elif cmd == "warmup":
        print("预热缓存...")
        cache.warmup()
        stats = cache.stats()
        print(f"✅ 已缓存 {stats['total_cached']} 个 skill")
    
    elif cmd == "invalidate":
        cache.invalidate()
        print("✅ 缓存已清除")
    
    elif cmd == "stats":
        stats = cache.stats()
        print(json.dumps(stats, indent=2))
    
    else:
        print(f"未知命令: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
