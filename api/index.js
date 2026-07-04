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
const fipVaccinationWorkshopName = 'FIP IPA Vaccination Training (2 days)';
const ipaMemberIdPattern = /^[A-Z]{3}\/[A-Z]{4}\/[A-Z]{2}\/[A-Z]{2}\/\d{6}$/;
const ipaMemberCategoryKeys = new Set([
    'studentdelegateipamember',
    'studentdelegateipasfmember',
]);

function normalizeCategoryKey(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function requiresIpaMemberId(categoryName) {
    return ipaMemberCategoryKeys.has(normalizeCategoryKey(categoryName));
}
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
    [fipVaccinationWorkshopName, 'workshop', 1000, 20],
    ['3D Printing', 'workshop', 0, 30],
    ['NDDS (Nano/Micro Drug Delivery Systems) - Formulation and Characterization', 'workshop', 0, 40],
];

const defaultHomeContent = {
    newsUpdates: [
        { title: 'Abstract Submission', copy: 'Last date: 31-07-2026' },
        { title: 'Abstract Acceptance Mail', copy: 'Last date: 05-08-2026' },
        { title: 'Video Submission and Evaluation', copy: 'Last date: 22-08-2026' },
        { title: 'Acceptance email for presentation', copy: 'Last date: 11-09-2026' },
    ],
};

const hrCoreAreaOptions = [
    'Production / Manufacturing',
    'QA/QC',
    'Marketing / Sales',
    'Pharmacist',
    'Pharmacovigilance / Clinical Trial',
    'Regulatory / Documentation',
    'Higher Studies',
    'Others',
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

async function ensureHomeContent(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS home_content (
            id TEXT PRIMARY KEY DEFAULT 'main',
            content JSONB NOT NULL DEFAULT '{}'::jsonb,
            updated_by BIGINT REFERENCES admin_users(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;

    const rows = await sql`
        INSERT INTO home_content (id, content)
        VALUES ('main', ${JSON.stringify(defaultHomeContent)}::jsonb)
        ON CONFLICT (id) DO NOTHING
        RETURNING content, updated_at
    `;

    if (rows.length) {
        return rows[0];
    }

    const existing = await sql`
        SELECT content, updated_at
        FROM home_content
        WHERE id = 'main'
        LIMIT 1
    `;

    return existing[0] || { content: defaultHomeContent, updated_at: null };
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

async function sendStudentMail({ to, subject, preview, body, htmlBody, textBody }) {
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
    const safeBody = htmlBody
        ? String(htmlBody)
        : Array.isArray(body) ? body.map((line) => `<p>${escapeHtml(line)}</p>`).join('\n') : String(body || '');
    const plainText = textBody || (Array.isArray(body) ? body.join('\n\n') : String(body || ''));
    return mailer.transporter.sendMail({
        from: mailer.from,
        to: recipient,
        replyTo: process.env.MAIL_REPLY_TO || process.env.MAIL_FROM || 'nsc2026@ipakerala.org',
        subject,
        text: plainText,
        html: `
            <div style="display:none;max-height:0;overflow:hidden">${safePreview}</div>
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#18181b">
                <h2 style="margin:0 0 12px;color:#0d124f">14th National IPA Student Congress 2026</h2>
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

function getUniqueMailRecipients(values = []) {
    return [...new Set(values
        .map((value) => String(value || '').trim().toLowerCase())
        .filter((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)))];
}

function summarizeGroupProgramSelections(groupMembers = [], field) {
    if (!Array.isArray(groupMembers)) return '';
    return groupMembers
        .map((member) => {
            const selections = Array.isArray(member?.[field]) ? member[field] : [];
            return selections.length ? `${member.name}: ${selections.join(', ')}` : '';
        })
        .filter(Boolean)
        .join(' | ');
}

function summarizeGroupSingleSelections(groupMembers = [], field, emptyValue = '') {
    if (!Array.isArray(groupMembers)) return '';
    return groupMembers
        .map((member) => {
            const selection = String(member?.[field] || '').trim();
            return selection && selection !== emptyValue ? `${member.name}: ${selection}` : '';
        })
        .filter(Boolean)
        .join(' | ');
}

function formatMailCurrency(value) {
    return `Rs. ${(Number(value) || 0).toLocaleString('en-IN')}`;
}

function formatMailBoolean(value) {
    return value === true || value === 'Yes' ? 'Yes' : 'No';
}

function joinMailList(value, fallback = 'None selected') {
    return Array.isArray(value) && value.length ? value.join(', ') : fallback;
}

function groupMemberRegistrationNumber(parentRegistrationNumber, index) {
    return parentRegistrationNumber ? `${parentRegistrationNumber}-${String(index + 1).padStart(3, '0')}` : '';
}

function assignGroupMemberRegistrationNumbers(groupMembers = [], parentRegistrationNumber = '') {
    return groupMembers.map((member, index) => ({
        ...member,
        registrationNumber: member.registrationNumber || groupMemberRegistrationNumber(parentRegistrationNumber, index),
    }));
}

function buildGroupStudentRegistration(registration, member, index) {
    return {
        ...registration,
        registrationMode: 'individual',
        registrationNumber: member.registrationNumber || groupMemberRegistrationNumber(registration.registrationNumber, index),
        participantName: member.name || `Student ${index + 1}`,
        ipaMemberId: member.ipaMemberId || registration.ipaMemberId || '',
        email: member.email || registration.groupCoordinatorEmail || '',
        whatsappNumber: member.whatsapp || registration.groupCoordinatorWhatsapp || '',
        category: member.category || registration.category || '',
        stateOfResidence: member.state || registration.stateOfResidence || '',
        foodPreference: member.foodPreference || '',
        courseOfStudy: member.course || '',
        collegeWithState: member.college || registration.institutionName || '',
        studentCompetitions: Array.isArray(member.competitions) ? member.competitions : [],
        selectedWorkshops: Array.isArray(member.workshops) ? member.workshops : [],
        presentationType: member.presentationType || 'Not Participating',
        hrCoreArea: member.hrCoreArea || '',
        hrDriveParticipation: member.hrCoreArea ? 'participating' : 'not_participating',
        groupMembers: [],
        groupCoordinatorName: registration.groupCoordinatorName,
        groupCoordinatorEmail: registration.groupCoordinatorEmail,
        groupCoordinatorWhatsapp: registration.groupCoordinatorWhatsapp,
        institutionName: registration.institutionName,
    };
}

function getRegistrationMailSummary(registration) {
    const isGroup = registration.registrationMode === 'group';
    const competitionSummary = isGroup
        ? summarizeGroupProgramSelections(registration.groupMembers, 'competitions') || 'None selected'
        : (registration.studentCompetitions || []).join(', ') || 'None selected';
    const workshopSummary = isGroup
        ? summarizeGroupProgramSelections(registration.groupMembers, 'workshops') || 'None selected'
        : (registration.selectedWorkshops || []).join(', ') || 'None selected';
    const presentationSummary = isGroup
        ? summarizeGroupSingleSelections(registration.groupMembers, 'presentationType', 'Not Participating') || 'Not selected'
        : registration.presentationType || 'Not selected';
    const hrSummary = registration.hrCoreArea
        ? `${registration.hrCoreArea}${registration.hrEmail ? `, ${registration.hrEmail}` : ''}${registration.hrWhatsappNumber ? `, ${registration.hrWhatsappNumber}` : ''}`
        : 'Not participating';
    const groupHrSummary = isGroup
        ? summarizeGroupSingleSelections(registration.groupMembers, 'hrCoreArea') || 'Not participating'
        : hrSummary;
    const primaryName = registration.participantName || registration.groupCoordinatorName || 'Delegate';
    const institution = registration.institutionName || registration.collegeWithState || '-';
    const contactEmail = registration.email || registration.groupCoordinatorEmail || registration.hrEmail || '-';
    const contactPhone = registration.whatsappNumber || registration.groupCoordinatorWhatsapp || registration.hrWhatsappNumber || '-';
    const groupMembers = Array.isArray(registration.groupMembers) ? registration.groupMembers : [];

    return {
        isGroup,
        primaryName,
        institution,
        contactEmail,
        contactPhone,
        competitionSummary,
        workshopSummary,
        presentationSummary,
        hrSummary,
        groupHrSummary,
        rows: [
            ['Registration Number', registration.registrationNumber || '-'],
            ['Registration Type', isGroup ? 'Group Registration' : 'Individual Registration'],
            ['Name', primaryName],
            ['Category', registration.category || '-'],
            ['Institution / College', institution],
            ['State', registration.stateOfResidence || '-'],
            ['Email', contactEmail],
            ['WhatsApp', contactPhone],
            ['Food Preference', registration.foodPreference || '-'],
            ['Course', registration.courseOfStudy || '-'],
            ['Presentation', presentationSummary],
            ['Competitions Opted', competitionSummary],
            ['Workshops Opted', workshopSummary],
            ['HR Drive', isGroup ? groupHrSummary : hrSummary],
            ['Competition Fee Acknowledged', formatMailBoolean(registration.competitionFeeAcknowledged)],
            ['Workshop Fee Acknowledged', formatMailBoolean(registration.workshopFeeAcknowledged)],
            ['Registration Fee', formatMailCurrency(registration.registrationFee)],
            ['Competition Fee', formatMailCurrency(registration.competitionFee)],
            ['Workshop Fee', formatMailCurrency(registration.workshopFee)],
            ['Total Payable', formatMailCurrency(registration.totalPayableAmount)],
            ['Transaction Details', registration.transactionDetails || '-'],
            ['Transaction Date', registration.transactionDate || '-'],
            ['Payment Status', formatStatusLabel(registration.paymentStatus)],
            ['Approval Status', formatStatusLabel(registration.approvalStatus)],
        ],
        groupMembers,
    };
}

function buildRegistrationSummaryHtml(registration) {
    const summary = getRegistrationMailSummary(registration);
    const rowsHtml = summary.rows
        .map(([label, value]) => `
            <tr>
                <td style="padding:8px 10px;border:1px solid #e4e4e7;background:#f8fafc;font-weight:bold;width:38%">${escapeHtml(label)}</td>
                <td style="padding:8px 10px;border:1px solid #e4e4e7">${escapeHtml(value)}</td>
            </tr>
        `)
        .join('');
    const groupRowsHtml = summary.isGroup && summary.groupMembers.length
        ? `
            <h3 style="margin:18px 0 8px;color:#0d124f">Group Student Details</h3>
            <table style="border-collapse:collapse;width:100%;font-size:13px">
                <thead>
                    <tr>
                        ${['Reg. No.', 'Student', 'IPA Member ID', 'Email', 'WhatsApp', 'Course', 'College', 'Competitions', 'Workshop', 'Presentation', 'HR Drive'].map((label) => `<th style="padding:8px;border:1px solid #e4e4e7;background:#eef2ff;text-align:left">${escapeHtml(label)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${summary.groupMembers.map((member) => `
                        <tr>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.registrationNumber || '-')}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.name || '-')}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.ipaMemberId || '-')}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.email || '-')}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.whatsapp || '-')}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.course || '-')}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.college || '-')}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(joinMailList(member.competitions))}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(joinMailList(member.workshops))}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.presentationType || 'Not Participating')}</td>
                            <td style="padding:8px;border:1px solid #e4e4e7">${escapeHtml(member.hrCoreArea || 'Not participating')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
        : '';

    return `
        <h3 style="margin:18px 0 8px;color:#0d124f">Registration Details</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
            <tbody>${rowsHtml}</tbody>
        </table>
        ${groupRowsHtml}
    `;
}

function buildRegistrationSummaryText(registration) {
    const summary = getRegistrationMailSummary(registration);
    const lines = [
        'Registration Details',
        ...summary.rows.map(([label, value]) => `${label}: ${value}`),
    ];
    if (summary.isGroup && summary.groupMembers.length) {
        lines.push('', 'Group Student Details');
        summary.groupMembers.forEach((member, index) => {
            lines.push(`${index + 1}. Reg. No.: ${member.registrationNumber || '-'} | ${member.name || '-'} | IPA Member ID: ${member.ipaMemberId || '-'} | Email: ${member.email || '-'} | WhatsApp: ${member.whatsapp || '-'} | Course: ${member.course || '-'} | College: ${member.college || '-'} | Competitions: ${joinMailList(member.competitions)} | Workshop: ${joinMailList(member.workshops)} | Presentation: ${member.presentationType || 'Not Participating'} | HR Drive: ${member.hrCoreArea || 'Not participating'}`);
        });
    }
    return lines.join('\n');
}

function buildRegistrationSubmittedMail(registration) {
    const summary = getRegistrationMailSummary(registration);
    const safeName = escapeHtml(summary.primaryName);
    const htmlBody = `
        <p>Dear ${safeName},</p>
        <p>Your registration has been received successfully. Registration number: <strong>${escapeHtml(registration.registrationNumber || '-')}</strong>.</p>
        <p>Registration status: <strong>Pending Review</strong>.</p>
        ${buildRegistrationSummaryHtml(registration)}
        <p>Please keep this registration number for abstract submission and future updates.</p>
    `;
    const textBody = [
        `Dear ${summary.primaryName},`,
        `Your registration has been received successfully. Registration number: ${registration.registrationNumber || '-'}.`,
        'Registration status: Pending Review.',
        '',
        buildRegistrationSummaryText(registration),
        '',
        'Please keep this registration number for abstract submission and future updates.',
    ].join('\n');

    return { htmlBody, textBody };
}

function buildRegistrationSubmittedMailBody(registration) {
    const summary = getRegistrationMailSummary(registration);

    return [
        `Dear ${summary.primaryName},`,
        `Your registration has been received successfully. Registration number: ${registration.registrationNumber || '-'}.`,
        'Registration status: Pending.',
        `Registration type: ${summary.isGroup ? 'Group Registration' : 'Individual Registration'}.`,
        summary.isGroup
            ? `Institution: ${registration.institutionName || '-'}; Coordinator: ${registration.groupCoordinatorName || '-'}; Students uploaded: ${(registration.groupMembers || []).length}.`
            : `Participant: ${registration.participantName || '-'}; Category: ${registration.category || '-'}; Email: ${registration.email || '-'}.`,
        `Category: ${registration.category || '-'}.`,
        `Student competitions: ${summary.competitionSummary}.`,
        `Workshop: ${summary.workshopSummary}.`,
        `Presentation: ${summary.presentationSummary}.`,
        `HR Drive: ${summary.isGroup ? summary.groupHrSummary : summary.hrSummary}.`,
        'Please keep this registration number for abstract submission and future updates.',
    ];
}

function buildConfirmedRegistrationMail(registration) {
    const delegateId = registration.registrationNumber || '-';
    const summary = getRegistrationMailSummary(registration);
    const participantName = summary.primaryName || 'Participant';
    const qrPayload = [
        '14th IPA NSC 2026',
        `Registration Number: ${delegateId}`,
        `Name: ${participantName}`,
        `Type: ${registration.registrationMode === 'group' ? 'Group Registration' : 'Individual Registration'}`,
        `Category: ${registration.category || '-'}`,
        `Institution: ${summary.institution}`,
        `Email: ${summary.contactEmail}`,
        `WhatsApp: ${summary.contactPhone}`,
    ].join('\n');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrPayload)}`;
    const portalUrl = 'https://nsc2026.ipakerala.org';
    const whatsAppCommunityUrl = 'https://chat.whatsapp.com/Cx1Kgf5tlHQJLSrvkl3liP';
    const safeDelegateId = escapeHtml(delegateId);
    const safeName = escapeHtml(participantName);
    const qrDetailsHtml = [
        ['Name', participantName],
        ['Registration Number', delegateId],
        ['Type', registration.registrationMode === 'group' ? 'Group Registration' : 'Individual Registration'],
        ['Category', registration.category || '-'],
        ['Institution', summary.institution],
        ['Email', summary.contactEmail],
        ['WhatsApp', summary.contactPhone],
    ].map(([label, value]) => `
        <tr>
            <td style="padding:5px 0;color:#52525b;font-size:12px;text-align:left">${escapeHtml(label)}</td>
            <td style="padding:5px 0;font-weight:bold;font-size:12px;text-align:right">${escapeHtml(value)}</td>
        </tr>
    `).join('');
    const htmlBody = `
        <p>Dear ${safeName},</p>
        <p><strong>Congratulations!</strong></p>
        <p>Your registration for the <strong>14th IPA National Student Congress (IPA NSC) 2026</strong>, organized by the Indian Pharmaceutical Association (IPA) Kerala State Branch, has been verified and confirmed.</p>
        <p>Your Registration/Delegate ID Number is: <strong>${safeDelegateId}</strong></p>
        <div style="margin:20px 0;padding:16px;border:1px solid #d4d4d8;border-radius:12px;background:#f8fafc;max-width:340px;text-align:center">
            <p style="margin:0 0 10px;font-weight:bold;color:#0d124f">E-Ticket / Gate Pass QR</p>
            <img src="${qrUrl}" alt="QR Gate Pass for ${safeName}" width="220" height="220" style="display:block;margin:0 auto 10px;border:0" />
            <table style="border-collapse:collapse;width:100%;margin:8px 0 10px">${qrDetailsHtml}</table>
            <p style="margin:0;font-size:13px;color:#52525b">Present this QR at the registration desk for quick scanning and entry.</p>
        </div>
        ${buildRegistrationSummaryHtml(registration)}
        <p><strong>These following critical actions are required from your end:</strong></p>
        <ol>
            <li>Please save this QR gate pass for future reference. You can present it digitally on your smartphone or carry a printed copy to the venue at the registration desk for quick barcode scanning and entry.</li>
            <li>Visit our official web portal for brochures, detailed information, and guidelines of scientific events and student competitions:<br><a href="${portalUrl}">${portalUrl}</a></li>
            <li>Join the Congress WhatsApp Community for real-time announcements, instant scheduling changes, and emergency updates during the event:<br><a href="${whatsAppCommunityUrl}">${whatsAppCommunityUrl}</a></li>
        </ol>
        <p>We look forward to welcoming you to an incredible, high-energy congress. Travel safe!</p>
        <p>Warm regards,</p>
        <p><strong>Organizing Secretariat</strong><br>14th IPA NSC 2026<br>&amp;<br>IPA Kerala State Branch</p>
    `;
    const textBody = [
        `Dear ${participantName},`,
        'Congratulations!',
        'Your registration for the 14th IPA National Student Congress (IPA NSC) 2026, organized by the Indian Pharmaceutical Association (IPA) Kerala State Branch, has been verified and confirmed.',
        `Your Registration/Delegate ID Number is: ${delegateId}`,
        `Name: ${participantName}`,
        `Category: ${registration.category || '-'}`,
        `Institution: ${summary.institution}`,
        `Email: ${summary.contactEmail}`,
        `WhatsApp: ${summary.contactPhone}`,
        `E-Ticket / Gate Pass QR: ${qrUrl}`,
        buildRegistrationSummaryText(registration),
        'These following critical actions are required from your end:',
        '1. Please save this QR gate pass for future reference. You can present it digitally on your smartphone or carry a printed copy to the venue at the registration desk for quick barcode scanning and entry.',
        `2. Visit our official web portal for brochures, detailed information, and guidelines of scientific events and student competitions: ${portalUrl}`,
        `3. Join the Congress WhatsApp Community for real-time announcements, instant scheduling changes, and emergency updates during the event: ${whatsAppCommunityUrl}`,
        'We look forward to welcoming you to an incredible, high-energy congress. Travel safe!',
        'Warm regards,',
        'Organizing Secretariat',
        '14th IPA NSC 2026',
        '&',
        'IPA Kerala State Branch',
    ].join('\n\n');

    return { htmlBody, textBody };
}

async function getRegistrationContactForMail(sql, registrationNumber) {
    const row = await findRegistrationForPublicNumber(sql, registrationNumber);
    if (!row) return null;
    return {
        registrationNumber: row.canonicalRegistrationNumber || '',
        name: row.contactName || 'Delegate',
        email: row.contactEmail || '',
        paymentStatus: row.payment_status || '',
        approvalStatus: row.approval_status || '',
    };
}

async function notifyRegistrationSubmitted(registration) {
    const summaryRecipients = registration.registrationMode === 'group'
        ? getUniqueMailRecipients([registration.groupCoordinatorEmail])
        : getUniqueMailRecipients([getRegistrationMailRecipient(registration)]);
    const { htmlBody, textBody } = buildRegistrationSubmittedMail(registration);

    await Promise.all(summaryRecipients.map((to) => sendStudentMail({
        to,
        subject: `Registration received - ${registration.registrationNumber || 'NSC 2026'}`,
        preview: 'Your NSC 2026 registration has been received.',
        htmlBody,
        textBody,
    }))).catch((error) => console.error('notifyRegistrationSubmitted coordinator failed:', error));

    if (registration.registrationMode !== 'group') {
        return;
    }

    const groupMembers = Array.isArray(registration.groupMembers) ? registration.groupMembers : [];
    await Promise.all(groupMembers
        .filter((member) => member.email)
        .map((member, index) => {
            const studentRegistration = buildGroupStudentRegistration(registration, member, index);
            const studentMail = buildRegistrationSubmittedMail(studentRegistration);
            return sendStudentMail({
                to: member.email,
                subject: `Registration received - ${studentRegistration.registrationNumber || 'NSC 2026'}`,
                preview: 'Your NSC 2026 student registration has been received.',
                htmlBody: studentMail.htmlBody,
                textBody: studentMail.textBody,
            });
        })).catch((error) => console.error('notifyRegistrationSubmitted students failed:', error));
}

async function notifyPaymentUpdated(registration) {
    const to = getRegistrationMailRecipient(registration);
    await sendStudentMail({
        to,
        subject: `Payment status updated - ${registration.registrationNumber || 'NSC 2026'}`,
        preview: `Your payment status is now ${formatStatusLabel(registration.paymentStatus)}.`,
        body: [
            `Dear ${registration.participantName || registration.groupCoordinatorName || 'Delegate'},`,
            `Your payment status for registration ${registration.registrationNumber || '-'} has been updated to ${formatStatusLabel(registration.paymentStatus)}.`,
            `Total payable amount: Rs. ${(Number(registration.totalPayableAmount) || 0).toLocaleString('en-IN')}.`,
            'If you believe this status is incorrect, please contact the NSC 2026 secretariat with your transaction reference.',
        ],
    }).catch((error) => console.error('notifyPaymentUpdated failed:', error));
}

async function notifyApprovalUpdated(registration) {
    const recipients = registration.registrationMode === 'group'
        ? getUniqueMailRecipients([registration.groupCoordinatorEmail])
        : getUniqueMailRecipients([getRegistrationMailRecipient(registration)]);
    if (registration.approvalStatus === 'approved') {
        const { htmlBody, textBody } = buildConfirmedRegistrationMail(registration);
        await Promise.all(recipients.map((to) => sendStudentMail({
            to,
            subject: `Registration confirmed - ${registration.registrationNumber || '14th IPA NSC 2026'}`,
            preview: 'Your 14th IPA NSC 2026 registration has been verified and confirmed.',
            htmlBody,
            textBody,
        }))).catch((error) => console.error('notifyApprovalUpdated coordinator confirmed mail failed:', error));

        if (registration.registrationMode === 'group') {
            const groupMembers = Array.isArray(registration.groupMembers) ? registration.groupMembers : [];
            await Promise.all(groupMembers
                .filter((member) => member.email)
                .map((member, index) => {
                    const studentRegistration = buildGroupStudentRegistration(registration, member, index);
                    const studentMail = buildConfirmedRegistrationMail(studentRegistration);
                    return sendStudentMail({
                        to: member.email,
                        subject: `Registration confirmed - ${studentRegistration.registrationNumber || '14th IPA NSC 2026'}`,
                        preview: 'Your 14th IPA NSC 2026 registration has been verified and confirmed.',
                        htmlBody: studentMail.htmlBody,
                        textBody: studentMail.textBody,
                    });
                })).catch((error) => console.error('notifyApprovalUpdated student confirmed mail failed:', error));
        }
        return;
    }

    const htmlBody = `
        <p>Dear ${escapeHtml(registration.participantName || registration.groupCoordinatorName || 'Delegate')},</p>
        <p>Your registration <strong>${escapeHtml(registration.registrationNumber || '-')}</strong> approval status has been updated to <strong>${escapeHtml(formatStatusLabel(registration.approvalStatus))}</strong>.</p>
        ${buildRegistrationSummaryHtml(registration)}
        <p>Please watch your email and the portal for further updates.</p>
    `;
    const textBody = [
        `Dear ${registration.participantName || registration.groupCoordinatorName || 'Delegate'},`,
        `Your registration ${registration.registrationNumber || '-'} approval status has been updated to ${formatStatusLabel(registration.approvalStatus)}.`,
        '',
        buildRegistrationSummaryText(registration),
        '',
        'Please watch your email and the portal for further updates.',
    ].join('\n');

    await Promise.all(recipients.map((to) => sendStudentMail({
        to,
        subject: `Registration approval updated - ${registration.registrationNumber || 'NSC 2026'}`,
        preview: `Your registration approval status is now ${formatStatusLabel(registration.approvalStatus)}.`,
        htmlBody,
        textBody,
    }))).catch((error) => console.error('notifyApprovalUpdated coordinator failed:', error));

    if (registration.registrationMode !== 'group') {
        return;
    }

    const groupMembers = Array.isArray(registration.groupMembers) ? registration.groupMembers : [];
    await Promise.all(groupMembers
        .filter((member) => member.email)
        .map((member, index) => {
            const studentRegistration = buildGroupStudentRegistration(registration, member, index);
            const studentHtmlBody = `
                <p>Dear ${escapeHtml(studentRegistration.participantName || 'Delegate')},</p>
                <p>Your registration <strong>${escapeHtml(studentRegistration.registrationNumber || '-')}</strong> approval status has been updated to <strong>${escapeHtml(formatStatusLabel(registration.approvalStatus))}</strong>.</p>
                ${buildRegistrationSummaryHtml(studentRegistration)}
                <p>Please watch your email and the portal for further updates.</p>
            `;
            const studentTextBody = [
                `Dear ${studentRegistration.participantName || 'Delegate'},`,
                `Your registration ${studentRegistration.registrationNumber || '-'} approval status has been updated to ${formatStatusLabel(registration.approvalStatus)}.`,
                '',
                buildRegistrationSummaryText(studentRegistration),
                '',
                'Please watch your email and the portal for further updates.',
            ].join('\n');
            return sendStudentMail({
                to: member.email,
                subject: `Registration approval updated - ${studentRegistration.registrationNumber || 'NSC 2026'}`,
                preview: `Your registration approval status is now ${formatStatusLabel(registration.approvalStatus)}.`,
                htmlBody: studentHtmlBody,
                textBody: studentTextBody,
            });
        })).catch((error) => console.error('notifyApprovalUpdated students failed:', error));
}

async function notifyAbstractReviewed(contact, submission) {
    if (!contact) return;
    await sendStudentMail({
        to: contact.email,
        subject: `Abstract review update - ${submission.registrationNumber || contact.registrationNumber}`,
        preview: `Your abstract status is now ${formatStatusLabel(submission.status)}.`,
        body: [
            `Dear ${contact.name || 'Delegate'},`,
            `Your abstract submitted under registration ${submission.registrationNumber || contact.registrationNumber || '-'} has been marked ${formatStatusLabel(submission.status)}.`,
            submission.adminRemarks ? `Remarks: ${submission.adminRemarks}` : 'No additional remarks were added.',
            submission.status === 'accepted'
                ? 'You may submit your presentation link from the Scientific Service page when ready.'
                : 'Please watch the portal and your registered email for further instructions.',
        ],
    }).catch((error) => console.error('notifyAbstractReviewed failed:', error));
}

async function notifyVideoReviewed(contact, submission) {
    if (!contact) return;
    await sendStudentMail({
        to: contact.email,
        subject: `Presentation review update - ${submission.registrationNumber || contact.registrationNumber}`,
        preview: `Your presentation review status is now ${formatStatusLabel(submission.videoReviewStatus)}.`,
        body: [
            `Dear ${contact.name || 'Delegate'},`,
            `Your presentation review status for registration ${submission.registrationNumber || contact.registrationNumber || '-'} has been updated to ${formatStatusLabel(submission.videoReviewStatus)}.`,
            submission.videoReviewRemarks ? `Remarks: ${submission.videoReviewRemarks}` : 'No additional remarks were added.',
        ],
    }).catch((error) => console.error('notifyVideoReviewed failed:', error));
}

async function notifySkillVideoReviewed(contact, submission) {
    if (!contact) return;
    await sendStudentMail({
        to: contact.email,
        subject: `Skill competition video review update - ${submission.registrationNumber || contact.registrationNumber}`,
        preview: `Your ${submission.competitionName || 'skill competition'} video status is now ${formatStatusLabel(submission.reviewStatus)}.`,
        body: [
            `Dear ${contact.name || 'Delegate'},`,
            `Your video submission for ${submission.competitionName || 'the skill competition'} under registration ${submission.registrationNumber || contact.registrationNumber || '-'} has been updated to ${formatStatusLabel(submission.reviewStatus)}.`,
            submission.reviewRemarks ? `Remarks: ${submission.reviewRemarks}` : 'No additional remarks were added.',
        ],
    }).catch((error) => console.error('notifySkillVideoReviewed failed:', error));
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

async function ensureSkillCompetitionVideoSubmissions(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS skill_competition_video_submissions (
            id BIGSERIAL PRIMARY KEY,
            registration_number VARCHAR(30) NOT NULL,
            competition_name VARCHAR(180) NOT NULL,
            participant_name TEXT,
            institution_name TEXT,
            video_link TEXT NOT NULL,
            review_status VARCHAR(30) NOT NULL DEFAULT 'pending',
            review_remarks TEXT,
            reviewed_at TIMESTAMPTZ,
            submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (registration_number, competition_name)
        )
    `;
    await sql`CREATE INDEX IF NOT EXISTS skill_competition_video_submissions_status_idx ON skill_competition_video_submissions (review_status)`;
    await sql`CREATE INDEX IF NOT EXISTS skill_competition_video_submissions_registration_idx ON skill_competition_video_submissions (registration_number)`;
    await sql`CREATE INDEX IF NOT EXISTS skill_competition_video_submissions_competition_idx ON skill_competition_video_submissions (competition_name)`;
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
    if (extension !== 'pdf') {
        throw inputError('Upload a PDF file only.');
    }

    const buffer = Buffer.from(fileData, 'base64');
    const searchableContent = buffer.toString('latin1');

    if (extension === 'pdf') {
        const hasEmbeddedImage = /\/Subtype\s*\/Image\b|\/Filter\s*\/(?:DCTDecode|JPXDecode|JBIG2Decode|CCITTFaxDecode)\b/i.test(searchableContent);
        if (hasEmbeddedImage) {
            throw inputError('Abstract files must contain text only. Remove images, scanned pages, logos, charts, and embedded media before uploading.');
        }
    }

    const allowedTypes = new Set([
        '',
        'application/pdf',
    ]);
    if (fileType && !allowedTypes.has(fileType)) {
        throw inputError('Upload a PDF file only.');
    }

    return { buffer, extension };
}

async function uploadAbstractToBlob({ registrationNumber, fileName, fileType, buffer, extension }) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw inputError('Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN to the environment.');
    }

    const contentType = fileType || 'application/pdf';
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
    const perStudentRegistrationFee = Number(category?.registration_fee) || 0;
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
    const groupMembers = data.registrationMode === 'group' ? normalizeGroupMembers(data.groupMembers) : [];
    const participantCount = data.registrationMode === 'group' ? groupMembers.length : 1;
    const registrationSubtotal = perStudentRegistrationFee * participantCount;
    const registrationDiscount = data.registrationMode === 'group' && participantCount >= 20 ? registrationSubtotal * 0.1 : 0;
    const registrationFee = Math.max(registrationSubtotal - registrationDiscount, 0);
    const competitions = data.competitionParticipation === 'not_participating'
        ? []
        : data.registrationMode === 'group'
        ? groupMembers.flatMap((member) => member.competitions)
        : (Array.isArray(data.studentCompetitions) ? data.studentCompetitions : []).slice(0, 2);
    const competitionFee = data.competitionParticipation === 'not_participating'
        ? 0
        : data.registrationMode === 'group'
        ? groupMembers.reduce((memberTotal, member) => memberTotal + member.competitions.slice(0, 2).reduce((total, name) => total + getPrice('competition', name), 0), 0)
        : competitions.reduce((total, name) => total + getPrice('competition', name), 0);
    const selectedWorkshops = data.workshopParticipation === 'not_participating'
        ? []
        : data.registrationMode === 'group'
        ? groupMembers.flatMap((member) => member.workshops)
        : Array.isArray(data.selectedWorkshops) && data.selectedWorkshops.length
            ? [...new Set(data.selectedWorkshops.map((name) => String(name).trim()).filter(Boolean))]
            : data.preConferenceWorkshop ? [data.preConferenceWorkshop] : [];
    const workshopFee = data.workshopParticipation === 'not_participating'
        ? 0
        : data.registrationMode === 'group'
        ? groupMembers.reduce((memberTotal, member) => memberTotal + member.workshops.reduce((total, name) => total + getPrice('workshop', name), 0), 0)
        : selectedWorkshops.reduce((total, name) => total + getPrice('workshop', name), 0);

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
        VALUES ('NDDS (Nano/Micro Drug Delivery Systems) - Formulation and Characterization', 'workshop', 'Workshop session', 0, 40)
        ON CONFLICT (program_type, name) DO NOTHING
    `;
    await sql`
        UPDATE event_programs
        SET name = 'NDDS (Nano/Micro Drug Delivery Systems) - Formulation and Characterization',
            updated_at = NOW()
        WHERE program_type = 'workshop'
            AND name = 'NDDS Formulation and Characterization'
            AND NOT EXISTS (
                SELECT 1
                FROM event_programs existing
                WHERE existing.program_type = 'workshop'
                    AND existing.name = 'NDDS (Nano/Micro Drug Delivery Systems) - Formulation and Characterization'
            )
    `;
    await sql`
        UPDATE event_programs
        SET name = 'FIP IPA Vaccination Training (2 days)',
            description = 'Post-congress workshop, 21-22 September 2026',
            price = 1000,
            sort_order = 20,
            is_active = TRUE,
            updated_at = NOW()
        WHERE program_type = 'workshop'
            AND name = 'Vaccination'
            AND NOT EXISTS (
                SELECT 1
                FROM event_programs existing
                WHERE existing.program_type = 'workshop'
                    AND existing.name = 'FIP IPA Vaccination Training (2 days)'
            )
    `;
    await sql`
        INSERT INTO event_programs (name, program_type, description, price, sort_order)
        VALUES ('FIP IPA Vaccination Training (2 days)', 'workshop', 'Post-congress workshop, 21-22 September 2026', 1000, 20)
        ON CONFLICT (program_type, name) DO UPDATE
        SET description = EXCLUDED.description,
            price = EXCLUDED.price,
            sort_order = EXCLUDED.sort_order,
            is_active = TRUE,
            updated_at = NOW()
    `;
    await sql`
        UPDATE event_programs
        SET is_active = FALSE,
            updated_at = NOW()
        WHERE program_type = 'workshop'
            AND name = 'Vaccination'
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
        ADD COLUMN IF NOT EXISTS hr_core_area VARCHAR(100),
        ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
        ADD COLUMN IF NOT EXISTS ipa_member_id VARCHAR(30),
        ADD COLUMN IF NOT EXISTS transaction_date DATE
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
    await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_ipa_member_id_key
        ON event_registrations (ipa_member_id)
        WHERE ipa_member_id IS NOT NULL AND ipa_member_id <> ''
    `;
    await sql`
        UPDATE event_registrations r
        SET group_members = (
            SELECT jsonb_agg(
                CASE
                    WHEN COALESCE(member->>'registrationNumber', '') = '' AND r.registration_number IS NOT NULL
                        THEN member || jsonb_build_object('registrationNumber', r.registration_number || '-' || LPAD(ord::text, 3, '0'))
                    ELSE member
                END
                ORDER BY ord
            )
            FROM jsonb_array_elements(COALESCE(r.group_members, '[]'::jsonb)) WITH ORDINALITY AS item(member, ord)
        )
        WHERE r.registration_mode = 'group'
            AND r.registration_number IS NOT NULL
            AND EXISTS (
                SELECT 1
                FROM jsonb_array_elements(COALESCE(r.group_members, '[]'::jsonb)) AS member
                WHERE COALESCE(member->>'registrationNumber', '') = ''
            )
    `;
}

function normalizeGroupMembers(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.slice(0, 500).map((member) => ({
        name: String(member?.name || '').trim(),
        ipaMemberId: String(member?.ipaMemberId || '').trim().toUpperCase(),
        email: String(member?.email || '').trim().toLowerCase(),
        whatsapp: String(member?.whatsapp || '').trim(),
        gender: String(member?.gender || '').trim(),
        category: String(member?.category || '').trim(),
        course: String(member?.course || '').trim(),
        college: String(member?.college || '').trim(),
        state: String(member?.state || '').trim(),
        foodPreference: String(member?.foodPreference || '').trim(),
        registrationNumber: String(member?.registrationNumber || '').trim(),
        fipVaccinationEligibility: ['Yes', 'No'].includes(String(member?.fipVaccinationEligibility || '').trim())
            ? String(member.fipVaccinationEligibility).trim()
            : '',
        competitions: Array.isArray(member?.competitions)
            ? [...new Set(member.competitions.map((name) => String(name || '').trim()).filter(Boolean))].slice(0, 2)
            : [],
        workshops: Array.isArray(member?.workshops)
            ? [...new Set(member.workshops.map((name) => String(name || '').trim()).filter(Boolean))].slice(0, 1)
            : [],
        presentationType: ['Oral Presentation', 'Poster Presentation'].includes(String(member?.presentationType || '').trim())
            ? String(member.presentationType).trim()
            : 'Not Participating',
        hrCoreArea: hrCoreAreaOptions.includes(String(member?.hrCoreArea || '').trim())
            ? String(member.hrCoreArea).trim()
            : '',
    })).filter((member) => member.name);
}

function normalizeSelectedWorkshops(value, fallback = '') {
    const workshops = Array.isArray(value) ? value : fallback ? [fallback] : [];
    return [...new Set(workshops.map((name) => String(name || '').trim()).filter(Boolean))].slice(0, 1);
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
        ipaMemberId: row.ipa_member_id || '',
        stateOfResidence: row.state_of_residence || '',
        whatsappNumber: row.whatsapp_number || '',
        email: row.email || '',
        gender: row.gender || '',
        foodPreference: row.food_preference || '',
        courseOfStudy: row.course_of_study || 'B.Pharm',
        collegeWithState: row.college_with_state || '',
        studentCompetitions: competitions,
        competitionFeeAcknowledged: row.competition_fee_acknowledged ? 'Yes' : 'No',
        preConferenceWorkshop: row.pre_conference_workshop || '',
        selectedWorkshops: normalizeSelectedWorkshops(row.selected_workshops, row.pre_conference_workshop),
        workshopFeeAcknowledged: row.workshop_fee_acknowledged ? 'Yes' : 'No',
        presentationType: row.presentation_type || '',
        hrDriveParticipation: row.hr_core_area ? 'participating' : 'not_participating',
        hrCollegeWithState: row.hr_college_with_state || '',
        hrCourseOrQualification: row.hr_course_or_qualification || '',
        hrWhatsappNumber: row.hr_whatsapp_number || '',
        hrWhatsappConfirmation: row.hr_whatsapp_confirmation || '',
        hrEmail: row.hr_email || '',
        hrEmailConfirmation: row.hr_email_confirmation || '',
        hrCoreArea: row.hr_core_area || '',
        transactionDetails: row.transaction_details || '',
        transactionDate: formatDateOnly(row.transaction_date),
        registrationNumber: row.registration_number || '',
        submittedAt: row.submitted_at || '',
        registrationFee: Number(row.registration_fee) || 0,
        competitionFee: Number(row.competition_fee) || 0,
        workshopFee: Number(row.workshop_fee) || 0,
        totalPayableAmount: Number(row.total_payable_amount) || 0,
        paymentStatus: row.payment_status || 'pending',
        approvalStatus: row.approval_status || 'not_submitted',
        registrationStatus: row.registration_status || 'draft',
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
        ipaMemberId: row.ipa_member_id || '',
        stateOfResidence: row.state_of_residence || '',
        whatsappNumber: row.whatsapp_number || '',
        email: row.email || '',
        gender: row.gender || '',
        foodPreference: row.food_preference || '',
        courseOfStudy: row.course_of_study || '',
        collegeWithState: row.college_with_state || '',
        studentCompetitions: row.student_competitions || [],
        competitionFeeAcknowledged: Boolean(row.competition_fee_acknowledged),
        preConferenceWorkshop: row.pre_conference_workshop || '',
        selectedWorkshops: normalizeSelectedWorkshops(row.selected_workshops, row.pre_conference_workshop),
        workshopFeeAcknowledged: Boolean(row.workshop_fee_acknowledged),
        presentationType: row.presentation_type || '',
        hrDriveParticipation: row.hr_core_area ? 'participating' : 'not_participating',
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
        transactionDate: formatDateOnly(row.transaction_date),
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
    const groupCompetitions = [...new Set(groupMembers.flatMap((member) => member.competitions))];
    const groupPresentationTypes = [...new Set(groupMembers.map((member) => member.presentationType).filter((value) => value && value !== 'Not Participating'))];
    const groupHrCoreAreas = [...new Set(groupMembers.map((member) => member.hrCoreArea).filter(Boolean))];
    const presentationType = data.registrationMode === 'group'
        ? groupPresentationTypes.length ? groupPresentationTypes.join(', ') : 'Not Participating'
        : data.presentationType || 'Not Participating';
    const hrCoreArea = data.registrationMode === 'group'
        ? groupHrCoreAreas.join(', ')
        : data.hrCoreArea || '';
    const normalizedIpaMemberId = requiresIpaMemberId(data.category)
        ? String(data.ipaMemberId || '').trim().toUpperCase()
        : '';
    const selectedWorkshops = data.workshopParticipation === 'not_participating'
        ? []
        : data.registrationMode === 'group'
        ? [...new Set(groupMembers.flatMap((member) => member.workshops))].slice(0, 20)
        : normalizeSelectedWorkshops(data.selectedWorkshops, data.preConferenceWorkshop);
    const competitions = data.competitionParticipation === 'not_participating'
        ? []
        : data.registrationMode === 'group'
        ? groupCompetitions
        : (Array.isArray(data.studentCompetitions) ? data.studentCompetitions : []).slice(0, 2);
    if (submit) {
        const generalRequiredFields = data.registrationMode === 'group'
            ? [
                ['Institution / College Name', data.institutionName],
                ['Group Coordinator Name', data.groupCoordinatorName],
                ['Coordinator WhatsApp Number', data.groupCoordinatorWhatsapp],
                ['Coordinator Email ID', data.groupCoordinatorEmail],
                ['State', data.stateOfResidence],
                ['Expected Number of Participants', data.expectedParticipants],
                ['Primary Delegate Category', data.category],
            ]
            : [
                ['Name of Participant', data.participantName],
                ['Category', data.category],
                ['State of Residence', data.stateOfResidence],
                ['WhatsApp Number', data.whatsappNumber],
                ['Email ID', data.email],
                ['Gender', data.gender],
                ['Food Preference', data.foodPreference],
            ];
        const missingGeneralField = generalRequiredFields.find(([, value]) => !String(value || '').trim());
        if (missingGeneralField) {
            throw inputError(`${missingGeneralField[0]} is required.`);
        }
        const selectedCategory = categories.find((category) => category.name === data.category && category.is_active);
        if (!selectedCategory) {
            throw inputError('Select an active registration category.');
        }
        if (data.registrationMode === 'group' && !groupMembers.length) {
            throw inputError('Upload the student roster before submitting a group registration.');
        }
        const invalidGroupIpaMember = groupMembers.find((member) => member.ipaMemberId && !ipaMemberIdPattern.test(member.ipaMemberId));
        if (invalidGroupIpaMember) {
            throw inputError(`IPA Member ID format is wrong for ${invalidGroupIpaMember.name || 'a group member'}.`);
        }
        if (!String(data.transactionDetails || '').trim()) {
            throw inputError('Enter the transaction ID / UPI reference number before submitting.');
        }
        if (!String(data.transactionDate || '').trim()) {
            throw inputError('Enter the transaction date before submitting.');
        }
        const availableProgramIds = new Set(
            pricing
                .filter((item) => String(item.category_id) === String(selectedCategory.id) && item.is_available)
                .map((item) => String(item.program_id))
        );
        const selectedProgramNames = [
            ...competitions,
            ...selectedWorkshops,
        ];
        if (selectedProgramNames.some((name) => {
            const program = programs.find((item) => item.name === name && item.is_active);
            return !program || !availableProgramIds.has(String(program.id));
        })) {
            throw inputError('One or more selected programs are not available for this category. Review your selections.');
        }
        if (selectedWorkshops.includes(fipVaccinationWorkshopName)) {
            const hasIneligibleFipSelection = data.registrationMode === 'group'
                ? groupMembers.some((member) => Array.isArray(member.workshops)
                    && member.workshops.includes(fipVaccinationWorkshopName)
                    && member.fipVaccinationEligibility !== 'Yes')
                : String(data.fipVaccinationEligibility || '').trim() !== 'Yes';
            if (hasIneligibleFipSelection) {
                throw inputError('FIP IPA Vaccination Training requires a BLS Certificate or Training letter.');
            }
        }
        if (data.hrDriveParticipation !== 'not_participating') {
            if (data.registrationMode === 'group' && !groupHrCoreAreas.length) {
                throw inputError('Select at least one student for the HR Drive.');
            }
            if (!String(data.hrCollegeWithState || '').trim() || !String(data.hrCourseOrQualification || '').trim()
                || !String(data.hrWhatsappNumber || '').trim() || !String(hrCoreArea || '').trim()) {
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
    }

    if (requiresIpaMemberId(data.category) && !normalizedIpaMemberId) {
        throw inputError('IPA Member ID is required for the selected category.');
    }
    if (normalizedIpaMemberId && !ipaMemberIdPattern.test(normalizedIpaMemberId)) {
        throw inputError('IPA Member ID format is wrong.');
    }

    if (normalizedIpaMemberId) {
        const existingIpaMemberRows = await sql`
            SELECT id
            FROM event_registrations
            WHERE ipa_member_id = ${normalizedIpaMemberId}
              AND draft_token <> ${draftToken}
            LIMIT 1
        `;
        if (existingIpaMemberRows.length) {
            throw inputError('This IPA Member ID has already been used.');
        }
    }

    const rows = await sql`
        INSERT INTO event_registrations (
            draft_token, registration_mode, participant_name, institution_name,
            group_coordinator_name, group_coordinator_email, group_coordinator_whatsapp,
            expected_participants, group_members, category, ipa_member_id, state_of_residence, whatsapp_number, email,
            gender, food_preference, course_of_study, college_with_state,
            competition_fee_acknowledged, pre_conference_workshop,
            selected_workshops, workshop_fee_acknowledged, presentation_type,
            hr_college_with_state, hr_course_or_qualification, hr_whatsapp_number,
            hr_whatsapp_confirmation, hr_email, hr_email_confirmation, hr_core_area, registration_fee,
            competition_fee, workshop_fee, total_payable_amount, transaction_details, transaction_date,
            registration_status, approval_status, submitted_at
        )
        VALUES (
            ${draftToken}, ${data.registrationMode || 'individual'}, ${data.participantName || null},
            ${data.institutionName || null}, ${data.groupCoordinatorName || null},
            ${data.groupCoordinatorEmail || null}, ${data.groupCoordinatorWhatsapp || null},
            ${expectedParticipants}, ${JSON.stringify(groupMembers)}::jsonb, ${data.category || null},
            ${normalizedIpaMemberId || null},
            ${data.stateOfResidence || null},
            ${data.whatsappNumber || null}, ${data.email || null}, ${data.gender || null}, ${data.foodPreference || null},
            ${data.courseOfStudy || null}, ${data.collegeWithState || null},
            ${booleanValue(data.competitionFeeAcknowledged)}, ${selectedWorkshops[0] || null},
            ${JSON.stringify(selectedWorkshops)}::jsonb, ${booleanValue(data.workshopFeeAcknowledged)}, ${presentationType || null},
            ${data.hrCollegeWithState || null}, ${data.hrCourseOrQualification || null}, ${data.hrWhatsappNumber || null},
            ${data.hrWhatsappConfirmation || null}, ${data.hrEmail || null}, ${data.hrEmailConfirmation || null}, ${hrCoreArea || null},
            ${fees.registrationFee}, ${fees.competitionFee}, ${fees.workshopFee}, ${fees.total},
            ${data.transactionDetails || null}, ${data.transactionDate || null}, ${submit ? 'submitted' : 'draft'},
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
            ipa_member_id = EXCLUDED.ipa_member_id,
            state_of_residence = EXCLUDED.state_of_residence,
            whatsapp_number = EXCLUDED.whatsapp_number,
            email = EXCLUDED.email,
            gender = EXCLUDED.gender,
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
            transaction_date = EXCLUDED.transaction_date,
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

    if (row.registration_mode === 'group' && row.registration_number) {
        const numberedGroupMembers = assignGroupMemberRegistrationNumbers(normalizeGroupMembers(row.group_members), row.registration_number);
        const currentGroupMembers = JSON.stringify(normalizeGroupMembers(row.group_members));
        const nextGroupMembers = JSON.stringify(numberedGroupMembers);
        if (currentGroupMembers !== nextGroupMembers) {
            const updatedRows = await sql`
                UPDATE event_registrations
                SET group_members = ${nextGroupMembers}::jsonb,
                    updated_at = NOW()
                WHERE id = ${row.id}
                RETURNING *
            `;
            Object.assign(row, updatedRows[0]);
        }
    }

    await sql`DELETE FROM registration_competitions WHERE registration_id = ${row.id}`;
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

function mapSkillCompetitionVideoSubmission(row) {
    return {
        id: row.id,
        registrationNumber: row.registration_number,
        competitionName: row.competition_name,
        participantName: row.participant_name || '',
        institutionName: row.institution_name || '',
        videoLink: row.video_link || '',
        reviewStatus: row.review_status || 'pending',
        reviewRemarks: row.review_remarks || '',
        reviewedAt: row.reviewed_at || null,
        submittedAt: row.submitted_at,
    };
}

async function findRegistrationForPublicNumber(sql, registrationNumber) {
    const normalized = String(registrationNumber || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!normalized) return null;

    const rows = await sql`
        SELECT r.id, r.registration_number, r.registration_mode, r.participant_name,
               r.institution_name, r.group_coordinator_name, r.group_coordinator_email,
               r.group_coordinator_whatsapp, r.email, r.whatsapp_number,
               r.payment_status, r.approval_status, r.registration_status,
               gm.member AS group_member
        FROM event_registrations r
        LEFT JOIN LATERAL (
            SELECT member
            FROM jsonb_array_elements(COALESCE(r.group_members, '[]'::jsonb)) AS member
            WHERE UPPER(REPLACE(member->>'registrationNumber', ' ', '')) = ${normalized}
            LIMIT 1
        ) gm ON TRUE
        WHERE UPPER(REPLACE(r.registration_number, ' ', '')) = ${normalized}
           OR gm.member IS NOT NULL
        LIMIT 1
    `;
    if (!rows.length) return null;

    const row = rows[0];
    const member = row.group_member || null;
    const memberRegistrationNumber = member?.registrationNumber || member?.registration_number || '';
    return {
        ...row,
        canonicalRegistrationNumber: memberRegistrationNumber || row.registration_number || registrationNumber,
        contactName: member?.name || row.participant_name || row.group_coordinator_name || 'Delegate',
        contactEmail: member?.email || row.email || row.group_coordinator_email || '',
        contactWhatsapp: member?.whatsapp || row.whatsapp_number || row.group_coordinator_whatsapp || '',
        displayInstitution: member?.college || row.institution_name || '',
        isGroupMember: Boolean(member),
    };
}

async function findRegistrationCompetitionNames(sql, reg) {
    const memberCompetitions = Array.isArray(reg?.group_member?.competitions)
        ? reg.group_member.competitions
        : Array.isArray(reg?.group_member?.studentCompetitions)
            ? reg.group_member.studentCompetitions
            : null;
    if (memberCompetitions) {
        return memberCompetitions.map((item) => String(item || '').trim()).filter(Boolean);
    }

    const rows = await sql`
        SELECT rc.competition_name
        FROM registration_competitions rc
        WHERE rc.registration_id = ${reg.id}
        ORDER BY rc.id
    `;
    return rows.map((item) => item.competition_name);
}

async function getSkillCompetitionEligibility(sql, registrationNumber, competitionName) {
    const reg = await findRegistrationForPublicNumber(sql, registrationNumber);
    if (!reg) return { valid: false };

    const canonicalRegNum = reg.canonicalRegistrationNumber || registrationNumber;
    const selectedCompetitions = await findRegistrationCompetitionNames(sql, reg);

    const paymentReady = reg.payment_status === 'success';
    const approvalReady = reg.approval_status === 'approved';
    const registrationReady = reg.registration_status === 'submitted';
    const canSubmit = registrationReady && paymentReady && approvalReady;
    const eligibilityReason = !registrationReady
        ? 'Registration must be submitted before video submission.'
        : !paymentReady
            ? 'Payment must be marked success before video submission.'
            : !approvalReady
                ? 'Registration must be approved before video submission.'
                : '';

    const existing = await sql`
        SELECT *
        FROM skill_competition_video_submissions
        WHERE registration_number = ${canonicalRegNum}
          AND competition_name = ${competitionName}
        LIMIT 1
    `;

    return {
        valid: true,
        registration: reg,
        canonicalRegNum,
        participantName: reg.contactName || '',
        institutionName: reg.displayInstitution || '',
        paymentStatus: reg.payment_status || '',
        approvalStatus: reg.approval_status || '',
        registrationStatus: reg.registration_status || '',
        selectedCompetitions,
        canSubmit,
        eligibilityReason,
        alreadySubmitted: existing.length > 0,
        submission: existing.length ? mapSkillCompetitionVideoSubmission(existing[0]) : null,
    };
}

async function handlePublicAbstractRoute(path, request, response, sql) {
    if (path === 'abstracts/check' && request.method === 'GET') {
        await ensureAbstractSubmissions(sql);
        const regNum = String(request.query.registrationNumber || '').trim().toUpperCase();
        if (!regNum) {
            return send(response, 400, { error: 'Registration number is required.' });
        }
        const reg = await findRegistrationForPublicNumber(sql, regNum);
        if (!reg) {
            return send(response, 200, { valid: false });
        }

        const canonicalRegNum = reg.canonicalRegistrationNumber || regNum;
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
            participantName: reg.contactName || '',
            institutionName: reg.displayInstitution || '',
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

        const reg = await findRegistrationForPublicNumber(sql, regNum);
        if (!reg) throw inputError('Registration number not found.');
        if (reg.registration_status !== 'submitted') {
            throw inputError('Registration must be submitted before abstract submission.');
        }
        if (reg.payment_status !== 'success') {
            throw inputError('Payment must be marked success before abstract submission.');
        }
        if (reg.approval_status !== 'approved') {
            throw inputError('Registration must be approved before abstract submission.');
        }
        const canonicalRegNum = reg.canonicalRegistrationNumber || regNum;

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
                ${reg.contactName || null},
                ${reg.displayInstitution || null},
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
                `Dear ${contact?.name || reg.contactName || 'Delegate'},`,
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
        if (!videoLink) throw inputError('Presentation link is required.');

        const rows = await sql`
            SELECT id, status, poster_video_link
            FROM abstract_submissions
            WHERE UPPER(REPLACE(registration_number, ' ', '')) = ${regNum.replace(/\s+/g, '')}
            LIMIT 1
        `;
        if (!rows.length) throw inputError('No abstract submission found for this registration number.');
        if (rows[0].status !== 'accepted') throw inputError('Presentation link can only be submitted once your abstract has been accepted.');
        if (rows[0].poster_video_link) throw inputError('A presentation link has already been submitted for this registration number.');

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
            subject: `Presentation link received - ${submission.registrationNumber}`,
            preview: 'Your presentation link has been received and is pending review.',
            body: [
                `Dear ${contact?.name || 'Delegate'},`,
                `Your presentation link for registration ${submission.registrationNumber || '-'} has been received.`,
                'The scientific committee will review it and notify you when the presentation review status is updated.',
            ],
        });
        return send(response, 200, { submission });
    }

    return null;
}

async function handlePublicSkillCompetitionRoute(path, request, response, sql) {
    if (path === 'skill-videos/check' && request.method === 'GET') {
        await ensureSkillCompetitionVideoSubmissions(sql);
        const regNum = String(request.query.registrationNumber || '').trim().toUpperCase();
        const competitionName = String(request.query.competitionName || '').trim();
        if (!regNum) {
            return send(response, 400, { error: 'Registration number is required.' });
        }
        if (!competitionName) {
            return send(response, 400, { error: 'Competition name is required.' });
        }

        const eligibility = await getSkillCompetitionEligibility(sql, regNum, competitionName);
        if (!eligibility.valid) {
            return send(response, 200, { valid: false });
        }

        return send(response, 200, {
            valid: true,
            participantName: eligibility.participantName,
            institutionName: eligibility.institutionName,
            paymentStatus: eligibility.paymentStatus,
            approvalStatus: eligibility.approvalStatus,
            registrationStatus: eligibility.registrationStatus,
            selectedCompetitions: eligibility.selectedCompetitions,
            canSubmit: eligibility.canSubmit,
            eligibilityReason: eligibility.eligibilityReason,
            alreadySubmitted: eligibility.alreadySubmitted,
            submission: eligibility.submission,
        });
    }

    if (path === 'skill-videos/submit' && request.method === 'POST') {
        await ensureSkillCompetitionVideoSubmissions(sql);
        const regNum = String(request.body?.registrationNumber || '').trim().toUpperCase();
        const competitionName = String(request.body?.competitionName || '').trim();
        const videoLink = String(request.body?.videoLink || '').trim();
        if (!regNum) throw inputError('Registration number is required.');
        if (!competitionName) throw inputError('Competition name is required.');
        if (!videoLink) throw inputError('Video link is required.');
        if (!/^https?:\/\/\S+$/i.test(videoLink)) throw inputError('Enter a valid video URL starting with http:// or https://.');

        const eligibility = await getSkillCompetitionEligibility(sql, regNum, competitionName);
        if (!eligibility.valid) throw inputError('Registration number not found.');
        if (!eligibility.canSubmit) throw inputError(eligibility.eligibilityReason || 'This registration is not eligible for video submission.');
        if (eligibility.alreadySubmitted) throw inputError('A video link has already been submitted for this competition.');

        const rows = await sql`
            INSERT INTO skill_competition_video_submissions
                (registration_number, competition_name, participant_name, institution_name, video_link, review_status)
            VALUES (
                ${eligibility.canonicalRegNum},
                ${competitionName},
                ${eligibility.participantName || null},
                ${eligibility.institutionName || null},
                ${videoLink},
                'pending'
            )
            RETURNING *
        `;
        const submission = mapSkillCompetitionVideoSubmission(rows[0]);
        const contact = await getRegistrationContactForMail(sql, submission.registrationNumber);
        queueStudentMail({
            to: contact?.email,
            subject: `Skill competition video received - ${submission.registrationNumber}`,
            preview: 'Your skill competition video link has been received and is pending review.',
            body: [
                `Dear ${contact?.name || eligibility.participantName || 'Delegate'},`,
                `Your video link for ${competitionName} under registration ${submission.registrationNumber || '-'} has been received.`,
                'The committee will review it and notify you when the review status is updated.',
            ],
        });
        return send(response, 201, { submission });
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
            await notifyRegistrationSubmitted(registration);
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

        if (path === 'home-content' && request.method === 'GET') {
            const row = await ensureHomeContent(sql);
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

        const publicSkillCompetitionResponse = await handlePublicSkillCompetitionRoute(path, request, response, sql);
        if (publicSkillCompetitionResponse) {
            return publicSkillCompetitionResponse;
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
                    'This is a test email from the 14th National IPA Student Congress 2026 portal.',
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
            await notifyPaymentUpdated(registration);
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
            await notifyApprovalUpdated(registration);
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

        if (path === 'admin/home-content' && request.method === 'GET') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'content.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const row = await ensureHomeContent(sql);
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

        if (path === 'admin/home-content' && request.method === 'PUT') {
            if (session.role_id !== 'role-super-admin' && !requirePermission(session, 'content.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            await ensureHomeContent(sql);
            const content = request.body?.content || defaultHomeContent;
            const rows = await sql`
                INSERT INTO home_content (id, content, updated_by, updated_at)
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

        // ── Admin: list skill competition video submissions ───────────
        if (path === 'admin/skill-videos' && request.method === 'GET') {
            await ensureSkillCompetitionVideoSubmissions(sql);
            if (!requirePermission(session, 'registration.view')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const rows = await sql`
                SELECT id, registration_number, competition_name, participant_name, institution_name,
                       video_link, review_status, review_remarks, reviewed_at, submitted_at
                FROM skill_competition_video_submissions
                ORDER BY submitted_at DESC
            `;
            return send(response, 200, { submissions: rows.map(mapSkillCompetitionVideoSubmission) });
        }

        // ── Admin: review skill competition video submission ──────────
        const skillVideoReviewMatch = path.match(/^admin\/skill-videos\/(\d+)$/);
        if (skillVideoReviewMatch && request.method === 'PATCH') {
            await ensureSkillCompetitionVideoSubmissions(sql);
            if (!requirePermission(session, 'registration.update')) {
                return send(response, 403, { error: 'Permission denied.' });
            }
            const { reviewStatus, reviewRemarks } = request.body || {};
            if (!['pending', 'shortlisted', 'approved', 'rejected'].includes(reviewStatus)) {
                throw inputError('Invalid review status. Must be pending, shortlisted, approved, or rejected.');
            }
            const rows = await sql`
                UPDATE skill_competition_video_submissions
                SET review_status = ${reviewStatus},
                    review_remarks = ${reviewRemarks ? String(reviewRemarks).trim() : null},
                    reviewed_at = NOW(),
                    updated_at = NOW()
                WHERE id = ${skillVideoReviewMatch[1]}
                RETURNING *
            `;
            if (!rows.length) return send(response, 404, { error: 'Submission not found.' });
            const submission = mapSkillCompetitionVideoSubmission(rows[0]);
            const contact = await getRegistrationContactForMail(sql, rows[0].registration_number);
            await notifySkillVideoReviewed(contact, submission);
            return send(response, 200, { submission });
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
                if (!['approved', 'rejected'].includes(videoReviewStatus)) {
                    throw inputError('Invalid presentation review status. Must be approved or rejected.');
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
                await notifyVideoReviewed(contact, submission);
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
            await notifyAbstractReviewed(contact, submission);
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
