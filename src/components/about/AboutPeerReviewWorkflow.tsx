import { useState } from 'react'
import { FileCheck, Users2, MessageSquareText, ShieldAlert, Sparkles, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { appRoutes } from '../../appRoutes'

interface WorkflowStep {
  id: number
  title: string
  shortTitle: string
  duration: string
  participants: string
  description: string
  details: string[]
  safeguard: string
  icon: typeof FileCheck
}

const STEPS: WorkflowStep[] = [
  {
    id: 1,
    title: 'Pre-Screening & AIRA Integrity Assessment',
    shortTitle: '1. Screening',
    duration: '1–3 Days',
    participants: 'Editorial Office & AIRA Automated Forensics',
    description:
      'Every submitted manuscript undergoes rigorous pre-flight quality checks prior to being dispatched to the Field Chief Editor and Associate Editors.',
    details: [
      'AIRA scans for image manipulation, duplicate figures, and suspicious splicing.',
      'Plagiarism verification against Crossref Similarity Check and international databases.',
      'Reviewer conflict-of-interest analysis and author identity verification (via ORCID).',
      'Evaluation of basic manuscript scope, compliance with ethical guidelines, and raw data availability.',
    ],
    safeguard: 'Immediate triage prevents fraudulent or sub-standard papers from consuming reviewer time.',
    icon: ShieldAlert,
  },
  {
    id: 2,
    title: 'Independent Expert Review Phase',
    shortTitle: '2. Independent Review',
    duration: '2–4 Weeks',
    participants: 'Handling Editor & At least 2 Independent Reviewers',
    description:
      'Domain expert reviewers independently evaluate the scientific soundness, methodological rigor, data validity, and clarity of the research.',
    details: [
      'Reviewers submit comprehensive, structured independent review reports.',
      'Focus is placed on scientific validity rather than subjective novelty predictions.',
      'Reviewers highlight specific methodological queries and required clarifications.',
      'Handling Editor assesses reports and decides whether to open the interactive discussion forum.',
    ],
    safeguard: 'No single reviewer can secretly veto without presenting concrete scientific rationale.',
    icon: Users2,
  },
  {
    id: 3,
    title: 'Interactive Real-Time Review Forum',
    shortTitle: '3. Collaborative Forum',
    duration: '2–3 Weeks',
    participants: 'Authors, Reviewers & Handling Editor',
    description:
      'Our landmark innovation: authors and reviewers enter a direct, threaded online forum to resolve concerns collaboratively.',
    details: [
      'Authors respond directly to reviewer critiques point-by-point in real time.',
      'Revised manuscripts and supplementary datasets can be uploaded directly within the forum.',
      'Handling Editor mediates and facilitates constructive consensus.',
      'Reviewers finalize endorsement once all methodological and technical requirements are satisfied.',
    ],
    safeguard: 'Eliminates endless multi-round postal delays; promotes scientific clarity through dialogue.',
    icon: MessageSquareText,
  },
  {
    id: 4,
    title: 'Final Editorial Decision & Open Attribution',
    shortTitle: '4. Decision & Attribution',
    duration: '3–5 Days',
    participants: 'Handling Editor, Field Chief Editor & Production Team',
    description:
      'Upon mutual agreement and endorsement by reviewers, the Handling Editor makes the final acceptance determination.',
    details: [
      'Handling Editor validates all review endorsements and signs off on publication.',
      'Reviewer names and affiliations are openly published on the final article (CC-BY 4.0).',
      'Professional XML/PDF typesetting, DOI registration with Crossref, and indexing submission.',
      'Immediate global availability on Emergent Science, PubMed Central, and open repositories.',
    ],
    safeguard: 'Public reviewer names guarantee transparency and prevent unmerited acceptances.',
    icon: FileCheck,
  },
]

export function AboutPeerReviewWorkflow() {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0)
  const currentStep = STEPS[selectedStepIndex]

  return (
    <section id="review-model" className="border-b border-border bg-body py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Our Publishing Engine
            </span>
            <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              The Collaborative Peer Review Model
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-ink-secondary">
              A transparent, consensus-driven review system designed to support researchers 
              and maintain world-class standards of scientific reproducibility.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-2 text-xs text-ink-secondary shadow-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>Average turnaround: <strong>77 days</strong> submission-to-acceptance</span>
          </div>
        </div>

        {/* Step Progression Tabs */}
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          {STEPS.map((step, idx) => {
            const isSelected = idx === selectedStepIndex
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setSelectedStepIndex(idx)}
                className={`relative rounded-card p-4 text-left transition-all ${
                  isSelected
                    ? 'border-2 border-primary bg-white shadow-card ring-2 ring-primary/10'
                    : 'border border-border bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {step.id}
                  </span>
                  <span className="text-[11px] font-medium text-ink-muted">{step.duration}</span>
                </div>
                <p className={`mt-3 text-xs font-bold ${isSelected ? 'text-primary' : 'text-ink'}`}>
                  {step.shortTitle}
                </p>
              </button>
            )
          })}
        </div>

        {/* Current Step Detailed Card */}
        <div className="mt-6 rounded-card border border-border bg-white p-6 sm:p-8 shadow-card">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Stage {currentStep.id} of 4</span>
              </div>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                {currentStep.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                {currentStep.description}
              </p>

              <div className="mt-6 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Key Actions & Standards:
                </p>
                {currentStep.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2.5 text-xs text-ink leading-relaxed">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-border pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Typical Duration
                  </p>
                  <p className="mt-1 text-lg font-bold text-ink">{currentStep.duration}</p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Key Participants
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink-secondary">{currentStep.participants}</p>
                </div>

                <div className="rounded-lg bg-emerald-50/80 p-4 border border-emerald-200 text-emerald-900">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Quality & Ethics Safeguard
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-950">
                    {currentStep.safeguard}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <Link
                  to={appRoutes.submit}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  Submit a manuscript today
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={selectedStepIndex === 0}
                    onClick={() => setSelectedStepIndex((prev) => Math.max(0, prev - 1))}
                    className="rounded border border-border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={selectedStepIndex === STEPS.length - 1}
                    onClick={() => setSelectedStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))}
                    className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40"
                  >
                    Next Stage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
