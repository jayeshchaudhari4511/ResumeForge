/* ─────────────────────────────────────────────────────────────
   Footer.jsx
   Always-visible site footer with maker credit, email contact,
   and the "Built for Digital Heroes" CTA button.
───────────────────────────────────────────────────────────── */

const DIGITAL_HEROES_URL = 'https://digitalheroesco.com'
const MAKER_EMAIL        = 'jayesh6056@gmail.com'
const MAKER_NAME         = 'Jayesh Chaudhari'
const CURRENT_YEAR       = new Date().getFullYear()

/* ── Small social / contact icon link ── */
function IconLink({ href, title, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10
                 flex items-center justify-center text-slate-500
                 hover:text-white hover:bg-white/10 hover:border-white/20
                 transition-all duration-200"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-[#0a0f1e]/80 backdrop-blur-xl">

      {/* Subtle top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
                       from-transparent via-primary-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main footer row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between
                         gap-4 py-5">

          {/* LEFT — Brand + maker credit */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">

            {/* Logo mark */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-500/20 border border-primary-500/30
                               flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-white tracking-tight">ResumeForge</span>
            </div>

            {/* Divider dot (hidden on mobile) */}
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/20" />

            {/* Maker credit */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-rose-400/80">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                         a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                         1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>Made by</span>
              <span className="font-semibold text-slate-300">{MAKER_NAME}</span>
            </div>
          </div>

          {/* CENTER — "Built for Digital Heroes" CTA */}
          <a
            id="footer-digital-heroes-btn"
            href={DIGITAL_HEROES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl
                       border border-primary-500/30 bg-primary-500/10
                       text-sm font-semibold text-primary-300
                       hover:bg-primary-500/20 hover:border-primary-400/60
                       hover:text-white hover:shadow-glow
                       active:scale-95
                       transition-all duration-200"
          >
            {/* Lightning bolt icon */}
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
              className="text-primary-400 group-hover:text-yellow-300
                         transition-colors duration-200"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>

            Built for Digital Heroes

            {/* External link arrow */}
            <svg
              width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="text-primary-500 group-hover:text-primary-300
                         group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                         transition-all duration-200"
            >
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>

          {/* RIGHT — Email + icon links */}
          <div className="flex items-center gap-3">

            {/* Email link */}
            <a
              id="footer-email-link"
              href={`mailto:${MAKER_EMAIL}`}
              className="flex items-center gap-1.5 text-xs text-slate-500
                         hover:text-primary-400 transition-colors duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4
                         c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span className="hidden sm:inline">{MAKER_EMAIL}</span>
              <span className="sm:hidden">Email</span>
            </a>

            {/* GitHub icon link */}
            <IconLink
              href="https://github.com"
              title="GitHub"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18
                         6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868
                         -.013-1.703-2.782.605-3.369-1.343-3.369-1.343
                         -.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608
                         .069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53
                         2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338
                         -2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988
                         1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27
                         2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115
                         2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379
                         .202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848
                         -2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0
                         1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482
                         A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </IconLink>

            {/* LinkedIn icon link */}
            <IconLink
              href="https://linkedin.com"
              title="LinkedIn"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4
                         v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </IconLink>
          </div>
        </div>

        {/* ── Bottom copyright strip ── */}
        <div className="border-t border-white/5 py-3 flex flex-col sm:flex-row
                         items-center justify-between gap-2">
          <p className="text-[11px] text-slate-600">
            © {CURRENT_YEAR} ResumeForge · All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
              ATS Friendly Builder
            </span>
            <span>·</span>
            <span>Free Forever</span>
            <span>·</span>
            <span>No Sign-up Required</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
