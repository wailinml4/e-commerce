import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="pt-24 md:pt-32">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
