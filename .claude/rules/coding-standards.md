# 编码规范

## TypeScript

- strict mode 开启，零 `any`（用 `unknown` + 类型守卫）
- 路径别名：`@/*` → `./src/*`，`@/.source` → `./.source/index.ts`
- 优先 `interface` 而非 `type`（除非需要联合类型）
- 函数参数超过 3 个 → 用 options 对象
- 不用 `enum`，用 `as const` 对象

## React / Next.js

- App Router 模式，不用 Pages Router
- Server Components 优先，只在需要交互时用 `'use client'`
- 数据获取用 Server Components 或 Route Handlers，不用 `useEffect` + fetch
- 页面组件在 `src/app/[locale]/` 下，业务组件在 `src/shared/blocks/`
- 新增页面必须同时添加 en/zh 翻译 JSON 到 `src/config/locale/messages/`

## 样式

- Tailwind CSS v4 + shadcn/ui (new-york variant)
- 主题变量在 `src/config/style/theme-education.css`，不要硬编码颜色值
- CSS 类名前缀 `.edu-*`（教育学术风主题）
- 响应式：mobile-first（`sm:` → `md:` → `lg:`）

## 数据库 (Drizzle ORM)

- Schema 集中在 `src/config/db/schema.ts`
- Model 层在 `src/shared/models/`，每张表一个文件
- 主键：`text('id')` + 应用层 `getUuid()`，不用数据库 `uuid` 类型
- JSON 字段：`text` 类型 + `JSON.parse/stringify`，不用 `jsonb`
- 时间戳：不带 `withTimezone`
- 变更后：`pnpm db:generate` → `pnpm db:push`

## 导入顺序

1. React / Next.js
2. 第三方库
3. `@/config/`
4. `@/core/`
5. `@/shared/`
6. `@/extensions/`
7. 相对路径（同目录）

## 命名

- 文件/目录：kebab-case（`html-sanitizer.ts`）
- React 组件：PascalCase（`UpgViewer.tsx`）
- 函数/变量：camelCase
- 常量：UPPER_SNAKE_CASE
- 数据库表：camelCase（Drizzle 约定）

## API 路由

- AI 相关路由 maxDuration: 60s，其他 30s
- 统一响应格式：`src/shared/lib/resp.ts`
- AI 路由必须加 Redis 限流
- 积分流程：先调 AI → 成功后扣积分
