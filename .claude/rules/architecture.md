# 架构约束

## 分层架构

```
app/          → 路由 + 页面（只做布局和数据编排）
shared/blocks → 业务组件（可组合 ui 组件）
shared/components/ui → shadcn/ui 原子组件（无业务逻辑）
shared/services → 服务层（AI/支付/存储）
shared/models → 数据访问层（每表一个文件）
shared/lib    → 工具函数 + 领域逻辑
config/       → 配置（schema/i18n/样式）
core/         → 基础设施（认证/合规/RBAC）
extensions/   → 可插拔第三方集成
themes/       → Landing 页面模板
```

## 依赖方向（严格单向）

```
app → shared → config
app → core
app → extensions（仅在 API route 中）
shared → config
shared ✗ core（不直接依赖，通过 app 层注入）
config ✗ shared（不反向依赖）
```

## 已确认的技术决策（不可推翻）

| 决策 | 原因 |
|------|------|
| UPG 用独立 OpenRouter 客户端 | AIProvider 接口围绕异步媒体设计，UPG 需同步 Chat Completions |
| 积分先调 AI 后扣 | UPG 同步流程，避免退还失败风险 |
| 匿名限流用 Redis | serverless 实例隔离，内存限流无效 |
| HTML 存 DB text（V0.1）| 减少早期依赖，V0.2 迁移到 R2 |
| UPG CDN 用 Three.js r134 | 稳定性优先，npm 用最新版 |
| UI 方向 edu-academic | 契合教育定位，np-two/np-three 已淘汰 |

## 模块边界

### UPG 领域（`shared/lib/upg/`）
- `generate-core.ts` — 生成核心，不直接操作数据库
- `system-prompt.ts` — System Prompt，400+ 行，修改需测试生成质量
- `html-sanitizer.ts` — HTML 安全过滤，iframe sandbox + CDN 白名单
- `quality-checker.ts` — 质量检查，改动需验证不误杀正常内容

### i18n
- 新增页面必须同时添加 en/zh 翻译
- 翻译文件在 `src/config/locale/messages/{en,zh}/`
- 路由前缀 as-needed（英文无前缀，中文 `/zh/...`）

### 组件层级
- `shared/components/ui/` 不允许引入业务逻辑
- `shared/blocks/` 按领域分目录，不跨领域引用
- `themes/default/blocks/` 只用于 Landing 页面
