import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ReportPage from './pages/ReportPage'
import ScenarioPage from './pages/ScenarioPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports/:reportId" element={<ReportPage />} />
        <Route path="/scenarios/:scenarioId" element={<ScenarioPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


