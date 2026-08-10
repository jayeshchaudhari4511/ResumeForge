import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Home = lazy(() => import('./pages/Home'))
const Builder = lazy(() => import('./pages/Builder'))
const About = lazy(() => import('./pages/About'))
const Analyzer = lazy(() => import('./pages/Analyzer'))

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

