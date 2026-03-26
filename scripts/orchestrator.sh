#!/bin/bash
set -euo pipefail

# ============================================================
# orchestrator.sh - 工作流执行引擎 [P0-1]
# 支持: --init / --run / --resume / --status
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_DIR="$SKILL_DIR/config"

# 默认配置
WORKFLOW_DIR=".claude/workflow"
STATE_FILE="$WORKFLOW_DIR/workflow.state.yaml"
PLAN_FILE="$WORKFLOW_DIR/master-plan.yaml"
LOG_DIR="$WORKFLOW_DIR/logs"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============================================================
# 辅助函数
# ============================================================

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# 加载沙箱配置
load_sandbox_config() {
    local sandbox_file="$CONFIG_DIR/sandbox.yaml"
    if [[ -f "$sandbox_file" ]] && command -v yq &>/dev/null; then
        MAX_STEP_TIME=$(yq '.resources.max_step_time // 600' "$sandbox_file")
        MAX_RETRIES=$(yq '.resources.max_retries // 2' "$sandbox_file")
        ON_FAILURE=$(yq '.execution.on_failure // "stop"' "$sandbox_file")
    else
        MAX_STEP_TIME=600
        MAX_RETRIES=2
        ON_FAILURE="stop"
    fi
}

# 初始化工作流状态
init_state() {
    if [[ ! -f "$PLAN_FILE" ]]; then
        log_error "计划文件不存在: $PLAN_FILE"
        exit 1
    fi
    
    mkdir -p "$WORKFLOW_DIR" "$LOG_DIR"
    
    # 从 plan 生成初始状态
    local step_count
    step_count=$(yq '.steps | length' "$PLAN_FILE")
    
    cat > "$STATE_FILE" << EOF
# 工作流状态文件 (自动生成)
version: "1.0"
status: "initialized"
current_step: 0
total_steps: $step_count
started_at: "$(date -Iseconds)"
updated_at: "$(date -Iseconds)"

steps: []
EOF
    
    # 初始化每个步骤的状态
    for ((i=0; i<step_count; i++)); do
        local step_id
        step_id=$(yq ".steps[$i].id" "$PLAN_FILE")
        yq -i ".steps += [{\"id\": \"$step_id\", \"status\": \"pending\", \"retries\": 0}]" "$STATE_FILE"
    done
    
    log_success "工作流已初始化 ($step_count 步骤)"
}

# 获取当前步骤索引
get_current_step() {
    if [[ -f "$STATE_FILE" ]]; then
        yq '.current_step // 0' "$STATE_FILE"
    else
        echo 0
    fi
}

# 更新状态
update_state() {
    local step_idx="$1"
    local status="$2"
    local output="${3:-}"
    
    yq -i ".steps[$step_idx].status = \"$status\"" "$STATE_FILE"
    yq -i ".steps[$step_idx].completed_at = \"$(date -Iseconds)\"" "$STATE_FILE"
    yq -i ".updated_at = \"$(date -Iseconds)\"" "$STATE_FILE"
    
    if [[ -n "$output" ]]; then
        yq -i ".steps[$step_idx].output = \"$output\"" "$STATE_FILE"
    fi
}

# 解析 $ref 引用（独立脚本，避免 Bash 内嵌 Python）
resolve_refs() {
    local inputs_json="$1"
    local state_file="$2"
    python3 "$SCRIPT_DIR/resolve_refs.py" "$inputs_json" "$state_file"
}

# 执行单个步骤（while 循环重试，不递归）
execute_step() {
    local step_idx="$1"

    # 获取步骤信息
    local step_id skill timeout
    step_id=$(yq ".steps[$step_idx].id" "$PLAN_FILE")
    skill=$(yq ".steps[$step_idx].skill" "$PLAN_FILE")
    timeout=$(yq ".steps[$step_idx].timeout // $MAX_STEP_TIME" "$PLAN_FILE")

    log_info "执行步骤 [$step_id]: $skill"

    # 获取并解析输入参数（inputs 优先，fallback 到 description）
    local inputs resolved_inputs prompt
    inputs=$(yq -o=json ".steps[$step_idx].inputs" "$PLAN_FILE")
    resolved_inputs=$(resolve_refs "$inputs" "$STATE_FILE")
    prompt=$(echo "$resolved_inputs" | jq -r 'to_entries | map("\(.key): \(.value)") | join("\n")')
    if [[ -z "$prompt" || "$prompt" == "null" ]]; then
        prompt=$(yq -r ".steps[$step_idx].description" "$PLAN_FILE")
    fi

    # 记录日志
    local log_file="$LOG_DIR/${step_id}.log"
    echo "=== Step: $step_id ===" > "$log_file"
    echo "Skill: $skill" >> "$log_file"
    echo "Started: $(date)" >> "$log_file"
    echo "Inputs:" >> "$log_file"
    echo "$prompt" >> "$log_file"
    echo "---" >> "$log_file"

    # 批量更新状态为运行中（单次 yq 调用）
    local now
    now=$(date -Iseconds)
    yq -i "
        .steps[$step_idx].status = \"running\" |
        .steps[$step_idx].started_at = \"$now\" |
        .current_step = $step_idx |
        .status = \"running\"
    " "$STATE_FILE"

    # 重试循环（非递归）
    local retries=0
    while true; do
        local output exit_code=0
        # Skills 通过 /$skill 前缀在 -p 模式触发（CLI 无 --skill 选项）
        output=$(timeout "$timeout" claude -p "$(printf '/%s\n%s' "$skill" "$prompt")" 2>&1) || exit_code=$?

        echo "$output" >> "$log_file"

        if [[ $exit_code -eq 0 ]]; then
            update_state "$step_idx" "completed" "$output"
            log_success "步骤 [$step_id] 完成"
            return 0
        fi

        retries=$((retries + 1))
        if [[ $retries -ge $MAX_RETRIES ]]; then
            update_state "$step_idx" "failed" "$output"
            log_error "步骤 [$step_id] 失败 (已重试 $MAX_RETRIES 次)"
            return 1
        fi

        yq -i ".steps[$step_idx].retries = $retries" "$STATE_FILE"
        log_warn "步骤 [$step_id] 失败, 重试 $retries/$MAX_RETRIES"
        sleep 5
    done
}

# 运行工作流
run_workflow() {
    if [[ ! -f "$STATE_FILE" ]]; then
        log_error "状态文件不存在，请先执行 --init"
        exit 1
    fi
    
    load_sandbox_config
    
    local total_steps current_step
    total_steps=$(yq '.total_steps' "$STATE_FILE")
    current_step=$(get_current_step)
    
    log_info "开始执行工作流 (从步骤 $current_step 开始, 共 $total_steps 步)"
    
    yq -i ".status = \"running\"" "$STATE_FILE"
    
    for ((i=current_step; i<total_steps; i++)); do
        local step_status
        step_status=$(yq ".steps[$i].status" "$STATE_FILE")
        
        # 跳过已完成的步骤
        if [[ "$step_status" == "completed" ]]; then
            continue
        fi
        
        if ! execute_step "$i"; then
            if [[ "$ON_FAILURE" == "stop" ]]; then
                yq -i ".status = \"failed\"" "$STATE_FILE"
                log_error "工作流在步骤 $i 失败，已停止"
                exit 1
            fi
        fi
        
        # 更新当前步骤
        yq -i ".current_step = $((i + 1))" "$STATE_FILE"
    done
    
    yq -i ".status = \"completed\"" "$STATE_FILE"
    yq -i ".completed_at = \"$(date -Iseconds)\"" "$STATE_FILE"
    log_success "工作流执行完成！"
}

# 显示状态
show_status() {
    if [[ ! -f "$STATE_FILE" ]]; then
        log_warn "工作流未初始化"
        exit 0
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 工作流状态"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    local status current total
    status=$(yq '.status' "$STATE_FILE")
    current=$(yq '.current_step' "$STATE_FILE")
    total=$(yq '.total_steps' "$STATE_FILE")
    
    echo "状态: $status"
    echo "进度: $current / $total"
    echo ""
    echo "步骤详情:"
    
    for ((i=0; i<total; i++)); do
        local step_id step_status
        step_id=$(yq ".steps[$i].id" "$STATE_FILE")
        step_status=$(yq ".steps[$i].status" "$STATE_FILE")
        
        case "$step_status" in
            completed) echo -e "  ${GREEN}✓${NC} $step_id" ;;
            running)   echo -e "  ${BLUE}▶${NC} $step_id" ;;
            failed)    echo -e "  ${RED}✗${NC} $step_id" ;;
            *)         echo -e "  ${YELLOW}○${NC} $step_id" ;;
        esac
    done
    echo ""
}

# 清理状态（需确认）
clean_workflow() {
    if [[ ! -d "$WORKFLOW_DIR" ]]; then
        log_warn "工作流目录不存在: $WORKFLOW_DIR"
        return 0
    fi

    local file_count
    file_count=$(find "$WORKFLOW_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')

    echo -e "${YELLOW}⚠️  即将删除工作流目录: $WORKFLOW_DIR ($file_count 个文件)${NC}"
    read -r -p "确认删除? [y/N] " response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -rf "$WORKFLOW_DIR"
        log_success "工作流状态已清理"
    else
        log_info "取消清理"
    fi
}

# ============================================================
# 主入口
# ============================================================

usage() {
    cat << EOF
用法: orchestrator.sh [选项]

选项:
  --init      初始化工作流 (需要先有 master-plan.yaml)
  --run       执行工作流
  --resume    从断点继续执行 (等同于 --run)
  --status    显示当前状态
  --clean     清理工作流状态
  --help      显示帮助

示例:
  orchestrator.sh --init    # 初始化
  orchestrator.sh --run     # 执行
  orchestrator.sh --status  # 查看状态
EOF
}

case "${1:-}" in
    --init)
        init_state
        ;;
    --run|--resume)
        run_workflow
        ;;
    --status)
        show_status
        ;;
    --clean)
        clean_workflow
        ;;
    --help|-h)
        usage
        ;;
    *)
        usage
        exit 1
        ;;
esac
