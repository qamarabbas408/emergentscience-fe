import { appRoutes } from './appRoutes'

export const appName = 'EmergentSci'

export const siteMeta = {
  tagline: 'Where scientists empower society',
  subtitle:
    'Creating solutions for healthy lives on a healthy planet through open, rigorously peer-reviewed research.',
  publisherLocation: 'Basel, Switzerland',
}

export const navLinks = [
  { label: 'All Journals', href: appRoutes.journals },
  { label: 'Articles', href: appRoutes.articles },
  { label: 'Research Topics', href: appRoutes.topics, tag: 'Explore' },
  { label: 'Fees & Policies', href: appRoutes.fees },
  { label: 'About', href: appRoutes.about },
]

export const authorMenu = [
  { label: 'Submit a Manuscript', href: appRoutes.submit },
  { label: 'Publishing Fees & APC', href: appRoutes.fees },
  { label: 'Collaborative Peer Review', href: appRoutes.articles },
]

export const utilityLinks = [
  { label: 'Institutional Partnerships', href: '#' },
  { label: 'Publishing Integrity & COPE', href: '#' },
]

export const profileMenu = [
  { label: 'Submit New Manuscript', href: appRoutes.profile.newManuscript },
  { label: 'My Submissions', href: appRoutes.profile.submissions },
  { label: 'Peer Review Forum', href: appRoutes.profile.reviewForum },
]

export const stats = [
  { value: '3.9M', label: 'researchers worldwide' },
  { value: '16M', label: 'citations received' },
  { value: '5.3B', label: 'article views' },
]

export const audiences = ['Authors', 'Editors & reviewers', 'Collaborators']

export const features = [
  { title: 'Find a journal', desc: 'Browse 100+ journals across every field of science.' },
  { title: 'Submit your research', desc: 'A guided, fast submission flow with transparent status.' },
  { title: 'Peer review', desc: 'Collaborative, interactive review with named reviewers.' },
  { title: 'Find a topic', desc: 'Discover cross-journal topics and permanent collections.' },
  { title: 'Resources for authors', desc: 'Publishing guides, style help and open-access advice.' },
  { title: 'Press office', desc: 'Highlights of the latest research for journalists.' },
]

export const authBenefits = [
  {
    icon: 'emerald',
    title: 'ORCID Auto-Attribution',
    desc: 'Syncs papers to Loop/ORCID',
  },
  {
    icon: 'blue',
    title: 'Interactive Review Forum',
    desc: 'Direct author–editor chat',
  },
  {
    icon: 'purple',
    title: 'Institutional APC Coverage',
    desc: 'Auto-waiver validation',
  },
]

export const ssoUniversities = ['ETH Zürich', 'EPFL', 'Harvard', 'MIT', 'Oxford', 'Cambridge']

export const demoPersonas = [
  { role: 'Author', affiliation: 'EPFL' },
  { role: 'Reviewer', affiliation: 'Cambridge' },
  { role: 'Editor', affiliation: 'Tokyo Tech' },
]

export const journalQuickSelect = [
  'All Journals',
  'Life Sciences',
  'Digital Medicine',
  'Physics & Chemistry',
]