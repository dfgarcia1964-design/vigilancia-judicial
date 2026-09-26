import { Outlet, Link } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
