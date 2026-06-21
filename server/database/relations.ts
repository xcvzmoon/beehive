import { defineRelations } from 'drizzle-orm';
import * as schema from '~/server/database/schema.ts';

export const relations = defineRelations(schema, (r) => ({
  users: {
    accounts: r.many.accounts({ from: r.users.id, to: r.accounts.userId }),
    sessions: r.many.sessions({ from: r.users.id, to: r.sessions.userId }),
    platformOperator: r.one.platformOperators({ from: r.users.id, to: r.platformOperators.userId }),
    createdPlatformOperators: r.many.platformOperators({
      from: r.users.id,
      to: r.platformOperators.createdByUserId,
    }),
    createdOrganizations: r.many.organizations({
      from: r.users.id,
      to: r.organizations.createdByUserId,
    }),
    organizationMembers: r.many.organizationMembers({
      from: r.users.id,
      to: r.organizationMembers.userId,
    }),
    organizationInvites: r.many.organizationInvites({
      from: r.users.id,
      to: r.organizationInvites.createdByUserId,
    }),
    createdWorkspaces: r.many.workspaces({ from: r.users.id, to: r.workspaces.createdByUserId }),
    workspaceMembers: r.many.workspaceMembers({ from: r.users.id, to: r.workspaceMembers.userId }),
    apiKeys: r.many.apiKeys({ from: r.users.id, to: r.apiKeys.createdByUserId }),
    auditLogs: r.many.auditLogs({ from: r.users.id, to: r.auditLogs.actorUserId }),
    aiConfigurations: r.many.aiConfigurations({
      from: r.users.id,
      to: r.aiConfigurations.createdByUserId,
    }),
    aiProviderCredentials: r.many.aiProviderCredentials({
      from: r.users.id,
      to: r.aiProviderCredentials.userId,
    }),
    createdAiProviderCredentials: r.many.aiProviderCredentials({
      from: r.users.id,
      to: r.aiProviderCredentials.createdByUserId,
    }),
    aiChats: r.many.aiChats({ from: r.users.id, to: r.aiChats.createdByUserId }),
    aiMessages: r.many.aiMessages({ from: r.users.id, to: r.aiMessages.createdByUserId }),
    aiEmbeddingRecords: r.many.aiEmbeddingRecords({
      from: r.users.id,
      to: r.aiEmbeddingRecords.userId,
    }),
    aiUsageEvents: r.many.aiUsageEvents({ from: r.users.id, to: r.aiUsageEvents.userId }),
  },
  accounts: {
    user: r.one.users({ from: r.accounts.userId, to: r.users.id, optional: false }),
  },
  sessions: {
    user: r.one.users({ from: r.sessions.userId, to: r.users.id, optional: false }),
  },
  platformOperators: {
    user: r.one.users({ from: r.platformOperators.userId, to: r.users.id, optional: false }),
    createdByUser: r.one.users({ from: r.platformOperators.createdByUserId, to: r.users.id }),
  },
  organizations: {
    createdByUser: r.one.users({ from: r.organizations.createdByUserId, to: r.users.id }),
    members: r.many.organizationMembers({
      from: r.organizations.id,
      to: r.organizationMembers.organizationId,
    }),
    invites: r.many.organizationInvites({
      from: r.organizations.id,
      to: r.organizationInvites.organizationId,
    }),
    workspaces: r.many.workspaces({ from: r.organizations.id, to: r.workspaces.organizationId }),
    apiKeys: r.many.apiKeys({ from: r.organizations.id, to: r.apiKeys.organizationId }),
    billingCustomers: r.many.billingCustomers({
      from: r.organizations.id,
      to: r.billingCustomers.organizationId,
    }),
    subscriptions: r.many.subscriptions({
      from: r.organizations.id,
      to: r.subscriptions.organizationId,
    }),
    auditLogs: r.many.auditLogs({ from: r.organizations.id, to: r.auditLogs.organizationId }),
    aiProviderCredentials: r.many.aiProviderCredentials({
      from: r.organizations.id,
      to: r.aiProviderCredentials.organizationId,
    }),
    aiConfigurations: r.many.aiConfigurations({
      from: r.organizations.id,
      to: r.aiConfigurations.organizationId,
    }),
    aiChats: r.many.aiChats({ from: r.organizations.id, to: r.aiChats.organizationId }),
    aiMessages: r.many.aiMessages({ from: r.organizations.id, to: r.aiMessages.organizationId }),
    aiToolCalls: r.many.aiToolCalls({ from: r.organizations.id, to: r.aiToolCalls.organizationId }),
    aiUsageEvents: r.many.aiUsageEvents({
      from: r.organizations.id,
      to: r.aiUsageEvents.organizationId,
    }),
    aiEmbeddingRecords: r.many.aiEmbeddingRecords({
      from: r.organizations.id,
      to: r.aiEmbeddingRecords.organizationId,
    }),
  },
  organizationMembers: {
    organization: r.one.organizations({
      from: r.organizationMembers.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    user: r.one.users({ from: r.organizationMembers.userId, to: r.users.id, optional: false }),
  },
  organizationInvites: {
    organization: r.one.organizations({
      from: r.organizationInvites.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    createdByUser: r.one.users({ from: r.organizationInvites.createdByUserId, to: r.users.id }),
  },
  workspaces: {
    organization: r.one.organizations({
      from: r.workspaces.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    createdByUser: r.one.users({ from: r.workspaces.createdByUserId, to: r.users.id }),
    members: r.many.workspaceMembers({ from: r.workspaces.id, to: r.workspaceMembers.workspaceId }),
    apiKeys: r.many.apiKeys({ from: r.workspaces.id, to: r.apiKeys.workspaceId }),
    auditLogs: r.many.auditLogs({ from: r.workspaces.id, to: r.auditLogs.workspaceId }),
    aiProviderCredentials: r.many.aiProviderCredentials({
      from: r.workspaces.id,
      to: r.aiProviderCredentials.workspaceId,
    }),
    aiConfigurations: r.many.aiConfigurations({
      from: r.workspaces.id,
      to: r.aiConfigurations.workspaceId,
    }),
    aiChats: r.many.aiChats({ from: r.workspaces.id, to: r.aiChats.workspaceId }),
    aiMessages: r.many.aiMessages({ from: r.workspaces.id, to: r.aiMessages.workspaceId }),
    aiToolCalls: r.many.aiToolCalls({ from: r.workspaces.id, to: r.aiToolCalls.workspaceId }),
    aiUsageEvents: r.many.aiUsageEvents({ from: r.workspaces.id, to: r.aiUsageEvents.workspaceId }),
    aiEmbeddingRecords: r.many.aiEmbeddingRecords({
      from: r.workspaces.id,
      to: r.aiEmbeddingRecords.workspaceId,
    }),
  },
  workspaceMembers: {
    workspace: r.one.workspaces({
      from: r.workspaceMembers.workspaceId,
      to: r.workspaces.id,
      optional: false,
    }),
    user: r.one.users({ from: r.workspaceMembers.userId, to: r.users.id, optional: false }),
  },
  apiKeys: {
    organization: r.one.organizations({
      from: r.apiKeys.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    workspace: r.one.workspaces({ from: r.apiKeys.workspaceId, to: r.workspaces.id }),
    createdByUser: r.one.users({ from: r.apiKeys.createdByUserId, to: r.users.id }),
    auditLogs: r.many.auditLogs({ from: r.apiKeys.id, to: r.auditLogs.apiKeyId }),
    aiUsageEvents: r.many.aiUsageEvents({ from: r.apiKeys.id, to: r.aiUsageEvents.apiKeyId }),
  },
  billingCustomers: {
    organization: r.one.organizations({
      from: r.billingCustomers.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    subscriptions: r.many.subscriptions({
      from: r.billingCustomers.id,
      to: r.subscriptions.billingCustomerId,
    }),
  },
  subscriptions: {
    organization: r.one.organizations({
      from: r.subscriptions.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    billingCustomer: r.one.billingCustomers({
      from: r.subscriptions.billingCustomerId,
      to: r.billingCustomers.id,
    }),
  },
  auditLogs: {
    organization: r.one.organizations({ from: r.auditLogs.organizationId, to: r.organizations.id }),
    workspace: r.one.workspaces({ from: r.auditLogs.workspaceId, to: r.workspaces.id }),
    actorUser: r.one.users({ from: r.auditLogs.actorUserId, to: r.users.id }),
    apiKey: r.one.apiKeys({ from: r.auditLogs.apiKeyId, to: r.apiKeys.id }),
  },
  aiProviders: {
    models: r.many.aiModels({ from: r.aiProviders.id, to: r.aiModels.providerId }),
    credentials: r.many.aiProviderCredentials({
      from: r.aiProviders.id,
      to: r.aiProviderCredentials.providerId,
    }),
    configurations: r.many.aiConfigurations({
      from: r.aiProviders.id,
      to: r.aiConfigurations.providerId,
    }),
    chats: r.many.aiChats({ from: r.aiProviders.id, to: r.aiChats.providerId }),
    usageEvents: r.many.aiUsageEvents({ from: r.aiProviders.id, to: r.aiUsageEvents.providerId }),
  },
  aiModels: {
    provider: r.one.aiProviders({
      from: r.aiModels.providerId,
      to: r.aiProviders.id,
      optional: false,
    }),
    configurations: r.many.aiConfigurations({
      from: r.aiModels.id,
      to: r.aiConfigurations.modelId,
    }),
    embeddingConfigurations: r.many.aiConfigurations({
      from: r.aiModels.id,
      to: r.aiConfigurations.embeddingModelId,
    }),
    chats: r.many.aiChats({ from: r.aiModels.id, to: r.aiChats.modelId }),
    embeddingRecords: r.many.aiEmbeddingRecords({
      from: r.aiModels.id,
      to: r.aiEmbeddingRecords.modelId,
    }),
    usageEvents: r.many.aiUsageEvents({ from: r.aiModels.id, to: r.aiUsageEvents.modelId }),
  },
  aiProviderCredentials: {
    organization: r.one.organizations({
      from: r.aiProviderCredentials.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    workspace: r.one.workspaces({ from: r.aiProviderCredentials.workspaceId, to: r.workspaces.id }),
    user: r.one.users({ from: r.aiProviderCredentials.userId, to: r.users.id }),
    createdByUser: r.one.users({ from: r.aiProviderCredentials.createdByUserId, to: r.users.id }),
    provider: r.one.aiProviders({
      from: r.aiProviderCredentials.providerId,
      to: r.aiProviders.id,
      optional: false,
    }),
    configurations: r.many.aiConfigurations({
      from: r.aiProviderCredentials.id,
      to: r.aiConfigurations.credentialId,
    }),
  },
  aiConfigurations: {
    organization: r.one.organizations({
      from: r.aiConfigurations.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    workspace: r.one.workspaces({
      from: r.aiConfigurations.workspaceId,
      to: r.workspaces.id,
      optional: false,
    }),
    createdByUser: r.one.users({ from: r.aiConfigurations.createdByUserId, to: r.users.id }),
    provider: r.one.aiProviders({
      from: r.aiConfigurations.providerId,
      to: r.aiProviders.id,
      optional: false,
    }),
    model: r.one.aiModels({ from: r.aiConfigurations.modelId, to: r.aiModels.id, optional: false }),
    credential: r.one.aiProviderCredentials({
      from: r.aiConfigurations.credentialId,
      to: r.aiProviderCredentials.id,
    }),
    embeddingModel: r.one.aiModels({
      from: r.aiConfigurations.embeddingModelId,
      to: r.aiModels.id,
    }),
    chats: r.many.aiChats({ from: r.aiConfigurations.id, to: r.aiChats.configurationId }),
  },
  aiChats: {
    organization: r.one.organizations({
      from: r.aiChats.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    workspace: r.one.workspaces({
      from: r.aiChats.workspaceId,
      to: r.workspaces.id,
      optional: false,
    }),
    createdByUser: r.one.users({ from: r.aiChats.createdByUserId, to: r.users.id }),
    configuration: r.one.aiConfigurations({
      from: r.aiChats.configurationId,
      to: r.aiConfigurations.id,
    }),
    aiProvider: r.one.aiProviders({ from: r.aiChats.providerId, to: r.aiProviders.id }),
    aiModel: r.one.aiModels({ from: r.aiChats.modelId, to: r.aiModels.id }),
    messages: r.many.aiMessages({ from: r.aiChats.id, to: r.aiMessages.chatId }),
    embeddingRecords: r.many.aiEmbeddingRecords({
      from: r.aiChats.id,
      to: r.aiEmbeddingRecords.chatId,
    }),
    usageEvents: r.many.aiUsageEvents({ from: r.aiChats.id, to: r.aiUsageEvents.chatId }),
  },
  aiMessages: {
    organization: r.one.organizations({
      from: r.aiMessages.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    workspace: r.one.workspaces({
      from: r.aiMessages.workspaceId,
      to: r.workspaces.id,
      optional: false,
    }),
    createdByUser: r.one.users({ from: r.aiMessages.createdByUserId, to: r.users.id }),
    chat: r.one.aiChats({ from: r.aiMessages.chatId, to: r.aiChats.id, optional: false }),
    toolCalls: r.many.aiToolCalls({ from: r.aiMessages.id, to: r.aiToolCalls.messageId }),
    embeddingRecords: r.many.aiEmbeddingRecords({
      from: r.aiMessages.id,
      to: r.aiEmbeddingRecords.messageId,
    }),
    usageEvents: r.many.aiUsageEvents({ from: r.aiMessages.id, to: r.aiUsageEvents.messageId }),
  },
  aiToolCalls: {
    organization: r.one.organizations({
      from: r.aiToolCalls.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    workspace: r.one.workspaces({
      from: r.aiToolCalls.workspaceId,
      to: r.workspaces.id,
      optional: false,
    }),
    message: r.one.aiMessages({
      from: r.aiToolCalls.messageId,
      to: r.aiMessages.id,
      optional: false,
    }),
  },
  aiUsageEvents: {
    organization: r.one.organizations({
      from: r.aiUsageEvents.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    workspace: r.one.workspaces({ from: r.aiUsageEvents.workspaceId, to: r.workspaces.id }),
    user: r.one.users({ from: r.aiUsageEvents.userId, to: r.users.id }),
    apiKey: r.one.apiKeys({ from: r.aiUsageEvents.apiKeyId, to: r.apiKeys.id }),
    chat: r.one.aiChats({ from: r.aiUsageEvents.chatId, to: r.aiChats.id }),
    message: r.one.aiMessages({ from: r.aiUsageEvents.messageId, to: r.aiMessages.id }),
    provider: r.one.aiProviders({ from: r.aiUsageEvents.providerId, to: r.aiProviders.id }),
    model: r.one.aiModels({ from: r.aiUsageEvents.modelId, to: r.aiModels.id }),
  },
  aiEmbeddingRecords: {
    organization: r.one.organizations({
      from: r.aiEmbeddingRecords.organizationId,
      to: r.organizations.id,
      optional: false,
    }),
    workspace: r.one.workspaces({
      from: r.aiEmbeddingRecords.workspaceId,
      to: r.workspaces.id,
      optional: false,
    }),
    user: r.one.users({ from: r.aiEmbeddingRecords.userId, to: r.users.id }),
    chat: r.one.aiChats({ from: r.aiEmbeddingRecords.chatId, to: r.aiChats.id }),
    message: r.one.aiMessages({ from: r.aiEmbeddingRecords.messageId, to: r.aiMessages.id }),
    aiModel: r.one.aiModels({ from: r.aiEmbeddingRecords.modelId, to: r.aiModels.id }),
    vector384: r.one.aiEmbeddingVectors384({
      from: r.aiEmbeddingRecords.id,
      to: r.aiEmbeddingVectors384.recordId,
    }),
    vector768: r.one.aiEmbeddingVectors768({
      from: r.aiEmbeddingRecords.id,
      to: r.aiEmbeddingVectors768.recordId,
    }),
    vector1024: r.one.aiEmbeddingVectors1024({
      from: r.aiEmbeddingRecords.id,
      to: r.aiEmbeddingVectors1024.recordId,
    }),
    vector1536: r.one.aiEmbeddingVectors1536({
      from: r.aiEmbeddingRecords.id,
      to: r.aiEmbeddingVectors1536.recordId,
    }),
    vector3072: r.one.aiEmbeddingVectors3072({
      from: r.aiEmbeddingRecords.id,
      to: r.aiEmbeddingVectors3072.recordId,
    }),
  },
  aiEmbeddingVectors384: {
    record: r.one.aiEmbeddingRecords({
      from: r.aiEmbeddingVectors384.recordId,
      to: r.aiEmbeddingRecords.id,
      optional: false,
    }),
  },
  aiEmbeddingVectors768: {
    record: r.one.aiEmbeddingRecords({
      from: r.aiEmbeddingVectors768.recordId,
      to: r.aiEmbeddingRecords.id,
      optional: false,
    }),
  },
  aiEmbeddingVectors1024: {
    record: r.one.aiEmbeddingRecords({
      from: r.aiEmbeddingVectors1024.recordId,
      to: r.aiEmbeddingRecords.id,
      optional: false,
    }),
  },
  aiEmbeddingVectors1536: {
    record: r.one.aiEmbeddingRecords({
      from: r.aiEmbeddingVectors1536.recordId,
      to: r.aiEmbeddingRecords.id,
      optional: false,
    }),
  },
  aiEmbeddingVectors3072: {
    record: r.one.aiEmbeddingRecords({
      from: r.aiEmbeddingVectors3072.recordId,
      to: r.aiEmbeddingRecords.id,
      optional: false,
    }),
  },
}));
