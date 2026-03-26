#!/usr/bin/env python3
"""
common.py - 共享数据类型

提供跨脚本共用的基础类型，避免重复定义。
"""

from dataclasses import dataclass, field


@dataclass
class Result:
    """Standard result pattern (shared across skill_matcher, skill_registry, etc.)"""
    success: bool
    message: str
    data: dict = field(default_factory=dict)
    errors: list = field(default_factory=list)
