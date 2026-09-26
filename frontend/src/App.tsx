import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Expedientes from './pages/Expedientes'
import Procesos from './pages/Procesos'
import Alertas from './pages/Alertas'
import Documentos from './pages/Documentos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expedientes" element={<Expedientes />} />
          <Route path="/procesos" element={<Procesos />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/documentos" element={<Documentos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
