# Scivra 产品、架构、合规与体验审计报告

日期：2026-04-30  
范围：代码、文档、公开页面、认证、支付、合规、UPG、实验库与 3D 表现。  
结论级别：工程审计，不构成法律意见；涉及 COPPA/FERPA/CCPA 的上线结论仍需要专业法律复核。

## 1. 执行摘要

Scivra 当前不是“不能跑”的状态：`pnpm build` 通过，`pnpm lint` 无 error，实验 URL 在本地服务启动后全量 200，公开 175 个 HTML 实验与 registry 映射一致。

但它还不能被描述为北美 K12 EdTech 生产就绪。主要问题集中在四类：

1. 合规闭环不完整：页面承诺 COPPA age-gating、数据导出/删除、每日 retention，但注册页、隐私 API、cron 配置没有形成真实闭环。
2. 支付链路不完整：Stripe 主路径相对完整；PayPal 订阅和 webhook 当前不能算通；webhook 失败返回 200 会吞掉支付重试机会。
3. UPG 与实验 iframe 安全边界偏弱：多处使用 `sandbox="allow-scripts allow-same-origin"` 渲染生成/实验 HTML，且主要防线是正则 sanitizer。
4. UI/UX 需要优化：移动端实验页横向溢出；首页/画廊 3D 预览在 headless Chromium 中 WebGL context 报错且无优雅降级；UPG UI 仍有紫粉渐变和非 physics preset，与当前品牌和学科启用状态不一致。

建议优先级：

- P0：补齐 COPPA 注册前 age gate/parent consent 路径、修复 Vercel cron 指向不存在路由、修复 PayPal/支付 webhook、收紧 iframe sandbox/CSP。
- P1：统一法律页与 footer/sitemap 链接、清理不准营销文案、修复 RBAC 过期角色判断、修复实验页移动端 overflow。
- P2：系统性提升实验可访问性、UPG 质量验证改为真实渲染校验、统一品牌视觉与学科状态。

## 2. 验证证据

运行过的命令：

```bash
pnpm lint
pnpm test
pnpm test tests/integration/experiment-urls.test.ts
pnpm build
npx -y chrome-devtools-mcp@latest --help
```

结果：

- `pnpm lint`：通过，0 error，762 warnings。主要是 `any`、hook deps、`img`/alt、unused eslint-disable 等技术债。
- `pnpm test`：140 个 test file 通过，1 个失败。失败原因是 `tests/integration/experiment-urls.test.ts` 需要 `localhost:3000`，当时 dev server 未启动。
- 启动/发现已有 `localhost:3000` 后重跑 `pnpm test tests/integration/experiment-urls.test.ts`：通过，所有 `/labs/{subject}/{standard}/{slug}` 返回 200。
- `pnpm build`：通过；有 Next.js `middleware` convention deprecated warning、baseline-browser-mapping 过期提示、edge runtime disables static generation 提示。
- Chrome DevTools MCP：当前 Codex 会话没有暴露可调用 MCP tool；已用 `npx -y chrome-devtools-mcp@latest --help` 验证包可安装/运行，但未写入项目依赖。实际页面体验使用 Playwright 完成。

浏览器体验产物：

- 桌面/移动截图与页面审计 JSON：`test-screenshots/audit-2026-04-30/`
- 覆盖页面：`/`、`/labs`、一个实验详情页、`/upg`、`/sign-in`、`/sign-up`、`/pricing`、`/gallery`、`/privacy`、`/privacy-policy`、`/terms`、`/terms-of-service`、`/children-privacy`、`/cookie-policy`

## 3. 架构与实现错误

### P0：Vercel cron 指向不存在的 API

证据：

- `vercel.json:36-40` 配置了 `/api/cron/data-retention`
- `src/app/api/cron` 当前不存在
- `ARCHITECTURE.md` / `AGENTS.md` 也确认当前未实现 cron route

影响：

- retention 任务在生产会 404，隐私页中“每日清理过期数据”的承诺无法兑现。
- 对 COPPA/CCPA/GDPR 风险尤其敏感，因为 retention 是合规控制的一部分。

建议：

- 新增 `src/app/api/cron/data-retention/route.ts`，调用 `processDataRetention(...)`，并加入鉴权（Vercel Cron secret 或内部 token）。
- 或者删除 `vercel.json` cron，并同步删除公开页面中每日 retention 的承诺。

### P1：RBAC 过期角色判断有逻辑错误

证据：`src/shared/services/rbac.ts:215-238`

当前条件使用：

```ts
isNull(userRole.expiresAt) || gt(userRole.expiresAt, now)
```

`isNull(...)` 返回 SQL 表达式对象，在 JS 里是真值，`||` 会短路，`gt(...)` 永远不会进入 Drizzle SQL 条件。结果是：

- 永不过期角色可以查到。
- 有未来 `expiresAt` 的临时角色会被错误排除。

建议改成 Drizzle 的 `or(isNull(...), gt(...))`，并补一个 “future expiresAt role remains active” 测试。

### P1：core/shared 依赖边界被打破

证据：`src/core/auth/index.ts:1-14`

`core/auth` import 了 `@/shared/models/config`。这违反了项目架构约定中 core 不依赖 shared 的方向。当前能运行，但长期会造成基础设施层和业务模型互相缠住，测试/迁移时风险变高。

建议：

- 把 config 读取抽到 core 可依赖的 adapter，或由 app/server 入口注入 auth config。
- 短期可以先登记 tech debt，不建议在本轮做大重构。

### P1：Redis 缺失时 UPG 限流/锁会直接失败

证据：`src/shared/lib/redis/client.ts:6-15`、`src/app/api/upg/generate/route.ts:64-101`

`getRedis()` 在缺少 Upstash env 时直接 throw。UPG API 会在 rate limit / lock 阶段失败。项目文档把 Redis 列为必需 env，这不算 bug；但体验上应在启动健康检查或后台配置里提前暴露，而不是用户生成时才失败。

建议：

- production 保持 fail-closed。
- dev/test 提供明确诊断页或 health check。
- UPG UI 遇到 Redis 配置错误时显示 “service temporarily unavailable”，不要直接吐内部错误。

## 4. UI/UX 评估

结论：需要优化。不是重做，而是修正几处影响信任和移动端体验的问题。

### P0/P1：移动端实验页横向溢出

Playwright mobile 390px 结果：

- `/labs/physics/ap-physics-1/simple-harmonic-motion`
- `documentElement.clientWidth = 390`
- `documentElement.scrollWidth = 598`

主要溢出元素：

- header/container 计算宽度达到 598px
- stage progress nav 在移动端横向内容撑开

影响：

- 北美学校设备有大量 Chromebook/手机小屏预览场景，横向滚动会明显降低可信度。

建议：

- 移动端 stage progress 用真正的 horizontal scroller 包装，父容器 `min-w-0`，内部 `w-max`，外层 `overflow-x-auto`。
- 检查 header `.container` 在实验页布局中的 max/min width。

### P1：首页/画廊 3D 预览缺少 WebGL 降级

Playwright headless Chromium 结果：

- `/` 和 `/gallery` 抛 `THREE.WebGLRenderer: Error creating WebGL context.`
- 同时出现 page error：`Error creating WebGL context.`

这个环境不等同真实用户浏览器，但它证明当前 3D 预览没有错误边界/非 WebGL fallback。

建议：

- 3D hero/gallery preview 加 WebGL capability check。
- 加错误边界，失败时渲染静态实验截图或轻量 CSS/canvas fallback。
- R3F Canvas 设置合理 `dpr`、`performance`、`fallback`，避免低端学校设备黑屏。

### P1：UPG 视觉和品牌不一致

证据：`src/shared/blocks/upg/UpgGenerator.tsx:304-351`、`:397`、`:526`

UPG generator 仍大量使用 purple/pink/orange gradient。项目 brand spec 与 AGENTS 指向 edu-academic / teal 主色，且明确避免常见紫粉 AI SaaS 视觉。

建议：

- 改为 teal/gold/graph-paper 风格，强化“科学工具”而不是“AI 玩具”。
- 进度条、CTA、匿名保存浮层统一到 brand tokens。

### P1：UPG preset 和启用学科不一致

证据：`src/shared/blocks/upg/UpgGenerator.tsx:40-47`

当前 UPG discipline 只有 physics enabled，但 preset 包含：

- Molecular Orbital Theory
- DNA Double Helix Structure
- Turbocharger

这会让用户以为 chemistry/biology/engineering 已支持，实际 API 会以 `discipline = physics` 生成和校验。

建议：

- 只显示与 enabled discipline 匹配的 preset。
- disabled disciplines 的示例移到 “coming soon” 区，不可直接填入生成框。

### P2：UPG 匿名生成后的 report 按钮无反馈

证据：`src/shared/blocks/upg/UpgGenerator.tsx:245-259`、`:507-510`

`handleReport` 对匿名用户直接 return，但按钮仍可见。匿名用户点击没有任何反馈。

建议：

- 匿名结果隐藏 report，或点击后打开 sign-in/sign-up modal。

## 5. 北美合规与公开页面检查

参考来源：

- FTC COPPA 六步合规计划：<https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business>
- FTC COPPA FAQ：<https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions>
- FTC Edmodo enforcement：<https://www.ftc.gov/news-events/news/press-releases/2023/05/ftc-says-ed-tech-provider-edmodo-unlawfully-used-childrens-personal-information-advertising>
- U.S. Department of Education Student Privacy FAQ：<https://studentprivacy.ed.gov/frequently-asked-questions>
- California CCPA page：<https://www.oag.ca.gov/privacy/ccpa>
- California privacy rights overview：<https://privacy.ca.gov/california-privacy-rights/rights-under-the-california-consumer-privacy-act/>
- W3C WCAG 2.2：<https://www.w3.org/TR/wcag/>
- MDN CSP sandbox：<https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/sandbox>

### P0：COPPA age-gating 没有接入注册流程

证据：

- `src/app/api/compliance/age-gate/route.ts:11-30` 有 API。
- `src/core/compliance/service.ts:84-107` 有 `allowSignup: input.ageGroup !== 'u13'`。
- `src/shared/blocks/sign/sign-up.tsx:80-181` 注册表单只有 name/email/password，没有 age gate、parent consent、terms/privacy consent。

风险：

- 项目面向 K12，页面明确写 COPPA compliant。
- FTC 指引要求 covered service 在收集 13 岁以下儿童个人信息前取得可验证家长同意。
- 仅有 API 但未接入注册前路径，不能算 age-gating 已落地。

建议：

1. 注册前先问 age band，不收集 name/email 前完成判断。
2. `u13`：阻断直接注册，进入 parent/teacher mediated consent 路径。
3. `13_17`：记录 teen consent/notice，限制广告/分享。
4. `18_plus`：正常注册，记录 terms/privacy consent。
5. social login 也必须走相同 gating，不能绕过。

### P0：隐私导出/删除只是建 request，没有处理闭环

证据：

- `src/app/api/privacy/export/route.ts:7-21`
- `src/app/api/privacy/delete/route.ts:7-21`
- `src/core/compliance/service.ts:140-168`

当前只创建 `privacyRequest`，没有生成导出包、没有删除执行器、没有用户通知、没有后台处理状态推进。

风险：

- 页面和 FAQ 写 “one-click data export or deletion on request”，但实际只是 pending request。
- California CCPA/CPRA 用户权利包含 know/correct/delete/opt-out 等，若面向 California 用户，需要可执行流程。

建议：

- 后台 job 处理 export/delete。
- 管理后台提供 request queue。
- 明确 SLA 与状态通知。
- 删除流程需要定义哪些数据保留用于法务/财务，哪些可删除/匿名化。

### P0：法律页版本和事实不一致

证据：

- Footer 链接：`src/config/locale/messages/en/landing.json:589-598` 指向 `/privacy-policy`、`/terms-of-service`
- Sitemap：`src/app/sitemap.ts:49-64` 包含 `/privacy`、`/terms`，但 `:141-142` 排除了 `privacy-policy`、`terms-of-service`
- 硬编码页：
  - `src/app/[locale]/(landing)/privacy/page.tsx`
  - `src/app/[locale]/(landing)/terms/page.tsx`
- MDX 页：
  - `content/pages/privacy-policy.mdx`
  - `content/pages/terms-of-service.mdx`

具体问题：

- `/privacy` 写 Stripe only，但支付实现有 Stripe/PayPal/Creem。
- `/terms` 写 Physics/Chemistry/Biology/Earth Science/Math 3D simulations，但 UPG 当前只有 physics enabled。
- `content/pages/terms-of-service.mdx` 写 “179 interactive HTML experiments”，当前事实是 175 public HTML + 4 R3F registry。
- `content/pages/children-privacy.mdx` 和 `content/pages/cookie-policy.mdx` 仍有 `[email]` placeholder。
- landing FAQ 写 “GDPR and COPPA compliant with age-gating, consent management, and data retention controls”，但当前 age gate/retention 并不闭环。

建议：

- 选择唯一法律页来源：建议 MDX 内容页作为公开法律页，删除/redirect `/privacy`、`/terms` 或让它们读取同一内容。
- sitemap 必须包含实际 footer 链接。
- 清理 placeholder。
- 所有能力描述只写当前真实上线事实。

### P1：Cookie consent 记录失败，analytics script 也没有被 consent gate

证据：

- Banner：`src/shared/blocks/legal/CookieConsentBanner.tsx:13-31`
- Consent API：`src/app/api/compliance/consent/route.ts:25-30`
- Analytics 注入：`src/app/layout.tsx:43-72`、`:115-125`
- GA 脚本：`src/extensions/analytics/google-analytics.tsx:27-49`

问题：

- banner 只在 timezone `Europe/*` 显示，不覆盖 California/Canada 等北美隐私场景。
- 匿名 cookie accept/reject 没有传 `sessionId`，API 会返回 `session_id_required`，前端静默失败。
- `regionCode` 传 timezone，service 只 `slice(0,2)`，`America/New_York` 会变成 `AM`。
- analytics script 本身在 production/debug 直接注入；`bridge.tsx` 只 gate 自定义事件，不阻止脚本加载。

建议：

- 生成匿名 session id，真实记录 consent。
- region 用 country/region，不要用 timezone slice。
- analytics/ad/customer-service script loading 受 consent mode 控制。
- 若启用 cross-context behavioral advertising，需要 CCPA “Do Not Sell or Share” / GPC 支持。

### P1：FERPA / school use 条款不足

Scivra 面向学校/教师。FERPA 不一定直接适用于 Scivra 本体，但当学校把学生 PII/education records 提供给第三方服务时，供应商通常需要 school official exception / contract / direct control / redisclosure limits 等条款支持。

当前公开 terms/privacy 没有足够清楚地说明：

- school/district contract 模式
- data processing addendum
- student data use limitation
- redisclosure limitation
- teacher/school consent 与 parent consent 的边界

建议：

- 增加 “School and District Use” section。
- 明确学生数据只用于教育目的，不用于广告画像。
- 准备 DPA / student data privacy addendum，至少面向采购流程可提供。

## 6. 登录与支付完整性

### 登录

已确认：

- `/sign-in`、`/sign-up` 页面 200。
- Better Auth route 存在：`src/app/api/auth/[...all]/route.ts`
- email/social provider 由 config 控制。

主要问题：

- 注册没有 age gate / terms / privacy consent。
- social login 可能绕过年龄与同意采集。
- `autoComplete="password"` 应换成注册 `new-password`、登录 `current-password`。

结论：登录技术链路基本存在，但北美 K12 合规注册链路不完整。

### 支付

已确认：

- 未登录点击 pricing 的 Subscribe 会打开 Sign In dialog。
- checkout API 使用服务端 pricing，验证 provider/currency，金额不信任客户端：这是正确方向。
- Stripe subscription/payment 主链路相对完整。

关键问题：

#### P0：PayPal subscription 不通

证据：

- Provider interface 只有 `createPayment(...)`：`src/extensions/payment/types.ts:239-257`
- PayPal `createPayment(...)` 总是创建 `/v2/checkout/orders` one-time capture：`src/extensions/payment/paypal.ts:43-125`
- `createSubscriptionPayment(...)` 存在但没有被 PaymentManager/checkout 调用：`src/extensions/payment/paypal.ts:127-273`
- `handleCheckoutSuccess(...)` 对 subscription 要求 `session.subscriptionId` 和 `session.subscriptionInfo`：`src/shared/services/payment.ts:260-268`
- PayPal `getPaymentSession(...)` 没返回 subscriptionInfo：`src/extensions/payment/paypal.ts:275-319`

结论：PayPal 订阅不能算完整可用。

#### P0：PayPal webhook 基本不可用

证据：`src/extensions/payment/paypal.ts:325-370`

`getPaymentEvent(...)` 返回：

```ts
eventType: event.event_type,
paymentSession: undefined
```

但 notify route 要求 `paymentSession`，否则抛 `payment session not found`。同时 eventType 没映射到内部 `PaymentEventType` enum。

#### P1：webhook 失败返回 200 会吞掉支付重试

证据：`src/app/api/payment/notify/[provider]/route.ts:140-144`

当前 catch 后仍 `Response.json(...)`，HTTP status 默认 200。注释说避免 retries，但这会让 provider 认为 webhook 成功，真实失败无法自动补偿。

建议：

- 验签失败返回 400。
- 临时 DB/业务错误返回 5xx，让 provider 重试。
- 对重复事件做 idempotency，而不是吞掉错误。
- 建 reconciliation job，用 provider API 定期核对订单/订阅状态。

#### P1：Stripe subscription 状态映射过窄

证据：`src/extensions/payment/stripe.ts:545-600`

只处理 `active` 和 `canceled`，其他常见状态如 `trialing`、`incomplete`、`past_due`、`unpaid`、`paused` 会 throw。

建议补齐状态映射，并补 webhook fixture tests。

## 7. UPG 内容生成与安全

### 现状优点

UPG 不是简单 prompt → HTML。当前已有：

- input moderation
- AI 调用
- sanitizer
- performance/mobile injection
- quality checker
- retry once
- output moderation
- validation metadata
- credits/quota/lock

这条 pipeline 方向是对的。

### P0：iframe sandbox 安全边界需要收紧

证据：

- `src/shared/lib/upg/html-sanitizer.ts:17-24`
- `src/shared/blocks/upg/UpgGenerator.tsx:472-481`
- `src/app/[locale]/(landing)/(ai)/upg/view/[id]/client.tsx:297-300`
- `src/app/[locale]/embed/[id]/page.tsx:35-38`
- `src/shared/blocks/experiments/experiment-flow.tsx:205-210`

多处使用 `allow-scripts allow-same-origin`。MDN 说明，不加 `allow-same-origin` 时 sandboxed resource 是 opaque origin，无法访问 localStorage/cookie 等同源能力；加上后会保留 origin。对于 untrusted `srcDoc`，这削弱了 sandbox 隔离。

建议：

- UPG generated HTML 默认改为 `sandbox="allow-scripts"`。
- 如果 canvas/WebGL 确实需要 same-origin，使用独立子域渲染，例如 `render.scivra.com`，不要与主 app 同源。
- 对 UPG iframe 加 CSP：`default-src 'none'; script-src ... 'unsafe-inline'; style-src ... 'unsafe-inline'; img-src data: blob:; connect-src 'none'; form-action 'none'; navigate-to 'none'`。
- 优先使用增强 sanitizer 并增加真实浏览器沙箱逃逸测试。

### P1：质量检查还是 regex，不是真实渲染

证据：`src/shared/lib/upg/quality-checker.ts:18-207`

它能抓 Three.js、OrbitControls、slider、KaTeX、resize、setPixelRatio 等静态信号，但不能确认：

- canvas 非空
- shader/texture 加载成功
- 控件真实可拖动
- 数值变化真实影响画面
- mobile 布局无重叠

建议：

- 生成后用 Playwright/Chromium 渲染一次 `srcdoc`。
- 检查 canvas pixel nonblank、console/page error、slider 改变后画面或数据变化。
- 把真实渲染结果作为 blocking quality gate 的一部分。

### P1：English-only 项目里 UPG API 默认中文

证据：`src/app/api/upg/generate/route.ts:31-33`

```ts
const language: 'zh' | 'en' = body.language === 'en' ? 'en' : 'zh';
```

UI 当前发送 `language: 'en'`，但 API direct call/default 会生成中文。项目当前是 English-only，这个默认不合理。

建议：默认 `en`，只有显式 `zh` 时使用中文。

### P2：provider metadata 不准确

证据：`src/shared/lib/upg/generate-core.ts:132-152`、`:343-354`

即使使用 OpenRouter key/baseUrl，generation record 仍写 `provider: 'anthropic'`。运营排障、成本分析、模型质量分析会失真。

建议：根据 key/baseUrl/config 推断 provider，或显式传 provider。

## 8. 实验库与 3D 表现形式

### 数据事实

本次脚本核对：

```json
{
  "publicHtml": 175,
  "mapEntries": 175,
  "missingFiles": [],
  "unmapped": []
}
```

说明 175 个 public HTML 实验均有 registry HTML map，无缺失文件。

### 实验 HTML 扫描结果

对 `public/experiments/**/*.html` 扫描：

```json
{
  "files": 175,
  "tailwindCdn": 175,
  "cdnjs": 175,
  "jsdelivr": 175,
  "inlineOrbit": 175,
  "localOrbit": 0,
  "range": 173,
  "aria": 0,
  "role": 0,
  "canvas": 100,
  "pureBlackBg": 16,
  "requestAnimationFrame": 7,
  "setAnimationLoop": 174,
  "tryCatch": 5
}
```

问题：

- 0/175 有 `aria-*`，0/175 有 `role=`：对 WCAG 2.1/2.2 AA 不够。
- 175/175 使用 Tailwind CDN：对生产性能、CSP、离线稳定性不理想。
- 175/175 inline OrbitControls，0/175 使用 `/lib/orbit-controls.js`：与项目 UPG 规范不一致。
- 只有 5/175 有 try/catch：黑屏诊断能力弱。
- 16/175 有纯黑背景模式：与当前 “Glow, don't shout”/edu-academic 方向不完全一致。
- 2 个实验没有 range slider：
  - `public/experiments/ap-chemistry/balancing-chemical-equations.html`
  - `public/experiments/ap-chemistry/build-a-molecule.html`

### 3D 表现形式建议

当前“很多独立 HTML + 少量 R3F Wave 1”的方式能快速扩量，但体验一致性和可访问性弱。

建议按三层改：

1. 保留 standalone HTML 作为低耦合实验资产，但统一注入 runtime shell：错误 overlay、CSP、accessibility metadata、resize、reduced motion、keyboard help、data panel。
2. 对高价值 AP Physics/chemistry 实验迁入 R3F/React 组件：统一状态、参数、数据面板、挑战、进度记录。
3. 对 UPG 输出建立 “render contract”：必须有 `<canvas>`、数据面板、至少一个可键盘操作 control、文本 fallback、公式区、非视觉摘要。

更好的表现形式不是“更炫 3D”，而是：

- 可观察：关键量实时可见。
- 可操控：slider/stepper/input 有明确单位与范围。
- 可解释：公式和图像同步变化。
- 可评估：挑战题基于实验状态。
- 可访问：不用鼠标/不用颜色/不用 WebGL 也能理解核心信息。

## 9. 页面是否符合北美标准

### 当前较好的部分

- 页面文案是英语，面向 AP/NGSS/K12 的定位正确。
- `/privacy-policy`、`/terms-of-service`、`/children-privacy`、`/cookie-policy` 均能 200。
- 首页 a11y 集成测试 `tests/integration/a11y/homepage-axe.test.ts` 通过 serious/critical WCAG 2.1 AA 检查。

### 不符合或不足

1. COPPA：注册前未 age gate，未实现 verifiable parental consent。
2. FERPA/School use：缺少 school/district contracting、DPA、school official exception 支撑文案。
3. CCPA/CPRA：隐私页缺少 California-specific rights/opt-out/GPC/Do Not Sell or Share 的清晰实现说明。
4. Cookie/privacy：consent 记录失败，analytics script 未按 consent gate。
5. Accessibility：公开实验 HTML 基本没有 ARIA/role；3D/canvas 缺少非视觉替代。
6. Marketing claims：多处写 5 subjects、multi-language、COPPA compliant、age-gating、data retention controls，但实现或当前事实不支撑。

## 10. 推荐修复路线

### Sprint 1：生产阻塞修复

1. 修复/删除 `/api/cron/data-retention` 配置不一致。
2. 注册页接入 age gate + terms/privacy consent；social login 同步接入。
3. 统一法律页来源，删除 placeholder，修正实验数量、学科、支付 provider、UPG 能力描述。
4. webhook 错误状态改为正确 HTTP status；加 idempotency。
5. UPG iframe sandbox 去掉 `allow-same-origin` 或迁移到隔离渲染域。

### Sprint 2：支付与账号闭环

1. 重构 PaymentProvider 支持 one-time/subscription 分流。
2. PayPal subscription checkout + callback + webhook fixture tests。
3. Stripe 状态映射补齐。
4. Privacy export/delete 增加 worker/admin queue。
5. RBAC 过期角色 SQL 条件修复。

### Sprint 3：体验与实验质量

1. 修复移动端实验页 overflow。
2. R3F/WebGL fallback 和 error boundary。
3. UPG visual QA：Chromium 渲染、canvas nonblank、console error gate。
4. 实验 HTML runtime shell：ARIA、keyboard、reduced motion、error overlay、data summary。
5. UPG UI 去紫粉渐变，改成 edu-academic 视觉系统。

## 11. 最终判断

Scivra 的核心产品方向是成立的，尤其是实验 registry、学习 flow、UPG pipeline 的骨架都已经有了。但当前最大风险不是功能数量，而是“公开承诺大于真实实现”。

如果短期要上线北美 K12 场景，优先把合规声明、注册/隐私流程、支付 webhook、iframe 安全和移动端实验体验收口。完成这些后，再谈更大规模的 UI polish 和 3D 表现升级，会更稳。
