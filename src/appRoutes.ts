export const appRoutes = {
  home: '/',
  journals: '/journals',
  journalDetail: (id: string) => `/journals/${id}`,
  articles: '/articles',
  topics: '/topics',
  fees: '/fees',
  about: '/about',
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
  },
  submit: '/submit',
  profile: {
    index: '/profile',
    submissions: '/profile/submissions',
    reviewForum: '/profile/review-forum',
    newManuscript: '/profile/new-manuscript',
  },
} as const