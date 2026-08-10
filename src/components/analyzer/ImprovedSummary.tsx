interface ImprovedSummaryProps {
  improvedSummary: string
}

/**
 * Displays the AI-improved professional summary in a distinct card.
 */
export default function ImprovedSummary({ improvedSummary }: ImprovedSummaryProps) {
  if (!improvedSummary) return null

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4" role="region" aria-label="Improved professional summary">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25
                        flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            AI-Improved Professional Summary
          </h3>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Tailored to the target job — uses only information from your resume.
          </p>
        </div>
      </div>

      <div className="relative">
        {/* AI badge */}
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-bold
                        bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
          AI Generated
        </div>

        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {improvedSummary}
          </p>
        </div>
      </div>

      {/* Copy button */}
      <CopyButton text={improvedSummary} label="Copy summary" />
    </div>
  )
}

/** Reusable copy-to-clipboard button */
function CopyButton({ text, label }: { text: string; label: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      const btn = document.activeElement as HTMLButtonElement | null
      if (btn) {
        const original = btn.textContent
        btn.textContent = '✓ Copied!'
        setTimeout(() => { btn.textContent = original }, 2000)
      }
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={label}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                 text-slate-400 bg-white/5 border border-white/10
                 hover:text-white hover:bg-white/10 hover:border-white/20
                 transition-all duration-200 cursor-pointer"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      Copy to clipboard
    </button>
  )
}
