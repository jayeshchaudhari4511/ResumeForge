import { Link } from 'react-router-dom'

/* ─── Feature card data ─── */
const FEATURES = [
  {
    id: 'live-preview',
    emoji: '👁️',
    title: 'Live Preview',
    desc: 'Watch your resume update in real-time as you type — zero lag, zero guessing.',
    gradient: 'from-blue-500/20 to-blue-600/5',
    border: 'hover:border-blue-500/40',
    icon_bg: 'bg-blue-500/10 text-blue-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    id: 'ats-friendly',
    emoji: '✅',
    title: 'ATS Friendly',
    desc: 'Clean layouts that pass automated screening systems used by top employers worldwide.',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    border: 'hover:border-emerald-500/40',
    icon_bg: 'bg-emerald-500/10 text-emerald-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    id: 'multiple-templates',
    emoji: '🎨',
    title: 'Multiple Templates',
    desc: 'Choose from curated, recruiter-approved templates for every industry.',
    gradient: 'from-purple-500/20 to-purple-600/5',
    border: 'hover:border-purple-500/40',
    icon_bg: 'bg-purple-500/10 text-purple-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'pdf-download',
    emoji: '📄',
    title: 'PDF Download',
    desc: 'Export a pixel-perfect PDF in one click — print-ready and recruiter-friendly.',
    gradient: 'from-rose-500/20 to-rose-600/5',
    border: 'hover:border-rose-500/40',
    icon_bg: 'bg-rose-500/10 text-rose-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  {
    id: 'responsive-design',
    emoji: '📱',
    title: 'Responsive Design',
    desc: 'Build and preview your resume perfectly on any device — phone, tablet, or desktop.',
    gradient: 'from-amber-500/20 to-amber-600/5',
    border: 'hover:border-amber-500/40',
    icon_bg: 'bg-amber-500/10 text-amber-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
]

/* ─── Floating resume skeleton (decorative) ─── */
function ResumeMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Glow halo */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/25 to-purple-500/25 blur-2xl -z-10 scale-110" />

      {/* Browser chrome */}
      <div className="glass-card overflow-hidden shadow-card">
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-600 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
            live preview
          </span>
        </div>

        {/* Paper */}
        <div className="bg-white p-6 text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
          {/* Name skeleton */}
          <div className="border-b-2 border-blue-600 pb-3 mb-4">
            <div className="h-5 w-36 bg-gray-800 rounded mb-1.5" />
            <div className="h-3 w-24 bg-blue-500 rounded mb-2.5" />
            <div className="flex flex-wrap gap-3">
              {[28, 22, 26].map((w, i) => (
                <div key={i} className="h-2 bg-gray-300 rounded" style={{ width: `${w * 3}px` }} />
              ))}
            </div>
          </div>
          {/* Summary skeleton */}
          <div className="mb-4">
            <div className="h-2 w-20 bg-blue-400/80 rounded mb-2" />
            {[90, 80, 70].map((w, i) => (
              <div key={i} className="h-1.5 bg-gray-200 rounded mb-1.5" style={{ width: `${w}%` }} />
            ))}
          </div>
          {/* Experience skeleton */}
          <div className="mb-4">
            <div className="h-2 w-20 bg-blue-400/80 rounded mb-2" />
            <div className="flex justify-between mb-1">
              <div className="h-2 w-24 bg-gray-700 rounded" />
              <div className="h-2 w-16 bg-gray-300 rounded" />
            </div>
            {[80, 65, 72].map((w, i) => (
              <div key={i} className="h-1.5 bg-gray-100 rounded mb-1" style={{ width: `${w}%` }} />
            ))}
          </div>
          {/* Skills skeleton */}
          <div>
            <div className="h-2 w-16 bg-blue-400/80 rounded mb-2" />
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Node.js', 'TypeScript', 'Python', 'Figma'].map((s) => (
                <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] rounded border border-blue-100">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-3 -right-4 glass-card px-3 py-1.5 flex items-center gap-1.5 shadow-glow animate-bounce" style={{ animationDuration: '3s' }}>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-[11px] font-semibold text-emerald-300">ATS Score 98%</span>
      </div>
      <div className="absolute -bottom-3 -left-4 glass-card px-3 py-1.5 flex items-center gap-1.5 shadow-glow-purple animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#a78bfa" stroke="none">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        <span className="text-[11px] font-semibold text-violet-300">PDF Ready</span>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background orbs */}
        <div className="orb w-[500px] h-[500px] bg-blue-700   top-0    -left-40"  />
        <div className="orb w-[400px] h-[400px] bg-purple-700 top-20    right-0"  />
        <div className="orb w-[300px] h-[300px] bg-indigo-600 bottom-0  left-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20
                        grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="animate-slide-up space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-primary-500/10 border border-primary-500/25 w-fit">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-slow" />
              <span className="text-xs font-semibold text-primary-300 tracking-wide">
                100% Free · No Sign-up Required
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.08] text-white">
              Build{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400
                                 bg-clip-text text-transparent">
                  ATS Friendly
                </span>
                {/* Underline accent */}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5
                                 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50" />
              </span>
              <br />
              Resume For Free
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-lg">
              Create professional resumes instantly and download as PDF.
              No design skills needed — just fill in your details and you're done.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                id="hero-btn-start-building"
                to="/builder"
                className="btn-primary text-base px-8 py-4 rounded-2xl shadow-glow"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Start Building
              </Link>

              <Link
                id="hero-btn-choose-template"
                to="/builder"
                className="btn-outline text-base px-8 py-4 rounded-2xl"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                Choose Template
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              {[
                { value: '50K+', label: 'Resumes created' },
                { value: '95%',  label: 'Interview rate'  },
                { value: '4.9★', label: 'User rating'     },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {value}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mockup */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ResumeMockup />
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          FEATURE CARDS
      ═══════════════════════════════════════ */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle orb */}
        <div className="orb w-96 h-96 bg-indigo-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-16 animate-slide-up">
            <span className="tag mb-4 inline-block">Why ResumeForge?</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Land the Job
              </span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Powerful tools, beautiful results — all in one free platform.
            </p>
          </div>

          {/* Cards grid — 3 on row 1, 2 centred on row 2 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ id, title, desc, gradient, border, icon_bg, icon }, idx) => (
              <div
                key={id}
                id={`feature-card-${id}`}
                className={`relative glass-card p-7 group cursor-default
                             transition-all duration-300
                             hover:-translate-y-2 hover:shadow-glow
                             ${border}
                             ${idx === 3 ? 'lg:col-start-1' : ''}
                             ${idx === 4 ? 'sm:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* Card glow overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${icon_bg} flex items-center justify-center mb-5
                                   group-hover:scale-110 transition-transform duration-200`}>
                    {icon}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          HOW IT WORKS — 3 step strip
      ═══════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Ready in{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* connector line — desktop only */}
            <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px
                            bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-transparent" />

            {[
              { step: '01', title: 'Fill the Form',     desc: 'Enter your details across Personal, Experience, Education, and Skills tabs.',            color: 'from-blue-500   to-indigo-600' },
              { step: '02', title: 'See Live Preview',  desc: 'Your professional resume updates instantly as you type — no refresh needed.',             color: 'from-violet-500 to-purple-600' },
              { step: '03', title: 'Download PDF',      desc: 'One click exports a pixel-perfect, ATS-ready PDF ready to send to any recruiter.',        color: 'from-fuchsia-500 to-pink-600' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="glass-card p-7 text-center hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-5 shadow-glow`}>
                  {step}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          FOOTER CTA — "Built for Digital Heroes"
      ═══════════════════════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="orb w-80 h-80 bg-blue-600   -top-20 -left-20"  />
        <div className="orb w-80 h-80 bg-purple-600 -bottom-20 -right-20" />

        <div className="relative z-10 max-w-3xl mx-auto glass-card p-12 sm:p-16 text-center overflow-hidden">
          {/* Inner glow orbs */}
          <div className="orb w-64 h-64 bg-blue-500   -top-16 -left-16"/>
          <div className="orb w-64 h-64 bg-purple-600 -bottom-16 -right-16"/>

          {/* Lightning icon */}
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-btn-gradient mx-auto mb-6
                          flex items-center justify-center shadow-glow">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>

          <h2 className="relative z-10 text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Built for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Digital Heroes
            </span>
          </h2>
          <p className="relative z-10 text-slate-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Join thousands of ambitious professionals who built their careers with ResumeForge — and never looked back.
          </p>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              id="footer-cta-start-building"
              to="/builder"
              className="btn-primary text-base px-10 py-4 rounded-2xl"
            >
              Start Building Free →
            </Link>

            <a
              id="footer-cta-digital-heroes"
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-base px-8 py-4 rounded-2xl"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Visit Digital Heroes
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
