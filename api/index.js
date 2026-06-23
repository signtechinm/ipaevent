import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { del, put } from '@vercel/blob';
import nodemailer from 'nodemailer';

const sessionCookie = 'ipa_admin_session';
const sessionDurationSeconds = 60 * 60 * 12;
const defaultCategories = [
    ['Student Delegate - IPA SF Member', 100, 10],
    ['Student Delegate - Non IPA SF Member', 100, 20],
    ['Delegate IPA Member - Faculty', 100, 30],
    ['Delegate IPA Member - Others', 100, 40],
    ['Others', 100, 50],
];
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
const defaultPrograms = [
    ['Patient Counselling Competitions', 'competition', 100, 10],
    ['Extempore Preparations in Pharmaceutics', 'competition', 100, 20],
    ['Ideation Contest', 'competition', 100, 30],
    ['Pharma Quiz (Group)', 'competition', 100, 40],
    ['Elocution', 'competition', 100, 50],
    ['Clinical Skill Sets', 'competition', 100, 60],
    ['AI', 'workshop', 0, 10],
    ['Vaccination', 'workshop', 0, 20],
    ['3D Printing', 'workshop', 0, 30],
    ['NDDS Formulation and Characterization', 'workshop', 0, 40],
];

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
    return true;
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

function slugifyFilePart(value, fallback = 'photo') {
    const slug = String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
    return slug || fallback;
}

function parseDataUrl(dataUrl) {
    const match = String(dataUrl || '').match(/^data:([^;,]+);base64,(.+)$/);
    if (!match) {
        return null;
    }
    return {
        contentType: match[1],
        buffer: Buffer.from(match[2], 'base64'),
    };
}

function formatStatusLabel(status) {
    return String(status || '-').replaceAll('_', ' ');
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

let mailTransporter;

function getMailConfig() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || process.env.MAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;
    const fromAddress = process.env.MAIL_FROM || 'nsc2026@ipakerala.org';
    const fromName = process.env.MAIL_FROM_NAME || '14th IPA NSC 2026';

    if (!host || !user || !pass) {
        return null;
    }

    return {
        transport: {
            host,
            port,
            secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465,
            auth: { user, pass },
        },
        from: `"${fromName}" <${fromAddress}>`,
    };
}

function getMailTransporter() {
    const config = getMailConfig();
    if (!config) return null;
    if (!mailTransporter) {
        mailTransporter = nodemailer.createTransport(config.transport);
    }
    return { transporter: mailTransporter, from: config.from };
}

async function sendStudentMail({ to, subject, preview, body }) {
    const recipient = String(to || '').trim();
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
        return { skipped: true, reason: 'missing-recipient' };
    }

    const mailer = getMailTransporter();
    if (!mailer) {
        console.warn('Mailer is not configured. Add SMTP_HOST, SMTP_USER, and SMTP_PASS to enable student emails.');
        return { skipped: true, reason: 'mailer-not-configured' };
    }

    const safePreview = escapeHtml(preview || '');
    const safeBody = Array.isArray(body) ? body.map((line) => `<p>${escapeHtml(line)}</p>`).join('\n') : String(body || '');
    return mailer.transporter.sendMail({
        from: mailer.from,
        to: recipient,
        replyTo: process.env.MAIL_REPLY_TO || process.env.MAIL_FROM || 'nsc2026@ipakerala.org',
        subject,
        text: Array.isArray(body) ? body.join('\n\n') : String(body || ''),
        html: `
            <div style="display:none;max-height:0;overflow:hidden">${safePreview}</div>
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#18181b">
                <h2 style="margin:0 0 12px;color:#0d124f">14th IPA National Students Congress 2026</h2>
                ${safeBody}
                <p style="margin-top:24px;color:#52525b">Regards,<br>NSC 2026 Secretariat<br>IPA Kerala State Branch</p>
            </div>
        `,
    });
}

function queueStudentMail(message) {
    sendStudentMail(message).catch((error) => {
        console.error('Student mail failed:', error);
    });
}

function getRegistrationMailRecipient(registration = {}) {
    return registration.email || registration.groupCoordinatorEmail || registration.hrEmail || '';
}

async function getRegistrationContactForMail(sql, registrationNumber) {
    const rows = await sql`
        SELECT registration_number, participant_name, group_coordinator_name, email,
               group_coordinator_email, hr_email, payment_status, approval_status
        FROM event_registrations
        WHERE registration_number = ${registrationNumber}
        LIMIT 1
    `;
    if (!rows.length) return null;
    return {
        registrationNumber: rows[0].registration_number || '',
        name: rows[0].participant_name || rows[0].group_coordinator_name || 'Delegate',
        email: rows[0].email || rows[0].group_coordinator_email || rows[0].hr_email || '',
        paymentStatus: rows[0].payment_status || '',
        approvalStatus: rows[0].approval_status || '',
    };
}

function notifyRegistrationSubmitted(registration) {
    const to = getRegistrationMailRecipient(registration);
    queueStudentMail({
        to,
        subject: `Registration received - ${registration.registrationNumber || 'NSC 2026'}`,
        preview: 'Your NSC 2026 registration has been received.',
        body: [
            `Dear ${registration.participantName || registration.groupCoordinatorName || 'Delegate'},`,
            `Your registration has been received successfully. Registration number: ${registration.registrationNumber || '-'}.`,
            `Payment status: ${formatStatusLabel(registration.paymentStatus || 'pending')}. Approval status: ${formatStatusLabel(registration.approvalStatus || 'pending_review')}.`,
            'Please keep this registration number for payment verification, abstract submission, and future updates.',
        ],
    });
}

function notifyPaymentUpdated(registration) {
    const to = getRegistrationMailRecipient(registration);
    queueStudentMail({
        to,
        subject: `Payment status updated - ${registration.registrationNumber || 'NSC 2026'}`,
        preview: `Your payment status is now ${formatStatusLabel(registration.paymentStatus)}.`,
        body: [
            `Dear ${registration.participantName || registration.groupCoordinatorName || 'Delegate'},`,
            `Your payment status for registration ${registration.registrationNumber || '-'} has been updated to ${formatStatusLabel(registration.paymentStatus)}.`,
            `Total payable amount: Rs. ${(Number(registration.totalPayableAmount) || 0).toLocaleString('en-IN')}.`,
            'If you believe this status is incorrect, please contact the NSC 2026 secretariat with your transaction reference.',
        ],
    });
}

function notifyApprovalUpdated(registration) {
    const to = getRegistrationMailRecipient(registration);
    queueStudentMail({
        to,
        subject: `Registration approval updated - ${registration.registrationNumber || 'NSC 2026'}`,
        preview: `Your registration approval status is now ${formatStatusLabel(registration.approvalStatus)}.`,
        body: [
            `Dear ${registration.participantName || registration.groupCoordinatorName || 'Delegate'},`,
            `Your registration ${registration.registrationNumber || '-'} approval status has been updated to ${formatStatusLabel(registration.approvalStatus)}.`,
            registration.approvalStatus === 'approved'
                ? 'If your payment status is also success, you may proceed with eligible scientific submissions from the portal.'
                : 'Please watch your email and the portal for further updates.',
        ],
    });
}

function notifyAbstractReviewed(contact, submission) {
    if (!contact) return;
    queueStudentMail({
        to: contact.email,
        subject: `Abstract review update - ${submission.registrationNumber || contact.registrationNumber}`,
        preview: `Your abstract status is now ${formatStatusLabel(submission.status)}.`,
        body: [
            `Dear ${contact.name || 'Delegate'},`,
            `Your abstract submitted under registration ${submission.registrationNumber || contact.registrationNumber || '-'} has been marked ${formatStatusLabel(submission.status)}.`,
            submission.adminRemarks ? `Remarks: ${submission.adminRemarks}` : 'No additional remarks were added.',
            submission.status === 'accepted'
                ? 'You may submit your poster video link from the Scientific Service page when ready.'
                : 'Please watch the portal and your registered email for further instructions.',
        ],
    });
}

function notifyVideoReviewed(contact, submission) {
    if (!contact) return;
    queueStudentMail({
        to: contact.email,
        subject: `Video review update - ${submission.registrationNumber || contact.registrationNumber}`,
        preview: `Your video review status is now ${formatStatusLabel(submission.videoReviewStatus)}.`,
        body: [
            `Dear ${contact.name || 'Delegate'},`,
            `Your poster video review status for registration ${submission.registrationNumber || contact.registrationNumber || '-'} has been updated to ${formatStatusLabel(submission.videoReviewStatus)}.`,
            submission.videoReviewRemarks ? `Remarks: ${submission.videoReviewRemarks}` : 'No additional remarks were added.',
        ],
    });
}

async function ensureAbstractSubmissions(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS abstract_submissions (
            id BIGSERIAL PRIMARY KEY,
            registration_number VARCHAR(30) NOT NULL UNIQUE,
            participant_name TEXT,
            institution_name TEXT,
            file_name TEXT NOT NULL,
            file_size BIGINT NOT NULL DEFAULT 0,
            file_type VARCHAR(120),
            file_data TEXT,
            file_url TEXT,
            blob_path TEXT,
            status VARCHAR(30) NOT NULL DEFAULT 'pending',
            admin_remarks TEXT,
            reviewed_at TIMESTAMPTZ,
            poster_video_link TEXT,
            video_link_submitted_at TIMESTAMPTZ,
            video_review_status VARCHAR(30) NOT NULL DEFAULT 'pending',
            video_review_remarks TEXT,
            video_reviewed_at TIMESTAMPTZ,
            submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;
    await sql`ALTER TABLE abstract_submissions ALTER COLUMN file_data DROP NOT NULL`;
    await sql`ALTER TABLE abstract_submissions ADD COLUMN IF NOT EXISTS file_url TEXT`;
    await sql`ALTER TABLE abstract_submissions ADD COLUMN IF NOT EXISTS blob_path TEXT`;
    await sql`ALTER TABLE abstract_submissions ADD COLUMN IF NOT EXISTS video_review_status VARCHAR(30) NOT NULL DEFAULT 'pending'`;
    await sql`ALTER TABLE abstract_submissions ADD COLUMN IF NOT EXISTS video_review_remarks TEXT`;
    await sql`ALTER TABLE abstract_submissions ADD COLUMN IF NOT EXISTS video_reviewed_at TIMESTAMPTZ`;
    await sql`CREATE INDEX IF NOT EXISTS abstract_submissions_status_idx ON abstract_submissions (status)`;
    await sql`CREATE INDEX IF NOT EXISTS abstract_submissions_registration_idx ON abstract_submissions (registration_number)`;
}

async function ensureAbstractBookContent(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS abstract_book_content (
            id TEXT PRIMARY KEY DEFAULT 'main',
            file_name TEXT,
            file_url TEXT,
            blob_path TEXT,
            file_size BIGINT NOT NULL DEFAULT 0,
            file_type VARCHAR(120),
            updated_by BIGINT REFERENCES admin_users(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;
    const rows = await sql`
        INSERT INTO abstract_book_content (id)
        VALUES ('main')
        ON CONFLICT (id) DO NOTHING
        RETURNING *
    `;
    if (rows.length) return rows[0];
    const existing = await sql`SELECT * FROM abstract_book_content WHERE id = 'main' LIMIT 1`;
    return existing[0] || null;
}

const abstractMaxFileBytes = 1 * 1024 * 1024;

function validateAbstractUpload({ fileName, fileType, fileData, fileSize }) {
    if (fileSize > abstractMaxFileBytes) {
        throw inputError('File exceeds the 1 MB limit.');
    }

    const extension = String(fileName || '').split('.').pop()?.toLowerCase() || '';
    if (!['pdf', 'docx'].includes(extension)) {
        throw inputError('Upload a text-only PDF or DOCX file. Legacy DOC files are not accepted because they cannot be validated as text-only.');
    }

    const buffer = Buffer.from(fileData, 'base64');
    const searchableContent = buffer.toString('latin1');

    if (extension === 'pdf') {
        const hasEmbeddedImage = /\/Subtype\s*\/Image\b|\/Filter\s*\/(?:DCTDecode|JPXDecode|JBIG2Decode|CCITTFaxDecode)\b/i.test(searchableContent);
        if (hasEmbeddedImage) {
            throw inputError('Abstract files must contain text only. Remove images, scanned pages, logos, charts, and embedded media before uploading.');
        }
    }

    if (extension === 'docx') {
        const hasEmbeddedMedia = /word\/media\/|word\/embeddings\//i.test(searchableContent);
        if (hasEmbeddedMedia) {
            throw inputError('Abstract files must contain text only. Remove images, charts, and embedded media before uploading.');
        }
    }

    const allowedTypes = new Set([
        '',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
    if (fileType && !allowedTypes.has(fileType)) {
        throw inputError('Upload a text-only PDF or DOCX file.');
    }

    return { buffer, extension };
}

async function uploadAbstractToBlob({ registrationNumber, fileName, fileType, buffer, extension }) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw inputError('Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN to the environment.');
    }

    const contentType = fileType || (extension === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const safeRegistration = slugifyFilePart(registrationNumber, 'registration');
    const safeName = slugifyFilePart(fileName.replace(/\.[^.]+$/, ''), 'abstract');
    const pathname = `abstract-submissions/${safeRegistration}-${safeName}-${Date.now()}.${extension}`;

    try {
        return await put(pathname, buffer, {
            access: 'public',
            contentType,
        });
    } catch (error) {
        if (String(error.message || '').includes('private store')) {
            throw inputError('This Vercel Blob store is private. Change the Blob store access to public or create a public Blob store for abstract uploads.');
        }
        throw error;
    }
}

async function uploadAbstractBookToBlob({ fileName, fileType, buffer }) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw inputError('Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN to the environment.');
    }

    const safeName = slugifyFilePart(fileName.replace(/\.[^.]+$/, ''), 'abstract-book');
    const pathname = `abstract-book/${safeName}-${Date.now()}.pdf`;

    try {
        return await put(pathname, buffer, {
            access: 'public',
            contentType: fileType || 'application/pdf',
        });
    } catch (error) {
        if (String(error.message || '').includes('private store')) {
            throw inputError('This Vercel Blob store is private. Change the Blob store access to public so the abstract book can be shown on the public website.');
        }
        throw error;
    }
}

function mapAbstractBook(row) {
    if (!row || !row.file_url) {
        return null;
    }
    return {
        fileName: row.file_name || '',
        fileUrl: row.file_url,
        blobPath: row.blob_path || '',
        fileSize: Number(row.file_size) || 0,
        fileType: row.file_type || 'application/pdf',
        updatedAt: row.updated_at,
    };
}

function calculateFees(data, programs = [], categories = [], pricing = []) {
    const category = categories.find((item) => item.name === data.category);
    const registrationFee = Number(category?.registration_fee) || 0;
    const programByKey = new Map(programs.map((program) => [`${program.program_type}:${program.name}`, program]));
    const categoryPricing = new Map(
        pricing
            .filter((item) => String(item.category_id) === String(category?.id) && item.is_available)
            .map((item) => [String(item.program_id), Number(item.price) || 0])
    );
    const getPrice = (type, name) => {
        const program = programByKey.get(`${type}:${name}`);
        return program ? categoryPricing.get(String(program.id)) || 0 : 0;
    };
    const competitions = (Array.isArray(data.studentCompetitions) ? data.studentCompetitions : []).slice(0, 2);
    const competitionFee = competitions.reduce((total, name) => total + getPrice('competition', name), 0);
    const selectedWorkshops = Array.isArray(data.selectedWorkshops) && data.selectedWorkshops.length
        ? [...new Set(data.selectedWorkshops.map((name) => String(name).trim()).filter(Boolean))]
        : data.preConferenceWorkshop ? [data.preConferenceWorkshop] : [];
    const workshopFee = selectedWorkshops.reduce((total, name) => total + getPrice('workshop', name), 0);

    return {
        registrationFee,
        competitionFee,
        workshopFee,
        total: registrationFee + competitionFee + workshopFee,
    };
}

async function ensureProgramCatalog(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS event_programs (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(180) NOT NULL,
            program_type VARCHAR(30) NOT NULL CHECK (program_type IN ('competition', 'workshop')),
            description TEXT,
            price NUMERIC(10, 2) NOT NULL DEFAULT 0,
            capacity INTEGER,
            sort_order INTEGER NOT NULL DEFAULT 0,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (program_type, name)
        )
    `;
    const programCount = await sql`SELECT COUNT(*)::int AS count FROM event_programs`;
    if (!programCount[0].count) {
        for (const [name, type, price, sortOrder] of defaultPrograms) {
            await sql`
                INSERT INTO event_programs (name, program_type, price, sort_order)
                VALUES (${name}, ${type}, ${price}, ${sortOrder})
                ON CONFLICT (program_type, name) DO NOTHING
            `;
        }
    }
    await sql`
        INSERT INTO event_programs (name, program_type, description, price, sort_order)
        VALUES ('NDDS Formulation and Characterization', 'workshop', 'Workshop session', 0, 40)
        ON CONFLICT (program_type, name) DO NOTHING
    `;
}

async function ensurePricingCatalog(sql) {
    await ensureProgramCatalog(sql);
    await sql`
        CREATE TABLE IF NOT EXISTS registration_categories (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(120) NOT NULL UNIQUE,
            registration_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
            sort_order INTEGER NOT NULL DEFAULT 0,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;
    const categoryCount = await sql`SELECT COUNT(*)::int AS count FROM registration_categories`;
    if (!categoryCount[0].count) {
        for (const [name, registrationFee, sortOrder] of defaultCategories) {
            await sql`
                INSERT INTO registration_categories (name, registration_fee, sort_order)
                VALUES (${name}, ${registrationFee}, ${sortOrder})
                ON CONFLICT (name) DO NOTHING
            `;
        }
    }
    await sql`
        CREATE TABLE IF NOT EXISTS program_category_pricing (
            program_id BIGINT NOT NULL REFERENCES event_programs(id) ON DELETE CASCADE,
            category_id BIGINT NOT NULL REFERENCES registration_categories(id) ON DELETE CASCADE,
            price NUMERIC(10, 2) NOT NULL DEFAULT 0,
            is_available BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            PRIMARY KEY (program_id, category_id)
        )
    `;
    await sql`
        INSERT INTO program_category_pricing (program_id, category_id, price, is_available)
        SELECT program.id, category.id, program.price, TRUE
        FROM event_programs program
        CROSS JOIN registration_categories category
        ON CONFLICT (program_id, category_id) DO NOTHING
    `;
    await sql`
        UPDATE program_category_pricing pricing
        SET price = program.price, is_available = TRUE, updated_at = NOW()
        FROM event_programs program
        WHERE pricing.program_id = program.id
            AND program.program_type = 'workshop'
            AND (pricing.price <> program.price OR pricing.is_available = FALSE)
    `;
}

function mapCategory(row) {
    return {
        id: row.id,
        name: row.name,
        registrationFee: Number(row.registration_fee) || 0,
        sortOrder: Number(row.sort_order) || 0,
        isActive: Boolean(row.is_active),
    };
}

function mapProgram(row) {
    return {
        id: row.id,
        name: row.name,
        type: row.program_type,
        description: row.description || '',
        price: Number(row.price) || 0,
        capacity: row.capacity === null ? '' : Number(row.capacity),
        sortOrder: Number(row.sort_order) || 0,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapProgramsWithPricing(programRows, pricingRows) {
    return programRows.map((row) => ({
        ...mapProgram(row),
        categoryPricing: pricingRows
            .filter((item) => String(item.program_id) === String(row.id))
            .map((item) => ({
                categoryId: item.category_id,
                price: Number(item.price) || 0,
                isAvailable: Boolean(item.is_available),
            })),
    }));
}

async function ensureRegistrationEnhancements(sql) {
    await sql`
        ALTER TABLE event_registrations
        ADD COLUMN IF NOT EXISTS group_members JSONB NOT NULL DEFAULT '[]'::jsonb
    `;
    await sql`
        ALTER TABLE event_registrations
        ADD COLUMN IF NOT EXISTS approval_status VARCHAR(40) NOT NULL DEFAULT 'not_submitted'
    `;
    await sql`
        ALTER TABLE event_registrations
        ADD COLUMN IF NOT EXISTS selected_workshops JSONB NOT NULL DEFAULT '[]'::jsonb
    `;
    await sql`
        ALTER TABLE event_registrations
        ADD COLUMN IF NOT EXISTS hr_college_with_state TEXT,
        ADD COLUMN IF NOT EXISTS hr_course_or_qualification VARCHAR(180),
        ADD COLUMN IF NOT EXISTS hr_whatsapp_number VARCHAR(25),
        ADD COLUMN IF NOT EXISTS hr_whatsapp_confirmation VARCHAR(25),
        ADD COLUMN IF NOT EXISTS hr_email VARCHAR(180),
        ADD COLUMN IF NOT EXISTS hr_email_confirmation VARCHAR(180),
        ADD COLUMN IF NOT EXISTS hr_core_area VARCHAR(100)
    `;
    await sql`
        UPDATE event_registrations
        SET selected_workshops = jsonb_build_array(pre_conference_workshop)
        WHERE selected_workshops = '[]'::jsonb AND pre_conference_workshop IS NOT NULL
    `;
    await sql`
        UPDATE event_registrations
        SET approval_status = 'pending_review'
        WHERE registration_status = 'submitted' AND approval_status = 'not_submitted'
    `;
}

function normalizeGroupMembers(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.slice(0, 500).map((member) => ({
        name: String(member?.name || '').trim(),
        email: String(member?.email || '').trim().toLowerCase(),
        whatsapp: String(member?.whatsapp || '').trim(),
        category: String(member?.category || '').trim(),
        course: String(member?.course || '').trim(),
        college: String(member?.college || '').trim(),
        state: String(member?.state || '').trim(),
        foodPreference: String(member?.foodPreference || '').trim(),
    })).filter((member) => member.name);
}

function normalizeSelectedWorkshops(value, fallback = '') {
    const workshops = Array.isArray(value) ? value : fallback ? [fallback] : [];
    return [...new Set(workshops.map((name) => String(name || '').trim()).filter(Boolean))].slice(0, 20);
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
        groupMembers: normalizeGroupMembers(row.group_members),
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
        selectedWorkshops: normalizeSelectedWorkshops(row.selected_workshops, row.pre_conference_workshop),
        workshopFeeAcknowledged: row.workshop_fee_acknowledged ? 'Yes' : 'No',
        presentationType: row.presentation_type || '',
        hrCollegeWithState: row.hr_college_with_state || '',
        hrCourseOrQualification: row.hr_course_or_qualification || '',
        hrWhatsappNumber: row.hr_whatsapp_number || '',
        hrWhatsappConfirmation: row.hr_whatsapp_confirmation || '',
        hrEmail: row.hr_email || '',
        hrEmailConfirmation: row.hr_email_confirmation || '',
        hrCoreArea: row.hr_core_area || '',
        transactionDetails: row.transaction_details || '',
        registrationNumber: row.registration_number || '',
        submittedAt: row.submitted_at || '',
        paymentStatus: row.payment_status || 'pending',
        approvalStatus: row.approval_status || 'not_submitted',
    };
}

function mapAdminRegistration(row) {
    return {
        id: row.id,
        registrationNumber: row.registration_number || '',
        registrationMode: row.registration_mode,
        participantName: row.participant_name || '',
        institutionName: row.institution_name || '',
        groupCoordinatorName: row.group_coordinator_name || '',
        groupCoordinatorEmail: row.group_coordinator_email || '',
        groupCoordinatorWhatsapp: row.group_coordinator_whatsapp || '',
        expectedParticipants: row.expected_participants,
        groupMembers: normalizeGroupMembers(row.group_members),
        category: row.category || '',
        stateOfResidence: row.state_of_residence || '',
        whatsappNumber: row.whatsapp_number || '',
        email: row.email || '',
        foodPreference: row.food_preference || '',
        courseOfStudy: row.course_of_study || '',
        collegeWithState: row.college_with_state || '',
        studentCompetitions: row.student_competitions || [],
        competitionFeeAcknowledged: Boolean(row.competition_fee_acknowledged),
        preConferenceWorkshop: row.pre_conference_workshop || '',
        selectedWorkshops: normalizeSelectedWorkshops(row.selected_workshops, row.pre_conference_workshop),
        workshopFeeAcknowledged: Boolean(row.workshop_fee_acknowledged),
        presentationType: row.presentation_type || '',
        hrCollegeWithState: row.hr_college_with_state || '',
        hrCourseOrQualification: row.hr_course_or_qualification || '',
        hrWhatsappNumber: row.hr_whatsapp_number || '',
        hrWhatsappConfirmation: row.hr_whatsapp_confirmation || '',
        hrEmail: row.hr_email || '',
        hrEmailConfirmation: row.hr_email_confirmation || '',
        hrCoreArea: row.hr_core_area || '',
        registrationFee: Number(row.registration_fee) || 0,
        competitionFee: Number(row.competition_fee) || 0,
        workshopFee: Number(row.workshop_fee) || 0,
        totalPayableAmount: Number(row.total_payable_amount) || 0,
        transactionDetails: row.transaction_details || '',
        paymentStatus: row.payment_status,
        approvalStatus: row.approval_status || 'not_submitted',
        registrationStatus: row.registration_status,
        submittedAt: row.submitted_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

async function saveRegistration(sql, data, submit = false) {
    await ensureRegistrationEnhancements(sql);
    await ensurePricingCatalog(sql);
    const programs = await sql`SELECT * FROM event_programs`;
    const categories = await sql`SELECT * FROM registration_categories`;
    const pricing = await sql`SELECT * FROM program_category_pricing`;
    const fees = calculateFees(data, programs, categories, pricing);
    const draftToken = data.draftToken || crypto.randomUUID();
    const expectedParticipants = data.expectedParticipants ? Number.parseInt(data.expectedParticipants, 10) : null;
    const groupMembers = data.registrationMode === 'group' ? normalizeGroupMembers(data.groupMembers) : [];
    const selectedWorkshops = normalizeSelectedWorkshops(data.selectedWorkshops, data.preConferenceWorkshop);
    if (submit) {
        const selectedCategory = categories.find((category) => category.name === data.category && category.is_active);
        if (!selectedCategory) {
            throw inputError('Select an active registration category.');
        }
        const availableProgramIds = new Set(
            pricing
                .filter((item) => String(item.category_id) === String(selectedCategory.id) && item.is_available)
                .map((item) => String(item.program_id))
        );
        const selectedProgramNames = [
            ...(Array.isArray(data.studentCompetitions) ? data.studentCompetitions.slice(0, 2) : []),
            ...selectedWorkshops,
        ];
        if (selectedProgramNames.some((name) => {
            const program = programs.find((item) => item.name === name && item.is_active);
            return !program || !availableProgramIds.has(String(program.id));
        })) {
            throw inputError('One or more selected programs are not available for this category. Review your selections.');
        }
        if (!String(data.hrCollegeWithState || '').trim() || !String(data.hrCourseOrQualification || '').trim()
            || !String(data.hrWhatsappNumber || '').trim() || !String(data.hrCoreArea || '').trim()) {
            throw inputError('Complete all HR Drive fields before submitting.');
        }
        if (!String(data.hrEmail || '').trim() || !String(data.hrEmailConfirmation || '').trim()) {
            throw inputError('Enter and confirm your HR Drive email address.');
        }
        if (String(data.hrEmail).trim().toLowerCase() !== String(data.hrEmailConfirmation).trim().toLowerCase()) {
            throw inputError('The HR Drive email addresses do not match.');
        }
        if (String(data.hrWhatsappNumber || '').trim() !== String(data.hrWhatsappConfirmation || '').trim()) {
            throw inputError('The HR Drive WhatsApp numbers do not match.');
        }
    }

    const rows = await sql`
        INSERT INTO event_registrations (
            draft_token, registration_mode, participant_name, institution_name,
            group_coordinator_name, group_coordinator_email, group_coordinator_whatsapp,
            expected_participants, group_members, category, state_of_residence, whatsapp_number, email,
            food_preference, course_of_study, college_with_state,
            competition_fee_acknowledged, pre_conference_workshop,
            selected_workshops, workshop_fee_acknowledged, presentation_type,
            hr_college_with_state, hr_course_or_qualification, hr_whatsapp_number,
            hr_whatsapp_confirmation, hr_email, hr_email_confirmation, hr_core_area, registration_fee,
            competition_fee, workshop_fee, total_payable_amount, transaction_details,
            registration_status, approval_status, submitted_at
        )
        VALUES (
            ${draftToken}, ${data.registrationMode || 'individual'}, ${data.participantName || null},
            ${data.institutionName || null}, ${data.groupCoordinatorName || null},
            ${data.groupCoordinatorEmail || null}, ${data.groupCoordinatorWhatsapp || null},
            ${expectedParticipants}, ${JSON.stringify(groupMembers)}::jsonb, ${data.category || null}, ${data.stateOfResidence || null},
            ${data.whatsappNumber || null}, ${data.email || null}, ${data.foodPreference || null},
            ${data.courseOfStudy || null}, ${data.collegeWithState || null},
            ${booleanValue(data.competitionFeeAcknowledged)}, ${selectedWorkshops[0] || null},
            ${JSON.stringify(selectedWorkshops)}::jsonb, ${booleanValue(data.workshopFeeAcknowledged)}, ${data.presentationType || null},
            ${data.hrCollegeWithState || null}, ${data.hrCourseOrQualification || null}, ${data.hrWhatsappNumber || null},
            ${data.hrWhatsappConfirmation || null}, ${data.hrEmail || null}, ${data.hrEmailConfirmation || null}, ${data.hrCoreArea || null},
            ${fees.registrationFee}, ${fees.competitionFee}, ${fees.workshopFee}, ${fees.total},
            ${data.transactionDetails || null}, ${submit ? 'submitted' : 'draft'},
            ${submit ? 'pending_review' : 'not_submitted'},
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
            group_members = EXCLUDED.group_members,
            category = EXCLUDED.category,
            state_of_residence = EXCLUDED.state_of_residence,
            whatsapp_number = EXCLUDED.whatsapp_number,
            email = EXCLUDED.email,
            food_preference = EXCLUDED.food_preference,
            course_of_study = EXCLUDED.course_of_study,
            college_with_state = EXCLUDED.college_with_state,
            competition_fee_acknowledged = EXCLUDED.competition_fee_acknowledged,
            pre_conference_workshop = EXCLUDED.pre_conference_workshop,
            selected_workshops = EXCLUDED.selected_workshops,
            workshop_fee_acknowledged = EXCLUDED.workshop_fee_acknowledged,
            presentation_type = EXCLUDED.presentation_type,
            hr_college_with_state = EXCLUDED.hr_college_with_state,
            hr_course_or_qualification = EXCLUDED.hr_course_or_qualification,
            hr_whatsapp_number = EXCLUDED.hr_whatsapp_number,
            hr_whatsapp_confirmation = EXCLUDED.hr_whatsapp_confirmation,
            hr_email = EXCLUDED.hr_email,
            hr_email_confirmation = EXCLUDED.hr_email_confirmation,
            hr_core_area = EXCLUDED.hr_core_area,
            registration_fee = EXCLUDED.registration_fee,
            competition_fee = EXCLUDED.competition_fee,
            workshop_fee = EXCLUDED.workshop_fee,
            total_payable_amount = EXCLUDED.total_payable_amount,
            transaction_details = EXCLUDED.transaction_details,
            registration_status = EXCLUDED.registration_status,
            approval_status = CASE
                WHEN event_registrations.approval_status IN ('approved', 'rejected', 'cancelled')
                    THEN event_registrations.approval_status
                ELSE EXCLUDED.approval_status
            END,
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
    const selectedCategory = categories.find((category) => category.name === data.category);
    for (const competition of competitions) {
        const program = programs.find((item) => item.program_type === 'competition' && item.name === competition);
        const categoryPrice = pricing.find((item) => String(item.program_id) === String(program?.id)
            && String(item.category_id) === String(selectedCategory?.id));
        await sql`
            INSERT INTO registration_competitions (registration_id, competition_name, fee_amount)
            VALUES (${row.id}, ${competition}, ${Number(categoryPrice?.price) || 0})
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
    const username = String(process.env.ADMIN_SEED_USERNAME || 'admin').trim();
    const password = process.env.ADMIN_SEED_PASSWORD;
    if (!email || !username || !password) {
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await sql`
        SELECT id, username, password_hash
        FROM admin_users
        WHERE email = ${normalizedEmail}
        LIMIT 1
    `;
    if (existing.length) {
        const passwordMatches = await bcrypt.compare(password, existing[0].password_hash);
        if (existing[0].username !== username || !passwordMatches) {
            const passwordHash = passwordMatches ? existing[0].password_hash : await bcrypt.hash(password, 12);
            await sql`
                UPDATE admin_users
                SET username = ${username},
                    password_hash = ${passwordHash},
                    salt = 'bcrypt',
                    role_id = 'role-super-admin',
                    status = 'Active',
                    updated_at = NOW()
                WHERE id = ${existing[0].id}
            `;
        }
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const legacyAdmin = await sql`
        SELECT id
        FROM admin_users
        WHERE LOWER(username) IN (LOWER(${username}), 'admin')
        ORDER BY id
        LIMIT 1
    `;
    if (legacyAdmin.length) {
        await sql`
            UPDATE admin_users
            SET username = ${username},
                name = 'Super Admin',
                email = ${normalizedEmail},
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
        VALUES (${username}, 'Super Admin', ${normalizedEmail}, ${passwordHash}, 'bcrypt', 'admin', 'role-super-admin', 'Active')
        ON CONFLICT (email) DO NOTHING
    `;
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '15mb',
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
        fileUrl: row.file_url || '',
        blobPath: row.blob_path || '',
        status: row.status,
        adminRemarks: row.admin_remarks || '',
        reviewedAt: row.reviewed_at || null,
        posterVideoLink: row.poster_video_link || '',
        videoLinkSubmittedAt: row.video_link_submitted_at || null,
        videoReviewStatus: row.video_review_status || 'pending',
        videoReviewRemarks: row.video_review_remarks || '',
        videoReviewedAt: row.video_reviewed_at || null,
        submittedAt: row.submitted_at,
    };
}

async function handlePublicAbstractRoute(path, request, response, sql) {
    if (path === 'abstracts/check' && request.method === 'GET') {
        await ensureAbstractSubmissions(sql);
        const regNum = String(request.query.registrationNumber || '').trim().toUpperCase();
        if (!regNum) {
            return send(response, 400, { error: 'Registration number is required.' });
        }
        const regRows = await sql`
            SELECT id, registration_number, participant_name, institution_name,
                   payment_status, approval_status, registration_status
            FROM event_registrations
            WHERE UPPER(REPLACE(registration_number, ' ', '')) = ${regNum.replace(/\s+/g, '')}
            LIMIT 1
        `;
        if (!regRows.length) {
            return send(response, 200, { valid: false });
        }

        const reg = regRows[0];
        const canonicalRegNum = reg.registration_number || regNum;
        const absRows = await sql`
            SELECT status, file_name, poster_video_link, video_link_submitted_at
            FROM abstract_submissions
            WHERE registration_number = ${canonicalRegNum}
            LIMIT 1
        `;
        const paymentReady = reg.payment_status === 'success';
        const approvalReady = reg.approval_status === 'approved';
        const registrationReady = reg.registration_status === 'submitted';
        const canSubmitAbstract = paymentReady && approvalReady && registrationReady;
        const eligibilityReason = !registrationReady
            ? 'Registration must be submitted before abstract submission.'
            : !paymentReady
                ? 'Payment must be marked success before abstract submission.'
                : !approvalReady
                    ? 'Registration must be approved before abstract submission.'
                    : '';
        return send(response, 200, {
            valid: true,
            participantName: reg.participant_name || '',
            institutionName: reg.institution_name || '',
            paymentStatus: reg.payment_status || '',
            approvalStatus: reg.approval_status || '',
            registrationStatus: reg.registration_status || '',
            canSubmitAbstract,
            eligibilityReason,
            alreadySubmitted: absRows.length > 0,
            abstractStatus: absRows.length > 0 ? absRows[0].status : null,
            fileName: absRows.length > 0 ? absRows[0].file_name : null,
            posterVideoLink: absRows.length > 0 ? (absRows[0].poster_video_link || null) : null,
        });
    }

    if (path === 'abstracts/submit' && request.method === 'POST') {
        await ensureAbstractSubmissions(sql);
        const regNum = String(request.body?.registrationNumber || '').trim().toUpperCase();
        if (!regNum) throw inputError('Registration number is required.');
        const fileName = String(request.body?.fileName || '').trim();
        const fileData = String(request.body?.fileData || '').trim();
        if (!fileName || !fileData) throw inputError('File is required.');
        const fileSize = Number(request.body?.fileSize) || 0;
        const fileType = String(request.body?.fileType || '').trim();
        const validatedFile = validateAbstractUpload({ fileName, fileType, fileData, fileSize });

        const regRows = await sql`
            SELECT id, registration_number, participant_name, institution_name,
                   payment_status, approval_status, registration_status
            FROM event_registrations
            WHERE UPPER(REPLACE(registration_number, ' ', '')) = ${regNum.replace(/\s+/g, '')}
            LIMIT 1
        `;
        if (!regRows.length) throw inputError('Registration number not found.');
        if (regRows[0].registration_status !== 'submitted') {
            throw inputError('Registration must be submitted before abstract submission.');
        }
        if (regRows[0].payment_status !== 'success') {
            throw inputError('Payment must be marked success before abstract submission.');
        }
        if (regRows[0].approval_status !== 'approved') {
            throw inputError('Registration must be approved before abstract submission.');
        }
        const canonicalRegNum = regRows[0].registration_number || regNum;

        const existing = await sql`
            SELECT id FROM abstract_submissions WHERE registration_number = ${canonicalRegNum} LIMIT 1
        `;
        if (existing.length) throw inputError('An abstract has already been submitted for this registration number. Only one submission is allowed and it cannot be replaced.');

        const blob = await uploadAbstractToBlob({
            registrationNumber: canonicalRegNum,
            fileName,
            fileType,
            buffer: validatedFile.buffer,
            extension: validatedFile.extension,
        });

        const rows = await sql`
            INSERT INTO abstract_submissions
                (registration_number, participant_name, institution_name, file_name, file_size, file_type, file_url, blob_path, status)
            VALUES (
                ${canonicalRegNum},
                ${regRows[0].participant_name || null},
                ${regRows[0].institution_name || null},
                ${fileName},
                ${fileSize},
                ${fileType || null},
                ${blob.url},
                ${blob.pathname},
                'pending'
            )
            RETURNING *
        `;
        const submission = mapAbstractSubmission(rows[0]);
        const contact = await getRegistrationContactForMail(sql, canonicalRegNum);
        queueStudentMail({
            to: contact?.email,
            subject: `Abstract received - ${canonicalRegNum}`,
            preview: 'Your abstract has been received and is pending review.',
            body: [
                `Dear ${contact?.name || regRows[0].participant_name || 'Delegate'},`,
                `Your abstract file "${fileName}" has been received for registration ${canonicalRegNum}.`,
                'The scientific committee will review it and notify you by email when the status is updated.',
            ],
        });
        return send(response, 201, { submission });
    }

    if (path === 'abstracts/video-link' && request.method === 'POST') {
        await ensureAbstractSubmissions(sql);
        const regNum = String(request.body?.registrationNumber || '').trim().toUpperCase();
        if (!regNum) throw inputError('Registration number is required.');
        const videoLink = String(request.body?.videoLink || '').trim();
        if (!videoLink) throw inputError('Video link is required.');

        const rows = await sql`
            SELECT id, status, poster_video_link
            FROM abstract_submissions
            WHERE UPPER(REPLACE(registration_number, ' ', '')) = ${regNum.replace(/\s+/g, '')}
            LIMIT 1
        `;
        if (!rows.length) throw inputError('No abstract submission found for this registration number.');
        if (rows[0].status !== 'accepted') throw inputError('Video link can only be submitted once your abstract has been accepted.');
        if (rows[0].poster_video_link) throw inputError('A video link has already been submitted for this registration number.');

        const updated = await sql`
            UPDATE abstract_submissions
            SET poster_video_link = ${videoLink},
                video_link_submitted_at = NOW(),
                video_review_status = 'pending',
                video_review_remarks = NULL,
                video_reviewed_at = NULL,
                updated_at = NOW()
            WHERE id = ${rows[0].id}
            RETURNING *
        `;
        const submission = mapAbstractSubmission(updated[0]);
        const contact = await getRegistrationContactForMail(sql, submission.registrationNumber);
        queueStudentMail({
            to: contact?.email,
            subject: `Poster video link received - ${submission.registrationNumber}`,
            preview: 'Your poster video link has been received and is pending review.',
            body: [
                `Dear ${contact?.name || 'Delegate'},`,
                `Your poster video link for registration ${submission.registrationNumber || '-'} has been received.`,
                'The scientific committee will review it and notify you when the video review status is updated.',
            ],
        });
        return send(response, 200, { submission });
    }

    return null;
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

        if (request.method === 'GET' && path === 'programs') {
            await ensurePricingCatalog(sql);
            const categories = await sql`
                SELECT * FROM registration_categories
                WHERE is_active = TRUE
                ORDER BY sort_order, name
            `;
            const programs = await sql`
                SELECT * FROM event_programs
                WHERE is_active = TRUE
                ORDER BY program_type, sort_order, name
            `;
            const pricing = await sql`
                SELECT program_id, category_id, price, is_available
                FROM program_category_pricing
            `;
            return send(response, 200, {
                categories: categories.map(mapCategory),
                programs: mapProgramsWithPricing(programs, pricing),
            });
        }

        if (path === 'registrations/draft' && request.method === 'GET') {
            await ensureRegistrationEnhancements(sql);
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
            notifyRegistrationSubmitted(registration);
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

        if (path === 'abstract-book' && request.method === 'GET') {
            const row = await ensureAbstractBookContent(sql);
            return send(response, 200, { book: mapAbstractBook(row) });
        }

        const publicAbstractResponse = await handlePublicAbstractRoute(path, request, response, sql);
        if (publicAbstractResponse) {
            return publicAbstractResponse;
        }

        if (path === 'admin/auth/login' && request.method === 'POST') {
            await ensureSeedAdmin(sql);
            const login = String(request.body?.login || request.body?.email || '').trim().toLowerCase();
            const password = String(request.body?.password || '');
            const rows = await sql`
                SELECT u.*, r.name AS role_name, r.permissions
                FROM admin_users u
                LEFT JOIN admin_roles r ON r.id = u.role_id
                WHERE LOWER(u.email) = ${login} OR LOWER(u.username) = ${login}
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

        if (path === 'admin/mailer/test' && request.method === 'POST') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'user.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const result = await sendStudentMail({
                to: String(request.body?.to || session.email || '').trim(),
                subject: 'NSC 2026 mailer test',
                preview: 'This is a test email from the NSC 2026 portal.',
                body: [
                    `Dear ${session.name || 'Admin'},`,
                    'This is a test email from the 14th IPA National Students Congress 2026 portal.',
                    'If you received this, SMTP is configured correctly.',
                ],
            });
            if (result?.skipped) {
                return send(response, 400, { error: `Mailer skipped: ${result.reason}` });
            }
            return send(response, 200, { ok: true });
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

        if (path === 'admin/registrations' && request.method === 'GET') {
            if (!requirePermission(session, 'registration.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            await ensureRegistrationEnhancements(sql);
            const rows = await sql`
                SELECT r.*,
                    ARRAY(
                        SELECT rc.competition_name
                        FROM registration_competitions rc
                        WHERE rc.registration_id = r.id
                        ORDER BY rc.id
                    ) AS student_competitions
                FROM event_registrations r
                ORDER BY COALESCE(r.submitted_at, r.updated_at) DESC, r.id DESC
            `;
            return send(response, 200, { registrations: rows.map(mapAdminRegistration) });
        }

        if (path === 'admin/programs' && request.method === 'GET') {
            if (!requirePermission(session, 'program.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            await ensurePricingCatalog(sql);
            const categories = await sql`SELECT * FROM registration_categories ORDER BY sort_order, name`;
            const programs = await sql`SELECT * FROM event_programs ORDER BY program_type, sort_order, name`;
            const pricing = await sql`SELECT * FROM program_category_pricing`;
            return send(response, 200, {
                categories: categories.map(mapCategory),
                programs: mapProgramsWithPricing(programs, pricing),
            });
        }

        if (path === 'admin/pricing' && request.method === 'GET') {
            if (!requirePermission(session, 'program.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            await ensurePricingCatalog(sql);
            const categories = await sql`SELECT * FROM registration_categories ORDER BY sort_order, name`;
            const programs = await sql`SELECT * FROM event_programs ORDER BY program_type, sort_order, name`;
            const pricing = await sql`SELECT * FROM program_category_pricing`;
            return send(response, 200, {
                categories: categories.map(mapCategory),
                programs: mapProgramsWithPricing(programs, pricing),
            });
        }

        if (path === 'admin/pricing/categories' && request.method === 'POST') {
            if (!requirePermission(session, 'program.create')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const name = String(request.body?.name || '').trim();
            if (!name) return send(response, 400, { error: 'Category name is required.' });
            await ensurePricingCatalog(sql);
            const rows = await sql`
                INSERT INTO registration_categories (name, registration_fee, sort_order, is_active)
                VALUES (
                    ${name}, ${Math.max(Number(request.body?.registrationFee) || 0, 0)},
                    ${Number.parseInt(request.body?.sortOrder, 10) || 0}, ${request.body?.isActive !== false}
                )
                RETURNING *
            `;
            await sql`
                INSERT INTO program_category_pricing (program_id, category_id, price, is_available)
                SELECT id, ${rows[0].id}, price, TRUE FROM event_programs
                ON CONFLICT (program_id, category_id) DO NOTHING
            `;
            return send(response, 201, { category: mapCategory(rows[0]) });
        }

        const adminCategoryMatch = path.match(/^admin\/pricing\/categories\/(\d+)$/);
        if (adminCategoryMatch && request.method === 'PATCH') {
            if (!requirePermission(session, 'program.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const name = String(request.body?.name || '').trim();
            if (!name) return send(response, 400, { error: 'Category name is required.' });
            await ensurePricingCatalog(sql);
            const rows = await sql`
                UPDATE registration_categories SET
                    name = ${name},
                    registration_fee = ${Math.max(Number(request.body?.registrationFee) || 0, 0)},
                    sort_order = ${Number.parseInt(request.body?.sortOrder, 10) || 0},
                    is_active = ${request.body?.isActive !== false},
                    updated_at = NOW()
                WHERE id = ${Number(adminCategoryMatch[1])}
                RETURNING *
            `;
            if (!rows.length) return send(response, 404, { error: 'Category not found.' });
            return send(response, 200, { category: mapCategory(rows[0]) });
        }

        if (path === 'admin/pricing/program' && request.method === 'PATCH') {
            if (!requirePermission(session, 'program.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const programId = Number(request.body?.programId);
            const categoryId = Number(request.body?.categoryId);
            if (!programId || !categoryId) return send(response, 400, { error: 'Program and category are required.' });
            await ensurePricingCatalog(sql);
            const rows = await sql`
                INSERT INTO program_category_pricing (program_id, category_id, price, is_available, updated_at)
                VALUES (
                    ${programId}, ${categoryId}, ${Math.max(Number(request.body?.price) || 0, 0)},
                    ${request.body?.isAvailable !== false}, NOW()
                )
                ON CONFLICT (program_id, category_id) DO UPDATE SET
                    price = EXCLUDED.price,
                    is_available = EXCLUDED.is_available,
                    updated_at = NOW()
                RETURNING *
            `;
            return send(response, 200, {
                pricing: {
                    programId: rows[0].program_id,
                    categoryId: rows[0].category_id,
                    price: Number(rows[0].price) || 0,
                    isAvailable: Boolean(rows[0].is_available),
                },
            });
        }

        if (path === 'admin/programs' && request.method === 'POST') {
            if (!requirePermission(session, 'program.create')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const name = String(request.body?.name || '').trim();
            const type = String(request.body?.type || '').trim();
            const requestedPricing = type === 'workshop'
                ? []
                : Array.isArray(request.body?.categoryPricing) ? request.body.categoryPricing : [];
            if (!name || !['competition', 'workshop'].includes(type)) {
                return send(response, 400, { error: 'Program name and type are required.' });
            }
            await ensurePricingCatalog(sql);
            const rows = await sql`
                INSERT INTO event_programs (name, program_type, description, price, capacity, sort_order, is_active)
                VALUES (
                    ${name}, ${type}, ${String(request.body?.description || '').trim() || null},
                    ${Math.max(Number(request.body?.price) || 0, 0)},
                    ${request.body?.capacity ? Math.max(Number.parseInt(request.body.capacity, 10), 1) : null},
                    ${Number.parseInt(request.body?.sortOrder, 10) || 0},
                    ${request.body?.isActive !== false}
                )
                RETURNING *
            `;
            await sql`
                INSERT INTO program_category_pricing (program_id, category_id, price, is_available)
                SELECT ${rows[0].id}, id, ${Math.max(Number(request.body?.price) || 0, 0)}, ${!requestedPricing.length}
                FROM registration_categories
                ON CONFLICT (program_id, category_id) DO NOTHING
            `;
            for (const item of requestedPricing) {
                if (!Number(item?.categoryId)) continue;
                await sql`
                    INSERT INTO program_category_pricing (program_id, category_id, price, is_available, updated_at)
                    VALUES (
                        ${rows[0].id}, ${Number(item.categoryId)}, ${Math.max(Number(item.price) || 0, 0)},
                        ${item.isAvailable === true}, NOW()
                    )
                    ON CONFLICT (program_id, category_id) DO UPDATE SET
                        price = EXCLUDED.price, is_available = EXCLUDED.is_available, updated_at = NOW()
                `;
            }
            return send(response, 201, { program: mapProgram(rows[0]) });
        }

        const adminProgramMatch = path.match(/^admin\/programs\/(\d+)$/);
        if (adminProgramMatch && request.method === 'PATCH') {
            if (!requirePermission(session, 'program.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const name = String(request.body?.name || '').trim();
            const type = String(request.body?.type || '').trim();
            const requestedPricing = type === 'workshop'
                ? []
                : Array.isArray(request.body?.categoryPricing) ? request.body.categoryPricing : [];
            if (!name || !['competition', 'workshop'].includes(type)) {
                return send(response, 400, { error: 'Program name and type are required.' });
            }
            await ensurePricingCatalog(sql);
            const rows = await sql`
                UPDATE event_programs SET
                    name = ${name},
                    program_type = ${type},
                    description = ${String(request.body?.description || '').trim() || null},
                    price = ${Math.max(Number(request.body?.price) || 0, 0)},
                    capacity = ${request.body?.capacity ? Math.max(Number.parseInt(request.body.capacity, 10), 1) : null},
                    sort_order = ${Number.parseInt(request.body?.sortOrder, 10) || 0},
                    is_active = ${request.body?.isActive !== false},
                    updated_at = NOW()
                WHERE id = ${Number(adminProgramMatch[1])}
                RETURNING *
            `;
            if (!rows.length) return send(response, 404, { error: 'Program not found.' });
            if (type === 'workshop') {
                await sql`
                    INSERT INTO program_category_pricing (program_id, category_id, price, is_available, updated_at)
                    SELECT ${rows[0].id}, id, ${Math.max(Number(request.body?.price) || 0, 0)}, TRUE, NOW()
                    FROM registration_categories
                    ON CONFLICT (program_id, category_id) DO UPDATE SET
                        price = EXCLUDED.price, is_available = TRUE, updated_at = NOW()
                `;
            } else {
                for (const item of requestedPricing) {
                    if (!Number(item?.categoryId)) continue;
                    await sql`
                        INSERT INTO program_category_pricing (program_id, category_id, price, is_available, updated_at)
                        VALUES (
                            ${rows[0].id}, ${Number(item.categoryId)}, ${Math.max(Number(item.price) || 0, 0)},
                            ${item.isAvailable === true}, NOW()
                        )
                        ON CONFLICT (program_id, category_id) DO UPDATE SET
                            price = EXCLUDED.price, is_available = EXCLUDED.is_available, updated_at = NOW()
                    `;
                }
            }
            return send(response, 200, { program: mapProgram(rows[0]) });
        }

        const registrationPaymentMatch = path.match(/^admin\/registrations\/(\d+)\/payment$/);
        if (registrationPaymentMatch && request.method === 'PATCH') {
            if (!requirePermission(session, 'payment.verify') && !requirePermission(session, 'registration.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const allowedStatuses = new Set(['pending', 'success', 'failed', 'manual_verification_required', 'refunded']);
            const paymentStatus = String(request.body?.paymentStatus || '').trim();
            if (!allowedStatuses.has(paymentStatus)) {
                return send(response, 400, { error: 'Select a valid payment status.' });
            }
            await ensureRegistrationEnhancements(sql);
            const rows = await sql`
                UPDATE event_registrations
                SET payment_status = ${paymentStatus}, updated_at = NOW()
                WHERE id = ${Number(registrationPaymentMatch[1])}
                RETURNING *
            `;
            if (!rows.length) {
                return send(response, 404, { error: 'Registration not found.' });
            }
            const competitions = await sql`
                SELECT competition_name
                FROM registration_competitions
                WHERE registration_id = ${rows[0].id}
                ORDER BY id
            `;
            rows[0].student_competitions = competitions.map((item) => item.competition_name);
            const registration = mapAdminRegistration(rows[0]);
            notifyPaymentUpdated(registration);
            return send(response, 200, { registration });
        }

        const registrationApprovalMatch = path.match(/^admin\/registrations\/(\d+)\/approval$/);
        if (registrationApprovalMatch && request.method === 'PATCH') {
            if (!requirePermission(session, 'registration.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const allowedStatuses = new Set(['pending_review', 'approved', 'rejected', 'cancelled']);
            const approvalStatus = String(request.body?.approvalStatus || '').trim();
            if (!allowedStatuses.has(approvalStatus)) {
                return send(response, 400, { error: 'Select a valid approval status.' });
            }
            await ensureRegistrationEnhancements(sql);
            const rows = await sql`
                UPDATE event_registrations
                SET approval_status = ${approvalStatus}, updated_at = NOW()
                WHERE id = ${Number(registrationApprovalMatch[1])}
                RETURNING *
            `;
            if (!rows.length) {
                return send(response, 404, { error: 'Registration not found.' });
            }
            const competitions = await sql`
                SELECT competition_name
                FROM registration_competitions
                WHERE registration_id = ${rows[0].id}
                ORDER BY id
            `;
            rows[0].student_competitions = competitions.map((item) => item.competition_name);
            const registration = mapAdminRegistration(rows[0]);
            notifyApprovalUpdated(registration);
            return send(response, 200, { registration });
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

        if (path === 'admin/accommodation-travel/tourist-attraction-photo' && request.method === 'POST') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'content.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }

            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                return send(response, 500, { error: 'Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN to the environment.' });
            }

            const parsedFile = parseDataUrl(request.body?.fileData);
            if (!parsedFile) {
                return send(response, 400, { error: 'Upload a valid image file.' });
            }

            const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
            if (!allowedTypes.has(parsedFile.contentType)) {
                return send(response, 400, { error: 'Only JPG, PNG, and WebP images are allowed.' });
            }

            const maxUploadBytes = 4 * 1024 * 1024;
            if (parsedFile.buffer.byteLength > maxUploadBytes) {
                return send(response, 400, { error: 'Image must be 4 MB or smaller.' });
            }

            const extensionByType = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
            };
            const attractionName = slugifyFilePart(request.body?.attractionName, 'tourist-attraction');
            const pathname = `accommodation-tourist-attractions/${attractionName}-${Date.now()}.${extensionByType[parsedFile.contentType]}`;
            let blob;
            try {
                blob = await put(pathname, parsedFile.buffer, {
                    access: 'public',
                    contentType: parsedFile.contentType,
                });
            } catch (error) {
                if (String(error.message || '').includes('private store')) {
                    return send(response, 400, {
                        error: 'This Vercel Blob store is private. Change the Blob store access to public so attraction photos can be shown on the public website.',
                    });
                }
                throw error;
            }

            return send(response, 200, { url: blob.url, pathname: blob.pathname, contentType: parsedFile.contentType });
        }

        if (path === 'admin/accommodation-travel/tourist-attraction-photo' && request.method === 'DELETE') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'content.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }

            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                return send(response, 500, { error: 'Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN to the environment.' });
            }

            const url = String(request.body?.url || '').trim();
            if (!url) {
                return send(response, 400, { error: 'Photo URL is required.' });
            }

            await del(url);
            return send(response, 200, { deleted: true });
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

        if (path === 'admin/abstract-book' && request.method === 'GET') {
            if (!requirePermission(session, 'registration.view') && !requirePermission(session, 'content.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const row = await ensureAbstractBookContent(sql);
            return send(response, 200, { book: mapAbstractBook(row) });
        }

        if (path === 'admin/abstract-book' && request.method === 'POST') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'content.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }

            const fileName = String(request.body?.fileName || '').trim();
            const fileSize = Number(request.body?.fileSize) || 0;
            const parsedFile = parseDataUrl(request.body?.fileData);
            if (!fileName || !parsedFile) {
                throw inputError('Upload a valid PDF file.');
            }
            if (!fileName.toLowerCase().endsWith('.pdf') || parsedFile.contentType !== 'application/pdf') {
                throw inputError('Only PDF files are accepted.');
            }
            if (fileSize > 10 * 1024 * 1024 || parsedFile.buffer.byteLength > 10 * 1024 * 1024) {
                throw inputError('File exceeds 10 MB. Please use a smaller PDF.');
            }

            const previous = await ensureAbstractBookContent(sql);
            const blob = await uploadAbstractBookToBlob({
                fileName,
                fileType: parsedFile.contentType,
                buffer: parsedFile.buffer,
            });
            const rows = await sql`
                UPDATE abstract_book_content
                SET file_name = ${fileName},
                    file_url = ${blob.url},
                    blob_path = ${blob.pathname},
                    file_size = ${parsedFile.buffer.byteLength},
                    file_type = ${parsedFile.contentType},
                    updated_by = ${session.id},
                    updated_at = NOW()
                WHERE id = 'main'
                RETURNING *
            `;
            if (previous?.file_url && previous.file_url !== blob.url) {
                try {
                    await del(previous.file_url);
                } catch (error) {
                    console.warn('Failed to delete previous abstract book blob', error);
                }
            }
            return send(response, 200, { book: mapAbstractBook(rows[0]) });
        }

        if (path === 'admin/abstract-book' && request.method === 'DELETE') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'content.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }

            const previous = await ensureAbstractBookContent(sql);
            if (previous?.file_url) {
                await del(previous.file_url);
            }
            const rows = await sql`
                UPDATE abstract_book_content
                SET file_name = NULL,
                    file_url = NULL,
                    blob_path = NULL,
                    file_size = 0,
                    file_type = NULL,
                    updated_by = ${session.id},
                    updated_at = NOW()
                WHERE id = 'main'
                RETURNING *
            `;
            return send(response, 200, { book: mapAbstractBook(rows[0]) });
        }

        // ── Admin: list abstracts ────────────────────────────────────
        if (path === 'admin/abstracts' && request.method === 'GET') {
            await ensureAbstractSubmissions(sql);
            if (!requirePermission(session, 'registration.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const rows = await sql`
                SELECT id, registration_number, participant_name, institution_name,
                       file_name, file_size, file_type, file_url, blob_path, status, admin_remarks,
                       reviewed_at, poster_video_link, video_link_submitted_at,
                       video_review_status, video_review_remarks, video_reviewed_at, submitted_at
                FROM abstract_submissions
                ORDER BY submitted_at DESC
            `;
            return send(response, 200, { abstracts: rows.map(mapAbstractSubmission) });
        }

        // ── Admin: download abstract file ────────────────────────────
        const absDownloadMatch = path.match(/^admin\/abstracts\/(\d+)\/download$/);
        if (absDownloadMatch && request.method === 'GET') {
            await ensureAbstractSubmissions(sql);
            if (!requirePermission(session, 'registration.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const rows = await sql`
                SELECT file_name, file_type, file_data, file_url
                FROM abstract_submissions
                WHERE id = ${absDownloadMatch[1]}
                LIMIT 1
            `;
            if (!rows.length) return send(response, 404, { error: 'Submission not found.' });
            const { file_name, file_type, file_data, file_url } = rows[0];
            let buffer;
            if (file_url) {
                const blobResponse = await fetch(file_url);
                if (!blobResponse.ok) {
                    return send(response, 502, { error: 'Could not download file from Vercel Blob.' });
                }
                buffer = Buffer.from(await blobResponse.arrayBuffer());
            } else if (file_data) {
                buffer = Buffer.from(file_data, 'base64');
            } else {
                return send(response, 404, { error: 'Abstract file is missing.' });
            }
            response.setHeader('Content-Type', file_type || 'application/octet-stream');
            response.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
            response.setHeader('Content-Length', buffer.length);
            return response.status(200).end(buffer);
        }

        // ── Admin: review abstract ───────────────────────────────────
        const absReviewMatch = path.match(/^admin\/abstracts\/(\d+)$/);
        if (absReviewMatch && request.method === 'PATCH') {
            await ensureAbstractSubmissions(sql);
            if (!requirePermission(session, 'registration.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const { status, adminRemarks, videoReviewStatus, videoReviewRemarks } = request.body || {};
            if (videoReviewStatus !== undefined) {
                if (!['pending', 'shortlisted', 'approved', 'rejected'].includes(videoReviewStatus)) {
                    throw inputError('Invalid video review status. Must be pending, shortlisted, approved, or rejected.');
                }
                const rows = await sql`
                    UPDATE abstract_submissions
                    SET video_review_status = ${videoReviewStatus},
                        video_review_remarks = ${videoReviewRemarks ? String(videoReviewRemarks).trim() : null},
                        video_reviewed_at = NOW(),
                        updated_at = NOW()
                    WHERE id = ${absReviewMatch[1]}
                    RETURNING *
                `;
                if (!rows.length) return send(response, 404, { error: 'Submission not found.' });
                const submission = mapAbstractSubmission(rows[0]);
                const contact = await getRegistrationContactForMail(sql, rows[0].registration_number);
                notifyVideoReviewed(contact, submission);
                return send(response, 200, { submission });
            }

            if (!['accepted', 'rejected', 'pending'].includes(status)) {
                throw inputError('Invalid abstract status. Must be accepted, rejected, or pending.');
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
            const submission = mapAbstractSubmission(rows[0]);
            const contact = await getRegistrationContactForMail(sql, rows[0].registration_number);
            notifyAbstractReviewed(contact, submission);
            return send(response, 200, { submission });
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
