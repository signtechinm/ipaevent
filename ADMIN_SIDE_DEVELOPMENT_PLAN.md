# Admin Side Development Plan

## 1. Purpose

This document converts the admin-side scope from `CLIENT_PROPOSAL_EVENT_REGISTRATION_PORTAL.md` into a practical development plan for the 14th IPA National Students Congress event registration portal.

**Event Theme:** Pioneering India's Pharmaceutical Future: Bridging Innovation, Entrepreneurship, Industry, and Healthcare Practice in the Digital Era

**Event Date:** 19–20 September 2026

The admin panel should allow authorized staff to control registrations, pricing, programs, payments, users, reports, and winner announcements from one secure backend system.

## 2. Recommended Admin Stack

- Backend: Laravel API
- Database: PostgreSQL
- Admin frontend: React, Vite, Tailwind CSS
- Authentication: Laravel Sanctum or secure HTTP-only cookie sessions
- Export support: Excel and PDF generation
- Payment gateway: Razorpay, CCAvenue, PayU, or Stripe after client confirmation

## 3. Development Principles

- Keep all trusted pricing, payment, and permission checks on the backend.
- Treat the React admin panel as an interface only, not the source of authority.
- Use master tables for categories, programs, competitions, workshops, courses, institutions, roles, and permissions.
- Record important admin actions in audit logs.
- Build reports from database queries, not from frontend-only filtering.
- Keep every admin module searchable, filterable, and exportable where relevant.

## 4. Admin Modules

### 4.1 Authentication and Dashboard

#### Features

- Admin login and logout.
- Logged-in user profile endpoint.
- Role-based menu visibility.
- Permission-based route protection.
- Dashboard statistics.
- Recent registration and payment activity.

#### Dashboard Widgets

- Total registrations.
- Individual registrations.
- Group registrations.
- Total payment collected.
- Pending payments.
- Failed payments.
- Program-wise registration count.
- Workshop capacity usage.
- Recent registrations.
- Recent payments.
- Winner publication status.

#### Key Screens

- Login page.
- Forgot/reset password page.
- Main dashboard.
- My profile page.

#### Backend Work

- Implement admin roles, permissions, users, sessions, password resets, and audit logs as defined in `POSTGRES_ADMIN_AUTH_SCHEMA.md`.
- Seed default roles:
  - Super Admin
  - Event Admin
  - Registration Staff
  - Finance Staff
  - Program Coordinator
  - Report Viewer
  - Result Manager

## 5. Masters and Configuration

### 5.1 Registration Category and Pricing Master

#### Features

- Create, edit, activate, and deactivate registration categories.
- Configure category-wise registration fee.
- Configure early bird pricing.
- Configure regular pricing.
- Configure late fee pricing.
- Configure validity date ranges.
- Maintain pricing update history.

#### Suggested Fields

- Category name.
- Category code.
- Description.
- Base fee.
- Early bird fee.
- Regular fee.
- Late fee.
- Early bird start and end date.
- Regular start and end date.
- Late fee start date.
- Active status.

#### Key Screens

- Pricing list.
- Add/edit pricing form.
- Pricing history view.

### 5.2 Program, Competition, and Workshop Master

#### Features

- Add, edit, delete, activate, and deactivate programs.
- Mark program type as session, competition, workshop, or activity.
- Configure free or paid program.
- Configure fee.
- Configure date, time, venue, and capacity.
- Track seat availability for limited workshops.
- Control whether the program appears on the public website.

#### Suggested Fields

- Program title.
- Program type.
- Description.
- Category.
- Date.
- Start time.
- End time.
- Venue or hall.
- Fee.
- Capacity.
- Status.
- Public visibility.

#### Key Screens

- Program list.
- Add/edit program.
- Capacity and registration view.

### 5.3 Student and Institution Master

#### Features

- Manage student profiles.
- Manage institution and college names.
- Map students to institutions.
- Import and export student records.
- Search by name, email, mobile, course, institution, and category.
- View registration history per student.

#### Suggested Fields

- Student name.
- Mobile.
- Email.
- Institution.
- Course.
- Year.
- Student ID.
- Category.
- Status.

#### Key Screens

- Student list.
- Add/edit student.
- Student profile.
- Import student records.

## 6. Registration Management

### 6.1 Individual Registration Management

#### Features

- View all individual registrations.
- Search by registration number, name, email, mobile, category, state, institution, and payment status.
- View participant details.
- View selected competitions.
- View selected workshop.
- View presentation type.
- View calculated fee breakdown.
- Update registration status where permitted.
- Download receipt.
- Export filtered registration data.

#### Status Values

- Draft.
- Submitted.
- Confirmed.
- Cancelled.

#### Key Screens

- Registration list.
- Registration detail page.
- Payment and receipt tab.
- Admin notes and audit history tab.

### 6.2 Group Registration Management

#### Features

- View group registrations.
- View group leader details.
- View institution or organization details.
- Add or edit participants under a group where permitted.
- Track group payment status.
- Generate group invoice or receipt.
- Export participant list.

#### Suggested Fields

- Group registration number.
- Group leader name.
- Group leader mobile.
- Group leader email.
- Institution or organization.
- Participant count.
- Total payable amount.
- Payment status.
- Registration status.

#### Key Screens

- Group registration list.
- Group registration detail.
- Participant table.
- Group invoice and receipt page.

## 7. Payment Management

### 7.1 Payment Transactions

#### Features

- View all payment transactions.
- Filter by date range, status, gateway, amount, registration number, and transaction ID.
- View gateway response details.
- Map payments to registrations.
- Support manual payment verification.
- Mark refunds or cancellations where required.
- Download receipts.
- Export payment reports.

#### Status Values

- Pending.
- Success.
- Failed.
- Manual verification required.
- Refunded.

#### Key Screens

- Payment transaction list.
- Payment detail page.
- Manual verification form.
- Reconciliation report.

### 7.2 Receipt Management

#### Features

- Generate receipt only after successful or manually verified payment.
- Include registration number, participant name, amount, payment date, transaction ID, and fee breakup.
- Allow receipt download from admin panel.
- Keep receipt generation consistent for individual and group registrations.

## 8. Winner Announcement Management

### 8.1 Competition Result Setup

#### Features

- Create competition result categories.
- Map results to existing competitions where possible.
- Add first, second, third, and consolation winners.
- Map winners to participants or manually enter details.
- Upload winner photo or certificate if required.
- Publish and unpublish results on the public website.

#### Suggested Fields

- Competition.
- Category.
- Position.
- Participant.
- Student name.
- Institution.
- Prize details.
- Winner photo.
- Certificate file.
- Publish status.

#### Key Screens

- Winner result list.
- Add/edit winner result.
- Publish preview.

## 9. Reports

### 9.1 Required Reports

- Registration report.
- Individual registration report.
- Group registration report.
- Student-wise report.
- Institution-wise report.
- Program-wise registration report.
- Workshop capacity report.
- Competition participation report.
- Payment collection report.
- Pending payment report.
- Failed payment report.
- Category-wise registration report.
- Winner report.
- User activity report.

### 9.2 Report Features

- Date-range filters.
- Category filters.
- Program and workshop filters.
- Payment status filters.
- Registration status filters.
- Institution filters.
- Search by name, email, mobile, and registration number.
- Export to Excel.
- Export to PDF where required.

## 10. User and Permission Management

### 10.1 User Master

#### Features

- Create admin users.
- Assign roles.
- Activate and deactivate users.
- Reset passwords.
- View last login time.
- View user activity history.

#### Key Screens

- User list.
- Add/edit user.
- Password reset.
- User activity log.

### 10.2 Role and Permission Management

#### Features

- Create roles.
- Assign module permissions.
- Update role status.
- Prevent deletion of critical system roles.
- Apply backend permission checks to every protected API endpoint.

#### Permission Groups

- Dashboard.
- Registrations.
- Group registrations.
- Payments.
- Pricing.
- Programs.
- Students.
- Winners.
- Reports.
- Users and roles.
- Audit logs.

## 11. Audit Log

### Features

- Record login and logout events.
- Record registration updates.
- Record payment verification changes.
- Record pricing changes.
- Record program changes.
- Record winner publish and unpublish actions.
- Record user and role changes.

### Key Fields

- Actor user.
- Action.
- Entity type.
- Entity ID.
- Old values.
- New values.
- IP address.
- Created date.

## 12. Suggested Database Work

Use the existing documents as a base:

- `POSTGRES_ADMIN_AUTH_SCHEMA.md` for admin auth, roles, permissions, users, sessions, password resets, and audit logs.
- `POSTGRES_REGISTRATION_SCHEMA.md` for registration, competition mapping, and payment storage.

Additional tables recommended for admin completeness:

- `registration_categories`
- `registration_pricing_rules`
- `pricing_update_logs`
- `programs`
- `program_categories`
- `institutions`
- `students`
- `group_registrations`
- `group_registration_participants`
- `winner_categories`
- `winner_results`
- `receipt_sequences`
- `admin_notes`

## 13. Suggested API Groups

### Authentication

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/me`
- `POST /api/admin/password/forgot`
- `POST /api/admin/password/reset`

### Dashboard

- `GET /api/admin/dashboard/summary`
- `GET /api/admin/dashboard/recent-registrations`
- `GET /api/admin/dashboard/recent-payments`

### Masters

- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PATCH /api/admin/categories/{id}`
- `GET /api/admin/pricing`
- `POST /api/admin/pricing`
- `PATCH /api/admin/pricing/{id}`
- `GET /api/admin/programs`
- `POST /api/admin/programs`
- `PATCH /api/admin/programs/{id}`
- `DELETE /api/admin/programs/{id}`
- `GET /api/admin/students`
- `POST /api/admin/students`
- `PATCH /api/admin/students/{id}`

### Registrations

- `GET /api/admin/registrations`
- `GET /api/admin/registrations/{id}`
- `PATCH /api/admin/registrations/{id}/status`
- `PATCH /api/admin/registrations/{id}/payment-status`
- `GET /api/admin/registrations/{id}/receipt`
- `GET /api/admin/registrations/export`

### Groups

- `GET /api/admin/group-registrations`
- `GET /api/admin/group-registrations/{id}`
- `PATCH /api/admin/group-registrations/{id}`
- `GET /api/admin/group-registrations/{id}/receipt`
- `GET /api/admin/group-registrations/export`

### Payments

- `GET /api/admin/payments`
- `GET /api/admin/payments/{id}`
- `PATCH /api/admin/payments/{id}/verify`
- `PATCH /api/admin/payments/{id}/refund`
- `GET /api/admin/payments/export`

### Winners

- `GET /api/admin/winners`
- `POST /api/admin/winners`
- `PATCH /api/admin/winners/{id}`
- `PATCH /api/admin/winners/{id}/publish`
- `PATCH /api/admin/winners/{id}/unpublish`

### Reports

- `GET /api/admin/reports/registrations`
- `GET /api/admin/reports/payments`
- `GET /api/admin/reports/programs`
- `GET /api/admin/reports/students`
- `GET /api/admin/reports/winners`
- `GET /api/admin/reports/user-activity`

### Users and Permissions

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/{id}`
- `GET /api/admin/roles`
- `POST /api/admin/roles`
- `PATCH /api/admin/roles/{id}`
- `GET /api/admin/permissions`
- `GET /api/admin/audit-logs`

## 14. Admin UI Navigation

Recommended sidebar structure:

- Dashboard
- Registrations
- Group Registrations
- Payments
- Programs
- Students
- Pricing
- Winners
- Reports
- Users and Roles
- Audit Logs
- Settings

## 15. Implementation Phases

### Phase 1: Foundation

- Set up Laravel API structure.
- Configure PostgreSQL connection.
- Create admin auth migrations.
- Create registration and payment migrations.
- Seed roles, permissions, and first Super Admin.
- Implement admin login, logout, and profile APIs.
- Build admin login page and protected layout.

### Phase 2: Masters

- Build registration category master.
- Build pricing master.
- Build program, competition, and workshop master.
- Build institution and student master.
- Add import and export support for students.

### Phase 3: Registration Operations

- Build individual registration list and detail pages.
- Build registration search, filters, and exports.
- Build status update workflow.
- Build receipt download workflow.
- Build group registration list and detail pages.
- Build group participant export.

### Phase 4: Payment Operations

- Build payment transaction list and detail pages.
- Connect gateway response storage.
- Build manual verification workflow.
- Build refund/cancellation marking.
- Build payment receipt generation.
- Build payment collection and pending payment reports.

### Phase 5: Winner Management

- Build competition result categories.
- Build winner entry form.
- Add participant mapping.
- Add publish and unpublish workflow.
- Connect published results to public website.

### Phase 6: Reports and Audit

- Build all required report screens.
- Add Excel export.
- Add PDF export where required.
- Build user activity report.
- Build audit log viewer.
- Add dashboard charts and summaries from production queries.

### Phase 7: Hardening and Launch

- Add backend validation for every admin API.
- Add permission checks for every protected action.
- Add rate limiting on auth endpoints.
- Add secure password reset flow.
- Test payment reconciliation.
- Test exports with large datasets.
- Test mobile/tablet admin layout.
- Prepare production environment.
- Configure SSL, backups, logs, and monitoring.

## 16. Suggested Delivery Order

1. Admin authentication and role management.
2. Registration category and pricing master.
3. Program, competition, and workshop master.
4. Individual registration management.
5. Payment transaction management.
6. Reports and exports.
7. Group registration management.
8. Winner announcement management.
9. Audit logs and user activity.
10. Final security, testing, and deployment.

## 17. Testing Checklist

- Admin cannot access protected routes without login.
- Role permissions correctly hide and block unauthorized actions.
- Pricing changes affect new registrations only unless explicitly reapplied.
- Payment success creates receipt correctly.
- Failed and pending payments do not generate final receipts.
- Manual payment verification records audit log.
- Registration exports match active filters.
- Group registration total amount is calculated correctly.
- Workshop capacity cannot be exceeded.
- Winner results appear on public website only after publishing.
- Deactivated admin users cannot log in.
- All sensitive actions are written to audit logs.

## 18. Open Client Confirmations

- Final event registration category fees.
- Early bird, regular, and late fee dates.
- Final workshop fee and capacity for each workshop.
- Whether group registration is required in phase one.
- Final payment gateway provider.
- Whether GST or tax invoice is required.
- Whether student ID or proof upload is required.
- Whether certificates should be included in the first admin release.
- Whether WhatsApp/SMS notification is required in the first admin release.
- Required Excel and PDF report formats.
- Required admin users and exact permission matrix.

## 19. Minimum Viable Admin Release

The first usable admin release should include:

- Secure admin login.
- Super Admin user.
- Role and permission setup.
- Pricing master.
- Program/workshop master.
- Registration list and detail page.
- Payment list and manual verification.
- Receipt download.
- Basic registration and payment reports.
- Excel export.
- Audit log for payment and pricing changes.

This release is enough for the event team to manage live registrations and payments while later modules such as group registration, winner certificates, notifications, and advanced reports are added in follow-up phases.
