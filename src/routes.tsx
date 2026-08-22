import { useRoutes } from 'react-router-dom'
import { appRoutes } from './appRoutes'
import { Landing } from './pages/Landing'
import { JournalsPage } from './pages/JournalsPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { TopicsPage } from './pages/TopicsPage'
import { SubmitPage } from './pages/SubmitPage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function AppRoutes() {
  return useRoutes([
    { path: appRoutes.home, element: <Landing /> },
    { path: appRoutes.journals, element: <JournalsPage /> },
    { path: appRoutes.articles, element: <ArticlesPage /> },
    { path: appRoutes.topics, element: <TopicsPage /> },
    { path: appRoutes.submit, element: <SubmitPage /> },
    { path: appRoutes.about, element: <AboutPage /> },
    { path: '*', element: <NotFoundPage /> },
  ])
}