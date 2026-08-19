import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { appRoutes } from './appRoutes'
import { Landing } from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={appRoutes.home} element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App