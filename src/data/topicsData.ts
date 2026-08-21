export interface TopicEditor {
  name: string
  affiliation: string
  role?: 'Lead Guest Editor' | 'Guest Editor' | 'Topic Editor'
  orcid?: string
  avatarColor?: string
}

export interface TopicReprintBook {
  id: string
  title: string
  editors: string
  coverColor: string
  category: string
  pages: number
  isbn: string
  doi: string
  downloads: number
  abstract: string
}

export interface TopicArticleItem {
  id: number
  title: string
  authors: string
  journal: string
  published: string
  doi: string
  citations: number
  views: number
}

export interface ResearchTopic {
  id: string
  title: string
  slug: string
  discipline: string
  editors: TopicEditor[]
  submissionDeadline: string
  deadlineDate: string // YYYY-MM-DD for sorting
  isSubmissionOpen: boolean
  isAwardNominee?: boolean
  isFeatured?: boolean
  articlesCount: number
  viewsCount: number
  citationsCount: number
  participatingJournals: string[]
  abstract: string
  keywords: string[]
  bannerGradient: string
  targetArticles?: number
  sampleArticles?: TopicArticleItem[]
}

export const TOPIC_DISCIPLINES = [
  'All Disciplines',
  'Computer Science & Mathematics',
  'Medicine & Pharmacology',
  'Engineering',
  'Biology & Life Sciences',
  'Environmental & Earth Sciences',
  'Physical Sciences',
  'Public Health & Healthcare',
  'Social Sciences & Humanities',
  'Business & Economics',
] as const

export const TOPICS_DATA: ResearchTopic[] = [
  {
    id: 'topic-1',
    title: 'Applications of NLP, AI, and Machine Learning in Software Engineering',
    slug: 'nlp-ai-software-engineering',
    discipline: 'Computer Science & Mathematics',
    isSubmissionOpen: true,
    isAwardNominee: true,
    isFeatured: true,
    submissionDeadline: '30 Aug 2026',
    deadlineDate: '2026-08-30',
    articlesCount: 36,
    viewsCount: 103321,
    citationsCount: 2840,
    targetArticles: 45,
    bannerGradient: 'from-blue-600 to-indigo-800',
    participatingJournals: [
      'Frontiers in Artificial Intelligence',
      'Emergent Software Engineering',
      'Applied Sciences & Computing',
      'Machine Learning & Knowledge Extraction',
      'AI & Data Systems',
    ],
    keywords: ['LLMs for Code', 'Automated Program Repair', 'Code Summarization', 'Static Analysis', 'Neural Bug Detection'],
    editors: [
      {
        name: 'Dr. Affan Yasin',
        affiliation: 'Hosei University, Tokyo, Japan',
        role: 'Lead Guest Editor',
        orcid: '0000-0002-4512-8901',
        avatarColor: 'bg-primary text-white',
      },
      {
        name: 'Prof. Javed Ali Khan',
        affiliation: 'University of Hertfordshire, Hatfield, UK',
        role: 'Guest Editor',
        orcid: '0000-0001-9876-5432',
        avatarColor: 'bg-emerald-600 text-white',
      },
      {
        name: 'Prof. Lijie Wen',
        affiliation: 'Tsinghua University, Beijing, China',
        role: 'Guest Editor',
        orcid: '0000-0003-1122-3344',
        avatarColor: 'bg-amber-600 text-white',
      },
    ],
    abstract:
      'This Research Topic aims to foster interdisciplinary research between software engineering and modern AI/NLP methodologies. With the rapid evolution of large language models (LLMs) and code intelligence systems, software synthesis, verification, bug localization, and automated documentation have transformed dramatically. We invite original research addressing neural code generation, benchmark reliability, developer trust, and safety-critical verification.',
    sampleArticles: [
      {
        id: 101,
        title: 'Evaluating LLM Code Synthesis on Safety-Critical Embedded Rust Systems',
        authors: 'Yasin, A., Khan, J. A., Zhang, H.',
        journal: 'Frontiers in Artificial Intelligence',
        published: '12 Aug 2026',
        doi: '10.3389/fai.2026.104201',
        citations: 18,
        views: 4210,
      },
      {
        id: 102,
        title: 'Multi-Agent Collaborative Debugging: A Neuro-Symbolic Framework',
        authors: 'Wen, L., Chen, R., Thompson, G.',
        journal: 'Emergent Software Engineering',
        published: '28 Jul 2026',
        doi: '10.3389/ese.2026.98210',
        citations: 24,
        views: 6130,
      },
    ],
  },
  {
    id: 'topic-2',
    title: 'Innovations and Sustainable Approaches in Mining, Metallurgy, and Materials Engineering: Insights from IOC 2025',
    slug: 'innovations-sustainable-mining-metallurgy',
    discipline: 'Engineering',
    isSubmissionOpen: true,
    isAwardNominee: false,
    submissionDeadline: '30 Aug 2026',
    deadlineDate: '2026-08-30',
    articlesCount: 2,
    viewsCount: 4542,
    citationsCount: 112,
    targetArticles: 20,
    bannerGradient: 'from-amber-600 to-orange-800',
    participatingJournals: ['Metals & Materials', 'Minerals Engineering', 'Sustainable Mining', 'Applied Metallurgy'],
    keywords: ['Hydrometallurgy', 'Circular Economy', 'Slag Upcycling', 'Decarbonized Smelting', 'Green Beneficiation'],
    editors: [
      {
        name: 'Dr. Markus A. Reuter',
        affiliation: 'SMS group GmbH & TU Bergakademie Freiberg, Germany',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-orange-600 text-white',
      },
      {
        name: 'Prof. Peizhong Feng',
        affiliation: 'China University of Mining and Technology, Xuzhou, China',
        role: 'Guest Editor',
        avatarColor: 'bg-primary text-white',
      },
      {
        name: 'Dr. Ljubiša Balanović',
        affiliation: 'University of Belgrade, Technical Faculty in Bor, Serbia',
        role: 'Guest Editor',
        avatarColor: 'bg-slate-700 text-white',
      },
    ],
    abstract:
      'Transitioning to net-zero manufacturing requires radical innovations in circular metallurgy, hydrometallurgical recycling of critical raw materials, and low-carbon ore processing. This Topic brings together leading papers from the International Ore Conference (IOC) addressing zero-waste metallurgical plants and thermodynamic lifecycle models.',
  },
  {
    id: 'topic-3',
    title: 'Sustainable Point-of-Care Diagnostics for Early Oral Cancer Detection',
    slug: 'point-of-care-oral-cancer-detection',
    discipline: 'Medicine & Pharmacology',
    isSubmissionOpen: true,
    isAwardNominee: true,
    submissionDeadline: '30 Aug 2026',
    deadlineDate: '2026-08-30',
    articlesCount: 1,
    viewsCount: 3765,
    citationsCount: 89,
    targetArticles: 15,
    bannerGradient: 'from-rose-600 to-red-800',
    participatingJournals: ['Biomedicines', 'Cancers', 'Diagnostics', 'Journal of Clinical Medicine', 'Oral Oncology'],
    keywords: ['Salivary Biomarkers', 'Microfluidics', 'MicroRNA Signatures', 'Optical Coherence Tomography', 'Global Oncology'],
    editors: [
      {
        name: 'Dr. Muy-Teck Teh',
        affiliation: 'Queen Mary University of London, London, UK',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-rose-600 text-white',
      },
      {
        name: 'Prof. Dipak Sapkota',
        affiliation: 'University of Oslo, Oslo, Norway',
        role: 'Guest Editor',
        avatarColor: 'bg-sky text-white',
      },
      {
        name: 'Dr. Tami Yap',
        affiliation: 'University of Melbourne, Melbourne, Australia',
        role: 'Guest Editor',
        avatarColor: 'bg-emerald-600 text-white',
      },
    ],
    abstract:
      'Oral squamous cell carcinoma remains burdened by late-stage diagnosis in low-resource settings. This collection covers paper-based microfluidic assays, portable fluorescent spectroscopy, and salivary exosome analysis engineered for low-cost community screening.',
  },
  {
    id: 'topic-4',
    title: '3D Documentation of Natural and Cultural Heritage: Sensor Fusion and AI Reconstruction',
    slug: '3d-documentation-cultural-heritage',
    discipline: 'Environmental & Earth Sciences',
    isSubmissionOpen: true,
    isAwardNominee: false,
    isFeatured: true,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 27,
    viewsCount: 65854,
    citationsCount: 1420,
    targetArticles: 30,
    bannerGradient: 'from-emerald-600 to-teal-800',
    participatingJournals: ['Applied Sciences', 'Drones', 'Geomatics', 'Heritage', 'Remote Sensing', 'Sensors'],
    keywords: ['Photogrammetry', 'LiDAR SLAM', 'Neural Radiance Fields', 'Digital Twins', 'Archaeological Preservation'],
    editors: [
      {
        name: 'Prof. Lorenzo Teppati Losè',
        affiliation: 'Politecnico di Torino, Turin, Italy',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-teal-600 text-white',
      },
      {
        name: 'Dr. Elisabetta Colucci',
        affiliation: 'University of Florence, Florence, Italy',
        role: 'Guest Editor',
        avatarColor: 'bg-primary text-white',
      },
      {
        name: 'Dr. Arnadi Murtiyoso',
        affiliation: 'ETH Zürich, Zürich, Switzerland',
        role: 'Guest Editor',
        avatarColor: 'bg-purple-600 text-white',
      },
    ],
    abstract:
      'Preserving vulnerable monuments and geomorphological sites requires high-accuracy volumetric documentation. This topic spotlights airborne and handheld LiDAR, UAV multi-spectral photogrammetry, NeRF representations, and semantic 3D segmentation for cultural heritage curation.',
  },
  {
    id: 'topic-5',
    title: 'The Effect of Physical Activity on the Population’s Health: Multi-Cohort Longitudinal Insights',
    slug: 'physical-activity-population-health',
    discipline: 'Public Health & Healthcare',
    isSubmissionOpen: true,
    isAwardNominee: false,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 17,
    viewsCount: 49698,
    citationsCount: 1190,
    targetArticles: 25,
    bannerGradient: 'from-violet-600 to-purple-800',
    participatingJournals: [
      'Behavioral Sciences',
      'Children',
      'Healthcare',
      'International Journal of Environmental Research and Public Health',
      'Obesities',
    ],
    keywords: ['Sedentary Behavior', 'Cardiometabolic Health', 'Active Transport', 'Wearable Telemetry', 'Healthspan'],
    editors: [
      {
        name: 'Dr. Stefania Paduano',
        affiliation: 'University of Modena and Reggio Emilia, Modena, Italy',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-violet-600 text-white',
      },
      {
        name: 'Prof. Federica Valeriani',
        affiliation: 'University of Rome "Foro Italico", Rome, Italy',
        role: 'Guest Editor',
        avatarColor: 'bg-pink-600 text-white',
      },
    ],
    abstract:
      'Investigating dose-response curves of high-intensity vs. low-intensity activity on cardiovascular resilience, pediatric cognitive development, and all-cause mortality across diverse socioeconomic strata.',
  },
  {
    id: 'topic-6',
    title: 'Kinases in Cancer and Other Diseases: Mechanism, Biomarkers, and Targeted Therapies (2nd Edition)',
    slug: 'kinases-in-cancer-2nd-edition',
    discipline: 'Biology & Life Sciences',
    isSubmissionOpen: true,
    isAwardNominee: true,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 13,
    viewsCount: 48119,
    citationsCount: 1680,
    targetArticles: 20,
    bannerGradient: 'from-indigo-600 to-blue-900',
    participatingJournals: ['Biology', 'Biomolecules', 'Cancers', 'Cells', 'Kinases and Phosphatases', 'Pharmaceuticals'],
    keywords: ['Tyrosine Kinase Inhibitors', 'Allosteric Modulation', 'Drug Resistance', 'KRAS Mutations', 'Phosphoproteomics'],
    editors: [
      {
        name: 'Dr. Jonas Cicenas',
        affiliation: 'Proteomics Center, Vilnius, Lithuania & Swiss Institute of Bioinformatics, Geneva, Switzerland',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-indigo-600 text-white',
      },
      {
        name: 'Prof. Anna M. Czarnecka',
        affiliation: 'Maria Sklodowska-Curie National Research Institute of Oncology, Warsaw, Poland',
        role: 'Guest Editor',
        avatarColor: 'bg-emerald-700 text-white',
      },
    ],
    abstract:
      'Following the tremendous success of Volume 1, this 2nd Edition explores next-generation covalent kinase inhibitors, PROTAC-mediated kinase degradation, and phosphorylation signatures in metastatic disease.',
  },
  {
    id: 'topic-7',
    title: 'Advances in Earth Observation Technologies to Support Water-Related Sustainable Development Goals (SDGs)',
    slug: 'earth-observation-water-sdgs',
    discipline: 'Environmental & Earth Sciences',
    isSubmissionOpen: true,
    isAwardNominee: false,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 20,
    viewsCount: 33403,
    citationsCount: 940,
    targetArticles: 25,
    bannerGradient: 'from-cyan-600 to-blue-800',
    participatingJournals: ['Drones', 'Forests', 'Geomatics', 'Hydrology', 'Land', 'Remote Sensing', 'Sensors', 'Water'],
    keywords: ['Synthetic Aperture Radar', 'Evapotranspiration Mapping', 'Groundwater Depletion', 'Flood Forecasting', 'SDG 6'],
    editors: [
      {
        name: 'Prof. Wei Jiang',
        affiliation: 'Nanjing Normal University, Nanjing, China',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-cyan-700 text-white',
      },
      {
        name: 'Dr. Elhadi Adam',
        affiliation: 'University of the Witwatersrand, Johannesburg, South Africa',
        role: 'Guest Editor',
        avatarColor: 'bg-primary text-white',
      },
      {
        name: 'Dr. Qingke Wen',
        affiliation: 'Chinese Academy of Sciences, Beijing, China',
        role: 'Guest Editor',
        avatarColor: 'bg-emerald-600 text-white',
      },
      {
        name: 'Prof. Teodosio Lacava',
        affiliation: 'Institute of Methodologies for Environmental Analysis, Potenza, Italy',
        role: 'Guest Editor',
        avatarColor: 'bg-amber-600 text-white',
      },
      {
        name: 'Dr. Yizhu Lu',
        affiliation: 'National University of Singapore, Singapore',
        role: 'Guest Editor',
        avatarColor: 'bg-purple-600 text-white',
      },
    ],
    abstract:
      'Tracking progress toward UN SDG 6 (Clean Water and Sanitation) demands satellite-based hydrological modeling, radar altimetry of reservoir levels, and machine learning inversion for soil moisture dynamics.',
  },
  {
    id: 'topic-8',
    title: 'Sustainable Materials and Resilient Structures: Interdisciplinary Approaches',
    slug: 'sustainable-materials-resilient-structures',
    discipline: 'Engineering',
    isSubmissionOpen: true,
    isAwardNominee: false,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 11,
    viewsCount: 29337,
    citationsCount: 780,
    targetArticles: 18,
    bannerGradient: 'from-slate-700 to-zinc-900',
    participatingJournals: ['Buildings', 'CivilEng', 'Construction Materials', 'Infrastructures', 'Materials', 'Sustainability'],
    keywords: ['Geopolymer Concrete', 'Seismic Metamaterials', 'Self-Healing Asphalt', 'Structural Health Monitoring', 'Embodied Carbon'],
    editors: [
      {
        name: 'Prof. Anderson Chu',
        affiliation: 'The University of Queensland, Brisbane, Australia',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-slate-800 text-white',
      },
      {
        name: 'Dr. Adil Tamimi',
        affiliation: 'American University of Sharjah, Sharjah, UAE',
        role: 'Guest Editor',
        avatarColor: 'bg-amber-700 text-white',
      },
      {
        name: 'Prof. Haodao Li',
        affiliation: 'Tongji University, Shanghai, China',
        role: 'Guest Editor',
        avatarColor: 'bg-primary text-white',
      },
      {
        name: 'Prof. Yu-Cun Gu',
        affiliation: 'National Taiwan University, Taipei, Taiwan',
        role: 'Guest Editor',
        avatarColor: 'bg-emerald-600 text-white',
      },
      {
        name: 'Dr. Baoquan Cheng',
        affiliation: 'Harbin Institute of Technology, Harbin, China',
        role: 'Guest Editor',
        avatarColor: 'bg-red-700 text-white',
      },
    ],
    abstract:
      'Addressing escalating climate extremes and infrastructure aging through low-carbon cement replacements, bio-based composite panels, dynamic damping metamaterials, and acoustic emission sensor arrays.',
  },
  {
    id: 'topic-9',
    title: 'Intelligent Optimization, Decision-Making and Privacy Preservation in Cyber–Physical Systems',
    slug: 'intelligent-optimization-cps-privacy',
    discipline: 'Computer Science & Mathematics',
    isSubmissionOpen: true,
    isAwardNominee: false,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 10,
    viewsCount: 27647,
    citationsCount: 650,
    targetArticles: 20,
    bannerGradient: 'from-blue-700 to-cyan-900',
    participatingJournals: [
      'Applied Sciences',
      'Automation',
      'Computers',
      'Electronics',
      'Sensors',
      'Journal of Cybersecurity and Privacy',
      'Mathematics',
    ],
    keywords: ['Federated Learning', 'Differential Privacy', 'Industrial IoT', 'Zero-Knowledge Proofs', 'Reinforcement Learning'],
    editors: [
      {
        name: 'Prof. Lijuan Zha',
        affiliation: 'Zhejiang University of Technology, Hangzhou, China',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-primary text-white',
      },
      {
        name: 'Dr. Jinliang Liu',
        affiliation: 'Nanjing University of Science and Technology, Nanjing, China',
        role: 'Guest Editor',
        avatarColor: 'bg-emerald-600 text-white',
      },
      {
        name: 'Prof. Jian Liu',
        affiliation: 'University of Tennessee, Knoxville, USA',
        role: 'Guest Editor',
        avatarColor: 'bg-violet-700 text-white',
      },
    ],
    abstract:
      'Balancing high-throughput distributed control in smart grids and robotic swarms with rigorous differential privacy, homomorphic encryption, and resilient edge consensus algorithms.',
  },
  {
    id: 'topic-10',
    title: 'Skin Barrier Function and Immune Mediators as Key Therapeutic Targets of Main Inflammatory Diseases',
    slug: 'skin-barrier-immune-mediators',
    discipline: 'Medicine & Pharmacology',
    isSubmissionOpen: true,
    isAwardNominee: false,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 5,
    viewsCount: 25583,
    citationsCount: 420,
    targetArticles: 15,
    bannerGradient: 'from-rose-500 to-purple-800',
    participatingJournals: ['Cells', 'Immuno', 'International Journal of Molecular Sciences', 'Journal of Clinical Medicine', 'Allergies', 'Dermato'],
    keywords: ['Atopic Dermatitis', 'Filaggrin', 'IL-13 / IL-4 Axis', 'JAK Inhibitors', 'Skin Microbiome Dysbiosis'],
    editors: [
      {
        name: 'Dr. Marco Manfredini',
        affiliation: 'University of Modena and Reggio Emilia, Modena, Italy',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-rose-600 text-white',
      },
      {
        name: 'Prof. Carlo Pincelli',
        affiliation: 'University of Modena and Reggio Emilia, Modena, Italy',
        role: 'Guest Editor',
        avatarColor: 'bg-indigo-600 text-white',
      },
    ],
    abstract:
      'Investigating epidermal tight junction proteins, lipid matrix alterations, and targeted biologic therapies for chronic inflammatory skin conditions like psoriasis and atopic dermatitis.',
  },
  {
    id: 'topic-11',
    title: 'Behavioral Addictions and Risk-Taking in the Digital Age: Gambling, Sports Betting, and Emerging Challenges',
    slug: 'behavioral-addictions-digital-age',
    discipline: 'Social Sciences & Humanities',
    isSubmissionOpen: true,
    isAwardNominee: false,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 11,
    viewsCount: 24832,
    citationsCount: 560,
    targetArticles: 16,
    bannerGradient: 'from-purple-600 to-slate-900',
    participatingJournals: ['Behavioral Sciences', 'Healthcare', 'Psychiatry International', 'Adolescents', 'Social Sciences', 'Children'],
    keywords: ['Loot Boxes', 'Micro-Transactions', 'Online Sports Betting', 'Impulsivity', 'Neurocognitive Biomarkers'],
    editors: [
      {
        name: 'Prof. André Luiz Monezi Andrade',
        affiliation: 'Pontifical Catholic University of Campinas, Campinas, Brazil',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-purple-600 text-white',
      },
      {
        name: 'Dr. Denise De Micheli',
        affiliation: 'Federal University of São Paulo, São Paulo, Brazil',
        role: 'Guest Editor',
        avatarColor: 'bg-sky text-white',
      },
    ],
    abstract:
      'Examining how gamified gambling interfaces, algorithmically personalized betting odds, and social media behavioral nudges fuel addiction pathways in young populations.',
  },
  {
    id: 'topic-12',
    title: 'Generative AI and Interdisciplinary Applications: From Biomedicine to Autonomous Systems',
    slug: 'generative-ai-interdisciplinary-applications',
    discipline: 'Computer Science & Mathematics',
    isSubmissionOpen: true,
    isAwardNominee: true,
    isFeatured: true,
    submissionDeadline: '31 Aug 2026',
    deadlineDate: '2026-08-31',
    articlesCount: 14,
    viewsCount: 22368,
    citationsCount: 890,
    targetArticles: 25,
    bannerGradient: 'from-blue-600 to-indigo-950',
    participatingJournals: ['Electronics', 'AgriEngineering', 'AI Sensors', 'Healthcare', 'BioMedInformatics', 'Big Data and Cognitive Computing'],
    keywords: ['Diffusion Models', 'Protein Folding', 'Multimodal Foundation Models', 'Synthetic Data Generation', 'Robotic Co-Design'],
    editors: [
      {
        name: 'Prof. Jisheng Dang',
        affiliation: 'Xi’an Jiaotong University, Xi’an, China',
        role: 'Lead Guest Editor',
        avatarColor: 'bg-primary text-white',
      },
      {
        name: 'Dr. Wenjie Wang',
        affiliation: 'National University of Singapore, Singapore',
        role: 'Guest Editor',
        avatarColor: 'bg-emerald-600 text-white',
      },
      {
        name: 'Dr. Yongqi Li',
        affiliation: 'The Hong Kong Polytechnic University, Hong Kong',
        role: 'Guest Editor',
        avatarColor: 'bg-amber-600 text-white',
      },
      {
        name: 'Prof. Juncheng Li',
        affiliation: 'Zhejiang University, Hangzhou, China',
        role: 'Guest Editor',
        avatarColor: 'bg-teal-600 text-white',
      },
    ],
    abstract:
      'Exploring generative diffusion architectures, flow matching, and chain-of-thought grounding across de novo drug design, agricultural yield synthesis, and embodied autonomous agents.',
  },
]

export const TOPIC_REPRINTS: TopicReprintBook[] = [
  {
    id: 'book-1',
    title: 'Chromatography–Mass Spectrometry Analysis in Biomedical Research and Clinical Laboratory',
    editors: 'Constantinos K. Zacharis, Andreas Tsakalof',
    coverColor: 'bg-slate-900 text-slate-100 border-slate-700',
    category: 'Chemistry & Pharmacology',
    pages: 342,
    isbn: '978-3-0365-9842-1',
    doi: '10.3390/books978-3-0365-9842-1',
    downloads: 12480,
    abstract:
      'A comprehensive collection of 18 peer-reviewed articles detailing advanced LC-MS/MS and GC-MS protocols for clinical diagnostics, biomarker quantification, and metabolic phenotyping.',
  },
  {
    id: 'book-2',
    title: 'Sustainable Water Purification Technologies for Multiple Applications',
    editors: 'Marco Pellegrini, Cesare Saccani, Alessandro Guzzini',
    coverColor: 'bg-cyan-950 text-cyan-50 border-cyan-800',
    category: 'Environmental Engineering',
    pages: 288,
    isbn: '978-3-0365-9120-0',
    doi: '10.3390/books978-3-0365-9120-0',
    downloads: 9810,
    abstract:
      'Interdisciplinary research on membrane bioreactors, solar-powered distillation units, forward osmosis, and biochar adsorption systems for decentralized water treatment.',
  },
  {
    id: 'book-3',
    title: 'Medical Foundation Models and Clinical Decision Support',
    editors: 'Thomas Hartung, Elena Rostova, Marcus Vance',
    coverColor: 'bg-blue-950 text-blue-50 border-blue-800',
    category: 'Digital Medicine & AI',
    pages: 410,
    isbn: '978-3-0365-8844-3',
    doi: '10.3390/books978-3-0365-8844-3',
    downloads: 15320,
    abstract:
      'Curated monographs assessing multimodal vision-language models, electronic health record transformer architectures, and safety alignment in robotic surgery assistance.',
  },
]
