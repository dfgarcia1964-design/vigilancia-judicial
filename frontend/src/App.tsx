import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expedientes from './pages/Expedientes'
import Procesos from './pages/Procesos'
import Alertas from './pages/Alertas'
import Documentos from './pages/Documentos'
import AnalisisJuridico from './pages/AnalisisJuridico'
import { useAuthStore } from './store/authStore'

function App() {
  const { verificarAuth } = useAuthStore()

  useEffect(() => {
    verificarAuth()
  }, [verificarAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/expedientes" element={<Expedientes />} />
          <Route path="/procesos" element={<Procesos />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/analisis-juridico" element={<AnalisisJuridico />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
