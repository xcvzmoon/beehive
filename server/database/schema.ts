import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  foreignKey,
  halfvec,
  index,
  integer,
  jsonb,
  pgSchema,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';
import { generateTimestamps } from '~/server/database/utils/generate-timestamps.ts';
import { generateUUID } from '~/server/database/utils/generate-uuid.ts';

const beehive = pgSchema('beehive');

export const users = beehive.table('users', {
  ...generateUUID(),
  ...generateTimestamps(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
});

export const sessions = beehive.table(
  'sessions',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const accounts = beehive.table(
  'accounts',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verifications = beehive.table(
  'verifications',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const platformOperators = beehive.table(
  'platform_operators',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role').notNull().default('support'),
    scopes: jsonb('scopes'),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    lastUsedAt: timestamp('last_used_at'),
    disabledAt: timestamp('disabled_at'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('platform_operator_userId_idx').on(table.userId),
    index('platform_operator_createdByUserId_idx').on(table.createdByUserId),
  ],
);

export const organizations = beehive.table(
  'organizations',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    image: text('image'),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('organization_slug_idx').on(table.slug),
    index('organization_createdByUserId_idx').on(table.createdByUserId),
  ],
);

export const organizationMembers = beehive.table(
  'organization_members',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role').notNull().default('viewer'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    check(
      'organization_member_role_check',
      sql`${table.role} IN ('owner', 'admin', 'billing_admin', 'security_admin', 'member')`,
    ),
    uniqueIndex('organization_member_organizationId_userId_idx').on(
      table.organizationId,
      table.userId,
    ),
    index('organization_member_userId_idx').on(table.userId),
  ],
);

export const organizationInvites = beehive.table(
  'organization_invites',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role').notNull().default('member'),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    acceptedAt: timestamp('accepted_at'),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('organization_invite_token_idx').on(table.token),
    index('organization_invite_organizationId_idx').on(table.organizationId),
    index('organization_invite_email_idx').on(table.email),
  ],
);

export const workspaces = beehive.table(
  'workspaces',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('workspace_id_organizationId_idx').on(table.id, table.organizationId),
    uniqueIndex('workspace_organizationId_slug_idx').on(table.organizationId, table.slug),
    index('workspace_organizationId_idx').on(table.organizationId),
    index('workspace_createdByUserId_idx').on(table.createdByUserId),
  ],
);

export const workspaceMembers = beehive.table(
  'workspace_members',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role').notNull().default('member'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    check(
      'workspace_member_role_check',
      sql`${table.role} IN ('owner', 'developer', 'operator', 'analyst', 'viewer')`,
    ),
    foreignKey({
      name: 'workspace_member_workspace_organization_fkey',
      columns: [table.workspaceId, table.organizationId],
      foreignColumns: [workspaces.id, workspaces.organizationId],
    }).onDelete('cascade'),
    foreignKey({
      name: 'workspace_member_organization_user_fkey',
      columns: [table.organizationId, table.userId],
      foreignColumns: [organizationMembers.organizationId, organizationMembers.userId],
    }).onDelete('cascade'),
    uniqueIndex('workspace_member_workspaceId_userId_idx').on(table.workspaceId, table.userId),
    index('workspace_member_organizationId_idx').on(table.organizationId),
    index('workspace_member_userId_idx').on(table.userId),
  ],
);

export const apiKeys = beehive.table(
  'api_keys',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    name: text('name').notNull(),
    keyPrefix: text('key_prefix').notNull(),
    keyHash: text('key_hash').notNull(),
    scopes: jsonb('scopes').notNull().default([]),
    lastUsedAt: timestamp('last_used_at'),
    expiresAt: timestamp('expires_at'),
    revokedAt: timestamp('revoked_at'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    check('api_key_scopes_array_check', sql`jsonb_typeof(${table.scopes}) = 'array'`),
    foreignKey({
      name: 'api_key_workspace_organization_fkey',
      columns: [table.workspaceId, table.organizationId],
      foreignColumns: [workspaces.id, workspaces.organizationId],
    }).onDelete('cascade'),
    uniqueIndex('api_key_keyHash_idx').on(table.keyHash),
    index('api_key_organizationId_idx').on(table.organizationId),
    index('api_key_workspaceId_idx').on(table.workspaceId),
    index('api_key_createdByUserId_idx').on(table.createdByUserId),
  ],
);

export const billingCustomers = beehive.table(
  'billing_customers',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(),
    providerCustomerId: text('provider_customer_id').notNull(),
    email: text('email'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('billing_customer_provider_providerCustomerId_idx').on(
      table.provider,
      table.providerCustomerId,
    ),
    uniqueIndex('billing_customer_organizationId_provider_idx').on(
      table.organizationId,
      table.provider,
    ),
  ],
);

export const subscriptions = beehive.table(
  'subscriptions',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    billingCustomerId: uuid('billing_customer_id').references(() => billingCustomers.id, {
      onDelete: 'set null',
    }),
    providerSubscriptionId: text('provider_subscription_id'),
    status: text('status').notNull(),
    plan: text('plan').notNull(),
    currentPeriodStart: timestamp('current_period_start'),
    currentPeriodEnd: timestamp('current_period_end'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('subscription_providerSubscriptionId_idx').on(table.providerSubscriptionId),
    index('subscription_organizationId_idx').on(table.organizationId),
    index('subscription_billingCustomerId_idx').on(table.billingCustomerId),
  ],
);

export const auditLogs = beehive.table(
  'audit_logs',
  {
    ...generateUUID(),
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true }).notNull().defaultNow(),
    organizationId: uuid('organization_id').references(() => organizations.id, {
      onDelete: 'set null',
    }),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'set null' }),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    apiKeyId: uuid('api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    targetType: text('target_type'),
    targetId: uuid('target_id'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('audit_log_organizationId_idx').on(table.organizationId),
    index('audit_log_workspaceId_idx').on(table.workspaceId),
    index('audit_log_actorUserId_idx').on(table.actorUserId),
    index('audit_log_apiKeyId_idx').on(table.apiKeyId),
    index('audit_log_action_idx').on(table.action),
  ],
);

export const aiProviders = beehive.table(
  'ai_providers',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    key: text('key').notNull(),
    displayName: text('display_name').notNull(),
    type: text('type').notNull().default('openai-compatible'),
    baseUrl: text('base_url'),
    enabled: boolean('enabled').notNull().default(true),
    metadata: jsonb('metadata'),
  },
  (table) => [uniqueIndex('ai_provider_key_idx').on(table.key)],
);

export const aiModels = beehive.table(
  'ai_models',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    providerId: uuid('provider_id')
      .notNull()
      .references(() => aiProviders.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    displayName: text('display_name'),
    kind: text('kind').notNull().default('chat'),
    contextWindow: integer('context_window'),
    maxOutputTokens: integer('max_output_tokens'),
    inputTokenCostMicros: integer('input_token_cost_micros'),
    outputTokenCostMicros: integer('output_token_cost_micros'),
    embeddingDimensions: integer('embedding_dimensions'),
    supportsStreaming: boolean('supports_streaming').notNull().default(true),
    supportsTools: boolean('supports_tools').notNull().default(false),
    supportsVision: boolean('supports_vision').notNull().default(false),
    enabled: boolean('enabled').notNull().default(true),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('ai_model_providerId_name_idx').on(table.providerId, table.name),
    index('ai_model_providerId_idx').on(table.providerId),
  ],
);

export const aiProviderCredentials = beehive.table(
  'ai_provider_credentials',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    providerId: uuid('provider_id')
      .notNull()
      .references(() => aiProviders.id, { onDelete: 'cascade' }),
    label: text('label').notNull().default('default'),
    apiKeyEncrypted: text('api_key_encrypted'),
    apiKeyIv: text('api_key_iv'),
    apiKeyTag: text('api_key_tag'),
    keyVersion: integer('key_version').notNull().default(1),
    enabled: boolean('enabled').notNull().default(true),
    lastValidatedAt: timestamp('last_validated_at'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('ai_provider_credential_scope_label_idx').on(
      table.organizationId,
      table.workspaceId,
      table.userId,
      table.providerId,
      table.label,
    ),
    index('ai_provider_credential_organizationId_idx').on(table.organizationId),
    index('ai_provider_credential_workspaceId_idx').on(table.workspaceId),
    index('ai_provider_credential_userId_idx').on(table.userId),
    index('ai_provider_credential_providerId_idx').on(table.providerId),
  ],
);

export const aiConfigurations = beehive.table(
  'ai_configurations',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    providerId: uuid('provider_id')
      .notNull()
      .references(() => aiProviders.id, { onDelete: 'restrict' }),
    modelId: uuid('model_id')
      .notNull()
      .references(() => aiModels.id, { onDelete: 'restrict' }),
    credentialId: uuid('credential_id').references(() => aiProviderCredentials.id, {
      onDelete: 'set null',
    }),
    embeddingModelId: uuid('embedding_model_id').references(() => aiModels.id, {
      onDelete: 'set null',
    }),
    name: text('name').notNull().default('default'),
    isDefault: boolean('is_default').notNull().default(false),
    baseUrlOverride: text('base_url_override'),
    systemPrompt: text('system_prompt'),
    temperature: real('temperature'),
    topP: real('top_p'),
    maxOutputTokens: integer('max_output_tokens'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    uniqueIndex('ai_configuration_workspaceId_name_idx').on(table.workspaceId, table.name),
    index('ai_configuration_organizationId_idx').on(table.organizationId),
    index('ai_configuration_workspaceId_idx').on(table.workspaceId),
    index('ai_configuration_createdByUserId_idx').on(table.createdByUserId),
    index('ai_configuration_providerId_idx').on(table.providerId),
    index('ai_configuration_modelId_idx').on(table.modelId),
  ],
);

export const aiChats = beehive.table(
  'ai_chats',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    configurationId: uuid('configuration_id').references(() => aiConfigurations.id, {
      onDelete: 'set null',
    }),
    providerId: uuid('provider_id').references(() => aiProviders.id, { onDelete: 'set null' }),
    modelId: uuid('model_id').references(() => aiModels.id, { onDelete: 'set null' }),
    title: text('title').notNull().default('New chat'),
    status: text('status').notNull().default('active'),
    provider: text('provider').notNull(),
    model: text('model').notNull(),
    systemPrompt: text('system_prompt'),
    temperature: real('temperature'),
    topP: real('top_p'),
    maxOutputTokens: integer('max_output_tokens'),
    inputTokens: integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    totalTokens: integer('total_tokens').notNull().default(0),
    lastMessageAt: timestamp('last_message_at'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('ai_chat_organizationId_idx').on(table.organizationId),
    index('ai_chat_workspaceId_idx').on(table.workspaceId),
    index('ai_chat_createdByUserId_idx').on(table.createdByUserId),
    index('ai_chat_configurationId_idx').on(table.configurationId),
    index('ai_chat_providerId_idx').on(table.providerId),
    index('ai_chat_modelId_idx').on(table.modelId),
  ],
);

export const aiMessages = beehive.table(
  'ai_messages',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    chatId: uuid('chat_id')
      .notNull()
      .references(() => aiChats.id, { onDelete: 'cascade' }),
    parentMessageId: uuid('parent_message_id'),
    role: text('role').notNull(),
    status: text('status').notNull().default('completed'),
    content: text('content').notNull(),
    parts: jsonb('parts'),
    model: text('model'),
    providerMessageId: text('provider_message_id'),
    finishReason: text('finish_reason'),
    error: text('error'),
    inputTokens: integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    totalTokens: integer('total_tokens').notNull().default(0),
    tokenCount: integer('token_count').notNull().default(0),
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('ai_message_organizationId_idx').on(table.organizationId),
    index('ai_message_workspaceId_idx').on(table.workspaceId),
    index('ai_message_createdByUserId_idx').on(table.createdByUserId),
    index('ai_message_chatId_idx').on(table.chatId),
    index('ai_message_parentMessageId_idx').on(table.parentMessageId),
  ],
);

export const aiToolCalls = beehive.table(
  'ai_tool_calls',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    messageId: uuid('message_id')
      .notNull()
      .references(() => aiMessages.id, { onDelete: 'cascade' }),
    providerToolCallId: text('provider_tool_call_id'),
    toolName: text('tool_name').notNull(),
    arguments: jsonb('arguments').notNull(),
    result: jsonb('result'),
    status: text('status').notNull().default('pending'),
    error: text('error'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('ai_tool_call_organizationId_idx').on(table.organizationId),
    index('ai_tool_call_workspaceId_idx').on(table.workspaceId),
    index('ai_tool_call_messageId_idx').on(table.messageId),
    index('ai_tool_call_toolName_idx').on(table.toolName),
  ],
);

export const aiUsageEvents = beehive.table(
  'ai_usage_events',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'set null' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    apiKeyId: uuid('api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),
    chatId: uuid('chat_id').references(() => aiChats.id, { onDelete: 'set null' }),
    messageId: uuid('message_id').references(() => aiMessages.id, { onDelete: 'set null' }),
    providerId: uuid('provider_id').references(() => aiProviders.id, { onDelete: 'set null' }),
    modelId: uuid('model_id').references(() => aiModels.id, { onDelete: 'set null' }),
    operation: text('operation').notNull(),
    inputTokens: integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    totalTokens: integer('total_tokens').notNull().default(0),
    costMicros: integer('cost_micros'),
    latencyMs: integer('latency_ms'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('ai_usage_event_organizationId_idx').on(table.organizationId),
    index('ai_usage_event_workspaceId_idx').on(table.workspaceId),
    index('ai_usage_event_userId_idx').on(table.userId),
    index('ai_usage_event_apiKeyId_idx').on(table.apiKeyId),
    index('ai_usage_event_chatId_idx').on(table.chatId),
    index('ai_usage_event_providerId_idx').on(table.providerId),
    index('ai_usage_event_modelId_idx').on(table.modelId),
  ],
);

export const aiEmbeddingRecords = beehive.table(
  'ai_embedding_records',
  {
    ...generateUUID(),
    ...generateTimestamps(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    chatId: uuid('chat_id').references(() => aiChats.id, { onDelete: 'cascade' }),
    messageId: uuid('message_id').references(() => aiMessages.id, { onDelete: 'cascade' }),
    modelId: uuid('model_id').references(() => aiModels.id, { onDelete: 'set null' }),
    content: text('content').notNull(),
    model: text('model').notNull(),
    dimensions: integer('dimensions').notNull(),
    tokenCount: integer('token_count').notNull().default(0),
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('ai_embedding_record_organizationId_idx').on(table.organizationId),
    index('ai_embedding_record_workspaceId_idx').on(table.workspaceId),
    index('ai_embedding_record_userId_idx').on(table.userId),
    index('ai_embedding_record_chatId_idx').on(table.chatId),
    index('ai_embedding_record_messageId_idx').on(table.messageId),
    index('ai_embedding_record_modelId_idx').on(table.modelId),
    index('ai_embedding_record_dimensions_idx').on(table.dimensions),
  ],
);

export const aiEmbeddingVectors384 = beehive.table('ai_embedding_vectors_384', {
  recordId: uuid('record_id')
    .primaryKey()
    .references(() => aiEmbeddingRecords.id, { onDelete: 'cascade' }),
  embedding: vector('embedding', { dimensions: 384 }).notNull(),
});

export const aiEmbeddingVectors768 = beehive.table('ai_embedding_vectors_768', {
  recordId: uuid('record_id')
    .primaryKey()
    .references(() => aiEmbeddingRecords.id, { onDelete: 'cascade' }),
  embedding: vector('embedding', { dimensions: 768 }).notNull(),
});

export const aiEmbeddingVectors1024 = beehive.table('ai_embedding_vectors_1024', {
  recordId: uuid('record_id')
    .primaryKey()
    .references(() => aiEmbeddingRecords.id, { onDelete: 'cascade' }),
  embedding: vector('embedding', { dimensions: 1024 }).notNull(),
});

export const aiEmbeddingVectors1536 = beehive.table('ai_embedding_vectors_1536', {
  recordId: uuid('record_id')
    .primaryKey()
    .references(() => aiEmbeddingRecords.id, { onDelete: 'cascade' }),
  embedding: vector('embedding', { dimensions: 1536 }).notNull(),
});

export const aiEmbeddingVectors3072 = beehive.table('ai_embedding_vectors_3072', {
  recordId: uuid('record_id')
    .primaryKey()
    .references(() => aiEmbeddingRecords.id, { onDelete: 'cascade' }),
  embedding: halfvec('embedding', { dimensions: 3072 }).notNull(),
});
