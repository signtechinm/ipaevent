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

        return send(response, 404, { error: 'API route not found.' });
    } catch (error) {
        console.error(error);
        const status = error?.code === '23505' ? 409 : 500;
        const message = status === 409 ? 'That email or role name already exists.' : 'Server request failed.';
        return send(response, status, { error: message });
    }
}
