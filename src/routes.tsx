import { useRoutes } from 'react-router-dom'
import { appRoutes } from './appRoutes'
import { Landing } from './pages/Landing'
import { JournalsPage } from './pages/JournalsPage'

export function AppRoutes() {
  return useRoutes([
    { path: appRoutes.home, element: <Landing /> },
    { path: appRoutes.journals, element: <JournalsPage /> },
  ])
}