#!/bin/bash
set -euo pipefail

# ============================================================
# skill_router.sh - 统一入口 [P1-4 修复]
# 支持: --auto / --plan-only / --manual / --check-deps
# 失败时明确报错，不静默降级
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# ============================================================
# 参数解析
# ============================================================

MODE="auto"
PLAN_ONLY=false
USER_INPUT=""
SKIP_DEPS=false

usage() {
    cat << EOF
用法: skill_router.sh [选项] "用户输入"

选项:
  --auto        全自动模式 (默认): 分析意图 → 生成计划 → 执行
  --plan-only   仅生成计划，不执行
  --manual      手动模式: 使用现有 master-plan.yaml 执行
  --check-deps  仅检查依赖
  --skip-deps   跳过依赖检查
  --help        显示帮助

示例:
  skill_router.sh "帮我写一篇AI文章并配图发公众号"
  skill_router.sh --plan-only "实现用户登录功能"
  skill_router.sh --manual
EOF
}

while [[ $# -gt 0 ]]; do
    case $1 in
        --auto)
            MODE="auto"
            shift
            ;;
        --plan-only)
            PLAN_ONLY=true
            shift
            ;;
        --manual)
            MODE="manual"
            shift
            ;;
        --check-deps)
            exec "$SCRIPT_DIR/check_deps.sh"
            ;;
        --skip-deps)
            SKIP_DEPS=true
            shift
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        -*)
            log_error "未知选项: $1"
            usage
            exit 1
            ;;
        *)
            USER_INPUT="$1"
            shift
            ;;
    esac
done

# ============================================================
# Step 0: 依赖检查
# ============================================================

if [[ "$SKIP_DEPS" == false ]]; then
    log_info "检查依赖..."
    if ! "$SCRIPT_DIR/check_deps.sh"; then
        log_error "依赖检查失败，请先安装所需依赖"
        exit 1
    fi
fi

# ============================================================
# Step 1: 根据模式分流
# ============================================================

WORKFLOW_DIR=".claude/workflow"
PLAN_FILE="$WORKFLOW_DIR/master-plan.yaml"

mkdir -p "$WORKFLOW_DIR"

# ---- 手动模式 ----
if [[ "$MODE" == "manual" ]]; then
    log_info "手动模式: 使用现有计划"
    
    if [[ ! -f "$PLAN_FILE" ]]; then
        log_error "计划文件不存在: $PLAN_FILE"
        log_info "请先运行 --auto 或 --plan-only 生成计划"
        exit 1
    fi
    
    # 校验计划
    log_info "校验计划..."
    if ! python3 "$SCRIPT_DIR/plan_validator.py" "$PLAN_FILE"; then
        log_error "计划校验失败"
        exit 1
    fi
    
    # 执行
    "$SCRIPT_DIR/orchestrator.sh" --init
    "$SCRIPT_DIR/orchestrator.sh" --run
    exit 0
fi

# ---- 自动模式需要用户输入 ----
if [[ -z "$USER_INPUT" ]]; then
    log_error "自动模式需要用户输入"
    echo ""
    usage
    exit 1
fi

# ============================================================
# Step 2: 意图分析 [P1-4: 失败时明确报错]
# ============================================================

log_info "分析意图: \"$USER_INPUT\""

# 调用 skillforge --triage
TRIAGE_OUTPUT=""
TRIAGE_EXIT_CODE=0

# 尝试使用 skillforge
if command -v claude &>/dev/null; then
    TRIAGE_OUTPUT=$(claude --print --skill skillforge "SkillForge --triage: $USER_INPUT" 2>&1) || TRIAGE_EXIT_CODE=$?
else
    log_error "claude 命令不可用"
    log_info "请安装 Claude CLI 或使用 --manual 模式"
    exit 1
fi

if [[ $TRIAGE_EXIT_CODE -ne 0 ]]; then
    log_error "skillforge 意图分析失败"
    echo ""
    echo "错误详情:"
    echo "$TRIAGE_OUTPUT"
    echo ""
    log_info "建议:"
    echo "  1. 检查 skillforge skill 是否正常工作"
    echo "  2. 使用 --manual 模式手动创建计划"
    echo "  3. 直接运行: claude --skill skillforge \"SkillForge --triage: $USER_INPUT\""
    exit 1
fi

log_success "意图分析完成"

# ============================================================
# Step 3: 生成执行计划
# ============================================================

log_info "生成执行计划..."

# 将 triage 输出传递给 auto_planner
if ! python3 "$SCRIPT_DIR/auto_planner.py" "$USER_INPUT" "$TRIAGE_OUTPUT"; then
    log_error "计划生成失败"
    exit 1
fi

log_success "计划已保存: $PLAN_FILE"

# ============================================================
# Step 4: 校验计划
# ============================================================

log_info "校验计划..."

if ! python3 "$SCRIPT_DIR/plan_validator.py" "$PLAN_FILE"; then
    log_error "计划校验失败"
    log_info "请检查 $PLAN_FILE 并手动修复"
    exit 1
fi

# ============================================================
# Step 5: 执行 (除非 --plan-only)
# ============================================================

if [[ "$PLAN_ONLY" == true ]]; then
    echo ""
    log_success "计划已生成，跳过执行"
    echo ""
    echo "查看计划: cat $PLAN_FILE"
    echo "执行计划: $0 --manual"
    exit 0
fi

log_info "开始执行工作流..."

"$SCRIPT_DIR/orchestrator.sh" --init
"$SCRIPT_DIR/orchestrator.sh" --run

log_success "工作流执行完成！"
