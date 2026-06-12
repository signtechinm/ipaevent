# PostgreSQL Admin Auth and User Management Plan

## Purpose

The current admin panel is a frontend prototype using browser storage. Production should move authentication, role creation, user creation, permission checks, password reset, and audit logging into a PostgreSQL-backed API.

## Core Tables

```sql
CREATE TABLE admin_roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_permissions (
    id BIGSERIAL PRIMARY KEY,
    permission_key VARCHAR(120) NOT NULL UNIQUE,
    module VARCHAR(80) NOT NULL,
    label VARCHAR(160) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_role_permissions (
    role_id BIGINT NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES admin_permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    mobile VARCHAR(25),
    password_hash TEXT NOT NULL,
    role_id BIGINT REFERENCES admin_roles(id),
    status VARCHAR(30) DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Session and Password Tables

```sql
CREATE TABLE admin_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_password_resets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Audit Log

```sql
CREATE TABLE admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id BIGINT REFERENCES admin_users(id),
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(120),
    entity_id VARCHAR(80),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Recommended Permissions

- `registration.view`
- `registration.update`
- `registration.export`
- `payment.verify`
- `program.view`
- `program.create`
- `program.update`
- `program.delete`
- `winner.view`
- `winner.create`
- `winner.publish`
- `report.view`
- `report.export`
- `user.view`
- `user.create`
- `user.update`
- `role.manage`
- `audit.view`

## Recommended API Endpoints

- `POST /api/admin/auth/login`
  Validate email/password, create session, return access token and user permissions.

- `POST /api/admin/auth/logout`
  Revoke the active session.

- `GET /api/admin/me`
  Return logged-in admin user, role, and permissions.

- `GET /api/admin/roles`
  List roles with permission counts.

- `POST /api/admin/roles`
  Create a role and assign permissions.

- `PATCH /api/admin/roles/{id}`
  Update role name, status, and permissions.

- `GET /api/admin/users`
  List admin users with role and status.

- `POST /api/admin/users`
  Create an admin user with role and temporary password.

- `PATCH /api/admin/users/{id}`
  Update user profile, role, status, or reset password.

## Security Notes

- Never store plain passwords. Use Argon2id or bcrypt password hashing.
- Tokens stored in the database should be hashed, not stored raw.
- Enforce permission checks on the backend for every protected endpoint.
- Add rate limiting on login and password reset endpoints.
- Require strong temporary passwords and force password change on first login.
- Record role/user/payment changes in `admin_audit_logs`.
- Use HTTPS-only cookies or short-lived bearer tokens depending on backend framework.
