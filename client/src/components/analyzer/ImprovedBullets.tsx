import { useState } from 'react'

interface ImprovedBulletsProps {
  bullets: string[]
}

/**
 * Displays AI-improved experience bullet points with individual copy buttons.
 */
export default function ImprovedBullets({ bullets }: ImprovedBulletsProps) {
  if (bullets.length === 0) return null

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4" role="region" aria-label="Improved bullet points">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25
                        flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            AI-Improved Bullet Points
          </h3>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Stronger action verbs and better keyword alignment — based on your actual experience.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {bullets.map((bullet, i) => (
          <BulletItem key={i} bullet={bullet} index={i} />
        ))}
      </ul>

      {/* Copy all */}
      <CopyAllButton bullets={bullets} />
    </div>
  )
}

function BulletItem({ bullet, index }: { bullet: string; index: number }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bullet)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = bullet
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <li className="group flex items-start gap-3 p-3 rounded-xl
                   bg-violet-500/5 border border-violet-500/10
                   hover:border-violet-500/25 transition-all duration-200">
      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-violet-500/20
                       flex items-center justify-center text-[10px] font-bold text-violet-400">
        {index + 1}
      </span>
      <p className="flex-1 text-sm text-slate-200 leading-relaxed">{bullet}</p>
      <button
        onClick={handleCopy}
        aria-label={`Copy bullet point ${index + 1}`}
        className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
                   text-slate-500 hover:text-violet-400 hover:bg-violet-500/10
                   transition-all duration-200 cursor-pointer"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        )}
      </button>
    </li>
  )
}

function CopyAllButton({ bullets }: { bullets: string[] }) {
  const [copied, setCopied] = useState(false)

  const handleCopyAll = async () => {
    const text = bullets.map((b, i) => `• ${b}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopyAll}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                 text-slate-400 bg-white/5 border border-white/10
                 hover:text-white hover:bg-white/10 hover:border-white/20
                 transition-all duration-200 cursor-pointer"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copied all!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy all bullet points
        </>
      )}
    </button>
  )
}
