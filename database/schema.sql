CREATE TABLE IF NOT EXISTS event_registrations (
    id BIGSERIAL PRIMARY KEY,
    draft_token UUID NOT NULL UNIQUE,
    registration_number VARCHAR(30) UNIQUE,
    registration_mode VARCHAR(20) NOT NULL DEFAULT 'individual',
    participant_name VARCHAR(180),
    institution_name TEXT,
    group_coordinator_name VARCHAR(180),
    group_coordinator_email VARCHAR(180),
    group_coordinator_whatsapp VARCHAR(25),
    expected_participants INTEGER,
    group_members JSONB NOT NULL DEFAULT '[]'::jsonb,
    category VARCHAR(100),
    state_of_residence VARCHAR(100),
    whatsapp_number VARCHAR(25),
    email VARCHAR(180),
    food_preference VARCHAR(20),
    course_of_study VARCHAR(80),
    college_with_state TEXT,
    competition_fee_acknowledged BOOLEAN DEFAULT FALSE,
    pre_conference_workshop VARCHAR(80),
    workshop_fee_acknowledged BOOLEAN DEFAULT FALSE,
    presentation_type VARCHAR(80),
    registration_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    competition_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    workshop_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_payable_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    transaction_details TEXT,
    payment_status VARCHAR(40) NOT NULL DEFAULT 'pending',
    approval_status VARCHAR(40) NOT NULL DEFAULT 'not_submitted',
    registration_status VARCHAR(40) NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS group_members JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS approval_status VARCHAR(40) NOT NULL DEFAULT 'not_submitted';
UPDATE event_registrations
SET approval_status = 'pending_review'
WHERE registration_status = 'submitted' AND approval_status = 'not_submitted';

CREATE TABLE IF NOT EXISTS registration_competitions (
    id BIGSERIAL PRIMARY KEY,
    registration_id BIGINT NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
    competition_name VARCHAR(160) NOT NULL,
    fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (registration_id, competition_name)
);

CREATE INDEX IF NOT EXISTS event_registrations_email_idx ON event_registrations (email);
CREATE INDEX IF NOT EXISTS event_registrations_whatsapp_idx ON event_registrations (whatsapp_number);
CREATE INDEX IF NOT EXISTS event_registrations_status_idx ON event_registrations (registration_status);
CREATE INDEX IF NOT EXISTS event_registrations_payment_status_idx ON event_registrations (payment_status);
CREATE INDEX IF NOT EXISTS event_registrations_approval_status_idx ON event_registrations (approval_status);

CREATE TABLE IF NOT EXISTS sponsorship_applications (
    id BIGSERIAL PRIMARY KEY,
    draft_token UUID NOT NULL UNIQUE,
    application_number VARCHAR(30) UNIQUE,
    organization_name VARCHAR(220),
    correspondence_address TEXT,
    authorized_person_name VARCHAR(180),
    authorized_person_designation VARCHAR(180),
    authorized_person_mobile VARCHAR(25),
    email VARCHAR(180),
    premium_package VARCHAR(40),
    standalone_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    standalone_quantities JSONB NOT NULL DEFAULT '{}'::jsonb,
    other_sponsorship_description TEXT,
    souvenir_advertisement VARCHAR(60),
    premium_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    standalone_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    advertisement_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_payable_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(40),
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
    transaction_reference VARCHAR(180),
    transaction_date DATE,
    payment_proof_name TEXT,
    payment_proof_type VARCHAR(120),
    payment_proof_size BIGINT NOT NULL DEFAULT 0,
    remarks TEXT,
    declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    declaration_accepted_at TIMESTAMPTZ,
    payment_status VARCHAR(40) NOT NULL DEFAULT 'pending',
    application_status VARCHAR(40) NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sponsorship_applications_email_idx ON sponsorship_applications (email);
CREATE INDEX IF NOT EXISTS sponsorship_applications_organization_idx ON sponsorship_applications (organization_name);
CREATE INDEX IF NOT EXISTS sponsorship_applications_status_idx ON sponsorship_applications (application_status);
CREATE INDEX IF NOT EXISTS sponsorship_applications_payment_status_idx ON sponsorship_applications (payment_status);
CREATE UNIQUE INDEX IF NOT EXISTS sponsorship_applications_transaction_reference_key
    ON sponsorship_applications (transaction_reference)
    WHERE transaction_reference IS NOT NULL AND transaction_reference <> '';

CREATE TABLE IF NOT EXISTS admin_roles (
    id TEXT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    mobile VARCHAR(25),
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL DEFAULT 'bcrypt',
    role TEXT NOT NULL DEFAULT 'admin',
    role_id TEXT REFERENCES admin_roles(id),
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS name VARCHAR(160);
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email VARCHAR(180);
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS mobile VARCHAR(25);
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role_id TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Active';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_key ON admin_users (email);

CREATE TABLE IF NOT EXISTS admin_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions (token_hash);

CREATE TABLE IF NOT EXISTS abstract_submissions (
    id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    participant_name TEXT,
    institution_name TEXT,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    file_type VARCHAR(120),
    file_data TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    admin_remarks TEXT,
    reviewed_at TIMESTAMPTZ,
    poster_video_link TEXT,
    video_link_submitted_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS abstract_submissions_status_idx ON abstract_submissions (status);
CREATE INDEX IF NOT EXISTS abstract_submissions_registration_idx ON abstract_submissions (registration_number);

CREATE TABLE IF NOT EXISTS accommodation_travel_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by BIGINT REFERENCES admin_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admin_roles (id, name, description, permissions)
VALUES
    (
        'role-super-admin',
        'Super Admin',
        'Full access to every admin module.',
        '["registration.view","registration.update","registration.export","payment.verify","program.view","program.create","program.update","program.delete","winner.view","winner.create","winner.publish","report.view","report.export","user.view","user.create","user.update","role.manage","audit.view","content.view","content.update"]'::jsonb
    ),
    (
        'role-registration-staff',
        'Registration Staff',
        'Can view and update registrations.',
        '["registration.view","registration.update"]'::jsonb
    ),
    (
        'role-finance-staff',
        'Finance Staff',
        'Can verify payments and export payment reports.',
        '["registration.view","payment.verify","report.view","report.export"]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;
