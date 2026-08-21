import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { toast } from '../components/toast'
import { articleTypesApi, type ArticleTypeResource, type FileRequirement } from '../api/articleTypes'
import type { FileRequirementConfig, FileTypeRequirements } from './submit/types'
import {
  STEP_ORDER,
  STEP_TITLES,
  STEP_DESCRIPTIONS,
  JOURNAL_OPTIONS,
  ARTICLE_TYPE_OPTIONS,
  ARTICLE_TYPE_DETAILS,
  STORAGE_KEY,
  type Author,
  type SubmissionDraft,
  type StepKey,
  type ArticleTypeDetail,
  type MissingItem,
} from './submit/types'
import { SubmitHero } from './submit/SubmitHero'
import { WizardStepSection } from './submit/WizardStepSection'
import { StepSubmissionDetails } from './submit/StepSubmissionDetails'
import { StepManuscriptSummary } from './submit/StepManuscriptSummary'
import { StepAuthors } from './submit/StepAuthors'
import { StepStatements } from './submit/StepStatements'
import { QualityBar } from './submit/QualityBar'
import { ResumeDraftModal } from './submit/ResumeDraftModal'

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
  lead.title = 'Dr'
  lead.firstName = 'Qamar'
  lead.lastName = 'Abbas'
  lead.isCorresponding = true
  lead.affiliations = ['University of Karachi, Karachi, Pakistan']

  return {
    journal: '',
    articleType: '',
    scopeStatement: '',
    title: '',
    summary: '',
    keywords: [],
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

function loadSavedDraft(): SubmissionDraft {
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

function toFileReq(r?: FileRequirement): FileRequirementConfig | undefined {
  return r ? { enabled: r.enabled, maxSizeMb: r.max_size_mb, extensions: r.extensions } : undefined
}

function toFileRequirements(fr?: ArticleTypeResource['file_requirements']): FileTypeRequirements | undefined {
  if (!fr) return undefined
  return {
    manuscript: toFileReq(fr.manuscript),
    figures: toFileReq(fr.figures),
    supplementary: toFileReq(fr.supplementary),
    reviewerMaterials: toFileReq(fr.reviewer_materials),
  }
}

export function SubmitPage() {
  const [draft, setDraft] = useState<SubmissionDraft>(loadSavedDraft)
  const [openSteps, setOpenSteps] = useState<Record<StepKey, boolean>>({
    details: true,
    summary: false,
    authors: false,
    statements: false,
  })
  const [activeStepKey, setActiveStepKey] = useState<StepKey>('details')
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

  const update = <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  const updateAuthor = (id: number, patch: Partial<Author>) =>
    setDraft((prev) => ({
      ...prev,
      authors: prev.authors.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }))

  const addAuthor = () =>
    setDraft((prev) => ({ ...prev, authors: [...prev.authors, createAuthor()] }))

  const removeAuthor = (id: number) =>
    setDraft((prev) => ({
      ...prev,
      authors: prev.authors.length > 1 ? prev.authors.filter((a) => a.id !== id) : prev.authors,
    }))

  const moveAuthor = (id: number, dir: -1 | 1) =>
    setDraft((prev) => {
      const idx = prev.authors.findIndex((a) => a.id === id)
      const target = idx + dir
      if (idx < 0 || target < 0 || target >= prev.authors.length) return prev
      const authors = [...prev.authors]
      ;[authors[idx], authors[target]] = [authors[target], authors[idx]]
      return { ...prev, authors }
    })

  const { data: apiArticleTypes = [] } = useArticleTypes()
  const articleTypeNames =
    apiArticleTypes.length > 0 ? apiArticleTypes.map((t) => t.name) : ARTICLE_TYPE_OPTIONS.map((o) => o.name)

  useEffect(() => {
    if (!draft.articleType && articleTypeNames.length > 0) {
      update('articleType', articleTypeNames[0])
    }
  }, [draft.articleType, articleTypeNames])

  const selectedArticleType = useMemo<ArticleTypeDetail | undefined>(() => {
    if (!draft.articleType) return undefined
    const api = apiArticleTypes.find((t) => t.name === draft.articleType)
    if (api) {
      return {
        name: api.name,
        description: ARTICLE_TYPE_DETAILS[api.name]?.description ?? '',
        wordLimit: api.max_word_count,
        summaryWords: api.max_summary_words,
        figuresLimit: api.max_figures_tables,
        peerReviewType: ARTICLE_TYPE_DETAILS[api.name]?.peerReviewType,
        fileRequirements: toFileRequirements(api.file_requirements),
      }
    }
    return ARTICLE_TYPE_DETAILS[draft.articleType]
  }, [draft.articleType, apiArticleTypes])

  const manuscriptUploadEnabled =
    selectedArticleType?.fileRequirements?.manuscript?.enabled ?? true

  const summaryWordLimit = selectedArticleType?.summaryWords ?? 2000

  const stepComplete = useMemo(
    () => ({
      details:
        draft.journal !== '' &&
        draft.articleType !== '' &&
        draft.scopeStatement.trim() !== '' &&
        wordCount(draft.scopeStatement) <= 250 &&
        (!manuscriptUploadEnabled ||
          (hasEditableVersion(draft.uploads.manuscript) &&
            hasPdfVersion(draft.uploads.manuscript))),
      summary:
        draft.title.trim() !== '' &&
        draft.title.trim().length <= 500 &&
        wordCount(draft.summary) > 0 &&
        wordCount(draft.summary) <= summaryWordLimit,
      authors: draft.authors.length > 0 && draft.authors.every(isAuthorComplete),
      statements:
        draft.statements.notUnderConsideration &&
        draft.statements.adheresPolicies &&
        draft.statements.consents &&
        draft.statements.acceptsTerms,
    }),
    [draft, summaryWordLimit, manuscriptUploadEnabled],
  )

  const checklistItems = useMemo<MissingItem[]>(() => {
    const items: MissingItem[] = [
      { id: 'journal', stepKey: 'details', label: 'Select Target Journal & Section', isComplete: Boolean(draft.journal) },
      { id: 'articleType', stepKey: 'details', label: 'Select Article Type', isComplete: Boolean(draft.articleType) },
      {
        id: 'scopeStatement',
        stepKey: 'details',
        label: 'Provide Scope Justification Statement',
        isComplete: draft.scopeStatement.trim() !== '' && wordCount(draft.scopeStatement) <= 250,
      },
    ]
    if (manuscriptUploadEnabled) {
      items.push(
        {
          id: 'manuscriptEditable',
          stepKey: 'details',
          label: 'Upload Editable Source Manuscript (DOC/DOCX/TeX)',
          isComplete: hasEditableVersion(draft.uploads.manuscript),
        },
        {
          id: 'manuscriptPdf',
          stepKey: 'details',
          label: 'Upload Manuscript PDF Version',
          isComplete: hasPdfVersion(draft.uploads.manuscript),
        },
      )
    }
    items.push(
      {
        id: 'title',
        stepKey: 'summary',
        label: 'Enter Manuscript Title',
        isComplete: draft.title.trim() !== '' && draft.title.trim().length <= 500,
      },
      {
        id: 'summary',
        stepKey: 'summary',
        label: 'Provide Abstract / Summary',
        isComplete: wordCount(draft.summary) > 0 && wordCount(draft.summary) <= summaryWordLimit,
      },
      { id: 'authors', stepKey: 'authors', label: 'Complete All Author Details & Affiliations', isComplete: draft.authors.every(isAuthorComplete) },
      { id: 'notUnderConsideration', stepKey: 'statements', label: 'Confirm Originality & Exclusivity Statement', isComplete: draft.statements.notUnderConsideration },
      { id: 'adheresPolicies', stepKey: 'statements', label: 'Accept Data Sharing & Ethics Policy', isComplete: draft.statements.adheresPolicies },
      { id: 'consents', stepKey: 'statements', label: 'Confirm Author & Participant Consents', isComplete: draft.statements.consents },
      { id: 'acceptsTerms', stepKey: 'statements', label: 'Accept Open Access Terms & Conditions', isComplete: draft.statements.acceptsTerms },
    )
    return items
  }, [draft, summaryWordLimit, manuscriptUploadEnabled])

  const qualityPercent = useMemo(() => {
    const total = checklistItems.length
    const done = checklistItems.filter((i) => i.isComplete).length
    return Math.round((done / total) * 100)
  }, [checklistItems])

  const completedSectionsCount = STEP_ORDER.filter((k) => stepComplete[k]).length

  const scrollToSection = (key: StepKey) => {
    setActiveStepKey(key)
    setOpenSteps((prev) => ({ ...prev, [key]: true }))
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goToStep = (key: StepKey) => {
    setOpenSteps((prev) => ({ ...prev, [key]: true }))
    window.setTimeout(() => scrollToSection(key), 60)
  }

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    toast.success('Manuscript draft saved successfully')
  }

  const handleSaveAndContinue = (currentKey: StepKey) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))

    if (!stepComplete[currentKey]) {
      setAttempted((prev) => ({ ...prev, [currentKey]: true }))
      toast.error(`Please complete required fields in ${STEP_TITLES[currentKey]}`)
      return
    }

    setAttempted((prev) => ({ ...prev, [currentKey]: false }))
    const currentIndex = STEP_ORDER.indexOf(currentKey)
    const nextKey = STEP_ORDER[currentIndex + 1]

    if (nextKey) {
      goToStep(nextKey)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = (currentKey: StepKey) => {
    const currentIndex = STEP_ORDER.indexOf(currentKey)
    if (currentIndex > 0) {
      goToStep(STEP_ORDER[currentIndex - 1])
    }
  }

  const handleSubmit = () => {
    const uncompleted = checklistItems.filter((i) => !i.isComplete)
    if (uncompleted.length > 0) {
      setAttempted({ details: true, summary: true, authors: true, statements: true })
      toast.error(
        `${uncompleted.length} required action${uncompleted.length === 1 ? '' : 's'} remaining before submission`,
      )
      goToStep(uncompleted[0].stepKey)
      return
    }

    localStorage.removeItem(STORAGE_KEY)
    setDraft(createDefaultDraft())
    toast.success('Manuscript submitted successfully to Emergent Science Editorial Office!')
  }

  const resumeDraft = () => setShowResumeModal(false)
  const startNewSubmission = () => {
    localStorage.removeItem(STORAGE_KEY)
    setDraft(createDefaultDraft())
    setShowResumeModal(false)
    toast.info('Started a new submission')
  }

  return (
    <div className="min-h-screen bg-body font-sans text-ink flex flex-col justify-between">
      <div>
        <Header />

        <main className="space-y-6 pb-12">
          <SubmitHero
            completedSteps={stepComplete}
            openSteps={openSteps}
            activeStepKey={activeStepKey}
            onSelectStep={goToStep}
            overallPercent={qualityPercent}
          />

          <div className="mx-auto max-w-5xl space-y-4 px-4 sm:px-6">
            <WizardStepSection
              stepNumber={1}
              title={STEP_TITLES.details}
              subtitle={STEP_DESCRIPTIONS.details}
              complete={stepComplete.details}
              open={openSteps.details}
              onToggle={() => {
                setOpenSteps((p) => ({ ...p, details: !p.details }))
                setActiveStepKey('details')
              }}
              sectionKey="details"
              onRegisterRef={(el) => {
                sectionRefs.current.details = el
              }}
            >
              <StepSubmissionDetails
                draft={draft}
                update={update}
                showErrors={attempted.details}
                onSave={handleSaveDraft}
                onSaveContinue={() => handleSaveAndContinue('details')}
                articleTypeNames={articleTypeNames}
                selectedArticleType={selectedArticleType}
                journalOptions={JOURNAL_OPTIONS}
              />
            </WizardStepSection>

            <WizardStepSection
              stepNumber={2}
              title={STEP_TITLES.summary}
              subtitle={STEP_DESCRIPTIONS.summary}
              complete={stepComplete.summary}
              open={openSteps.summary}
              onToggle={() => {
                setOpenSteps((p) => ({ ...p, summary: !p.summary }))
                setActiveStepKey('summary')
              }}
              sectionKey="summary"
              onRegisterRef={(el) => {
                sectionRefs.current.summary = el
              }}
            >
              <StepManuscriptSummary
                draft={draft}
                update={update}
                showErrors={attempted.summary}
                onPrevious={() => handlePrevious('summary')}
                onSave={handleSaveDraft}
                onSaveContinue={() => handleSaveAndContinue('summary')}
                summaryWordLimit={summaryWordLimit}
                selectedArticleType={selectedArticleType}
              />
            </WizardStepSection>

            <WizardStepSection
              stepNumber={3}
              title={STEP_TITLES.authors}
              subtitle={STEP_DESCRIPTIONS.authors}
              complete={stepComplete.authors}
              open={openSteps.authors}
              onToggle={() => {
                setOpenSteps((p) => ({ ...p, authors: !p.authors }))
                setActiveStepKey('authors')
              }}
              sectionKey="authors"
              onRegisterRef={(el) => {
                sectionRefs.current.authors = el
              }}
            >
              <StepAuthors
                draft={draft}
                updateAuthor={updateAuthor}
                addAuthor={addAuthor}
                removeAuthor={removeAuthor}
                moveAuthor={moveAuthor}
                showErrors={attempted.authors}
                onPrevious={() => handlePrevious('authors')}
                onSave={handleSaveDraft}
                onSaveContinue={() => handleSaveAndContinue('authors')}
              />
            </WizardStepSection>

            <WizardStepSection
              stepNumber={4}
              title={STEP_TITLES.statements}
              subtitle={STEP_DESCRIPTIONS.statements}
              complete={stepComplete.statements}
              open={openSteps.statements}
              onToggle={() => {
                setOpenSteps((p) => ({ ...p, statements: !p.statements }))
                setActiveStepKey('statements')
              }}
              sectionKey="statements"
              onRegisterRef={(el) => {
                sectionRefs.current.statements = el
              }}
            >
              <StepStatements
                draft={draft}
                update={update}
                showErrors={attempted.statements}
                onPrevious={() => handlePrevious('statements')}
                onSave={handleSaveDraft}
                onSaveContinue={() => handleSaveAndContinue('statements')}
              />
            </WizardStepSection>
          </div>

          <div className="h-4" />
        </main>
      </div>

      {/* Sticky Bottom Quality & Action Bar */}
      <QualityBar
        percent={qualityPercent}
        items={checklistItems}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        onJumpToSection={goToStep}
      />

      {/* Resume Prior Draft Dialog */}
      {showResumeModal && (
        <ResumeDraftModal
          onContinue={resumeDraft}
          onStartNew={startNewSubmission}
          percent={qualityPercent}
          completedCount={completedSectionsCount}
          totalSections={STEP_ORDER.length}
          journalName={draft.journal || undefined}
          manuscriptTitle={draft.title || undefined}
        />
      )}

      <Footer />
    </div>
  )
}

export {
  StepSubmissionDetails,
  StepManuscriptSummary,
  StepAuthors,
  StepStatements,
  QualityBar,
  ResumeDraftModal,
}
