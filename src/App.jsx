import { useEffect, useMemo, useRef, useState } from 'react';
import { apiRequest } from './api';

const eventTheme = "Pioneering India's Pharmaceutical Future: Bridging Innovation, Entrepreneurship, Industry, and Healthcare Practice in the Digital Era";
const eventDate = '19–20 September 2026';

const siteMap = [
    {
        title: 'Home',
        pages: ['Home', 'News and Updates', 'Important Dates'],
    },
    {
        title: 'Scientific Service',
        link: '/scientific-service',
        pages: [],
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
        title: 'Accommodation & Travel',
        link: '/accommodation-travel',
        pages: [],
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
    'List of Budget Hotels': 'Browse suggested budget hotel options for delegates, students, faculty, and accompanying teams.',
    'Tariff Plans': 'Review room categories, approximate tariff ranges, occupancy notes, and booking terms.',
    'Contact Person': 'Find the hospitality desk contact person for accommodation, travel, and local support.',
    'How to Reach': 'Check airport, railway, bus, and local route guidance for reaching the congress venue.',
    'Pick & Drop Points': 'View designated pickup and drop points, shuttle notes, and reporting instructions.',
    'Tour Attractions': 'Explore nearby cultural, nature, shopping, and city attractions for delegates visiting Kerala.',
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
    '14th IPA National Students Congress Abstract Book': 'Download the final abstract book after scientific committee approval.',
    '14th IPA National Students Congress Souvenir': 'Access the souvenir, sponsor acknowledgements, and event commemorative material.',
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

const preCongressWorkshops = [
    {
        title: '3D Printing and Scientific Writing',
        events: [
            { number: 1, name: '3D Printing' },
            { number: 2, name: 'Scientific Writing' },
        ],
        date: '17-18 September 2026',
        venue: 'Lisie College of Pharmacy, Ernakulam',
    },
    {
        title: 'FIP Vaccination, NDDS and CADD',
        events: [
            { number: 3, name: 'FIP Vaccination' },
            { number: 4, name: 'NDDS' },
            { number: 5, name: 'CADD' },
        ],
        date: '17-18 September 2026',
        venue: 'Amrita School of Pharmacy, Ernakulam',
    },
];

const sponsorShowcase = [
    { tier: 'Title Sponsor', slots: 1, accent: 'from-[#df0867] to-[#f4a21b]' },
    { tier: 'Premium Sponsors', slots: 2, accent: 'from-[#f4a21b] to-[#ffd36a]' },
    { tier: 'Supporting Partners', slots: 2, accent: 'from-[#00652f] to-[#0f9f58]' },
];

const supportingPartners = [
    { name: 'Pharma First', logo: '/supportting partners/pharma-first-logo.png' },
    { name: 'PHARMABIZ.com', logo: '/supportting partners/pharmabiz-logo.png' },
];

const heroLogos = [
    { name: 'IPA Students Forum', logo: '/logo/IPA-SF Light (1).png', className: 'w-36 sm:w-44' },
    { name: 'IPA Education Division', logo: '/logo/IPA - ED - Light (1).png', className: 'w-28 sm:w-36' },
    { name: 'IPA Kerala State Branch', logo: '/logo/HOST LOGO - LIGHT (1).png', className: 'w-24 sm:w-32' },
];

const accommodationTravelDefaults = {
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

function normalizeAccommodationCms(data = {}) {
    return {
        ...accommodationTravelDefaults,
        ...data,
        accommodationSpaces: Array.isArray(data.accommodationSpaces) ? data.accommodationSpaces : accommodationTravelDefaults.accommodationSpaces,
        pickupPoints: Array.isArray(data.pickupPoints) ? data.pickupPoints : accommodationTravelDefaults.pickupPoints,
        touristAttractions: (Array.isArray(data.touristAttractions) ? data.touristAttractions : accommodationTravelDefaults.touristAttractions).map((place = {}, index) => ({
            ...accommodationTravelDefaults.touristAttractions[index % accommodationTravelDefaults.touristAttractions.length],
            ...place,
        })),
    };
}

const registrationDraftKey = 'ipa-nsc-2026-registration-draft-token';

const groupMemberColumns = [
    ['name', 'Name'],
    ['email', 'Email'],
    ['whatsapp', 'WhatsApp Number'],
    ['category', 'Category'],
    ['course', 'Course'],
    ['college', 'College'],
    ['state', 'State'],
    ['foodPreference', 'Food Preference'],
];

function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        if (character === '"' && quoted && text[index + 1] === '"') {
            value += '"';
            index += 1;
        } else if (character === '"') {
            quoted = !quoted;
        } else if (character === ',' && !quoted) {
            row.push(value.trim());
            value = '';
        } else if ((character === '\n' || character === '\r') && !quoted) {
            if (character === '\r' && text[index + 1] === '\n') index += 1;
            row.push(value.trim());
            if (row.some(Boolean)) rows.push(row);
            row = [];
            value = '';
        } else {
            value += character;
        }
    }
    row.push(value.trim());
    if (row.some(Boolean)) rows.push(row);
    return rows;
}

function normalizeCsvHeader(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

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

const initialRegistration = {
    registrationMode: 'individual',
    participantName: '',
    institutionName: '',
    groupCoordinatorName: '',
    groupCoordinatorEmail: '',
    groupCoordinatorWhatsapp: '',
    expectedParticipants: '',
    groupMembers: [],
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
    selectedWorkshops: [],
    workshopFeeAcknowledged: '',
    presentationType: '',
    hrCollegeWithState: '',
    hrCourseOrQualification: '',
    hrWhatsappNumber: '',
    hrWhatsappConfirmation: '',
    hrEmail: '',
    hrEmailConfirmation: '',
    hrCoreArea: '',
    transactionDetails: '',
    registrationNumber: '',
    submittedAt: '',
};

const registrationTabs = [
    { id: 'general', label: 'General' },
    { id: 'competitions', label: 'Student Competitions' },
    { id: 'workshop', label: 'Workshop' },
    { id: 'presentation', label: 'Presentation' },
    { id: 'hr-drive', label: 'HR Drive' },
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
        title: 'Content',
        permissions: ['content.view', 'content.update'],
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
    const [isCompact, setIsCompact] = useState(false);
    const isCompactRef = useRef(false);
    const scrollFrameRef = useRef(0);

    useEffect(() => {
        const updateHeader = () => {
            if (scrollFrameRef.current) return;
            scrollFrameRef.current = window.requestAnimationFrame(() => {
                scrollFrameRef.current = 0;
                const nextIsCompact = window.scrollY > 40;
                if (isCompactRef.current !== nextIsCompact) {
                    isCompactRef.current = nextIsCompact;
                    setIsCompact(nextIsCompact);
                }
            });
        };

        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });

        return () => {
            window.removeEventListener('scroll', updateHeader);
            if (scrollFrameRef.current) {
                window.cancelAnimationFrame(scrollFrameRef.current);
            }
        };
    }, []);

    return (
        <header className="event-header sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
            <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${isCompact ? 'py-0' : 'py-1'}`}>
                <a href="/" className="group flex shrink-0 items-end gap-4">
                    <img
                        src="/14th NSC LOGO - DARK.png"
                        alt="14th IPA National Students Congress logo"
                        className={`w-auto object-contain transition-all duration-300 ${isCompact ? 'h-14 sm:h-16' : 'h-20 sm:h-24'}`}
                    />
                    <img
                        src="/logo-300x246.png"
                        alt="Indian Pharmaceutical Association logo"
                        className={`w-auto object-contain transition-all duration-300 ${isCompact ? 'h-12 sm:h-14' : 'h-16 sm:h-20'}`}
                    />
                </a>

                <nav className="hidden items-center gap-1 text-sm font-medium text-[#11145f] xl:flex">
                    {siteMap.map((section) => (
                        <div key={section.title} className="group relative">
                            <a
                                className="nav-link block rounded-lg px-3 py-2 hover:text-[#df0867]"
                                href={section.link ?? `/#${slugify(section.title)}`}
                            >
                                {section.title}
                            </a>
                            {section.pages.length > 0 && (
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
                            )}
                        </div>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <a href="/registration" className="button-pop rounded-lg bg-[#df0867] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#bd0758]">
                        Register
                    </a>
                    <details className="relative xl:hidden">
                        <summary className="list-none rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-800 marker:hidden">
                            Menu
                        </summary>
                        <div className="absolute right-0 top-full mt-3 max-h-[78vh] w-[min(88vw,420px)] overflow-auto rounded-lg border border-zinc-200 bg-white p-3 shadow-2xl">
                            {siteMap.map((section) => (
                                <div key={section.title} className="border-b border-zinc-100 py-3 last:border-0">
                                    <a href={section.link ?? `/#${slugify(section.title)}`} className="block px-2 text-sm font-bold text-emerald-800">
                                        {section.title}
                                    </a>
                                    {section.pages.length > 0 && (
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
                                    )}
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
        <section id="home" className="relative overflow-hidden bg-[#0d124f] text-white">
            <img
                src="/images/nsc-kerala-hero.png"
                alt="Students and delegates at a Kerala conference venue"
                className="hero-image absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#090d42]/48" />
            <div className="hero-sheen absolute inset-0" />
            <div className="relative mx-auto grid min-h-[680px] max-w-7xl content-end gap-8 px-4 pb-14 pt-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-20">
                <div className="hero-copy max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/25">
                        <span className="pulse-dot size-2 rounded-full bg-[#f4a21b]" />
                        14th IPA National Students Congress web portal
                    </div>
                    <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                        14th IPA National Students Congress
                    </h1>
                    <div className="mt-5 max-w-3xl border-l-4 border-[#df0867] bg-[#0d124f]/55 px-5 py-5 backdrop-blur-sm">
                        <div className="mb-4 flex flex-wrap items-center gap-5 border-b border-white/20 pb-4 sm:gap-7">
                            {heroLogos.map((item) => (
                                <img
                                    key={item.name}
                                    src={item.logo}
                                    alt={`${item.name} logo`}
                                    className={`h-28 object-contain sm:h-32 ${item.className}`}
                                />
                            ))}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#ffd36a]">Theme</p>
                        <p className="mt-1 text-base font-semibold leading-7 text-white sm:text-lg">{eventTheme}</p>
                    </div>
                    <p className="mt-4 inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/25">
                        {eventDate}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href="#fourteenth-ipa-national-students-congress-souvenir" className="button-pop rounded-lg bg-[#df0867] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#bd0758]">
                            Souvenir
                        </a>
                        <a href="#fourteenth-nsc-brochures" className="button-pop rounded-lg bg-[#1b2074] px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-black/15 hover:bg-[#1b2074]">
                            Congress Brochures
                        </a>
                    </div>
                </div>

                <aside id="news-and-updates" className="hero-panel self-end rounded-lg bg-white p-5 text-zinc-950 shadow-2xl">
                    <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                        <h2 className="text-base font-bold">Latest Updates</h2>
                        <span className="live-badge rounded-lg bg-[#e7f5ec] px-3 py-1 text-xs font-semibold text-[#00652f]">Live</span>
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
        <section id="important-dates" className="snapshot-section relative isolate overflow-hidden py-14 text-white">
            <img
                src="/images/nsc-kerala-hero.png"
                alt=""
                className="snapshot-background absolute inset-0 -z-30 h-full w-full object-cover"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
            />
            <div className="snapshot-overlay absolute inset-0 -z-20" aria-hidden="true" />
            <div className="snapshot-flow-lines absolute inset-0 -z-10" aria-hidden="true">
                <span className="snapshot-flow-line top-[14%]" />
                <span className="snapshot-flow-line top-[48%] animation-delay-1200" />
                <span className="snapshot-flow-line top-[78%] animation-delay-2400" />
            </div>
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 grid items-center gap-8 lg:grid-cols-[1fr_440px]">
                    <div className="max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#ffd36a]">Event Snapshot</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                            Congress and pre-congress workshop schedule
                        </h2>
                        <p className="mt-3 text-base font-medium leading-7 text-white/75">
                            Pre-congress workshops begin on 17 September, followed by the National Students Congress on {eventDate}.
                        </p>
                    </div>
                    <div className="snapshot-logo-panel grid grid-cols-[1.15fr_0.85fr] items-center gap-5 rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-md">
                        <img
                            src="/14th NSC LOGO - LIGHT.png"
                            alt="14th IPA National Students Congress logo"
                            className="snapshot-event-logo h-28 w-full object-contain sm:h-32"
                        />
                        <div className="flex h-full items-center border-l border-white/15 pl-5">
                            <img
                                src="/HOST LOGO - LIGHT.png"
                                alt="Host: IPA Kerala State Branch"
                                className="snapshot-host-logo h-32 w-full object-contain sm:h-40"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd36a]">17-18 September 2026</p>
                            <h3 className="mt-1 text-2xl font-bold text-white">Pre-Congress Workshops</h3>
                        </div>
                        <p className="text-sm text-white/70">Two workshop venues in Ernakulam</p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {preCongressWorkshops.map((workshop) => (
                            <article key={workshop.title} className="snapshot-workshop-card relative overflow-hidden rounded-xl border border-white/15 bg-white/95 p-5 text-zinc-950 shadow-2xl sm:p-6">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#df0867]">Pre-Congress Workshops</p>
                                    <h4 className="mt-3 grid gap-3 text-xl font-bold leading-snug text-[#11145f]">
                                        {workshop.events.map((event) => (
                                            <span key={event.number} className="flex items-center gap-3">
                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#11145f] text-sm font-black text-white shadow-lg">
                                                    {String(event.number).padStart(2, '0')}
                                                </span>
                                                <span>{event.name}</span>
                                            </span>
                                        ))}
                                    </h4>
                                </div>
                                <dl className="mt-5 grid gap-3 border-t border-dashed border-zinc-200 pt-4 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wide text-zinc-500">Date</dt>
                                        <dd className="mt-1 text-sm font-semibold text-zinc-900">{workshop.date}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wide text-zinc-500">Venue</dt>
                                        <dd className="mt-1 text-sm font-semibold leading-5 text-zinc-900">{workshop.venue}</dd>
                                    </div>
                                </dl>
                            </article>
                        ))}
                    </div>

                    <div className="mb-4 mt-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd36a]">19-20 September 2026</p>
                            <h3 className="mt-1 text-2xl font-bold text-white">Main Congress Event</h3>
                        </div>
                        <p className="text-sm text-white/70">14th IPA National Students Congress</p>
                    </div>
                    <article className="snapshot-workshop-card snapshot-main-event relative overflow-hidden rounded-xl border border-white/20 bg-white p-5 text-zinc-950 shadow-2xl sm:p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-4">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#df0867] text-sm font-black text-white shadow-lg">06</span>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#df0867]">Main Event</p>
                                    <h3 className="mt-2 text-2xl font-bold leading-snug text-[#11145f]">14th IPA National Students Congress</h3>
                                    <p className="mt-2 text-sm text-zinc-600">Programs, competitions, scientific sessions, and cultural events.</p>
                                </div>
                            </div>
                            <dl className="grid shrink-0 gap-4 border-t border-dashed border-zinc-200 pt-4 sm:grid-cols-2 lg:min-w-[520px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-wide text-zinc-500">Date</dt>
                                    <dd className="mt-1 text-sm font-semibold text-zinc-900">{eventDate}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-wide text-zinc-500">Venue</dt>
                                    <dd className="mt-1 text-sm font-semibold leading-5 text-zinc-900">
                                        <span className="block">Toc-H Public School</span>
                                        <span className="block">Kochi, Kerala.</span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-wide text-zinc-500">Host</dt>
                                    <dd className="mt-1 text-sm font-semibold text-zinc-900">IPA Kerala Branch</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-wide text-zinc-500">In Association With</dt>
                                    <dd className="mt-1 text-sm font-semibold text-zinc-900">IPA Education Division &amp; IPA SF NEC</dd>
                                </div>
                            </dl>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}

function SponsorShowcase() {
    return (
        <section id="partners-and-sponsors" className="scroll-mt-24 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#df0867]">Partners &amp; Sponsors</p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-[#11145f] sm:text-4xl">
                        Proudly supported by our event partners
                    </h2>
                    <p className="mt-4 text-base leading-7 text-zinc-600">
                        We gratefully acknowledge the organizations supporting the 14th IPA National Students Congress.
                    </p>
                </div>

                <div className="mt-10 space-y-8">
                    {sponsorShowcase.map(({ tier, slots, accent }) => (
                        <div key={tier}>
                            <div className="mb-4 flex items-center gap-4">
                                <span className={`h-1 w-12 rounded-full bg-gradient-to-r ${accent}`} />
                                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#11145f]">{tier}</h3>
                                <span className="h-px flex-1 bg-zinc-200" />
                            </div>
                            {tier === 'Supporting Partners' ? (
                                <div className="supporting-partners-carousel">
                                    <div className="supporting-partners-track">
                                        {[0, 1].map((set) => (
                                            <div key={set} className="supporting-partners-group" aria-hidden={set === 1}>
                                                {supportingPartners.map((partner) => (
                                                    <div
                                                        key={`${set}-${partner.name}`}
                                                        className="group flex min-h-36 w-[260px] shrink-0 items-center justify-center rounded-2xl bg-zinc-50 p-6 shadow-sm ring-1 ring-zinc-200 transition duration-300 hover:bg-white hover:shadow-xl sm:w-[300px]"
                                                    >
                                                        <img
                                                            src={partner.logo}
                                                            alt={`${partner.name} logo`}
                                                            className="h-24 w-56 object-contain"
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className={`grid gap-4 ${slots === 1 ? 'mx-auto max-w-md' : 'md:grid-cols-2'}`}>
                                    {Array.from({ length: slots }, (_, index) => (
                                        <div
                                            key={`${tier}-${index}`}
                                            className="group flex min-h-36 items-center justify-center rounded-2xl bg-zinc-50 p-6 shadow-sm ring-1 ring-zinc-200 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                                        >
                                            <div className="text-center">
                                                <div className={`mx-auto mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${accent}`} />
                                                <p className="text-lg font-bold text-zinc-400 transition group-hover:text-[#11145f]">
                                                    Sponsor Logo
                                                </p>
                                                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                                    Coming soon
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

function AccommodationTravelPage() {
    const [content, setContent] = useState(accommodationTravelDefaults);
    const [showAllHotels, setShowAllHotels] = useState(false);

    useEffect(() => {
        apiRequest('accommodation-travel')
            .then(({ content: cmsContent }) => setContent(normalizeAccommodationCms(cmsContent)))
            .catch(() => setContent(accommodationTravelDefaults));
    }, []);

    const cmsContent = normalizeAccommodationCms(content);
    const visibleAccommodationSpaces = showAllHotels
        ? cmsContent.accommodationSpaces
        : cmsContent.accommodationSpaces.slice(0, 4);

    return (
        <>
            <section className="relative overflow-hidden bg-[#0d124f] text-white">
                <img
                    src="/images/nsc-kerala-hero.png"
                    alt="Kerala travel and delegate accommodation"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#090d42]/68" />
                <div className="relative mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 lg:px-8">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#ffd36a]">Delegate Planning</p>
                    <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">{cmsContent.pageTitle}</h1>
                    {cmsContent.intro && <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100">{cmsContent.intro}</p>}
                </div>
            </section>

            <div className="sticky top-14 z-20 border-b border-white/10 bg-[#080c38] shadow-md sm:top-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="flex overflow-x-auto" aria-label="Accommodation and travel sections" style={{ scrollbarWidth: 'none' }}>
                        {[
                            { label: 'Hotels & Stays', href: '#list-of-budget-hotels' },
                            { label: 'How to Reach', href: '#how-to-reach' },
                            { label: 'Nearby Places', href: '#tour-attractions' },
                            { label: 'Contact Person', href: '#contact-person' },
                        ].map(({ label, href }, index, items) => (
                            <a
                                key={href}
                                href={href}
                                className={`shrink-0 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white/65 transition hover:bg-white/5 hover:text-white${index < items.length - 1 ? ' border-r border-white/10' : ''}`}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            <section id="accommodation-and-travel" className="scroll-mt-24 bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div id="list-of-budget-hotels" className="scroll-mt-28">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#df0867]">Accommodation Spaces</p>
                            <h3 className="mt-2 text-2xl font-bold text-zinc-950">Hotel and stay list</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-zinc-200">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
                                <tr>
                                    <th className="px-4 py-3">Accommodation</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Distance</th>
                                    <th className="px-4 py-3">Tariff Plan</th>
                                    <th className="px-4 py-3">Contact</th>
                                    <th className="px-4 py-3">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 bg-white">
                                {visibleAccommodationSpaces.map((stay) => (
                                    <tr key={stay.name}>
                                        <td className="px-4 py-4 font-bold text-zinc-950">{stay.name}</td>
                                        <td className="px-4 py-4 text-zinc-700">{stay.type}</td>
                                        <td className="px-4 py-4 text-zinc-700">{stay.distance}</td>
                                        <td className="px-4 py-4 font-semibold text-emerald-800">{stay.tariff}</td>
                                        <td className="px-4 py-4 text-zinc-700">{stay.contact}</td>
                                        <td className="px-4 py-4 text-zinc-600">{stay.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {cmsContent.accommodationSpaces.length > 4 && (
                        <button
                            type="button"
                            onClick={() => setShowAllHotels((current) => !current)}
                            className="mt-4 rounded-lg bg-[#11145f] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#20257d]"
                        >
                            {showAllHotels ? 'Show fewer hotels' : 'View all hotels and stays'}
                        </button>
                    )}
                    <p id="tariff-plans" className="mt-3 scroll-mt-28 text-sm leading-6 text-zinc-600">{cmsContent.tariffNotes}</p>
                </div>

                <div id="pick-and-drop-points" className="mt-12 scroll-mt-28">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#df0867]">Pick &amp; Drop Points</p>
                    <h3 className="mt-2 text-2xl font-bold text-zinc-950">Nearest arrival and pickup points</h3>
                    <p id="how-to-reach" className="mt-3 scroll-mt-28 text-sm leading-6 text-zinc-600">{cmsContent.routeNotes}</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {cmsContent.pickupPoints.map((point, index) => (
                            <Reveal key={point.name} delay={index * 80}>
                                <article className="interactive-card rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">{point.type}</p>
                                            <h4 className="mt-2 text-lg font-bold text-zinc-950">{point.name}</h4>
                                        </div>
                                        <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-zinc-700 ring-1 ring-zinc-200">{point.distance}</span>
                                    </div>
                                    <div className="mt-4 grid gap-2 text-sm text-zinc-700">
                                        <p><span className="font-bold text-zinc-950">Estimated travel:</span> {point.eta}</p>
                                        <p><span className="font-bold text-zinc-950">Pickup note:</span> {point.instruction}</p>
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <div id="tour-attractions" className="mt-12 scroll-mt-28">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#df0867]">Tour Attractions</p>
                    <h3 className="mt-2 text-2xl font-bold text-zinc-950">Nearby places to visit</h3>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {cmsContent.touristAttractions.map((place, index) => (
                            <Reveal key={place.name} delay={index * 80}>
                                <article className="interactive-card flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                                    {place.image && (
                                        <img
                                            src={place.image}
                                            alt={place.name}
                                            className="h-40 w-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    )}
                                    <div className="flex flex-1 flex-col p-5">
                                        <span className="w-fit rounded-lg bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800 ring-1 ring-emerald-100">
                                            {place.category}
                                        </span>
                                        <h4 className="mt-4 text-lg font-bold text-zinc-950">{place.name}</h4>
                                        <p className="mt-2 text-sm font-semibold text-[#11145f]">{place.distance}</p>
                                        <p className="mt-3 text-sm leading-6 text-zinc-600">{place.description}</p>
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <div id="contact-person" className="mt-12 scroll-mt-28 rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Contact Person</p>
                    <p className="mt-2 text-lg font-bold text-zinc-950">{cmsContent.contactPerson}</p>
                </div>
            </div>
            </section>
        </>
    );
}

function HomeWelcome() {
    return (
        <section id="home-welcome" className="event-soft-section py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#df0867]">Welcome Message</p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-[#11145f] sm:text-4xl">
                        Welcome to the 14th IPA National Students Congress
                    </h2>
                    <div className="mt-4 space-y-4 text-base leading-7 text-zinc-600">
                        <p>
                            Welcome to the official web portal of the 14th IPA National Students Congress. This premier annual event is proudly hosted by the Indian Pharmaceutical Association (IPA) Kerala State Branch, alongside the IPA Students&apos; Forum (IPASF). We welcome pharmacy students, respected educators, and industry experts from across the country to connect, learn, and grow together.
                        </p>
                        <p>
                            This year&apos;s congress features a dynamic scientific program, competitive student events, expert speakers, and valuable placement drives. The 14th IPA National Students Congress offers a unique space to showcase your research, test your skills, and build lifelong networks. We invite you to explore our sessions, submit your abstracts, and join us in making this event an outstanding success.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                        <span className="rounded-full bg-[#e7f5ec] px-4 py-2 text-[#00652f]">IPA Kerala</span>
                        <span className="rounded-full bg-[#fff0f6] px-4 py-2 text-[#b70758]">14th IPA National Students Congress 2026</span>
                        <span className="rounded-full bg-[#fff7df] px-4 py-2 text-[#8a5700]">{eventDate}</span>
                    </div>
                </div>
                <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-[#11145f]/10">
                    <img
                        src="/images/nsc-welcome-delegates.png"
                        alt="Delegates and students at the 14th IPA National Students Congress"
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                    />
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
    const [programCatalog, setProgramCatalog] = useState([]);
    const [categoryCatalog, setCategoryCatalog] = useState([]);

    useEffect(() => {
        apiRequest('programs')
            .then(({ programs, categories }) => {
                setProgramCatalog(programs || []);
                setCategoryCatalog(categories || []);
            })
            .catch(() => {
                setProgramCatalog([]);
                setCategoryCatalog([]);
            });
    }, []);

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

    const registrationCategories = categoryCatalog.length
        ? categoryCatalog
        : categoryOptions.map((name, index) => ({ id: `fallback-${index}`, name, registrationFee: categoryFees[name] || 0 }));
    const selectedCategory = registrationCategories.find((category) => category.name === formData.category);
    const priceProgramForCategory = (program) => {
        if (!program.categoryPricing) return program;
        const categoryPrice = program.categoryPricing.find((item) => String(item.categoryId) === String(selectedCategory?.id));
        return categoryPrice?.isAvailable ? { ...program, price: categoryPrice.price } : null;
    };
    const competitionPrograms = formData.category
        ? (programCatalog.length
            ? programCatalog.filter((program) => program.type === 'competition').map(priceProgramForCategory).filter(Boolean)
            : competitionOptions.map((name) => ({ name, price: 100, description: '' })))
        : [];
    const workshopPrograms = formData.category
        ? (programCatalog.length
            ? programCatalog.filter((program) => program.type === 'workshop').map(priceProgramForCategory).filter(Boolean)
            : workshopOptions.map((name) => ({ name, price: workshopFees[name] || 0, description: '' })))
        : [];

    const totals = useMemo(() => {
        const registrationFee = selectedCategory?.registrationFee || 0;
        const competitionFee = formData.studentCompetitions.reduce(
            (total, name) => total + (competitionPrograms.find((program) => program.name === name)?.price || 0),
            0
        );
        const workshopFee = formData.selectedWorkshops.reduce(
            (total, name) => total + (workshopPrograms.find((program) => program.name === name)?.price || 0),
            0
        );

        return {
            registrationFee,
            competitionFee,
            workshopFee,
            total: registrationFee + competitionFee + workshopFee,
        };
    }, [formData.category, formData.studentCompetitions, formData.selectedWorkshops, programCatalog, categoryCatalog]);

    function updateField(name, value) {
        setFormData((current) => ({ ...current, [name]: value }));
        setNotice('');
    }

    function updateRegistrationCategory(value) {
        setFormData((current) => ({
            ...current,
            category: value,
            studentCompetitions: [],
            selectedWorkshops: [],
            preConferenceWorkshop: '',
        }));
        setNotice(value ? 'Category changed. Program options and prices have been refreshed.' : '');
    }

    function downloadGroupTemplate() {
        const csv = `${groupMemberColumns.map(([, label]) => `"${label}"`).join(',')}\r\n`;
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'group-registration-student-template.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    async function uploadGroupSheet(file) {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.csv')) {
            setNotice('Upload the completed CSV template. Excel can save the template as CSV.');
            return;
        }

        try {
            const rows = parseCsv(await file.text());
            if (rows.length < 2) throw new Error('The uploaded sheet does not contain any student rows.');
            const headerIndexes = Object.fromEntries(
                groupMemberColumns.map(([key, label]) => [key, rows[0].findIndex((header) => normalizeCsvHeader(header) === normalizeCsvHeader(label))])
            );
            if (headerIndexes.name < 0) throw new Error('The sheet must contain the Name column from the template.');

            const groupMembers = rows.slice(1).map((cells) => Object.fromEntries(
                groupMemberColumns.map(([key]) => [key, headerIndexes[key] >= 0 ? String(cells[headerIndexes[key]] || '').trim() : ''])
            )).filter((member) => member.name);
            if (!groupMembers.length) throw new Error('No student names were found in the uploaded sheet.');

            setFormData((current) => ({
                ...current,
                groupMembers,
                expectedParticipants: String(groupMembers.length),
            }));
            setNotice(`${groupMembers.length} students imported from the group sheet.`);
        } catch (error) {
            setNotice(error.message);
        }
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

    function toggleWorkshop(name) {
        setFormData((current) => {
            const selectedWorkshops = current.selectedWorkshops.includes(name)
                ? current.selectedWorkshops.filter((workshop) => workshop !== name)
                : [...current.selectedWorkshops, name];
            return { ...current, selectedWorkshops, preConferenceWorkshop: selectedWorkshops[0] || '' };
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
        if (!formData.hrCollegeWithState.trim() || !formData.hrCourseOrQualification.trim()
            || !formData.hrWhatsappNumber.trim() || !formData.hrWhatsappConfirmation.trim()
            || !formData.hrEmail.trim() || !formData.hrEmailConfirmation.trim() || !formData.hrCoreArea) {
            setActiveTab('hr-drive');
            setNotice('Complete all HR Drive fields before submitting.');
            return;
        }
        if (formData.hrWhatsappNumber.trim() !== formData.hrWhatsappConfirmation.trim()) {
            setActiveTab('hr-drive');
            setNotice('The HR Drive WhatsApp numbers do not match.');
            return;
        }
        if (formData.hrEmail.trim().toLowerCase() !== formData.hrEmailConfirmation.trim().toLowerCase()) {
            setActiveTab('hr-drive');
            setNotice('The HR Drive email addresses do not match.');
            return;
        }

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
                    alt="Delegates at the 14th IPA National Students Congress registration venue"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-950/65" />
                <div className="relative mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 lg:px-8">
                    <p className="text-sm font-bold uppercase text-amber-300">Registration</p>
                    <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
                        14th IPA National Students Congress 2026 early bird registration
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100">
                        Complete each section tab by tab. Save your general details, competitions, workshops,
                        presentation choice, payment details, and final confirmation in one guided flow.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                        <span className="rounded-lg bg-white/12 px-3 py-2 ring-1 ring-white/20">{eventDate}</span>
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
                                        onChange={(event) => updateRegistrationCategory(event.target.value)}
                                    >
                                        <option value="">Choose category</option>
                                        {registrationCategories.map((category) => (
                                            <option key={category.id} value={category.name}>
                                                {category.name} - Rs. {category.registrationFee.toLocaleString('en-IN')}
                                            </option>
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
                                        onChange={(event) => updateRegistrationCategory(event.target.value)}
                                    >
                                        <option value="">Choose category</option>
                                        {registrationCategories.map((category) => (
                                            <option key={category.id} value={category.name}>
                                                {category.name} - Rs. {category.registrationFee.toLocaleString('en-IN')}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 md:col-span-2">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-emerald-950">Student roster sheet</p>
                                            <p className="mt-1 text-sm leading-6 text-emerald-800">Download the CSV template, complete it in Excel or Google Sheets, then upload it here.</p>
                                        </div>
                                        <div className="flex shrink-0 flex-wrap gap-2">
                                            <button type="button" onClick={downloadGroupTemplate} className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100">
                                                Download template
                                            </button>
                                            <label className="cursor-pointer rounded-lg bg-emerald-800 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-900">
                                                Upload completed CSV
                                                <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => uploadGroupSheet(event.target.files?.[0])} />
                                            </label>
                                        </div>
                                    </div>
                                    {formData.groupMembers.length > 0 && (
                                        <div className="mt-4 overflow-hidden rounded-lg border border-emerald-200 bg-white">
                                            <div className="flex items-center justify-between px-3 py-2 text-sm">
                                                <span className="font-bold text-zinc-900">{formData.groupMembers.length} students imported</span>
                                                <button type="button" onClick={() => updateField('groupMembers', [])} className="font-semibold text-rose-700">Remove sheet</button>
                                            </div>
                                            <div className="max-h-40 overflow-auto border-t border-emerald-100">
                                                {formData.groupMembers.slice(0, 10).map((member, index) => (
                                                    <div key={`${member.email}-${index}`} className="flex justify-between gap-4 border-b border-zinc-100 px-3 py-2 text-xs last:border-0">
                                                        <span className="font-semibold text-zinc-800">{index + 1}. {member.name}</span>
                                                        <span className="text-zinc-500">{member.email || member.whatsapp || '-'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                                            <option value="Pharm.D">Pharm.D</option>
                                            <option value="M.Pharm">M.Pharm</option>
                                            <option value="D.Pharm">D.Pharm</option>
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
                                    <p className="mt-1 text-sm text-zinc-500">Select a maximum of 2 events. Pricing is configured by the event administrator.</p>
                                    {!formData.category ? (
                                        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Select a category in the General step to view available competitions and prices.</p>
                                    ) : competitionPrograms.length ? (
                                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                                        {competitionPrograms.map((program) => {
                                            const checked = formData.studentCompetitions.includes(program.name);
                                            const disabled = !checked && formData.studentCompetitions.length >= 2;

                                            return (
                                                <label
                                                    key={program.name}
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
                                                        onChange={() => toggleCompetition(program.name)}
                                                    />
                                                    <span>{program.name}</span>
                                                    <span className="ml-2 text-xs font-bold text-emerald-700">{program.price ? `Rs. ${program.price.toLocaleString('en-IN')}` : 'Free'}</span>
                                                    {program.description && <span className="mt-1 block pl-6 text-xs font-normal text-zinc-500">{program.description}</span>}
                                                </label>
                                            );
                                        })}
                                        </div>
                                    ) : (
                                        <p className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">No student competitions are available for this category.</p>
                                    )}
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
                                    {!formData.category ? (
                                        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Select a category in the General step to view available workshops and prices.</p>
                                    ) : workshopPrograms.length ? (
                                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                                        {workshopPrograms.map((program) => (
                                            <label
                                                key={program.name}
                                                className={`rounded-lg border p-4 text-sm font-bold ${
                                                    formData.selectedWorkshops.includes(program.name)
                                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                                        : 'border-zinc-200 bg-white text-zinc-700'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={formData.selectedWorkshops.includes(program.name)}
                                                    onChange={() => toggleWorkshop(program.name)}
                                                />
                                                <span>{program.name}</span>
                                                <span className="ml-2 text-xs font-bold text-emerald-700">{program.price ? `Rs. ${program.price.toLocaleString('en-IN')}` : 'Free'}</span>
                                                {program.description && <span className="mt-1 block pl-6 text-xs font-normal text-zinc-500">{program.description}</span>}
                                            </label>
                                        ))}
                                        </div>
                                    ) : (
                                        <p className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">No workshops are available for this category.</p>
                                    )}
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

                        {activeTab === 'hr-drive' && (
                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <label className={`${labelClass} md:col-span-2`}>
                                    Name of College Studying or Last Studied (in capital letters) with State
                                    <input
                                        className={fieldClass}
                                        value={formData.hrCollegeWithState}
                                        onChange={(event) => updateField('hrCollegeWithState', event.target.value.toUpperCase())}
                                        placeholder="ABC COLLEGE OF PHARMACY, KERALA"
                                    />
                                </label>
                                <label className={`${labelClass} md:col-span-2`}>
                                    Course and Year of Study or Highest Qualification (if passed out)
                                    <input
                                        className={fieldClass}
                                        value={formData.hrCourseOrQualification}
                                        onChange={(event) => updateField('hrCourseOrQualification', event.target.value)}
                                        placeholder="B.Pharm, 4th Year or M.Pharm"
                                    />
                                </label>
                                <label className={labelClass}>
                                    WhatsApp Number
                                    <input
                                        className={fieldClass}
                                        type="tel"
                                        value={formData.hrWhatsappNumber}
                                        onChange={(event) => updateField('hrWhatsappNumber', event.target.value)}
                                        placeholder="+91 9876543210"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Confirm WhatsApp Number
                                    <input
                                        className={fieldClass}
                                        type="tel"
                                        value={formData.hrWhatsappConfirmation}
                                        onChange={(event) => updateField('hrWhatsappConfirmation', event.target.value)}
                                        placeholder="Re-enter WhatsApp number"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Email ID <span className="text-rose-600">*</span>
                                    <input
                                        className={fieldClass}
                                        type="email"
                                        required
                                        value={formData.hrEmail}
                                        onChange={(event) => updateField('hrEmail', event.target.value.toLowerCase())}
                                        placeholder="name@example.com"
                                    />
                                </label>
                                <label className={labelClass}>
                                    Confirm Email ID <span className="text-rose-600">*</span>
                                    <input
                                        className={fieldClass}
                                        type="email"
                                        required
                                        value={formData.hrEmailConfirmation}
                                        onChange={(event) => updateField('hrEmailConfirmation', event.target.value.toLowerCase())}
                                        placeholder="Re-enter email address"
                                    />
                                </label>
                                <label className={`${labelClass} md:col-span-2`}>
                                    Select the core area of your preference
                                    <select
                                        className={fieldClass}
                                        value={formData.hrCoreArea}
                                        onChange={(event) => updateField('hrCoreArea', event.target.value)}
                                    >
                                        <option value="">Choose</option>
                                        {hrCoreAreaOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </label>
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
                                        ['Uploaded Student Roster', `${formData.groupMembers.length} students`],
                                        ['Primary Category', formData.category || 'Not selected'],
                                        ['College Detail', formData.collegeWithState || 'Not entered'],
                                        ['Competitions', formData.studentCompetitions.join(', ') || 'None'],
                                        ['Workshops', formData.selectedWorkshops.join(', ') || 'Not selected'],
                                        ['Presentation', formData.presentationType || 'Not selected'],
                                        ['HR College', formData.hrCollegeWithState || 'Not entered'],
                                        ['HR Course / Qualification', formData.hrCourseOrQualification || 'Not entered'],
                                        ['HR WhatsApp', formData.hrWhatsappNumber || 'Not entered'],
                                        ['HR Email', formData.hrEmail || 'Not entered'],
                                        ['Preferred Core Area', formData.hrCoreArea || 'Not selected'],
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
                                        ['Workshops', formData.selectedWorkshops.join(', ') || 'Not selected'],
                                        ['Presentation', formData.presentationType || 'Not selected'],
                                        ['HR College', formData.hrCollegeWithState || 'Not entered'],
                                        ['HR Course / Qualification', formData.hrCourseOrQualification || 'Not entered'],
                                        ['HR WhatsApp', formData.hrWhatsappNumber || 'Not entered'],
                                        ['HR Email', formData.hrEmail || 'Not entered'],
                                        ['Preferred Core Area', formData.hrCoreArea || 'Not selected'],
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
                                    14th IPA National Students Congress 2026 - {isGroupRegistration ? 'Group Registration' : 'Early Bird Registration'}
                                </p>
                                <h3 className="mt-3 text-2xl font-bold text-emerald-950">Your response has been recorded.</h3>
                                <p className="mt-3 text-sm leading-6 text-emerald-900">
                                    Registration number: <span className="font-bold">{formData.registrationNumber || 'Generated after submit'}</span>
                                </p>
                                <p className="mt-2 text-sm leading-6 text-emerald-900">
                                    Approval status: <span className="font-bold">{formData.approvalStatus === 'approved' ? 'Approved' : 'Pending admin review'}</span>
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
                        Partner with the 14th IPA National Students Congress 2026
                    </h1>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-100">
                        Choose premium packages, standalone opportunities, and e-Souvenir advertising, then submit
                        your organization and payment details in one guided application.
                    </p>
                    <p className="mt-5 inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-bold ring-1 ring-white/20">
                        {eventDate}
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
                                    <div className="grid gap-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 md:col-span-2 lg:grid-cols-[1fr_340px] lg:items-start lg:p-6">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Payment Collection</p>
                                            <h3 className="mt-2 text-xl font-bold text-emerald-950">PHARMA FIRST</h3>
                                            <div className="mt-4 rounded-lg border border-emerald-200 bg-white p-4 text-sm leading-7 text-zinc-700">
                                                <p><span className="font-semibold text-zinc-950">Current A/C:</span> 31140200001427</p>
                                                <p><span className="font-semibold text-zinc-950">IFSC:</span> BARB0MUVATT</p>
                                                <p><span className="font-semibold text-zinc-950">Branch:</span> Muvattupuzha</p>
                                                <p><span className="font-semibold text-zinc-950">MICR:</span> 686012252</p>
                                            </div>
                                            <div className="mt-4 rounded-lg bg-emerald-900 px-4 py-3 text-white">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Verified UPI ID</p>
                                                <p className="mt-1 break-all font-mono text-sm font-bold">pharm94460427@barodampay</p>
                                            </div>
                                            <p className="mt-4 text-sm leading-6 text-emerald-900">Scan using any UPI or CBDC payment app, then enter the transaction reference and upload the receipt below.</p>
                                        </div>
                                        <figure className="rounded-xl border border-emerald-200 bg-white p-3 shadow-sm">
                                            <img src="/sponsor-payment-qr.jpg" alt="Verified PHARMA FIRST Bank of Baroda UPI payment QR code" className="mx-auto h-auto w-full max-w-xs rounded-lg" loading="lazy" />
                                            <figcaption className="mt-3 text-center">
                                                <p className="text-xs font-bold text-zinc-800">Bank of Baroda Verified Merchant</p>
                                                <a href="/pharm94460427@barodampayVerified%20Merchant.pdf" target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-semibold text-emerald-700 underline">Open verified merchant PDF</a>
                                            </figcaption>
                                        </figure>
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
        <section id="programs-and-events-spotlight" className="programs-events-section scroll-mt-24 py-10 text-white sm:py-12">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
    const teams = section.pages.slice(1);
    const teamPairs = Array.from({ length: Math.ceil(teams.length / 2) }, (_, index) =>
        teams.slice(index * 2, index * 2 + 2)
    );
    const [activePair, setActivePair] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActivePair((current) => (current + 1) % teamPairs.length);
        }, 5000);

        return () => window.clearInterval(interval);
    }, [teamPairs.length]);

    function showPreviousPair() {
        setActivePair((current) => (current - 1 + teamPairs.length) % teamPairs.length);
    }

    function showNextPair() {
        setActivePair((current) => (current + 1) % teamPairs.length);
    }

    return (
        <section id="organizing-team" className="event-team-section scroll-mt-24 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-sm font-bold uppercase text-[#df0867]">Organizing Team</p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-[#11145f] sm:text-4xl">
                        Committee, advisors, IPA groups, partners, and sponsors.
                    </h2>
                    <p className="mt-4 text-base leading-7 text-zinc-600">
                        Key leadership groups and support teams helping coordinate the 14th IPA National Students Congress.
                    </p>
                </div>
                <div className="mt-8">
                    <div className="organizing-team-stage">
                        <div
                            key={`shadow-${activePair}`}
                            className={`organizing-team-box-shadow ${
                                activePair % 2 === 0 ? 'organizing-team-shadow-from-top' : 'organizing-team-shadow-from-bottom'
                            }`}
                            aria-hidden="true"
                        />
                        <div
                            key={activePair}
                            className={`organizing-team-box ${
                                activePair % 2 === 0 ? 'organizing-team-box-from-top' : 'organizing-team-box-from-bottom'
                            }`}
                        >
                            <div className="organizing-team-box-face grid items-stretch gap-4 sm:grid-cols-2">
                                {teamPairs[activePair].map((item, pairIndex) => {
                                    const index = activePair * 2 + pairIndex;

                                    return (
                                        <div
                                            key={item}
                                            id={slugify(item)}
                                            className="group relative flex h-full min-h-64 scroll-mt-28 flex-col overflow-hidden rounded-xl bg-white/95 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-[#11145f]/10"
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
                                            <div className="mt-auto pt-5">
                                                <div className="h-px bg-zinc-100" />
                                            <a
                                                href={`#${slugify(item)}`}
                                                className="mt-4 inline-flex text-sm font-bold text-emerald-700 hover:text-emerald-900"
                                            >
                                                View details
                                            </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="organizing-team-box-edge" aria-hidden="true" />
                            <div className="organizing-team-box-gloss" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2" aria-label="Organizing team slides">
                            {teamPairs.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setActivePair(index)}
                                    className={`h-2.5 rounded-full transition-all ${
                                        activePair === index ? 'w-8 bg-[#df0867]' : 'w-2.5 bg-[#11145f]/20 hover:bg-[#11145f]/40'
                                    }`}
                                    aria-label={`Show organizing team cards ${index * 2 + 1} and ${index * 2 + 2}`}
                                    aria-current={activePair === index ? 'true' : undefined}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={showPreviousPair}
                                className="rounded-lg border border-[#11145f]/15 bg-white px-4 py-2 text-sm font-bold text-[#11145f] shadow-sm hover:bg-[#11145f] hover:text-white"
                                aria-label="Show previous organizing teams"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={showNextPair}
                                className="rounded-lg bg-[#11145f] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#20257d]"
                                aria-label="Show next organizing teams"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SponsorSection() {
    return (
        <section id="become-a-sponsor" className="event-soft-section scroll-mt-24 py-16">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                <Reveal>
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase text-[#df0867]">Become a Sponsor</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight text-[#11145f] sm:text-4xl">
                            Put your brand in front of India&apos;s next generation of pharmacy leaders.
                        </h2>
                        <p className="mt-5 text-base leading-8 text-zinc-600">
                            Partner with the 14th IPA National Students Congress to connect with pharmacy students,
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
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="/sponsor-registration"
                                className="button-pop inline-flex justify-center rounded-lg bg-[#df0867] px-5 py-3 text-sm font-bold text-white hover:bg-[#bd0758]"
                            >
                                Become a Sponsor
                            </a>
                            <a
                                href="/sponsorship-brochure.pdf"
                                download="14th-IPA-NSC-Sponsorship-Brochure.pdf"
                                className="button-pop inline-flex justify-center rounded-lg border border-[#11145f]/20 bg-white px-5 py-3 text-sm font-bold text-[#11145f] shadow-sm hover:border-[#11145f] hover:bg-[#11145f] hover:text-white"
                            >
                                Sponsorship Brochure
                            </a>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={140}>
                    <div className="overflow-hidden rounded-lg bg-zinc-100 shadow-2xl ring-1 ring-zinc-200">
                        <img
                            src="/images/nsc-sponsor-exhibition.png"
                            alt="Sponsor representatives speaking with student delegates at an exhibition booth"
                            className="h-[360px] w-full object-cover sm:h-[440px]"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function Contact() {
    return (
        <footer className="event-footer relative overflow-hidden text-white">
            <div className="event-footer-glow event-footer-glow-left" aria-hidden="true" />
            <div className="event-footer-glow event-footer-glow-right" aria-hidden="true" />

            <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
                    <div>
                        <div className="flex max-w-2xl items-center gap-6 rounded-2xl bg-white/8 p-6 backdrop-blur-md ring-1 ring-white/12">
                            <img
                                src="/14th NSC LOGO - LIGHT.png"
                                alt="14th IPA National Students Congress"
                                className="h-28 min-w-0 flex-1 object-contain sm:h-32"
                            />
                            <span className="h-28 w-px shrink-0 bg-white/15" />
                            <img
                                src="/HOST LOGO - LIGHT.png"
                                alt="Host: IPA Kerala State Branch"
                                className="h-28 w-36 object-contain sm:h-32 sm:w-44"
                            />
                        </div>
                        <p className="mt-6 max-w-xl text-sm leading-7 text-white/65">
                            Bringing pharmacy students, educators, researchers, and industry leaders together in Kerala
                            for learning, innovation, and meaningful professional connections.
                        </p>
                        <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#df0867]/20 px-4 py-2 text-sm font-bold text-white ring-1 ring-[#df0867]/40">
                            <span className="size-2 rounded-full bg-[#ffd36a]" />
                            {eventDate}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd36a]">Quick Links</p>
                        <nav className="mt-5 grid gap-3 text-sm" aria-label="Footer navigation">
                            {[
                                ['Home', '#home'],
                                ['Event Snapshot', '#important-dates'],
                                ['Accommodation & Travel', '/accommodation-travel'],
                                ['Partners & Sponsors', '#partners-and-sponsors'],
                                ['Organizing Team', '#organizing-team'],
                                ['Registration', '/registration'],
                                ['Become a Sponsor', '/sponsor-registration'],
                            ].map(([label, href]) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="group flex items-center gap-3 font-semibold text-white/70 transition hover:translate-x-1 hover:text-white"
                                >
                                    <span className="h-px w-4 bg-[#df0867] transition-all group-hover:w-7" />
                                    {label}
                                </a>
                            ))}
                        </nav>
                    </div>

                </div>

                <div className="mt-10 border-t border-white/10 pt-8">
                    <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="grid h-full grid-rows-[1fr_auto] gap-4">
                            <section className="rounded-2xl bg-white/8 p-5 ring-1 ring-white/12 sm:p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd36a]">Address for Correspondence</p>
                                <div className="mt-4 text-sm leading-7 text-white/75">
                                    <p className="font-bold text-white">Dr. John Joseph</p>
                                    <p>Organizing Secretary</p>
                                    <address className="mt-2 not-italic">
                                        C/o Lisie College of Pharmacy,<br />
                                        Vennala High School Road,<br />
                                        Kochi, Pin - 682028,<br />
                                        Kerala, India.
                                    </address>
                                </div>
                            </section>

                            <section className="rounded-2xl bg-[#df0867]/15 p-5 ring-1 ring-[#df0867]/35 sm:p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd36a]">Official Email</p>
                                <a href="mailto:ipakeralastate@gmail.com" className="mt-3 block break-all text-base font-bold text-white underline decoration-[#df0867] decoration-2 underline-offset-4 hover:text-[#ffd36a]">
                                    ipakeralastate@gmail.com
                                </a>
                            </section>
                        </div>

                        <div className="grid h-full grid-rows-3 gap-4">
                            {[
                                ['Chairperson LOC', 'Dr. P Jayasekhar', '+91 82810 36121', '+918281036121'],
                                ['Secretary LOC', 'Dr. John Joseph', '+91 98461 68636', '+919846168636'],
                                ['Chair - Digital Media', 'Mr. Prasanth Kumar M', '+91 97473 65858', '+919747365858'],
                            ].map(([role, name, phone, phoneHref]) => (
                                <section key={role} className="flex flex-col justify-center rounded-xl bg-white/8 p-5 ring-1 ring-white/12 transition hover:bg-white/12">
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#df8abb]">{role}</p>
                                    <p className="mt-3 text-base font-bold text-white">{name}</p>
                                    <a href={`tel:${phoneHref}`} className="mt-2 inline-block text-sm font-semibold text-white/70 hover:text-[#ffd36a]">{phone}</a>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; 2026 14th IPA National Students Congress. All rights reserved.</p>
                    <p className="inline-flex items-center gap-2">
                        Designed &amp; Developed by
                        <a
                            href="https://signtechinm.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-lg bg-[#fffdf7] px-2.5 py-1.5 shadow-lg ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
                            aria-label="Visit Signtech Info and Marketing"
                        >
                            <img
                                src="/signtech.png"
                                alt="Signtech Info and Marketing"
                                className="h-6 w-auto object-contain sm:h-7"
                            />
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

function AdminLoginPage() {
    const [theme, toggleTheme] = useAdminTheme();
    const [login, setLogin] = useState('');
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
                body: JSON.stringify({ login, password }),
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
                    <img src="/14th NSC LOGO - DARK.png" alt="14th IPA National Students Congress logo" className="admin-logo h-24 w-auto rounded-lg bg-white p-2" />
                    <p className="mt-8 text-sm font-bold uppercase text-amber-300">Admin Panel</p>
                    <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Secure event operations for the 14th IPA National Students Congress 2026.</h1>
                    <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                        Manage registrations, payments, programs, users, roles, permissions, reports, and winner publishing from one protected backend.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="admin-card rounded-lg bg-white p-6 text-zinc-950 shadow-2xl">
                    <h2 className="text-2xl font-bold">Admin login</h2>
                    <p className="mt-2 text-sm text-zinc-600">Sign in with your username or email.</p>
                    <label className="mt-6 block text-sm font-semibold text-zinc-800">
                        Username or email
                        <input
                            className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                            type="text"
                            autoComplete="username"
                            value={login}
                            onChange={(event) => setLogin(event.target.value)}
                        />
                    </label>
                    <label className="mt-4 block text-sm font-semibold text-zinc-800">
                        Password
                        <input
                            className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                            type="password"
                            autoComplete="current-password"
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
        categories: (
            <>
                <path d="M4 5h6v6H4V5Z" />
                <path d="M14 5h6v6h-6V5Z" />
                <path d="M4 15h6v4H4v-4Z" />
                <path d="M14 15h6v4h-6v-4Z" />
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
        accommodation: (
            <>
                <path d="M4 11.5 12 5l8 6.5" />
                <path d="M6 10.5V20h12v-9.5" />
                <path d="M9 20v-5h6v5" />
                <path d="M9 9.5h6" />
            </>
        ),
        scientific: (
            <>
                <path d="M9 3h6" />
                <path d="M10 3v5l-5 9a2.5 2.5 0 0 0 2.2 4h9.6a2.5 2.5 0 0 0 2.2-4l-5-9V3" />
                <path d="M7.5 15h9" />
                <path d="M9.5 12h5" />
            </>
        ),
        abstracts: (
            <>
                <path d="M6 3h9l4 4v14H6V3Z" />
                <path d="M15 3v5h4" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
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

const adminModules = [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview of registrations, payments, and event operations.' },
    { id: 'registrations', label: 'Registrations', description: 'Review delegate registrations, drafts, and contact details.' },
    { id: 'payments', label: 'Payments', description: 'Track collections, pending payments, and reconciliation.' },
    { id: 'categories', label: 'Categories', description: 'Create registration categories and configure their base registration fees.' },
    { id: 'programs', label: 'Programs', description: 'Manage event programs, schedules, and capacities.' },
    { id: 'students', label: 'Students', description: 'Maintain student and institution records.' },
    { id: 'pricing', label: 'Pricing', description: 'Configure registration, competition, and workshop fees.' },
    { id: 'winners', label: 'Winners', description: 'Prepare and publish competition results.' },
    { id: 'reports', label: 'Reports', description: 'Generate operational and financial reports.' },
    { id: 'accommodation', label: 'Accommodation CMS', description: 'Publish stays, pickup points, and travel guidance.' },
    { id: 'users', label: 'Users & Roles', description: 'Manage admin accounts, roles, and permissions.' },
    { id: 'audit', label: 'Audit Logs', description: 'Review important administrative activity.' },
    { id: 'scientific', label: 'Scientific Content', description: 'Manage scientific page content and resources.' },
    { id: 'abstracts', label: 'Abstracts CMS', description: 'Manage student abstracts and the published abstract book.' },
];

const adminNavigationGroups = [
    { label: 'Overview', modules: ['dashboard'] },
    { label: 'Registration', modules: ['registrations', 'students'] },
    { label: 'Event Setup', modules: ['categories', 'programs', 'pricing'] },
    { label: 'Content', modules: ['abstracts', 'scientific', 'winners', 'accommodation'] },
    { label: 'Reports', modules: ['reports', 'payments'] },
    { label: 'Administration', modules: ['users', 'audit'] },
];

const accommodationAdminSections = [
    { id: 'spaces', label: 'Accommodation Spaces', description: 'Manage hotel, stay type, tariff, contact, and notes rows.' },
    { id: 'pickup-points', label: 'Pickup Points', description: 'Manage arrival points, distance, travel time, and pickup instructions.' },
    { id: 'tourist-attractions', label: 'Tourist Attractions', description: 'Manage nearby places to visit, descriptions, and photos.' },
    { id: 'settings', label: 'Settings', description: 'Manage page headings, desk contact details, and travel notes.' },
];

const abstractsAdminSections = [
    { id: 'student-abstracts', label: 'Student Abstracts', description: 'Review uploaded student abstracts, approval status, and poster video review.' },
    { id: 'abstract-book', label: 'Abstract Book Submission', description: 'Upload or replace the final abstract book PDF shown on the public scientific page.' },
];

const implementedAdminModules = new Set(['dashboard', 'registrations', 'students', 'payments', 'categories', 'pricing', 'programs', 'users', 'accommodation', 'scientific', 'abstracts']);

function registrationStatusBadgeClass(status) {
    if (status === 'submitted') return 'bg-emerald-100 text-emerald-800';
    if (status === 'draft') return 'bg-amber-100 text-amber-800';
    return 'bg-zinc-100 text-zinc-700';
}

function paymentStatusBadgeClass(status) {
    if (status === 'success') return 'bg-emerald-100 text-emerald-800';
    if (status === 'failed') return 'bg-red-100 text-red-700';
    if (status === 'refunded') return 'bg-zinc-100 text-zinc-700';
    return 'bg-amber-100 text-amber-800';
}

function approvalStatusBadgeClass(status) {
    if (status === 'approved') return 'bg-emerald-100 text-emerald-800';
    if (['cancelled', 'rejected'].includes(status)) return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-800';
}

function formatAdminStatus(status) {
    return String(status || '-').replaceAll('_', ' ');
}

function getAdminModuleFromPath() {
    const requestedModule = window.location.pathname.split('/')[2] || 'dashboard';
    return adminModules.some((module) => module.id === requestedModule) ? requestedModule : 'dashboard';
}

function getAccommodationAdminSectionFromPath() {
    const requestedSection = window.location.pathname.split('/')[3] || 'settings';
    return accommodationAdminSections.some((section) => section.id === requestedSection) ? requestedSection : 'settings';
}

function getAbstractsAdminSectionFromPath() {
    const requestedSection = window.location.pathname.split('/')[3] || 'student-abstracts';
    return abstractsAdminSections.some((section) => section.id === requestedSection) ? requestedSection : 'student-abstracts';
}

function AdminPage() {
    const [theme, toggleTheme] = useAdminTheme();
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const activeModule = getAdminModuleFromPath();
    const activeAbstractsSection = activeModule === 'abstracts' ? getAbstractsAdminSectionFromPath() : 'student-abstracts';
    const [openAdminDropdown, setOpenAdminDropdown] = useState(['accommodation', 'abstracts'].includes(activeModule) ? activeModule : '');
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
    const [registrations, setRegistrations] = useState([]);
    const [registrationsLoading, setRegistrationsLoading] = useState(false);
    const [registrationsError, setRegistrationsError] = useState('');
    const [registrationSearch, setRegistrationSearch] = useState('');
    const [paymentSearch, setPaymentSearch] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [paymentStatusDraft, setPaymentStatusDraft] = useState('pending');
    const [paymentUpdating, setPaymentUpdating] = useState(false);
    const [paymentUpdatingId, setPaymentUpdatingId] = useState(null);
    const [paymentUpdateError, setPaymentUpdateError] = useState('');
    const [approvalStatusDraft, setApprovalStatusDraft] = useState('pending_review');
    const [approvalUpdating, setApprovalUpdating] = useState(false);
    const [approvalUpdateError, setApprovalUpdateError] = useState('');
    const [programs, setPrograms] = useState([]);
    const [programsLoading, setProgramsLoading] = useState(false);
    const [programsError, setProgramsError] = useState('');
    const [programSaving, setProgramSaving] = useState(false);
    const [editingProgramId, setEditingProgramId] = useState(null);
    const [programDrawerOpen, setProgramDrawerOpen] = useState(false);
    const [programForm, setProgramForm] = useState({
        name: '', type: 'competition', description: '', price: '0', capacity: '', sortOrder: '0', isActive: true, categoryPricing: [],
    });
    const [pricingCategories, setPricingCategories] = useState([]);
    const [pricingPrograms, setPricingPrograms] = useState([]);
    const [pricingLoading, setPricingLoading] = useState(false);
    const [pricingError, setPricingError] = useState('');
    const [pricingSaving, setPricingSaving] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
    const [selectedPricingCategoryId, setSelectedPricingCategoryId] = useState('');
    const [categoryForm, setCategoryForm] = useState({ name: '', registrationFee: '0', sortOrder: '0', isActive: true });
    const [accommodationCms, setAccommodationCms] = useState(accommodationTravelDefaults);
    const [accommodationCmsLoading, setAccommodationCmsLoading] = useState(false);
    const [accommodationCmsSaving, setAccommodationCmsSaving] = useState(false);
    const [accommodationCmsNotice, setAccommodationCmsNotice] = useState('');
    const [accommodationEditing, setAccommodationEditing] = useState({ section: '', index: null });
    const [accommodationRowDraft, setAccommodationRowDraft] = useState({});
    const [touristAttractionPhotoUploading, setTouristAttractionPhotoUploading] = useState(null);
    const [touristAttractionDraftPhotoUploading, setTouristAttractionDraftPhotoUploading] = useState(false);
    const [abstractBook, setAbstractBook] = useState(null);
    const [abstractBookLoading, setAbstractBookLoading] = useState(false);
    const [abstractBookUploading, setAbstractBookUploading] = useState(false);
    const [abstractBookError, setAbstractBookError] = useState('');

    async function loadAbstractBookAdmin() {
        setAbstractBookLoading(true);
        setAbstractBookError('');
        try {
            const res = await fetch('/api/admin/abstract-book');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load abstract book.');
            setAbstractBook(data.book || null);
        } catch (err) {
            setAbstractBookError(err.message);
        } finally {
            setAbstractBookLoading(false);
        }
    }

    async function handleAbstractBookUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            if (file.type !== 'application/pdf') throw new Error('Only PDF files are accepted.');
            if (file.size > 10 * 1024 * 1024) throw new Error('File exceeds 10 MB. Please use a smaller PDF.');
            setAbstractBookError('');
            setAbstractBookUploading(true);
            const fileData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve(ev.target.result);
                reader.onerror = () => reject(new Error('Could not read the selected file.'));
                reader.readAsDataURL(file);
            });
            const res = await fetch('/api/admin/abstract-book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    fileData,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to upload abstract book.');
            setAbstractBook(data.book || null);
        } catch (err) {
            setAbstractBookError(err.message);
        } finally {
            setAbstractBookUploading(false);
            e.target.value = '';
        }
    }

    async function removeAbstractBook() {
        try {
            setAbstractBookError('');
            const res = await fetch('/api/admin/abstract-book', { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to remove abstract book.');
            setAbstractBook(data.book || null);
        } catch (err) {
            setAbstractBookError(err.message);
        }
    }

    const [adminAbstracts, setAdminAbstracts] = useState([]);
    const [adminAbstractsLoading, setAdminAbstractsLoading] = useState(false);
    const [adminAbstractsError, setAdminAbstractsError] = useState('');
    const [abstractReviewing, setAbstractReviewing] = useState(null);
    const [abstractRemarksDraft, setAbstractRemarksDraft] = useState('');
    const [videoReviewing, setVideoReviewing] = useState(null);
    const [videoReviewRemarksDraft, setVideoReviewRemarksDraft] = useState('');

    useEffect(() => {
        if (window.location.pathname === '/admin') {
            window.history.replaceState({}, '', '/admin/dashboard');
        }
    }, []);

    async function loadAdminAbstracts() {
        setAdminAbstractsLoading(true);
        setAdminAbstractsError('');
        try {
            const res = await fetch('/api/admin/abstracts');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load.');
            setAdminAbstracts(data.abstracts || []);
        } catch (err) {
            setAdminAbstractsError(err.message);
        } finally {
            setAdminAbstractsLoading(false);
        }
    }

    useEffect(() => {
        if (activeModule === 'abstracts' && activeAbstractsSection === 'student-abstracts' && session) {
            loadAdminAbstracts();
        }
        if (activeModule === 'abstracts' && activeAbstractsSection === 'abstract-book' && session) {
            loadAbstractBookAdmin();
        }
    }, [activeModule, activeAbstractsSection, session]);

    async function reviewAbstract(id, status) {
        try {
            const res = await fetch(`/api/admin/abstracts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, adminRemarks: abstractRemarksDraft }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update.');
            setAdminAbstracts((prev) => prev.map((a) => (a.id === id ? data.submission : a)));
            setAbstractReviewing(null);
            setAbstractRemarksDraft('');
        } catch (err) {
            alert(err.message);
        }
    }

    async function reviewAbstractVideo(id, videoReviewStatus) {
        try {
            const res = await fetch(`/api/admin/abstracts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoReviewStatus, videoReviewRemarks: videoReviewRemarksDraft }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update video review.');
            setAdminAbstracts((prev) => prev.map((a) => (a.id === id ? data.submission : a)));
            setVideoReviewing(null);
            setVideoReviewRemarksDraft('');
        } catch (err) {
            alert(err.message);
        }
    }

    async function downloadAbstract(id, fileName) {
        try {
            const res = await fetch(`/api/admin/abstracts/${id}/download`);
            if (!res.ok) throw new Error('Download failed.');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert(err.message);
        }
    }

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

    useEffect(() => {
        if (activeModule !== 'accommodation' || !session) {
            return;
        }

        setAccommodationCmsLoading(true);
        setAccommodationCmsNotice('');
        apiRequest('admin/accommodation-travel')
            .then(({ content }) => setAccommodationCms(normalizeAccommodationCms(content)))
            .catch((error) => setAccommodationCmsNotice(error.message))
            .finally(() => setAccommodationCmsLoading(false));
    }, [activeModule, session]);

    async function loadRegistrations() {
        setRegistrationsLoading(true);
        setRegistrationsError('');
        try {
            const payload = await apiRequest('admin/registrations');
            setRegistrations(payload.registrations || []);
        } catch (error) {
            setRegistrationsError(error.message);
        } finally {
            setRegistrationsLoading(false);
        }
    }

    function viewRegistration(registration) {
        setSelectedRegistration(registration);
        setPaymentStatusDraft(registration.paymentStatus);
        setApprovalStatusDraft(registration.approvalStatus);
        setPaymentUpdateError('');
        setApprovalUpdateError('');
    }

    async function updateRegistrationPayment() {
        if (!selectedRegistration) return;
        setPaymentUpdating(true);
        setPaymentUpdateError('');
        try {
            const { registration } = await apiRequest(`admin/registrations/${selectedRegistration.id}/payment`, {
                method: 'PATCH',
                body: JSON.stringify({ paymentStatus: paymentStatusDraft }),
            });
            setRegistrations((current) => current.map((item) => item.id === registration.id ? registration : item));
            setSelectedRegistration(registration);
            setPaymentStatusDraft(registration.paymentStatus);
        } catch (error) {
            setPaymentUpdateError(error.message);
        } finally {
            setPaymentUpdating(false);
        }
    }

    async function updatePaymentStatusInline(registration, paymentStatus) {
        setPaymentUpdatingId(registration.id);
        setPaymentUpdateError('');
        try {
            const { registration: updated } = await apiRequest(`admin/registrations/${registration.id}/payment`, {
                method: 'PATCH',
                body: JSON.stringify({ paymentStatus }),
            });
            setRegistrations((current) => current.map((item) => item.id === updated.id ? updated : item));
            if (selectedRegistration?.id === updated.id) {
                setSelectedRegistration(updated);
                setPaymentStatusDraft(updated.paymentStatus);
            }
        } catch (error) {
            setPaymentUpdateError(error.message);
        } finally {
            setPaymentUpdatingId(null);
        }
    }

    async function updateRegistrationApproval() {
        if (!selectedRegistration) return;
        setApprovalUpdating(true);
        setApprovalUpdateError('');
        try {
            const { registration } = await apiRequest(`admin/registrations/${selectedRegistration.id}/approval`, {
                method: 'PATCH',
                body: JSON.stringify({ approvalStatus: approvalStatusDraft }),
            });
            setRegistrations((current) => current.map((item) => item.id === registration.id ? registration : item));
            setSelectedRegistration(registration);
            setApprovalStatusDraft(registration.approvalStatus);
        } catch (error) {
            setApprovalUpdateError(error.message);
        } finally {
            setApprovalUpdating(false);
        }
    }

    async function loadPrograms() {
        setProgramsLoading(true);
        setProgramsError('');
        try {
            const payload = await apiRequest('admin/programs');
            setPrograms(payload.programs || []);
            setPricingCategories(payload.categories || []);
        } catch (error) {
            setProgramsError(error.message);
        } finally {
            setProgramsLoading(false);
        }
    }

    function resetProgramForm() {
        setEditingProgramId(null);
        setProgramForm({ name: '', type: 'competition', description: '', price: '0', capacity: '', sortOrder: '0', isActive: true, categoryPricing: [] });
        setProgramsError('');
        setProgramDrawerOpen(false);
    }

    function addProgram() {
        setEditingProgramId(null);
        setProgramForm({
            name: '', type: 'competition', description: '', price: '0', capacity: '', sortOrder: '0', isActive: true,
            categoryPricing: pricingCategories.map((category) => ({ categoryId: category.id, price: 0, isAvailable: false })),
        });
        setProgramsError('');
        setProgramDrawerOpen(true);
    }

    function editProgram(program) {
        setEditingProgramId(program.id);
        setProgramForm({
            name: program.name,
            type: program.type,
            description: program.description,
            price: String(program.price),
            capacity: program.capacity === '' ? '' : String(program.capacity),
            sortOrder: String(program.sortOrder),
            isActive: program.isActive,
            categoryPricing: pricingCategories.map((category) => {
                const mapping = program.categoryPricing?.find((item) => String(item.categoryId) === String(category.id));
                return { categoryId: category.id, price: mapping?.price || 0, isAvailable: mapping?.isAvailable === true };
            }),
        });
        setProgramsError('');
        setProgramDrawerOpen(true);
    }

    function updateProgramCategoryMapping(categoryId, updates) {
        setProgramForm((current) => ({
            ...current,
            categoryPricing: current.categoryPricing.map((item) => String(item.categoryId) === String(categoryId)
                ? { ...item, ...updates }
                : item),
        }));
    }

    async function saveProgram(event) {
        event.preventDefault();
        setProgramSaving(true);
        setProgramsError('');
        try {
            const path = editingProgramId ? `admin/programs/${editingProgramId}` : 'admin/programs';
            const payload = programForm.type === 'workshop'
                ? {
                    ...programForm,
                    categoryPricing: pricingCategories.map((category) => ({
                        categoryId: category.id,
                        price: programForm.price,
                        isAvailable: true,
                    })),
                }
                : programForm;
            const { program } = await apiRequest(path, {
                method: editingProgramId ? 'PATCH' : 'POST',
                body: JSON.stringify(payload),
            });
            setPrograms((current) => editingProgramId
                ? current.map((item) => item.id === program.id ? program : item)
                : [...current, program]
            );
            resetProgramForm();
            await loadPrograms();
        } catch (error) {
            setProgramsError(error.message);
        } finally {
            setProgramSaving(false);
        }
    }

    async function toggleProgramActive(program) {
        setProgramsError('');
        try {
            const { program: updated } = await apiRequest(`admin/programs/${program.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ ...program, isActive: !program.isActive }),
            });
            setPrograms((current) => current.map((item) => item.id === updated.id ? updated : item));
        } catch (error) {
            setProgramsError(error.message);
        }
    }

    async function loadPricing() {
        setPricingLoading(true);
        setPricingError('');
        try {
            const payload = await apiRequest('admin/pricing');
            setPricingCategories(payload.categories || []);
            setPricingPrograms(payload.programs || []);
            setSelectedPricingCategoryId((current) => current || String(payload.categories?.[0]?.id || ''));
        } catch (error) {
            setPricingError(error.message);
        } finally {
            setPricingLoading(false);
        }
    }

    function resetCategoryForm() {
        setEditingCategoryId(null);
        setCategoryForm({ name: '', registrationFee: '0', sortOrder: '0', isActive: true });
        setCategoryDrawerOpen(false);
    }

    function addPricingCategory() {
        setEditingCategoryId(null);
        setCategoryForm({ name: '', registrationFee: '0', sortOrder: '0', isActive: true });
        setPricingError('');
        setCategoryDrawerOpen(true);
    }

    function editPricingCategory(category) {
        setEditingCategoryId(category.id);
        setCategoryForm({
            name: category.name,
            registrationFee: String(category.registrationFee),
            sortOrder: String(category.sortOrder),
            isActive: category.isActive,
        });
        setCategoryDrawerOpen(true);
    }

    async function savePricingCategory(event) {
        event.preventDefault();
        setPricingSaving(true);
        setPricingError('');
        try {
            const path = editingCategoryId ? `admin/pricing/categories/${editingCategoryId}` : 'admin/pricing/categories';
            const { category } = await apiRequest(path, {
                method: editingCategoryId ? 'PATCH' : 'POST',
                body: JSON.stringify(categoryForm),
            });
            setPricingCategories((current) => editingCategoryId
                ? current.map((item) => String(item.id) === String(category.id) ? category : item)
                : [...current, category]);
            if (!selectedPricingCategoryId) setSelectedPricingCategoryId(String(category.id));
            resetCategoryForm();
            await loadPricing();
        } catch (error) {
            setPricingError(error.message);
        } finally {
            setPricingSaving(false);
        }
    }

    async function saveProgramCategoryPricing(program, categoryId, updates) {
        const currentPricing = program.categoryPricing.find((item) => String(item.categoryId) === String(categoryId))
            || { price: 0, isAvailable: true };
        const nextPricing = { ...currentPricing, ...updates };
        setPricingError('');
        setPricingPrograms((current) => current.map((item) => item.id === program.id
            ? {
                ...item,
                categoryPricing: [
                    ...item.categoryPricing.filter((price) => String(price.categoryId) !== String(categoryId)),
                    { categoryId, ...nextPricing },
                ],
            }
            : item));
        try {
            await apiRequest('admin/pricing/program', {
                method: 'PATCH',
                body: JSON.stringify({ programId: program.id, categoryId, ...nextPricing }),
            });
        } catch (error) {
            setPricingError(error.message);
            loadPricing();
        }
    }

    useEffect(() => {
        if (['dashboard', 'registrations', 'students', 'payments'].includes(activeModule) && session) {
            loadRegistrations();
        }
    }, [activeModule, session]);

    useEffect(() => {
        if (['dashboard', 'programs'].includes(activeModule) && session) {
            loadPrograms();
        }
    }, [activeModule, session]);

    useEffect(() => {
        if (['categories', 'pricing'].includes(activeModule) && session) {
            loadPricing();
        }
    }, [activeModule, session]);

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
    const filteredRegistrations = registrations.filter((registration) => {
        const haystack = [
            registration.registrationNumber,
            registration.participantName,
            registration.institutionName,
            registration.groupCoordinatorName,
            registration.email,
            registration.whatsappNumber,
            registration.category,
            registration.registrationStatus,
            registration.paymentStatus,
            registration.approvalStatus,
        ].join(' ').toLowerCase();
        return haystack.includes(registrationSearch.trim().toLowerCase());
    });
    const approvedPaidStudents = registrations
        .filter((registration) =>
            registration.registrationStatus === 'submitted' &&
            registration.paymentStatus === 'success' &&
            registration.approvalStatus === 'approved'
        )
        .flatMap((registration) => {
            if (registration.registrationMode === 'group' && registration.groupMembers.length) {
                return registration.groupMembers.map((member, index) => ({
                    id: `${registration.id}-${index}`,
                    registrationNumber: registration.registrationNumber,
                    registrationMode: 'group',
                    name: member.name,
                    email: member.email || registration.groupCoordinatorEmail,
                    whatsapp: member.whatsapp || registration.groupCoordinatorWhatsapp,
                    category: member.category || registration.category,
                    course: member.course,
                    college: member.college,
                    state: member.state,
                    foodPreference: member.foodPreference,
                    coordinator: registration.groupCoordinatorName,
                    paymentStatus: registration.paymentStatus,
                    approvalStatus: registration.approvalStatus,
                }));
            }

            return [{
                id: `${registration.id}-individual`,
                registrationNumber: registration.registrationNumber,
                registrationMode: registration.registrationMode,
                name: registration.participantName,
                email: registration.email,
                whatsapp: registration.whatsappNumber,
                category: registration.category,
                course: registration.courseOfStudy,
                college: registration.institutionName || registration.collegeWithState,
                state: registration.stateOfResidence,
                foodPreference: registration.foodPreference,
                coordinator: '',
                paymentStatus: registration.paymentStatus,
                approvalStatus: registration.approvalStatus,
            }];
        });
    const filteredStudents = approvedPaidStudents.filter((student) => {
        const haystack = [
            student.registrationNumber,
            student.name,
            student.email,
            student.whatsapp,
            student.category,
            student.course,
            student.college,
            student.state,
        ].join(' ').toLowerCase();
        return haystack.includes(studentSearch.trim().toLowerCase());
    });
    const paymentRows = registrations
        .filter((registration) => registration.registrationStatus === 'submitted' || registration.transactionDetails || registration.totalPayableAmount > 0)
        .sort((a, b) => new Date(b.submittedAt || b.updatedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.updatedAt || a.createdAt).getTime());
    const filteredPaymentRows = paymentRows.filter((registration) => {
        const haystack = [
            registration.registrationNumber,
            registration.participantName,
            registration.groupCoordinatorName,
            registration.email,
            registration.groupCoordinatorEmail,
            registration.whatsappNumber,
            registration.groupCoordinatorWhatsapp,
            registration.transactionDetails,
            registration.paymentStatus,
            registration.approvalStatus,
            registration.category,
        ].join(' ').toLowerCase();
        return haystack.includes(paymentSearch.trim().toLowerCase());
    });
    const submittedRegistrations = registrations.filter((registration) => registration.registrationStatus === 'submitted').length;
    const draftRegistrations = registrations.filter((registration) => registration.registrationStatus === 'draft').length;
    const pendingRegistrationPayments = registrations.filter((registration) => registration.paymentStatus === 'pending').length;
    const pendingRegistrationApprovals = registrations.filter((registration) => registration.approvalStatus === 'pending_review').length;
    const approvedRegistrations = registrations.filter((registration) => registration.approvalStatus === 'approved').length;

    const activeModuleMeta = adminModules.find((module) => module.id === activeModule) || adminModules[0];
    const activeAccommodationSection = activeModule === 'accommodation' ? getAccommodationAdminSectionFromPath() : 'settings';
    const activeAccommodationSectionMeta = accommodationAdminSections.find((section) => section.id === activeAccommodationSection) || accommodationAdminSections[3];
    const activeAbstractsSectionMeta = abstractsAdminSections.find((section) => section.id === activeAbstractsSection) || abstractsAdminSections[0];
    const activePageLabel = activeModule === 'abstracts' ? activeAbstractsSectionMeta.label : activeModuleMeta.label;
    const activePageDescription = activeModule === 'abstracts' ? activeAbstractsSectionMeta.description : activeModuleMeta.description;
    const paymentCollected = registrations
        .filter((registration) => registration.paymentStatus === 'success')
        .reduce((total, registration) => total + registration.totalPayableAmount, 0);
    const paymentPendingAmount = registrations
        .filter((registration) => registration.paymentStatus === 'pending' || registration.paymentStatus === 'manual_verification_required')
        .reduce((total, registration) => total + registration.totalPayableAmount, 0);
    const paymentFailedAmount = registrations
        .filter((registration) => registration.paymentStatus === 'failed')
        .reduce((total, registration) => total + registration.totalPayableAmount, 0);
    const dashboardStats = [
        ['Total Registrations', registrations.length.toLocaleString('en-IN'), `${submittedRegistrations} submitted`, 'emerald'],
        ['Payment Collected', `Rs. ${paymentCollected.toLocaleString('en-IN')}`, 'Verified payments', 'amber'],
        ['Pending Payments', pendingRegistrationPayments.toLocaleString('en-IN'), 'Needs finance review', 'rose'],
        ['Active Programs', programs.filter((program) => program.isActive).length.toLocaleString('en-IN'), `${programs.filter((program) => program.capacity).length} capacity controlled`, 'sky'],
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
        ['Success', registrations.filter((registration) => registration.paymentStatus === 'success').length, 'bg-emerald-600'],
        ['Pending', registrations.filter((registration) => registration.paymentStatus === 'pending').length, 'bg-amber-500'],
        ['Failed', registrations.filter((registration) => registration.paymentStatus === 'failed').length, 'bg-rose-600'],
        ['Manual Review', registrations.filter((registration) => registration.paymentStatus === 'manual_verification_required').length, 'bg-sky-600'],
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

    function updateAccommodationField(name, value) {
        setAccommodationCms((current) => normalizeAccommodationCms({ ...current, [name]: value }));
        setAccommodationCmsNotice('');
    }

    function beginAccommodationRowCreate(sectionKey, fields) {
        setAccommodationEditing({ section: sectionKey, index: null });
        setAccommodationRowDraft(fields.reduce((draft, field) => ({ ...draft, [field]: '' }), {}));
        setAccommodationCmsNotice('');
    }

    function beginAccommodationRowEdit(sectionKey, row, index) {
        setAccommodationEditing({ section: sectionKey, index });
        setAccommodationRowDraft({ ...row });
        setAccommodationCmsNotice('');
    }

    function cancelAccommodationRowEdit() {
        setAccommodationEditing({ section: '', index: null });
        setAccommodationRowDraft({});
    }

    function updateAccommodationRowDraft(name, value) {
        setAccommodationRowDraft((current) => ({ ...current, [name]: value }));
        setAccommodationCmsNotice('');
    }

    function commitAccommodationRow(sectionKey, fields) {
        if (!String(accommodationRowDraft.name || '').trim()) {
            setAccommodationCmsNotice('Name is required.');
            return;
        }

        const cleanedRow = fields.reduce((row, field) => ({ ...row, [field]: accommodationRowDraft[field] || '' }), {});
        setAccommodationCms((current) => {
            const cms = normalizeAccommodationCms(current);
            const rows = [...cms[sectionKey]];
            if (accommodationEditing.index === null) {
                rows.push(cleanedRow);
            } else {
                rows[accommodationEditing.index] = cleanedRow;
            }

            return normalizeAccommodationCms({ ...cms, [sectionKey]: rows });
        });
        setAccommodationCmsNotice('Draft updated. Save this section to publish changes.');
        cancelAccommodationRowEdit();
    }

    function isVercelBlobUrl(url) {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.hostname.includes('vercel-storage.com');
        } catch {
            return false;
        }
    }

    async function deleteTouristAttractionBlob(url) {
        if (!isVercelBlobUrl(url)) {
            return;
        }

        await apiRequest('admin/accommodation-travel/tourist-attraction-photo', {
            method: 'DELETE',
            body: JSON.stringify({ url }),
        });
    }

    async function deleteAccommodationRow(sectionKey, index) {
        const cms = normalizeAccommodationCms(accommodationCms);
        const row = cms[sectionKey]?.[index];
        if (sectionKey === 'touristAttractions' && row?.image) {
            setAccommodationCmsNotice('Deleting photo from Vercel Blob...');
            try {
                await deleteTouristAttractionBlob(row.image);
            } catch (error) {
                setAccommodationCmsNotice(error.message);
                return;
            }
        }

        setAccommodationCms((current) => {
            const cms = normalizeAccommodationCms(current);
            return normalizeAccommodationCms({
                ...cms,
                [sectionKey]: cms[sectionKey].filter((_, rowIndex) => rowIndex !== index),
            });
        });
        if (accommodationEditing.section === sectionKey && accommodationEditing.index === index) {
            cancelAccommodationRowEdit();
        }
        setAccommodationCmsNotice('Row removed. Save this section to publish changes.');
    }

    function renderAccommodationCrudTable({ sectionKey, title, fields, columns, emptyText }) {
        const cms = normalizeAccommodationCms(accommodationCms);
        const rows = cms[sectionKey] || [];
        const isEditingThisSection = accommodationEditing.section === sectionKey;
        const formTitle = accommodationEditing.index === null ? `Add ${title}` : `Edit ${title}`;

        return (
            <div className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
                        <p className="mt-1 text-sm text-zinc-500">{rows.length} records in this section.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => beginAccommodationRowCreate(sectionKey, fields)}
                        className="admin-button rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900"
                    >
                        Add New
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-zinc-200">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-zinc-100 text-xs uppercase text-zinc-500">
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.field} className="px-4 py-3">{column.label}</th>
                                ))}
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 bg-white">
                            {rows.map((row, index) => (
                                <tr key={`${sectionKey}-${row.name}-${index}`}>
                                    {columns.map((column) => (
                                        <td key={column.field} className="max-w-[260px] px-4 py-3 align-top">
                                            {column.field === 'image' && row.image ? (
                                                <img src={row.image} alt={row.name || 'Attraction'} className="h-16 w-24 rounded-lg object-cover" />
                                            ) : (
                                                <span className={`${column.wrap ? 'line-clamp-3' : 'whitespace-nowrap'} text-zinc-700`}>
                                                    {row[column.field] || '-'}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right align-top">
                                        <div className="flex justify-end gap-2">
                                            {sectionKey === 'touristAttractions' && (
                                                <>
                                                    <label className="cursor-pointer rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100">
                                                        {touristAttractionPhotoUploading === index ? 'Uploading...' : 'Photo'}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="sr-only"
                                                            disabled={touristAttractionPhotoUploading === index}
                                                            onChange={(event) => uploadTouristAttractionPhoto(index, event.target.files?.[0])}
                                                        />
                                                    </label>
                                                    {row.image && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTouristAttractionPhoto(index)}
                                                            disabled={touristAttractionPhotoUploading === index}
                                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                                        >
                                                            Remove Photo
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => beginAccommodationRowEdit(sectionKey, row, index)}
                                                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteAccommodationRow(sectionKey, index)}
                                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!rows.length && (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-sm font-semibold text-zinc-500">
                                        {emptyText}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {isEditingThisSection && (
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
                        <div className="flex flex-col gap-2 border-b border-emerald-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h4 className="font-bold text-zinc-950">{formTitle}</h4>
                                <p className="mt-1 text-xs font-medium text-zinc-500">Changes stay as draft until you use the save button below.</p>
                            </div>
                            <button type="button" onClick={cancelAccommodationRowEdit} className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-white">
                                Cancel
                            </button>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            {columns.map((column) => (
                                <label key={column.field} className={`block text-sm font-semibold text-zinc-800 ${column.wide ? 'md:col-span-2' : ''}`}>
                                    {column.label}
                                    {sectionKey === 'touristAttractions' && column.field === 'image' ? (
                                        <div className="mt-2 rounded-lg border border-zinc-200 bg-white p-3">
                                            {accommodationRowDraft.image ? (
                                                <img
                                                    src={accommodationRowDraft.image}
                                                    alt={accommodationRowDraft.name || 'Tourist attraction'}
                                                    className="h-32 w-full rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-xs font-semibold text-zinc-400">
                                                    No photo uploaded
                                                </div>
                                            )}
                                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                                <label className="cursor-pointer rounded-lg border border-zinc-300 px-3 py-2 text-center text-xs font-bold text-zinc-700 hover:bg-zinc-100">
                                                    {touristAttractionDraftPhotoUploading ? 'Uploading...' : 'Upload Photo'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        disabled={touristAttractionDraftPhotoUploading}
                                                        onChange={(event) => uploadTouristAttractionDraftPhoto(event.target.files?.[0])}
                                                    />
                                                </label>
                                                {accommodationRowDraft.image && (
                                                    <button
                                                        type="button"
                                                        onClick={removeTouristAttractionDraftPhoto}
                                                        disabled={touristAttractionDraftPhotoUploading}
                                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        Remove Photo
                                                    </button>
                                                )}
                                                <input
                                                    className="admin-input min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-xs outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                    value={accommodationRowDraft.image || ''}
                                                    onChange={(event) => updateAccommodationRowDraft('image', event.target.value)}
                                                    placeholder="Or paste image URL"
                                                />
                                            </div>
                                        </div>
                                    ) : column.multiline ? (
                                        <textarea
                                            className="admin-input mt-2 min-h-24 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                            value={accommodationRowDraft[column.field] || ''}
                                            onChange={(event) => updateAccommodationRowDraft(column.field, event.target.value)}
                                        />
                                    ) : (
                                        <input
                                            className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                            value={accommodationRowDraft[column.field] || ''}
                                            onChange={(event) => updateAccommodationRowDraft(column.field, event.target.value)}
                                        />
                                    )}
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => commitAccommodationRow(sectionKey, fields)}
                                className="admin-button rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900"
                            >
                                {accommodationEditing.index === null ? 'Add Row' : 'Update Row'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    async function uploadTouristAttractionPhoto(index, file) {
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setAccommodationCmsNotice('Please upload an image file.');
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            setAccommodationCmsNotice('Image must be 4 MB or smaller.');
            return;
        }

        setTouristAttractionPhotoUploading(index);
        setAccommodationCmsNotice('Uploading photo...');

        try {
            const oldImage = normalizeAccommodationCms(accommodationCms).touristAttractions[index]?.image || '';
            const fileData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = () => reject(new Error('Could not read the selected image.'));
                reader.readAsDataURL(file);
            });
            const cms = normalizeAccommodationCms(accommodationCms);
            const attractionName = cms.touristAttractions[index]?.name || `Attraction ${index + 1}`;
            const { url } = await apiRequest('admin/accommodation-travel/tourist-attraction-photo', {
                method: 'POST',
                body: JSON.stringify({ fileData, fileName: file.name, attractionName }),
            });
            setAccommodationCms((current) => {
                const cms = normalizeAccommodationCms(current);
                const nextAttractions = cms.touristAttractions.map((place, placeIndex) =>
                    placeIndex === index ? { ...place, image: url } : place
                );

                return normalizeAccommodationCms({ ...cms, touristAttractions: nextAttractions });
            });
            if (oldImage && oldImage !== url) {
                await deleteTouristAttractionBlob(oldImage).catch(() => {});
            }
            setAccommodationCmsNotice('Photo uploaded to Vercel Blob. Save this section to publish it.');
        } catch (error) {
            setAccommodationCmsNotice(error.message);
        } finally {
            setTouristAttractionPhotoUploading(null);
        }
    }

    async function removeTouristAttractionPhoto(index) {
        const image = normalizeAccommodationCms(accommodationCms).touristAttractions[index]?.image || '';
        if (!image) {
            return;
        }

        setTouristAttractionPhotoUploading(index);
        setAccommodationCmsNotice('Deleting photo from Vercel Blob...');

        try {
            await deleteTouristAttractionBlob(image);
            setAccommodationCms((current) => {
                const cms = normalizeAccommodationCms(current);
                const nextAttractions = cms.touristAttractions.map((place, placeIndex) =>
                    placeIndex === index ? { ...place, image: '' } : place
                );

                return normalizeAccommodationCms({ ...cms, touristAttractions: nextAttractions });
            });
            setAccommodationCmsNotice('Photo removed. Save this section to publish changes.');
        } catch (error) {
            setAccommodationCmsNotice(error.message);
        } finally {
            setTouristAttractionPhotoUploading(null);
        }
    }

    async function uploadTouristAttractionDraftPhoto(file) {
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setAccommodationCmsNotice('Please upload an image file.');
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            setAccommodationCmsNotice('Image must be 4 MB or smaller.');
            return;
        }

        setTouristAttractionDraftPhotoUploading(true);
        setAccommodationCmsNotice('Uploading photo...');

        try {
            const oldImage = accommodationRowDraft.image || '';
            const fileData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = () => reject(new Error('Could not read the selected image.'));
                reader.readAsDataURL(file);
            });
            const attractionName = accommodationRowDraft.name || 'Tourist Attraction';
            const { url } = await apiRequest('admin/accommodation-travel/tourist-attraction-photo', {
                method: 'POST',
                body: JSON.stringify({ fileData, fileName: file.name, attractionName }),
            });
            setAccommodationRowDraft((current) => ({ ...current, image: url }));
            if (oldImage && oldImage !== url) {
                await deleteTouristAttractionBlob(oldImage).catch(() => {});
            }
            setAccommodationCmsNotice('Photo uploaded to Vercel Blob. Add or update the row, then save this section.');
        } catch (error) {
            setAccommodationCmsNotice(error.message);
        } finally {
            setTouristAttractionDraftPhotoUploading(false);
        }
    }

    async function removeTouristAttractionDraftPhoto() {
        const image = accommodationRowDraft.image || '';
        if (!image) {
            return;
        }

        setTouristAttractionDraftPhotoUploading(true);
        setAccommodationCmsNotice('Deleting photo from Vercel Blob...');

        try {
            await deleteTouristAttractionBlob(image);
            setAccommodationRowDraft((current) => ({ ...current, image: '' }));
            setAccommodationCmsNotice('Photo removed from the draft.');
        } catch (error) {
            setAccommodationCmsNotice(error.message);
        } finally {
            setTouristAttractionDraftPhotoUploading(false);
        }
    }

    async function saveAccommodationCms() {
        setAccommodationCmsSaving(true);
        setAccommodationCmsNotice('Saving...');

        try {
            const { content } = await apiRequest('admin/accommodation-travel', {
                method: 'PUT',
                body: JSON.stringify({ content: normalizeAccommodationCms(accommodationCms) }),
            });
            setAccommodationCms(normalizeAccommodationCms(content));
            setAccommodationCmsNotice('Accommodation & Travel content saved.');
        } catch (error) {
            setAccommodationCmsNotice(error.message);
        } finally {
            setAccommodationCmsSaving(false);
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
        <main className={`admin-theme ${theme === 'dark' ? 'dark' : ''} min-h-screen text-zinc-950`}>
            <div className="admin-shell min-h-screen lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
                <aside className="admin-sidebar border-b border-zinc-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
                    <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4">
                        <a href="/admin/dashboard" className="flex min-w-0 items-center gap-3">
                            <img src="/14th NSC LOGO - DARK.png" alt="14th IPA National Students Congress logo" className="admin-logo size-9 rounded-md border border-zinc-200 bg-white object-contain p-1" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-zinc-950">NSC Admin</p>
                                <p className="truncate text-xs text-zinc-500">Event operations</p>
                            </div>
                        </a>
                        <span className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">2026</span>
                    </div>

                    <nav className="admin-nav flex gap-1 overflow-x-auto p-3 lg:block lg:h-[calc(100vh-137px)] lg:overflow-y-auto" aria-label="Admin navigation">
                        {adminNavigationGroups.map((group, groupIndex) => (
                            <div key={group.label} className={groupIndex ? 'lg:mt-5' : ''}>
                                <p className="mb-2 hidden px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 lg:block">{group.label}</p>
                                <div className="flex gap-1 lg:block">
                                    {group.modules.map((moduleId) => {
                                        const module = adminModules.find((item) => item.id === moduleId);
                                        if (!module) return null;
                                        if (module.id === 'accommodation' || module.id === 'abstracts') {
                                            const isAccommodationMenu = module.id === 'accommodation';
                                            const submenuOpen = openAdminDropdown === module.id;
                                            const submenuId = `admin-${module.id}-submenu`;
                                            const sections = isAccommodationMenu ? accommodationAdminSections : abstractsAdminSections;
                                            return (
                                                <div key={module.id} className="relative shrink-0 lg:mb-2">
                                                    <button
                                                        type="button"
                                                        aria-expanded={submenuOpen}
                                                        aria-controls={submenuId}
                                                        onClick={() => setOpenAdminDropdown((current) => current === module.id ? '' : module.id)}
                                                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors lg:w-full ${
                                                            activeModule === module.id
                                                                ? 'admin-nav-active bg-zinc-900 text-white shadow-sm'
                                                                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                                                        }`}
                                                    >
                                                        <AdminSidebarIcon name={module.id} />
                                                        <span className="min-w-0 flex-1">{module.label}</span>
                                                        <span className={`text-xs transition-transform ${submenuOpen ? 'rotate-180' : ''}`}>⌄</span>
                                                    </button>
                                                    <div
                                                        id={submenuId}
                                                        className={`absolute left-0 top-full z-40 mt-2 min-w-64 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg lg:static lg:mt-2 lg:min-w-0 lg:border-0 lg:bg-transparent lg:py-0 lg:pl-9 lg:pr-0 lg:shadow-none ${
                                                            submenuOpen ? 'block' : 'hidden'
                                                        }`}
                                                    >
                                                        {sections.map((section) => {
                                                            const isActiveSection = isAccommodationMenu
                                                                ? activeAccommodationSection === section.id
                                                                : activeAbstractsSection === section.id;
                                                            const href = isAccommodationMenu
                                                                ? `/admin/accommodation/${section.id}`
                                                                : `/admin/abstracts/${section.id}`;
                                                            return (
                                                            <a
                                                                key={section.id}
                                                                href={href}
                                                                aria-current={isActiveSection ? 'page' : undefined}
                                                                className={`block rounded-md px-3 py-2 text-xs font-semibold transition-colors lg:mb-1.5 ${
                                                                    isActiveSection
                                                                        ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
                                                                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                                                                }`}
                                                            >
                                                                {section.label}
                                                            </a>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div key={module.id} className="shrink-0 lg:mb-1">
                                                <a
                                                    href={`/admin/${module.id}`}
                                                    aria-current={activeModule === module.id ? 'page' : undefined}
                                                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors lg:w-full ${
                                                        activeModule === module.id
                                                            ? 'admin-nav-active bg-zinc-900 text-white shadow-sm'
                                                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                                                    }`}
                                                >
                                                    <AdminSidebarIcon name={module.id} />
                                                    <span>{module.label}</span>
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className="hidden h-[73px] items-center gap-3 border-t border-zinc-200 px-4 lg:flex">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                            {(session.name || 'A').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-zinc-950">{session.name}</p>
                            <p className="truncate text-xs text-zinc-500">{currentRole?.name || 'Admin User'}</p>
                        </div>
                    </div>
                </aside>

                <div className="min-w-0">
                    <header className="admin-topbar sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
                        <div className="flex min-w-0 items-center gap-2 text-sm">
                            <a href="/admin/dashboard" className="hidden text-zinc-500 hover:text-zinc-950 sm:inline">Admin</a>
                            <span className="hidden text-zinc-300 sm:inline">/</span>
                            <span className="truncate font-medium text-zinc-950">{activeModuleMeta.label}</span>
                            {activeModule === 'accommodation' && (
                                <>
                                    <span className="hidden text-zinc-300 sm:inline">/</span>
                                    <span className="hidden truncate font-medium text-zinc-500 sm:inline">{activeAccommodationSectionMeta.label}</span>
                                </>
                            )}
                            {activeModule === 'abstracts' && (
                                <>
                                    <span className="hidden text-zinc-300 sm:inline">/</span>
                                    <span className="hidden truncate font-medium text-zinc-500 sm:inline">{activeAbstractsSectionMeta.label}</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <a href="/" className="admin-button-secondary hidden rounded-md px-3 py-2 text-sm font-medium sm:inline-flex">View site</a>
                            <AdminThemeToggle theme={theme} onToggle={toggleTheme} />
                            <button type="button" onClick={logout} className="admin-button-secondary rounded-md px-3 py-2 text-sm font-medium">
                                Logout
                            </button>
                        </div>
                    </header>

                    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">{activePageLabel}</h1>
                                <p className="mt-1.5 max-w-2xl text-sm text-zinc-500">{activePageDescription}</p>
                            </div>
                            {notice && <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">{notice}</p>}
                        </div>

                        <section className="admin-card rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">

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
                                    <p className="mt-1 text-sm text-zinc-600">Live payment split from registration records.</p>
                                    <div className="mt-6 flex h-5 overflow-hidden rounded-lg bg-white ring-1 ring-zinc-200">
                                        {paymentBreakdown.map(([label, value, className]) => (
                                            <div
                                                key={label}
                                                className={className}
                                                style={{ width: `${totalPaymentCount ? (value / totalPaymentCount) * 100 : 0}%` }}
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

                    {activeModule === 'registrations' && (
                        <div className="mt-6">
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    ['All Records', registrations.length],
                                    ['Pending Approval', pendingRegistrationApprovals],
                                    ['Approved', approvedRegistrations],
                                    ['Pending Payments', pendingRegistrationPayments],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                        <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
                                        <p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Registration Records</h2>
                                    <p className="mt-1 text-sm text-zinc-600">Submitted registrations and in-progress drafts from the public form.</p>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="search"
                                        value={registrationSearch}
                                        onChange={(event) => setRegistrationSearch(event.target.value)}
                                        placeholder="Search name, email, number..."
                                        className="admin-input rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={loadRegistrations}
                                        disabled={registrationsLoading}
                                        className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {registrationsLoading ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>

                            {registrationsError && (
                                <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{registrationsError}</p>
                            )}

                            {!registrationsLoading && !registrationsError && filteredRegistrations.length === 0 && (
                                <p className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm font-semibold text-zinc-600">
                                    {registrationSearch ? 'No registrations match your search.' : 'No registration records have been saved yet.'}
                                </p>
                            )}

                            {filteredRegistrations.length > 0 && (
                                <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
                                    <table className="min-w-[1100px] w-full text-left text-sm">
                                        <thead className="bg-zinc-100 text-xs font-bold uppercase text-zinc-600">
                                            <tr>
                                                <th className="px-4 py-3">Registration</th>
                                                <th className="px-4 py-3">Participant</th>
                                                <th className="px-4 py-3">Contact</th>
                                                <th className="px-4 py-3">Category / Institution</th>
                                                <th className="px-4 py-3">Programs</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Saved</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 bg-white">
                                            {filteredRegistrations.map((registration) => (
                                                <tr key={registration.id} className="align-top hover:bg-zinc-50">
                                                    <td className="px-4 py-4">
                                                        <p className="font-mono text-xs font-bold text-emerald-800">{registration.registrationNumber || `Draft #${registration.id}`}</p>
                                                        <p className="mt-1 capitalize text-xs text-zinc-500">{registration.registrationMode}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-bold text-zinc-950">{registration.participantName || registration.groupCoordinatorName || 'Not entered'}</p>
                                                        {registration.registrationMode === 'group' && registration.expectedParticipants && (
                                                            <p className="mt-1 text-xs text-zinc-500">{registration.expectedParticipants} expected participants</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-zinc-700">
                                                        <p>{registration.email || registration.groupCoordinatorEmail || '-'}</p>
                                                        <p className="mt-1">{registration.whatsappNumber || registration.groupCoordinatorWhatsapp || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-semibold text-zinc-800">{registration.category || '-'}</p>
                                                        <p className="mt-1 max-w-xs text-xs text-zinc-500">{registration.collegeWithState || registration.institutionName || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs text-zinc-600">
                                                        <p>{registration.studentCompetitions.length ? registration.studentCompetitions.join(', ') : 'No competitions'}</p>
                                                        {registration.selectedWorkshops.length > 0 && <p className="mt-1">Workshops: {registration.selectedWorkshops.join(', ')}</p>}
                                                        {registration.presentationType && <p className="mt-1">Presentation: {registration.presentationType}</p>}
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-zinc-950">Rs. {registration.totalPayableAmount.toLocaleString('en-IN')}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${registrationStatusBadgeClass(registration.registrationStatus)}`}>
                                                            {formatAdminStatus(registration.registrationStatus)}
                                                        </span>
                                                        <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${paymentStatusBadgeClass(registration.paymentStatus)}`}>
                                                            Payment: {formatAdminStatus(registration.paymentStatus)}
                                                        </span>
                                                        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${approvalStatusBadgeClass(registration.approvalStatus)}`}>
                                                            Approval: {formatAdminStatus(registration.approvalStatus)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs text-zinc-600">
                                                        {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(registration.submittedAt || registration.updatedAt))}
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <button type="button" onClick={() => viewRegistration(registration)} className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-100">
                                                            View details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {selectedRegistration && (
                                <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/50" role="dialog" aria-modal="true" aria-label="Registration details">
                                    <button type="button" className="absolute inset-0 cursor-default" onClick={() => setSelectedRegistration(null)} aria-label="Close registration details" />
                                    <div className="admin-card relative h-full w-full max-w-3xl overflow-y-auto border-l border-zinc-200 bg-white shadow-2xl">
                                        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6">
                                            <div>
                                                <p className="font-mono text-xs font-bold text-emerald-700">{selectedRegistration.registrationNumber || `Draft #${selectedRegistration.id}`}</p>
                                                <h2 className="mt-1 text-xl font-semibold text-zinc-950">Registration details</h2>
                                                <p className="mt-1 text-sm capitalize text-zinc-500">{selectedRegistration.registrationMode} registration</p>
                                            </div>
                                            <button type="button" onClick={() => setSelectedRegistration(null)} className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100">Close</button>
                                        </div>

                                        <div className="space-y-6 p-5 sm:p-6">
                                            <section className="rounded-lg border border-zinc-200 p-4">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                                    <label className="text-sm font-semibold text-zinc-800">
                                                        Payment status
                                                        <select value={paymentStatusDraft} onChange={(event) => setPaymentStatusDraft(event.target.value)} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm sm:min-w-64">
                                                            <option value="pending">Pending</option>
                                                            <option value="success">Success</option>
                                                            <option value="failed">Failed</option>
                                                            <option value="manual_verification_required">Manual verification required</option>
                                                            <option value="refunded">Refunded</option>
                                                        </select>
                                                    </label>
                                                    <button type="button" onClick={updateRegistrationPayment} disabled={paymentUpdating || paymentStatusDraft === selectedRegistration.paymentStatus} className="rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50">
                                                        {paymentUpdating ? 'Updating...' : 'Update payment'}
                                                    </button>
                                                </div>
                                                {paymentUpdateError && <p className="mt-3 text-sm font-semibold text-rose-700">{paymentUpdateError}</p>}
                                            </section>

                                            <section className="rounded-lg border border-zinc-200 p-4">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                                    <label className="text-sm font-semibold text-zinc-800">
                                                        Registration approval
                                                        <select value={approvalStatusDraft} onChange={(event) => setApprovalStatusDraft(event.target.value)} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm sm:min-w-64">
                                                            <option value="pending_review">Pending review</option>
                                                            <option value="approved">Approved</option>
                                                            <option value="rejected">Rejected</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </label>
                                                    <button type="button" onClick={updateRegistrationApproval} disabled={approvalUpdating || approvalStatusDraft === selectedRegistration.approvalStatus} className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50">
                                                        {approvalUpdating ? 'Updating...' : 'Update approval'}
                                                    </button>
                                                </div>
                                                {approvalUpdateError && <p className="mt-3 text-sm font-semibold text-rose-700">{approvalUpdateError}</p>}
                                            </section>

                                            <section>
                                                <h3 className="text-sm font-semibold text-zinc-950">Registration summary</h3>
                                                <dl className="mt-3 grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
                                                    {[
                                                        ['Status', formatAdminStatus(selectedRegistration.registrationStatus)],
                                                        ['Approval', formatAdminStatus(selectedRegistration.approvalStatus)],
                                                        ['Category', selectedRegistration.category],
                                                        ['Participant', selectedRegistration.participantName],
                                                        ['Institution', selectedRegistration.institutionName || selectedRegistration.collegeWithState],
                                                        ['State', selectedRegistration.stateOfResidence],
                                                        ['Food preference', selectedRegistration.foodPreference],
                                                        ['Course', selectedRegistration.courseOfStudy],
                                                        ['Presentation', selectedRegistration.presentationType],
                                                        ['Competition fee acknowledged', selectedRegistration.competitionFeeAcknowledged ? 'Yes' : 'No'],
                                                        ['Workshop fee acknowledged', selectedRegistration.workshopFeeAcknowledged ? 'Yes' : 'No'],
                                                    ].map(([label, value]) => (
                                                        <div key={label}>
                                                            <dt className="text-xs font-medium text-zinc-500">{label}</dt>
                                                            <dd className="mt-1 text-sm font-semibold capitalize text-zinc-900">{value || '-'}</dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            </section>

                                            <section>
                                                <h3 className="text-sm font-semibold text-zinc-950">Contact and coordinator</h3>
                                                <dl className="mt-3 grid gap-3 rounded-lg border border-zinc-200 p-4 sm:grid-cols-2">
                                                    {[
                                                        ['Email', selectedRegistration.email],
                                                        ['WhatsApp', selectedRegistration.whatsappNumber],
                                                        ['Coordinator', selectedRegistration.groupCoordinatorName],
                                                        ['Coordinator email', selectedRegistration.groupCoordinatorEmail],
                                                        ['Coordinator WhatsApp', selectedRegistration.groupCoordinatorWhatsapp],
                                                        ['Expected participants', selectedRegistration.expectedParticipants],
                                                    ].map(([label, value]) => (
                                                        <div key={label}>
                                                            <dt className="text-xs font-medium text-zinc-500">{label}</dt>
                                                            <dd className="mt-1 text-sm font-medium text-zinc-900">{value || '-'}</dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            </section>

                                            <section>
                                                <h3 className="text-sm font-semibold text-zinc-950">HR Drive</h3>
                                                <dl className="mt-3 grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
                                                    {[
                                                        ['College / State', selectedRegistration.hrCollegeWithState],
                                                        ['Course / Qualification', selectedRegistration.hrCourseOrQualification],
                                                        ['WhatsApp', selectedRegistration.hrWhatsappNumber],
                                                        ['Email', selectedRegistration.hrEmail],
                                                        ['Preferred Core Area', selectedRegistration.hrCoreArea],
                                                    ].map(([label, value]) => (
                                                        <div key={label}>
                                                            <dt className="text-xs font-medium text-zinc-500">{label}</dt>
                                                            <dd className="mt-1 text-sm font-semibold text-zinc-900">{value || '-'}</dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            </section>

                                            <section>
                                                <h3 className="text-sm font-semibold text-zinc-950">Programs and payment</h3>
                                                <div className="mt-3 rounded-lg border border-zinc-200 p-4 text-sm text-zinc-700">
                                                    <p><span className="font-semibold text-zinc-950">Competitions:</span> {selectedRegistration.studentCompetitions.length ? selectedRegistration.studentCompetitions.join(', ') : '-'}</p>
                                                    <p className="mt-2"><span className="font-semibold text-zinc-950">Workshops:</span> {selectedRegistration.selectedWorkshops.length ? selectedRegistration.selectedWorkshops.join(', ') : '-'}</p>
                                                    <p className="mt-2"><span className="font-semibold text-zinc-950">Transaction details:</span> {selectedRegistration.transactionDetails || '-'}</p>
                                                    <div className="mt-4 grid gap-2 border-t border-zinc-200 pt-4 sm:grid-cols-2">
                                                        <p>Registration fee: <strong>Rs. {selectedRegistration.registrationFee.toLocaleString('en-IN')}</strong></p>
                                                        <p>Competition fee: <strong>Rs. {selectedRegistration.competitionFee.toLocaleString('en-IN')}</strong></p>
                                                        <p>Workshop fee: <strong>Rs. {selectedRegistration.workshopFee.toLocaleString('en-IN')}</strong></p>
                                                        <p>Total payable: <strong>Rs. {selectedRegistration.totalPayableAmount.toLocaleString('en-IN')}</strong></p>
                                                    </div>
                                                </div>
                                            </section>

                                            {selectedRegistration.registrationMode === 'group' && (
                                                <section>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <h3 className="text-sm font-semibold text-zinc-950">Group student roster</h3>
                                                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">{selectedRegistration.groupMembers.length} students</span>
                                                    </div>
                                                    {selectedRegistration.groupMembers.length ? (
                                                        <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200">
                                                            <table className="min-w-[850px] w-full text-left text-xs">
                                                                <thead className="bg-zinc-100 text-zinc-600"><tr>{groupMemberColumns.map(([key, label]) => <th key={key} className="px-3 py-2 font-semibold">{label}</th>)}</tr></thead>
                                                                <tbody className="divide-y divide-zinc-200">
                                                                    {selectedRegistration.groupMembers.map((member, index) => (
                                                                        <tr key={`${member.email}-${index}`}>{groupMemberColumns.map(([key]) => <td key={key} className="px-3 py-2 text-zinc-700">{member[key] || '-'}</td>)}</tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">No student roster was uploaded for this group.</p>
                                                    )}
                                                </section>
                                            )}

                                            <section className="border-t border-zinc-200 pt-4 text-xs text-zinc-500">
                                                <p>Created: {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(selectedRegistration.createdAt))}</p>
                                                <p className="mt-1">Last updated: {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(selectedRegistration.updatedAt))}</p>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeModule === 'payments' && (
                        <div className="mt-6">
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    ['Collected', `Rs. ${paymentCollected.toLocaleString('en-IN')}`, 'Success payments', 'text-emerald-700'],
                                    ['Pending', `Rs. ${paymentPendingAmount.toLocaleString('en-IN')}`, 'Pending and manual review', 'text-amber-700'],
                                    ['Failed', `Rs. ${paymentFailedAmount.toLocaleString('en-IN')}`, 'Failed payments', 'text-red-700'],
                                    ['Payment Records', paymentRows.length.toLocaleString('en-IN'), 'Submitted/payment rows', 'text-zinc-950'],
                                ].map(([label, value, note, tone]) => (
                                    <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                        <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
                                        <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
                                        <p className="mt-1 text-xs font-semibold text-zinc-500">{note}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Payment Records</h2>
                                    <p className="mt-1 text-sm text-zinc-600">Payment status, transaction references, payable amount, and approval state from registrations.</p>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="search"
                                        value={paymentSearch}
                                        onChange={(event) => setPaymentSearch(event.target.value)}
                                        placeholder="Search reg no, name, transaction..."
                                        className="admin-input rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={loadRegistrations}
                                        disabled={registrationsLoading}
                                        className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {registrationsLoading ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>

                            {paymentUpdateError && (
                                <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{paymentUpdateError}</p>
                            )}

                            {registrationsError && (
                                <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{registrationsError}</p>
                            )}

                            {!registrationsLoading && !registrationsError && filteredPaymentRows.length === 0 && (
                                <p className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm font-semibold text-zinc-600">
                                    {paymentSearch ? 'No payments match your search.' : 'No payment records are available yet.'}
                                </p>
                            )}

                            {filteredPaymentRows.length > 0 && (
                                <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
                                    <table className="min-w-[1100px] w-full text-left text-sm">
                                        <thead className="bg-zinc-100 text-xs font-bold uppercase text-zinc-600">
                                            <tr>
                                                <th className="px-4 py-3">Registration</th>
                                                <th className="px-4 py-3">Participant</th>
                                                <th className="px-4 py-3">Contact</th>
                                                <th className="px-4 py-3">Transaction</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Payment</th>
                                                <th className="px-4 py-3">Approval</th>
                                                <th className="px-4 py-3">Submitted</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 bg-white">
                                            {filteredPaymentRows.map((registration) => (
                                                <tr key={registration.id} className="align-top hover:bg-zinc-50">
                                                    <td className="px-4 py-4">
                                                        <p className="font-mono text-xs font-bold text-emerald-800">{registration.registrationNumber || `Draft #${registration.id}`}</p>
                                                        <p className="mt-1 capitalize text-xs text-zinc-500">{registration.registrationMode}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-bold text-zinc-950">{registration.participantName || registration.groupCoordinatorName || 'Not entered'}</p>
                                                        <p className="mt-1 max-w-[220px] truncate text-xs text-zinc-500">{registration.category || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-zinc-700">
                                                        <p>{registration.email || registration.groupCoordinatorEmail || '-'}</p>
                                                        <p className="mt-1">{registration.whatsappNumber || registration.groupCoordinatorWhatsapp || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="max-w-[260px] whitespace-pre-wrap text-xs font-semibold text-zinc-700">{registration.transactionDetails || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-bold text-zinc-950">Rs. {registration.totalPayableAmount.toLocaleString('en-IN')}</p>
                                                        <p className="mt-1 text-xs text-zinc-500">Reg: Rs. {registration.registrationFee.toLocaleString('en-IN')}</p>
                                                        {(registration.competitionFee > 0 || registration.workshopFee > 0) && (
                                                            <p className="mt-1 text-xs text-zinc-500">Extras: Rs. {(registration.competitionFee + registration.workshopFee).toLocaleString('en-IN')}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <select
                                                            value={registration.paymentStatus || 'pending'}
                                                            onChange={(event) => updatePaymentStatusInline(registration, event.target.value)}
                                                            disabled={paymentUpdatingId === registration.id}
                                                            className={`admin-input w-52 rounded-md border border-zinc-300 px-2.5 py-2 text-xs font-bold capitalize ${paymentStatusBadgeClass(registration.paymentStatus)}`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="success">Success</option>
                                                            <option value="failed">Failed</option>
                                                            <option value="manual_verification_required">Manual verification required</option>
                                                            <option value="refunded">Refunded</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${approvalStatusBadgeClass(registration.approvalStatus)}`}>
                                                            {formatAdminStatus(registration.approvalStatus)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs text-zinc-600">
                                                        {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(registration.submittedAt || registration.updatedAt || registration.createdAt))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {['categories', 'pricing'].includes(activeModule) && (
                        <div className="mt-2">
                            {activeModule === 'categories' && (
                            <div>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-zinc-950">Registration categories</h2>
                                        <p className="mt-1 text-sm text-zinc-500">Manage the categories shown in the General registration step.</p>
                                    </div>
                                    <button type="button" onClick={addPricingCategory} className="rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-900">
                                        Add New Category
                                    </button>
                                </div>

                                {pricingError && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{pricingError}</p>}
                                {pricingLoading ? (
                                    <p className="mt-5 rounded-lg border border-zinc-200 py-12 text-center text-sm text-zinc-500">Loading categories...</p>
                                ) : (
                                    <div className="mt-5 overflow-x-auto rounded-lg border border-zinc-200">
                                        <table className="min-w-[720px] w-full text-left text-sm">
                                            <thead className="bg-zinc-100 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                                <tr>
                                                    <th className="px-4 py-3">Category</th>
                                                    <th className="px-4 py-3">Registration Fee</th>
                                                    <th className="px-4 py-3">Display Order</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-200 bg-white">
                                                {pricingCategories.map((category) => (
                                                    <tr key={category.id} className="hover:bg-zinc-50">
                                                        <td className="px-4 py-4 font-semibold text-zinc-950">{category.name}</td>
                                                        <td className="px-4 py-4 font-medium text-zinc-800">Rs. {category.registrationFee.toLocaleString('en-IN')}</td>
                                                        <td className="px-4 py-4 text-zinc-600">{category.sortOrder}</td>
                                                        <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'}`}>{category.isActive ? 'Active' : 'Hidden'}</span></td>
                                                        <td className="px-4 py-4 text-right"><button type="button" onClick={() => editPricingCategory(category)} className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">Edit</button></td>
                                                    </tr>
                                                ))}
                                                {!pricingCategories.length && <tr><td colSpan="5" className="px-4 py-12 text-center text-sm text-zinc-500">No registration categories found.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {categoryDrawerOpen && (
                                    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/45" role="dialog" aria-modal="true" aria-label={editingCategoryId ? 'Edit category' : 'Add category'}>
                                        <button type="button" className="absolute inset-0 cursor-default" onClick={resetCategoryForm} aria-label="Close category panel" />
                                        <form onSubmit={savePricingCategory} className="relative flex h-full w-full max-w-lg flex-col border-l border-zinc-200 bg-white shadow-2xl">
                                            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-5 sm:px-6">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Registration Setup</p>
                                                    <h2 className="mt-1 text-xl font-semibold text-zinc-950">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h2>
                                                    <p className="mt-1 text-sm text-zinc-500">Set the category name, base fee, order, and visibility.</p>
                                                </div>
                                                <button type="button" onClick={resetCategoryForm} className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100">Close</button>
                                            </div>
                                            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
                                                <label className="block text-sm font-medium text-zinc-800">
                                                    Category Name
                                                    <input required autoFocus value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm" placeholder="e.g. Student Delegate" />
                                                </label>
                                                <label className="block text-sm font-medium text-zinc-800">
                                                    Registration Fee (Rs.)
                                                    <input type="number" min="0" step="0.01" required value={categoryForm.registrationFee} onChange={(event) => setCategoryForm((current) => ({ ...current, registrationFee: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm" />
                                                </label>
                                                <label className="block text-sm font-medium text-zinc-800">
                                                    Display Order
                                                    <input type="number" min="0" value={categoryForm.sortOrder} onChange={(event) => setCategoryForm((current) => ({ ...current, sortOrder: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm" />
                                                </label>
                                                <label className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-800">
                                                    <span><span className="block font-semibold">Active on registration</span><span className="mt-1 block text-xs font-normal text-zinc-500">Inactive categories are hidden from delegates.</span></span>
                                                    <input type="checkbox" checked={categoryForm.isActive} onChange={(event) => setCategoryForm((current) => ({ ...current, isActive: event.target.checked }))} />
                                                </label>
                                            </div>
                                            <div className="flex justify-end gap-3 border-t border-zinc-200 px-5 py-4 sm:px-6">
                                                <button type="button" onClick={resetCategoryForm} className="rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">Cancel</button>
                                                <button type="submit" disabled={pricingSaving} className="rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50">{pricingSaving ? 'Saving...' : editingCategoryId ? 'Save Changes' : 'Add Category'}</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                            )}

                            {activeModule === 'pricing' && (
                            <div className="min-w-0 rounded-lg border border-zinc-200 bg-white p-5">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-zinc-950">Competition availability and pricing</h2>
                                        <p className="mt-1 text-sm text-zinc-500">Choose a category, then set which student competitions appear and what they cost. Workshop prices are managed globally under Programs.</p>
                                    </div>
                                    <label className="text-sm font-medium text-zinc-800">
                                        Category
                                        <select value={selectedPricingCategoryId} onChange={(event) => setSelectedPricingCategoryId(event.target.value)} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm sm:min-w-72">
                                            {pricingCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                        </select>
                                    </label>
                                </div>

                                {pricingError && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{pricingError}</p>}
                                {pricingLoading ? (
                                    <p className="mt-5 py-10 text-center text-sm text-zinc-500">Loading pricing...</p>
                                ) : (
                                    <div className="mt-5 overflow-x-auto rounded-lg border border-zinc-200">
                                        <table className="min-w-[680px] w-full text-left text-sm">
                                            <thead className="bg-zinc-100 text-xs font-semibold uppercase text-zinc-500"><tr><th className="px-4 py-3">Program</th><th className="px-4 py-3">Section</th><th className="px-4 py-3">Price (Rs.)</th><th className="px-4 py-3">Available</th></tr></thead>
                                            <tbody className="divide-y divide-zinc-200">
                                                {pricingPrograms.filter((program) => program.type === 'competition').map((program) => {
                                                    const categoryPrice = program.categoryPricing.find((item) => String(item.categoryId) === String(selectedPricingCategoryId)) || { price: 0, isAvailable: true };
                                                    return (
                                                        <tr key={`${selectedPricingCategoryId}-${program.id}`}>
                                                            <td className="px-4 py-3"><p className="font-semibold text-zinc-950">{program.name}</p>{!program.isActive && <p className="mt-1 text-xs text-zinc-500">Program is globally hidden</p>}</td>
                                                            <td className="px-4 py-3 text-xs font-medium capitalize text-zinc-600">{program.type}</td>
                                                            <td className="px-4 py-3"><input key={`${program.id}-${selectedPricingCategoryId}-${categoryPrice.price}-${categoryPrice.isAvailable}`} type="number" min="0" step="0.01" disabled={!categoryPrice.isAvailable} defaultValue={categoryPrice.price} onBlur={(event) => saveProgramCategoryPricing(program, selectedPricingCategoryId, { price: event.target.value })} className="admin-input w-32 rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100 disabled:text-zinc-400" /></td>
                                                            <td className="px-4 py-3">
                                                                <button type="button" role="switch" aria-checked={categoryPrice.isAvailable} onClick={() => saveProgramCategoryPricing(program, selectedPricingCategoryId, { isAvailable: !categoryPrice.isAvailable })} className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600">
                                                                    <span className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition ${categoryPrice.isAvailable ? 'bg-emerald-600' : 'bg-zinc-300'}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition ${categoryPrice.isAvailable ? 'translate-x-[18px]' : 'translate-x-0.5'}`} /></span>
                                                                    {categoryPrice.isAvailable ? 'Included' : 'Excluded'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                    )}

                    {activeModule === 'programs' && (
                        <div className="mt-2">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-950">Event programs</h2>
                                    <p className="mt-1 text-sm text-zinc-500">Manage competitions, workshops, capacity, order, and visibility.</p>
                                </div>
                                <button type="button" onClick={addProgram} className="rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-900">Add New Program</button>
                            </div>

                            <div className="mt-5 min-w-0">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {[
                                        ['Total', programs.length],
                                        ['Active', programs.filter((program) => program.isActive).length],
                                        ['Paid', programs.filter((program) => program.price > 0).length],
                                    ].map(([label, value]) => (
                                        <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                            <p className="text-xs font-semibold uppercase text-zinc-500">{label}</p>
                                            <p className="mt-1 text-2xl font-semibold text-zinc-950">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {programsError && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{programsError}</p>}
                                {programsLoading ? (
                                    <p className="mt-4 rounded-lg border border-zinc-200 p-8 text-center text-sm text-zinc-500">Loading programs...</p>
                                ) : (
                                    <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
                                        <table className="min-w-[760px] w-full text-left text-sm">
                                            <thead className="bg-zinc-100 text-xs font-semibold uppercase text-zinc-500">
                                                <tr><th className="px-4 py-3">Program</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Capacity</th><th className="px-4 py-3">Visibility</th><th className="px-4 py-3 text-right">Actions</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-200 bg-white">
                                                {programs.map((program) => (
                                                    <tr key={program.id} className="align-top">
                                                        <td className="px-4 py-3"><p className="font-semibold text-zinc-950">{program.name}</p>{program.description && <p className="mt-1 max-w-xs text-xs text-zinc-500">{program.description}</p>}</td>
                                                        <td className="px-4 py-3 text-xs font-medium capitalize text-zinc-600">{program.type}</td>
                                                        <td className="px-4 py-3 font-semibold text-zinc-950">{program.price ? `Rs. ${program.price.toLocaleString('en-IN')}` : 'Free'}</td>
                                                        <td className="px-4 py-3 text-zinc-600">{program.capacity || 'Unlimited'}</td>
                                                        <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${program.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'}`}>{program.isActive ? 'Active' : 'Hidden'}</span></td>
                                                        <td className="px-4 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => editProgram(program)} className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">Edit</button><button type="button" onClick={() => toggleProgramActive(program)} className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">{program.isActive ? 'Hide' : 'Activate'}</button></div></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {programDrawerOpen && (
                                <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/45" role="dialog" aria-modal="true" aria-label={editingProgramId ? 'Edit program' : 'Add program'}>
                                    <button type="button" className="absolute inset-0 cursor-default" onClick={resetProgramForm} aria-label="Close program panel" />
                                    <form onSubmit={saveProgram} className="relative flex h-full w-full max-w-xl flex-col border-l border-zinc-200 bg-white shadow-2xl">
                                        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-5 sm:px-6">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Event Setup</p>
                                                <h2 className="mt-1 text-xl font-semibold text-zinc-950">{editingProgramId ? 'Edit Program' : 'Add New Program'}</h2>
                                                <p className="mt-1 text-sm text-zinc-500">Configure the program details shown during registration.</p>
                                            </div>
                                            <button type="button" onClick={resetProgramForm} className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100">Close</button>
                                        </div>
                                        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
                                            <label className="block text-sm font-medium text-zinc-800">
                                                Program Name
                                                <input required autoFocus value={programForm.name} onChange={(event) => setProgramForm((current) => ({ ...current, name: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm" placeholder="e.g. Clinical Pharmacy Workshop" />
                                            </label>
                                            <label className="block text-sm font-medium text-zinc-800">
                                                Registration Section
                                                <select value={programForm.type} onChange={(event) => setProgramForm((current) => ({ ...current, type: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm">
                                                    <option value="competition">Student Competition</option>
                                                    <option value="workshop">Pre-Conference Workshop</option>
                                                </select>
                                            </label>
                                            <label className="block text-sm font-medium text-zinc-800">
                                                Description
                                                <textarea rows={4} value={programForm.description} onChange={(event) => setProgramForm((current) => ({ ...current, description: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm" placeholder="Short information shown during registration" />
                                            </label>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <label className="block text-sm font-medium text-zinc-800">
                                                    Default Price (Rs.)
                                                    <input type="number" min="0" step="0.01" required value={programForm.price} onChange={(event) => setProgramForm((current) => ({ ...current, price: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm" />
                                                </label>
                                                <label className="block text-sm font-medium text-zinc-800">
                                                    Capacity
                                                    <input type="number" min="1" value={programForm.capacity} onChange={(event) => setProgramForm((current) => ({ ...current, capacity: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm" placeholder="Unlimited" />
                                                </label>
                                            </div>
                                            <label className="block text-sm font-medium text-zinc-800">
                                                Display Order
                                                <input type="number" min="0" value={programForm.sortOrder} onChange={(event) => setProgramForm((current) => ({ ...current, sortOrder: event.target.value }))} className="admin-input mt-2 w-full rounded-md border border-zinc-300 px-3 py-2.5 text-sm" />
                                            </label>
                                            {programForm.type === 'competition' ? (
                                            <div>
                                                <div className="flex items-end justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-900">Category Mapping</p>
                                                        <p className="mt-1 text-xs leading-5 text-zinc-500">Select the registration categories where this program should appear and set the price for each.</p>
                                                    </div>
                                                    <span className="text-xs font-semibold text-zinc-500">{programForm.categoryPricing.filter((item) => item.isAvailable).length} selected</span>
                                                </div>
                                                <div className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
                                                    {pricingCategories.map((category) => {
                                                        const mapping = programForm.categoryPricing.find((item) => String(item.categoryId) === String(category.id)) || { categoryId: category.id, price: 0, isAvailable: false };
                                                        return (
                                                            <div key={category.id} className={`grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_140px] sm:items-center ${mapping.isAvailable ? 'bg-emerald-50/50' : 'bg-white'}`}>
                                                                <div className="flex items-start gap-3 text-sm text-zinc-800">
                                                                    <button type="button" role="switch" aria-checked={mapping.isAvailable} aria-label={`${mapping.isAvailable ? 'Exclude' : 'Include'} ${category.name}`} onClick={() => updateProgramCategoryMapping(category.id, { isAvailable: !mapping.isAvailable })} className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full transition ${mapping.isAvailable ? 'bg-emerald-600' : 'bg-zinc-300'}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition ${mapping.isAvailable ? 'translate-x-[18px]' : 'translate-x-0.5'}`} /></button>
                                                                    <span><span className="block font-semibold">{category.name}</span><span className="mt-1 block text-xs text-zinc-500">{mapping.isAvailable ? 'Included in this category' : 'Not included in this category'}</span>{!category.isActive && <span className="mt-1 block text-xs text-zinc-500">Category is currently hidden</span>}</span>
                                                                </div>
                                                                <label className="text-xs font-medium text-zinc-600">
                                                                    Price (Rs.)
                                                                    <input type="number" min="0" step="0.01" disabled={!mapping.isAvailable} value={mapping.price} onChange={(event) => updateProgramCategoryMapping(category.id, { price: event.target.value })} className="admin-input mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100 disabled:text-zinc-400" />
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                    {!pricingCategories.length && <p className="p-4 text-sm text-zinc-500">Create a registration category before mapping this program.</p>}
                                                </div>
                                            </div>
                                            ) : (
                                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                                                    Pre-Conference Workshops do not require category mapping. The default price above applies to every active registration category.
                                                </div>
                                            )}
                                            <label className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-800">
                                                <span><span className="block font-semibold">Active on registration</span><span className="mt-1 block text-xs font-normal text-zinc-500">Inactive programs are hidden from all categories.</span></span>
                                                <input type="checkbox" checked={programForm.isActive} onChange={(event) => setProgramForm((current) => ({ ...current, isActive: event.target.checked }))} />
                                            </label>
                                        </div>
                                        <div className="flex justify-end gap-3 border-t border-zinc-200 px-5 py-4 sm:px-6">
                                            <button type="button" onClick={resetProgramForm} className="rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">Cancel</button>
                                            <button type="submit" disabled={programSaving} className="rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50">{programSaving ? 'Saving...' : editingProgramId ? 'Save Changes' : 'Add Program'}</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {activeModule === 'students' && (
                        <div className="mt-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                    <p className="text-xs font-bold uppercase text-zinc-500">Eligible Students</p>
                                    <p className="mt-2 text-2xl font-bold text-zinc-950">{approvedPaidStudents.length.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                    <p className="text-xs font-bold uppercase text-zinc-500">Approved Registrations</p>
                                    <p className="mt-2 text-2xl font-bold text-zinc-950">{registrations.filter((registration) => registration.approvalStatus === 'approved').length.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                    <p className="text-xs font-bold uppercase text-zinc-500">Payment Success</p>
                                    <p className="mt-2 text-2xl font-bold text-zinc-950">{registrations.filter((registration) => registration.paymentStatus === 'success').length.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Approved &amp; Paid Students</h2>
                                    <p className="mt-1 text-sm text-zinc-600">Only submitted registrations with payment success and admin approval are listed here.</p>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="search"
                                        value={studentSearch}
                                        onChange={(event) => setStudentSearch(event.target.value)}
                                        placeholder="Search student, college, number..."
                                        className="admin-input rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={loadRegistrations}
                                        disabled={registrationsLoading}
                                        className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {registrationsLoading ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>

                            {registrationsError && (
                                <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{registrationsError}</p>
                            )}

                            {!registrationsLoading && !registrationsError && filteredStudents.length === 0 && (
                                <p className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm font-semibold text-zinc-600">
                                    {studentSearch ? 'No eligible students match your search.' : 'No approved and paid students yet.'}
                                </p>
                            )}

                            {filteredStudents.length > 0 && (
                                <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
                                    <table className="min-w-[1000px] w-full text-left text-sm">
                                        <thead className="bg-zinc-100 text-xs font-bold uppercase text-zinc-600">
                                            <tr>
                                                <th className="px-4 py-3">Reg. No.</th>
                                                <th className="px-4 py-3">Student</th>
                                                <th className="px-4 py-3">Contact</th>
                                                <th className="px-4 py-3">Course / Category</th>
                                                <th className="px-4 py-3">College / State</th>
                                                <th className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 bg-white">
                                            {filteredStudents.map((student) => (
                                                <tr key={student.id} className="align-top hover:bg-zinc-50">
                                                    <td className="px-4 py-4">
                                                        <p className="font-mono text-xs font-bold text-emerald-800">{student.registrationNumber}</p>
                                                        <p className="mt-1 text-xs capitalize text-zinc-500">{student.registrationMode}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-bold text-zinc-950">{student.name || '-'}</p>
                                                        {student.coordinator && <p className="mt-1 text-xs text-zinc-500">Coordinator: {student.coordinator}</p>}
                                                    </td>
                                                    <td className="px-4 py-4 text-zinc-700">
                                                        <p>{student.email || '-'}</p>
                                                        <p className="mt-1">{student.whatsapp || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-semibold text-zinc-800">{student.course || '-'}</p>
                                                        <p className="mt-1 text-xs text-zinc-500">{student.category || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="max-w-xs text-zinc-700">{student.college || '-'}</p>
                                                        <p className="mt-1 text-xs text-zinc-500">{student.state || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${paymentStatusBadgeClass(student.paymentStatus)}`}>
                                                            Payment: {formatAdminStatus(student.paymentStatus)}
                                                        </span>
                                                        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${approvalStatusBadgeClass(student.approvalStatus)}`}>
                                                            Approval: {formatAdminStatus(student.approvalStatus)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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

                    {activeModule === 'accommodation' && (
                        <div className="mt-6 space-y-5">
                            <div className="admin-card rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                                {accommodationCmsLoading ? (
                                    <p className="mt-6 text-sm font-semibold text-zinc-500">Loading content...</p>
                                ) : (
                                    <div className="mt-6 space-y-6">
                                        {activeAccommodationSection === 'settings' && (
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {[
                                                    ['pageTitle', 'Page Title'],
                                                    ['heading', 'Main Heading'],
                                                    ['assistanceTitle', 'Assistance Box Title'],
                                                    ['contactPerson', 'Contact Person'],
                                                ].map(([name, label]) => (
                                                    <label key={name} className="block text-sm font-semibold text-zinc-800">
                                                        {label}
                                                        <input
                                                            className="admin-input mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                            value={accommodationCms[name]}
                                                            onChange={(event) => updateAccommodationField(name, event.target.value)}
                                                        />
                                                    </label>
                                                ))}
                                                <label className="block text-sm font-semibold text-zinc-800 md:col-span-2">
                                                    Tariff Notes
                                                    <textarea
                                                        className="admin-input mt-2 min-h-20 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                        value={accommodationCms.tariffNotes}
                                                        onChange={(event) => updateAccommodationField('tariffNotes', event.target.value)}
                                                    />
                                                </label>
                                                <label className="block text-sm font-semibold text-zinc-800 md:col-span-2">
                                                    Route Notes
                                                    <textarea
                                                        className="admin-input mt-2 min-h-20 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                        value={accommodationCms.routeNotes}
                                                        onChange={(event) => updateAccommodationField('routeNotes', event.target.value)}
                                                    />
                                                </label>
                                                <label className="block text-sm font-semibold text-zinc-800 md:col-span-2">
                                                    Intro Copy
                                                    <textarea
                                                        className="admin-input mt-2 min-h-24 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                        value={accommodationCms.intro}
                                                        onChange={(event) => updateAccommodationField('intro', event.target.value)}
                                                    />
                                                </label>
                                                <label className="block text-sm font-semibold text-zinc-800 md:col-span-2">
                                                    Assistance Box Copy
                                                    <textarea
                                                        className="admin-input mt-2 min-h-20 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                                                        value={accommodationCms.assistanceCopy}
                                                        onChange={(event) => updateAccommodationField('assistanceCopy', event.target.value)}
                                                    />
                                                </label>
                                            </div>
                                        )}

                                        {activeAccommodationSection === 'spaces' && (
                                            renderAccommodationCrudTable({
                                                sectionKey: 'accommodationSpaces',
                                                title: 'Accommodation Space',
                                                fields: ['name', 'type', 'distance', 'tariff', 'contact', 'notes'],
                                                emptyText: 'No accommodation spaces have been added.',
                                                columns: [
                                                    { field: 'name', label: 'Accommodation' },
                                                    { field: 'type', label: 'Type' },
                                                    { field: 'distance', label: 'Distance' },
                                                    { field: 'tariff', label: 'Tariff' },
                                                    { field: 'contact', label: 'Contact' },
                                                    { field: 'notes', label: 'Notes', multiline: true, wide: true, wrap: true },
                                                ],
                                            })
                                        )}

                                        {activeAccommodationSection === 'pickup-points' && (
                                            renderAccommodationCrudTable({
                                                sectionKey: 'pickupPoints',
                                                title: 'Pickup Point',
                                                fields: ['name', 'type', 'distance', 'eta', 'instruction'],
                                                emptyText: 'No pickup points have been added.',
                                                columns: [
                                                    { field: 'name', label: 'Point' },
                                                    { field: 'type', label: 'Type' },
                                                    { field: 'distance', label: 'Distance' },
                                                    { field: 'eta', label: 'Estimated Travel' },
                                                    { field: 'instruction', label: 'Pickup Instruction', multiline: true, wide: true, wrap: true },
                                                ],
                                            })
                                        )}

                                        {activeAccommodationSection === 'tourist-attractions' && (
                                            renderAccommodationCrudTable({
                                                sectionKey: 'touristAttractions',
                                                title: 'Tourist Attraction',
                                                fields: ['name', 'category', 'distance', 'image', 'description'],
                                                emptyText: 'No tourist attractions have been added.',
                                                columns: [
                                                    { field: 'image', label: 'Photo' },
                                                    { field: 'name', label: 'Attraction' },
                                                    { field: 'category', label: 'Category' },
                                                    { field: 'distance', label: 'Distance' },
                                                    { field: 'description', label: 'Description', multiline: true, wide: true, wrap: true },
                                                ],
                                            })
                                        )}

                                        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="min-h-6 text-sm font-semibold text-emerald-700">{accommodationCmsNotice}</p>
                                            <button
                                                type="button"
                                                onClick={saveAccommodationCms}
                                                disabled={accommodationCmsSaving}
                                                className="admin-button rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
                                            >
                                                {accommodationCmsSaving ? 'Saving...' : `Save ${activeAccommodationSectionMeta.label}`}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeModule === 'abstracts' && (
                        <div className="mt-6 space-y-8">
                            {/* ── Abstract Submissions ─────────────────────────────── */}
                            {activeAbstractsSection === 'student-abstracts' && (
                            <div className="rounded-xl border border-zinc-200 bg-white p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-zinc-900">Abstract Submissions</h3>
                                        <p className="mt-1 text-sm text-zinc-500">Review Vercel Blob uploaded abstracts and accept or reject submissions. Accepted participants can then submit their poster video link.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={loadAdminAbstracts}
                                        disabled={adminAbstractsLoading}
                                        className="rounded-lg bg-[#0d124f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a2070] disabled:opacity-50"
                                    >
                                        {adminAbstractsLoading ? 'Loading…' : adminAbstracts.length ? 'Refresh' : 'Load Submissions'}
                                    </button>
                                </div>

                                {adminAbstractsError && <p className="mt-3 text-sm font-medium text-red-600">{adminAbstractsError}</p>}

                                {adminAbstracts.length > 0 && (
                                    <div className="mt-5 overflow-x-auto">
                                        <table className="w-full min-w-[700px] text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-zinc-200">
                                                    <th className="pb-3 pr-4 text-xs font-bold uppercase text-zinc-500">Reg. No.</th>
                                                    <th className="pb-3 pr-4 text-xs font-bold uppercase text-zinc-500">Participant</th>
                                                    <th className="pb-3 pr-4 text-xs font-bold uppercase text-zinc-500">File</th>
                                                    <th className="pb-3 pr-4 text-xs font-bold uppercase text-zinc-500">Status</th>
                                                    <th className="pb-3 pr-4 text-xs font-bold uppercase text-zinc-500">Video Link</th>
                                                    <th className="pb-3 pr-4 text-xs font-bold uppercase text-zinc-500">Video Review</th>
                                                    <th className="pb-3 text-xs font-bold uppercase text-zinc-500">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-100">
                                                {adminAbstracts.map((abs) => (
                                                    <tr key={abs.id}>
                                                        <td className="py-3 pr-4 font-mono text-xs font-medium text-zinc-700">{abs.registrationNumber}</td>
                                                        <td className="py-3 pr-4">
                                                            <p className="text-xs font-semibold text-zinc-800">{abs.participantName || '—'}</p>
                                                            <p className="text-xs text-zinc-500">{abs.institutionName || ''}</p>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => downloadAbstract(abs.id, abs.fileName)}
                                                                className="text-xs font-medium text-[#0d124f] underline hover:text-[#df0867]"
                                                            >
                                                                {abs.fileName}
                                                            </button>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${abs.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : abs.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {abs.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 pr-4 max-w-[140px]">
                                                            {abs.posterVideoLink ? (
                                                                <a href={abs.posterVideoLink} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-[#0d124f] underline">{abs.posterVideoLink}</a>
                                                            ) : <span className="text-xs text-zinc-400">—</span>}
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            {abs.posterVideoLink ? (
                                                                videoReviewing === abs.id ? (
                                                                    <div className="space-y-2">
                                                                        <textarea
                                                                            rows={2}
                                                                            value={videoReviewRemarksDraft}
                                                                            onChange={(e) => setVideoReviewRemarksDraft(e.target.value)}
                                                                            placeholder="Video remarks (optional)"
                                                                            className="w-48 rounded border border-zinc-300 px-2 py-1 text-xs focus:outline-none"
                                                                        />
                                                                        <div className="flex flex-wrap gap-1">
                                                                            <button type="button" onClick={() => reviewAbstractVideo(abs.id, 'shortlisted')} className="rounded bg-sky-600 px-2 py-1 text-xs font-semibold text-white hover:bg-sky-700">Shortlist</button>
                                                                            <button type="button" onClick={() => reviewAbstractVideo(abs.id, 'approved')} className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700">Approve</button>
                                                                            <button type="button" onClick={() => reviewAbstractVideo(abs.id, 'rejected')} className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700">Reject</button>
                                                                            <button type="button" onClick={() => reviewAbstractVideo(abs.id, 'pending')} className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100">Pending</button>
                                                                            <button type="button" onClick={() => { setVideoReviewing(null); setVideoReviewRemarksDraft(''); }} className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100">Cancel</button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-2">
                                                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                                                                            abs.videoReviewStatus === 'approved'
                                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                                : abs.videoReviewStatus === 'rejected'
                                                                                    ? 'bg-red-100 text-red-700'
                                                                                    : abs.videoReviewStatus === 'shortlisted'
                                                                                        ? 'bg-sky-100 text-sky-700'
                                                                                        : 'bg-amber-100 text-amber-700'
                                                                        }`}>
                                                                            {formatAdminStatus(abs.videoReviewStatus || 'pending')}
                                                                        </span>
                                                                        {abs.videoReviewRemarks && <p className="max-w-[180px] text-xs text-zinc-500">{abs.videoReviewRemarks}</p>}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => { setVideoReviewing(abs.id); setVideoReviewRemarksDraft(abs.videoReviewRemarks || ''); }}
                                                                            className="block rounded border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                                                                        >
                                                                            Review Video
                                                                        </button>
                                                                    </div>
                                                                )
                                                            ) : (
                                                                <span className="text-xs text-zinc-400">Awaiting video</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3">
                                                            {abstractReviewing === abs.id ? (
                                                                <div className="space-y-2">
                                                                    <textarea
                                                                        rows={2}
                                                                        value={abstractRemarksDraft}
                                                                        onChange={(e) => setAbstractRemarksDraft(e.target.value)}
                                                                        placeholder="Remarks (optional)"
                                                                        className="w-48 rounded border border-zinc-300 px-2 py-1 text-xs focus:outline-none"
                                                                    />
                                                                    <div className="flex gap-1">
                                                                        <button type="button" onClick={() => reviewAbstract(abs.id, 'accepted')} className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700">Accept</button>
                                                                        <button type="button" onClick={() => reviewAbstract(abs.id, 'rejected')} className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700">Reject</button>
                                                                        <button type="button" onClick={() => { setAbstractReviewing(null); setAbstractRemarksDraft(''); }} className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100">Cancel</button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setAbstractReviewing(abs.id); setAbstractRemarksDraft(abs.adminRemarks || ''); }}
                                                                    className="rounded border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                                                                >
                                                                    Review
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {!adminAbstractsLoading && adminAbstracts.length === 0 && (
                                    <p className="mt-4 text-sm text-zinc-400">No submissions yet. Click "Load Submissions" to fetch data.</p>
                                )}
                            </div>
                            )}

                            {/* ── Abstract Book PDF ──────────────────────────────── */}
                            {activeAbstractsSection === 'abstract-book' && (
                            <div className="rounded-xl border border-zinc-200 bg-white p-6">
                                <h3 className="text-base font-bold text-zinc-900">Abstract Book PDF</h3>
                                <p className="mt-1 text-sm text-zinc-500">Upload the final abstract book PDF. It will be displayed as an embedded viewer on the Scientific Service public page.</p>

                                {abstractBookLoading ? (
                                    <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm font-medium text-zinc-500">
                                        Loading abstract book...
                                    </div>
                                ) : abstractBook?.fileUrl ? (
                                    <div className="mt-5 space-y-4">
                                        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                </svg>
                                                <span className="truncate text-sm font-medium text-emerald-800">{abstractBook.fileName}</span>
                                            </div>
                                            <span className="ml-2 shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                                        </div>
                                        <iframe
                                            src={abstractBook.fileUrl}
                                            title="Abstract Book Preview"
                                            className="h-[500px] w-full rounded-lg border border-zinc-200"
                                        />
                                        <div className="flex gap-3">
                                            <label className="cursor-pointer rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100">
                                                {abstractBookUploading ? 'Uploading...' : 'Replace PDF'}
                                                <input type="file" accept="application/pdf" className="sr-only" onChange={handleAbstractBookUpload} disabled={abstractBookUploading} />
                                            </label>
                                            <button type="button" onClick={removeAbstractBook} className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100">
                                                Remove
                                            </button>
                                        </div>
                                        {abstractBookError && <p className="text-xs font-medium text-red-600">{abstractBookError}</p>}
                                    </div>
                                ) : (
                                    <div className="mt-5">
                                        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30">
                                            {abstractBookUploading ? (
                                                <span className="text-sm font-medium text-zinc-500">Uploading PDF...</span>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-zinc-600">Click to upload Abstract Book PDF</span>
                                                    <span className="text-xs text-zinc-400">PDF only · Max 10 MB</span>
                                                </>
                                            )}
                                            <input type="file" accept="application/pdf" className="sr-only" onChange={handleAbstractBookUpload} disabled={abstractBookUploading} />
                                        </label>
                                        {abstractBookError && <p className="mt-2 text-xs font-medium text-red-600">{abstractBookError}</p>}
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                    )}

                    {!implementedAdminModules.has(activeModule) && (
                        <div className="py-10 sm:py-16">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 shadow-sm">
                                <AdminSidebarIcon name={activeModule} />
                            </div>
                            <div className="mx-auto mt-5 max-w-lg text-center">
                                <h2 className="text-lg font-semibold text-zinc-950">{activeModuleMeta.label} workspace</h2>
                                <p className="mt-2 text-sm leading-6 text-zinc-500">
                                    This page now has its own route and is ready for its database workflow, filters, actions, and permission rules.
                                </p>
                            </div>
                            <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                                {['Database integration', 'Role permissions', 'Reports & exports'].map((item) => (
                                    <div key={item} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-4 text-center text-xs font-medium text-zinc-500">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

const coreAreas = [
    'Pharmaceutical Technology',
    'Medicinal Chemistry',
    'Pharmacognosy, Indigenous Drugs, Herbal Formulations and Phytochemistry',
    'Pharmacology and Toxicology',
    'Clinical Research & Pharmacovigilance',
    'Pharmaceutical Analysis and Quality Assurance',
    'Biotechnology and Biotherapeutics',
    'Hospital, Community and Clinical Pharmacy',
    'Artificial Intelligence / Bioinformatics / Data Analytics',
];

const rejectionCriteria = [
    'Review articles',
    'Papers without methodology and results',
    'Papers describing simple laboratory experiments',
    'Papers describing Patho-physiology of a disease',
    'Papers describing treatment in a single patient',
];

const presentationGuidelines = [
    {
        title: 'Poster Dimensions',
        detail: 'A0 size (841 mm × 1189 mm), portrait orientation. Print on glossy or matte paper.',
    },
    {
        title: 'Content Structure',
        detail: 'Title, Authors & Affiliations, Introduction, Objectives, Materials & Methods, Results, Discussion, Conclusion, References.',
    },
    {
        title: 'Font & Readability',
        detail: 'Title ≥ 72 pt, Section headings ≥ 36 pt, Body text ≥ 24 pt. Use high-contrast colour schemes.',
    },
    {
        title: 'Figures & Tables',
        detail: 'Minimum 300 DPI resolution. All figures and tables must be numbered and labelled.',
    },
    {
        title: 'Oral Presentation',
        detail: '8 minutes presentation + 2 minutes Q&A. PowerPoint / PDF slides only. Submit slides 30 minutes before the session.',
    },
    {
        title: 'Originality',
        detail: 'All work must be original and unpublished. Plagiarism check will be conducted by the scientific committee.',
    },
];

function ScientificServicePage() {
    const [openPanel, setOpenPanel] = useState(null);
    const [publicAbstractBook, setPublicAbstractBook] = useState(null);

    // ── Abstract submission state ──────────────────────────────
    const [absRegNum, setAbsRegNum] = useState('');
    const [absChecking, setAbsChecking] = useState(false);
    const [absRegInfo, setAbsRegInfo] = useState(null);
    const [absFile, setAbsFile] = useState(null);
    const [absFileErr, setAbsFileErr] = useState('');
    const [absSubmitting, setAbsSubmitting] = useState(false);
    const [absSubmitError, setAbsSubmitError] = useState('');

    // ── Video link state (shares absRegNum / absRegInfo) ──────
    const [vidLink, setVidLink] = useState('');
    const [vidLinkErr, setVidLinkErr] = useState('');
    const [vidSubmitting, setVidSubmitting] = useState(false);
    const [vidSubmitError, setVidSubmitError] = useState('');

    useEffect(() => {
        let cancelled = false;
        fetch('/api/abstract-book')
            .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
                if (!cancelled && ok) setPublicAbstractBook(data.book || null);
            })
            .catch(() => {
                if (!cancelled) setPublicAbstractBook(null);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    async function checkAbstractReg() {
        const num = absRegNum.trim().toUpperCase();
        if (!num) return;
        setAbsChecking(true);
        setAbsRegInfo(null);
        setAbsFile(null);
        setAbsFileErr('');
        setAbsSubmitError('');
        try {
            const res = await fetch(`/api/abstracts/check?registrationNumber=${encodeURIComponent(num)}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to verify. Please try again.');
            setAbsRegInfo(data);
        } catch (error) {
            setAbsRegInfo({ checkError: error.message || 'Failed to verify. Please try again.' });
        } finally {
            setAbsChecking(false);
        }
    }

    async function submitAbstract() {
        if (!absFile) return;
        setAbsSubmitting(true);
        setAbsSubmitError('');
        try {
            const extension = absFile.name.split('.').pop()?.toLowerCase();
            if (!['pdf', 'docx'].includes(extension)) {
                throw new Error('Upload a text-only PDF or DOCX file.');
            }
            if (absFile.size > 1 * 1024 * 1024) {
                throw new Error('File exceeds 1 MB. Please choose a smaller text-only file.');
            }
            const filePreview = await absFile.arrayBuffer();
            const searchableContent = new TextDecoder('latin1').decode(filePreview);
            if (extension === 'pdf' && /\/Subtype\s*\/Image\b|\/Filter\s*\/(?:DCTDecode|JPXDecode|JBIG2Decode|CCITTFaxDecode)\b/i.test(searchableContent)) {
                throw new Error('Abstract files must contain text only. Remove images, scanned pages, logos, charts, and embedded media before uploading.');
            }
            if (extension === 'docx' && /word\/media\/|word\/embeddings\//i.test(searchableContent)) {
                throw new Error('Abstract files must contain text only. Remove images, charts, and embedded media before uploading.');
            }
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(absFile);
            });
            const res = await fetch('/api/abstracts/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registrationNumber: absRegNum.trim().toUpperCase(),
                    fileName: absFile.name,
                    fileSize: absFile.size,
                    fileType: absFile.type,
                    fileData: base64,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed.');
            setAbsRegInfo((prev) => ({ ...prev, alreadySubmitted: true, abstractStatus: 'pending', fileName: absFile.name }));
            setAbsFile(null);
        } catch (err) {
            setAbsSubmitError(err.message);
        } finally {
            setAbsSubmitting(false);
        }
    }

    async function submitVideoLink() {
        const link = vidLink.trim();
        if (!link) { setVidLinkErr('Please paste your video link.'); return; }
        setVidSubmitting(true);
        setVidSubmitError('');
        setVidLinkErr('');
        try {
            const res = await fetch('/api/abstracts/video-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registrationNumber: absRegNum.trim().toUpperCase(), videoLink: link }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed.');
            setAbsRegInfo((prev) => ({ ...prev, posterVideoLink: link }));
            setVidLink('');
        } catch (err) {
            setVidSubmitError(err.message);
        } finally {
            setVidSubmitting(false);
        }
    }

    function togglePanel(id) {
        setOpenPanel((prev) => (prev === id ? null : id));
    }

    return (
        <div className="bg-zinc-50 text-zinc-950 antialiased">
            {/* Hero banner */}
            <section className="sci-service-hero py-16 text-white sm:py-20">
                {/* Background image — zoom in on load */}
                <img
                    src="/images/nsc-kerala-hero.png"
                    alt=""
                    aria-hidden="true"
                    className="sci-service-hero-image absolute inset-0 h-full w-full object-cover"
                />

                {/* Colour + gradient overlay */}
                <div className="sci-service-hero-overlay absolute inset-0" />

                {/* Subtle grid */}
                <div className="sci-service-hero-grid absolute inset-0" />

                {/* Sheen drift */}
                <div className="hero-sheen absolute inset-0" />

                {/* Floating molecular particles */}
                <span className="sci-hero-particle" style={{ top: '12%',  left: '6%',  width: 72,  height: 72,  '--dur': '9s',  '--delay': '0s',   '--lift': '-14px', '--op-lo': 0.14, '--op-hi': 0.38 }} />
                <span className="sci-hero-particle" style={{ top: '8%',   right: '10%', width: 110, height: 110, '--dur': '11s', '--delay': '1.4s', '--lift': '-20px', '--op-lo': 0.10, '--op-hi': 0.28 }} />
                <span className="sci-hero-particle" style={{ top: '42%',  left: '2%',   width: 52,  height: 52,  '--dur': '7s',  '--delay': '2.8s', '--lift': '-10px', '--op-lo': 0.18, '--op-hi': 0.45 }} />
                <span className="sci-hero-particle" style={{ top: '55%',  right: '5%',  width: 88,  height: 88,  '--dur': '10s', '--delay': '0.6s', '--lift': '-18px', '--op-lo': 0.12, '--op-hi': 0.34 }} />
                <span className="sci-hero-particle" style={{ bottom: '14%', left: '18%', width: 60,  height: 60,  '--dur': '8.5s','--delay': '3.2s', '--lift': '-12px', '--op-lo': 0.15, '--op-hi': 0.40 }} />
                <span className="sci-hero-particle" style={{ bottom: '8%', right: '22%', width: 44,  height: 44,  '--dur': '6.5s','--delay': '1.9s', '--lift': '-9px',  '--op-lo': 0.20, '--op-hi': 0.50 }} />
                <span className="sci-hero-particle" style={{ top: '28%',  left: '42%',  width: 34,  height: 34,  '--dur': '7.5s','--delay': '4.0s', '--lift': '-8px',  '--op-lo': 0.16, '--op-hi': 0.36 }} />
                <span className="sci-hero-particle" style={{ top: '68%',  left: '60%',  width: 58,  height: 58,  '--dur': '9.5s','--delay': '0.2s', '--lift': '-15px', '--op-lo': 0.12, '--op-hi': 0.30 }} />

                {/* Diagonal flow lines */}
                <div className="snapshot-flow-lines pointer-events-none absolute inset-0" aria-hidden="true">
                    {[
                        { top: '22%', delay: '0s',   duration: '13s' },
                        { top: '46%', delay: '4.5s', duration: '10s' },
                        { top: '70%', delay: '8s',   duration: '14s' },
                    ].map((line, i) => (
                        <span
                            key={i}
                            className="snapshot-flow-line"
                            style={{ top: line.top, animationDelay: line.delay, animationDuration: line.duration }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="sci-hero-copy relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-300 ring-1 ring-white/20">
                        <span className="pulse-dot size-1.5 rounded-full bg-amber-300" />
                        14th IPA National Students Congress 2026
                    </div>
                    <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                        Scientific Service &amp; Abstract
                    </h1>
                    <div className="mt-5 max-w-2xl border-l-4 border-[#df0867] bg-[#0d124f]/50 px-4 py-3 backdrop-blur-sm">
                        <p className="text-base leading-7 text-blue-100">
                            Submit your research for oral or poster presentation. Review the core areas, author guidelines, and best scientific practices before preparing your abstract.
                        </p>
                    </div>

                </div>
            </section>

            {/* Sticky section nav */}
            <div className="sticky top-14 sm:top-16 z-20 border-b border-white/10 bg-[#080c38] shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="flex overflow-x-auto" aria-label="Page sections" style={{ scrollbarWidth: 'none' }}>
                        {[
                            { label: 'Core Areas',              href: '#core-areas' },
                            { label: 'Guidelines',              href: '#guidelines' },
                            { label: 'Submit Abstract',         href: '#submit' },
                            { label: 'Presentation Guidelines', href: '#presentation-guidelines' },
                            { label: 'Selected Abstracts',      href: '#results' },
                            { label: 'Abstract Book',           href: '#abstract-book' },
                        ].map(({ label, href }, i, arr) => (
                            <a
                                key={href}
                                href={href}
                                className={`shrink-0 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white/65 transition hover:bg-white/5 hover:text-white${i < arr.length - 1 ? ' border-r border-white/10' : ''}`}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Core Areas */}
            <section id="core-areas" className="py-14 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#df0867]">Scope of Submissions</p>
                        <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">Core Areas</h2>
                        <p className="mt-3 text-sm leading-6 text-zinc-500">Papers are invited across the following pharmaceutical and health science disciplines.</p>
                    </div>

                    <div className="mt-8 grid grid-rows-[auto] gap-3 sm:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: '1fr' }}>
                        {coreAreas.map((area, i) => (
                            <div key={area} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0d124f] text-xs font-bold text-white">
                                    {i + 1}
                                </span>
                                <span className="text-sm font-medium leading-5 text-zinc-800">{area}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guidelines / Rejection criteria */}
            <section id="guidelines" className="bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-2">
                        {/* Rejection note */}
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">!</span>
                                <h3 className="text-base font-bold text-red-800 sm:text-lg">Categories That Will Be Rejected</h3>
                            </div>
                            <p className="mt-3 text-sm text-red-700">The following categories of papers will be rejected by the scientific committee:</p>
                            <ul className="mt-4 space-y-2">
                                {rejectionCriteria.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Acceptance communication */}
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-700">✉</span>
                                <h3 className="text-base font-bold text-emerald-900 sm:text-lg">Acceptance Communication</h3>
                            </div>
                            <div className="mt-4 space-y-4 text-sm leading-6 text-emerald-800">
                                <p>
                                    <strong>Poster acceptance letters</strong> will be sent by mail to the corresponding author after review.
                                </p>
                                <p>
                                    <strong>Selected Oral acceptance list</strong> will be displayed on the IPC and SSC website. Notification will also be sent by mail as per the published schedule.
                                </p>
                                <p className="rounded-lg border border-emerald-200 bg-white/60 px-4 py-3 font-medium text-emerald-900">
                                    Keep a watch on this portal and your registered email for updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Abstract & Video Link Submission */}
            <section id="submit" className="bg-white py-10 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 border-b border-zinc-200 pb-5">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#df0867] text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                        </span>
                        <h2 className="text-xl font-bold text-zinc-900">Submit Abstract / Poster Video Link</h2>
                    </div>

                    <div className="mt-6 max-w-xl space-y-5">
                        {/* Registration number input */}
                        <div>
                            <label className="block text-sm font-semibold text-zinc-800">Enter your Registration Number</label>
                            <p className="mt-1 text-xs text-zinc-500">Your registration number was issued after completing event registration (e.g. NSC26-000001).</p>
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    value={absRegNum}
                                    onChange={(e) => { setAbsRegNum(e.target.value.toUpperCase()); setAbsRegInfo(null); setAbsFile(null); setAbsFileErr(''); setVidLink(''); setVidLinkErr(''); }}
                                    placeholder="NSC26-000001"
                                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono uppercase placeholder-zinc-400 focus:border-[#df0867] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={checkAbstractReg}
                                    disabled={absChecking || !absRegNum.trim()}
                                    className="rounded-lg bg-[#0d124f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a2070] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {absChecking ? 'Checking…' : 'Check →'}
                                </button>
                            </div>
                        </div>

                        {/* Not found */}
                        {absRegInfo && absRegInfo.checkError && (
                            <p className="text-sm font-medium text-red-600">{absRegInfo.checkError}</p>
                        )}
                        {absRegInfo && !absRegInfo.checkError && !absRegInfo.valid && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm font-semibold text-red-700">Registration number not found.</p>
                                <p className="mt-1 text-xs text-red-600">Only registered participants can submit an abstract.</p>
                            </div>
                        )}

                        {absRegInfo && absRegInfo.valid && !absRegInfo.canSubmitAbstract && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                                <p className="text-sm font-semibold text-amber-900">{absRegInfo.participantName}</p>
                                <p className="mt-1 text-xs text-amber-800">{absRegInfo.eligibilityReason || 'Your registration is not yet eligible for abstract submission.'}</p>
                                <p className="mt-2 text-xs text-amber-700">
                                    Payment: <span className="font-bold capitalize">{(absRegInfo.paymentStatus || '-').replaceAll('_', ' ')}</span>
                                    <span className="mx-2">•</span>
                                    Approval: <span className="font-bold capitalize">{(absRegInfo.approvalStatus || '-').replaceAll('_', ' ')}</span>
                                </p>
                            </div>
                        )}

                        {/* Valid + no abstract yet → upload form */}
                        {absRegInfo && absRegInfo.valid && absRegInfo.canSubmitAbstract && !absRegInfo.alreadySubmitted && (
                            <>
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                                    <p className="text-sm font-semibold text-emerald-800">{absRegInfo.participantName}</p>
                                    <p className="text-xs text-emerald-700">{absRegInfo.institutionName}</p>
                                    <p className="mt-1 text-xs text-emerald-600">Registration verified. Upload your abstract below.</p>
                                </div>

                                <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 size-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                    <p className="text-xs leading-5 text-amber-800"><strong>Important:</strong> Only one abstract per registration number. Once submitted, it <strong>cannot be replaced or merged</strong>. Ensure your file is final before uploading.</p>
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-500">Accepted formats: text-only PDF or DOCX · Max 1 MB. Do not include images, scanned pages, logos, charts, or embedded media.</p>
                                    <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center transition hover:border-[#df0867] hover:bg-red-50/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-9 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        <span className="text-sm font-medium text-zinc-600">{absFile ? absFile.name : 'Click to choose file or drag and drop'}</span>
                                        <span className="text-xs text-zinc-400">Text-only PDF / DOCX · Max 1 MB</span>
                                        <input
                                            type="file"
                                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const f = e.target.files[0];
                                                if (!f) return;
                                                const extension = f.name.split('.').pop()?.toLowerCase();
                                                if (!['pdf', 'docx'].includes(extension)) { setAbsFileErr('Upload a text-only PDF or DOCX file. Legacy DOC files are not accepted.'); setAbsFile(null); e.target.value = ''; return; }
                                                if (f.size > 1 * 1024 * 1024) { setAbsFileErr('File exceeds 1 MB. Please choose a smaller text-only file.'); setAbsFile(null); e.target.value = ''; return; }
                                                setAbsFileErr('');
                                                setAbsFile(f);
                                            }}
                                        />
                                    </label>
                                    {absFileErr && <p className="mt-2 text-xs font-medium text-red-600">{absFileErr}</p>}
                                    {absFile && (
                                        <div className="mt-2 flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
                                            <span className="truncate text-xs font-medium text-zinc-700">{absFile.name}</span>
                                            <span className="ml-3 shrink-0 text-xs text-zinc-400">{(absFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    )}
                                </div>

                                {absSubmitError && <p className="text-sm font-medium text-red-600">{absSubmitError}</p>}
                                <button
                                    type="button"
                                    onClick={submitAbstract}
                                    disabled={!absFile || absSubmitting}
                                    className="rounded-lg bg-[#df0867] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd0758] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {absSubmitting ? 'Submitting…' : 'Submit Abstract'}
                                </button>
                            </>
                        )}

                        {/* Abstract already submitted */}
                        {absRegInfo && absRegInfo.valid && absRegInfo.alreadySubmitted && (
                            <div className="space-y-4">
                                {/* Participant + status banner */}
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800">{absRegInfo.participantName}</p>
                                            <p className="text-xs text-zinc-500">{absRegInfo.institutionName}</p>
                                            <p className="mt-1 text-xs text-zinc-500">Abstract: <span className="font-medium text-zinc-700">{absRegInfo.fileName}</span></p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${absRegInfo.abstractStatus === 'accepted' ? 'bg-emerald-100 text-emerald-700' : absRegInfo.abstractStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {absRegInfo.abstractStatus === 'accepted' ? 'Accepted' : absRegInfo.abstractStatus === 'rejected' ? 'Rejected' : 'Pending Review'}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 size-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                        </svg>
                                        <p className="text-xs text-amber-800">No replacement or merging of abstracts is permitted. You will be notified of the review outcome by mail.</p>
                                    </div>
                                </div>

                                {/* Accepted + video link already submitted */}
                                {absRegInfo.abstractStatus === 'accepted' && absRegInfo.posterVideoLink && (
                                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                                        <p className="text-xs font-semibold text-emerald-700">Poster Presentation Video Link — Submitted</p>
                                        <a href={absRegInfo.posterVideoLink} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs font-medium text-[#0d124f] underline">{absRegInfo.posterVideoLink}</a>
                                    </div>
                                )}

                                {/* Accepted + no video link yet → show link input */}
                                {absRegInfo.abstractStatus === 'accepted' && !absRegInfo.posterVideoLink && (
                                    <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50/40 px-4 py-4">
                                        <div>
                                            <p className="text-sm font-semibold text-emerald-800">Submit Poster Presentation Video Link</p>
                                            <p className="mt-1 text-xs text-emerald-700">Your abstract has been accepted. Paste the link to your poster presentation video (Google Drive, YouTube, etc.).</p>
                                        </div>
                                        <div>
                                            <input
                                                type="url"
                                                value={vidLink}
                                                onChange={(e) => { setVidLink(e.target.value); setVidLinkErr(''); }}
                                                placeholder="https://drive.google.com/..."
                                                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder-zinc-400 focus:border-[#df0867] focus:outline-none"
                                            />
                                            {vidLinkErr && <p className="mt-1 text-xs font-medium text-red-600">{vidLinkErr}</p>}
                                        </div>
                                        {vidSubmitError && <p className="text-sm font-medium text-red-600">{vidSubmitError}</p>}
                                        <button
                                            type="button"
                                            onClick={submitVideoLink}
                                            disabled={!vidLink.trim() || vidSubmitting}
                                            className="rounded-lg bg-[#df0867] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd0758] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {vidSubmitting ? 'Submitting…' : 'Submit Video Link'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Presentation Guidelines */}
            <section id="presentation-guidelines" className="py-14 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#df0867]">Author Instructions</p>
                        <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">Presentation Guidelines &amp; Best Scientific Practices</h2>
                        <p className="mt-3 text-sm leading-6 text-zinc-500">Follow these standards to ensure your work meets the congress requirements.</p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {presentationGuidelines.map((g) => (
                            <div key={g.title} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-bold text-[#0d124f]">{g.title}</p>
                                <p className="mt-2 text-sm leading-6 text-zinc-600">{g.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Abstract Results */}
            <section id="results" className="py-10 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#df0867]">Results</p>
                        <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">Selected Abstracts</h2>
                        <p className="mt-3 text-sm leading-6 text-zinc-500">Accepted abstracts for oral and poster presentations will be listed here after scientific committee review.</p>
                    </div>

                    <div className="mt-8 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
                        {/* Oral */}
                        <div>
                            <button
                                type="button"
                                onClick={() => togglePanel('oral')}
                                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-zinc-50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0d124f] text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 0 1-3-3V5a3 3 0 0 1 6 0v6a3 3 0 0 1-3 3Z" />
                                        </svg>
                                    </span>
                                    <span className="text-sm font-bold uppercase tracking-wide text-zinc-900">Abstracts Selected for Final Oral Presentation</span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`size-5 shrink-0 text-zinc-400 transition-transform duration-200 ${openPanel === 'oral' ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                                </svg>
                            </button>
                            {openPanel === 'oral' && (
                                <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-8 text-center">
                                    <p className="text-sm font-medium text-zinc-500">The list of abstracts selected for oral presentation will be published here after the review process is complete.</p>
                                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                        <span className="size-1.5 rounded-full bg-amber-400" />
                                        Coming Soon
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Poster results */}
                        <div>
                            <button
                                type="button"
                                onClick={() => togglePanel('poster')}
                                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-zinc-50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#00652f] text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                        </svg>
                                    </span>
                                    <span className="text-sm font-bold uppercase tracking-wide text-zinc-900">Abstracts Selected for Final Poster Presentation</span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`size-5 shrink-0 text-zinc-400 transition-transform duration-200 ${openPanel === 'poster' ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                                </svg>
                            </button>
                            {openPanel === 'poster' && (
                                <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-8 text-center">
                                    <p className="text-sm font-medium text-zinc-500">The list of abstracts selected for poster presentation will be published here after the review process is complete.</p>
                                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                        <span className="size-1.5 rounded-full bg-amber-400" />
                                        Coming Soon
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Abstract Book viewer */}
            <section id="abstract-book" className="py-10 sm:py-12">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-3 border-b border-zinc-200 pb-5">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00652f] text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                    </svg>
                                </span>
                                <h2 className="text-xl font-bold text-zinc-900">Abstract Book</h2>
                            </div>

                            {publicAbstractBook?.fileUrl ? (
                                <div className="mt-6">
                                    <div className="mb-3 flex items-center gap-2 text-sm text-zinc-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        <span className="font-medium text-zinc-700">{publicAbstractBook.fileName}</span>
                                    </div>
                                    <iframe
                                        src={publicAbstractBook.fileUrl}
                                        title="Abstract Book"
                                        className="h-[700px] w-full rounded-xl border border-zinc-200 shadow-sm"
                                    />
                                </div>
                            ) : (
                                <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                    </svg>
                                    <p className="text-sm font-medium text-zinc-400">Abstract book will be available here once published.</p>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                        <span className="size-1.5 rounded-full bg-amber-400" />
                                        Coming Soon
                                    </span>
                                </div>
                            )}
                        </div>
            </section>
            <Contact />
        </div>
    );
}

export default function App() {
    useRevealOnScroll();
    const isAdminLoginPage = window.location.pathname === '/admin/login';
    const isAdminPage = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
    const isRegistrationPage = window.location.pathname === '/registration';
    const isSponsorRegistrationPage = window.location.pathname === '/sponsor-registration';
    const isScientificServicePage = window.location.pathname === '/scientific-service';
    const isAccommodationTravelPage = window.location.pathname === '/accommodation-travel';

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

    if (isScientificServicePage) {
        return (
            <div className="bg-zinc-50 text-zinc-950 antialiased">
                <Header />
                <main>
                    <ScientificServicePage />
                </main>
            </div>
        );
    }

    if (isAccommodationTravelPage) {
        return (
            <div className="event-theme bg-zinc-50 text-zinc-950 antialiased">
                <Header />
                <main>
                    <AccommodationTravelPage />
                    <Contact />
                </main>
            </div>
        );
    }

    return (
        <div className="event-theme bg-zinc-50 text-zinc-950 antialiased">
            <Header />
            <main>
                <Hero />
                <section className="announcement-bar border-y border-[#075b35] text-white" aria-label="Important event announcement">
                    <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                        <div className="relative z-10 flex shrink-0 items-center gap-2 border-r border-white/20 bg-[#00572a] py-3 pr-4 sm:pr-6">
                            <span className="announcement-pulse size-2 rounded-full bg-[#ffd36a]" />
                            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#ffd36a]">Important</span>
                        </div>
                        <div className="announcement-window min-w-0 flex-1 overflow-hidden py-3">
                            <div className="announcement-track flex w-max items-center">
                                {[0, 1].map((copy) => (
                                    <div key={copy} className="flex shrink-0 items-center gap-5 px-6 text-sm font-medium text-white/95">
                                        <span>
                                            Event dates: <strong className="text-white">{eventDate}</strong>
                                        </span>
                                        <span className="size-1.5 rounded-full bg-[#df0867]" />
                                        <span>Registration deadlines, accepted paper lists, and poster codes will be displayed on this portal.</span>
                                        <span className="size-1.5 rounded-full bg-[#ffd36a]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <HomeWelcome />
                <QuickFacts />
                <SponsorShowcase />
                <Abstracts />
                <OrganizingTeam />
                <SponsorSection />
                <Contact />
            </main>
        </div>
    );
}
