-- Audit Log table: tracks all create / update / delete actions on IAM users
-- Run this script per schema (tenant) that requires an audit trail.
-- The table is deliberately append-only; rows are never updated or hard-deleted.

CREATE TABLE IF NOT EXISTS cms_audit_log (
    id              TEXT        NOT NULL,
    actor_user_id   TEXT,
    actor_user_name TEXT,
    action          TEXT        NOT NULL,           -- CREATE | UPDATE | DELETE | LOGIN | LOGOUT | VIEW
    resource_type   TEXT        NOT NULL,           -- e.g. "User", "Role", "Client"
    resource_id     TEXT,
    resource_label  TEXT,
    previous_value  JSONB,
    new_value       JSONB,
    metadata        JSONB,
    success         BOOLEAN     NOT NULL DEFAULT TRUE,
    error_message   TEXT,
    performed_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    client_code     TEXT,

    CONSTRAINT pk_cms_audit_log PRIMARY KEY (id)
);

-- Index for querying logs by IAM user (most common query)
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_user_id
    ON cms_audit_log (actor_user_id, performed_at DESC);

-- Index for filtering by resource type and ID
CREATE INDEX IF NOT EXISTS idx_audit_log_resource
    ON cms_audit_log (resource_type, resource_id);

-- Index for tenant-scoped queries
CREATE INDEX IF NOT EXISTS idx_audit_log_client_code
    ON cms_audit_log (client_code, performed_at DESC);

COMMENT ON TABLE  cms_audit_log                IS 'Append-only audit trail for all IAM user operations';
COMMENT ON COLUMN cms_audit_log.actor_user_id   IS 'User ID (cms_iam_user.user_id) of the actor who performed the action';
COMMENT ON COLUMN cms_audit_log.action          IS 'One of: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW';
COMMENT ON COLUMN cms_audit_log.resource_type   IS 'Entity type affected, e.g. User, Role, Client';
COMMENT ON COLUMN cms_audit_log.previous_value  IS 'JSON snapshot of the resource state BEFORE the change';
COMMENT ON COLUMN cms_audit_log.new_value       IS 'JSON snapshot of the resource state AFTER the change';
COMMENT ON COLUMN cms_audit_log.metadata        IS 'Additional context: HTTP method, endpoint, IP address, etc.';
