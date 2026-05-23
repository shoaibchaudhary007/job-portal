import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import BackToTop from './components/BackToTop.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="relative">
        <AppRoutes />
      </main>
      <Footer />
      <BackToTop />
      <Toaster position="top-right" />
    </div>
  )
}

export default App
