CREATE SCHEMA IF NOT EXISTS "beehive";
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "beehive"."accounts" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_chats" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_by_user_id" uuid,
	"configuration_id" uuid,
	"provider_id" uuid,
	"model_id" uuid,
	"title" text DEFAULT 'New chat' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"system_prompt" text,
	"temperature" real,
	"top_p" real,
	"max_output_tokens" integer,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"last_message_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_configurations" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_by_user_id" uuid,
	"provider_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"credential_id" uuid,
	"embedding_model_id" uuid,
	"name" text DEFAULT 'default' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"base_url_override" text,
	"system_prompt" text,
	"temperature" real,
	"top_p" real,
	"max_output_tokens" integer,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_embedding_records" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" uuid,
	"chat_id" uuid,
	"message_id" uuid,
	"model_id" uuid,
	"content" text NOT NULL,
	"model" text NOT NULL,
	"dimensions" integer NOT NULL,
	"token_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_embedding_vectors_1024" (
	"record_id" uuid PRIMARY KEY,
	"embedding" vector(1024) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_embedding_vectors_1536" (
	"record_id" uuid PRIMARY KEY,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_embedding_vectors_3072" (
	"record_id" uuid PRIMARY KEY,
	"embedding" halfvec(3072) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_embedding_vectors_384" (
	"record_id" uuid PRIMARY KEY,
	"embedding" vector(384) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_embedding_vectors_768" (
	"record_id" uuid PRIMARY KEY,
	"embedding" vector(768) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_messages" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"created_by_user_id" uuid,
	"chat_id" uuid NOT NULL,
	"parent_message_id" uuid,
	"role" text NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"content" text NOT NULL,
	"parts" jsonb,
	"model" text,
	"provider_message_id" text,
	"finish_reason" text,
	"error" text,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"token_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_models" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"provider_id" uuid NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"kind" text DEFAULT 'chat' NOT NULL,
	"context_window" integer,
	"max_output_tokens" integer,
	"input_token_cost_micros" integer,
	"output_token_cost_micros" integer,
	"embedding_dimensions" integer,
	"supports_streaming" boolean DEFAULT true NOT NULL,
	"supports_tools" boolean DEFAULT false NOT NULL,
	"supports_vision" boolean DEFAULT false NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_provider_credentials" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid,
	"user_id" uuid,
	"created_by_user_id" uuid,
	"provider_id" uuid NOT NULL,
	"label" text DEFAULT 'default' NOT NULL,
	"api_key_encrypted" text,
	"api_key_iv" text,
	"api_key_tag" text,
	"key_version" integer DEFAULT 1 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"last_validated_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_providers" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"key" text NOT NULL,
	"display_name" text NOT NULL,
	"type" text DEFAULT 'openai-compatible' NOT NULL,
	"base_url" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_tool_calls" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"provider_tool_call_id" text,
	"tool_name" text NOT NULL,
	"arguments" jsonb NOT NULL,
	"result" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"error" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."ai_usage_events" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid,
	"user_id" uuid,
	"api_key_id" uuid,
	"chat_id" uuid,
	"message_id" uuid,
	"provider_id" uuid,
	"model_id" uuid,
	"operation" text NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"cost_micros" integer,
	"latency_ms" integer,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."api_keys" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid,
	"created_by_user_id" uuid,
	"name" text NOT NULL,
	"key_prefix" text NOT NULL,
	"key_hash" text NOT NULL,
	"scopes" jsonb,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"revoked_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."audit_logs" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid,
	"workspace_id" uuid,
	"actor_user_id" uuid,
	"api_key_id" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" uuid,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."billing_customers" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_customer_id" text NOT NULL,
	"email" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."organization_invites" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_by_user_id" uuid,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."organization_members" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."organizations" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image" text,
	"created_by_user_id" uuid,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."platform_operators" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'support' NOT NULL,
	"scopes" jsonb,
	"created_by_user_id" uuid,
	"last_used_at" timestamp,
	"disabled_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."sessions" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL UNIQUE,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beehive"."subscriptions" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"billing_customer_id" uuid,
	"provider_subscription_id" text,
	"status" text NOT NULL,
	"plan" text NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."users" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "beehive"."verifications" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beehive"."workspace_members" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "beehive"."workspaces" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_by_user_id" uuid,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "beehive"."accounts" ("user_id");--> statement-breakpoint
CREATE INDEX "ai_chat_organizationId_idx" ON "beehive"."ai_chats" ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_chat_workspaceId_idx" ON "beehive"."ai_chats" ("workspace_id");--> statement-breakpoint
CREATE INDEX "ai_chat_createdByUserId_idx" ON "beehive"."ai_chats" ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "ai_chat_configurationId_idx" ON "beehive"."ai_chats" ("configuration_id");--> statement-breakpoint
CREATE INDEX "ai_chat_providerId_idx" ON "beehive"."ai_chats" ("provider_id");--> statement-breakpoint
CREATE INDEX "ai_chat_modelId_idx" ON "beehive"."ai_chats" ("model_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_configuration_workspaceId_name_idx" ON "beehive"."ai_configurations" ("workspace_id","name");--> statement-breakpoint
CREATE INDEX "ai_configuration_organizationId_idx" ON "beehive"."ai_configurations" ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_configuration_workspaceId_idx" ON "beehive"."ai_configurations" ("workspace_id");--> statement-breakpoint
CREATE INDEX "ai_configuration_createdByUserId_idx" ON "beehive"."ai_configurations" ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "ai_configuration_providerId_idx" ON "beehive"."ai_configurations" ("provider_id");--> statement-breakpoint
CREATE INDEX "ai_configuration_modelId_idx" ON "beehive"."ai_configurations" ("model_id");--> statement-breakpoint
CREATE INDEX "ai_embedding_record_organizationId_idx" ON "beehive"."ai_embedding_records" ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_embedding_record_workspaceId_idx" ON "beehive"."ai_embedding_records" ("workspace_id");--> statement-breakpoint
CREATE INDEX "ai_embedding_record_userId_idx" ON "beehive"."ai_embedding_records" ("user_id");--> statement-breakpoint
CREATE INDEX "ai_embedding_record_chatId_idx" ON "beehive"."ai_embedding_records" ("chat_id");--> statement-breakpoint
CREATE INDEX "ai_embedding_record_messageId_idx" ON "beehive"."ai_embedding_records" ("message_id");--> statement-breakpoint
CREATE INDEX "ai_embedding_record_modelId_idx" ON "beehive"."ai_embedding_records" ("model_id");--> statement-breakpoint
CREATE INDEX "ai_embedding_record_dimensions_idx" ON "beehive"."ai_embedding_records" ("dimensions");--> statement-breakpoint
CREATE INDEX "ai_embedding_vectors_384_embedding_idx" ON "beehive"."ai_embedding_vectors_384" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "ai_embedding_vectors_768_embedding_idx" ON "beehive"."ai_embedding_vectors_768" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "ai_embedding_vectors_1024_embedding_idx" ON "beehive"."ai_embedding_vectors_1024" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "ai_embedding_vectors_1536_embedding_idx" ON "beehive"."ai_embedding_vectors_1536" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "ai_embedding_vectors_3072_embedding_idx" ON "beehive"."ai_embedding_vectors_3072" USING hnsw ("embedding" halfvec_cosine_ops);--> statement-breakpoint
CREATE INDEX "ai_message_organizationId_idx" ON "beehive"."ai_messages" ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_message_workspaceId_idx" ON "beehive"."ai_messages" ("workspace_id");--> statement-breakpoint
CREATE INDEX "ai_message_createdByUserId_idx" ON "beehive"."ai_messages" ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "ai_message_chatId_idx" ON "beehive"."ai_messages" ("chat_id");--> statement-breakpoint
CREATE INDEX "ai_message_parentMessageId_idx" ON "beehive"."ai_messages" ("parent_message_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_model_providerId_name_idx" ON "beehive"."ai_models" ("provider_id","name");--> statement-breakpoint
CREATE INDEX "ai_model_providerId_idx" ON "beehive"."ai_models" ("provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_provider_credential_scope_label_idx" ON "beehive"."ai_provider_credentials" ("organization_id","workspace_id","user_id","provider_id","label");--> statement-breakpoint
CREATE INDEX "ai_provider_credential_organizationId_idx" ON "beehive"."ai_provider_credentials" ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_provider_credential_workspaceId_idx" ON "beehive"."ai_provider_credentials" ("workspace_id");--> statement-breakpoint
CREATE INDEX "ai_provider_credential_userId_idx" ON "beehive"."ai_provider_credentials" ("user_id");--> statement-breakpoint
CREATE INDEX "ai_provider_credential_providerId_idx" ON "beehive"."ai_provider_credentials" ("provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_provider_key_idx" ON "beehive"."ai_providers" ("key");--> statement-breakpoint
CREATE INDEX "ai_tool_call_organizationId_idx" ON "beehive"."ai_tool_calls" ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_tool_call_workspaceId_idx" ON "beehive"."ai_tool_calls" ("workspace_id");--> statement-breakpoint
CREATE INDEX "ai_tool_call_messageId_idx" ON "beehive"."ai_tool_calls" ("message_id");--> statement-breakpoint
CREATE INDEX "ai_tool_call_toolName_idx" ON "beehive"."ai_tool_calls" ("tool_name");--> statement-breakpoint
CREATE INDEX "ai_usage_event_organizationId_idx" ON "beehive"."ai_usage_events" ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_usage_event_workspaceId_idx" ON "beehive"."ai_usage_events" ("workspace_id");--> statement-breakpoint
CREATE INDEX "ai_usage_event_userId_idx" ON "beehive"."ai_usage_events" ("user_id");--> statement-breakpoint
CREATE INDEX "ai_usage_event_apiKeyId_idx" ON "beehive"."ai_usage_events" ("api_key_id");--> statement-breakpoint
CREATE INDEX "ai_usage_event_chatId_idx" ON "beehive"."ai_usage_events" ("chat_id");--> statement-breakpoint
CREATE INDEX "ai_usage_event_providerId_idx" ON "beehive"."ai_usage_events" ("provider_id");--> statement-breakpoint
CREATE INDEX "ai_usage_event_modelId_idx" ON "beehive"."ai_usage_events" ("model_id");--> statement-breakpoint
CREATE UNIQUE INDEX "api_key_keyHash_idx" ON "beehive"."api_keys" ("key_hash");--> statement-breakpoint
CREATE INDEX "api_key_organizationId_idx" ON "beehive"."api_keys" ("organization_id");--> statement-breakpoint
CREATE INDEX "api_key_workspaceId_idx" ON "beehive"."api_keys" ("workspace_id");--> statement-breakpoint
CREATE INDEX "api_key_createdByUserId_idx" ON "beehive"."api_keys" ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "audit_log_organizationId_idx" ON "beehive"."audit_logs" ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_log_workspaceId_idx" ON "beehive"."audit_logs" ("workspace_id");--> statement-breakpoint
CREATE INDEX "audit_log_actorUserId_idx" ON "beehive"."audit_logs" ("actor_user_id");--> statement-breakpoint
CREATE INDEX "audit_log_apiKeyId_idx" ON "beehive"."audit_logs" ("api_key_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "beehive"."audit_logs" ("action");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_customer_provider_providerCustomerId_idx" ON "beehive"."billing_customers" ("provider","provider_customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_customer_organizationId_provider_idx" ON "beehive"."billing_customers" ("organization_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_invite_token_idx" ON "beehive"."organization_invites" ("token");--> statement-breakpoint
CREATE INDEX "organization_invite_organizationId_idx" ON "beehive"."organization_invites" ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_invite_email_idx" ON "beehive"."organization_invites" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_member_organizationId_userId_idx" ON "beehive"."organization_members" ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "organization_member_userId_idx" ON "beehive"."organization_members" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_idx" ON "beehive"."organizations" ("slug");--> statement-breakpoint
CREATE INDEX "organization_createdByUserId_idx" ON "beehive"."organizations" ("created_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "platform_operator_userId_idx" ON "beehive"."platform_operators" ("user_id");--> statement-breakpoint
CREATE INDEX "platform_operator_createdByUserId_idx" ON "beehive"."platform_operators" ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "beehive"."sessions" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_providerSubscriptionId_idx" ON "beehive"."subscriptions" ("provider_subscription_id");--> statement-breakpoint
CREATE INDEX "subscription_organizationId_idx" ON "beehive"."subscriptions" ("organization_id");--> statement-breakpoint
CREATE INDEX "subscription_billingCustomerId_idx" ON "beehive"."subscriptions" ("billing_customer_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "beehive"."verifications" ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_member_workspaceId_userId_idx" ON "beehive"."workspace_members" ("workspace_id","user_id");--> statement-breakpoint
CREATE INDEX "workspace_member_userId_idx" ON "beehive"."workspace_members" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_organizationId_slug_idx" ON "beehive"."workspaces" ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "workspace_organizationId_idx" ON "beehive"."workspaces" ("organization_id");--> statement-breakpoint
CREATE INDEX "workspace_createdByUserId_idx" ON "beehive"."workspaces" ("created_by_user_id");--> statement-breakpoint
ALTER TABLE "beehive"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "beehive"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_chats" ADD CONSTRAINT "ai_chats_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_chats" ADD CONSTRAINT "ai_chats_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_chats" ADD CONSTRAINT "ai_chats_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_chats" ADD CONSTRAINT "ai_chats_configuration_id_ai_configurations_id_fkey" FOREIGN KEY ("configuration_id") REFERENCES "beehive"."ai_configurations"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_chats" ADD CONSTRAINT "ai_chats_provider_id_ai_providers_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "beehive"."ai_providers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_chats" ADD CONSTRAINT "ai_chats_model_id_ai_models_id_fkey" FOREIGN KEY ("model_id") REFERENCES "beehive"."ai_models"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_configurations" ADD CONSTRAINT "ai_configurations_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_configurations" ADD CONSTRAINT "ai_configurations_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_configurations" ADD CONSTRAINT "ai_configurations_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_configurations" ADD CONSTRAINT "ai_configurations_provider_id_ai_providers_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "beehive"."ai_providers"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "beehive"."ai_configurations" ADD CONSTRAINT "ai_configurations_model_id_ai_models_id_fkey" FOREIGN KEY ("model_id") REFERENCES "beehive"."ai_models"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "beehive"."ai_configurations" ADD CONSTRAINT "ai_configurations_credential_id_ai_provider_credentials_id_fkey" FOREIGN KEY ("credential_id") REFERENCES "beehive"."ai_provider_credentials"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_configurations" ADD CONSTRAINT "ai_configurations_embedding_model_id_ai_models_id_fkey" FOREIGN KEY ("embedding_model_id") REFERENCES "beehive"."ai_models"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_records" ADD CONSTRAINT "ai_embedding_records_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_records" ADD CONSTRAINT "ai_embedding_records_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_records" ADD CONSTRAINT "ai_embedding_records_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_records" ADD CONSTRAINT "ai_embedding_records_chat_id_ai_chats_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "beehive"."ai_chats"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_records" ADD CONSTRAINT "ai_embedding_records_message_id_ai_messages_id_fkey" FOREIGN KEY ("message_id") REFERENCES "beehive"."ai_messages"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_records" ADD CONSTRAINT "ai_embedding_records_model_id_ai_models_id_fkey" FOREIGN KEY ("model_id") REFERENCES "beehive"."ai_models"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_vectors_1024" ADD CONSTRAINT "ai_embedding_vectors_1024_EFIf7me9AGdR_fkey" FOREIGN KEY ("record_id") REFERENCES "beehive"."ai_embedding_records"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_vectors_1536" ADD CONSTRAINT "ai_embedding_vectors_1536_Ws7DYthHHMDl_fkey" FOREIGN KEY ("record_id") REFERENCES "beehive"."ai_embedding_records"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_vectors_3072" ADD CONSTRAINT "ai_embedding_vectors_3072_1oZcCn2ojugI_fkey" FOREIGN KEY ("record_id") REFERENCES "beehive"."ai_embedding_records"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_vectors_384" ADD CONSTRAINT "ai_embedding_vectors_384_record_id_ai_embedding_records_id_fkey" FOREIGN KEY ("record_id") REFERENCES "beehive"."ai_embedding_records"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_embedding_vectors_768" ADD CONSTRAINT "ai_embedding_vectors_768_record_id_ai_embedding_records_id_fkey" FOREIGN KEY ("record_id") REFERENCES "beehive"."ai_embedding_records"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_messages" ADD CONSTRAINT "ai_messages_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_messages" ADD CONSTRAINT "ai_messages_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_messages" ADD CONSTRAINT "ai_messages_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_messages" ADD CONSTRAINT "ai_messages_chat_id_ai_chats_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "beehive"."ai_chats"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_models" ADD CONSTRAINT "ai_models_provider_id_ai_providers_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "beehive"."ai_providers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_provider_credentials" ADD CONSTRAINT "ai_provider_credentials_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_provider_credentials" ADD CONSTRAINT "ai_provider_credentials_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_provider_credentials" ADD CONSTRAINT "ai_provider_credentials_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "beehive"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_provider_credentials" ADD CONSTRAINT "ai_provider_credentials_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_provider_credentials" ADD CONSTRAINT "ai_provider_credentials_provider_id_ai_providers_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "beehive"."ai_providers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_tool_calls" ADD CONSTRAINT "ai_tool_calls_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_tool_calls" ADD CONSTRAINT "ai_tool_calls_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_tool_calls" ADD CONSTRAINT "ai_tool_calls_message_id_ai_messages_id_fkey" FOREIGN KEY ("message_id") REFERENCES "beehive"."ai_messages"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_usage_events" ADD CONSTRAINT "ai_usage_events_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."ai_usage_events" ADD CONSTRAINT "ai_usage_events_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_usage_events" ADD CONSTRAINT "ai_usage_events_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_usage_events" ADD CONSTRAINT "ai_usage_events_api_key_id_api_keys_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "beehive"."api_keys"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_usage_events" ADD CONSTRAINT "ai_usage_events_chat_id_ai_chats_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "beehive"."ai_chats"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_usage_events" ADD CONSTRAINT "ai_usage_events_message_id_ai_messages_id_fkey" FOREIGN KEY ("message_id") REFERENCES "beehive"."ai_messages"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_usage_events" ADD CONSTRAINT "ai_usage_events_provider_id_ai_providers_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "beehive"."ai_providers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."ai_usage_events" ADD CONSTRAINT "ai_usage_events_model_id_ai_models_id_fkey" FOREIGN KEY ("model_id") REFERENCES "beehive"."ai_models"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."api_keys" ADD CONSTRAINT "api_keys_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."api_keys" ADD CONSTRAINT "api_keys_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."api_keys" ADD CONSTRAINT "api_keys_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."audit_logs" ADD CONSTRAINT "audit_logs_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."audit_logs" ADD CONSTRAINT "audit_logs_api_key_id_api_keys_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "beehive"."api_keys"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."billing_customers" ADD CONSTRAINT "billing_customers_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."organization_invites" ADD CONSTRAINT "organization_invites_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."organization_invites" ADD CONSTRAINT "organization_invites_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."organization_members" ADD CONSTRAINT "organization_members_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "beehive"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."organizations" ADD CONSTRAINT "organizations_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."platform_operators" ADD CONSTRAINT "platform_operators_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "beehive"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."platform_operators" ADD CONSTRAINT "platform_operators_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "beehive"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."subscriptions" ADD CONSTRAINT "subscriptions_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."subscriptions" ADD CONSTRAINT "subscriptions_billing_customer_id_billing_customers_id_fkey" FOREIGN KEY ("billing_customer_id") REFERENCES "beehive"."billing_customers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "beehive"."workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "beehive"."workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "beehive"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."workspaces" ADD CONSTRAINT "workspaces_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "beehive"."organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "beehive"."workspaces" ADD CONSTRAINT "workspaces_created_by_user_id_users_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "beehive"."users"("id") ON DELETE SET NULL;