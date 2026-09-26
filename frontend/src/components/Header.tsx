import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Header() {
  const navigate = useNavigate()
  const { usuario, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            VIJIdfgarcia
          </h1>
          <p className="text-sm text-gray-500">Vigilancia Judicial y Administrativa - Colombia</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {usuario?.nombre} {usuario?.apellido}
            </p>
            <p className="text-xs text-gray-500">{usuario?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}
