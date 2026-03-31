'use client'

type Props = {
  percentage: number
}

// simple SVG donut
export default function DonutChart({ percentage }: Props) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const clampedPct = Math.min(Math.max(percentage, 0), 100)
  const filled = (clampedPct / 100) * circumference
  const empty = circumference - filled

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* background ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
        />
        {/* filled arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="14"
          strokeDasharray={`${filled} ${empty}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-base font-bold fill-slate-800"
          fontSize="16"
          fontWeight="700"
          fill="#1e293b"
        >
          {clampedPct}%
        </text>
      </svg>
      <p className="text-xs text-slate-500 text-center">
        Your midpoint covers<br />
        <span className="font-semibold text-slate-700">
          {clampedPct}% of typical month
        </span>
      </p>
    </div>
  )
}