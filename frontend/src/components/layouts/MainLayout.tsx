import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Footer from '../shared/Footer'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-app-bg text-slate-900 relative">
      <div className="fixed inset-0 bg-mesh-light pointer-events-none z-0" />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-24 md:pt-32">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
