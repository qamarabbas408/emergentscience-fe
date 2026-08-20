import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { toast } from '../components/toast'
import { JournalPickerModal, type JournalOption } from '../components/JournalPickerModal'
import { initialsOf } from '../lib/initials'
import { articleTypesApi, type ArticleTypeResource } from '../api/articleTypes'

type StepKey = 'details' | 'summary' | 'authors' | 'statements'

type NameTitle = 'Mr' | 'Ms' | 'Mrs' | 'Dr' | 'Prof.'

interface Author {
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

interface Uploads {
  manuscript: string[]
  figures: string[]
  supplementary: string[]
  reviewOnly: string[]
}

interface SubmissionDraft {
  journal: string
  articleType: string
  scopeStatement: string
  title: string
  summary: string
  uploads: Uploads
  authors: Author[]
  statements: {
    notUnderConsideration: boolean
    adheresPolicies: boolean
    consents: boolean
    acceptsTerms: boolean
  }
}

interface ArticleTypeOption {
  name: string
  description: string
  wordLimit: number
  figuresLimit: number
}

interface ArticleTypeDetail {
  name: string
  description: string
  wordLimit: number | null | undefined
  summaryWords: number | null | undefined
  figuresLimit: number | null | undefined
}

const STEP_ORDER: StepKey[] = ['details', 'summary', 'authors', 'statements']

const STEP_TITLES: Record<StepKey, string> = {
  details: 'Submission details',
  summary: 'Manuscript summary information',
  authors: 'Authors and contributors',
  statements: 'Statements',
}

const JOURNAL_OPTIONS: JournalOption[] = [
  {
    name: 'Frontiers in Acoustics',
    abbr: 'AC',
    color: 'bg-sky/10 text-sky',
    domain: 'Engineering',
    description:
      'The goal of the Acoustics section of Frontiers in Acoustics is to promote the exchange of knowledge and to advance the understanding of materials, structures and devices that shape how sound is generated, transmitted and perceived.',
    about:
      'Frontiers in Acoustics is a multidisciplinary open-access journal devoted to the science of sound, from fundamental physics to applied acoustic engineering.',
    editorialBoard: ['Massimo Ruzzene', 'Francesco Asdrubali', 'Olivier Doutres'],
    specialties: [
      'Acoustic Materials, Noise Control and Sound Perception',
      'Acoustic Metamaterials',
      'Acoustofluidics',
      'Ultrasound Technologies',
    ],
  },
  {
    name: 'Frontiers in Adolescent Medicine',
    abbr: 'ADM',
    color: 'bg-violet-50 text-violet-600',
    domain: 'Health',
    description:
      'A forum for research on the physical, mental and social health of adolescents, supporting healthy transitions from childhood to adulthood.',
    about:
      'Frontiers in Adolescent Medicine publishes evidence on adolescent health promotion, disease prevention and care across primary, community and hospital settings.',
    editorialBoard: ['Susan M. Sawyer', 'George C. Patton', 'Diana M. L. Birch'],
    specialties: [
      'Adolescent Mental Health',
      'Adolescent Nutrition and Eating Behaviors',
      'Adolescent Sexual and Reproductive Health',
      'Adolescent Chronic Disease and Transition to Adult Care',
    ],
  },
  {
    name: 'Frontiers in Aerospace Engineering',
    abbr: 'AE',
    color: 'bg-primary-tint text-primary',
    domain: 'Engineering',
    description:
      'Advances the design, analysis and operation of aircraft and spacecraft, bridging aerodynamics, propulsion, structures and systems.',
    about:
      'Frontiers in Aerospace Engineering is a broad-scope journal covering the full lifecycle of aerospace systems, from conceptual design to flight testing and space operations.',
    editorialBoard: ['Nigel G. Wright', 'Andrés Marcos', 'Christophe Airiau'],
    specialties: [
      'Aeroacoustics and Aerospace Sound',
      'Aerodynamics and Vehicle Design',
      'Propulsion and Space Systems',
      'Aircraft Systems and Avionics',
      'Thermal and Structural Dynamics',
    ],
  },
  {
    name: 'Frontiers in Aging',
    abbr: 'AGI',
    color: 'bg-amber-50 text-amber-600',
    domain: 'Health',
    description:
      'Explores the biological, clinical and societal dimensions of aging, from molecular mechanisms to healthy longevity in populations.',
    about:
      'Frontiers in Aging provides a home for interdisciplinary aging research, linking basic geroscience with clinical geriatrics and social policy.',
    editorialBoard: ['Thomas Wisniewski', 'Luigi Ferrucci', 'Nir Barzilai'],
    specialties: [
      'Aging and Cancer',
      'Aging, Metabolism and Nutrition',
      'Cellular and Molecular Aging',
      'Clinical Trials in Aging',
      'Digital Health and Aging',
      'Geroscience',
      'Musculoskeletal Aging',
      'Social Gerontology and Policy',
      'Translational Aging Research',
    ],
  },
  {
    name: 'Frontiers in Aging Neuroscience',
    abbr: 'AN',
    color: 'bg-red-50 text-red-600',
    domain: 'Health',
    description:
      'Focuses on age-related changes in the nervous system, neurodegenerative diseases and strategies to preserve brain health across the lifespan.',
    about:
      'Frontiers in Aging Neuroscience publishes research on the mechanisms, biomarkers and interventions relevant to the aging brain and age-associated neurodegeneration.',
    editorialBoard: ['Thomas Wisniewski', 'Aurora Savelli', 'David J. Irwin'],
    specialties: [
      'Brain Health and Aging',
      'Cellular and Molecular Mechanisms of Aging',
      'Clinical Neurodegeneration',
      'Imaging Biomarkers of Aging',
      'Neuroprotection and Repair',
    ],
  },
  {
    name: 'Frontiers in Agronomy',
    abbr: 'AG',
    color: 'bg-emerald-50 text-emerald-600',
    domain: 'Science',
    description:
      'Advances sustainable crop production through research on cropping systems, soil health, water management and agricultural technology.',
    about:
      'Frontiers in Agronomy is a dedicated venue for agronomic science, connecting crop physiology, ecology and production with the sustainability agenda.',
    editorialBoard: ['John R. Porter', 'Amir Kassam', 'Senthold Asseng'],
    specialties: [
      'Agroecology and Ecosystem Services',
      'Crop Physiology and Production',
      'Cropping Systems and Agronomy',
      'Plant Nutrition and Soil Fertility',
      'Sustainable Weed Management',
      'Precision Agriculture',
      'Water Management and Irrigation',
    ],
  },
  {
    name: 'Frontiers in Allergy',
    abbr: 'AL',
    color: 'bg-pink-50 text-pink-600',
    domain: 'Health',
    description:
      'A hub for clinical and translational research on allergic diseases, immunopathology and novel therapeutic approaches.',
    about:
      'Frontiers in Allergy covers the spectrum of allergic disease — from epidemiology and mechanisms to diagnostics, prevention and biologic therapies.',
    editorialBoard: ['Cezmi A. Akdis', 'Paul O’Byrne', 'Jörg Kleine-Tebbe'],
    specialties: [
      'Allergic Rhinitis and Sinusitis',
      'Allergy and Autoimmunity',
      'Asthma and Airway Inflammation',
      'Atopic Dermatitis and Skin Allergy',
      'Drug Allergy and Hypersensitivity',
      'Food Allergy and Anaphylaxis',
      'Insect Sting Allergy',
      'Immunology of Allergic Disease',
      'Pediatric Allergy',
      'Precision Medicine in Allergy',
      'Severe Asthma and Biologics',
      'Urticaria and Angioedema',
      'Venom Allergy and Immunotherapy',
    ],
  },
  {
    name: 'Frontiers in Amphibian and Reptile Science',
    abbr: 'AR',
    color: 'bg-lime-50 text-lime-600',
    domain: 'Science',
    description:
      'Publishes research on the biology, ecology, evolution and conservation of amphibians and reptiles.',
    about:
      'Frontiers in Amphibian and Reptile Science is a dedicated forum for herpetological research, spanning behavior, physiology, taxonomy and conservation biology.',
    editorialBoard: ['David A. Behler', 'Alexandra L. L. Debenedictis', 'Jodi Rowley'],
    specialties: [
      'Amphibian Conservation',
      'Herpetology and Evolution',
      'Reptile Physiology',
      'Behavioral Herpetology',
      'Disease Ecology',
      'Taxonomy and Systematics',
    ],
  },
  {
    name: 'Frontiers in Analytical Science',
    abbr: 'AS',
    color: 'bg-cyan-50 text-cyan-600',
    domain: 'Science',
    description:
      'Advances measurement science — novel instrumentation, separation techniques and bioanalytical methods — across chemistry and biology.',
    about:
      'Frontiers in Analytical Science showcases innovations in analytical chemistry and instrumentation, from mass spectrometry and spectroscopy to microfluidics and lab-on-chip devices.',
    editorialBoard: ['Donald S. Gaddis', 'Carol L. M. Robinson', 'Alexander E. Zhukov'],
    specialties: [
      'Analytical Chemistry',
      'Bioanalytical Methods',
      'Environmental Analysis',
      'Mass Spectrometry',
      'Microfluidics and Lab-on-Chip',
      'Spectroscopy and Imaging',
      'Separation Science',
    ],
  },
  {
    name: 'Frontiers in Advanced Optical Technologies',
    abbr: 'OT',
    color: 'bg-indigo-50 text-indigo-600',
    domain: 'Engineering',
    description:
      'Covers optical engineering and photonic devices, from metrology and integrated optics to quantum photonics.',
    about:
      'Frontiers in Advanced Optical Technologies bridges fundamental photonics research and engineered optical systems for industry and science.',
    editorialBoard: ['Andrea Di Falco', 'Sylvain Gigan', 'Qing Gu'],
    specialties: [
      'Optical Metrology',
      'Photonic Devices',
      'Fiber and Integrated Optics',
      'Quantum Photonics',
    ],
  },
  {
    name: 'Frontiers in Artificial Intelligence',
    abbr: 'AI',
    color: 'bg-primary-tint text-primary',
    domain: 'Science',
    description:
      'A platform for state-of-the-art AI research across machine learning, computer vision, NLP and the societal applications of intelligent systems.',
    about:
      'Frontiers in Artificial Intelligence publishes foundational and applied AI research, emphasizing reproducible methods and real-world impact.',
    editorialBoard: ['Thomas Hartung', 'Angelo Cangelosi', 'Xiaohui Liu'],
    specialties: [
      'AI for Health and Healthcare',
      'AI in Business and Economics',
      'AI in Education',
      'AI in Finance',
      'AI in Law',
      'AI in Medicine',
      'AI in Mental Health',
      'AI in Public Health',
      'AI Safety and Ethics',
      'Automated Reasoning and Logic',
      'Machine Learning',
      'Natural Language Processing',
      'Computer Vision and Pattern Recognition',
    ],
  },
  {
    name: 'Frontiers in Applied Mathematics and Statistics',
    abbr: 'AM',
    color: 'bg-teal-50 text-teal-600',
    domain: 'Science',
    description:
      'Advances mathematical and statistical theory and its applications across science, engineering, finance and the social sciences.',
    about:
      'Frontiers in Applied Mathematics and Statistics is a broad venue for applied mathematics, computational methods and data science.',
    editorialBoard: ['Charles K. Chui', 'Nancy Flournoy', 'Tony F. Chan'],
    specialties: [
      'Applied Probability',
      'Computational Mathematics',
      'Data Science and Statistics',
      'Mathematical Biology',
      'Mathematical Physics',
      'Numerical Analysis',
      'Optimization and Control',
      'Statistical Learning',
    ],
  },
  {
    name: 'Frontiers in Bioengineering and Biotechnology',
    abbr: 'BB',
    color: 'bg-blue-50 text-blue-600',
    domain: 'Engineering',
    description:
      'Publishes translational research at the interface of biology and engineering, from biomaterials and drug delivery to synthetic biology.',
    about:
      'Frontiers in Bioengineering and Biotechnology is a leading venue for biomedical engineering, bioprocess design and biomanufacturing innovation.',
    editorialBoard: ['Rui L. Reis', 'Ranieri Cancedda', 'Jens Kurreck'],
    specialties: [
      'Biomaterials',
      'Biosensors and Diagnostics',
      'CRISPR and Genome Engineering',
      'Drug Delivery',
      'Metabolic Engineering',
      'Microfluidics',
      'Nanobiotechnology',
      'Neural Interfaces',
      'Regenerative Medicine',
      'Synthetic Biology',
      'Tissue Engineering',
      'Vaccines and Immunoengineering',
    ],
  },
  {
    name: 'Frontiers in Computer Science',
    abbr: 'CS',
    color: 'bg-sky/10 text-sky',
    domain: 'Science',
    description:
      'Covers the breadth of computer science — algorithms, systems, human-computer interaction, security and theoretical foundations.',
    about:
      'Frontiers in Computer Science is a broad-scope journal publishing research across the theory, systems and applications of computing.',
    editorialBoard: ['Bruce M. Childers', 'Paolo Bellavista', 'Monica S. Lam'],
    specialties: [
      'AI and Machine Learning Systems',
      'Algorithms and Complexity',
      'Computational Intelligence',
      'Cybersecurity and Privacy',
      'Distributed Systems',
      'Human-Computer Interaction',
      'Programming Languages',
      'Software Engineering',
      'Theoretical Computer Science',
    ],
  },
  {
    name: 'Frontiers in Sociology',
    abbr: 'SO',
    color: 'bg-orange-50 text-orange-600',
    domain: 'Humanities & Social Sciences',
    description:
      'Advances sociological theory and empirical research on inequality, social networks, culture and institutional change.',
    about:
      'Frontiers in Sociology is an interdisciplinary journal connecting sociological scholarship with pressing contemporary social questions.',
    editorialBoard: ['Katherine S. Newman', 'Saskia Sassen', 'Frank Dobbin'],
    specialties: [
      'Political Sociology',
      'Race, Gender and Inequality',
      'Social Networks',
      'Sociology of Science',
      'Urban Sociology',
    ],
  },
  {
    name: 'Frontiers in Sustainability',
    abbr: 'SU',
    color: 'bg-green-50 text-green-600',
    domain: 'Sustainability',
    description:
      'Explores pathways to a sustainable future — circular economies, climate adaptation, sustainable cities and resilient energy systems.',
    about:
      'Frontiers in Sustainability brings together natural, engineering and social sciences to address the climate and sustainability crisis.',
    editorialBoard: ['Marko P. Hekkert', 'Diana Ürge-Vorsatz', 'Julia L. K. Steinberger'],
    specialties: [
      'Circular Economy',
      'Climate Adaptation',
      'Sustainable Cities and Communities',
      'Sustainable Energy Systems',
    ],
  },
  {
    name: 'Frontiers for Young Minds',
    abbr: 'YM',
    color: 'bg-rose-50 text-rose-600',
    domain: 'Young Minds',
    description:
      'Scientific articles written by scientists and reviewed by kids — making cutting-edge research accessible to young readers aged 8 to 15.',
    about:
      'Frontiers for Young Minds is a unique journal where research is written for and reviewed by children, fostering curiosity about science from an early age.',
    editorialBoard: ['Robert T. Knight', 'Sara L. R. Burrows', 'Julianna M. Walker'],
    specialties: ['A Young Scientist’s Guide to Discovery'],
  },
]

const ARTICLE_TYPE_OPTIONS: ArticleTypeOption[] = [
  {
    name: 'Hypothesis and Theory',
    description:
      'Hypothesis and Theory articles present a novel argument, interpretation or model intended to introduce a new hypothesis, challenge a dominant theory or shed new light on an existing one.',
    wordLimit: 350,
    figuresLimit: 15,
  },
  {
    name: 'Research Topic Manuscript Summary',
    description:
      'Your manuscript summary should simply be a summary of the article you plan to submit. This is the required first step in the research topic process and is not the final manuscript.',
    wordLimit: 2000,
    figuresLimit: 15,
  },
  {
    name: 'Original Research',
    description:
      'Original Research articles report on new, peer-reviewed data and findings, including experimental, observational or computational studies.',
    wordLimit: 12000,
    figuresLimit: 15,
  },
  {
    name: 'Review',
    description:
      'Review articles synthesize and critically evaluate the current state of a field, identifying open questions and future directions.',
    wordLimit: 12000,
    figuresLimit: 15,
  },
  {
    name: 'Brief Research Report',
    description:
      'Brief Research Reports are short articles presenting focused findings that merit publication without full-length treatment.',
    wordLimit: 4000,
    figuresLimit: 15,
  },
  {
    name: 'Systematic Review',
    description:
      'Systematic Reviews apply a rigorous, reproducible methodology to identify, appraise and synthesize all available evidence on a question.',
    wordLimit: 12000,
    figuresLimit: 15,
  },
  {
    name: 'Case Report',
    description:
      'Case Reports provide detailed descriptions of a single patient or a small case series with clinically meaningful findings.',
    wordLimit: 3000,
    figuresLimit: 15,
  },
  {
    name: 'Perspective',
    description:
      'Perspective articles offer a personal viewpoint, opinion or critical reflection on a topic within the scope of the journal.',
    wordLimit: 3000,
    figuresLimit: 15,
  },
  {
    name: 'Mini Review',
    description:
      'Mini Reviews provide a concise synthesis of a specific topic, summarizing the most important recent findings and open questions.',
    wordLimit: 5000,
    figuresLimit: 5,
  },
  {
    name: 'Methods',
    description:
      'Methods articles present novel experimental, computational, or analytical methods, including their validation and applications.',
    wordLimit: 12000,
    figuresLimit: 15,
  },
  {
    name: 'Data Report',
    description:
      'Data Reports provide a brief description of a novel dataset or repository, its collection methodology, and potential applications.',
    wordLimit: 3000,
    figuresLimit: 5,
  },
  {
    name: 'Policy and Practice Reviews',
    description:
      'Policy and Practice Reviews provide evidence-based analyses of current policies and practices within the field, with practical recommendations.',
    wordLimit: 12000,
    figuresLimit: 15,
  },
]

const ARTICLE_TYPES = ARTICLE_TYPE_OPTIONS.map((option) => option.name)

const ARTICLE_TYPE_DETAILS: Record<string, ArticleTypeOption> = Object.fromEntries(
  ARTICLE_TYPE_OPTIONS.map((option) => [option.name, option]),
)

const AFFILIATIONS = [
  'University of Karachi, Karachi, Pakistan',
  'ETH Zürich, Zürich, Switzerland',
  'École Polytechnique Fédérale de Lausanne (EPFL), Switzerland',
  'University of Oxford, Oxford, United Kingdom',
  'Massachusetts Institute of Technology (MIT), United States',
  'Stanford University, Stanford, United States',
  'University of Cambridge, Cambridge, United Kingdom',
  'Tokyo Institute of Technology, Tokyo, Japan',
]

const TITLE_OPTIONS: NameTitle[] = ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof.']

const SUMMARY_WORD_LIMIT = 2000
const SCOPE_WORD_LIMIT = 200
const TITLE_CHAR_LIMIT = 500

const STORAGE_KEY = 'es_submission_draft'

function createAuthor(): Author {
  return {
    id: Date.now() + Math.random(),
    email: '',
    title: 'Dr',
    firstName: '',
    middleName: '',
    lastName: '',
    isCorresponding: true,
    institutionalEmail: '',
    affiliations: [],
  }
}

function useArticleTypes() {
  return useQuery({
    queryKey: ['article-types'],
    queryFn: async (): Promise<ArticleTypeResource[]> => {
      try {
        const res = await articleTypesApi.index()
        return res.data.data
      } catch {
        return []
      }
    },
  })
}

function createDefaultDraft(): SubmissionDraft {
  const lead = createAuthor()
  lead.email = 'qmarabbas715@gmail.com'
  lead.firstName = 'Qamar'
  lead.lastName = 'Abbas'
  lead.affiliations = ['University of Karachi, Karachi, Pakistan']
  return {
    journal: `${JOURNAL_OPTIONS[0].name} - ${JOURNAL_OPTIONS[0].specialties[0]}`,
    articleType: '',
    scopeStatement: '',
    title: '',
    summary: '',
    uploads: {
      manuscript: [],
      figures: [],
      supplementary: [],
      reviewOnly: [],
    },
    authors: [lead],
    statements: {
      notUnderConsideration: false,
      adheresPolicies: false,
      consents: false,
      acceptsTerms: false,
    },
  }
}

function loadDraft(): SubmissionDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SubmissionDraft>
      return { ...createDefaultDraft(), ...parsed }
    }
  } catch {
    return createDefaultDraft()
  }
  return createDefaultDraft()
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function isAuthorComplete(author: Author): boolean {
  return (
    author.email.trim() !== '' &&
    author.firstName.trim() !== '' &&
    author.lastName.trim() !== '' &&
    author.affiliations.length > 0
  )
}

function hasEditableVersion(files: string[]): boolean {
  return files.some((file) => /\.(docx?|tex)$/i.test(file))
}

function hasPdfVersion(files: string[]): boolean {
  return files.some((file) => /\.pdf$/i.test(file))
}

function isScopeStatementValid(text: string): boolean {
  return wordCount(text) > 0 && wordCount(text) <= SCOPE_WORD_LIMIT
}

export function SubmitPage() {
  const [draft, setDraft] = useState<SubmissionDraft>(loadDraft)
  const [openSteps, setOpenSteps] = useState<Record<StepKey, boolean>>({
    details: true,
    summary: true,
    authors: true,
    statements: true,
  })
  const [attempted, setAttempted] = useState<Record<StepKey, boolean>>({
    details: false,
    summary: false,
    authors: false,
    statements: false,
  })
  const [showResumeModal, setShowResumeModal] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== null,
  )
  const sectionRefs = useRef<Record<StepKey, HTMLDivElement | null>>({
    details: null,
    summary: null,
    authors: null,
    statements: null,
  })

  const { data: apiArticleTypes = [] } = useArticleTypes()
  const articleTypeNames =
    apiArticleTypes.length > 0 ? apiArticleTypes.map((t) => t.name) : ARTICLE_TYPES
  const selectedApiType = draft.articleType
    ? apiArticleTypes.find((t) => t.name === draft.articleType)
    : undefined
  const selectedMockType = draft.articleType ? ARTICLE_TYPE_DETAILS[draft.articleType] : undefined
  const selectedArticleType = draft.articleType
    ? {
        name: selectedApiType?.name ?? selectedMockType?.name ?? draft.articleType,
        description: selectedMockType?.description ?? '',
        wordLimit: selectedApiType?.max_word_count ?? selectedMockType?.wordLimit,
        summaryWords: selectedApiType?.max_summary_words ?? selectedMockType?.wordLimit,
        figuresLimit: selectedApiType?.max_figures_tables ?? selectedMockType?.figuresLimit,
      }
    : undefined
  const summaryWordLimit = selectedArticleType?.summaryWords ?? SUMMARY_WORD_LIMIT

  const update = <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  const updateAuthor = (id: number, patch: Partial<Author>) =>
    setDraft((prev) => ({
      ...prev,
      authors: prev.authors.map((author) => (author.id === id ? { ...author, ...patch } : author)),
    }))

  const addAuthor = () =>
    setDraft((prev) => ({ ...prev, authors: [...prev.authors, createAuthor()] }))

  const removeAuthor = (id: number) =>
    setDraft((prev) => ({
      ...prev,
      authors: prev.authors.length > 1 ? prev.authors.filter((author) => author.id !== id) : prev.authors,
    }))

  const moveAuthor = (id: number, dir: -1 | 1) =>
    setDraft((prev) => {
      const index = prev.authors.findIndex((author) => author.id === id)
      const target = index + dir
      if (index < 0 || target < 0 || target >= prev.authors.length) return prev
      const authors = [...prev.authors]
      ;[authors[index], authors[target]] = [authors[target], authors[index]]
      return { ...prev, authors }
    })

  const stepComplete = useMemo(
    () => ({
      details:
        draft.journal !== '' &&
        draft.articleType !== '' &&
        isScopeStatementValid(draft.scopeStatement) &&
        hasEditableVersion(draft.uploads.manuscript) &&
        hasPdfVersion(draft.uploads.manuscript),
      summary:
        draft.title.trim() !== '' &&
        draft.title.trim().length <= TITLE_CHAR_LIMIT &&
        wordCount(draft.summary) > 0 &&
        wordCount(draft.summary) <= summaryWordLimit,
      authors: draft.authors.some(isAuthorComplete),
      statements:
        draft.statements.notUnderConsideration &&
        draft.statements.adheresPolicies &&
        draft.statements.consents &&
        draft.statements.acceptsTerms,
    }),
    [draft, summaryWordLimit],
  )

  const quality = useMemo(() => {
    const actions = [
      draft.journal !== '',
      draft.articleType !== '',
      isScopeStatementValid(draft.scopeStatement),
      hasEditableVersion(draft.uploads.manuscript) && hasPdfVersion(draft.uploads.manuscript),
      draft.title.trim() !== '' && draft.title.trim().length <= TITLE_CHAR_LIMIT,
      wordCount(draft.summary) > 0 && wordCount(draft.summary) <= summaryWordLimit,
      draft.authors.some(isAuthorComplete),
      draft.statements.notUnderConsideration,
      draft.statements.adheresPolicies,
      draft.statements.consents,
      draft.statements.acceptsTerms,
    ]
    const done = actions.filter(Boolean).length
    return { percent: Math.round((done / actions.length) * 100), done, total: actions.length }
  }, [draft, summaryWordLimit])

  const remainingActions = quality.total - quality.done

  const persist = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    toast.success('Draft saved successfully')
  }

  const scrollToSection = (key: StepKey) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goToStep = (key: StepKey) => {
    setOpenSteps((prev) => ({ ...prev, [key]: true }))
    window.setTimeout(() => scrollToSection(key), 60)
  }

  const saveAndContinue = (key: StepKey) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    if (!stepComplete[key]) {
      setAttempted((prev) => ({ ...prev, [key]: true }))
      toast.error(`Please complete ${STEP_TITLES[key]} before continuing`)
      return
    }
    setAttempted((prev) => ({ ...prev, [key]: false }))
    const index = STEP_ORDER.indexOf(key)
    const next = STEP_ORDER[index + 1]
    if (next) goToStep(next)
  }

  const previous = (key: StepKey) => {
    const index = STEP_ORDER.indexOf(key)
    if (index > 0) goToStep(STEP_ORDER[index - 1])
  }

  const submit = () => {
    if (remainingActions > 0) {
      toast.error(
        `${remainingActions} suggested action${remainingActions === 1 ? '' : 's'} remaining before you can submit`,
      )
      return
    }
    localStorage.removeItem(STORAGE_KEY)
    setDraft(createDefaultDraft())
    toast.success('Manuscript submitted successfully')
  }

  const resumeDraft = () => setShowResumeModal(false)

  const startNewSubmission = () => {
    localStorage.removeItem(STORAGE_KEY)
    setDraft(createDefaultDraft())
    setShowResumeModal(false)
    toast.info('Started a new submission')
  }

  const completedSteps = STEP_ORDER.filter((key) => stepComplete[key]).length

  return (
    <div className="min-h-screen bg-body font-sans text-ink">
      <Header />

      <main className="space-y-6 pb-10">
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                Author Submission Portal
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Submit your research
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-ink-secondary">
                Follow the steps below to submit your manuscript. Your progress is saved automatically
                on each step and can be resumed at any time.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl space-y-4 px-4 sm:px-6">
          <WizardSection
            step={1}
            title={STEP_TITLES.details}
            complete={stepComplete.details}
            open={openSteps.details}
            onToggle={() => setOpenSteps((p) => ({ ...p, details: !p.details }))}
            sectionRef={sectionRefs}
            sectionKey="details"
          >
            <StepSubmissionDetails
              draft={draft}
              update={update}
              showErrors={attempted.details}
              onSave={persist}
              onSaveContinue={() => saveAndContinue('details')}
              articleTypeNames={articleTypeNames}
              selectedArticleType={selectedArticleType}
            />
          </WizardSection>

          <WizardSection
            step={2}
            title={STEP_TITLES.summary}
            complete={stepComplete.summary}
            open={openSteps.summary}
            onToggle={() => setOpenSteps((p) => ({ ...p, summary: !p.summary }))}
            sectionRef={sectionRefs}
            sectionKey="summary"
          >
            <StepManuscriptSummary
              draft={draft}
              update={update}
              showErrors={attempted.summary}
              onPrevious={() => previous('summary')}
              onSave={persist}
              onSaveContinue={() => saveAndContinue('summary')}
              summaryWordLimit={summaryWordLimit}
            />
          </WizardSection>

          <WizardSection
            step={3}
            title={STEP_TITLES.authors}
            complete={stepComplete.authors}
            open={openSteps.authors}
            onToggle={() => setOpenSteps((p) => ({ ...p, authors: !p.authors }))}
            sectionRef={sectionRefs}
            sectionKey="authors"
          >
            <StepAuthors
              draft={draft}
              updateAuthor={updateAuthor}
              addAuthor={addAuthor}
              removeAuthor={removeAuthor}
              moveAuthor={moveAuthor}
              showErrors={attempted.authors}
              onPrevious={() => previous('authors')}
              onSave={persist}
              onSaveContinue={() => saveAndContinue('authors')}
            />
          </WizardSection>

          <WizardSection
            step={4}
            title={STEP_TITLES.statements}
            complete={stepComplete.statements}
            open={openSteps.statements}
            onToggle={() => setOpenSteps((p) => ({ ...p, statements: !p.statements }))}
            sectionRef={sectionRefs}
            sectionKey="statements"
          >
            <StepStatements
              draft={draft}
              update={update}
              showErrors={attempted.statements}
              onPrevious={() => previous('statements')}
              onSave={persist}
              onSaveContinue={() => saveAndContinue('statements')}
            />
          </WizardSection>
        </section>

        <div className="h-2" />

        <QualityBar percent={quality.percent} remaining={remainingActions} onSubmit={submit} />
      </main>

      {showResumeModal && (
        <ResumeDraftModal
          onContinue={resumeDraft}
          onStartNew={startNewSubmission}
          percent={quality.percent}
          completedCount={completedSteps}
        />
      )}

      <Footer />
    </div>
  )
}

interface WizardSectionProps {
  step: number
  title: string
  complete: boolean
  open: boolean
  onToggle: () => void
  children: ReactNode
  sectionKey: StepKey
  sectionRef: RefObject<Record<StepKey, HTMLDivElement | null>>
}

function WizardSection({
  step,
  title,
  complete,
  open,
  onToggle,
  children,
  sectionKey,
  sectionRef,
}: WizardSectionProps) {
  return (
    <div
      ref={(el) => {
        sectionRef.current[sectionKey] = el
      }}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-white shadow-xs"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-body"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
            complete ? 'bg-success/10 text-success' : 'bg-red-50 text-red-600'
          }`}
        >
          {step}
        </span>
        <span className="flex-1 text-sm font-bold text-ink sm:text-base">{title}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            complete ? 'bg-success/10 text-success' : 'bg-red-50 text-red-600'
          }`}
        >
          {complete ? 'Completed' : 'Incomplete'}
        </span>
        <ChevronDownIcon open={open} />
      </button>
      {open && <div className="border-t border-border px-5 py-5 sm:px-6">{children}</div>}
    </div>
  )
}

interface StepActionsProps {
  onSave: () => void
  onSaveContinue: () => void
  onPrevious?: () => void
  saveLabel?: string
  hideSave?: boolean
  hideGuide?: boolean
}

function StepActions({
  onSave,
  onSaveContinue,
  onPrevious,
  saveLabel,
  hideSave,
  hideGuide,
}: StepActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
      {!hideGuide && (
        <>
          <a
            href="#"
            className="text-xs font-bold text-primary underline-offset-2 hover:text-primary-hover hover:underline"
          >
            Author guidelines
          </a>
          <span className="ml-auto flex items-center gap-2 text-xs text-ink-muted">
            <CrossrefIcon />
            Manuscripts are checked by plagiarism detection software.
          </span>
        </>
      )}
      <div className={`flex items-center gap-2 ${hideGuide ? 'ml-auto' : ''}`}>
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
          >
            Previous
          </button>
        )}
        {!hideSave && (
          <button
            type="button"
            onClick={onSave}
            className="rounded-full border border-primary/30 bg-primary-tint px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {saveLabel ?? 'Save'}
          </button>
        )}
        <button
          type="button"
          onClick={onSaveContinue}
          className="rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700"
        >
          Save &amp; Continue
        </button>
      </div>
    </div>
  )
}

function StepSubmissionDetails({
  draft,
  update,
  showErrors,
  onSave,
  onSaveContinue,
  articleTypeNames,
  selectedArticleType,
}: {
  draft: SubmissionDraft
  update: <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) => void
  showErrors: boolean
  onSave: () => void
  onSaveContinue: () => void
  articleTypeNames: string[]
  selectedArticleType: ArticleTypeDetail | undefined
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedJournal, setSelectedJournal] = useState<JournalOption | null>(() =>
    JOURNAL_OPTIONS.find((j) => draft.journal.startsWith(j.name)) ?? null,
  )

  useEffect(() => {
    if (!draft.journal) {
      setSelectedJournal(null)
      return
    }
    setSelectedJournal((current) => {
      if (current?.name && draft.journal.startsWith(current.name)) return current
      return JOURNAL_OPTIONS.find((j) => draft.journal.startsWith(j.name)) ?? current
    })
  }, [draft.journal])

  const selectedSpecialty = selectedJournal
    ? draft.journal.slice(selectedJournal.name.length).replace(/^\s*-\s*/, '')
    : ''
  const scopeWords = wordCount(draft.scopeStatement)
  const scopeLeft = Math.max(0, SCOPE_WORD_LIMIT - scopeWords)
  const scopeTooLong = scopeWords > SCOPE_WORD_LIMIT
  const manuscriptComplete =
    hasEditableVersion(draft.uploads.manuscript) && hasPdfVersion(draft.uploads.manuscript)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <FieldLabel>Journal</FieldLabel>
          {selectedJournal && (
            <button
              type="button"
              onClick={() => {
                setSelectedJournal(null)
                update('journal', '')
              }}
              aria-label="Remove selected journal"
              className="rounded-md p-1 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <div className="mt-2">
          {selectedJournal ? (
            <div className="flex items-start gap-3.5 rounded-xl border border-border bg-white p-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-2xs ${selectedJournal.color}`}
              >
                {initialsOf(selectedJournal.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">
                  {selectedJournal.name}
                  <span className="ml-1 font-medium text-ink-muted">- {selectedSpecialty}</span>
                </p>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-ink-secondary">
                  {selectedJournal.description}
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 text-left text-sm text-ink-muted transition-all duration-200 hover:border-primary hover:text-ink"
            >
              <span className="flex items-center gap-2.5">
                <SearchIcon />
                Search and select...
              </span>
              <ChevronDownIcon open={false} />
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <FieldLabel hint>Article type</FieldLabel>
          {draft.articleType && (
            <button
              type="button"
              onClick={() => update('articleType', '')}
              aria-label="Clear article type"
              className="rounded-md p-1 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <div className="relative mt-2">
          <select
            value={draft.articleType}
            onChange={(e) => update('articleType', e.target.value)}
            className={`w-full cursor-pointer appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm outline-none transition-colors focus:border-primary ${
              draft.articleType ? 'font-semibold text-ink' : 'text-ink-muted'
            }`}
          >
            {!draft.articleType && <option value="">Select article type…</option>}
            {articleTypeNames.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">
            <ChevronDownIcon open />
          </span>
        </div>
        {showErrors && !draft.articleType && <FieldError>Please select an article type</FieldError>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-primary-tint/40 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {selectedArticleType ? selectedArticleType.name : 'Article type'}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
            {selectedArticleType
              ? selectedArticleType.description
              : 'Select an article type to see its description.'}
          </p>
        </div>
        <div className="rounded-xl bg-body p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink">
            Guidelines (Max. Limits)
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
            Word count:{' '}
            <span className="font-bold text-ink">
              {selectedArticleType?.wordLimit ?? '—'} words
            </span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
            Summary length:{' '}
            <span className="font-bold text-ink">
              {selectedArticleType?.summaryWords ?? '—'} words
            </span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
            Figures and tables:{' '}
            <span className="font-bold text-ink">
              {selectedArticleType?.figuresLimit ?? '—'}
            </span>
          </p>
        </div>
      </div>

      <div>
        <FieldLabel hint>Scope statement</FieldLabel>
        <p className="mt-1 text-xs text-ink-muted">
          Provide a short statement to justify how the contents of your manuscript fit within the
          scope of the journal and section you have selected above.
        </p>
        <textarea
          value={draft.scopeStatement}
          onChange={(e) => update('scopeStatement', e.target.value)}
          placeholder="Type here…"
          rows={3}
          className="mt-2 w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-muted focus:border-primary"
        />
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-ink-muted">
            {scopeLeft.toLocaleString()} WORDS LEFT
          </span>
          {showErrors && !draft.scopeStatement.trim() && (
            <FieldError>Please fill this field to continue</FieldError>
          )}
          {scopeTooLong && (
            <FieldError>Scope statement must be {SCOPE_WORD_LIMIT} words or fewer</FieldError>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <UploadDropzone
          icon={<DocumentIcon />}
          title="Manuscript"
          hint="Drag and drop your manuscript source file (Word or LaTeX + Bib) and PDF version"
          files={draft.uploads.manuscript}
          onAdd={(names) =>
            update('uploads', { ...draft.uploads, manuscript: [...draft.uploads.manuscript, ...names] })
          }
          onRemove={(name) =>
            update('uploads', {
              ...draft.uploads,
              manuscript: draft.uploads.manuscript.filter((file) => file !== name),
            })
          }
          error={
            showErrors && !manuscriptComplete
              ? 'Please provide both an editable version (DOC/DOCX or LaTeX) and a PDF version.'
              : undefined
          }
        />

        <UploadDropzone
          icon={<ImageIcon />}
          title="Figures (optional)"
          hint="TIF/TIFF, JPG; 300 DPI; 8.5 to 20cm width"
          files={draft.uploads.figures}
          onAdd={(names) =>
            update('uploads', { ...draft.uploads, figures: [...draft.uploads.figures, ...names] })
          }
          onRemove={(name) =>
            update('uploads', {
              ...draft.uploads,
              figures: draft.uploads.figures.filter((file) => file !== name),
            })
          }
        />

        <UploadDropzone
          icon={<LayersIcon />}
          title="Supplementary files (optional)"
          hint="Data Sheet, Presentation, Supplementary Image or Table, Audio, Video"
          files={draft.uploads.supplementary}
          onAdd={(names) =>
            update('uploads', {
              ...draft.uploads,
              supplementary: [...draft.uploads.supplementary, ...names],
            })
          }
          onRemove={(name) =>
            update('uploads', {
              ...draft.uploads,
              supplementary: draft.uploads.supplementary.filter((file) => file !== name),
            })
          }
        />

        <UploadDropzone
          icon={<LayersIcon />}
          title="Review only files (optional)"
          hint="Data Sheet, Presentation, Supplementary Image or Table, Audio, Video"
          files={draft.uploads.reviewOnly}
          onAdd={(names) =>
            update('uploads', {
              ...draft.uploads,
              reviewOnly: [...draft.uploads.reviewOnly, ...names],
            })
          }
          onRemove={(name) =>
            update('uploads', {
              ...draft.uploads,
              reviewOnly: draft.uploads.reviewOnly.filter((file) => file !== name),
            })
          }
        />
      </div>

      <StepActions
        onSave={onSave}
        onSaveContinue={onSaveContinue}
        hideSave
        hideGuide
      />

      <JournalPickerModal
        open={pickerOpen}
        fallbackJournals={JOURNAL_OPTIONS}
        onClose={() => setPickerOpen(false)}
        onSelect={(journal, specialty) => {
          setSelectedJournal(journal)
          update('journal', specialty ? `${journal.name} - ${specialty}` : journal.name)
          setPickerOpen(false)
        }}
      />
    </div>
  )
}

const SUBMISSION_STEPS = [
  'Submission',
  'Interactive peer review',
  'Fee payment after acceptance',
  'Independent reviewer assessments',
  'Final decision',
  'Publication',
]

function ResumeDraftModal({
  onContinue,
  onStartNew,
  percent,
  completedCount,
}: {
  onContinue: () => void
  onStartNew: () => void
  percent: number
  completedCount: number
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onContinue()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onContinue])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      onClick={onContinue}
    >
      <div
        className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 text-white md:col-span-5 md:p-10">
          <p className="text-2xl font-black tracking-tight">
            EmergentSci<span className="text-red-600">.</span>
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-200">
            <FileTextIcon />
            Submission Portal
          </div>

          <h2 className="mt-5 text-2xl font-bold leading-snug">
            Submit your manuscript
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-slate-300">
            Rigorous, constructive, transparent and fast peer review.
          </p>

          <div className="mt-8 space-y-3">
            {SUBMISSION_STEPS.map((step) => (
              <div key={step} className="flex items-center gap-3">
                <span className="flex h-2 w-2 shrink-0 rounded-full bg-red-600" />
                <p className="text-sm font-medium text-slate-200">{step}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 border-t border-white/10 pt-4 text-[11px] font-medium tracking-wide text-slate-400">
            COPE Member &amp; DOAJ Indexed • Basel, Switzerland
          </p>
        </div>

        <div className="relative flex flex-col justify-center p-8 md:col-span-7 md:p-10">
          <button
            onClick={onContinue}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 md:right-6 md:top-6"
            aria-label="Close"
          >
            <XIcon />
          </button>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
            You have a submission in preparation.
            <span className="mt-1 block font-bold text-slate-900">
              Do you want to continue or start a new submission?
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Submission readiness</span>
              <span className="text-red-600">{percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-red-600 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-slate-500">
              {completedCount} of {STEP_ORDER.length} sections completed
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={onContinue}
              className="rounded-xl bg-red-600 px-7 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              Continue
            </button>
            <button
              onClick={onStartNew}
              className="rounded-xl border border-slate-200 bg-white px-7 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-red-600 hover:text-red-600"
            >
              Start new
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FileTextIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function UploadDropzone({
  icon,
  title,
  hint,
  files,
  onAdd,
  onRemove,
  error,
}: {
  icon: ReactNode
  title: string
  hint: string
  files: string[]
  onAdd: (names: string[]) => void
  onRemove: (name: string) => void
  error?: string
}) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | null) => {
    if (list && list.length > 0) onAdd(Array.from(list).map((file) => file.name))
  }

  return (
    <div>
      <FieldLabel>{title}</FieldLabel>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          addFiles(e.dataTransfer.files)
        }}
        className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary-tint/40' : 'border-border bg-body hover:border-primary/50'
        }`}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint text-primary">
          {icon}
        </span>
        <p className="text-xs leading-relaxed text-ink-secondary">{hint}</p>
        <span className="text-[11px] uppercase tracking-wider text-ink-muted">or</span>
        <span className="rounded-full border border-primary/30 bg-primary-tint px-4 py-1.5 text-xs font-bold text-primary">
          Browse files
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-2 flex flex-wrap items-center gap-1.5">
          {files.map((file) => (
            <li
              key={file}
              className="flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1 text-[11px] font-semibold text-primary"
            >
              <span className="max-w-40 truncate">{file}</span>
              <button
                type="button"
                onClick={() => onRemove(file)}
                aria-label={`Remove ${file}`}
                className="text-primary/60 hover:text-primary"
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}

function StepManuscriptSummary({
  draft,
  update,
  showErrors,
  onPrevious,
  onSave,
  onSaveContinue,
  summaryWordLimit,
}: {
  draft: SubmissionDraft
  update: <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) => void
  showErrors: boolean
  onPrevious: () => void
  onSave: () => void
  onSaveContinue: () => void
  summaryWordLimit: number
}) {
  const charsLeft = Math.max(0, TITLE_CHAR_LIMIT - draft.title.length)
  const words = wordCount(draft.summary)
  const wordsLeft = Math.max(0, summaryWordLimit - words)
  const titleTooLong = draft.title.length > TITLE_CHAR_LIMIT
  const summaryTooLong = words > summaryWordLimit

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required>Manuscript title</FieldLabel>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Type here…"
          className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-muted focus:border-primary"
        />
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-ink-muted">
            {charsLeft.toLocaleString()} CHARACTERS LEFT
          </span>
          {showErrors && !draft.title.trim() && (
            <FieldError>Please fill this field to continue</FieldError>
          )}
          {titleTooLong && <FieldError>Title must be {TITLE_CHAR_LIMIT} characters or fewer</FieldError>}
        </div>
      </div>

      <div>
        <FieldLabel required>Manuscript summary</FieldLabel>
        <textarea
          value={draft.summary}
          onChange={(e) => update('summary', e.target.value)}
          placeholder="Type here…"
          rows={6}
          className="mt-2 w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-muted focus:border-primary"
        />
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-ink-muted">
            {wordsLeft.toLocaleString()} WORDS LEFT
          </span>
          {showErrors && !draft.summary.trim() && (
            <FieldError>Please fill this field to continue</FieldError>
          )}
          {summaryTooLong && (
            <FieldError>Summary must be {summaryWordLimit} words or fewer</FieldError>
          )}
        </div>
      </div>

      <StepActions
        onPrevious={onPrevious}
        onSave={onSave}
        onSaveContinue={onSaveContinue}
      />
    </div>
  )
}

function StepAuthors({
  draft,
  updateAuthor,
  addAuthor,
  removeAuthor,
  moveAuthor,
  showErrors,
  onPrevious,
  onSave,
  onSaveContinue,
}: {
  draft: SubmissionDraft
  updateAuthor: (id: number, patch: Partial<Author>) => void
  addAuthor: () => void
  removeAuthor: (id: number) => void
  moveAuthor: (id: number, dir: -1 | 1) => void
  showErrors: boolean
  onPrevious: () => void
  onSave: () => void
  onSaveContinue: () => void
}) {
  const anyComplete = draft.authors.some(isAuthorComplete)

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-ink-secondary">
        Please provide the complete list of authors who contributed to this work and affiliation
        details. The first author is treated as the lead author.
      </p>

      {draft.authors.map((author, index) => (
        <AuthorCard
          key={author.id}
          author={author}
          index={index}
          total={draft.authors.length}
          onChange={(patch) => updateAuthor(author.id, patch)}
          onRemove={() => removeAuthor(author.id)}
          onMove={(dir) => moveAuthor(author.id, dir)}
          showErrors={showErrors}
        />
      ))}

      <button
        type="button"
        onClick={addAuthor}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover"
      >
        <PlusIcon />
        Add another author
      </button>

      {showErrors && !anyComplete && (
        <FieldError>Please complete at least one author with a valid affiliation</FieldError>
      )}

      <StepActions
        onPrevious={onPrevious}
        onSave={onSave}
        onSaveContinue={onSaveContinue}
      />
    </div>
  )
}

function AuthorCard({
  author,
  index,
  total,
  onChange,
  onRemove,
  onMove,
  showErrors,
}: {
  author: Author
  index: number
  total: number
  onChange: (patch: Partial<Author>) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
  showErrors: boolean
}) {
  const [affiliationQuery, setAffiliationQuery] = useState('')
  const [affiliationOpen, setAffiliationOpen] = useState(false)
  const missingRequired =
    showErrors &&
    (author.email.trim() === '' || author.firstName.trim() === '' || author.lastName.trim() === '')

  const matchingAffiliations = AFFILIATIONS.filter((aff) =>
    aff.toLowerCase().includes(affiliationQuery.toLowerCase()),
  ).filter((aff) => !author.affiliations.includes(aff))

  const addAffiliation = (aff: string) => {
    onChange({ affiliations: [...author.affiliations, aff] })
    setAffiliationQuery('')
    setAffiliationOpen(false)
  }

  const ordinal = ['1st', '2nd', '3rd', '4th', '5th'][index] ?? `${index + 1}th`

  return (
    <div className="rounded-xl border border-border bg-body p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-ink">{ordinal} Author</span>
        <div className="ml-auto flex items-center gap-1 text-ink-muted">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Move author up"
            className="rounded-md p-1.5 transition-colors hover:bg-white hover:text-primary disabled:opacity-30"
          >
            <MoveUpIcon />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="Move author down"
            className="rounded-md p-1.5 transition-colors hover:bg-white hover:text-primary disabled:opacity-30"
          >
            <MoveDownIcon />
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={total === 1}
            aria-label="Delete author"
            className="rounded-md p-1.5 transition-colors hover:bg-white hover:text-red-600 disabled:opacity-30"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            value={author.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none transition-colors focus:border-primary"
          />
          {showErrors && !author.email.trim() && <FieldError>Please provide an email address</FieldError>}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <FieldLabel>Title</FieldLabel>
            <select
              value={author.title}
              onChange={(e) => onChange({ title: e.target.value as NameTitle })}
              className="mt-1 w-full cursor-pointer rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary"
            >
              {TITLE_OPTIONS.map((title) => (
                <option key={title}>{title}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>First name</FieldLabel>
            <input
              type="text"
              value={author.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary"
            />
          </div>
          <div>
            <FieldLabel>Middle</FieldLabel>
            <input
              type="text"
              value={author.middleName}
              onChange={(e) => onChange({ middleName: e.target.value })}
              placeholder="Optional"
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none placeholder:text-ink-muted focus:border-primary"
            />
          </div>
          <div>
            <FieldLabel>Last</FieldLabel>
            <input
              type="text"
              value={author.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>

        {missingRequired && (
          <FieldError>Please fill in the first and last name to continue</FieldError>
        )}

        <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-secondary">
          <input
            type="checkbox"
            checked={author.isCorresponding}
            onChange={(e) => onChange({ isCorresponding: e.target.checked })}
            className="h-3.5 w-3.5 rounded accent-primary"
          />
          This is a corresponding author (optional)
        </label>

        <div>
          <FieldLabel>Institutional email</FieldLabel>
          <input
            type="email"
            value={author.institutionalEmail}
            onChange={(e) => onChange({ institutionalEmail: e.target.value })}
            placeholder="Please provide an institutional email address here"
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none placeholder:text-ink-muted focus:border-primary"
          />
        </div>

        <div>
          <FieldLabel>Affiliation</FieldLabel>
          <div className="relative mt-1">
            <input
              type="text"
              value={affiliationQuery}
              onChange={(e) => {
                setAffiliationQuery(e.target.value)
                setAffiliationOpen(true)
              }}
              onFocus={() => setAffiliationOpen(true)}
              placeholder="Select or type to search…"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none placeholder:text-ink-muted focus:border-primary"
            />
            {affiliationOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-border bg-white shadow-card">
                {matchingAffiliations.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (affiliationQuery.trim()) addAffiliation(affiliationQuery.trim())
                    }}
                    className="block w-full px-3 py-2 text-left text-xs text-primary hover:bg-body"
                  >
                    Use “{affiliationQuery}” as custom affiliation
                  </button>
                ) : (
                  matchingAffiliations.map((aff) => (
                    <button
                      key={aff}
                      type="button"
                      onClick={() => addAffiliation(aff)}
                      className="block w-full px-3 py-2 text-left text-xs text-ink-secondary hover:bg-body"
                    >
                      {aff}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {author.affiliations.length > 0 ? (
            <ul className="mt-2 flex flex-wrap items-center gap-1.5">
              {author.affiliations.map((aff) => (
                <li
                  key={aff}
                  className="flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1 text-[11px] font-semibold text-primary"
                >
                  <span className="text-xs">*</span>
                  {aff}
                  <button
                    type="button"
                    onClick={() => onChange({ affiliations: author.affiliations.filter((a) => a !== aff) })}
                    aria-label={`Remove affiliation ${aff}`}
                    className="text-primary/60 hover:text-primary"
                  >
                    <CloseIcon />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            showErrors && <FieldError>Please select at least one affiliation</FieldError>
          )}
        </div>
      </div>
    </div>
  )
}

function StepStatements({
  draft,
  update,
  showErrors,
  onPrevious,
  onSave,
  onSaveContinue,
}: {
  draft: SubmissionDraft
  update: <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) => void
  showErrors: boolean
  onPrevious: () => void
  onSave: () => void
  onSaveContinue: () => void
}) {
  const items: { key: keyof SubmissionDraft['statements']; label: string }[] = [
    {
      key: 'notUnderConsideration',
      label:
        'This manuscript is not currently under consideration for publication elsewhere and, if accepted, will not be published in identical form in any other journal without the consent of the publisher.',
    },
    {
      key: 'adheresPolicies',
      label:
        'This manuscript adheres to EmergentSci. materials and data policies, including open data, code and resource sharing requirements.',
    },
    {
      key: 'consents',
      label:
        'I have obtained all necessary consents to permit EmergentSci. to publish this article, including consents from co-authors and from any individuals identifiable in the manuscript.',
    },
    {
      key: 'acceptsTerms',
      label:
        'I have read, understood and hereby accept the EmergentSci. Terms & Conditions, including the open-access license under which this article will be published.',
    },
  ]

  const allChecked = Object.values(draft.statements).every(Boolean)

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-ink">
        I warrant that I am authorized to submit this article and to agree to the following conditions:
      </p>
      {items.map((item) => (
        <label
          key={item.key}
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-body p-3.5 text-xs leading-relaxed text-ink-secondary transition-colors hover:border-primary/40"
        >
          <input
            type="checkbox"
            checked={draft.statements[item.key]}
            onChange={(e) =>
              update('statements', { ...draft.statements, [item.key]: e.target.checked })
            }
            className="mt-0.5 h-4 w-4 shrink-0 rounded accent-primary"
          />
          <span>{item.label}</span>
        </label>
      ))}

      {showErrors && !allChecked && (
        <p className="text-xs font-bold text-danger" role="alert">
          Please mark all checkboxes to continue
        </p>
      )}

      <StepActions
        onPrevious={onPrevious}
        saveLabel="Save"
        onSave={onSave}
        onSaveContinue={onSaveContinue}
      />
    </div>
  )
}

function QualityBar({
  percent,
  remaining,
  onSubmit,
}: {
  percent: number
  remaining: number
  onSubmit: () => void
}) {
  const barColor = percent >= 80 ? 'bg-success' : percent >= 40 ? 'bg-warning' : 'bg-danger'

  return (
    <div className="sticky bottom-0 z-40 border-t border-border bg-white/95 shadow-card backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-[240px] flex-1 items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-body">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-xs text-ink-muted">
            Submission quality: <span className="font-bold text-ink">{percent}%</span>
          </span>
        </div>

        {remaining > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning">
            <InfoIcon />
            {remaining} suggested action{remaining === 1 ? '' : 's'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
            <CheckIcon />
            Ready to submit
          </span>
        )}

        <button
          type="button"
          onClick={onSubmit}
          className="rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white shadow-xs transition-colors hover:bg-red-700"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

function FieldLabel({
  children,
  hint,
  required,
}: {
  children: ReactNode
  hint?: boolean
  required?: boolean
}) {
  return (
    <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink">
      {required && <span className="text-danger">*</span>}
      {children}
      {hint && <InfoIcon />}
    </label>
  )
}

function FieldError({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-bold text-danger" role="alert">
      {children}
    </span>
  )
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function MoveUpIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

function MoveDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
    </svg>
  )
}

function CrossrefIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 7 6 10M15 7l-6 10" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </svg>
  )
}