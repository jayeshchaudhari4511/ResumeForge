import { useEffect, useState } from 'react'

interface ScoreRingProps {
  score: number
  size?: number
  stroke?: number
}

/**
 * Animated circular SVG score ring with color-coded levels.
 * Accessible via role="meter" and aria attributes.
 */
export default function ScoreRing({ score, size = 180, stroke = 14 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    // Animate score from 0 to target value
    const duration = 1200
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const filled = circumference * (animatedScore / 100)

  const getColor = (s: number) => {
    if (s >= 75) return { main: '#34d399', glow: 'rgba(52, 211, 153, 0.3)' }
    if (s >= 50) return { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.3)' }
    if (s >= 25) return { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)' }
    return { main: '#f87171', glow: 'rgba(248, 113, 113, 0.3)' }
  }

  const getLabel = (s: number) => {
    if (s >= 75) return 'Excellent Match'
    if (s >= 50) return 'Good Match'
    if (s >= 25) return 'Partial Match'
    return 'Low Match'
  }

  const color = getColor(score)
  const label = getLabel(score)
  const gradId = `score-ring-grad-${score}`

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Match score: ${score}%. ${label}`}
        style={{ filter: `drop-shadow(0 0 12px ${color.glow})` }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.main} stopOpacity="1" />
            <stop offset="100%" stopColor={color.main} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />

        {/* Score number */}
        <text
          x={size / 2} y={size / 2 - 10}
          textAnchor="middle" dominantBaseline="middle"
          fill={color.main}
          fontSize="32" fontWeight="800" fontFamily="Inter, sans-serif"
        >
          {animatedScore}%
        </text>

        {/* Label */}
        <text
          x={size / 2} y={size / 2 + 18}
          textAnchor="middle" dominantBaseline="middle"
          fill="rgba(148,163,184,0.8)"
          fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif"
          letterSpacing="1.5"
        >
          ATS MATCH
        </text>
      </svg>

      <span
        className="text-sm font-bold"
        style={{ color: color.main }}
        aria-live="polite"
      >
        {label} {score >= 75 ? '🎉' : score >= 50 ? '👍' : score >= 25 ? '⚠️' : '❌'}
      </span>
    </div>
  )
}
