# PostgreSQL Registration Storage Plan

## Purpose

The registration UI currently saves each tab section as a browser draft. In production, each `Save Section` action should call an API that stores the same data in PostgreSQL.

## Main Table

```sql
CREATE TABLE event_registrations (
    id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(30) UNIQUE,

    participant_name VARCHAR(180),
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

    registration_fee NUMERIC(10, 2) DEFAULT 0,
    competition_fee NUMERIC(10, 2) DEFAULT 0,
    workshop_fee NUMERIC(10, 2) DEFAULT 0,
    total_payable_amount NUMERIC(10, 2) DEFAULT 0,

    transaction_details TEXT,
    gateway_transaction_id VARCHAR(180),
    payment_status VARCHAR(40) DEFAULT 'pending',
    registration_status VARCHAR(40) DEFAULT 'draft',

    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Competition Mapping Table

```sql
CREATE TABLE registration_competitions (
    id BIGSERIAL PRIMARY KEY,
    registration_id BIGINT NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
    competition_name VARCHAR(160) NOT NULL,
    fee_amount NUMERIC(10, 2) DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Optional Payment Audit Table

```sql
CREATE TABLE registration_payments (
    id BIGSERIAL PRIMARY KEY,
    registration_id BIGINT NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
    gateway_name VARCHAR(80),
    gateway_transaction_id VARCHAR(180),
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(40) NOT NULL,
    raw_response JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Recommended API Endpoints

- `POST /api/registrations/draft`
  Save or create a draft registration.

- `PATCH /api/registrations/{id}/general`
  Save participant name, category, state, WhatsApp, email, and food preference.

- `PATCH /api/registrations/{id}/competitions`
  Save course, college, selected competitions, and competition fee acknowledgement.

- `PATCH /api/registrations/{id}/workshop`
  Save pre-conference workshop and workshop fee acknowledgement.

- `PATCH /api/registrations/{id}/presentation`
  Save oral/poster presentation type.

- `PATCH /api/registrations/{id}/payment`
  Save calculated fee and transaction details, or gateway response.

- `POST /api/registrations/{id}/submit`
  Mark registration as submitted, generate registration number, and return confirmation data.

## Status Values

Recommended `registration_status` values:

- `draft`
- `submitted`
- `cancelled`

Recommended `payment_status` values:

- `pending`
- `success`
- `failed`
- `manual_verification_required`
- `refunded`

## Notes

- The frontend should not calculate final trusted fees in production. It can display estimated totals, but the backend should recalculate fees before payment.
- Keep competition selections in `registration_competitions` instead of comma-separated text.
- Store payment gateway raw responses in `JSONB` for reconciliation and audit.
- Use indexes on `email`, `whatsapp_number`, `registration_number`, `payment_status`, and `registration_status` for admin search and reports.
