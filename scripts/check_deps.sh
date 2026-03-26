#!/bin/bash
set -euo pipefail

# ============================================================
# check_deps.sh - 依赖验证脚本 [P0-3]
# 验证 bianpai-skill 所需的系统工具和依赖 skill
# ============================================================

SKILLS_DIR="${HOME}/.claude/skills"
CONFIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../config" && pwd)"
ERRORS=()
WARNINGS=()

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo "🔍 验证 bianpai-skill 依赖..."
echo ""

# ============================================================
# 1. 系统工具检查
# ============================================================
echo "📦 检查系统工具..."

REQUIRED_TOOLS=(python3 jq)
OPTIONAL_TOOLS=(yq)

for tool in "${REQUIRED_TOOLS[@]}"; do
    if command -v "$tool" &>/dev/null; then
        echo -e "  ${GREEN}✓${NC} $tool"
    else
        ERRORS+=("❌ 缺失必需工具: $tool")
    fi
done

for tool in "${OPTIONAL_TOOLS[@]}"; do
    if command -v "$tool" &>/dev/null; then
        echo -e "  ${GREEN}✓${NC} $tool"
    else
        WARNINGS+=("⚠️  可选工具未安装: $tool (部分功能可能受限)")
    fi
done

# ============================================================
# 2. Python 模块检查
# ============================================================
echo ""
echo "🐍 检查 Python 模块..."

REQUIRED_MODULES=(yaml json pathlib)

for module in "${REQUIRED_MODULES[@]}"; do
    if python3 -c "import $module" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} $module"
    else
        ERRORS+=("❌ 缺失 Python 模块: $module")
    fi
done

# ============================================================
# 3. 依赖 Skill 检查
# ============================================================
echo ""
echo "🔧 检查依赖 Skill..."

REQUIRED_SKILLS=(skillforge skill-matcher skill-capability-parser)
OPTIONAL_SKILLS=(domain-classifier)

for skill in "${REQUIRED_SKILLS[@]}"; do
    if [[ -f "$SKILLS_DIR/$skill/SKILL.md" ]]; then
        echo -e "  ${GREEN}✓${NC} $skill"
    else
        ERRORS+=("❌ 缺失依赖 Skill: $skill")
    fi
done

for skill in "${OPTIONAL_SKILLS[@]}"; do
    if [[ -f "$SKILLS_DIR/$skill/SKILL.md" ]]; then
        echo -e "  ${GREEN}✓${NC} $skill"
    else
        WARNINGS+=("⚠️  可选 Skill 未安装: $skill")
    fi
done

# ============================================================
# 4. 配置文件检查
# ============================================================
echo ""
echo "📁 检查配置文件..."

CONFIG_FILES=(sandbox.yaml data-flow-rules.yaml)

for config in "${CONFIG_FILES[@]}"; do
    if [[ -f "$CONFIG_DIR/$config" ]]; then
        echo -e "  ${GREEN}✓${NC} $config"
    else
        WARNINGS+=("⚠️  配置文件缺失: $config (将使用默认值)")
    fi
done

# ============================================================
# 5. 输出结果
# ============================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 输出警告
if [[ ${#WARNINGS[@]} -gt 0 ]]; then
    echo -e "${YELLOW}警告:${NC}"
    for w in "${WARNINGS[@]}"; do
        echo "  $w"
    done
    echo ""
fi

# 输出错误并退出
if [[ ${#ERRORS[@]} -gt 0 ]]; then
    echo -e "${RED}错误:${NC}"
    for e in "${ERRORS[@]}"; do
        echo "  $e"
    done
    echo ""
    echo -e "${RED}❌ 依赖验证失败${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 依赖验证通过${NC}"
exit 0
