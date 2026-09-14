import { useId, useState } from 'react'
import { formatCurrency } from '../utils/format'

const WIDTH = 600
const HEIGHT = 220
const PAD_X = 8
const PAD_TOP = 20
const PAD_BOTTOM = 32

function BalanceChart({ data }) {
  const gradientId = useId()
  const [active, setActive] = useState(null)

  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const plotW = WIDTH - PAD_X * 2
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM

  const points = data.map((d, i) => ({
    ...d,
    x: PAD_X + (i / (data.length - 1)) * plotW,
    y: PAD_TOP + plotH - ((d.value - min) / span) * plotH,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${PAD_TOP + plotH} L${points[0].x},${PAD_TOP + plotH} Z`

  const activePoint = active !== null ? points[active] : null

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Andamento del saldo: da ${formatCurrency(data[0].value)} a ${formatCurrency(data[data.length - 1].value)}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={PAD_X}
          x2={WIDTH - PAD_X}
          y1={PAD_TOP + plotH * t}
          y2={PAD_TOP + plotH * t}
          className="chart-gridline"
        />
      ))}

      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />

      {points.map((p, i) => (
        <g
          key={p.label}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
          tabIndex={0}
          role="button"
          aria-label={`${p.label}: ${formatCurrency(p.value)}`}
        >
          <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
          <circle
            cx={p.x}
            cy={p.y}
            r={active === i ? 5 : 3.5}
            fill="var(--color-card)"
            stroke="var(--color-primary)"
            strokeWidth="2"
          />
          <text x={p.x} y={HEIGHT - 10} textAnchor="middle" className="chart-axis-label">
            {p.label}
          </text>
        </g>
      ))}

      {activePoint && (
        <g transform={`translate(${Math.min(Math.max(activePoint.x, 55), WIDTH - 55)}, ${Math.max(activePoint.y - 34, 14)})`}>
          <rect x="-46" y="-16" width="92" height="24" rx="6" className="chart-tooltip-bg" />
          <text textAnchor="middle" y="1" className="chart-tooltip-text">
            {formatCurrency(activePoint.value)}
          </text>
        </g>
      )}
    </svg>
  )
}

export default BalanceChart
