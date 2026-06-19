import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const sessionCookie = 'ipa_admin_session';
const sessionDurationSeconds = 60 * 60 * 12;
const categoryFees = {
    'Student Delegate - IPA SF Member': 100,
    'Student Delegate - Non IPA SF Member': 100,
    'Delegate IPA Member - Faculty': 100,
    'Delegate IPA Member - Others': 100,
    Others: 100,
};
const premiumSponsorFees = {
    diamond: 300000,
    platinum: 200000,
    gold: 100000,
    silver: 50000,
    bronze: 25000,
};
const standaloneSponsorFees = {
    'exhibition-space': 25000,
    'conference-bag': 200000,
    'writing-kit': 25000,
    breakfast: 100000,
    'high-tea': 50000,
    lunch: 200000,
    'gala-dinner': 300000,
    session: 25000,
    'cultural-event': 10000,
};
const quantityBasedSponsorItems = new Set(['session', 'cultural-event']);
const souvenirAdvertisementFees = {
    'outer-back-cover': 50000,
    'inside-front-cover': 50000,
    'inside-back-cover': 40000,
    'full-page': 25000,
    'half-page': 15000,
    'best-compliments-insert': 5000,
};

const defaultAccommodationTravelContent = {
    pageTitle: 'Accommodation & Travel',
    heading: 'Stay options, pickup points, and nearby places to visit.',
    intro: '',
    assistanceTitle: 'Hospitality & Travel Desk',
    assistanceCopy: 'For accommodation blocks, tariff confirmation, pickup coordination, and local route support, contact the hospitality desk after registration.',
    tariffNotes: 'Sample tariffs are indicative and subject to hotel confirmation, seasonal availability, taxes, and occupancy rules.',
    contactPerson: 'Hospitality Coordinator - +91 98765 43210 - hospitality@nsc2026.in',
    routeNotes: 'Sample route guidance: delegates may arrive by rail, bus, or air. Final venue-specific shuttle schedules will be published closer to the event.',
    accommodationSpaces: [
        {
            name: 'Hotel Green Park Residency',
            type: 'Budget hotel',
            distance: '1.2 km from venue',
            tariff: 'Rs. 1,800 - 2,400 / night',
            contact: '+91 90000 11111',
            notes: 'Single, double, and triple sharing rooms available. Breakfast optional.',
        },
        {
            name: 'Metro Lodge Executive',
            type: 'Economy lodge',
            distance: '2.4 km from venue',
            tariff: 'Rs. 1,200 - 1,900 / night',
            contact: '+91 90000 22222',
            notes: 'Suitable for student groups. Limited AC rooms available.',
        },
        {
            name: 'Grand City Inn',
            type: 'Business hotel',
            distance: '3.1 km from venue',
            tariff: 'Rs. 2,600 - 3,800 / night',
            contact: '+91 90000 33333',
            notes: 'Recommended for faculty and invited guests. Restaurant available.',
        },
        {
            name: 'Students Hostel Annex',
            type: 'Shared hostel stay',
            distance: '800 m from venue',
            tariff: 'Rs. 600 - 900 / person',
            contact: '+91 90000 44444',
            notes: 'Dormitory-style rooms for registered student delegates, subject to availability.',
        },
        {
            name: 'Royal Tourist Home',
            type: 'Budget hotel',
            distance: '2.9 km from venue',
            tariff: 'Rs. 1,500 - 2,200 / night',
            contact: '+91 90000 55555',
            notes: 'Basic AC and non-AC rooms. Early check-in subject to room availability.',
        },
        {
            name: 'City Comfort Residency',
            type: 'Standard hotel',
            distance: '4.0 km from venue',
            tariff: 'Rs. 2,200 - 3,200 / night',
            contact: '+91 90000 66666',
            notes: 'Twin sharing rooms and group booking support available.',
        },
        {
            name: 'Lake View Dormitory',
            type: 'Dormitory',
            distance: '3.6 km from venue',
            tariff: 'Rs. 500 - 750 / person',
            contact: '+91 90000 77777',
            notes: 'Shared facilities for student groups. Advance booking recommended.',
        },
        {
            name: 'Campus Guest House',
            type: 'Guest house',
            distance: '1.6 km from venue',
            tariff: 'Rs. 1,000 - 1,600 / night',
            contact: '+91 90000 88888',
            notes: 'Limited rooms for invited delegates and coordinators.',
        },
    ],
    pickupPoints: [
        {
            name: 'Main Railway Station',
            type: 'Railway station',
            distance: '4.5 km from venue',
            eta: '15-20 min by cab',
            instruction: 'Sample pickup point: main entrance near prepaid taxi counter.',
        },
        {
            name: 'KSRTC Bus Stand',
            type: 'Bus stand',
            distance: '3.8 km from venue',
            eta: '12-18 min by cab',
            instruction: 'Sample pickup point: enquiry counter side gate.',
        },
        {
            name: 'Private Bus Terminal',
            type: 'Bus terminal',
            distance: '5.2 km from venue',
            eta: '18-25 min by cab',
            instruction: 'Sample pickup point: terminal parking bay 2.',
        },
        {
            name: 'Nearest Airport',
            type: 'Airport',
            distance: '32 km from venue',
            eta: '55-70 min by cab',
            instruction: 'Sample pickup point: domestic arrivals gate.',
        },
    ],
    touristAttractions: [
        {
            name: 'Heritage Palace Museum',
            category: 'Culture',
            distance: '6 km from venue',
            image: '/images/sample-tour-attraction.png',
            description: 'A short heritage visit with murals, local history galleries, and traditional architecture.',
        },
        {
            name: 'Marine Drive Promenade',
            category: 'Leisure',
            distance: '8 km from venue',
            image: '/images/sample-tour-attraction.png',
            description: 'Evening walkway with waterfront views, cafes, and shopping streets nearby.',
        },
        {
            name: 'Hill View Point',
            category: 'Nature',
            distance: '18 km from venue',
            image: '/images/sample-tour-attraction.png',
            description: 'A scenic short-trip option for groups with early morning or post-event free time.',
        },
        {
            name: 'Local Handicraft Market',
            category: 'Shopping',
            distance: '5 km from venue',
            image: '/images/sample-tour-attraction.png',
            description: 'Sample place for souvenirs, Kerala textiles, spices, and small gifts.',
        },
    ],
};

function getSql() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not configured.');
    }

    return neon(process.env.DATABASE_URL);
}

function send(response, status, payload) {
    response.status(status).json(payload);
}

function getPath(request) {
    const path = request.query.path;
    if (Array.isArray(path)) {
        return path.join('/');
    }
    if (path) {
        return path;
    }

    return new URL(request.url, 'http://localhost').pathname.replace(/^\/api\/?/, '');
}

function readCookies(request) {
    return Object.fromEntries(
        (request.headers.cookie || '')
            .split(';')
            .map((item) => item.trim().split('='))
            .filter(([key]) => key)
            .map(([key, value]) => [key, decodeURIComponent(value || '')])
    );
}

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function booleanValue(value) {
    return value === true || value === 'Yes';
}

function inputError(message) {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
}

async function ensureAccommodationTravelContent(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS accommodation_travel_content (
            id TEXT PRIMARY KEY DEFAULT 'main',
            content JSONB NOT NULL DEFAULT '{}'::jsonb,
            updated_by BIGINT REFERENCES admin_users(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;

    const rows = await sql`
        INSERT INTO accommodation_travel_content (id, content)
        VALUES ('main', ${JSON.stringify(defaultAccommodationTravelContent)}::jsonb)
        ON CONFLICT (id) DO NOTHING
        RETURNING content, updated_at
    `;

    if (rows.length) {
        return rows[0];
    }

    const existing = await sql`
        SELECT content, updated_at
        FROM accommodation_travel_content
        WHERE id = 'main'
        LIMIT 1
    `;

    return existing[0] || { content: defaultAccommodationTravelContent, updated_at: null };
}

function calculateFees(data) {
    const registrationFee = categoryFees[data.category] || 0;
    const competitionFee = Math.min(Array.isArray(data.studentCompetitions) ? data.studentCompetitions.length : 0, 2) * 100;
    const workshopFee = 0;

    return {
        registrationFee,
        competitionFee,
        workshopFee,
        total: registrationFee + competitionFee + workshopFee,
    };
}

function mapRegistration(row, competitions = []) {
    return {
        draftToken: row.draft_token,
        registrationMode: row.registration_mode,
        participantName: row.participant_name || '',
        institutionName: row.institution_name || '',
        groupCoordinatorName: row.group_coordinator_name || '',
        groupCoordinatorEmail: row.group_coordinator_email || '',
        groupCoordinatorWhatsapp: row.group_coordinator_whatsapp || '',
        expectedParticipants: row.expected_participants?.toString() || '',
        category: row.category || '',
        stateOfResidence: row.state_of_residence || '',
        whatsappNumber: row.whatsapp_number || '',
        email: row.email || '',
        foodPreference: row.food_preference || '',
        courseOfStudy: row.course_of_study || 'B.Pharm',
        collegeWithState: row.college_with_state || '',
        studentCompetitions: competitions,
        competitionFeeAcknowledged: row.competition_fee_acknowledged ? 'Yes' : 'No',
        preConferenceWorkshop: row.pre_conference_workshop || '',
        workshopFeeAcknowledged: row.workshop_fee_acknowledged ? 'Yes' : 'No',
        presentationType: row.presentation_type || '',
        transactionDetails: row.transaction_details || '',
        registrationNumber: row.registration_number || '',
        submittedAt: row.submitted_at || '',
    };
}

async function saveRegistration(sql, data, submit = false) {
    const fees = calculateFees(data);
    const draftToken = data.draftToken || crypto.randomUUID();
    const expectedParticipants = data.expectedParticipants ? Number.parseInt(data.expectedParticipants, 10) : null;

    const rows = await sql`
        INSERT INTO event_registrations (
            draft_token, registration_mode, participant_name, institution_name,
            group_coordinator_name, group_coordinator_email, group_coordinator_whatsapp,
            expected_participants, category, state_of_residence, whatsapp_number, email,
            food_preference, course_of_study, college_with_state,
            competition_fee_acknowledged, pre_conference_workshop,
            workshop_fee_acknowledged, presentation_type, registration_fee,
            competition_fee, workshop_fee, total_payable_amount, transaction_details,
            registration_status, submitted_at
        )
        VALUES (
            ${draftToken}, ${data.registrationMode || 'individual'}, ${data.participantName || null},
            ${data.institutionName || null}, ${data.groupCoordinatorName || null},
            ${data.groupCoordinatorEmail || null}, ${data.groupCoordinatorWhatsapp || null},
            ${expectedParticipants}, ${data.category || null}, ${data.stateOfResidence || null},
            ${data.whatsappNumber || null}, ${data.email || null}, ${data.foodPreference || null},
            ${data.courseOfStudy || null}, ${data.collegeWithState || null},
            ${booleanValue(data.competitionFeeAcknowledged)}, ${data.preConferenceWorkshop || null},
            ${booleanValue(data.workshopFeeAcknowledged)}, ${data.presentationType || null},
            ${fees.registrationFee}, ${fees.competitionFee}, ${fees.workshopFee}, ${fees.total},
            ${data.transactionDetails || null}, ${submit ? 'submitted' : 'draft'},
            ${submit ? new Date().toISOString() : null}
        )
        ON CONFLICT (draft_token) DO UPDATE SET
            registration_mode = EXCLUDED.registration_mode,
            participant_name = EXCLUDED.participant_name,
            institution_name = EXCLUDED.institution_name,
            group_coordinator_name = EXCLUDED.group_coordinator_name,
            group_coordinator_email = EXCLUDED.group_coordinator_email,
            group_coordinator_whatsapp = EXCLUDED.group_coordinator_whatsapp,
            expected_participants = EXCLUDED.expected_participants,
            category = EXCLUDED.category,
            state_of_residence = EXCLUDED.state_of_residence,
            whatsapp_number = EXCLUDED.whatsapp_number,
            email = EXCLUDED.email,
            food_preference = EXCLUDED.food_preference,
            course_of_study = EXCLUDED.course_of_study,
            college_with_state = EXCLUDED.college_with_state,
            competition_fee_acknowledged = EXCLUDED.competition_fee_acknowledged,
            pre_conference_workshop = EXCLUDED.pre_conference_workshop,
            workshop_fee_acknowledged = EXCLUDED.workshop_fee_acknowledged,
            presentation_type = EXCLUDED.presentation_type,
            registration_fee = EXCLUDED.registration_fee,
            competition_fee = EXCLUDED.competition_fee,
            workshop_fee = EXCLUDED.workshop_fee,
            total_payable_amount = EXCLUDED.total_payable_amount,
            transaction_details = EXCLUDED.transaction_details,
            registration_status = EXCLUDED.registration_status,
            submitted_at = COALESCE(EXCLUDED.submitted_at, event_registrations.submitted_at),
            updated_at = NOW()
        RETURNING *
    `;
    const row = rows[0];

    if (submit && !row.registration_number) {
        const prefix = row.registration_mode === 'group' ? 'NSC26-GRP' : 'NSC26';
        const registrationNumber = `${prefix}-${String(row.id).padStart(6, '0')}`;
        const updatedRows = await sql`
            UPDATE event_registrations
            SET registration_number = ${registrationNumber}, updated_at = NOW()
            WHERE id = ${row.id}
            RETURNING *
        `;
        Object.assign(row, updatedRows[0]);
    }

    await sql`DELETE FROM registration_competitions WHERE registration_id = ${row.id}`;
    const competitions = (Array.isArray(data.studentCompetitions) ? data.studentCompetitions : []).slice(0, 2);
    for (const competition of competitions) {
        await sql`
            INSERT INTO registration_competitions (registration_id, competition_name, fee_amount)
            VALUES (${row.id}, ${competition}, 100)
        `;
    }

    return mapRegistration(row, competitions);
}

function calculateSponsorFees(data) {
    const premiumAmount = premiumSponsorFees[data.premiumPackage] || 0;
    const standaloneItems = Array.isArray(data.standaloneItems)
        ? [...new Set(data.standaloneItems)].filter((id) => standaloneSponsorFees[id])
        : [];
    const standaloneQuantities =
        data.standaloneQuantities && typeof data.standaloneQuantities === 'object' ? data.standaloneQuantities : {};
    const standaloneAmount = standaloneItems.reduce((total, id) => {
        const quantity = quantityBasedSponsorItems.has(id)
            ? Math.max(Number.parseInt(standaloneQuantities[id], 10) || 1, 1)
            : 1;
        return total + standaloneSponsorFees[id] * quantity;
    }, 0);
    const advertisementAmount = souvenirAdvertisementFees[data.souvenirAdvertisement] || 0;

    return {
        premiumAmount,
        standaloneAmount,
        advertisementAmount,
        total: premiumAmount + standaloneAmount + advertisementAmount,
        standaloneItems,
        standaloneQuantities,
    };
}

function formatDateOnly(value) {
    if (!value) {
        return '';
    }
    if (value instanceof Date) {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(value);
    }
    return String(value).slice(0, 10);
}

function mapSponsorApplication(row) {
    return {
        draftToken: row.draft_token,
        organizationName: row.organization_name || '',
        correspondenceAddress: row.correspondence_address || '',
        authorizedPersonName: row.authorized_person_name || '',
        authorizedPersonDesignation: row.authorized_person_designation || '',
        authorizedPersonMobile: row.authorized_person_mobile || '',
        email: row.email || '',
        premiumPackage: row.premium_package || '',
        standaloneItems: row.standalone_items || [],
        standaloneQuantities: row.standalone_quantities || {},
        otherSponsorshipDescription: row.other_sponsorship_description || '',
        souvenirAdvertisement: row.souvenir_advertisement || '',
        paymentMethod: row.payment_method || '',
        amountPaid: row.amount_paid?.toString() || '',
        transactionReference: row.transaction_reference || '',
        transactionDate: formatDateOnly(row.transaction_date),
        paymentProofName: row.payment_proof_name || '',
        paymentProofType: row.payment_proof_type || '',
        paymentProofSize: Number(row.payment_proof_size) || 0,
        remarks: row.remarks || '',
        declarationAccepted: Boolean(row.declaration_accepted),
        applicationNumber: row.application_number || '',
        submittedAt: row.submitted_at || '',
    };
}

function validateSponsorSubmission(data, fees) {
    const requiredText = [
        data.organizationName,
        data.correspondenceAddress,
        data.authorizedPersonName,
        data.authorizedPersonDesignation,
        data.authorizedPersonMobile,
        data.email,
        data.paymentMethod,
        data.transactionReference,
        data.transactionDate,
        data.paymentProofName,
    ];
    if (requiredText.some((value) => !String(value || '').trim())) {
        throw inputError('Complete all required sponsor and payment fields.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
        throw inputError('Enter a valid sponsor email address.');
    }
    if (!fees.total && !String(data.otherSponsorshipDescription || '').trim()) {
        throw inputError('Select at least one sponsorship opportunity.');
    }
    if (!(Number(data.amountPaid) > 0)) {
        throw inputError('Enter a valid amount paid.');
    }
    if (!data.declarationAccepted) {
        throw inputError('Accept the final declaration before submitting.');
    }
}

async function saveSponsorApplication(sql, data, submit = false) {
    const fees = calculateSponsorFees(data);
    if (submit) {
        validateSponsorSubmission(data, fees);
    }

    const draftToken = data.draftToken || crypto.randomUUID();
    const paymentProofSize = Math.max(Number.parseInt(data.paymentProofSize, 10) || 0, 0);
    if (paymentProofSize > 10 * 1024 * 1024) {
        throw inputError('Payment proof must be 10 MB or smaller.');
    }

    const rows = await sql`
        INSERT INTO sponsorship_applications (
            draft_token, organization_name, correspondence_address,
            authorized_person_name, authorized_person_designation,
            authorized_person_mobile, email, premium_package,
            standalone_items, standalone_quantities, other_sponsorship_description,
            souvenir_advertisement, premium_amount, standalone_amount,
            advertisement_amount, total_payable_amount, payment_method,
            amount_paid, transaction_reference, transaction_date,
            payment_proof_name, payment_proof_type, payment_proof_size,
            remarks, declaration_accepted, declaration_accepted_at,
            payment_status, application_status, submitted_at
        )
        VALUES (
            ${draftToken}, ${String(data.organizationName || '').trim() || null},
            ${String(data.correspondenceAddress || '').trim() || null},
            ${String(data.authorizedPersonName || '').trim() || null},
            ${String(data.authorizedPersonDesignation || '').trim() || null},
            ${String(data.authorizedPersonMobile || '').trim() || null},
            ${String(data.email || '').trim().toLowerCase() || null},
            ${data.premiumPackage || null},
            ${JSON.stringify(fees.standaloneItems)}::jsonb,
            ${JSON.stringify(fees.standaloneQuantities)}::jsonb,
            ${String(data.otherSponsorshipDescription || '').trim() || null},
            ${data.souvenirAdvertisement || null},
            ${fees.premiumAmount}, ${fees.standaloneAmount},
            ${fees.advertisementAmount}, ${fees.total},
            ${data.paymentMethod || null}, ${Number(data.amountPaid) || 0},
            ${String(data.transactionReference || '').trim() || null},
            ${data.transactionDate || null},
            ${String(data.paymentProofName || '').trim() || null},
            ${String(data.paymentProofType || '').trim() || null},
            ${paymentProofSize},
            ${String(data.remarks || '').trim() || null},
            ${Boolean(data.declarationAccepted)},
            ${data.declarationAccepted ? new Date().toISOString() : null},
            ${submit ? 'verification_required' : 'pending'},
            ${submit ? 'submitted' : 'draft'},
            ${submit ? new Date().toISOString() : null}
        )
        ON CONFLICT (draft_token) DO UPDATE SET
            organization_name = EXCLUDED.organization_name,
            correspondence_address = EXCLUDED.correspondence_address,
            authorized_person_name = EXCLUDED.authorized_person_name,
            authorized_person_designation = EXCLUDED.authorized_person_designation,
            authorized_person_mobile = EXCLUDED.authorized_person_mobile,
            email = EXCLUDED.email,
            premium_package = EXCLUDED.premium_package,
            standalone_items = EXCLUDED.standalone_items,
            standalone_quantities = EXCLUDED.standalone_quantities,
            other_sponsorship_description = EXCLUDED.other_sponsorship_description,
            souvenir_advertisement = EXCLUDED.souvenir_advertisement,
            premium_amount = EXCLUDED.premium_amount,
            standalone_amount = EXCLUDED.standalone_amount,
            advertisement_amount = EXCLUDED.advertisement_amount,
            total_payable_amount = EXCLUDED.total_payable_amount,
            payment_method = EXCLUDED.payment_method,
            amount_paid = EXCLUDED.amount_paid,
            transaction_reference = EXCLUDED.transaction_reference,
            transaction_date = EXCLUDED.transaction_date,
            payment_proof_name = EXCLUDED.payment_proof_name,
            payment_proof_type = EXCLUDED.payment_proof_type,
            payment_proof_size = EXCLUDED.payment_proof_size,
            remarks = EXCLUDED.remarks,
            declaration_accepted = EXCLUDED.declaration_accepted,
            declaration_accepted_at = EXCLUDED.declaration_accepted_at,
            payment_status = EXCLUDED.payment_status,
            application_status = EXCLUDED.application_status,
            submitted_at = COALESCE(EXCLUDED.submitted_at, sponsorship_applications.submitted_at),
            updated_at = NOW()
        RETURNING *
    `;
    const row = rows[0];

    if (submit && !row.application_number) {
        const applicationNumber = `NSC26-SPN-${String(row.id).padStart(6, '0')}`;
        const updatedRows = await sql`
            UPDATE sponsorship_applications
            SET application_number = ${applicationNumber}, updated_at = NOW()
            WHERE id = ${row.id}
            RETURNING *
        `;
        return mapSponsorApplication(updatedRows[0]);
    }

    return mapSponsorApplication(row);
}

async function getSession(request, sql) {
    const token = readCookies(request)[sessionCookie];
    if (!token) {
        return null;
    }

    const rows = await sql`
        SELECT
            u.id, u.name, u.email, u.mobile, u.role_id, u.status, u.last_login_at,
            r.name AS role_name, r.permissions
        FROM admin_sessions s
        JOIN admin_users u ON u.id = s.user_id
        LEFT JOIN admin_roles r ON r.id = u.role_id
        WHERE s.token_hash = ${hashToken(token)}
          AND s.revoked_at IS NULL
          AND s.expires_at > NOW()
          AND u.status = 'Active'
        LIMIT 1
    `;

    return rows[0] || null;
}

function publicSession(user) {
    return {
        userId: user.id,
        name: user.name,
        email: user.email,
        roleId: user.role_id,
        roleName: user.role_name,
        permissions: user.permissions || [],
        loggedInAt: user.last_login_at,
    };
}

function requirePermission(user, permission) {
    return user?.permissions?.includes(permission);
}

function publicRole(row) {
    return {
        id: row.id,
        name: row.name,
        description: row.description || '',
        permissions: row.permissions || [],
        active: row.is_active,
    };
}

function publicUser(row) {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        mobile: row.mobile || '',
        roleId: row.role_id,
        status: row.status,
        lastLogin: row.last_login_at ? new Date(row.last_login_at).toLocaleString('en-IN') : '',
    };
}

async function ensureSeedAdmin(sql) {
    const email = process.env.ADMIN_SEED_EMAIL;
    const password = process.env.ADMIN_SEED_PASSWORD;
    if (!email || !password) {
        return;
    }

    const existing = await sql`SELECT id FROM admin_users WHERE email = ${email.toLowerCase()} LIMIT 1`;
    if (existing.length) {
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const legacyAdmin = await sql`SELECT id FROM admin_users WHERE username = 'admin' ORDER BY id LIMIT 1`;
    if (legacyAdmin.length) {
        await sql`
            UPDATE admin_users
            SET name = 'Super Admin',
                email = ${email.toLowerCase()},
                password_hash = ${passwordHash},
                salt = 'bcrypt',
                role_id = 'role-super-admin',
                status = 'Active',
                updated_at = NOW()
            WHERE id = ${legacyAdmin[0].id}
        `;
        return;
    }

    await sql`
        INSERT INTO admin_users (username, name, email, password_hash, salt, role, role_id, status)
        VALUES ('admin', 'Super Admin', ${email.toLowerCase()}, ${passwordHash}, 'bcrypt', 'admin', 'role-super-admin', 'Active')
        ON CONFLICT (email) DO NOTHING
    `;
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

function mapAbstractSubmission(row) {
    return {
        id: row.id,
        registrationNumber: row.registration_number,
        participantName: row.participant_name || '',
        institutionName: row.institution_name || '',
        fileName: row.file_name,
        fileSize: Number(row.file_size),
        fileType: row.file_type || '',
        status: row.status,
        adminRemarks: row.admin_remarks || '',
        reviewedAt: row.reviewed_at || null,
        posterVideoLink: row.poster_video_link || '',
        videoLinkSubmittedAt: row.video_link_submitted_at || null,
        submittedAt: row.submitted_at,
    };
}

export default async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store');
    const path = getPath(request);

    try {
        const sql = getSql();

        if (request.method === 'GET' && path === 'health') {
            const rows = await sql`SELECT NOW() AS database_time`;
            return send(response, 200, { ok: true, databaseTime: rows[0].database_time });
        }

        if (path === 'registrations/draft' && request.method === 'GET') {
            const token = request.query.token;
            if (!token) {
                return send(response, 400, { error: 'Draft token is required.' });
            }
            const rows = await sql`SELECT * FROM event_registrations WHERE draft_token = ${token} LIMIT 1`;
            if (!rows.length) {
                return send(response, 404, { error: 'Draft not found.' });
            }
            const competitions = await sql`
                SELECT competition_name FROM registration_competitions
                WHERE registration_id = ${rows[0].id}
                ORDER BY id
            `;
            return send(response, 200, {
                registration: mapRegistration(rows[0], competitions.map((item) => item.competition_name)),
            });
        }

        if (path === 'registrations/draft' && request.method === 'POST') {
            const registration = await saveRegistration(sql, request.body || {});
            return send(response, 200, { registration });
        }

        if (path === 'registrations/submit' && request.method === 'POST') {
            const registration = await saveRegistration(sql, request.body || {}, true);
            return send(response, 200, { registration });
        }

        if (path === 'sponsors/draft' && request.method === 'GET') {
            const token = request.query.token;
            if (!token) {
                return send(response, 400, { error: 'Draft token is required.' });
            }
            const rows = await sql`SELECT * FROM sponsorship_applications WHERE draft_token = ${token} LIMIT 1`;
            if (!rows.length) {
                return send(response, 404, { error: 'Sponsor draft not found.' });
            }
            return send(response, 200, { sponsor: mapSponsorApplication(rows[0]) });
        }

        if (path === 'sponsors/draft' && request.method === 'POST') {
            const sponsor = await saveSponsorApplication(sql, request.body || {});
            return send(response, 200, { sponsor });
        }

        if (path === 'sponsors/submit' && request.method === 'POST') {
            const sponsor = await saveSponsorApplication(sql, request.body || {}, true);
            return send(response, 200, { sponsor });
        }

        if (path === 'accommodation-travel' && request.method === 'GET') {
            const row = await ensureAccommodationTravelContent(sql);
            return send(response, 200, { content: row.content, updatedAt: row.updated_at });
        }

        if (path === 'admin/auth/login' && request.method === 'POST') {
            await ensureSeedAdmin(sql);
            const email = String(request.body?.email || '').trim().toLowerCase();
            const password = String(request.body?.password || '');
            const rows = await sql`
                SELECT u.*, r.name AS role_name, r.permissions
                FROM admin_users u
                LEFT JOIN admin_roles r ON r.id = u.role_id
                WHERE u.email = ${email}
                LIMIT 1
            `;
            const user = rows[0];
            if (!user || user.status !== 'Active' || !(await bcrypt.compare(password, user.password_hash))) {
                return send(response, 401, { error: 'Invalid credentials or inactive user.' });
            }

            const token = crypto.randomBytes(32).toString('base64url');
            const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000).toISOString();
            await sql`
                INSERT INTO admin_sessions (user_id, token_hash, expires_at)
                VALUES (${user.id}, ${hashToken(token)}, ${expiresAt})
            `;
            await sql`UPDATE admin_users SET last_login_at = NOW() WHERE id = ${user.id}`;
            response.setHeader(
                'Set-Cookie',
                `${sessionCookie}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionDurationSeconds}${process.env.VERCEL ? '; Secure' : ''}`
            );
            return send(response, 200, { session: publicSession(user) });
        }

        if (path === 'admin/auth/logout' && request.method === 'POST') {
            const token = readCookies(request)[sessionCookie];
            if (token) {
                await sql`UPDATE admin_sessions SET revoked_at = NOW() WHERE token_hash = ${hashToken(token)}`;
            }
            response.setHeader('Set-Cookie', `${sessionCookie}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
            return send(response, 200, { ok: true });
        }

        const session = await getSession(request, sql);
        if (!session) {
            return send(response, 401, { error: 'Authentication required.' });
        }

        if (path === 'admin/me' && request.method === 'GET') {
            return send(response, 200, { session: publicSession(session) });
        }

        if (path === 'admin/bootstrap' && request.method === 'GET') {
            const roleRows = await sql`SELECT * FROM admin_roles ORDER BY created_at, name`;
            const userRows = requirePermission(session, 'user.view')
                ? await sql`SELECT * FROM admin_users ORDER BY created_at, name`
                : [];
            return send(response, 200, {
                roles: roleRows.map(publicRole),
                users: userRows.map(publicUser),
            });
        }

        if (path === 'admin/roles' && request.method === 'POST') {
            if (!requirePermission(session, 'role.manage')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const id = `role-${crypto.randomUUID()}`;
            const rows = await sql`
                INSERT INTO admin_roles (id, name, description, permissions)
                VALUES (
                    ${id},
                    ${String(request.body?.name || '').trim()},
                    ${String(request.body?.description || '').trim()},
                    ${JSON.stringify(request.body?.permissions || [])}::jsonb
                )
                RETURNING *
            `;
            return send(response, 201, { role: publicRole(rows[0]) });
        }

        if (path === 'admin/users' && request.method === 'POST') {
            if (!requirePermission(session, 'user.create')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const passwordHash = await bcrypt.hash(String(request.body?.password || ''), 12);
            const username = `${String(request.body?.email || '').split('@')[0]}-${crypto.randomBytes(3).toString('hex')}`;
            const rows = await sql`
                INSERT INTO admin_users (username, name, email, mobile, password_hash, salt, role, role_id, status)
                VALUES (
                    ${username},
                    ${String(request.body?.name || '').trim()},
                    ${String(request.body?.email || '').trim().toLowerCase()},
                    ${String(request.body?.mobile || '').trim() || null},
                    ${passwordHash},
                    'bcrypt',
                    'admin',
                    ${request.body?.roleId || null},
                    ${request.body?.status || 'Active'}
                )
                RETURNING *
            `;
            return send(response, 201, { user: publicUser(rows[0]) });
        }

        const userMatch = path.match(/^admin\/users\/([^/]+)$/);
        if (userMatch && request.method === 'PATCH') {
            if (!requirePermission(session, 'user.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const userId = userMatch[1];
            const action = request.body?.action;
            let rows;
            if (action === 'status') {
                rows = await sql`
                    UPDATE admin_users SET status = ${request.body.status}, updated_at = NOW()
                    WHERE id = ${userId}
                    RETURNING *
                `;
            } else if (action === 'password') {
                const passwordHash = await bcrypt.hash(String(request.body.password || ''), 12);
                rows = await sql`
                    UPDATE admin_users SET password_hash = ${passwordHash}, updated_at = NOW()
                    WHERE id = ${userId}
                    RETURNING *
                `;
            } else {
                return send(response, 400, { error: 'Unsupported user update.' });
            }
            return send(response, 200, { user: publicUser(rows[0]) });
        }

        if (path === 'admin/accommodation-travel' && request.method === 'GET') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'content.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const row = await ensureAccommodationTravelContent(sql);
            return send(response, 200, { content: row.content, updatedAt: row.updated_at });
        }

        if (path === 'admin/accommodation-travel' && request.method === 'PUT') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'content.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            await ensureAccommodationTravelContent(sql);
            const content = request.body?.content || defaultAccommodationTravelContent;
            const rows = await sql`
                INSERT INTO accommodation_travel_content (id, content, updated_by, updated_at)
                VALUES ('main', ${JSON.stringify(content)}::jsonb, ${session.id}, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    content = EXCLUDED.content,
                    updated_by = EXCLUDED.updated_by,
                    updated_at = NOW()
                RETURNING content, updated_at
            `;
            return send(response, 200, { content: rows[0].content, updatedAt: rows[0].updated_at });
        }

        // ── Abstract check (public) ──────────────────────────────────
        if (path === 'abstracts/check' && request.method === 'GET') {
            const regNum = String(request.query.registrationNumber || '').trim().toUpperCase();
            if (!regNum) {
                return send(response, 400, { error: 'Registration number is required.' });
            }
            const regRows = await sql`
                SELECT id, participant_name, institution_name
                FROM event_registrations
                WHERE registration_number = ${regNum}
                LIMIT 1
            `;
            if (!regRows.length) {
                return send(response, 200, { valid: false });
            }
            const reg = regRows[0];
            const absRows = await sql`
                SELECT status, file_name, poster_video_link, video_link_submitted_at
                FROM abstract_submissions
                WHERE registration_number = ${regNum}
                LIMIT 1
            `;
            return send(response, 200, {
                valid: true,
                participantName: reg.participant_name || '',
                institutionName: reg.institution_name || '',
                alreadySubmitted: absRows.length > 0,
                abstractStatus: absRows.length > 0 ? absRows[0].status : null,
                fileName: absRows.length > 0 ? absRows[0].file_name : null,
                posterVideoLink: absRows.length > 0 ? (absRows[0].poster_video_link || null) : null,
            });
        }

        // ── Abstract submit (public) ─────────────────────────────────
        if (path === 'abstracts/submit' && request.method === 'POST') {
            const regNum = String(request.body?.registrationNumber || '').trim().toUpperCase();
            if (!regNum) throw inputError('Registration number is required.');
            const fileName = String(request.body?.fileName || '').trim();
            const fileData = String(request.body?.fileData || '').trim();
            if (!fileName || !fileData) throw inputError('File is required.');
            const fileSize = Number(request.body?.fileSize) || 0;
            if (fileSize > 5 * 1024 * 1024) throw inputError('File exceeds the 5 MB limit.');

            const regRows = await sql`
                SELECT id, participant_name, institution_name
                FROM event_registrations
                WHERE registration_number = ${regNum}
                LIMIT 1
            `;
            if (!regRows.length) throw inputError('Registration number not found.');

            const existing = await sql`
                SELECT id FROM abstract_submissions WHERE registration_number = ${regNum} LIMIT 1
            `;
            if (existing.length) throw inputError('An abstract has already been submitted for this registration number. Only one submission is allowed and it cannot be replaced.');

            const rows = await sql`
                INSERT INTO abstract_submissions
                    (registration_number, participant_name, institution_name, file_name, file_size, file_type, file_data, status)
                VALUES (
                    ${regNum},
                    ${regRows[0].participant_name || null},
                    ${regRows[0].institution_name || null},
                    ${fileName},
                    ${fileSize},
                    ${String(request.body?.fileType || '').trim() || null},
                    ${fileData},
                    'pending'
                )
                RETURNING *
            `;
            return send(response, 201, { submission: mapAbstractSubmission(rows[0]) });
        }

        // ── Poster video link submit (public) ────────────────────────
        if (path === 'abstracts/video-link' && request.method === 'POST') {
            const regNum = String(request.body?.registrationNumber || '').trim().toUpperCase();
            if (!regNum) throw inputError('Registration number is required.');
            const videoLink = String(request.body?.videoLink || '').trim();
            if (!videoLink) throw inputError('Video link is required.');

            const rows = await sql`
                SELECT id, status, poster_video_link
                FROM abstract_submissions
                WHERE registration_number = ${regNum}
                LIMIT 1
            `;
            if (!rows.length) throw inputError('No abstract submission found for this registration number.');
            if (rows[0].status !== 'accepted') throw inputError('Video link can only be submitted once your abstract has been accepted.');
            if (rows[0].poster_video_link) throw inputError('A video link has already been submitted for this registration number.');

            const updated = await sql`
                UPDATE abstract_submissions
                SET poster_video_link = ${videoLink},
                    video_link_submitted_at = NOW(),
                    updated_at = NOW()
                WHERE registration_number = ${regNum}
                RETURNING *
            `;
            return send(response, 200, { submission: mapAbstractSubmission(updated[0]) });
        }

        // ── Admin: list abstracts ────────────────────────────────────
        if (path === 'admin/abstracts' && request.method === 'GET') {
            if (!requirePermission(session, 'registration.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const rows = await sql`
                SELECT id, registration_number, participant_name, institution_name,
                       file_name, file_size, file_type, status, admin_remarks,
                       reviewed_at, poster_video_link, video_link_submitted_at, submitted_at
                FROM abstract_submissions
                ORDER BY submitted_at DESC
            `;
            return send(response, 200, { abstracts: rows.map(mapAbstractSubmission) });
        }

        // ── Admin: download abstract file ────────────────────────────
        const absDownloadMatch = path.match(/^admin\/abstracts\/(\d+)\/download$/);
        if (absDownloadMatch && request.method === 'GET') {
            if (!requirePermission(session, 'registration.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const rows = await sql`
                SELECT file_name, file_type, file_data
                FROM abstract_submissions
                WHERE id = ${absDownloadMatch[1]}
                LIMIT 1
            `;
            if (!rows.length) return send(response, 404, { error: 'Submission not found.' });
            const { file_name, file_type, file_data } = rows[0];
            const buffer = Buffer.from(file_data, 'base64');
            response.setHeader('Content-Type', file_type || 'application/octet-stream');
            response.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
            response.setHeader('Content-Length', buffer.length);
            return response.status(200).end(buffer);
        }

        // ── Admin: review abstract ───────────────────────────────────
        const absReviewMatch = path.match(/^admin\/abstracts\/(\d+)$/);
        if (absReviewMatch && request.method === 'PATCH') {
            if (!requirePermission(session, 'registration.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const { status, adminRemarks } = request.body || {};
            if (!['accepted', 'rejected', 'pending'].includes(status)) {
                throw inputError('Invalid status. Must be accepted, rejected, or pending.');
            }
            const rows = await sql`
                UPDATE abstract_submissions
                SET status = ${status},
                    admin_remarks = ${adminRemarks ? String(adminRemarks).trim() : null},
                    reviewed_at = NOW(),
                    updated_at = NOW()
                WHERE id = ${absReviewMatch[1]}
                RETURNING *
            `;
            if (!rows.length) return send(response, 404, { error: 'Submission not found.' });
            return send(response, 200, { submission: mapAbstractSubmission(rows[0]) });
        }

        return send(response, 404, { error: 'API route not found.' });
    } catch (error) {
        console.error(error);
        const status = error?.statusCode || (error?.code === '23505' ? 409 : 500);
        const message =
            status === 409
                ? 'That value already exists. Check the transaction reference and try again.'
                : status === 400
                    ? error.message
                    : 'Server request failed.';
        return send(response, status, { error: message });
    }
}
