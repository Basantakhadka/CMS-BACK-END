# Audit Log Module Documentation

## Overview

The **Audit Log Module** provides a comprehensive audit trail system for tracking **all create, update, and delete operations performed on IAM users**. It automatically captures:

- **Actor information**: Who performed the action
- **Resource details**: What was changed (resource type, ID, label)
- **Change snapshot**: Before/after state in JSON
- **Metadata**: HTTP context, timestamps, success status
- **Multi-tenant support**: Logs are scoped by `client_code`

---

## Architecture

### Components

#### 1. **Entity** (`audit-log.entity.ts`)
- TypeORM entity representing `cms_audit_log` table
- Append-only design (rows are never updated or hard-deleted)
- Stores immutable snapshots of all operations

#### 2. **Repository Layer**
- **Interface** (`audit-log.repository.ts`): Defines repository contract
- **Implementation** (`repositories/db/audit-log.db-repository.ts`): TypeORM + multi-schema support
  - Auto-resolves client schema from `AsyncLocalStorage` request context
  - Dynamic filtering & pagination via `DynamicQueryBuilder`

#### 3. **Service** (`audit-log.service.ts`) — The Saving Mechanism
```typescript
@Injectable()
export class AuditLogService {
  async log(payload: AuditLogPayload): Promise<void>
}
```
- **Entry point for logging**: Inject into any use case / service
- Automatically captures actor context from JWT token
- Failures are caught and logged (never blocks main request)
- Payload structure:
  ```typescript
  {
    action: AuditAction,        // CREATE | UPDATE | DELETE | LOGIN | LOGOUT | VIEW
    resourceType: string,       // "User", "Role", "Client", etc.
    resourceId: string,         // PK of the affected resource
    resourceLabel?: string,     // Human-readable name
    previousValue?: Record,     // State before change
    newValue?: Record,          // State after change
    metadata?: Record,          // HTTP method, IP, endpoint, etc.
    success?: boolean,          // Defaults to true
    errorMessage?: string,      // Error details if success=false
  }
  ```

#### 4. **Use Cases**
- `SaveAuditLogUsecase`: Manual audit record creation (usecase endpoint)
- `GetAuditLogsUsecase`: List all logs with dynamic filters & pagination
- `GetAuditLogsByUserUsecase`: Filter logs by IAM user (most common query)

#### 5. **Controller** (`audit-log.controller.ts`)
- `POST /audit-log/list` → Get all logs
- `POST /audit-log/iam-user/:userId/list` → Get logs for a specific IAM user

#### 6. **Module** (`audit-log.module.ts`)
- Imports `AuthModule` (for `PermissionsCheckerService`)
- Exports `AuditLogService` (so other modules can inject and use it)

---

## API Endpoints

### 1. List All Audit Logs
```
POST /audit-log/list
Content-Type: application/json
Authorization: Bearer <jwt_token>

Body:
{
  "filters": [
    {
      "field": "actor_user_id",
      "condition": "EQUALS",
      "values": ["user-123"]
    },
    {
      "field": "action",
      "condition": "EQUALS",
      "values": ["CREATE"]
    }
  ],
  "pageInfo": {
    "current": 1,
    "size": 20,
    "sortInfo": [{"field": "performed_at", "order": "DESC"}]
  }
}
```

### 2. Get Audit Logs for a Specific IAM User
```
POST /audit-log/iam-user/{userId}/list
Content-Type: application/json
Authorization: Bearer <jwt_token>

Body:
{
  "filters": [],
  "pageInfo": {
    "current": 1,
    "size": 50,
    "sortInfo": [{"field": "performed_at", "order": "DESC"}]
  }
}
```

---

## Integration with IAM User Operations

### Current Integration

The audit log is **automatically called** in the following IAM use cases:

#### 1. **AddUserUsecase** (User Creation)
```typescript
await this.auditLogService?.log({
  action: AuditAction.CREATE,
  resourceType: "User",
  resourceId: users.id,
  resourceLabel: users.userName,
  newValue: { userId: users.userId, userName: users.userName, ... },
  success: true,
});
```

#### 2. **UpdateUserUsecase** (User Update)
```typescript
await this.auditLogService?.log({
  action: AuditAction.UPDATE,
  resourceType: "User",
  resourceId: user.id,
  resourceLabel: user.userName,
  previousValue: { userId: savedUser.userId, roles: savedUser.roles },
  newValue: { userId: user.userId, roles: user.roles },
  success: true,
});
```

#### 3. **DeleteUserUsecase** (User Deletion)
```typescript
await this.auditLogService?.log({
  action: AuditAction.DELETE,
  resourceType: "User",
  resourceId: user.id,
  resourceLabel: user.userName,
  previousValue: { userId: user.userId, userName: user.userName },
  success: true,
});
```

---

## Using AuditLogService in Other Modules

### Injection Pattern

Any feature module can **inject `AuditLogService`** by importing `AuditLogModule`:

```typescript
import { Module } from '@nestjs/common';
import { AuditLogModule } from '@app/feature/audit-log/audit-log.module';
import { MyFeatureService } from './my-feature.service';

@Module({
  imports: [AuditLogModule],  // ← Import to get AuditLogService
  providers: [MyFeatureService],
})
export class MyFeatureModule {}
```

### Service Usage

```typescript
import { AuditLogService, AuditLogPayload } from '@app/feature/audit-log';
import { AuditAction } from '@app/feature/audit-log/entities/audit-log.entity';

@Injectable()
export class MyFeatureService {
  constructor(private readonly auditLogService: AuditLogService) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    // ... populate role ...
    await this.roleRepository.insert(role);

    // Log the audit entry (actor context auto-resolved from JWT)
    await this.auditLogService.log({
      action: AuditAction.CREATE,
      resourceType: 'Role',
      resourceId: role.id,
      resourceLabel: role.title,
      newValue: role,
    });

    return role;
  }
}
```

---

## Database Schema

### SQL Table: `cms_audit_log`

Run this migration for each tenant schema:

```sql
CREATE TABLE IF NOT EXISTS cms_audit_log (
    id              TEXT        NOT NULL PRIMARY KEY,
    actor_user_id   TEXT,                           -- From JWT claims
    actor_user_name TEXT,
    action          TEXT        NOT NULL,           -- CREATE|UPDATE|DELETE|LOGIN|LOGOUT|VIEW
    resource_type   TEXT        NOT NULL,           -- "User", "Role", etc.
    resource_id     TEXT,
    resource_label  TEXT,
    previous_value  JSONB,                          -- Snapshot before change
    new_value       JSONB,                          -- Snapshot after change
    metadata        JSONB,                          -- HTTP context, etc.
    success         BOOLEAN     NOT NULL DEFAULT TRUE,
    error_message   TEXT,
    performed_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    client_code     TEXT                            -- Tenant ID
);

-- Indexes for common queries
CREATE INDEX idx_audit_log_actor_user_id  ON cms_audit_log (actor_user_id, performed_at DESC);
CREATE INDEX idx_audit_log_resource      ON cms_audit_log (resource_type, resource_id);
CREATE INDEX idx_audit_log_client_code   ON cms_audit_log (client_code, performed_at DESC);
```

Migration file: [docs/migrations/001_create_cms_audit_log.sql](../../docs/migrations/001_create_cms_audit_log.sql)

---

## Supported Actions (Enum)

```typescript
export enum AuditAction {
  CREATE = "CREATE",   // Resource created
  UPDATE = "UPDATE",   // Resource modified
  DELETE = "DELETE",   // Resource soft-deleted
  LOGIN = "LOGIN",     // User login (can be integrated later)
  LOGOUT = "LOGOUT",   // User logout (can be integrated later)
  VIEW = "VIEW",       // Read-only access (can be integrated later)
}
```

---

## Multi-Tenancy

### Automatic Client Scoping

The audit log respects the multi-tenant architecture:

1. **Request Context**: Actor's `clientCode` is captured from JWT token via `AsyncLocalStorage`
2. **Repository**: All queries automatically filter by `client_code`
3. **Data Isolation**: Each tenant sees only their own audit logs

```typescript
// Actor context automatically resolved from JWT in AuditLogService.log()
entry.clientCode = currentUser?.clientCode ?? undefined;
```

---

## Error Handling

### Graceful Degradation

If audit logging fails:
- The error is **caught and logged** (not thrown)
- The main request operation **continues successfully**
- Prevents audit trail issues from breaking business logic

```typescript
try {
  // Save audit entry
  await this.auditLogRepository.insert(entry);
} catch (err) {
  this.logger.error("Failed to persist audit log entry", (err as Error)?.stack);
  // Main request is NOT affected
}
```

---

## Filtering & Pagination

### Filter Operators Supported

- `EQUALS`, `NOT_EQUALS`
- `LIKE`, `NOT_LIKE`, `ILIKE` (case-insensitive)
- `IN`, `NOT_IN`
- `BETWEEN`
- `IS_NULL`, `IS_NOT_NULL`
- `CONTAINS` (for JSONB fields)

### Example: Filter by Resource Type and Date Range

```typescript
{
  "filters": [
    {
      "field": "resource_type",
      "condition": "EQUALS",
      "values": ["User"]
    },
    {
      "field": "performed_at",
      "condition": "BETWEEN",
      "values": ["2024-01-01", "2024-12-31"]
    }
  ],
  "pageInfo": {
    "current": 1,
    "size": 100,
    "sortInfo": [{"field": "performed_at", "order": "DESC"}]
  }
}
```

---

## Files Summary

| File | Purpose |
|------|---------|
| [entities/audit-log.entity.ts](entities/audit-log.entity.ts) | TypeORM entity |
| [repositories/audit-log.repository.ts](repositories/audit-log.repository.ts) | Repository interface |
| [repositories/db/audit-log.db-repository.ts](repositories/db/audit-log.db-repository.ts) | Repository implementation |
| [audit-log.service.ts](audit-log.service.ts) | Core saving mechanism |
| [usecase/save-audit-log.usecase.ts](usecase/save-audit-log.usecase.ts) | Manual save usecase |
| [usecase/get-audit-logs.usecase.ts](usecase/get-audit-logs.usecase.ts) | List all logs usecase |
| [usecase/get-audit-logs-by-user.usecase.ts](usecase/get-audit-logs-by-user.usecase.ts) | Filter by user usecase |
| [audit-log.controller.ts](audit-log.controller.ts) | REST endpoints |
| [audit-log.module.ts](audit-log.module.ts) | NestJS module definition |

---

## Future Enhancements

- **Decorators**: Add `@Audit()` decorator for automatic logging
- **AUTH events**: Capture LOGIN / LOGOUT in auth.service
- **Role changes**: Log role creation/update/delete
- **Report builder**: Pre-built queries for compliance reports
- **Retention policy**: Auto-archive old logs to cold storage
- **Webhooks**: Trigger notifications on critical actions
- **Search**: Full-text search on JSON fields

---

## Testing Integration

### Manual Test with cURL

```bash
# List all audit logs
curl -X POST http://localhost:3000/api/audit-log/list \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "filters": [],
    "pageInfo": {"current": 1, "size": 20}
  }'

# Get logs for a specific user
curl -X POST http://localhost:3000/api/audit-log/iam-user/user-123/list \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "filters": [],
    "pageInfo": {"current": 1, "size": 50}
  }'
```

---
