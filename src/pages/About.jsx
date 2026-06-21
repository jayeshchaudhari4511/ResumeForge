import { Link } from 'react-router-dom'

const team = [
  {
    name:   'Alex Rivera',
    role:   'Co-Founder & CEO',
    avatar: 'AR',
    color:  'from-blue-500 to-indigo-600',
    bio:    'Former recruiting lead at Google. Passionate about democratizing career tools.',
  },
  {
    name:   'Sam Chen',
    role:   'Head of Product',
    avatar: 'SC',
    color:  'from-purple-500 to-pink-500',
    bio:    'Previously shipped 0-to-1 products at Stripe and Figma.',
  },
  {
    name:   'Jordan Lee',
    role:   'Lead Engineer',
    avatar: 'JL',
    color:  'from-emerald-500 to-teal-600',
    bio:    'Full-stack engineer obsessed with performance and beautiful UX.',
  },
]

const values = [
  { emoji: '🎯', title: 'Clarity',      desc: 'We strip away complexity so you can focus on what matters — your career.' },
  { emoji: '⚡', title: 'Speed',        desc: 'Your resume should be ready in minutes, not hours. We engineered that.' },
  { emoji: '🔒', title: 'Privacy',      desc: 'Your data never leaves your browser. No account. No tracking.' },
  { emoji: '🌍', title: 'Accessibility', desc: 'Career tools should be free and accessible to everyone, everywhere.' },
]

export default function About() {
  return (
    <div className="relative overflow-hidden pt-24 pb-16">
      {/* Background orbs */}
      <div className="orb w-80 h-80 bg-indigo-600 top-0 right-0"/>
      <div className="orb w-64 h-64 bg-purple-500 bottom-40 -left-10"/>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* ─── Hero ─── */}
        <section className="text-center animate-slide-up">
          <span className="tag mb-4 inline-block">Our Story</span>
          <h1 className="text-5xl font-extrabold text-white mb-5 leading-tight">
            Built by Recruiters,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              For Job Seekers
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We've been on both sides of the hiring table. We know exactly what makes a resume stand out —
            and we built ResumeForge to give every candidate that edge.
          </p>
        </section>

        {/* ─── Mission ─── */}
        <section className="grid md:grid-cols-2 gap-10 items-center animate-fade-in">
          <div className="space-y-5">
            <h2 className="section-heading text-3xl">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed">
              ResumeForge was born from a simple frustration: great candidates were losing opportunities
              not because of lack of skill, but because of a poorly formatted resume.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We believe everyone deserves a professional-grade resume. That's why ResumeForge is, and
              always will be, completely free — no hidden fees, no required sign-ups.
            </p>
            <Link id="about-cta" to="/builder" className="btn-primary w-fit">
              Start Building →
            </Link>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Resumes Built',    value: '50,000+', color: 'text-blue-400'   },
              { label: 'Countries Served', value: '120+',    color: 'text-purple-400' },
              { label: 'Interview Rate',   value: '95%',     color: 'text-emerald-400'},
              { label: 'User Satisfaction',value: '4.9 / 5', color: 'text-amber-400'  },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass-card p-5 hover:border-primary-500/30 transition-all duration-300">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Values ─── */}
        <section className="animate-fade-in">
          <div className="text-center mb-10">
            <h2 className="section-heading text-3xl mb-2">What We Stand For</h2>
            <p className="text-slate-500">The principles that guide every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="glass-card p-6 text-center hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Team ─── */}
        <section className="animate-fade-in">
          <div className="text-center mb-10">
            <h2 className="section-heading text-3xl mb-2">Meet the Team</h2>
            <p className="text-slate-500">The people behind the product.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {team.map(({ name, role, avatar, color, bio }) => (
              <div
                key={name}
                className="glass-card p-6 text-center hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-glow`}>
                  {avatar}
                </div>
                <h3 className="font-bold text-white">{name}</h3>
                <p className="text-xs text-primary-400 font-medium mb-3">{role}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="glass-card p-12 text-center relative overflow-hidden animate-fade-in">
          <div className="orb w-48 h-48 bg-blue-500 -top-10 -left-10"/>
          <div className="orb w-48 h-48 bg-purple-500 -bottom-10 -right-10"/>
          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Let's Build Something Great</h2>
          <p className="text-slate-400 mb-8 relative z-10">Your next career chapter starts with a great resume.</p>
          <Link id="about-bottom-cta" to="/builder" className="btn-primary text-base px-10 py-4 relative z-10">
            Create My Resume
          </Link>
        </section>
      </div>
    </div>
  )
}
