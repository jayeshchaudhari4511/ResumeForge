import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  /* Scroll listener → frosted glass effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Close mobile menu on route change */
  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/builder', label: 'Builder' },
    { to: '/analyzer', label: 'AI Analyzer', isNew: true },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    { to: '/about', label: 'About' },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/10 shadow-card'
          : 'bg-transparent'
        }`}
    >
      {/* ── Main bar ── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link
          id="nav-logo"
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-btn-gradient flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-200">
            {/* Document icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ResumeForge
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, isNew }) => (
            <li key={to}>
              <NavLink
                id={`nav-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <span>{label}</span>
                {isNew && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                    AI
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Desktop Auth CTA + Hamburger ── */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs text-slate-300 hover:text-white"
              >
                <div className="w-5 h-5 rounded-full bg-btn-gradient flex items-center justify-center text-[10px] text-white font-bold uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="font-medium max-w-[100px] truncate">{user?.name || 'Account'}</span>
              </Link>
              <button
                id="nav-logout-btn"
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                id="nav-signin-link"
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                id="nav-signup-link"
                to="/register"
                className="btn-primary text-xs px-3.5 py-1.5 shadow-glow font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Hamburger / Close toggle */}
          <button
            id="nav-mobile-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="bg-dark-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-4 space-y-1">
          {navLinks.map(({ to, label, isNew }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${isActive
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span>{label}</span>
              {isNew && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                  AI
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-white/10 mt-2 space-y-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-300 font-medium">Signed in as {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center py-2 text-sm text-slate-300 font-semibold bg-white/5 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full text-center py-2 text-sm btn-primary rounded-lg font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
