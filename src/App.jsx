import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from './api';

const siteMap = [
    {
        title: 'Home',
        pages: ['Home', 'News and Updates', 'Important Dates'],
    },
    {
        title: 'Registration',
        pages: [
            'Registration',
            'Registration Mode and Process',
            'Registration Link and Payment',
            'Group Registration',
            'Individual Registration',
            'Workshop Registration',
            'Register for Placement Drive',
            'Registered Participants',
        ],
    },
    {
        title: 'Programs and Events Spotlight',
        pages: [
            'Programs and Events Spotlight',
            'Sessions and Schedules',
            'Speaker Profile and Topics',
            'Student Skill Competitions',
            'Cultural Extravaganza',
        ],
    },
    {
        title: 'Organizing Team',
        pages: [
            'Organizing Team',
            'Patrons',
            'LOC - Core Group',
            'LOC - Sub Committee',
            'Advisors and Principals',
            'IPA NEC 2026',
            'IPA SF NEC 2026',
            'IPA Kerala SEC 2026',
            'Partners and Sponsors',
        ],
    },
];

const pageHighlights = {
    'Sessions and Schedules': 'Track session blocks, program timing, workshop slots, and venue-wise scheduling.',
    'Speaker Profile and Topics': 'View invited speakers, session themes, and topic announcements.',
    'Student Skill Competitions': 'Browse student competition categories, rules, eligibility, and fee notes.',
    'Cultural Extravaganza': 'See cultural program highlights, participation details, and evening schedule notes.',
    'Registration Mode and Process': 'Understand the step-by-step flow for individual, group, workshop, and payment completion.',
    'Registration Link and Payment': 'Start registration and review payable fees, payment mode, and transaction capture.',
    'Group Registration': 'Coordinate bulk participant registration for colleges, chapters, and institutional teams.',
    'Individual Registration': 'Register as a single delegate and save details section by section.',
    'Workshop Registration': 'Choose pre-conference workshops and review fee acknowledgements.',
    'Register for Placement Drive': 'Reserve placement drive participation and keep employment-related details ready.',
    'Registered Participants': 'Reserved listing area for verified delegates after admin approval.',
    'Submit Abstract Here': 'Submit abstracts for review once the scientific submission form opens.',
    'For Oral Presentation': 'Check oral presentation eligibility, format, timing, and review requirements.',
    'Poster Presentation': 'Review poster presentation rules, display size, and scientific evaluation details.',
    'Instructions and Model Poster': 'Download author instructions, model poster layout, and formatting guidance.',
    'Accepted Papers': 'Published list area for accepted abstracts, presentation codes, and session allocation.',
    '14th NSC Abstract Book': 'Download the final abstract book after scientific committee approval.',
    '14th NSC Souvenir': 'Access the souvenir, sponsor acknowledgements, and event commemorative material.',
    Patrons: 'Showcase patron messages, leadership support, and convention guidance.',
    'LOC - Core Group': 'Introduce the local organizing committee core group and operational leads.',
    'LOC - Sub Committee': 'List sub-committee teams across registration, scientific, hospitality, and events.',
    'Advisors and Principals': 'Recognize advisors, principals, and academic leadership supporting the event.',
    'IPA NEC 2026': 'Feature national executive committee details and IPA leadership information.',
    'IPA SF NEC 2026': 'Feature IPA Students Forum national executive committee information.',
    'IPA Kerala SEC 2026': 'Feature Kerala state executive committee details and branch representatives.',
    'Partners and Sponsors': 'Showcase confirmed partners, sponsors, collaborators, and institutional supporters.',
};

const updates = [
    ['Abstract submission opening soon', 'Poster and oral presentation links will be published here.'],
    ['Brochure download area ready', 'Event brochures, sponsor materials, and information booklets.'],
    ['Competition registration planned', 'Student competitions and placement activities get dedicated links.'],
];

const quickFacts = [
    ['Date', 'To be announced', 'Important dates and deadlines will appear here.'],
    ['Venue', 'Kerala', 'Route map, venue image, and travel guidance section.'],
    ['Host', 'IPA Kerala', 'With IPASF and the 14th NSC organizing team.'],
];

const registrationDraftKey = 'ipa-nsc-2026-registration-draft-token';

const categoryOptions = [
    'Student Delegate - IPA SF Member',
    'Student Delegate - Non IPA SF Member',
    'Delegate IPA Member - Faculty',
    'Delegate IPA Member - Others',
    'Others',
];

const categoryFees = {
    'Student Delegate - IPA SF Member': 100,
    'Student Delegate - Non IPA SF Member': 100,
    'Delegate IPA Member - Faculty': 100,
    'Delegate IPA Member - Others': 100,
    Others: 100,
};

const competitionOptions = [
    'Patient Counselling Competitions',
    'Extempore Preparations in Pharmaceutics',
    'Ideation Contest',
    'Pharma Quiz (Group)',
    'Elocution',
    'Clinical Skill Sets',
];

const workshopOptions = ['AI', 'Vaccination', '3D Printing'];

const workshopFees = {
    AI: 0,
    Vaccination: 0,
    '3D Printing': 0,
};

const initialRegistration = {
    registrationMode: 'individual',
    participantName: '',
    institutionName: '',
    groupCoordinatorName: '',
    groupCoordinatorEmail: '',
    groupCoordinatorWhatsapp: '',
    expectedParticipants: '',
    category: '',
    stateOfResidence: '',
    whatsappNumber: '',
    email: '',
    foodPreference: '',
    courseOfStudy: 'B.Pharm',
    collegeWithState: '',
    studentCompetitions: [],
    competitionFeeAcknowledged: '',
    preConferenceWorkshop: '',
    workshopFeeAcknowledged: '',
    presentationType: '',
    transactionDetails: '',
    registrationNumber: '',
    submittedAt: '',
};

const registrationTabs = [
    { id: 'general', label: 'General' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'workshop', label: 'Workshop' },
    { id: 'presentation', label: 'Presentation' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
    { id: 'confirmation', label: 'Confirmation' },
];

const registrationModes = [
    {
        id: 'individual',
        title: 'Individual Registration',
        copy: 'For a single delegate completing personal details, competitions, workshop, presentation, and payment.',
    },
    {
        id: 'group',
        title: 'Group Registration',
        copy: 'For colleges, chapters, or institutions coordinating multiple delegates under one group coordinator.',
    },
];

const sponsorDraftKey = 'ipa-nsc-2026-sponsor-draft-token';

const premiumSponsorOptions = [
    { id: 'diamond', label: 'Diamond Sponsor', amount: 300000 },
    { id: 'platinum', label: 'Platinum Sponsor', amount: 200000 },
    { id: 'gold', label: 'Gold Sponsor', amount: 100000 },
    { id: 'silver', label: 'Silver Sponsor', amount: 50000 },
    { id: 'bronze', label: 'Bronze Sponsor', amount: 25000 },
];

const standaloneSponsorOptions = [
    { id: 'exhibition-space', label: 'Exhibition Space (3 m x 2 m)', amount: 25000 },
    { id: 'conference-bag', label: 'Conference Bag', amount: 200000 },
    { id: 'writing-kit', label: 'Writing Pads & Ball Pens', amount: 25000 },
    { id: 'breakfast', label: 'Breakfast', amount: 100000 },
    { id: 'high-tea', label: 'High Tea', amount: 50000 },
    { id: 'lunch', label: 'Lunch', amount: 200000 },
    { id: 'gala-dinner', label: 'Gala Dinner', amount: 300000 },
    { id: 'session', label: 'Scientific / Career Leadership / Workshop Session', amount: 25000, perUnit: true },
    { id: 'cultural-event', label: 'Cultural Event (academic institutions only)', amount: 10000, perUnit: true },
];

const souvenirAdvertisementOptions = [
    { id: 'outer-back-cover', label: 'Outer Back Cover (colour)', amount: 50000 },
    { id: 'inside-front-cover', label: 'Inside Front Cover (colour)', amount: 50000 },
    { id: 'inside-back-cover', label: 'Inside Back Cover (colour)', amount: 40000 },
    { id: 'full-page', label: 'Full Page (colour)', amount: 25000 },
    { id: 'half-page', label: 'Half Page', amount: 15000 },
    { id: 'best-compliments-insert', label: 'Best Compliments Insert', amount: 5000 },
];

const initialSponsorApplication = {
    organizationName: '',
    correspondenceAddress: '',
    authorizedPersonName: '',
    authorizedPersonDesignation: '',
    authorizedPersonMobile: '',
    email: '',
    premiumPackage: '',
    standaloneItems: [],
    standaloneQuantities: {},
    otherSponsorshipDescription: '',
    souvenirAdvertisement: '',
    paymentMethod: '',
    amountPaid: '',
    transactionReference: '',
    transactionDate: '',
    paymentProofName: '',
    paymentProofType: '',
    paymentProofSize: 0,
    remarks: '',
    declarationAccepted: false,
    applicationNumber: '',
    submittedAt: '',
};

const sponsorTabs = [
    { id: 'organization', label: 'Organization' },
    { id: 'sponsorship', label: 'Sponsorship' },
    { id: 'advertisement', label: 'Souvenir Ad' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
    { id: 'confirmation', label: 'Confirmation' },
];

function formatInr(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
}

const adminThemeKey = 'ipa-nsc-2026-admin-theme';

const permissionGroups = [
    {
        title: 'Registration',
        permissions: ['registration.view', 'registration.update', 'registration.export', 'payment.verify'],
    },
    {
        title: 'Programs',
        permissions: ['program.view', 'program.create', 'program.update', 'program.delete'],
    },
    {
        title: 'Results',
        permissions: ['winner.view', 'winner.create', 'winner.publish'],
    },
    {
        title: 'Reports',
        permissions: ['report.view', 'report.export'],
    },
    {
        title: 'Administration',
        permissions: ['user.view', 'user.create', 'user.update', 'role.manage', 'audit.view'],
    },
];

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/14th/g, 'fourteenth')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function Reveal({ children, className = '', delay = 0 }) {
    return (
        <div className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>
            {children}
        </div>
    );
}

function useRevealOnScroll() {
    useEffect(() => {
        const elements = document.querySelectorAll('.reveal');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);
}

function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <a href="/" className="group flex shrink-0 items-center gap-3">
                    <img
                        src="/logo-300x246.png"
                        alt="IPA logo"
                        className="h-12 w-auto object-contain sm:h-14"
                    />
                    <span className="flex size-11 items-center justify-center rounded-lg bg-emerald-700 text-sm font-bold text-white transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                        14
                    </span>
                    <span>
                        <span className="block text-sm font-semibold uppercase text-emerald-800">14th NSC</span>
                        <span className="block text-xs text-zinc-500">IPA Kerala | IPASF</span>
                    </span>
                </a>

                <nav className="hidden items-center gap-1 text-sm font-medium text-zinc-700 xl:flex">
                    {siteMap.map((section) => (
                        <div key={section.title} className="group relative">
                            <a
                                className="nav-link block rounded-lg px-3 py-2 hover:text-emerald-700"
                                href={`/#${slugify(section.title)}`}
                            >
                                {section.title}
                            </a>
                            <div className="pointer-events-none absolute left-0 top-full w-72 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                                <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-2xl">
                                    {section.pages.map((page) => (
                                        <a
                                            key={page}
                                            className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800"
                                            href={`/#${slugify(page)}`}
                                        >
                                            {page}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <a href="/registration" className="button-pop rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-800">
                        Register
                    </a>
                    <details className="relative xl:hidden">
                        <summary className="list-none rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-800 marker:hidden">
                            Menu
                        </summary>
                        <div className="absolute right-0 top-full mt-3 max-h-[78vh] w-[min(88vw,420px)] overflow-auto rounded-lg border border-zinc-200 bg-white p-3 shadow-2xl">
                            {siteMap.map((section) => (
                                <div key={section.title} className="border-b border-zinc-100 py-3 last:border-0">
                                    <a href={`/#${slugify(section.title)}`} className="block px-2 text-sm font-bold text-emerald-800">
                                        {section.title}
                                    </a>
                                    <div className="mt-2 grid gap-1">
                                        {section.pages.map((page) => (
                                            <a
                                                key={page}
                                                href={`/#${slugify(page)}`}
                                                className="rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
                                            >
                                                {page}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section id="home" className="relative overflow-hidden bg-zinc-950 text-white">
            <img
                src="/images/nsc-kerala-hero.png"
                alt="Students and delegates at a Kerala conference venue"
                className="hero-image absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-zinc-950/55" />
            <div className="hero-sheen absolute inset-0" />
            <div className="relative mx-auto grid min-h-[680px] max-w-7xl content-end gap-8 px-4 pb-14 pt-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-20">
                <div className="hero-copy max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/25">
                        <span className="pulse-dot size-2 rounded-full bg-amber-300" />
                        National Student Convention web portal
                    </div>
                    <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                        14th National Student Convention
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100 sm:text-lg">
                        A focused event portal for registrations, scientific sessions, abstract submissions, speaker updates,
                        competitions, venue guidance, and Kerala showcase content.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href="/registration" className="button-pop rounded-lg bg-amber-400 px-5 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-amber-300">
                            Start Registration
                        </a>
                        <a href="#fourteenth-nsc-brochures" className="button-pop rounded-lg bg-white/12 px-5 py-3 text-center text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-white/20">
                            14th NSC Brochures
                        </a>
                    </div>
                </div>

                <aside id="news-and-updates" className="hero-panel self-end rounded-lg bg-white p-5 text-zinc-950 shadow-2xl">
                    <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                        <h2 className="text-base font-bold">Latest Updates</h2>
                        <span className="live-badge rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Live</span>
                    </div>
                    <div className="mt-4 space-y-4">
                        {updates.map(([title, copy]) => (
                            <div key={title} className="update-row rounded-lg p-2 transition duration-300 hover:bg-zinc-50">
                                <p className="text-sm font-semibold text-zinc-900">{title}</p>
                                <p className="mt-1 text-sm text-zinc-600">{copy}</p>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </section>
    );
}

function QuickFacts() {
    return (
        <section id="important-dates" className="relative isolate overflow-hidden py-14">
            <img
                src="/images/nsc-kerala-hero.png"
                alt=""
                className="absolute inset-0 -z-30 h-full w-full scale-105 object-cover blur-[2px]"
                aria-hidden="true"
            />
            <div className="absolute inset-0 -z-20 bg-gradient-to-r from-amber-400/90 via-yellow-300/76 to-emerald-900/58" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/20 via-transparent to-zinc-950/18" />
            <div className="snapshot-flow-lines absolute inset-0 -z-10" aria-hidden="true">
                <span className="snapshot-flow-line top-[8%]" />
                <span className="snapshot-flow-line top-[24%] animation-delay-700" />
                <span className="snapshot-flow-line top-[42%] animation-delay-1200" />
                <span className="snapshot-flow-line top-[62%] animation-delay-1800" />
                <span className="snapshot-flow-line top-[80%] animation-delay-2400" />
            </div>
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 max-w-3xl">
                    <p className="text-sm font-bold uppercase text-emerald-950">Event Snapshot</p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
                        Date, venue, and host details
                    </h2>
                    <p className="mt-3 text-base font-medium leading-7 text-zinc-800">
                        Key information will be updated here as the 14th NSC schedule and venue plan are finalized.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {quickFacts.map(([label, value, copy]) => (
                        <div
                            key={label}
                            className="interactive-card rounded-lg border border-white/70 bg-white/94 p-5 shadow-2xl backdrop-blur-md"
                        >
                            <p className="text-sm font-bold uppercase text-emerald-700">{label}</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p>
                            <p className="mt-2 text-sm leading-6 text-zinc-600">{copy}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HomeWelcome() {
    return (
        <section id="home-welcome" className="bg-white py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
                <div>
                    <p className="text-sm font-bold uppercase text-emerald-700">Welcome Message</p>
                    <h2 className="mt-3 text-3xl font-bold text-zinc-950 sm:text-4xl">Welcome to the 14th National Students Congress (NSC)</h2>
                    <div className="mt-4 space-y-4 text-base leading-7 text-zinc-600">
                        <p>
                            Welcome to the official web portal of the 14th National Students Congress (NSC). This premier annual event is proudly hosted by the Indian Pharmaceutical Association (IPA) Kerala State Branch, alongside the IPA Students&apos; Forum (IPASF). This year, we gather under the theme of innovation and academic excellence. We welcome pharmacy students, respected educators, and industry experts from across the country to connect, learn, and grow together.
                        </p>
                        <p>
                            This year&apos;s congress features a dynamic scientific program, competitive student events, expert speakers, and valuable placement drives. The 14th NSC offers a unique space to showcase your research, test your skills, and build lifelong networks. We invite you to explore our sessions, submit your abstracts, and join us in making this event an outstanding success.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-zinc-700">
                        <span className="rounded-full bg-zinc-100 px-4 py-2">IPA Kerala</span>
                        <span className="rounded-full bg-zinc-100 px-4 py-2">14th NSC 2026</span>
                    </div>
                </div>
                <div className="grid items-center gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="aspect-[1586/992] overflow-hidden rounded-lg bg-zinc-100 shadow-2xl ring-1 ring-zinc-200">
                        <img
                            src="/images/nsc-welcome-delegates.png"
                            alt="Delegates and students at the National Student Convention venue"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function RegistrationPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState(initialRegistration);
    const [savedSections, setSavedSections] = useState({});
    const [notice, setNotice] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const draftToken = window.localStorage.getItem(registrationDraftKey);
        if (!draftToken) {
            return;
        }

        apiRequest(`registrations/draft?token=${encodeURIComponent(draftToken)}`)
            .then(({ registration }) => {
                setFormData({ ...initialRegistration, ...registration });
                setNotice('Your saved draft was loaded.');
            })
            .catch(() => {
                window.localStorage.removeItem(registrationDraftKey);
            });
    }, []);

    const totals = useMemo(() => {
        const registrationFee = categoryFees[formData.category] || 0;
        const competitionFee = formData.studentCompetitions.length * 100;
        const workshopFee = workshopFees[formData.preConferenceWorkshop] || 0;

        return {
            registrationFee,
            competitionFee,
            workshopFee,
            total: registrationFee + competitionFee + workshopFee,
        };
    }, [formData.category, formData.preConferenceWorkshop, formData.studentCompetitions.length]);

    function updateField(name, value) {
        setFormData((current) => ({ ...current, [name]: value }));
        setNotice('');
    }

    async function saveSection(sectionId) {
        setIsSaving(true);
        setNotice('Saving...');

        try {
            const { registration } = await apiRequest('registrations/draft', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            setFormData((current) => ({ ...current, ...registration }));
            window.localStorage.setItem(registrationDraftKey, registration.draftToken);
            setSavedSections((current) => ({ ...current, [sectionId]: true }));
            setNotice('Section saved to the database.');
        } catch (error) {
            setNotice(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    function toggleCompetition(option) {
        setFormData((current) => {
            const hasOption = current.studentCompetitions.includes(option);
            const nextCompetitions = hasOption
                ? current.studentCompetitions.filter((item) => item !== option)
                : current.studentCompetitions.length < 2
                    ? [...current.studentCompetitions, option]
                    : current.studentCompetitions;

            return { ...current, studentCompetitions: nextCompetitions };
        });
        setNotice('');
    }

    function goNext() {
        const currentIndex = registrationTabs.findIndex((tab) => tab.id === activeTab);
        const nextTab = registrationTabs[Math.min(currentIndex + 1, registrationTabs.length - 1)];
        setActiveTab(nextTab.id);
    }

    function goBack() {
        const currentIndex = registrationTabs.findIndex((tab) => tab.id === activeTab);
        const previousTab = registrationTabs[Math.max(currentIndex - 1, 0)];
        setActiveTab(previousTab.id);
    }

    async function submitRegistration() {
        setIsSaving(true);
        setNotice('Submitting...');

        try {
            const { registration } = await apiRequest('registrations/submit', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            setFormData((current) => ({ ...current, ...registration }));
            window.localStorage.setItem(registrationDraftKey, registration.draftToken);
            setSavedSections((current) => ({ ...current, payment: true, review: true, confirmation: true }));
            setActiveTab('confirmation');
            setNotice('Registration submitted to the database.');
        } catch (error) {
            setNotice(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    function submitAnotherResponse() {
        window.localStorage.removeItem(registrationDraftKey);
        setFormData(initialRegistration);
        setSavedSections({});
        setNotice('');
        setActiveTab('general');
    }

    const fieldClass =
        'mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100';
    const labelClass = 'text-sm font-semibold text-zinc-800';
    const sectionSaved = savedSections[activeTab];
    const isGroupRegistration = formData.registrationMode === 'group';

    return (
        <>
            <section className="relative overflow-hidden bg-zinc-950 text-white">
                <img
                    src="/images/nsc-kerala-hero.png"
                    alt="Delegates at the 14th IPA NSC registration venue"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-950/65" />
                <div className="relative mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 lg:px-8">
                    <p className="text-sm font-bold uppercase text-amber-300">Registration</p>
                    <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
                        14th IPA NSC 2026 early bird registration
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100">
                        Complete each section tab by tab. Save your general details, competitions, workshops,
                        presentation choice, payment details, and final confirmation in one guided flow.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                        <span className="rounded-lg bg-white/12 px-3 py-2 ring-1 ring-white/20">Section-wise save</span>
                        <span className="rounded-lg bg-white/12 px-3 py-2 ring-1 ring-white/20">PostgreSQL ready</span>
                        <span className="rounded-lg bg-white/12 px-3 py-2 ring-1 ring-white/20">Early bird flow</span>
                    </div>
                </div>
            </section>

            <section id="registration" className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase text-emerald-700">Registration Type</p>
                            <h2 className="mt-2 text-2xl font-bold text-zinc-950">Choose how you want to register.</h2>
                        </div>
                        <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-1">
                            {registrationModes.map((mode) => {
                                const selected = formData.registrationMode === mode.id;

                                return (
                                    <button
                                        key={mode.id}
                                        type="button"
                                        onClick={() => {
                                            updateField('registrationMode', mode.id);
                                            setActiveTab('general');
                                        }}
                                        className={`rounded-md px-4 py-2.5 text-sm font-bold transition sm:min-w-40 ${
                                            selected
                                                ? 'bg-emerald-800 text-white shadow-sm'
                                                : 'text-zinc-700 hover:bg-white hover:text-emerald-800'
                                        }`}
                                    >
                                        {mode.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                        <div className="grid gap-2">
                            {registrationTabs.map((tab, index) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                                        activeTab === tab.id
                                            ? 'bg-emerald-800 text-white shadow-sm'
                                            : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-emerald-50 hover:text-emerald-800'
                                    }`}
                                >
                                    <span>{index + 1}. {tab.label}</span>
                                    {savedSections[tab.id] && <span className="text-xs">Saved</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-2 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase text-rose-700">Step</p>
                                <h3 className="mt-1 text-xl font-bold">
                                    {registrationTabs.find((tab) => tab.id === activeTab)?.label}
                                </h3>
                            </div>
                            <div className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-800">
                                Total: Rs. {totals.total}
                            </div>
                        </div>

                        {activeTab === 'general' && !isGroupRegistration && (
                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <label className={labelClass}>
                                    Name of Participant
                                    <input
                                        className={fieldClass}
                                        value={formData.participantName}
                                        onChange={(event) => updateField('participantName', event.target.value.toUpperCase())}
                                        placeholder="Dr. ANJALI MENON"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Select Category
                                    <select
                                        className={fieldClass}
                                        value={formData.category}
                                        onChange={(event) => updateField('category', event.target.value)}
                                    >
                                        <option value="">Choose category</option>
                                        {categoryOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className={labelClass}>
                                    State of Residence
                                    <input
                                        className={fieldClass}
                                        value={formData.stateOfResidence}
                                        onChange={(event) => updateField('stateOfResidence', event.target.value)}
                                        placeholder="Kerala"
                                    />
                                </label>
                                <label className={labelClass}>
                                    WhatsApp Number
                                    <input
                                        className={fieldClass}
                                        value={formData.whatsappNumber}
                                        onChange={(event) => updateField('whatsappNumber', event.target.value)}
                                        placeholder="+91 9876543210"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Email ID
                                    <input
                                        className={fieldClass}
                                        type="email"
                                        value={formData.email}
                                        onChange={(event) => updateField('email', event.target.value.toLowerCase())}
                                        placeholder="participant@example.com"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Food Preference
                                    <select
                                        className={fieldClass}
                                        value={formData.foodPreference}
                                        onChange={(event) => updateField('foodPreference', event.target.value)}
                                    >
                                        <option value="">Choose preference</option>
                                        <option value="Veg">Veg</option>
                                        <option value="Non Veg">Non Veg</option>
                                    </select>
                                </label>
                            </div>
                        )}

                        {activeTab === 'general' && isGroupRegistration && (
                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <label className={`${labelClass} md:col-span-2`}>
                                    Institution / College Name
                                    <input
                                        className={fieldClass}
                                        value={formData.institutionName}
                                        onChange={(event) => updateField('institutionName', event.target.value)}
                                        placeholder="ABC College of Pharmacy, Kerala"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Group Coordinator Name
                                    <input
                                        className={fieldClass}
                                        value={formData.groupCoordinatorName}
                                        onChange={(event) => updateField('groupCoordinatorName', event.target.value.toUpperCase())}
                                        placeholder="Dr. ANJALI MENON"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Coordinator WhatsApp Number
                                    <input
                                        className={fieldClass}
                                        value={formData.groupCoordinatorWhatsapp}
                                        onChange={(event) => updateField('groupCoordinatorWhatsapp', event.target.value)}
                                        placeholder="+91 9876543210"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Coordinator Email ID
                                    <input
                                        className={fieldClass}
                                        type="email"
                                        value={formData.groupCoordinatorEmail}
                                        onChange={(event) => updateField('groupCoordinatorEmail', event.target.value.toLowerCase())}
                                        placeholder="coordinator@example.com"
                                    />
                                </label>
                                <label className={labelClass}>
                                    State
                                    <input
                                        className={fieldClass}
                                        value={formData.stateOfResidence}
                                        onChange={(event) => updateField('stateOfResidence', event.target.value)}
                                        placeholder="Kerala"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Expected Number of Participants
                                    <input
                                        className={fieldClass}
                                        type="number"
                                        min="2"
                                        value={formData.expectedParticipants}
                                        onChange={(event) => updateField('expectedParticipants', event.target.value)}
                                        placeholder="25"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Primary Delegate Category
                                    <select
                                        className={fieldClass}
                                        value={formData.category}
                                        onChange={(event) => updateField('category', event.target.value)}
                                    >
                                        <option value="">Choose category</option>
                                        {categoryOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </label>
                                <div className="rounded-lg bg-amber-50 p-4 text-sm leading-6 text-zinc-700 md:col-span-2">
                                    A detailed participant sheet upload/import can be connected here when the backend is ready.
                                    The coordinator can continue with workshop, presentation, and payment information for the group request.
                                </div>
                            </div>
                        )}

                        {activeTab === 'competitions' && (
                            <div className="mt-6 grid gap-6">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className={labelClass}>
                                        Course of Study
                                        <select
                                            className={fieldClass}
                                            value={formData.courseOfStudy}
                                            onChange={(event) => updateField('courseOfStudy', event.target.value)}
                                        >
                                            <option value="B.Pharm">B.Pharm</option>
                                        </select>
                                    </label>
                                    <label className={labelClass}>
                                        Name of College with State
                                        <input
                                            className={fieldClass}
                                            value={formData.collegeWithState}
                                            onChange={(event) => updateField('collegeWithState', event.target.value)}
                                            placeholder="ABC College of Pharmacy, Kerala"
                                        />
                                    </label>
                                </div>
                                <div>
                                    <p className={labelClass}>Student Competitions</p>
                                    <p className="mt-1 text-sm text-zinc-500">Select maximum 2 events. Rs. 100 will be added per event.</p>
                                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                                        {competitionOptions.map((option) => {
                                            const checked = formData.studentCompetitions.includes(option);
                                            const disabled = !checked && formData.studentCompetitions.length >= 2;

                                            return (
                                                <label
                                                    key={option}
                                                    className={`rounded-lg border p-3 text-sm font-semibold ${
                                                        checked
                                                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                                            : disabled
                                                                ? 'border-zinc-200 bg-zinc-100 text-zinc-400'
                                                                : 'border-zinc-200 bg-white text-zinc-700'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        checked={checked}
                                                        disabled={disabled}
                                                        onChange={() => toggleCompetition(option)}
                                                    />
                                                    {option}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                <label className={labelClass}>
                                    Competition Fee Acknowledgement
                                    <select
                                        className={fieldClass}
                                        value={formData.competitionFeeAcknowledged}
                                        onChange={(event) => updateField('competitionFeeAcknowledged', event.target.value)}
                                    >
                                        <option value="">Choose</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </label>
                            </div>
                        )}

                        {activeTab === 'workshop' && (
                            <div className="mt-6 grid gap-6">
                                <div>
                                    <p className={labelClass}>Pre-Conference Workshop Area</p>
                                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                                        {workshopOptions.map((option) => (
                                            <label
                                                key={option}
                                                className={`rounded-lg border p-4 text-sm font-bold ${
                                                    formData.preConferenceWorkshop === option
                                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                                        : 'border-zinc-200 bg-white text-zinc-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="preConferenceWorkshop"
                                                    className="mr-2"
                                                    checked={formData.preConferenceWorkshop === option}
                                                    onChange={() => updateField('preConferenceWorkshop', option)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <label className={labelClass}>
                                    Workshop Fee Acknowledgement
                                    <select
                                        className={fieldClass}
                                        value={formData.workshopFeeAcknowledged}
                                        onChange={(event) => updateField('workshopFeeAcknowledged', event.target.value)}
                                    >
                                        <option value="">Choose</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </label>
                            </div>
                        )}

                        {activeTab === 'presentation' && (
                            <div className="mt-6">
                                <p className={labelClass}>Presentation Type</p>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    {['Oral Presentation', 'Poster Presentation'].map((option) => (
                                        <label
                                            key={option}
                                            className={`rounded-lg border p-4 text-sm font-bold ${
                                                formData.presentationType === option
                                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                                    : 'border-zinc-200 bg-white text-zinc-700'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="presentationType"
                                                className="mr-2"
                                                checked={formData.presentationType === option}
                                                onChange={() => updateField('presentationType', option)}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <label className={labelClass}>
                                    Pay Fee
                                    <input className={`${fieldClass} bg-zinc-100 font-bold`} value={`Rs. ${totals.total}`} readOnly />
                                </label>
                                <label className={labelClass}>
                                    Transaction Details
                                    <input
                                        className={fieldClass}
                                        value={formData.transactionDetails}
                                        onChange={(event) => updateField('transactionDetails', event.target.value)}
                                        placeholder="Gateway transaction ID or manual reference"
                                    />
                                </label>
                                <div className="rounded-lg bg-amber-50 p-4 text-sm leading-6 text-zinc-700 md:col-span-2">
                                    Payment gateway integration will replace manual transaction entry. PostgreSQL should store the
                                    verified gateway transaction ID, amount, status, and response payload.
                                </div>
                            </div>
                        )}

                        {activeTab === 'review' && (
                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                {(isGroupRegistration
                                    ? [
                                        ['Registration Type', 'Group Registration'],
                                        ['Institution', formData.institutionName || 'Not entered'],
                                        ['Coordinator', formData.groupCoordinatorName || 'Not entered'],
                                        ['Coordinator Email', formData.groupCoordinatorEmail || 'Not entered'],
                                        ['Coordinator WhatsApp', formData.groupCoordinatorWhatsapp || 'Not entered'],
                                        ['State', formData.stateOfResidence || 'Not entered'],
                                        ['Expected Participants', formData.expectedParticipants || 'Not entered'],
                                        ['Primary Category', formData.category || 'Not selected'],
                                        ['College Detail', formData.collegeWithState || 'Not entered'],
                                        ['Competitions', formData.studentCompetitions.join(', ') || 'None'],
                                        ['Workshop', formData.preConferenceWorkshop || 'Not selected'],
                                        ['Presentation', formData.presentationType || 'Not selected'],
                                        ['Registration Fee', `Rs. ${totals.registrationFee}`],
                                        ['Competition Fee', `Rs. ${totals.competitionFee}`],
                                        ['Workshop Fee', `Rs. ${totals.workshopFee}`],
                                        ['Total Payable', `Rs. ${totals.total}`],
                                    ]
                                    : [
                                        ['Registration Type', 'Individual Registration'],
                                        ['Participant', formData.participantName || 'Not entered'],
                                        ['Category', formData.category || 'Not selected'],
                                        ['Email', formData.email || 'Not entered'],
                                        ['WhatsApp', formData.whatsappNumber || 'Not entered'],
                                        ['College', formData.collegeWithState || 'Not entered'],
                                        ['Competitions', formData.studentCompetitions.join(', ') || 'None'],
                                        ['Workshop', formData.preConferenceWorkshop || 'Not selected'],
                                        ['Presentation', formData.presentationType || 'Not selected'],
                                        ['Registration Fee', `Rs. ${totals.registrationFee}`],
                                        ['Competition Fee', `Rs. ${totals.competitionFee}`],
                                        ['Workshop Fee', `Rs. ${totals.workshopFee}`],
                                        ['Total Payable', `Rs. ${totals.total}`],
                                    ]
                                ).map(([label, value]) => (
                                    <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                        <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
                                        <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'confirmation' && (
                            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                                <p className="text-sm font-bold uppercase text-emerald-700">
                                    14th IPA NSC 2026 - {isGroupRegistration ? 'Group Registration' : 'Early Bird Registration'}
                                </p>
                                <h3 className="mt-3 text-2xl font-bold text-emerald-950">Your response has been recorded.</h3>
                                <p className="mt-3 text-sm leading-6 text-emerald-900">
                                    Registration number: <span className="font-bold">{formData.registrationNumber || 'Generated after submit'}</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={submitAnotherResponse}
                                    className="mt-5 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-900"
                                >
                                    Submit another response
                                </button>
                            </div>
                        )}

                        <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-h-6 text-sm font-semibold text-emerald-700">
                                {sectionSaved ? 'This section is saved.' : notice}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                                >
                                    Back
                                </button>
                                {activeTab !== 'confirmation' && (
                                    <button
                                        type="button"
                                        onClick={() => saveSection(activeTab)}
                                        disabled={isSaving}
                                        className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Section'}
                                    </button>
                                )}
                                {activeTab === 'review' ? (
                                    <button
                                        type="button"
                                        onClick={submitRegistration}
                                        disabled={isSaving}
                                        className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-bold text-white hover:bg-rose-800"
                                    >
                                        {isSaving ? 'Submitting...' : 'Submit Registration'}
                                    </button>
                                ) : activeTab !== 'confirmation' && (
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-900"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}

function SponsorRegistrationPage() {
    const [activeTab, setActiveTab] = useState('organization');
    const [formData, setFormData] = useState(initialSponsorApplication);
    const [savedSections, setSavedSections] = useState({});
    const [notice, setNotice] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const draftToken = window.localStorage.getItem(sponsorDraftKey);
        if (!draftToken) {
            return;
        }

        apiRequest(`sponsors/draft?token=${encodeURIComponent(draftToken)}`)
            .then(({ sponsor }) => {
                setFormData({ ...initialSponsorApplication, ...sponsor });
                setNotice('Your saved sponsor application was loaded.');
            })
            .catch(() => window.localStorage.removeItem(sponsorDraftKey));
    }, []);

    const totals = useMemo(() => {
        const premium = premiumSponsorOptions.find((option) => option.id === formData.premiumPackage)?.amount || 0;
        const standalone = formData.standaloneItems.reduce((sum, id) => {
            const option = standaloneSponsorOptions.find((item) => item.id === id);
            const quantity = option?.perUnit ? Math.max(Number(formData.standaloneQuantities[id]) || 1, 1) : 1;
            return sum + (option?.amount || 0) * quantity;
        }, 0);
        const advertisement =
            souvenirAdvertisementOptions.find((option) => option.id === formData.souvenirAdvertisement)?.amount || 0;

        return { premium, standalone, advertisement, total: premium + standalone + advertisement };
    }, [
        formData.premiumPackage,
        formData.souvenirAdvertisement,
        formData.standaloneItems,
        formData.standaloneQuantities,
    ]);

    function updateField(name, value) {
        setFormData((current) => ({ ...current, [name]: value }));
        setNotice('');
    }

    function toggleStandaloneItem(id) {
        setFormData((current) => ({
            ...current,
            standaloneItems: current.standaloneItems.includes(id)
                ? current.standaloneItems.filter((item) => item !== id)
                : [...current.standaloneItems, id],
        }));
        setNotice('');
    }

    function validateSection(sectionId) {
        if (sectionId === 'organization') {
            if (
                !formData.organizationName.trim() ||
                !formData.correspondenceAddress.trim() ||
                !formData.authorizedPersonName.trim() ||
                !formData.authorizedPersonDesignation.trim() ||
                !formData.authorizedPersonMobile.trim() ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
            ) {
                return 'Complete all organization and authorized contact fields with a valid email.';
            }
        }

        if (
            sectionId === 'sponsorship' &&
            !formData.premiumPackage &&
            formData.standaloneItems.length === 0 &&
            !formData.otherSponsorshipDescription.trim()
        ) {
            return 'Select a premium package, at least one standalone item, or describe another sponsorship request.';
        }

        if (sectionId === 'payment') {
            if (!formData.paymentMethod) {
                return 'Select account transfer or UPI/QR as the payment method.';
            }
            if (!formData.transactionReference.trim() || !formData.transactionDate) {
                return 'Enter the transaction reference and transaction date.';
            }
            if (!formData.amountPaid || Number(formData.amountPaid) <= 0) {
                return 'Enter a valid amount paid.';
            }
            if (!formData.paymentProofName) {
                return 'Select one transaction receipt or screenshot.';
            }
        }

        if (sectionId === 'review' && !formData.declarationAccepted) {
            return 'Accept the final declaration before submitting.';
        }

        return '';
    }

    async function saveSection(sectionId) {
        const error = validateSection(sectionId);
        if (error) {
            setNotice(error);
            return false;
        }

        setIsSaving(true);
        setNotice('Saving...');
        try {
            const { sponsor } = await apiRequest('sponsors/draft', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            setFormData((current) => ({ ...current, ...sponsor }));
            window.localStorage.setItem(sponsorDraftKey, sponsor.draftToken);
            setSavedSections((current) => ({ ...current, [sectionId]: true }));
            setNotice('Section saved to the database.');
            return true;
        } catch (errorMessage) {
            setNotice(errorMessage.message);
            return false;
        } finally {
            setIsSaving(false);
        }
    }

    async function goNext() {
        if (!(await saveSection(activeTab))) {
            return;
        }
        const currentIndex = sponsorTabs.findIndex((tab) => tab.id === activeTab);
        setActiveTab(sponsorTabs[Math.min(currentIndex + 1, sponsorTabs.length - 1)].id);
    }

    function goBack() {
        const currentIndex = sponsorTabs.findIndex((tab) => tab.id === activeTab);
        setActiveTab(sponsorTabs[Math.max(currentIndex - 1, 0)].id);
    }

    async function submitSponsorApplication() {
        const error = validateSection('review');
        if (error) {
            setNotice(error);
            return;
        }

        setIsSaving(true);
        setNotice('Submitting...');
        try {
            const { sponsor } = await apiRequest('sponsors/submit', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            setFormData((current) => ({ ...current, ...sponsor }));
            window.localStorage.setItem(sponsorDraftKey, sponsor.draftToken);
            setSavedSections((current) => ({ ...current, review: true, confirmation: true }));
            setActiveTab('confirmation');
            setNotice('Sponsor application submitted.');
        } catch (errorMessage) {
            setNotice(errorMessage.message);
        } finally {
            setIsSaving(false);
        }
    }

    function handlePaymentProof(file) {
        if (!file) {
            updateField('paymentProofName', '');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setNotice('Payment proof must be 10 MB or smaller.');
            return;
        }
        if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) {
            setNotice('Upload a JPG, PNG, WebP, or PDF file.');
            return;
        }
        setFormData((current) => ({
            ...current,
            paymentProofName: file.name,
            paymentProofType: file.type,
            paymentProofSize: file.size,
        }));
        setNotice('Payment proof selected. File storage can be connected to object storage.');
    }

    function submitAnotherResponse() {
        window.localStorage.removeItem(sponsorDraftKey);
        setFormData(initialSponsorApplication);
        setSavedSections({});
        setNotice('');
        setActiveTab('organization');
    }

    const fieldClass =
        'mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100';
    const labelClass = 'text-sm font-semibold text-zinc-800';

    return (
        <>
            <section className="relative overflow-hidden bg-zinc-950 text-white">
                <img
                    src="/images/nsc-sponsor-exhibition.png"
                    alt="Pharmacy event sponsor exhibition"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-950/75" />
                <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 lg:px-8">
                    <p className="text-sm font-bold uppercase text-amber-300">Become a Sponsor</p>
                    <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
                        Partner with the 14th IPA National Students&apos; Congress 2026
                    </h1>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-100">
                        Choose premium packages, standalone opportunities, and e-Souvenir advertising, then submit
                        your organization and payment details in one guided application.
                    </p>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                        <aside className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                            <div className="grid gap-2">
                                {sponsorTabs.map((tab, index) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                                            activeTab === tab.id
                                                ? 'bg-emerald-800 text-white shadow-sm'
                                                : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-emerald-50 hover:text-emerald-800'
                                        }`}
                                    >
                                        <span>{index + 1}. {tab.label}</span>
                                        {savedSections[tab.id] && <span className="text-xs">Saved</span>}
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-2 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase text-rose-700">Sponsor Application</p>
                                    <h2 className="mt-1 text-xl font-bold">
                                        {sponsorTabs.find((tab) => tab.id === activeTab)?.label}
                                    </h2>
                                </div>
                                <div className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-800">
                                    Total: {formatInr(totals.total)}
                                </div>
                            </div>

                            {activeTab === 'organization' && (
                                <div className="mt-6 grid gap-5 md:grid-cols-2">
                                    <label className={`${labelClass} md:col-span-2`}>
                                        Name of Organization
                                        <input
                                            className={fieldClass}
                                            value={formData.organizationName}
                                            onChange={(event) => updateField('organizationName', event.target.value.toUpperCase())}
                                            placeholder="ABC PHARMACEUTICALS PRIVATE LIMITED"
                                        />
                                    </label>
                                    <label className={`${labelClass} md:col-span-2`}>
                                        Address for Correspondence
                                        <textarea
                                            className={`${fieldClass} min-h-28`}
                                            value={formData.correspondenceAddress}
                                            onChange={(event) => updateField('correspondenceAddress', event.target.value)}
                                            placeholder="Full postal address"
                                        />
                                    </label>
                                    <label className={labelClass}>
                                        Authorized Person Name
                                        <input
                                            className={fieldClass}
                                            value={formData.authorizedPersonName}
                                            onChange={(event) => updateField('authorizedPersonName', event.target.value)}
                                            placeholder="Dr. Anil Kumar"
                                        />
                                    </label>
                                    <label className={labelClass}>
                                        Designation
                                        <input
                                            className={fieldClass}
                                            value={formData.authorizedPersonDesignation}
                                            onChange={(event) => updateField('authorizedPersonDesignation', event.target.value)}
                                            placeholder="Director - Corporate Affairs"
                                        />
                                    </label>
                                    <label className={labelClass}>
                                        Mobile Number
                                        <input
                                            className={fieldClass}
                                            value={formData.authorizedPersonMobile}
                                            onChange={(event) => updateField('authorizedPersonMobile', event.target.value)}
                                            placeholder="+91 9876543210"
                                        />
                                    </label>
                                    <label className={labelClass}>
                                        Email
                                        <input
                                            className={fieldClass}
                                            type="email"
                                            value={formData.email}
                                            onChange={(event) => updateField('email', event.target.value.toLowerCase())}
                                            placeholder="sponsor@example.com"
                                        />
                                    </label>
                                </div>
                            )}

                            {activeTab === 'sponsorship' && (
                                <div className="mt-6 grid gap-8">
                                    <div>
                                        <h3 className="font-bold text-zinc-950">Premium Sponsorship</h3>
                                        <p className="mt-1 text-sm text-zinc-500">Choose up to one premium package.</p>
                                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                                            {premiumSponsorOptions.map((option) => (
                                                <label
                                                    key={option.id}
                                                    className={`rounded-lg border p-4 ${
                                                        formData.premiumPackage === option.id
                                                            ? 'border-emerald-600 bg-emerald-50'
                                                            : 'border-zinc-200'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="premiumPackage"
                                                        className="mr-2"
                                                        checked={formData.premiumPackage === option.id}
                                                        onChange={() => updateField('premiumPackage', option.id)}
                                                    />
                                                    <span className="font-bold">{option.label}</span>
                                                    <span className="mt-1 block text-sm text-zinc-600">{formatInr(option.amount)}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {formData.premiumPackage && (
                                            <button
                                                type="button"
                                                onClick={() => updateField('premiumPackage', '')}
                                                className="mt-3 text-sm font-bold text-rose-700"
                                            >
                                                Clear premium package
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-zinc-950">À La Carte Sponsorship</h3>
                                        <p className="mt-1 text-sm text-zinc-500">Multiple items are allowed.</p>
                                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                                            {standaloneSponsorOptions.map((option) => {
                                                const checked = formData.standaloneItems.includes(option.id);
                                                return (
                                                    <div
                                                        key={option.id}
                                                        className={`rounded-lg border p-4 ${
                                                            checked ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-200'
                                                        }`}
                                                    >
                                                        <label className="text-sm font-bold">
                                                            <input
                                                                type="checkbox"
                                                                className="mr-2"
                                                                checked={checked}
                                                                onChange={() => toggleStandaloneItem(option.id)}
                                                            />
                                                            {option.label}
                                                        </label>
                                                        <p className="mt-1 text-sm text-zinc-600">
                                                            {formatInr(option.amount)}{option.perUnit ? ' per item' : ''}
                                                        </p>
                                                        {checked && option.perUnit && (
                                                            <label className="mt-3 block text-xs font-bold uppercase text-zinc-600">
                                                                Quantity
                                                                <input
                                                                    className={fieldClass}
                                                                    type="number"
                                                                    min="1"
                                                                    value={formData.standaloneQuantities[option.id] || 1}
                                                                    onChange={(event) =>
                                                                        updateField('standaloneQuantities', {
                                                                            ...formData.standaloneQuantities,
                                                                            [option.id]: event.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <label className={labelClass}>
                                        Other Sponsorship Request
                                        <textarea
                                            className={`${fieldClass} min-h-24`}
                                            value={formData.otherSponsorshipDescription}
                                            onChange={(event) => updateField('otherSponsorshipDescription', event.target.value)}
                                            placeholder="Describe any custom sponsorship requirement"
                                        />
                                    </label>
                                </div>
                            )}

                            {activeTab === 'advertisement' && (
                                <div className="mt-6">
                                    <h3 className="font-bold text-zinc-950">E-Souvenir Advertisement</h3>
                                    <p className="mt-1 text-sm text-zinc-500">Select one placement, or leave this section empty.</p>
                                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                                        {souvenirAdvertisementOptions.map((option) => (
                                            <label
                                                key={option.id}
                                                className={`rounded-lg border p-4 ${
                                                    formData.souvenirAdvertisement === option.id
                                                        ? 'border-emerald-600 bg-emerald-50'
                                                        : 'border-zinc-200'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="souvenirAdvertisement"
                                                    className="mr-2"
                                                    checked={formData.souvenirAdvertisement === option.id}
                                                    onChange={() => updateField('souvenirAdvertisement', option.id)}
                                                />
                                                <span className="font-bold">{option.label}</span>
                                                <span className="mt-1 block text-sm text-zinc-600">{formatInr(option.amount)}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {formData.souvenirAdvertisement && (
                                        <button
                                            type="button"
                                            onClick={() => updateField('souvenirAdvertisement', '')}
                                            className="mt-3 text-sm font-bold text-rose-700"
                                        >
                                            Clear advertisement selection
                                        </button>
                                    )}
                                </div>
                            )}

                            {activeTab === 'payment' && (
                                <div className="mt-6 grid gap-5 md:grid-cols-2">
                                    <div className="rounded-lg bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 md:col-span-2">
                                        <strong>PHARMA FIRST</strong><br />
                                        Current A/C: 31140200001427 | IFSC: BARB0MUVATT<br />
                                        Branch: Muvattupuzha | MICR: 686012252
                                    </div>
                                    <label className={labelClass}>
                                        Payment Method
                                        <select
                                            className={fieldClass}
                                            value={formData.paymentMethod}
                                            onChange={(event) => updateField('paymentMethod', event.target.value)}
                                        >
                                            <option value="">Choose payment method</option>
                                            <option value="account_transfer">Account Transfer</option>
                                            <option value="upi_qr">UPI / QR</option>
                                        </select>
                                    </label>
                                    <label className={labelClass}>
                                        Total Payable
                                        <input className={`${fieldClass} bg-zinc-100 font-bold`} value={formatInr(totals.total)} readOnly />
                                    </label>
                                    <label className={labelClass}>
                                        Amount Paid (INR)
                                        <input
                                            className={fieldClass}
                                            type="number"
                                            min="1"
                                            value={formData.amountPaid}
                                            onChange={(event) => updateField('amountPaid', event.target.value)}
                                        />
                                    </label>
                                    <label className={labelClass}>
                                        Transaction / UTR Reference
                                        <input
                                            className={fieldClass}
                                            value={formData.transactionReference}
                                            onChange={(event) => updateField('transactionReference', event.target.value)}
                                        />
                                    </label>
                                    <label className={labelClass}>
                                        Transaction Date
                                        <input
                                            className={fieldClass}
                                            type="date"
                                            max={new Date().toISOString().slice(0, 10)}
                                            value={formData.transactionDate}
                                            onChange={(event) => updateField('transactionDate', event.target.value)}
                                        />
                                    </label>
                                    <label className={labelClass}>
                                        Transaction Receipt / Screenshot
                                        <input
                                            className={fieldClass}
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                                            onChange={(event) => handlePaymentProof(event.target.files?.[0])}
                                        />
                                        <span className="mt-2 block text-xs font-normal text-zinc-500">
                                            One JPG, PNG, WebP, or PDF file. Maximum 10 MB.
                                        </span>
                                        {formData.paymentProofName && (
                                            <span className="mt-2 block text-xs font-bold text-emerald-700">
                                                Selected: {formData.paymentProofName}
                                            </span>
                                        )}
                                    </label>
                                    <label className={`${labelClass} md:col-span-2`}>
                                        Remarks or Requests
                                        <textarea
                                            className={`${fieldClass} min-h-24`}
                                            value={formData.remarks}
                                            onChange={(event) => updateField('remarks', event.target.value)}
                                        />
                                    </label>
                                </div>
                            )}

                            {activeTab === 'review' && (
                                <div className="mt-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {[
                                            ['Organization', formData.organizationName || 'Not entered'],
                                            ['Authorized Person', `${formData.authorizedPersonName} - ${formData.authorizedPersonDesignation}`],
                                            ['Email', formData.email || 'Not entered'],
                                            ['Mobile', formData.authorizedPersonMobile || 'Not entered'],
                                            [
                                                'Premium Package',
                                                premiumSponsorOptions.find((option) => option.id === formData.premiumPackage)?.label || 'None',
                                            ],
                                            [
                                                'Standalone Items',
                                                formData.standaloneItems
                                                    .map((id) => standaloneSponsorOptions.find((option) => option.id === id)?.label)
                                                    .filter(Boolean)
                                                    .join(', ') || 'None',
                                            ],
                                            [
                                                'Souvenir Advertisement',
                                                souvenirAdvertisementOptions.find(
                                                    (option) => option.id === formData.souvenirAdvertisement
                                                )?.label || 'None',
                                            ],
                                            ['Total Payable', formatInr(totals.total)],
                                            ['Amount Paid', formatInr(formData.amountPaid)],
                                            ['Transaction Reference', formData.transactionReference || 'Not entered'],
                                            ['Payment Proof', formData.paymentProofName || 'Not selected'],
                                            ['Payment Status', 'Verification required'],
                                        ].map(([label, value]) => (
                                            <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                                <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
                                                <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <label className="mt-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-950">
                                        <input
                                            type="checkbox"
                                            className="mt-1"
                                            checked={formData.declarationAccepted}
                                            onChange={(event) => updateField('declarationAccepted', event.target.checked)}
                                        />
                                        <span>
                                            I declare that the details furnished are true and genuine and authorize IPA Kerala
                                            to take the necessary action on this sponsorship application.
                                        </span>
                                    </label>
                                </div>
                            )}

                            {activeTab === 'confirmation' && (
                                <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                                    <p className="text-sm font-bold uppercase text-emerald-700">Sponsor Application Submitted</p>
                                    <h3 className="mt-3 text-2xl font-bold text-emerald-950">Thank you for partnering with us.</h3>
                                    <p className="mt-3 text-sm leading-6 text-emerald-900">
                                        Application number:{' '}
                                        <span className="font-bold">{formData.applicationNumber || 'Generated after submit'}</span>
                                    </p>
                                    <p className="mt-2 text-sm text-emerald-900">
                                        Your payment and selected opportunities will be confirmed after verification.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={submitAnotherResponse}
                                        className="mt-5 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-900"
                                    >
                                        Submit another application
                                    </button>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-h-6 text-sm font-semibold text-emerald-700">{notice}</div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        disabled={activeTab === 'organization' || activeTab === 'confirmation'}
                                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
                                    >
                                        Back
                                    </button>
                                    {activeTab !== 'confirmation' && (
                                        <button
                                            type="button"
                                            onClick={() => saveSection(activeTab)}
                                            disabled={isSaving}
                                            className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Section'}
                                        </button>
                                    )}
                                    {activeTab === 'review' ? (
                                        <button
                                            type="button"
                                            onClick={submitSponsorApplication}
                                            disabled={isSaving}
                                            className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-bold text-white hover:bg-rose-800 disabled:opacity-50"
                                        >
                                            {isSaving ? 'Submitting...' : 'Submit Sponsor Application'}
                                        </button>
                                    ) : activeTab !== 'confirmation' && (
                                        <button
                                            type="button"
                                            onClick={goNext}
                                            disabled={isSaving}
                                            className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function Abstracts() {
    const section = siteMap.find((item) => item.title === 'Programs and Events Spotlight');
    const slides = section.pages.slice(1);
    const [activeSlide, setActiveSlide] = useState(0);

    function getSlideOffset(index) {
        let offset = index - activeSlide;

        if (offset > slides.length / 2) {
            offset -= slides.length;
        }

        if (offset < -slides.length / 2) {
            offset += slides.length;
        }

        return offset;
    }

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 4500);

        return () => window.clearInterval(timer);
    }, [slides.length]);

    return (
        <section id="programs-and-events-spotlight" className="scroll-mt-24 bg-emerald-950 py-10 text-white sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <div>
                    <p className="text-sm font-bold uppercase text-amber-300">Programs and Events</p>
                    <h2 className="mt-3 text-3xl font-bold">Sessions, speakers, competitions, and cultural events.</h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50">
                        Explore the core convention tracks at a glance. Detailed timings, speakers, rules, and venue
                        allocations can be updated under each program area.
                    </p>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="perspective-carousel relative">
                        <button
                            type="button"
                            onClick={() => setActiveSlide((current) => (current - 1 + slides.length) % slides.length)}
                            className="absolute left-2 top-1/2 z-40 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-emerald-950/80 text-2xl font-bold leading-none text-white shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur-md hover:bg-emerald-900/90 sm:left-4"
                            aria-label="Previous slide"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveSlide((current) => (current + 1) % slides.length)}
                            className="absolute right-2 top-1/2 z-40 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-emerald-950/80 text-2xl font-bold leading-none text-white shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur-md hover:bg-emerald-900/90 sm:right-4"
                            aria-label="Next slide"
                        >
                            ›
                        </button>
                        <div className="carousel-stage relative h-[390px] sm:h-[430px] lg:h-[470px]">
                            <div className="absolute inset-x-6 top-8 h-[300px] rounded-[2.5rem] bg-white/8 blur-3xl sm:inset-x-20 sm:h-[330px] lg:inset-x-28 lg:h-[370px]" aria-hidden="true" />
                            {slides.map((item, index) => {
                                const offset = getSlideOffset(index);
                                const absOffset = Math.abs(offset);
                                const isActive = offset === 0;
                                const hidden = absOffset > 1;

                                return (
                                    <div
                                        key={item}
                                        className={`carousel-item absolute inset-0 flex items-center justify-center px-3 sm:px-10 ${
                                            isActive ? 'carousel-item-active' : ''
                                        }`}
                                        style={{
                                            opacity: hidden ? 0 : isActive ? 1 : 0.28,
                                            filter: isActive ? 'none' : 'blur(1px)',
                                            transform: isActive
                                                ? 'translateX(0) translateZ(0) rotateY(0deg) scale(1)'
                                                : `translateX(${offset * 34}%) translateZ(-220px) rotateY(${offset * -54}deg) scale(0.72)`,
                                            zIndex: isActive ? 30 : 20 - absOffset,
                                            pointerEvents: isActive ? 'auto' : 'none',
                                        }}
                                        onClick={() => setActiveSlide(index)}
                                    >
                                        <Reveal delay={index * 60}>
                                            <article
                                                id={slugify(item)}
                                                className={`interactive-card carousel-card relative isolate w-full max-w-4xl overflow-hidden rounded-[2rem] border p-5 sm:p-7 ${
                                                    isActive
                                                        ? 'border-white/35 bg-emerald-950/90 shadow-[0_30px_90px_rgba(0,0,0,0.58)] backdrop-blur-[18px]'
                                                        : 'border-white/10 bg-emerald-950/45 shadow-[0_16px_46px_rgba(0,0,0,0.2)] backdrop-blur-[14px]'
                                                }`}
                                            >
                                                <div
                                                    className={`absolute inset-0 ${
                                                        isActive ? 'bg-gradient-to-br from-white/8 via-emerald-950/70 to-emerald-950/95' : 'bg-emerald-950/55'
                                                    }`}
                                                    aria-hidden="true"
                                                />
                                                <div className="relative z-10">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="size-2 rounded-full bg-amber-300" />
                                                        <p className="text-xs font-bold uppercase text-amber-300">Track {index + 1}</p>
                                                    </div>
                                                    <p className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-50">
                                                        {isActive ? 'Active' : 'Preview'}
                                                    </p>
                                                </div>
                                                <div className="mt-5 rounded-2xl bg-emerald-950/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/15 backdrop-blur-md sm:p-5">
                                                    <h3 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                                                        {item}
                                                    </h3>
                                                    <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/92 sm:text-lg">
                                                        {pageHighlights[item]}
                                                    </p>
                                                </div>
                                                </div>
                                            </article>
                                        </Reveal>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                        <a
                            href="#sessions-and-schedules"
                            className="inline-flex rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                        >
                            View Schedule
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Programs() {
    const section = siteMap.find((item) => item.title === 'Events and Programs');

    return (
        <section id="events-and-programs" className="scroll-mt-24 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase text-emerald-700">Programs and Events</p>
                        <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
                            Sessions, speakers, competitions, and cultural events.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
                            Explore the core convention tracks at a glance. Detailed timings, speakers, rules, and venue
                            allocations can be updated under each program area.
                        </p>
                    </div>
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                        <p className="text-xs font-bold uppercase text-emerald-700">Schedule</p>
                        <p className="mt-2 text-lg font-bold text-zinc-950">Program timing and venue allocation</p>
                        <a
                            href="#sessions-and-schedules"
                            className="mt-4 inline-flex rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900"
                        >
                            View Schedule
                        </a>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {section.pages.slice(1).map((title, index) => (
                        <Reveal key={title} delay={index * 110}>
                            <article
                                id={slugify(title)}
                                className="interactive-card scroll-mt-28 rounded-lg border border-zinc-200 bg-zinc-50 p-5"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="size-2 rounded-full bg-amber-400" />
                                    <p className="text-xs font-bold uppercase text-emerald-700">Track {index + 1}</p>
                                </div>
                                <h3 className="mt-4 font-bold text-zinc-950">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-zinc-600">{pageHighlights[title]}</p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function OrganizingTeam() {
    const section = siteMap.find((item) => item.title === 'Organizing Team');

    return (
        <section id="organizing-team" className="scroll-mt-24 bg-gradient-to-b from-white to-emerald-50/70 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-sm font-bold uppercase text-emerald-700">Organizing Team</p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
                        Committee, advisors, IPA groups, partners, and sponsors.
                    </h2>
                    <p className="mt-4 text-base leading-7 text-zinc-600">
                        Key leadership groups and support teams helping coordinate the 14th National Student Convention.
                    </p>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {section.pages.slice(1).map((item, index) => (
                        <Reveal key={item} delay={index * 70}>
                            <div
                                id={slugify(item)}
                                className="interactive-card group relative min-h-44 scroll-mt-28 overflow-hidden rounded-lg border border-emerald-100 bg-white p-5 shadow-sm"
                            >
                                <div className="team-card-accent absolute inset-x-0 top-0 h-1" />
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-black text-emerald-800 ring-1 ring-emerald-100">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold uppercase text-zinc-500">
                                        Team
                                    </span>
                                </div>
                                <h3 className="mt-5 text-lg font-bold leading-snug text-zinc-950">{item}</h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">{pageHighlights[item]}</p>
                                <div className="mt-5 h-px bg-zinc-100" />
                                <a
                                    href={`#${slugify(item)}`}
                                    className="mt-4 inline-flex text-sm font-bold text-emerald-700 hover:text-emerald-900"
                                >
                                    View details
                                </a>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SponsorSection() {
    return (
        <section id="become-a-sponsor" className="scroll-mt-24 bg-white py-16">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                <Reveal>
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase text-emerald-700">Become a Sponsor</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
                            Put your brand in front of India&apos;s next generation of pharmacy leaders.
                        </h2>
                        <p className="mt-5 text-base leading-8 text-zinc-600">
                            Partner with the 14th National Student Convention to connect with pharmacy students,
                            educators, researchers, and industry professionals through exhibition visibility,
                            delegate engagement, session support, and event branding opportunities.
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {['Exhibition stalls', 'Delegate engagement', 'Session visibility', 'Brand placements'].map((item) => (
                                <div key={item} className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-800">
                                    {item}
                                </div>
                            ))}
                        </div>
                        <a
                            href="/sponsor-registration"
                            className="button-pop mt-7 inline-flex rounded-lg bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
                        >
                            Become a Sponsor
                        </a>
                    </div>
                </Reveal>

                <Reveal delay={140}>
                    <div className="overflow-hidden rounded-lg bg-zinc-100 shadow-2xl ring-1 ring-zinc-200">
                        <img
                            src="/images/nsc-sponsor-exhibition.png"
                            alt="Sponsor representatives speaking with student delegates at an exhibition booth"
                            className="h-[360px] w-full object-cover sm:h-[440px]"
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section className="bg-zinc-950 py-12 text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div>
                    <h2 className="text-2xl font-bold">Important Contacts</h2>
                    <p className="mt-2 text-sm text-zinc-300">Email IDs and mobile numbers can be added here for the LOC and support desks.</p>
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <a href="mailto:info@example.com" className="rounded-lg bg-white/10 px-4 py-3 font-semibold ring-1 ring-white/15">
                        info@example.com
                    </a>
                    <a href="tel:+910000000000" className="rounded-lg bg-white/10 px-4 py-3 font-semibold ring-1 ring-white/15">
                        +91 00000 00000
                    </a>
                </div>
            </div>
        </section>
    );
}

function AdminLoginPage() {
    const [theme, toggleTheme] = useAdminTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await apiRequest('admin/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            window.location.href = '/admin';
        } catch (loginError) {
            setError(loginError.message);
            setIsSubmitting(false);
        }
    }

    return (
        <main className={`admin-theme ${theme === 'dark' ? 'dark' : ''} min-h-screen bg-zinc-950 text-white`}>
            <div className="absolute right-4 top-4 z-10 sm:right-6 lg:right-8">
                <AdminThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
            <div className="grid min-h-screen w-full items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                <div>
                    <img src="/logo-300x246.png" alt="IPA logo" className="admin-logo h-20 w-auto rounded-lg bg-white p-2" />
                    <p className="mt-8 text-sm font-bold uppercase text-amber-300">Admin Panel</p>
                    <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Secure event operations for 14th IPA NSC 2026.</h1>
                    <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                        Manage registrations, payments, programs, users, roles, permissions, reports, and winner publishing from one protected backend.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="admin-card rounded-lg bg-white p-6 text-zinc-950 shadow-2xl">
                    <h2 className="text-2xl font-bold">Admin login</h2>
                    <p className="mt-2 text-sm text-zinc-600">Sign in with your PostgreSQL-backed admin account.</p>
                    <label className="mt-6 block text-sm font-semibold text-zinc-800">
                        Email
                        <input
                            className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>
                    <label className="mt-4 block text-sm font-semibold text-zinc-800">
                        Password
                        <input
                            className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </label>
                    {error && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="admin-button mt-6 w-full rounded-lg bg-emerald-800 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-900"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </main>
    );
}

function useAdminTheme() {
    const [theme, setTheme] = useState(() => window.localStorage.getItem(adminThemeKey) || 'light');

    function toggleTheme() {
        setTheme((current) => {
            const nextTheme = current === 'dark' ? 'light' : 'dark';
            window.localStorage.setItem(adminThemeKey, nextTheme);
            return nextTheme;
        });
    }

    return [theme, toggleTheme];
}

function AdminThemeToggle({ theme, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="admin-button-secondary rounded-lg px-3 py-2 text-sm font-semibold"
        >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
    );
}

function AdminSidebarIcon({ name }) {
    const paths = {
        dashboard: (
            <>
                <path d="M4 13h6V4H4v9Z" />
                <path d="M14 20h6v-9h-6v9Z" />
                <path d="M4 20h6v-3H4v3Z" />
                <path d="M14 7h6V4h-6v3Z" />
            </>
        ),
        registrations: (
            <>
                <path d="M8 4h8l4 4v12H4V4h4Z" />
                <path d="M16 4v4h4" />
                <path d="M8 12h8" />
                <path d="M8 16h5" />
            </>
        ),
        payments: (
            <>
                <path d="M3 7h18v10H3V7Z" />
                <path d="M3 10h18" />
                <path d="M7 15h4" />
                <path d="M16 15h1" />
            </>
        ),
        programs: (
            <>
                <path d="M7 3v4" />
                <path d="M17 3v4" />
                <path d="M4 8h16" />
                <path d="M5 5h14v16H5V5Z" />
                <path d="M8 12h3" />
                <path d="M13 12h3" />
                <path d="M8 16h3" />
            </>
        ),
        students: (
            <>
                <path d="m3 8 9-4 9 4-9 4-9-4Z" />
                <path d="M7 10v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5" />
                <path d="M21 8v6" />
            </>
        ),
        pricing: (
            <>
                <path d="M20 12V6H4v12h8" />
                <path d="M4 10h16" />
                <path d="M8 15h3" />
                <path d="M17 14v6" />
                <path d="M14 17h6" />
            </>
        ),
        winners: (
            <>
                <path d="M8 21h8" />
                <path d="M12 17v4" />
                <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                <path d="M7 7H4a3 3 0 0 0 3 3" />
                <path d="M17 7h3a3 3 0 0 1-3 3" />
            </>
        ),
        reports: (
            <>
                <path d="M5 20V4h14v16H5Z" />
                <path d="M9 17V9" />
                <path d="M12 17v-5" />
                <path d="M15 17v-8" />
            </>
        ),
        users: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <path d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M20 8v6" />
                <path d="M17 11h6" />
            </>
        ),
        audit: (
            <>
                <path d="M6 3h9l3 3v15H6V3Z" />
                <path d="M15 3v4h4" />
                <path d="M9 12h6" />
                <path d="M9 16h4" />
                <path d="M8 8h3" />
            </>
        ),
    };

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {paths[name]}
        </svg>
    );
}

function AdminPage() {
    const [theme, toggleTheme] = useAdminTheme();
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeModule, setActiveModule] = useState('dashboard');
    const [userModuleTab, setUserModuleTab] = useState('users');
    const [userSearch, setUserSearch] = useState('');
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] });
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        mobile: '',
        roleId: 'role-registration-staff',
        status: 'Active',
        password: '',
    });
    const [notice, setNotice] = useState('');

    useEffect(() => {
        Promise.all([
            apiRequest('admin/me'),
            apiRequest('admin/bootstrap'),
        ])
            .then(([sessionPayload, bootstrapPayload]) => {
                setSession(sessionPayload.session);
                setRoles(bootstrapPayload.roles);
                setUsers(bootstrapPayload.users);
            })
            .catch(() => {
                window.location.href = '/admin/login';
            })
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading || !session) {
        return <main className="min-h-screen bg-zinc-950 p-8 text-sm font-semibold text-white">Loading admin...</main>;
    }

    const currentRole = roles.find((role) => role.id === session.roleId);
    const activeUsers = users.filter((user) => user.status === 'Active').length;
    const inactiveUsers = users.length - activeUsers;
    const totalPermissions = permissionGroups.flatMap((group) => group.permissions).length;
    const filteredUsers = users.filter((user) => {
        const roleName = roles.find((role) => role.id === user.roleId)?.name || '';
        const haystack = `${user.name} ${user.email} ${user.mobile} ${user.status} ${roleName}`.toLowerCase();

        return haystack.includes(userSearch.toLowerCase());
    });

    const adminNavigation = [
        ['dashboard', 'Dashboard'],
        ['registrations', 'Registrations'],
        ['payments', 'Payments'],
        ['programs', 'Programs'],
        ['students', 'Students'],
        ['pricing', 'Pricing'],
        ['winners', 'Winners'],
        ['reports', 'Reports'],
        ['users', 'Users & Roles'],
        ['audit', 'Audit Logs'],
    ];

    const moduleTitles = {
        dashboard: 'Dashboard',
        registrations: 'Registration Management',
        payments: 'Payment Management',
        programs: 'Program Master',
        students: 'Student Master',
        pricing: 'Pricing Master',
        winners: 'Winner Announcements',
        reports: 'Reports',
        users: 'Users & Roles',
        audit: 'Audit Logs',
    };
    const dashboardStats = [
        ['Total Registrations', '1,248', '+18% this week', 'emerald'],
        ['Payment Collected', 'Rs. 8.42L', '+Rs. 1.1L today', 'amber'],
        ['Pending Payments', '186', 'Needs finance review', 'rose'],
        ['Active Programs', '32', '8 limited capacity', 'sky'],
    ];
    const registrationFunnel = [
        ['Landing Visits', 3200, '#047857'],
        ['Started Registration', 1840, '#0f766e'],
        ['Completed Details', 1460, '#0891b2'],
        ['Reached Payment', 1310, '#ca8a04'],
        ['Confirmed', 1124, '#be123c'],
    ];
    const maxFunnelValue = Math.max(...registrationFunnel.map((item) => item[1]));
    const paymentBreakdown = [
        ['Success', 1124, 'bg-emerald-600'],
        ['Pending', 186, 'bg-amber-500'],
        ['Failed', 54, 'bg-rose-600'],
        ['Manual Review', 36, 'bg-sky-600'],
    ];
    const totalPaymentCount = paymentBreakdown.reduce((total, item) => total + item[1], 0);
    const programRegistrations = [
        ['Patient Counselling', 284],
        ['Pharma Quiz', 232],
        ['Ideation Contest', 198],
        ['AI Workshop', 156],
        ['Poster Presentation', 132],
    ];
    const maxProgramRegistrations = Math.max(...programRegistrations.map((item) => item[1]));
    const weeklyRegistrations = [
        ['Mon', 78],
        ['Tue', 116],
        ['Wed', 142],
        ['Thu', 174],
        ['Fri', 151],
        ['Sat', 208],
        ['Sun', 186],
    ];
    const maxWeeklyRegistration = Math.max(...weeklyRegistrations.map((item) => item[1]));
    const recentAdminActivity = [
        ['Finance Staff', 'verified 24 manual payments', '10 min ago'],
        ['Program Coordinator', 'updated AI Workshop capacity', '35 min ago'],
        ['Registration Staff', 'exported pending registration list', '1 hr ago'],
        ['Result Manager', 'drafted winner records for Pharma Quiz', '2 hrs ago'],
    ];

    function togglePermission(permission) {
        setRoleForm((current) => ({
            ...current,
            permissions: current.permissions.includes(permission)
                ? current.permissions.filter((item) => item !== permission)
                : [...current.permissions, permission],
        }));
    }

    async function createRole(event) {
        event.preventDefault();
        if (!roleForm.name.trim()) {
            setNotice('Role name is required.');
            return;
        }

        try {
            const { role } = await apiRequest('admin/roles', {
                method: 'POST',
                body: JSON.stringify(roleForm),
            });
            setRoles((current) => [...current, role]);
            setRoleForm({ name: '', description: '', permissions: [] });
            setUserModuleTab('roles');
            setNotice('Role created in the database.');
        } catch (error) {
            setNotice(error.message);
        }
    }

    async function createUser(event) {
        event.preventDefault();
        if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password.trim()) {
            setNotice('Name, email, and password are required.');
            return;
        }

        try {
            const { user } = await apiRequest('admin/users', {
                method: 'POST',
                body: JSON.stringify(userForm),
            });
            setUsers((current) => [...current, user]);
            setUserForm({ name: '', email: '', mobile: '', roleId: 'role-registration-staff', status: 'Active', password: '' });
            setUserModuleTab('users');
            setNotice('User created in the database.');
        } catch (error) {
            setNotice(error.message);
        }
    }

    async function updateUserStatus(userId, status) {
        try {
            const { user } = await apiRequest(`admin/users/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ action: 'status', status }),
            });
            setUsers((current) => current.map((item) => (item.id === userId ? user : item)));
            setNotice(`User marked ${status.toLowerCase()}.`);
        } catch (error) {
            setNotice(error.message);
        }
    }

    async function resetUserPassword(userId) {
        const temporaryPassword = `temp${Date.now().toString().slice(-5)}`;
        try {
            await apiRequest(`admin/users/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ action: 'password', password: temporaryPassword }),
            });
            setNotice(`Temporary password set: ${temporaryPassword}`);
        } catch (error) {
            setNotice(error.message);
        }
    }

    function getRoleName(roleId) {
        return roles.find((role) => role.id === roleId)?.name || 'No role assigned';
    }

    function getRolePermissions(roleId) {
        return roles.find((role) => role.id === roleId)?.permissions || [];
    }

    function formatPermissionLabel(permission) {
        return permission
            .split('.')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    }

    async function logout() {
        await apiRequest('admin/auth/logout', { method: 'POST' }).catch(() => {});
        window.location.href = '/admin/login';
    }

    return (
        <main className={`admin-theme ${theme === 'dark' ? 'dark' : ''} min-h-screen bg-zinc-100 text-zinc-950`}>
            <div className="border-b border-zinc-200 bg-white">
                <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <a href="/" className="flex items-center gap-3">
                        <img src="/logo-only.png" alt="IPA logo" className="admin-logo size-10 rounded-lg bg-white object-contain p-1" />
                        <div>
                            <p className="text-sm font-bold text-emerald-800">14th NSC Admin</p>
                            <p className="text-xs text-zinc-500">{currentRole?.name || 'Admin User'}</p>
                        </div>
                    </a>
                    <div className="flex items-center gap-2">
                        <AdminThemeToggle theme={theme} onToggle={toggleTheme} />
                        <button type="button" onClick={logout} className="admin-button-secondary rounded-lg border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-100">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid min-h-[calc(100vh-73px)] w-full gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
                <aside className="admin-card h-full rounded-lg border border-zinc-200 bg-white p-3 shadow-sm lg:sticky lg:top-8 lg:max-h-[calc(100vh-96px)] lg:overflow-auto">
                    {adminNavigation.map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveModule(id)}
                            className={`mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold ${
                                activeModule === id ? 'bg-emerald-800 text-white' : 'text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800'
                            }`}
                        >
                            <AdminSidebarIcon name={id} />
                            <span>{label}</span>
                        </button>
                    ))}
                </aside>

                <section className="admin-card rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase text-emerald-700">Admin Control</p>
                            <h1 className="mt-1 text-2xl font-bold">{moduleTitles[activeModule]}</h1>
                        </div>
                        {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">{notice}</p>}
                    </div>

                    {activeModule === 'dashboard' && (
                        <div className="mt-6 grid gap-6">
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {dashboardStats.map(([label, value, note, tone]) => (
                                    <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
                                                <p className="mt-2 text-3xl font-bold text-zinc-950">{value}</p>
                                            </div>
                                            <span className={`size-3 rounded-full ${
                                                tone === 'emerald'
                                                    ? 'bg-emerald-600'
                                                    : tone === 'amber'
                                                        ? 'bg-amber-500'
                                                        : tone === 'rose'
                                                            ? 'bg-rose-600'
                                                            : 'bg-sky-600'
                                            }`} />
                                        </div>
                                        <p className="mt-4 text-sm font-semibold text-zinc-600">{note}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                                <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold">Registration Funnel</h2>
                                            <p className="mt-1 text-sm text-zinc-600">Demo view from website visit to confirmed payment.</p>
                                        </div>
                                        <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">35.1% confirmed</span>
                                    </div>
                                    <div className="mt-6 grid gap-3">
                                        {registrationFunnel.map(([label, value, color], index) => (
                                            <div key={label}>
                                                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                                                    <span className="font-semibold text-zinc-700">{index + 1}. {label}</span>
                                                    <span className="font-bold text-zinc-950">{value.toLocaleString()}</span>
                                                </div>
                                                <div className="h-9 overflow-hidden rounded-lg bg-white ring-1 ring-zinc-200">
                                                    <div
                                                        className="flex h-full items-center justify-end rounded-lg px-3 text-xs font-bold text-white"
                                                        style={{
                                                            width: `${Math.max((value / maxFunnelValue) * 100, 12)}%`,
                                                            backgroundColor: color,
                                                        }}
                                                    >
                                                        {Math.round((value / maxFunnelValue) * 100)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                                    <h2 className="text-lg font-bold">Payment Status</h2>
                                    <p className="mt-1 text-sm text-zinc-600">Demo payment split for reconciliation.</p>
                                    <div className="mt-6 flex h-5 overflow-hidden rounded-lg bg-white ring-1 ring-zinc-200">
                                        {paymentBreakdown.map(([label, value, className]) => (
                                            <div
                                                key={label}
                                                className={className}
                                                style={{ width: `${(value / totalPaymentCount) * 100}%` }}
                                                title={`${label}: ${value}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-5 grid gap-3">
                                        {paymentBreakdown.map(([label, value, className]) => (
                                            <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 ring-1 ring-zinc-200">
                                                <div className="flex items-center gap-2">
                                                    <span className={`size-3 rounded-full ${className}`} />
                                                    <span className="text-sm font-semibold text-zinc-700">{label}</span>
                                                </div>
                                                <span className="text-sm font-bold text-zinc-950">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="grid gap-6 xl:grid-cols-3">
                                <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 xl:col-span-2">
                                    <h2 className="text-lg font-bold">Weekly Registrations</h2>
                                    <div className="mt-6 flex h-56 items-end gap-3 rounded-lg bg-white p-4 ring-1 ring-zinc-200">
                                        {weeklyRegistrations.map(([day, value]) => (
                                            <div key={day} className="flex h-full flex-1 flex-col justify-end gap-2">
                                                <div
                                                    className="rounded-t-lg bg-emerald-700"
                                                    style={{ height: `${Math.max((value / maxWeeklyRegistration) * 100, 10)}%` }}
                                                />
                                                <div className="text-center">
                                                    <p className="text-xs font-bold text-zinc-500">{day}</p>
                                                    <p className="text-xs font-semibold text-zinc-900">{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                                    <h2 className="text-lg font-bold">Program Registrations</h2>
                                    <div className="mt-5 grid gap-3">
                                        {programRegistrations.map(([label, value]) => (
                                            <div key={label}>
                                                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                                                    <span className="font-semibold text-zinc-700">{label}</span>
                                                    <span className="font-bold text-zinc-950">{value}</span>
                                                </div>
                                                <div className="h-3 overflow-hidden rounded-lg bg-white ring-1 ring-zinc-200">
                                                    <div
                                                        className="h-full rounded-lg bg-sky-600"
                                                        style={{ width: `${(value / maxProgramRegistrations) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                                <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                                    <h2 className="text-lg font-bold">Admin Access Summary</h2>
                                    <div className="mt-5 grid gap-3">
                                        {[
                                            ['Total Users', users.length],
                                            ['Active Users', activeUsers],
                                            ['Roles', roles.length],
                                            ['Permissions', totalPermissions],
                                            ['Current User', session.name],
                                        ].map(([label, value]) => (
                                            <div key={label} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-zinc-200">
                                                <span className="text-sm font-semibold text-zinc-600">{label}</span>
                                                <span className="text-sm font-bold text-zinc-950">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                                    <h2 className="text-lg font-bold">Recent Activity</h2>
                                    <div className="mt-5 divide-y divide-zinc-200 overflow-hidden rounded-lg bg-white ring-1 ring-zinc-200">
                                        {recentAdminActivity.map(([actor, action, time]) => (
                                            <div key={`${actor}-${action}`} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900">{actor}</p>
                                                    <p className="text-sm text-zinc-600">{action}</p>
                                                </div>
                                                <span className="text-xs font-bold uppercase text-zinc-500">{time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {activeModule === 'users' && (
                        <div className="mt-6">
                            <div className="grid gap-4 md:grid-cols-4">
                                {[
                                    ['Total Users', users.length],
                                    ['Active Users', activeUsers],
                                    ['Inactive Users', inactiveUsers],
                                    ['Roles', roles.length],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                        <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
                                        <p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
                                {[
                                    ['users', 'User Directory'],
                                    ['create-user', 'Create User'],
                                    ['roles', 'Roles'],
                                    ['permissions', 'Permission Matrix'],
                                ].map(([id, label]) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setUserModuleTab(id)}
                                        className={`rounded-lg px-3 py-2 text-sm font-bold ${
                                            userModuleTab === id
                                                ? 'bg-emerald-800 text-white'
                                                : 'bg-zinc-100 text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {userModuleTab === 'users' && (
                                <div className="mt-6">
                                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold">Admin User Directory</h2>
                                            <p className="mt-1 text-sm text-zinc-600">Search users, review role access, and manage account status.</p>
                                        </div>
                                        <input
                                            className="admin-input w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 md:max-w-xs"
                                            value={userSearch}
                                            onChange={(event) => setUserSearch(event.target.value)}
                                            placeholder="Search users, roles, email"
                                        />
                                    </div>

                                    <div className="overflow-x-auto rounded-lg border border-zinc-200">
                                        <table className="w-full min-w-[860px] text-left text-sm">
                                            <thead className="bg-zinc-100 text-xs uppercase text-zinc-500">
                                                <tr>
                                                    <th className="px-4 py-3">User</th>
                                                    <th className="px-4 py-3">Role</th>
                                                    <th className="px-4 py-3">Permissions</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3">Last Login</th>
                                                    <th className="px-4 py-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-200">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="px-4 py-3">
                                                            <p className="font-bold text-zinc-900">{user.name}</p>
                                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                                            <p className="text-xs text-zinc-500">{user.mobile || 'No mobile'}</p>
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold">{getRoleName(user.roleId)}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-700">
                                                                {getRolePermissions(user.roleId).length} permissions
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`rounded-lg px-2 py-1 text-xs font-bold ${
                                                                user.status === 'Active'
                                                                    ? 'bg-emerald-50 text-emerald-800'
                                                                    : 'bg-zinc-100 text-zinc-600'
                                                            }`}>
                                                                {user.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-zinc-600">{user.lastLogin || 'Never'}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateUserStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                                                                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100"
                                                                >
                                                                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => resetUserPassword(user.id)}
                                                                    className="rounded-lg border border-emerald-700 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                                                                >
                                                                    Reset Password
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {userModuleTab === 'create-user' && (
                                <form onSubmit={createUser} className="mt-6 rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-200">
                                    <div className="flex flex-col gap-1 border-b border-zinc-200 pb-4">
                                        <h2 className="text-lg font-bold">Create Admin User</h2>
                                        <p className="text-sm text-zinc-600">Assign a role, set the account status, and issue a temporary password.</p>
                                    </div>
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        {[
                                            ['name', 'Full Name', 'Registration Staff'],
                                            ['email', 'Email', 'staff@nsc2026.local'],
                                            ['mobile', 'Mobile', '+91 98765 43210'],
                                            ['password', 'Temporary Password', 'Set temporary password'],
                                        ].map(([name, label, placeholder]) => (
                                            <label key={name} className="block text-sm font-semibold text-zinc-800">
                                                {label}
                                                <input
                                                    className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                    type={name === 'password' ? 'password' : name === 'email' ? 'email' : 'text'}
                                                    value={userForm[name]}
                                                    onChange={(event) => setUserForm((current) => ({ ...current, [name]: event.target.value }))}
                                                    placeholder={placeholder}
                                                />
                                            </label>
                                        ))}
                                        <label className="block text-sm font-semibold text-zinc-800">
                                            Role
                                            <select
                                                className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                value={userForm.roleId}
                                                onChange={(event) => setUserForm((current) => ({ ...current, roleId: event.target.value }))}
                                            >
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="block text-sm font-semibold text-zinc-800">
                                            Status
                                            <select
                                                className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                value={userForm.status}
                                                onChange={(event) => setUserForm((current) => ({ ...current, status: event.target.value }))}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </label>
                                    </div>
                                    <button type="submit" className="admin-button mt-5 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900">
                                        Create User
                                    </button>
                                </form>
                            )}

                            {userModuleTab === 'roles' && (
                                <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                                    <form onSubmit={createRole} className="rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-200">
                                        <div className="border-b border-zinc-200 pb-4">
                                            <h2 className="text-lg font-bold">Create Role</h2>
                                            <p className="mt-1 text-sm text-zinc-600">Build roles around real admin duties like registration, finance, program, reports, or results.</p>
                                        </div>
                                        <label className="mt-5 block text-sm font-semibold text-zinc-800">
                                            Role Name
                                            <input
                                                className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                value={roleForm.name}
                                                onChange={(event) => setRoleForm((current) => ({ ...current, name: event.target.value }))}
                                                placeholder="Program Coordinator"
                                            />
                                        </label>
                                        <label className="mt-4 block text-sm font-semibold text-zinc-800">
                                            Description
                                            <textarea
                                                className="admin-input mt-2 min-h-24 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                value={roleForm.description}
                                                onChange={(event) => setRoleForm((current) => ({ ...current, description: event.target.value }))}
                                                placeholder="Access scope for this role"
                                            />
                                        </label>
                                        <div className="mt-4">
                                            <p className="text-sm font-semibold text-zinc-800">Permissions</p>
                                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                                {permissionGroups.map((group) => (
                                                    <div key={group.title} className="rounded-lg border border-zinc-200 bg-white p-3">
                                                        <p className="text-xs font-bold uppercase text-zinc-500">{group.title}</p>
                                                        <div className="mt-3 grid gap-2">
                                                            {group.permissions.map((permission) => (
                                                                <label key={permission} className="text-sm font-semibold text-zinc-700">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mr-2"
                                                                        checked={roleForm.permissions.includes(permission)}
                                                                        onChange={() => togglePermission(permission)}
                                                                    />
                                                                    {formatPermissionLabel(permission)}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="submit" className="admin-button mt-5 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900">
                                            Create Role
                                        </button>
                                    </form>

                                    <div className="grid gap-3">
                                        {roles.map((role) => (
                                            <article key={role.id} className="rounded-lg border border-zinc-200 p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="font-bold">{role.name}</h3>
                                                        <p className="mt-1 text-sm text-zinc-600">{role.description || 'No description added.'}</p>
                                                    </div>
                                                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">{role.permissions.length}/{totalPermissions}</span>
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {role.permissions.map((permission) => (
                                                        <span key={permission} className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">
                                                            {formatPermissionLabel(permission)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {userModuleTab === 'permissions' && (
                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    {permissionGroups.map((group) => (
                                        <article key={group.title} className="rounded-lg border border-zinc-200 p-4">
                                            <h3 className="font-bold">{group.title}</h3>
                                            <div className="mt-3 grid gap-2">
                                                {group.permissions.map((permission) => (
                                                    <div key={permission} className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm">
                                                        <span className="font-semibold text-zinc-700">{formatPermissionLabel(permission)}</span>
                                                        <code className="rounded bg-white px-2 py-1 text-xs text-zinc-500">{permission}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!['dashboard', 'users'].includes(activeModule) && (
                        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
                            <p className="text-sm font-bold uppercase text-emerald-700">Planned Module</p>
                            <h2 className="mt-2 text-xl font-bold text-zinc-950">{moduleTitles[activeModule]}</h2>
                            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                                This section is reserved in the admin navigation. Its list, form, filters, exports, and permission checks can be connected as each backend API is implemented.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default function App() {
    useRevealOnScroll();
    const isAdminLoginPage = window.location.pathname === '/admin/login';
    const isAdminPage = window.location.pathname === '/admin';
    const isRegistrationPage = window.location.pathname === '/registration';
    const isSponsorRegistrationPage = window.location.pathname === '/sponsor-registration';

    if (isAdminLoginPage) {
        return <AdminLoginPage />;
    }

    if (isAdminPage) {
        return <AdminPage />;
    }

    if (isRegistrationPage) {
        return (
            <div className="bg-zinc-50 text-zinc-950 antialiased">
                <Header />
                <main>
                    <RegistrationPage />
                </main>
            </div>
        );
    }

    if (isSponsorRegistrationPage) {
        return (
            <div className="bg-zinc-50 text-zinc-950 antialiased">
                <Header />
                <main>
                    <SponsorRegistrationPage />
                </main>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 text-zinc-950 antialiased">
            <Header />
            <main>
                <Hero />
                <section className="border-y border-emerald-900 bg-emerald-950 text-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm sm:px-6 lg:flex-row lg:items-center lg:px-8">
                        <span className="font-bold text-amber-300">Important:</span>
                        <p className="text-emerald-50">
                            Final dates, registration deadlines, accepted paper list, and poster codes will be displayed on this portal.
                        </p>
                    </div>
                </section>
                <HomeWelcome />
                <QuickFacts />
                <Abstracts />
                <OrganizingTeam />
                <SponsorSection />
                <Contact />
            </main>
        </div>
    );
}
