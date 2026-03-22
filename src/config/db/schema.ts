import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Search users by name in admin dashboard
    index('idx_user_name').on(table.name),
    // Order users by registration time for latest users list
    index('idx_user_created_at').on(table.createdAt),
  ]
);

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [
    // Composite: Query user sessions and filter by expiration
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_session_user_expires').on(table.userId, table.expiresAt),
  ]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Query all linked accounts for a user
    index('idx_account_user_id').on(table.userId),
    // Composite: OAuth login (most critical)
    // Can also be used for: WHERE providerId = ? (left-prefix)
    index('idx_account_provider_account').on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Find verification code by identifier (e.g., find code by email)
    index('idx_verification_identifier').on(table.identifier),
  ]
);

export const config = pgTable('config', {
  name: text('name').unique().notNull(),
  value: text('value'),
});

export const taxonomy = pgTable(
  'taxonomy',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    slug: text('slug').unique().notNull(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    image: text('image'),
    icon: text('icon'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Composite: Query taxonomies by type and status
    // Can also be used for: WHERE type = ? (left-prefix)
    index('idx_taxonomy_type_status').on(table.type, table.status),
  ]
);

export const post = pgTable(
  'post',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    slug: text('slug').unique().notNull(),
    type: text('type').notNull(),
    title: text('title'),
    description: text('description'),
    image: text('image'),
    content: text('content'),
    categories: text('categories'),
    tags: text('tags'),
    authorName: text('author_name'),
    authorImage: text('author_image'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Composite: Query posts by type and status
    // Can also be used for: WHERE type = ? (left-prefix)
    index('idx_post_type_status').on(table.type, table.status),
  ]
);

export const order = pgTable(
  'order',
  {
    id: text('id').primaryKey(),
    orderNo: text('order_no').unique().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    userEmail: text('user_email'), // checkout user email
    status: text('status').notNull(), // created, paid, failed
    amount: integer('amount').notNull(), // checkout amount in cents
    currency: text('currency').notNull(), // checkout currency
    productId: text('product_id'),
    paymentType: text('payment_type'), // one_time, subscription
    paymentInterval: text('payment_interval'), // day, week, month, year
    paymentProvider: text('payment_provider').notNull(),
    paymentSessionId: text('payment_session_id'),
    checkoutInfo: text('checkout_info').notNull(), // checkout request info
    checkoutResult: text('checkout_result'), // checkout result
    paymentResult: text('payment_result'), // payment result
    discountCode: text('discount_code'), // discount code
    discountAmount: integer('discount_amount'), // discount amount in cents
    discountCurrency: text('discount_currency'), // discount currency
    paymentEmail: text('payment_email'), // actual payment email
    paymentAmount: integer('payment_amount'), // actual payment amount
    paymentCurrency: text('payment_currency'), // actual payment currency
    paidAt: timestamp('paid_at'), // paid at
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    description: text('description'), // order description
    productName: text('product_name'), // product name
    subscriptionId: text('subscription_id'), // provider subscription id
    subscriptionResult: text('subscription_result'), // provider subscription result
    checkoutUrl: text('checkout_url'), // checkout url
    callbackUrl: text('callback_url'), // callback url, after handle callback
    creditsAmount: integer('credits_amount'), // credits amount
    creditsValidDays: integer('credits_valid_days'), // credits validity days
    planName: text('plan_name'), // subscription plan name
    paymentProductId: text('payment_product_id'), // payment product id
    invoiceId: text('invoice_id'),
    invoiceUrl: text('invoice_url'),
    subscriptionNo: text('subscription_no'), // order subscription no
    transactionId: text('transaction_id'), // payment transaction id
    paymentUserName: text('payment_user_name'), // payment user name
    paymentUserId: text('payment_user_id'), // payment user id
  },
  (table) => [
    // Composite: Query user orders by status (most common)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_order_user_status_payment_type').on(
      table.userId,
      table.status,
      table.paymentType
    ),
    // Composite: Prevent duplicate payments
    // Can also be used for: WHERE transactionId = ? (left-prefix)
    index('idx_order_transaction_provider').on(
      table.transactionId,
      table.paymentProvider
    ),
    // Order orders by creation time for listing
    index('idx_order_created_at').on(table.createdAt),
  ]
);

export const subscription = pgTable(
  'subscription',
  {
    id: text('id').primaryKey(),
    subscriptionNo: text('subscription_no').unique().notNull(), // subscription no
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    userEmail: text('user_email'), // subscription user email
    status: text('status').notNull(), // subscription status
    paymentProvider: text('payment_provider').notNull(),
    subscriptionId: text('subscription_id').notNull(), // provider subscription id
    subscriptionResult: text('subscription_result'), // provider subscription result
    productId: text('product_id'), // product id
    description: text('description'), // subscription description
    amount: integer('amount'), // subscription amount
    currency: text('currency'), // subscription currency
    interval: text('interval'), // subscription interval, day, week, month, year
    intervalCount: integer('interval_count'), // subscription interval count
    trialPeriodDays: integer('trial_period_days'), // subscription trial period days
    currentPeriodStart: timestamp('current_period_start'), // subscription current period start
    currentPeriodEnd: timestamp('current_period_end'), // subscription current period end
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    planName: text('plan_name'),
    billingUrl: text('billing_url'),
    productName: text('product_name'), // subscription product name
    creditsAmount: integer('credits_amount'), // subscription credits amount
    creditsValidDays: integer('credits_valid_days'), // subscription credits valid days
    paymentProductId: text('payment_product_id'), // subscription payment product id
    paymentUserId: text('payment_user_id'), // subscription payment user id
    canceledAt: timestamp('canceled_at'), // subscription canceled apply at
    canceledEndAt: timestamp('canceled_end_at'), // subscription canceled end at
    canceledReason: text('canceled_reason'), // subscription canceled reason
    canceledReasonType: text('canceled_reason_type'), // subscription canceled reason type
  },
  (table) => [
    // Composite: Query user's subscriptions by status (most common)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_subscription_user_status_interval').on(
      table.userId,
      table.status,
      table.interval
    ),
    // Composite: Prevent duplicate subscriptions
    // Can also be used for: WHERE paymentProvider = ? (left-prefix)
    index('idx_subscription_provider_id').on(
      table.subscriptionId,
      table.paymentProvider
    ),
    // Order subscriptions by creation time for listing
    index('idx_subscription_created_at').on(table.createdAt),
  ]
);

export const credit = pgTable(
  'credit',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }), // user id
    userEmail: text('user_email'), // user email
    orderNo: text('order_no'), // payment order no
    subscriptionNo: text('subscription_no'), // subscription no
    transactionNo: text('transaction_no').unique().notNull(), // transaction no
    transactionType: text('transaction_type').notNull(), // transaction type, grant / consume
    transactionScene: text('transaction_scene'), // transaction scene, payment / subscription / gift / award
    credits: integer('credits').notNull(), // credits amount, n or -n
    remainingCredits: integer('remaining_credits').notNull().default(0), // remaining credits amount
    description: text('description'), // transaction description
    expiresAt: timestamp('expires_at'), // transaction expires at
    status: text('status').notNull(), // transaction status
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    consumedDetail: text('consumed_detail'), // consumed detail
    metadata: text('metadata'), // transaction metadata
  },
  (table) => [
    // Critical composite index for credit consumption (FIFO queue)
    // Query: WHERE userId = ? AND transactionType = 'grant' AND status = 'active'
    //        AND remainingCredits > 0 ORDER BY expiresAt
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_credit_consume_fifo').on(
      table.userId,
      table.status,
      table.transactionType,
      table.remainingCredits,
      table.expiresAt
    ),
    // Query credits by order number
    index('idx_credit_order_no').on(table.orderNo),
    // Query credits by subscription number
    index('idx_credit_subscription_no').on(table.subscriptionNo),
  ]
);

export const apikey = pgTable(
  'apikey',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    title: text('title').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    // Composite: Query user's API keys by status
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_apikey_user_status').on(table.userId, table.status),
    // Composite: Validate active API key (most common for auth)
    // Can also be used for: WHERE key = ? (left-prefix)
    index('idx_apikey_key_status').on(table.key, table.status),
  ]
);

// RBAC Tables
export const role = pgTable(
  'role',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(), // admin, editor, viewer
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Query active roles
    index('idx_role_status').on(table.status),
  ]
);

export const permission = pgTable(
  'permission',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(), // admin.users.read, admin.posts.write
    resource: text('resource').notNull(), // users, posts, categories
    action: text('action').notNull(), // read, write, delete
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Composite: Query permissions by resource and action
    // Can also be used for: WHERE resource = ? (left-prefix)
    index('idx_permission_resource_action').on(table.resource, table.action),
  ]
);

export const rolePermission = pgTable(
  'role_permission',
  {
    id: text('id').primaryKey(),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade' }),
    permissionId: text('permission_id')
      .notNull()
      .references(() => permission.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    // Composite: Query permissions for a role
    // Can also be used for: WHERE roleId = ? (left-prefix)
    index('idx_role_permission_role_permission').on(
      table.roleId,
      table.permissionId
    ),
  ]
);

export const userRole = pgTable(
  'user_role',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    expiresAt: timestamp('expires_at'),
  },
  (table) => [
    // Composite: Query user's active roles (most critical for auth)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_user_role_user_expires').on(table.userId, table.expiresAt),
  ]
);

export const aiTask = pgTable(
  'ai_task',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    mediaType: text('media_type').notNull(),
    provider: text('provider').notNull(),
    model: text('model').notNull(),
    prompt: text('prompt').notNull(),
    options: text('options'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    taskId: text('task_id'), // provider task id
    taskInfo: text('task_info'), // provider task info
    taskResult: text('task_result'), // provider task result
    costCredits: integer('cost_credits').notNull().default(0),
    scene: text('scene').notNull().default(''),
    creditId: text('credit_id'), // credit consumption record id
  },
  (table) => [
    // Composite: Query user's AI tasks by status
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_ai_task_user_media_type').on(table.userId, table.mediaType),
    // Composite: Query user's AI tasks by media type and provider
    // Can also be used for: WHERE mediaType = ? AND provider = ? (left-prefix)
    index('idx_ai_task_media_type_status').on(table.mediaType, table.status),
  ]
);

export const chat = pgTable(
  'chat',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    model: text('model').notNull(),
    provider: text('provider').notNull(),
    title: text('title').notNull().default(''),
    parts: text('parts').notNull(),
    metadata: text('metadata'),
    content: text('content'),
  },
  (table) => [index('idx_chat_user_status').on(table.userId, table.status)]
);

export const chatMessage = pgTable(
  'chat_message',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    chatId: text('chat_id')
      .notNull()
      .references(() => chat.id, { onDelete: 'cascade' }),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    role: text('role').notNull(),
    parts: text('parts').notNull(),
    metadata: text('metadata'),
    model: text('model').notNull(),
    provider: text('provider').notNull(),
  },
  (table) => [
    index('idx_chat_message_chat_id').on(table.chatId, table.status),
    index('idx_chat_message_user_id').on(table.userId, table.status),
  ]
);

export const experimentProgress = pgTable(
  'experiment_progress',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    experimentId: text('experiment_id').notNull(),
    completedChallenges: text('completed_challenges'),
    totalTimeSpent: integer('total_time_spent').notNull().default(0),
    sessionsCount: integer('sessions_count').notNull().default(0),
    lastParameters: text('last_parameters'), // JSON string
    lastAccessedAt: timestamp('last_accessed_at').defaultNow().notNull(),
    firstUsedAt: timestamp('first_used_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_exp_progress_user').on(table.userId),
    index('idx_exp_progress_experiment').on(table.experimentId),
  ]
);

export const anonymousUsage = pgTable(
  'anonymous_usage',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    experimentId: text('experiment_id').notNull(),
    date: text('date').notNull(),
    secondsUsed: integer('seconds_used').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_anon_usage_session').on(table.sessionId),
  ]
);

// ─── Compliance & Usage tables (ported from v1, adapted to v2 conventions) ───

export const userComplianceProfile = pgTable(
  'user_compliance_profile',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    ageGroup: text('age_group').notNull().default('unknown'),
    countryCode: text('country_code'),
    privacyPolicyVersion: text('privacy_policy_version'),
    termsVersion: text('terms_version'),
    termsAcceptedAt: timestamp('terms_accepted_at'),
    marketingConsentAt: timestamp('marketing_consent_at'),
    parentalConsentAt: timestamp('parental_consent_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }
);

export const dailyUsage = pgTable(
  'daily_usage',
  {
    id: text('id').primaryKey(),
    keyType: text('key_type').notNull(), // 'user' | 'session'
    keyValue: text('key_value').notNull(),
    experimentId: text('experiment_id').notNull(), // experiment slug
    usageDate: text('usage_date').notNull(), // 'YYYY-MM-DD'
    usedSeconds: integer('used_seconds').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('uq_daily_usage_key').on(
      table.keyType,
      table.keyValue,
      table.experimentId,
      table.usageDate
    ),
    index('idx_daily_usage_lookup').on(table.keyType, table.keyValue, table.usageDate),
    index('idx_daily_usage_experiment').on(table.experimentId),
  ]
);

export const consentEvent = pgTable(
  'consent_event',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    sessionId: text('session_id'),
    eventType: text('event_type').notNull(), // 'privacy_accept' | 'terms_accept' | 'cookie_accept' | 'cookie_reject' | 'age_gate'
    policyVersion: text('policy_version'),
    regionCode: text('region_code'),
    ipHash: text('ip_hash'),
    userAgentHash: text('user_agent_hash'),
    metadata: text('metadata'), // JSON string
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_consent_event_user').on(table.userId),
    index('idx_consent_event_created').on(table.createdAt),
  ]
);

export const privacyRequest = pgTable(
  'privacy_request',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    requestType: text('request_type').notNull(), // 'export' | 'delete'
    status: text('status').notNull().default('pending'), // 'pending' | 'processing' | 'completed' | 'rejected'
    metadata: text('metadata'), // JSON string
    requestedAt: timestamp('requested_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_privacy_request_user').on(table.userId),
    index('idx_privacy_request_status').on(table.status),
  ]
);

// ─── UPG (Universal Principle Generator) tables ───

export const upgGeneration = pgTable(
  'upg_generation',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    prompt: text('prompt').notNull(),
    promptHash: text('prompt_hash').notNull(),
    language: text('language').notNull(), // 'zh' | 'en'
    category: text('category'), // physics/chemistry/biology/math/astronomy/engineering/other
    htmlContent: text('html_content'), // V0.1: stored in DB; V0.2: migrate to R2
    htmlUrl: text('html_url'), // V0.2: R2 URL
    htmlSize: integer('html_size'), // bytes, hard limit 200KB
    model: text('model').notNull(),
    provider: text('provider').notNull().default('openrouter'),
    inputTokens: integer('input_tokens').default(0),
    outputTokens: integer('output_tokens').default(0),
    costUsd: integer('cost_usd').default(0), // cost in cents
    costCredits: integer('cost_credits').default(0),
    creditId: text('credit_id'),
    status: text('status').notNull(), // pending/generating/completed/failed
    errorMessage: text('error_message'),
    isPublic: boolean('is_public').default(false),
    viewCount: integer('view_count').default(0),
    shareCount: integer('share_count').default(0),
    downloadCount: integer('download_count').default(0),
    // Gallery social attributes
    likeCount: integer('like_count').default(0),
    forkCount: integer('fork_count').default(0),
    featured: boolean('featured').default(false),
    tags: text('tags').array(), // TEXT[], AI auto-extract + user editable
    forkedFrom: text('forked_from'),
    // Phase 3.5: Validation
    validationScore: integer('validation_score'),
    validationDetails: text('validation_details'),
    validatedAt: timestamp('validated_at'),
    // Phase 3.5: Refinement
    version: integer('version').default(1),
    parentId: text('parent_id'),
    refinementPrompt: text('refinement_prompt'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('idx_upg_generation_user').on(table.userId),
    index('idx_upg_generation_status').on(table.status),
    index('idx_upg_generation_prompt_hash').on(table.promptHash),
    index('idx_upg_generation_public_created').on(
      table.isPublic,
      table.createdAt
    ),
    index('idx_upg_generation_featured_created').on(
      table.featured,
      table.createdAt
    ),
    // Phase 0.7: Critical indexes for gallery and user queries
    index('idx_upg_generation_user_created').on(table.userId, table.createdAt),
    index('idx_upg_generation_tags').on(table.tags),
    index('idx_upg_generation_gallery').on(table.isPublic, table.category, table.createdAt),
    foreignKey({
      columns: [table.forkedFrom],
      foreignColumns: [table.id],
    }).onDelete('set null'),
    // Phase 3.5: Refinement version chain index
    index('idx_upg_generation_parent').on(table.parentId),
  ]
);

export const upgReport = pgTable(
  'upg_report',
  {
    id: text('id').primaryKey(),
    generationId: text('generation_id')
      .notNull()
      .references(() => upgGeneration.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    reportType: text('report_type').notNull(), // inaccurate/broken/inappropriate/other
    content: text('content'),
    status: text('status').notNull().default('pending'), // pending/reviewed/resolved
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_upg_report_generation').on(table.generationId),
    index('idx_upg_report_user').on(table.userId),
  ]
);

export const upgDailyQuota = pgTable(
  'upg_daily_quota',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    usageDate: text('usage_date').notNull(), // 'YYYY-MM-DD'
    scene: varchar('scene', { length: 50 }).notNull().default('upg-generate'),
    generationCount: integer('generation_count').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('uq_upg_daily_quota_user_date_scene').on(
      table.userId,
      table.usageDate,
      table.scene
    ),
    index('idx_upg_daily_quota_user_date_scene').on(
      table.userId,
      table.usageDate,
      table.scene
    ),
  ]
);

// ─── Gallery: Likes ───

export const upgLike = pgTable(
  'upg_like',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    generationId: text('generation_id')
      .notNull()
      .references(() => upgGeneration.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_upg_like_user_generation').on(table.userId, table.generationId),
    index('idx_upg_like_generation_created').on(
      table.generationId,
      table.createdAt
    ),
    index('idx_upg_like_user_created').on(table.userId, table.createdAt),
  ]
);

// ─── Experiment Metadata (Phase 2 placeholder, built now to batch migration) ───

// ─── Learning Path tables ───

export const learningPath = pgTable(
  'learning_path',
  {
    id: text('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en').notNull(),
    descriptionZh: text('description_zh').notNull(),
    category: text('category').notNull(),
    level: text('level').notNull(),
    coverImage: text('cover_image'),
    isPublished: boolean('is_published').default(false),
    nodeCount: integer('node_count').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_learning_path_published_category').on(
      table.isPublished,
      table.category
    ),
  ]
);

export const learningPathNode = pgTable(
  'learning_path_node',
  {
    id: text('id').primaryKey(),
    pathId: text('path_id')
      .notNull()
      .references(() => learningPath.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en').notNull(),
    descriptionZh: text('description_zh').notNull(),
    generationId: text('generation_id'),
    experimentSlug: text('experiment_slug'),
    quizQuestion: text('quiz_question').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_learning_path_node_path_order').on(
      table.pathId,
      table.orderIndex
    ),
  ]
);

export const learningPathProgress = pgTable(
  'learning_path_progress',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    pathId: text('path_id')
      .notNull()
      .references(() => learningPath.id, { onDelete: 'cascade' }),
    currentNode: integer('current_node').default(0),
    completed: boolean('completed').default(false),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('uq_learning_path_progress_user_path').on(
      table.userId,
      table.pathId
    ),
    index('idx_learning_path_progress_user').on(table.userId),
  ]
);

// ─── Experiment Metadata (Phase 2 placeholder, built now to batch migration) ───

export const experimentMetadata = pgTable(
  'experiment_metadata',
  {
    id: text('id').primaryKey(),
    generationId: text('generation_id')
      .notNull()
      .unique()
      .references(() => upgGeneration.id, { onDelete: 'cascade' }),
    category: text('category'), // mechanics/optics/thermodynamics/electromagnetism/modern_physics
    level: text('level'), // beginner/intermediate/advanced
    orderIndex: integer('order_index').default(0),
    promotedAt: timestamp('promoted_at'),
    promotedBy: text('promoted_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_experiment_metadata_category').on(table.category),
  ]
);

// ─── Learning Statistics (Phase 3: Education Features) ───

export const learningStats = pgTable(
  'learning_stats',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),
    
    // UPG generation stats
    upgsGenerated: integer('upgs_generated').default(0).notNull(),
    upgsPublished: integer('upgs_published').default(0).notNull(),
    upgsLiked: integer('upgs_liked').default(0).notNull(),
    
    // Experiment stats
    experimentsStarted: integer('experiments_started').default(0).notNull(),
    experimentsCompleted: integer('experiments_completed').default(0).notNull(),
    
    // Time tracking (in minutes)
    studyMinutes: integer('study_minutes').default(0).notNull(),
    
    // Engagement
    lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
    streakDays: integer('streak_days').default(0).notNull(),
    longestStreak: integer('longest_streak').default(0).notNull(),

    // Phase F2: Quest stats
    questsCompleted: integer('quests_completed').default(0).notNull(),
    achievementsEarned: integer('achievements_earned').default(0).notNull(),
    
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_learning_stats_user_id').on(table.userId),
    index('idx_learning_stats_last_active').on(table.lastActiveAt),
  ]
);

export type LearningStats = typeof learningStats.$inferSelect;
export type NewLearningStats = typeof learningStats.$inferInsert;

// ─── Phase 0.7: Database Optimization Tables ───

// Audit Log Table
export const auditLog = pgTable(
  'audit_log',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }),
    action: varchar('action', { length: 100 }).notNull(), // 'generate_upg' | 'like' | 'report' | 'admin_delete' | 'credit_earn' | 'credit_spend'
    resourceType: varchar('resource_type', { length: 50 }), // 'upg_generation' | 'user' | 'credit' | 'report'
    resourceId: varchar('resource_id', { length: 255 }),
    metadata: text('metadata'), // JSON string for flexible additional info
    ipAddress: varchar('ip_address', { length: 45 }), // IPv6 max length
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_audit_log_user_created').on(table.userId, table.createdAt),
    index('idx_audit_log_action_created').on(table.action, table.createdAt),
    index('idx_audit_log_resource').on(table.resourceType, table.resourceId),
  ]
);

// UPG Tag Table (normalized tag management)
export const upgTag = pgTable(
  'upg_tag',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 100 }).unique().notNull(),
    category: varchar('category', { length: 50 }), // 'physics' | 'chemistry' | 'biology' | 'math' | 'astronomy' | 'engineering'
    usageCount: integer('usage_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_upg_tag_category').on(table.category),
    index('idx_upg_tag_usage_count').on(table.usageCount),
  ]
);

// UPG Generation-Tag Association Table (many-to-many)
export const upgGenerationTag = pgTable(
  'upg_generation_tag',
  {
    generationId: varchar('generation_id', { length: 255 })
      .notNull()
      .references(() => upgGeneration.id, { onDelete: 'cascade' }),
    tagId: varchar('tag_id', { length: 255 })
      .notNull()
      .references(() => upgTag.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_upg_generation_tag_generation').on(table.generationId),
    index('idx_upg_generation_tag_tag').on(table.tagId),
    unique('uq_upg_generation_tag').on(table.generationId, table.tagId),
  ]
);

// User Credits Table (with optimistic locking for concurrency control)
export const userCredits = pgTable(
  'user_credits',
  {
    userId: varchar('user_id', { length: 255 })
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    totalCredits: integer('total_credits').default(0).notNull(),
    usedCredits: integer('used_credits').default(0).notNull(),
    // availableCredits computed as (totalCredits - usedCredits)
    version: integer('version').default(0).notNull(), // Optimistic lock version
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_user_credits_user').on(table.userId),
  ]
);

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
export type UpgTag = typeof upgTag.$inferSelect;
export type NewUpgTag = typeof upgTag.$inferInsert;
export type UpgGenerationTag = typeof upgGenerationTag.$inferSelect;
export type NewUpgGenerationTag = typeof upgGenerationTag.$inferInsert;
export type UserCredits = typeof userCredits.$inferSelect;
export type NewUserCredits = typeof userCredits.$inferInsert;

// ─── Phase 0.6: Content Moderation Tables ───

// Content Moderation Table (审核记录表)
export const contentModeration = pgTable(
  'content_moderation',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    generationId: varchar('generation_id', { length: 255 })
      .notNull()
      .references(() => upgGeneration.id, { onDelete: 'cascade' }),
    checkType: varchar('check_type', { length: 20 }).notNull(), // 'input' | 'output' | 'manual'
    status: varchar('status', { length: 20 }).notNull(), // 'pass' | 'reject' | 'pending'
    reason: text('reason'), // 审核不通过的原因
    matchedKeywords: text('matched_keywords').array(), // 匹配到的敏感词列表
    reviewedBy: varchar('reviewed_by', { length: 255 }).references(() => user.id, { onDelete: 'set null' }), // 人工审核员
    reviewNotes: text('review_notes'), // 审核备注
    checkedAt: timestamp('checked_at').defaultNow().notNull(),
    reviewedAt: timestamp('reviewed_at'), // 人工审核时间
  },
  (table) => [
    index('idx_content_moderation_generation').on(table.generationId),
    index('idx_content_moderation_status').on(table.status),
    index('idx_content_moderation_check_type').on(table.checkType),
    index('idx_content_moderation_checked_at').on(table.checkedAt),
  ]
);

export type ContentModeration = typeof contentModeration.$inferSelect;
export type NewContentModeration = typeof contentModeration.$inferInsert;

// ─── Autopilot Sessions ───

export const autopilotSession = pgTable(
  'autopilot_session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    generationId: text('generation_id')
      .notNull()
      .references(() => upgGeneration.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('active'), // active/completed/aborted
    totalSteps: integer('total_steps').default(0),
    language: text('language').notNull(),
    completedQuiz: boolean('completed_quiz').default(false),
    quizCorrect: integer('quiz_correct').default(0),
    durationMs: integer('duration_ms'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
  },
  (table) => [
    index('idx_autopilot_session_user').on(table.userId),
    index('idx_autopilot_session_user_gen').on(table.userId, table.generationId),
  ]
);

export type AutopilotSession = typeof autopilotSession.$inferSelect;
export type NewAutopilotSession = typeof autopilotSession.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// Phase F1: AP Prep Mode (5 tables)
// ═══════════════════════════════════════════════════════════════

export const apExam = pgTable(
  'ap_exam',
  {
    id: text('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en'),
    descriptionZh: text('description_zh'),
    unitCount: integer('unit_count').default(0),
    questionCount: integer('question_count').default(0),
    isPublished: boolean('is_published').default(false),
    coverImage: text('cover_image'),
    sort: integer('sort').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_ap_exam_published').on(table.isPublished),
  ]
);

export const apUnit = pgTable(
  'ap_unit',
  {
    id: text('id').primaryKey(),
    examId: text('exam_id')
      .notNull()
      .references(() => apExam.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    unitNumber: integer('unit_number').notNull(),
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en'),
    descriptionZh: text('description_zh'),
    topicCount: integer('topic_count').default(0),
    questionCount: integer('question_count').default(0),
    examWeight: integer('exam_weight'),
    sort: integer('sort').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_ap_unit_exam').on(table.examId),
    unique('uq_ap_unit_exam_slug').on(table.examId, table.slug),
  ]
);

export const apQuestion = pgTable(
  'ap_question',
  {
    id: text('id').primaryKey(),
    examId: text('exam_id')
      .notNull()
      .references(() => apExam.id, { onDelete: 'cascade' }),
    unitId: text('unit_id')
      .notNull()
      .references(() => apUnit.id, { onDelete: 'cascade' }),
    upgGenerationId: text('upg_generation_id')
      .references(() => upgGeneration.id, { onDelete: 'set null' }),
    questionNumber: integer('question_number').notNull(),
    type: text('type').notNull(), // mcq | frq
    difficulty: text('difficulty').notNull(), // easy | medium | hard
    examFrequency: text('exam_frequency'), // high | medium | low
    stemEn: text('stem_en').notNull(),
    stemZh: text('stem_zh'),
    stemImage: text('stem_image'),
    choicesEn: text('choices_en'), // JSON
    choicesZh: text('choices_zh'), // JSON
    correctAnswer: text('correct_answer').notNull(),
    explanationEn: text('explanation_en').notNull(),
    explanationZh: text('explanation_zh'),
    upgPrompt: text('upg_prompt'),
    tags: text('tags'), // JSON array
    source: text('source'), // original | adapted
    isPublished: boolean('is_published').default(false),
    sort: integer('sort').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_ap_question_exam_unit').on(table.examId, table.unitId),
    index('idx_ap_question_difficulty').on(table.difficulty),
    index('idx_ap_question_type').on(table.type),
    index('idx_ap_question_published').on(table.isPublished, table.examId),
  ]
);

export const apAttempt = pgTable(
  'ap_attempt',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    questionId: text('question_id')
      .notNull()
      .references(() => apQuestion.id, { onDelete: 'cascade' }),
    examId: text('exam_id')
      .notNull()
      .references(() => apExam.id, { onDelete: 'cascade' }),
    unitId: text('unit_id')
      .notNull()
      .references(() => apUnit.id, { onDelete: 'cascade' }),
    selectedAnswer: text('selected_answer').notNull(),
    isCorrect: boolean('is_correct').notNull(),
    timeSpentSeconds: integer('time_spent_seconds'),
    viewedExplanation: boolean('viewed_explanation').default(false),
    viewedUpg: boolean('viewed_upg').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_ap_attempt_user_exam').on(table.userId, table.examId),
    index('idx_ap_attempt_user_question').on(table.userId, table.questionId),
    index('idx_ap_attempt_user_unit').on(table.userId, table.unitId),
    index('idx_ap_attempt_created').on(table.createdAt),
  ]
);

export const apUserProgress = pgTable(
  'ap_user_progress',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    examId: text('exam_id')
      .notNull()
      .references(() => apExam.id, { onDelete: 'cascade' }),
    totalAttempted: integer('total_attempted').default(0).notNull(),
    totalCorrect: integer('total_correct').default(0).notNull(),
    unitBreakdown: text('unit_breakdown'), // JSON
    weakUnits: text('weak_units'), // JSON
    lastAttemptAt: timestamp('last_attempt_at'),
    streakDays: integer('streak_days').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('uq_ap_user_progress_user_exam').on(table.userId, table.examId),
    index('idx_ap_user_progress_user').on(table.userId),
  ]
);

// Type exports for Phase F1
export type ApExam = typeof apExam.$inferSelect;
export type NewApExam = typeof apExam.$inferInsert;
export type ApUnit = typeof apUnit.$inferSelect;
export type NewApUnit = typeof apUnit.$inferInsert;
export type ApQuestion = typeof apQuestion.$inferSelect;
export type NewApQuestion = typeof apQuestion.$inferInsert;
export type ApAttempt = typeof apAttempt.$inferSelect;
export type NewApAttempt = typeof apAttempt.$inferInsert;
export type ApUserProgress = typeof apUserProgress.$inferSelect;
export type NewApUserProgress = typeof apUserProgress.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// Phase F2: Physics Quest (6 tables)
// ═══════════════════════════════════════════════════════════════

export const quest = pgTable(
  'quest',
  {
    id: text('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en').notNull(),
    descriptionZh: text('description_zh').notNull(),
    category: text('category').notNull(), // mechanics/waves/electricity/thermodynamics
    difficulty: text('difficulty').notNull(), // beginner/intermediate/advanced
    tier: text('tier').notNull().default('free'), // free/pro/max
    coverImage: text('cover_image'),
    estimatedMinutes: integer('estimated_minutes').notNull().default(20),
    stepCount: integer('step_count').notNull().default(0),
    experimentId: text('experiment_id').notNull(),
    prerequisiteQuestId: text('prerequisite_quest_id'),
    isWeeklyChallenge: boolean('is_weekly_challenge').default(false),
    weeklyStartDate: text('weekly_start_date'),
    weeklyEndDate: text('weekly_end_date'),
    isPublished: boolean('is_published').default(false),
    sortOrder: integer('sort_order').default(0),
    attemptCount: integer('attempt_count').default(0),
    completionCount: integer('completion_count').default(0),
    avgScore: integer('avg_score').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_quest_category_published').on(table.category, table.isPublished),
    index('idx_quest_experiment').on(table.experimentId),
    index('idx_quest_weekly').on(table.isWeeklyChallenge, table.weeklyStartDate),
    foreignKey({
      columns: [table.prerequisiteQuestId],
      foreignColumns: [table.id],
    }).onDelete('set null'),
  ]
);

export const questStep = pgTable(
  'quest_step',
  {
    id: text('id').primaryKey(),
    questId: text('quest_id')
      .notNull()
      .references(() => quest.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    stepType: text('step_type').notNull(), // knowledge|predict|experiment|compare|explain
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    contentEn: text('content_en').notNull(),
    contentZh: text('content_zh').notNull(),
    config: text('config'), // JSON
    maxPoints: integer('max_points').notNull().default(10),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_quest_step_order').on(table.questId, table.orderIndex),
    index('idx_quest_step_quest').on(table.questId),
  ]
);

export const questAttempt = pgTable(
  'quest_attempt',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    questId: text('quest_id')
      .notNull()
      .references(() => quest.id, { onDelete: 'cascade' }),
    currentStep: integer('current_step').notNull().default(0),
    status: text('status').notNull().default('in_progress'), // in_progress|completed|abandoned
    totalScore: integer('total_score').default(0),
    maxPossibleScore: integer('max_possible_score').default(0),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
    totalTimeSeconds: integer('total_time_seconds').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_quest_attempt_user').on(table.userId),
    index('idx_quest_attempt_quest').on(table.questId),
    index('idx_quest_attempt_user_quest').on(table.userId, table.questId),
    index('idx_quest_attempt_status').on(table.status),
  ]
);

export const questStepResponse = pgTable(
  'quest_step_response',
  {
    id: text('id').primaryKey(),
    attemptId: text('attempt_id')
      .notNull()
      .references(() => questAttempt.id, { onDelete: 'cascade' }),
    stepId: text('step_id')
      .notNull()
      .references(() => questStep.id, { onDelete: 'cascade' }),
    responseType: text('response_type').notNull(), // numeric|choice|text|observation
    responseValue: text('response_value'),
    score: integer('score').default(0),
    maxScore: integer('max_score').notNull(),
    aiFeedback: text('ai_feedback'),
    comparisonData: text('comparison_data'), // JSON
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_quest_step_response_attempt').on(table.attemptId),
    unique('uq_quest_step_response').on(table.attemptId, table.stepId),
  ]
);

export const achievement = pgTable(
  'achievement',
  {
    id: text('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en').notNull(),
    descriptionZh: text('description_zh').notNull(),
    icon: text('icon').notNull(),
    category: text('category').notNull(), // quest|streak|mastery|social
    criteria: text('criteria').notNull(), // JSON
    rarity: text('rarity').notNull().default('common'), // common|rare|epic|legendary
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_achievement_category').on(table.category),
    index('idx_achievement_active').on(table.isActive),
  ]
);

export const userAchievement = pgTable(
  'user_achievement',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    achievementId: text('achievement_id')
      .notNull()
      .references(() => achievement.id, { onDelete: 'cascade' }),
    questAttemptId: text('quest_attempt_id'),
    unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_user_achievement').on(table.userId, table.achievementId),
    index('idx_user_achievement_user').on(table.userId),
  ]
);

// Type exports for Phase F2
export type Quest = typeof quest.$inferSelect;
export type NewQuest = typeof quest.$inferInsert;
export type QuestStep = typeof questStep.$inferSelect;
export type NewQuestStep = typeof questStep.$inferInsert;
export type QuestAttempt = typeof questAttempt.$inferSelect;
export type NewQuestAttempt = typeof questAttempt.$inferInsert;
export type QuestStepResponse = typeof questStepResponse.$inferSelect;
export type NewQuestStepResponse = typeof questStepResponse.$inferInsert;
export type Achievement = typeof achievement.$inferSelect;
export type NewAchievement = typeof achievement.$inferInsert;
export type UserAchievement = typeof userAchievement.$inferSelect;
export type NewUserAchievement = typeof userAchievement.$inferInsert;

// ═══════════════════════════════════════════════════════════════
// Phase F3: Lab Notebook AI (3 tables)
// ═══════════════════════════════════════════════════════════════

export const labNotebook = pgTable(
  'lab_notebook',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    experimentId: text('experiment_id'),
    generationId: text('generation_id')
      .references(() => upgGeneration.id, { onDelete: 'set null' }),
    autopilotSessionId: text('autopilot_session_id')
      .references(() => autopilotSession.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    status: text('status').notNull().default('draft'), // draft|completed|archived
    language: text('language').notNull().default('en'),
    hypothesis: text('hypothesis'), // JSON: SectionContent
    method: text('method'), // JSON
    data: text('data'), // JSON
    analysis: text('analysis'), // JSON
    conclusion: text('conclusion'), // JSON
    aiSuggestionsUsed: integer('ai_suggestions_used').default(0),
    aiModel: text('ai_model'),
    version: integer('version').default(1),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    completedAt: timestamp('completed_at'),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('idx_lab_notebook_user_status').on(table.userId, table.status),
    index('idx_lab_notebook_user_created').on(table.userId, table.createdAt),
    index('idx_lab_notebook_generation').on(table.generationId),
    index('idx_lab_notebook_experiment').on(table.experimentId),
  ]
);

export const labNotebookVersion = pgTable(
  'lab_notebook_version',
  {
    id: text('id').primaryKey(),
    notebookId: text('notebook_id')
      .notNull()
      .references(() => labNotebook.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    hypothesis: text('hypothesis'),
    method: text('method'),
    data: text('data'),
    analysis: text('analysis'),
    conclusion: text('conclusion'),
    changeDescription: text('change_description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_notebook_version').on(table.notebookId, table.version),
    index('idx_notebook_version_notebook').on(table.notebookId),
  ]
);

export const labNotebookExport = pgTable(
  'lab_notebook_export',
  {
    id: text('id').primaryKey(),
    notebookId: text('notebook_id')
      .notNull()
      .references(() => labNotebook.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    format: text('format').notNull().default('pdf'),
    fileUrl: text('file_url'),
    fileSize: integer('file_size'),
    includeWatermark: boolean('include_watermark').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_notebook_export_notebook').on(table.notebookId),
    index('idx_notebook_export_user').on(table.userId),
  ]
);

// Type exports for Phase F3
export type LabNotebook = typeof labNotebook.$inferSelect;
export type NewLabNotebook = typeof labNotebook.$inferInsert;
export type LabNotebookVersion = typeof labNotebookVersion.$inferSelect;
export type NewLabNotebookVersion = typeof labNotebookVersion.$inferInsert;
export type LabNotebookExport = typeof labNotebookExport.$inferSelect;
export type NewLabNotebookExport = typeof labNotebookExport.$inferInsert;
