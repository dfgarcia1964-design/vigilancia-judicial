import { Link } from 'react-router-dom'

export default function Sidebar() {
  const menuItems = [
    { path: '/', label: '📊 Dashboard', icon: 'chart' },
    { path: '/expedientes', label: '📋 Expedientes', icon: 'file' },
    { path: '/procesos', label: '⚖️ Procesos', icon: 'law' },
    { path: '/alertas', label: '🔔 Alertas', icon: 'bell' },
    { path: '/documentos', label: '📄 Documentos', icon: 'document' },
    { path: '/analisis-juridico', label: '⚖️ Análisis Jurídico', icon: 'analysis' },
  ]

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-primary">⚖️ VIJIdfgarcia</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
