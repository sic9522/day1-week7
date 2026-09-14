import { formatCurrency } from '../utils/format'

function CategoryBars({ data }) {
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div className="category-bars" role="img" aria-label="Spese per categoria questo mese">
      {data.map((d) => (
        <div className="category-bar-row" key={d.label}>
          <div className="category-bar-head">
            <span>
              <span className="category-dot" style={{ background: d.color }} />
              {d.label}
            </span>
            <span className="category-bar-value">{formatCurrency(d.value)}</span>
          </div>
          <div className="category-bar-track">
            <div
              className="category-bar-fill"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategoryBars
