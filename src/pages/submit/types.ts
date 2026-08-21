export type StepKey = 'details' | 'summary' | 'authors' | 'statements'

export type NameTitle = 'Mr' | 'Ms' | 'Mrs' | 'Dr' | 'Prof.'

export interface Author {
  id: number
  email: string
  title: NameTitle
  firstName: string
  middleName: string
  lastName: string
  isCorresponding: boolean
  institutionalEmail: string
  affiliations: string[]
}

export interface Uploads {
  manuscript: string[]
  figures: string[]
  supplementary: string[]
  reviewOnly: string[]
}

export interface SubmissionDraft {
  journal: string
  journalSection?: string
  articleType: string
  scopeStatement: string
  title: string
  summary: string
  keywords: string[]
  uploads: Uploads
  authors: Author[]
  statements: {
    notUnderConsideration: boolean
    adheresPolicies: boolean
    consents: boolean
    acceptsTerms: boolean
  }
}

export interface JournalOption {
  name: string
  abbr: string
  section: string
  category: string
  description: string
  color: string
  impactFactor?: string
}

export interface ArticleTypeOption {
  name: string
  description: string
  wordLimit: number
  figuresLimit: number
  peerReviewType?: string
}

export interface FileRequirementConfig {
  enabled: boolean
  maxSizeMb: number | null
  extensions: string[]
}

export interface FileTypeRequirements {
  manuscript?: FileRequirementConfig
  figures?: FileRequirementConfig
  supplementary?: FileRequirementConfig
  reviewerMaterials?: FileRequirementConfig
}

export interface ArticleTypeDetail {
  name: string
  description: string
  wordLimit: number | null | undefined
  summaryWords: number | null | undefined
  figuresLimit: number | null | undefined
  peerReviewType?: string
  fileRequirements?: FileTypeRequirements
}

export interface MissingItem {
  id: string
  stepKey: StepKey
  label: string
  isComplete: boolean
}

export const STEP_ORDER: StepKey[] = ['details', 'summary', 'authors', 'statements']

export const STEP_TITLES: Record<StepKey, string> = {
  details: 'Submission Details & Files',
  summary: 'Manuscript Title & Summary',
  authors: 'Authors & Affiliations',
  statements: 'Declarations & Statements',
}

export const STEP_DESCRIPTIONS: Record<StepKey, string> = {
  details: 'Select journal, article type, scope justification, and upload manuscript files',
  summary: 'Enter manuscript title, abstract summary, and research keywords',
  authors: 'List all contributing authors, corresponding author, and institutional affiliations',
  statements: 'Confirm originality, data policies, ethics consent, and publication terms',
}

export const JOURNAL_OPTIONS: JournalOption[] = [
  {
    name: 'Frontiers in Artificial Intelligence',
    abbr: 'AI',
    category: 'Computer Science & AI',
    section: 'Machine Learning and Artificial Intelligence',
    color: 'bg-primary-tint text-primary border-primary/20',
    impactFactor: '6.7',
    description:
      'Focuses on cutting-edge machine learning, large language models, computer vision, and trustworthy AI implementations across science, medicine, and engineering.',
  },
  {
    name: 'Frontiers in Acoustics',
    abbr: 'AC',
    category: 'Engineering',
    section: 'Acoustic Materials, Noise Control and Sound Perception',
    color: 'bg-sky/10 text-sky border-sky/20',
    impactFactor: '3.1',
    description:
      'Advances the understanding of materials, metamaterials, structures, and computational models that shape how sound is generated, propagated, and perceived.',
  },
  {
    name: 'Frontiers in Neuroscience',
    abbr: 'NS',
    category: 'Life Sciences & Health',
    section: 'Neural Technology and Brain-Computer Interfaces',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    impactFactor: '5.2',
    description:
      'Publishes breakthrough research in neurotechnological interfaces, neural prosthetics, neuromodulation, neuroimaging, and synaptic dynamics.',
  },
  {
    name: 'Frontiers in Photovoltaics',
    abbr: 'PV',
    category: 'Energy & Physics',
    section: 'Advanced Photovoltaic Devices & Materials',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    impactFactor: '4.8',
    description:
      'Features research on perovskite solar cells, tandem architectures, silicon photonics, sustainable manufacturing, and grid-scale solar harvesting.',
  },
  {
    name: 'Frontiers in Applied Mathematics and Statistics',
    abbr: 'AM',
    category: 'Mathematics & Data',
    section: 'Data Science & Mathematical Modeling',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    impactFactor: '3.6',
    description:
      'Highlights rigorous mathematical foundations, stochastic systems, optimization algorithms, dynamical modeling, and statistical inference.',
  },
  {
    name: 'Frontiers in Climate & Sustainability',
    abbr: 'CS',
    category: 'Environmental Sciences',
    section: 'Climate Adaptation & Ecological Systems',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    impactFactor: '4.5',
    description:
      'Investigates climate feedback mechanisms, resilient ecosystems, decarbonization strategies, and environmental sustainability science.',
  },
]

export const ARTICLE_TYPE_OPTIONS: ArticleTypeOption[] = [
  {
    name: 'Original Research',
    description:
      'Original Research articles report on new, peer-reviewed data and findings, including experimental, observational or computational studies.',
    wordLimit: 12000,
    figuresLimit: 15,
    peerReviewType: 'Double-blind peer review',
  },
  {
    name: 'Hypothesis and Theory',
    description:
      'Hypothesis and Theory articles present a novel argument, interpretation or model intended to introduce a new hypothesis, challenge a dominant theory or shed new light on an existing one.',
    wordLimit: 8000,
    figuresLimit: 10,
    peerReviewType: 'Single-blind peer review',
  },
  {
    name: 'Review',
    description:
      'Review articles synthesize and critically evaluate the current state of a field, identifying open questions and future directions.',
    wordLimit: 12000,
    figuresLimit: 15,
    peerReviewType: 'Standard peer review',
  },
  {
    name: 'Brief Research Report',
    description:
      'Brief Research Reports are short articles presenting focused findings that merit publication without full-length treatment.',
    wordLimit: 4000,
    figuresLimit: 6,
    peerReviewType: 'Fast-track peer review',
  },
  {
    name: 'Systematic Review',
    description:
      'Systematic Reviews apply a rigorous, reproducible methodology to identify, appraise and synthesize all available evidence on a question.',
    wordLimit: 12000,
    figuresLimit: 15,
    peerReviewType: 'Standard peer review',
  },
  {
    name: 'Perspective',
    description:
      'Perspective articles offer a personal viewpoint, opinion or critical reflection on a topic within the scope of the journal.',
    wordLimit: 3000,
    figuresLimit: 5,
    peerReviewType: 'Single-blind peer review',
  },
]

export const ARTICLE_TYPES = ARTICLE_TYPE_OPTIONS.map((option) => option.name)

export const ARTICLE_TYPE_DETAILS: Record<string, ArticleTypeDetail> = ARTICLE_TYPE_OPTIONS.reduce(
  (acc, option) => {
    acc[option.name] = {
      name: option.name,
      description: option.description,
      wordLimit: option.wordLimit,
      summaryWords: option.wordLimit,
      figuresLimit: option.figuresLimit,
      peerReviewType: option.peerReviewType,
    }
    return acc
  },
  {} as Record<string, ArticleTypeDetail>,
)

export const AFFILIATIONS = [
  'University of Karachi, Karachi, Pakistan',
  'ETH Zürich, Zürich, Switzerland',
  'École Polytechnique Fédérale de Lausanne (EPFL), Switzerland',
  'University of Oxford, Oxford, United Kingdom',
  'Massachusetts Institute of Technology (MIT), Cambridge, United States',
  'Stanford University, Stanford, United States',
  'University of Cambridge, Cambridge, United Kingdom',
  'Tokyo Institute of Technology, Tokyo, Japan',
]

export const TITLE_OPTIONS: NameTitle[] = ['Dr', 'Prof.', 'Mr', 'Ms', 'Mrs']

export const SUMMARY_WORD_LIMIT = 2000
export const SCOPE_WORD_LIMIT = 250
export const TITLE_CHAR_LIMIT = 500

export const STORAGE_KEY = 'es_submission_draft'
