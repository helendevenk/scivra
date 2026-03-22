# AI 内容审核机制使用指南

## 概述

NeonPhysics v2 实现了三层 AI 内容审核机制，防止生成不当内容：

1. **输入审核 (Input Moderation)**: 检查用户输入的 prompt 是否包含敏感词
2. **输出审核 (Output Moderation)**: 检查 AI 生成的 HTML 代码是否安全
3. **人工复审 (Manual Review)**: 标记可疑内容供管理员审核

## 快速开始

### 1. 数据库迁移

首先需要执行数据库迁移，创建 `content_moderation` 表：

```bash
cd /Users/sky/Desktop/sciwangzhan/neonphysics-v2
pnpm db:push
```

### 2. 配置敏感词库

敏感词库位于 `/src/config/moderation/sensitive-words.ts`。

**注意**: 当前为示例词库，实际部署时需要替换为完整的敏感词库。

```typescript
export const SENSITIVE_WORD_CATEGORIES: SensitiveWordCategory[] = [
  {
    name: 'violence',
    severity: 'high',
    keywords: ['暴力', '杀人', '自杀', 'terrorism', 'violence', 'murder'],
  },
  // ... 更多类别
];
```

### 3. 使用审核服务

#### 3.1 输入审核

```typescript
import { moderateInput } from '@/shared/lib/moderation/content-moderator';

const result = moderateInput('用户输入的主题');

if (!result.passed) {
  // 审核不通过，拒绝生成
  console.error(result.reason);
} else if (result.status === 'pending') {
  // 标记为待审核，允许生成但进入人工复审队列
  console.warn('内容已标记为待审核');
} else {
  // 审核通过
  console.log('审核通过');
}
```

#### 3.2 输出审核

```typescript
import { moderateOutput } from '@/shared/lib/moderation/content-moderator';

const result = moderateOutput(htmlContent);

if (!result.passed) {
  // 审核不通过，拒绝生成
  console.error(result.reason);
  console.error('Issues:', result.issues);
} else if (result.status === 'pending') {
  // 标记为待审核
  console.warn('内容已标记为待审核');
} else {
  // 审核通过
  console.log('审核通过');
}
```

#### 3.3 综合审核

```typescript
import { moderateContent } from '@/shared/lib/moderation/content-moderator';

const { inputResult, outputResult, overallPassed } = moderateContent(
  prompt,
  htmlContent
);

if (!overallPassed) {
  console.error('审核不通过');
}
```

### 4. API 使用

#### 4.1 输入审核 API

```bash
curl -X POST http://localhost:3000/api/moderation/check-input \
  -H "Content-Type: application/json" \
  -d '{"prompt": "牛顿第二定律"}'
```

响应:
```json
{
  "passed": true,
  "status": "pass",
  "reason": null
}
```

#### 4.2 输出审核 API

```bash
curl -X POST http://localhost:3000/api/moderation/check-output \
  -H "Content-Type: application/json" \
  -d '{"htmlContent": "<html>...</html>"}'
```

响应:
```json
{
  "passed": true,
  "status": "pass",
  "reason": null,
  "issues": []
}
```

#### 4.3 获取待审核列表 API（管理员）

```bash
curl -X GET "http://localhost:3000/api/admin/moderation/pending?page=1&pageSize=20" \
  -H "Authorization: Bearer <admin-token>"
```

响应:
```json
{
  "records": [
    {
      "id": "xxx",
      "generationId": "xxx",
      "checkType": "input",
      "status": "pending",
      "reason": "内容已标记为待审核",
      "matchedKeywords": ["keyword1"],
      "checkedAt": "2026-03-09T10:00:00Z",
      "generation": {
        "id": "xxx",
        "prompt": "用户输入",
        "language": "zh",
        "createdAt": "2026-03-09T10:00:00Z",
        "userId": "xxx"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 5
  }
}
```

#### 4.4 人工审核 API（管理员）

```bash
curl -X POST http://localhost:3000/api/admin/moderation/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "moderationId": "xxx",
    "status": "pass",
    "reviewNotes": "审核通过"
  }'
```

响应:
```json
{
  "success": true,
  "record": {
    "id": "xxx",
    "status": "pass",
    "reviewedBy": "admin-user-id",
    "reviewedAt": "2026-03-09T10:05:00Z"
  }
}
```

### 5. 集成到 UPG 生成流程

审核机制已自动集成到 UPG 生成流程中（`/src/shared/lib/upg/generate-core.ts`）。

生成流程：
```
用户输入 prompt
  ↓
输入审核 (moderateInput)
  ├─ reject → 拒绝生成，返回错误
  ├─ pending → 允许生成，标记待审核
  └─ pass → 继续
  ↓
AI 生成 HTML
  ↓
HTML 安全检查 (sanitizeHtml)
  ↓
质量检查 (checkQuality)
  ↓
输出审核 (moderateOutput)
  ├─ reject → 拒绝生成，返回错误
  ├─ pending → 允许生成，标记待审核
  └─ pass → 继续
  ↓
保存到数据库
  ↓
返回结果
```

## 测试

运行测试脚本：

```bash
cd /Users/sky/Desktop/sciwangzhan/neonphysics-v2
npx tsx tests/moderation-test.ts
```

## 配置

### 敏感词库配置

编辑 `/src/config/moderation/sensitive-words.ts`：

```typescript
export const SENSITIVE_WORD_CATEGORIES: SensitiveWordCategory[] = [
  {
    name: 'violence',
    severity: 'high', // 'high' | 'medium' | 'low'
    keywords: ['暴力', '杀人', 'violence', 'murder'],
  },
  // 添加更多类别...
];
```

**严重性级别**:
- `high`: 直接拒绝
- `medium`: 标记为 pending，允许生成但进入人工复审队列
- `low`: 记录但通过

### CDN 白名单配置

编辑 `/src/shared/lib/upg/constants.ts`：

```typescript
export const UPG_CDN_WHITELIST = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'unpkg.com',
  // 添加更多白名单域名...
];
```

## 管理后台

### 权限配置

管理员需要以下权限才能访问审核功能：

- `admin.moderation.read`: 查看待审核列表
- `admin.moderation.write`: 进行人工审核

使用 RBAC 系统分配权限：

```bash
pnpm rbac:init  # 初始化 RBAC
# 然后在管理后台分配权限
```

### 审核流程

1. 管理员登录后台
2. 访问 `/api/admin/moderation/pending` 获取待审核列表
3. 查看每条记录的详细信息（prompt、HTML 内容、匹配的敏感词等）
4. 决定审核结果：
   - `pass`: 审核通过，内容可以公开
   - `reject`: 审核不通过，内容设置为不公开
5. 提交审核结果到 `/api/admin/moderation/review`

## 监控

建议在生产环境监控以下指标：

1. **审核通过率**: `pass_rate = (pass_count / total_count) * 100%`
2. **误杀率**: `false_positive_rate < 1%`
3. **漏网率**: `false_negative_rate < 0.1%`
4. **审核性能**:
   - `input_moderation_time_p95 < 50ms`
   - `output_moderation_time_p95 < 200ms`
5. **待审核队列长度**: `pending_queue_length < 100`

## 故障排查

### 问题 1: 审核服务响应慢

**原因**: 敏感词库过大，匹配性能差

**解决方案**:
1. 优化敏感词库，移除重复和无效词汇
2. 使用 Aho-Corasick 算法替代简单字符串匹配
3. 添加缓存机制

### 问题 2: 误杀率高

**原因**: 敏感词库过于严格

**解决方案**:
1. 调整敏感词的严重性级别（high → medium）
2. 添加白名单机制（如"暴力美学"不应被拦截）
3. 使用上下文语义分析

### 问题 3: 漏网率高

**原因**: 敏感词库不完整，或用户使用变体绕过

**解决方案**:
1. 补充敏感词库
2. 添加变体检测（如"暴 力"、"b@o力"）
3. 集成第三方内容审核 API

## 后续优化

### 短期（1-2 周）
- [ ] 补充完整的敏感词库（中英文）
- [ ] 添加敏感词变体检测
- [ ] 实现敏感词库热更新机制

### 中期（1-2 月）
- [ ] 集成第三方内容审核 API（如阿里云内容安全）
- [ ] 实现管理后台审核界面（前端页面）
- [ ] 添加审核统计和报表功能
- [ ] 实现自动下架机制（举报数 >= 3）

### 长期（3-6 月）
- [ ] 使用 Aho-Corasick 算法优化性能
- [ ] 集成 NLP 模型进行语义审核
- [ ] 实现机器学习模型自动识别不当内容
- [ ] 建立人工审核团队和审核流程

## 相关文档

- [实现报告](/docs/reports/2026-03-09-phase-0.6-content-moderation-report.md)
- [升级计划](/docs/plans/2026-03-09-neonphysics-v2-saas-upgrade-plan.md)
- [数据库 Schema](/src/config/db/schema.ts)

## 联系方式

如有问题，请联系：
- 后端开发工程师
- Email: backend@neonphysics.com
