ALTER TABLE "beehive"."organization_members"
  ADD CONSTRAINT "organization_member_role_check"
  CHECK ("role" IN ('owner', 'admin', 'billing_admin', 'security_admin', 'member'));
--> statement-breakpoint
ALTER TABLE "beehive"."workspaces"
  ADD CONSTRAINT "workspace_id_organizationId_unique" UNIQUE ("id", "organization_id");
--> statement-breakpoint
ALTER TABLE "beehive"."workspace_members"
  ADD COLUMN "organization_id" uuid;
--> statement-breakpoint
UPDATE "beehive"."workspace_members" AS workspace_member
SET "organization_id" = workspace."organization_id"
FROM "beehive"."workspaces" AS workspace
WHERE workspace_member."workspace_id" = workspace."id";
--> statement-breakpoint
ALTER TABLE "beehive"."workspace_members"
  ALTER COLUMN "organization_id" SET NOT NULL;
--> statement-breakpoint
UPDATE "beehive"."workspace_members"
SET "role" = 'viewer'
WHERE "role" = 'member';
--> statement-breakpoint
ALTER TABLE "beehive"."workspace_members"
  ALTER COLUMN "role" SET DEFAULT 'viewer';
--> statement-breakpoint
ALTER TABLE "beehive"."workspace_members"
  ADD CONSTRAINT "workspace_member_role_check"
  CHECK ("role" IN ('owner', 'developer', 'operator', 'analyst', 'viewer'));
--> statement-breakpoint
ALTER TABLE "beehive"."workspace_members"
  ADD CONSTRAINT "workspace_member_workspace_organization_fkey"
  FOREIGN KEY ("workspace_id", "organization_id")
  REFERENCES "beehive"."workspaces" ("id", "organization_id")
  ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE "beehive"."workspace_members"
  ADD CONSTRAINT "workspace_member_organization_user_fkey"
  FOREIGN KEY ("organization_id", "user_id")
  REFERENCES "beehive"."organization_members" ("organization_id", "user_id")
  ON DELETE CASCADE;
--> statement-breakpoint
CREATE INDEX "workspace_member_organizationId_idx"
  ON "beehive"."workspace_members" ("organization_id");
--> statement-breakpoint
UPDATE "beehive"."api_keys"
SET "scopes" = '[]'::jsonb
WHERE "scopes" IS NULL;
--> statement-breakpoint
ALTER TABLE "beehive"."api_keys"
  ALTER COLUMN "scopes" SET DEFAULT '[]'::jsonb;
--> statement-breakpoint
ALTER TABLE "beehive"."api_keys"
  ALTER COLUMN "scopes" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "beehive"."api_keys"
  ADD CONSTRAINT "api_key_scopes_array_check"
  CHECK (jsonb_typeof("scopes") = 'array');
--> statement-breakpoint
ALTER TABLE "beehive"."api_keys"
  ALTER COLUMN "workspace_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "beehive"."api_keys"
  ADD CONSTRAINT "api_key_workspace_organization_fkey"
  FOREIGN KEY ("workspace_id", "organization_id")
  REFERENCES "beehive"."workspaces" ("id", "organization_id")
  ON DELETE CASCADE;
