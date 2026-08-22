export interface LeadershipMember {
  id: string
  name: string
  role: string
  category: 'executive' | 'scientific' | 'integrity' | 'regional'
  affiliation: string
  bio: string
  orcid?: string
  image: string
  location: string
  publicationsCount?: number
}

export interface GlobalOffice {
  city: string
  country: string
  role: string
  address: string
  email: string
  phone: string
  staffCount: number
  timezone: string
  coordinates: string
}

export interface MilestoneItem {
  year: string
  title: string
  description: string
  badge?: string
}

export interface AccreditationsItem {
  name: string
  shortName: string
  role: string
  description: string
  badgeColor: string
}

export interface AboutFaqItem {
  question: string
  answer: string
  category: 'open-access' | 'peer-review' | 'fees' | 'integrity'
}

export const ABOUT_STATS = [
  { value: '120+', label: 'Peer-Reviewed Journals', sub: 'Across 1,200+ scientific academic sub-disciplines' },
  { value: '140,000+', label: 'Open Access Articles', sub: 'Indexed in Web of Science, PubMed, Scopus & DOAJ' },
  { value: '3.9M', label: 'Researchers in Community', sub: 'Authors, reviewers & editorial board members worldwide' },
  { value: '16M+', label: 'Citations Received', sub: 'Ranked in the top 10% of globally cited publishers' },
  { value: '5.3B', label: 'Article Views & Downloads', sub: '100% free unrestricted global knowledge dissemination' },
  { value: '850+', label: 'Institutional Agreements', sub: 'Automated APC coverage with leading global universities' },
]

export const LEADERSHIP_MEMBERS: LeadershipMember[] = [
  {
    id: 'lead-1',
    name: 'Dr. Kamila Markram',
    role: 'Chief Executive Officer & Co-Founder',
    category: 'executive',
    affiliation: 'Emergent Science, Basel & Lausanne, Switzerland',
    bio: 'Neuroscientist and visionary open-science pioneer. Led the architectural development of the world’s first collaborative online peer review platform and artificial intelligence publishing integrity suites.',
    orcid: '0000-0001-7290-8811',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    location: 'Lausanne, Switzerland',
    publicationsCount: 42,
  },
  {
    id: 'lead-2',
    name: 'Prof. Dr. Henry Markram',
    role: 'Co-Founder & Senior Scientific Director',
    category: 'scientific',
    affiliation: 'Brain Mind Institute, EPFL, Switzerland',
    bio: 'Renowned neurobiologist and founder of the Blue Brain Project. Longtime advocate of open computational science, high-dimensional neural simulation, and democratized scientific access.',
    orcid: '0000-0001-6387-9324',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    location: 'Lausanne, Switzerland',
    publicationsCount: 180,
  },
  {
    id: 'lead-3',
    name: 'Prof. Sir Colin Blakemore',
    role: 'Scientific Advisory Board Chair',
    category: 'scientific',
    affiliation: 'University of Oxford & University of London, UK',
    bio: 'Former Chief Executive of the British Medical Research Council (MRC). Champion of public science communication, research reproducibility, and ethical biomedical publishing frameworks.',
    orcid: '0000-0002-3901-4412',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    location: 'London, UK',
    publicationsCount: 220,
  },
  {
    id: 'lead-4',
    name: 'Dr. Elena Rostova',
    role: 'Vice President, Global Publishing Operations',
    category: 'executive',
    affiliation: 'Emergent Science Editorial Center, Basel, Switzerland',
    bio: 'Expert in scholarly communication workflows, editorial board governance, and indexing compliance across Clarivate Web of Science, PubMed Central, and Scopus.',
    orcid: '0000-0003-8822-1940',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    location: 'Basel, Switzerland',
    publicationsCount: 28,
  },
  {
    id: 'lead-5',
    name: 'Prof. Jisheng Dang',
    role: 'Head of Research Integrity & AI Technologies',
    category: 'integrity',
    affiliation: 'Tsinghua University & Emergent Science Research Labs',
    bio: 'Specialist in automated citation-ring detection, deepfake and generative image forensics in scientific literature, and computer-assisted peer review audit protocols.',
    orcid: '0000-0002-1144-8833',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    location: 'Beijing, China',
    publicationsCount: 65,
  },
  {
    id: 'lead-6',
    name: 'Dr. Marcus Vance',
    role: 'Director of Institutional Partnerships & Open Access Policy',
    category: 'executive',
    affiliation: 'Emergent Science North America, Boston, USA',
    bio: 'Leads global transformative agreements with university consortia, national research libraries, and government research funding agencies to eliminate author-facing APC barriers.',
    orcid: '0000-0002-4521-9988',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    location: 'Boston, USA',
    publicationsCount: 19,
  },
  {
    id: 'lead-7',
    name: 'Prof. André Luiz Monezi',
    role: 'Regional Director – Latin America & Global South',
    category: 'regional',
    affiliation: 'Pontifical Catholic University, Campinas, Brazil',
    bio: 'Advocates for equitable open access, diamond publishing infrastructure, and APC waiver accessibility for scholars across Latin America and the Global South.',
    orcid: '0000-0003-1288-4491',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    location: 'São Paulo, Brazil',
    publicationsCount: 47,
  },
  {
    id: 'lead-8',
    name: 'Dr. Tami Yap',
    role: 'Editorial Integrity & Ethics Officer',
    category: 'integrity',
    affiliation: 'University of Melbourne, Australia',
    bio: 'Chair of the Emergent Science Committee on Publication Ethics compliance, guiding post-publication corrections, data audits, and whistleblower investigations.',
    orcid: '0000-0001-9944-2211',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    location: 'Melbourne, Australia',
    publicationsCount: 35,
  },
]

export const GLOBAL_OFFICES: GlobalOffice[] = [
  {
    city: 'Basel',
    country: 'Switzerland',
    role: 'Global Headquarters & Publishing Operations',
    address: 'St. Alban-Anlage 66, 4052 Basel, Switzerland',
    email: 'basel@emergentsci.org',
    phone: '+41 61 563 80 00',
    staffCount: 420,
    timezone: 'UTC+1 (CET)',
    coordinates: '47.5596° N, 7.5886° E',
  },
  {
    city: 'Lausanne',
    country: 'Switzerland',
    role: 'Technology & AI Innovation Campus',
    address: 'EPFL Innovation Park, Building I, 1015 Lausanne, Switzerland',
    email: 'lausanne@emergentsci.org',
    phone: '+41 21 510 17 00',
    staffCount: 280,
    timezone: 'UTC+1 (CET)',
    coordinates: '46.5197° N, 6.5657° E',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    role: 'UK & European Editorial Affairs',
    address: '20 Triton Street, Regent’s Place, London NW1 3BF, UK',
    email: 'london@emergentsci.org',
    phone: '+44 20 7946 0912',
    staffCount: 160,
    timezone: 'UTC+0 (GMT)',
    coordinates: '51.5246° N, 0.1419° W',
  },
  {
    city: 'Boston',
    country: 'United States',
    role: 'North American Operations & Institutional Relations',
    address: '100 Cambridge Street, 14th Floor, Boston, MA 02114, USA',
    email: 'boston@emergentsci.org',
    phone: '+1 617 555 0198',
    staffCount: 130,
    timezone: 'UTC-5 (EST)',
    coordinates: '42.3601° N, 71.0589° W',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    role: 'Asia-Pacific Publishing Hub',
    address: 'Roppongi Hills Mori Tower 32F, Minato-ku, Tokyo 106-6132, Japan',
    email: 'tokyo@emergentsci.org',
    phone: '+81 3 5555 8890',
    staffCount: 110,
    timezone: 'UTC+9 (JST)',
    coordinates: '35.6605° N, 139.7292° E',
  },
  {
    city: 'Beijing',
    country: 'China',
    role: 'East Asia Author Support & Editorial Office',
    address: 'Tower A, Raycom InfoTech Park, Haidian District, Beijing 100190, China',
    email: 'beijing@emergentsci.org',
    phone: '+86 10 8899 7700',
    staffCount: 95,
    timezone: 'UTC+8 (CST)',
    coordinates: '39.9869° N, 116.3268° E',
  },
]

export const MILESTONES: MilestoneItem[] = [
  {
    year: '2007',
    title: 'Founded at EPFL Innovation Park',
    description:
      'Created by active researchers in Lausanne, Switzerland with the bold premise that scientific publishing must be open, digital-first, and democratized.',
    badge: 'Inception',
  },
  {
    year: '2012',
    title: 'Pioneered Collaborative Peer Review',
    description:
      'Launched the world’s first real-time interactive peer-review forum where authors, reviewers, and editors dialogue directly to resolve scientific questions.',
    badge: 'Innovation',
  },
  {
    year: '2016',
    title: 'Launch of Research Topics & Collections',
    description:
      'Introduced cross-journal, multi-disciplinary research collections curated by specialized guest editors to address grand societal and planetary challenges.',
    badge: 'Ecosystem',
  },
  {
    year: '2020',
    title: 'Deployment of AI Research Integrity Assistant (AIRA)',
    description:
      'Integrated state-of-the-art AI forensics to screen for image duplication, text similarity, peer reviewer conflicts of interest, and data integrity in real time.',
    badge: 'Technology',
  },
  {
    year: '2024',
    title: 'Surpassed 800+ Institutional Consortium Agreements',
    description:
      'Reached major transformative agreements with university libraries worldwide, enabling zero-friction, fully covered open-access publishing for affiliated authors.',
    badge: 'Global Scale',
  },
  {
    year: '2026',
    title: '140,000+ Articles & Annual $10,000 Topics Award',
    description:
      'Celebrating over 5.3 billion views and citations across 120 journals while funding grassroots interdisciplinary research through the annual Topics Award.',
    badge: 'Milestone',
  },
]

export const ACCREDITATIONS: AccreditationsItem[] = [
  {
    name: 'Committee on Publication Ethics',
    shortName: 'COPE',
    role: 'Corporate Member & Ethical Standard Signatory',
    description: 'Adhering strictly to COPE Core Practices on publication ethics, handling corrections, retractions, and research misconduct allegations.',
    badgeColor: 'border-blue-300 bg-blue-50 text-blue-800',
  },
  {
    name: 'Directory of Open Access Journals',
    shortName: 'DOAJ',
    role: 'Fully Indexed & DOAJ Seal Quality Approved',
    description: 'Every Emergent Science journal meets rigorous open-access best practices, licensing standards (CC-BY 4.0), and transparent editorial criteria.',
    badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  },
  {
    name: 'Open Access Scholarly Publishing Association',
    shortName: 'OASPA',
    role: 'Founding Member & Governance Board',
    description: 'Promoting open scholarship, equitable business models, transparent metadata dissemination, and unrestricted knowledge exchange worldwide.',
    badgeColor: 'border-purple-300 bg-purple-50 text-purple-800',
  },
  {
    name: 'San Francisco Declaration on Research Assessment',
    shortName: 'DORA',
    role: 'Official Signatory & Implementation Partner',
    description: 'Committed to evaluating research on its intrinsic scientific merit rather than reliance on single journal-level impact factors.',
    badgeColor: 'border-amber-300 bg-amber-50 text-amber-800',
  },
  {
    name: 'Crossref & ORCID',
    shortName: 'Crossref / ORCID',
    role: 'Persistent Identifier Partner',
    description: 'Full automated DOI registration, Crossmark version tracking, reference linking, and seamless ORCID author profile attribution.',
    badgeColor: 'border-slate-300 bg-slate-100 text-slate-800',
  },
  {
    name: 'Clarivate Web of Science & PubMed',
    shortName: 'Web of Science / PMC',
    role: 'Complete Indexing & Archiving',
    description: 'Indexed in Science Citation Index Expanded (SCIE), Social Sciences Citation Index (SSCI), PubMed Central, Scopus, and Google Scholar.',
    badgeColor: 'border-red-300 bg-red-50 text-red-800',
  },
]

export const ABOUT_FAQS: AboutFaqItem[] = [
  {
    category: 'open-access',
    question: 'What open-access model does Emergent Science use?',
    answer:
      'All articles published in Emergent Science journals are 100% Gold Open Access, distributed under the Creative Commons Attribution License (CC-BY 4.0). Authors retain full copyright of their work, granting anyone worldwide the right to read, share, adapt, and build upon the findings with appropriate author attribution.',
  },
  {
    category: 'peer-review',
    question: 'How does the Collaborative Peer Review Forum work?',
    answer:
      'Unlike traditional black-box peer review, our process includes an interactive discussion forum where authors, reviewers, and editors can directly dialogue in real-time to clarify methodology, review raw data, and resolve critiques. Once a manuscript is accepted, the reviewers’ names and affiliations are published on the final article to recognize their rigorous contribution.',
  },
  {
    category: 'integrity',
    question: 'How does Emergent Science protect research integrity and prevent paper mills?',
    answer:
      'We combine our custom AI-powered AIRA integrity suite with extensive human editorial oversight. AIRA performs automated pre-flight forensics checks for text plagiarism, image manipulation/duplication, fake reviewer accounts, and citation cartels. Any flag is investigated by our specialized Research Integrity and Ethics Office before review proceeds.',
  },
  {
    category: 'fees',
    question: 'How are Article Processing Charges (APCs) managed and waived?',
    answer:
      'Article Processing Charges cover the costs of our digital infrastructure, interactive review forum, indexing, permanent archiving, and professional editorial support. We maintain over 850 institutional agreements covering APCs automatically for affiliated authors, and we provide generous, confidential fee waivers for researchers from low-income countries (Research4Life) or without institutional grant support.',
  },
  {
    category: 'open-access',
    question: 'How are permanent digital archives and preservation ensured?',
    answer:
      'All published articles and monographs are permanently deposited in CLOCKSS, Portico, PubMed Central (PMC), and the Swiss National Library digital archive, ensuring eternal, uninterrupted access even in extreme disaster recovery scenarios.',
  },
]
