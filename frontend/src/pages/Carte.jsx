import BankLayout from '../components/BankLayout'
import { formatAmount } from '../utils/format'

const FAKE_CARDS = [
  {
    key: 'debit',
    type: 'Debito',
    brand: 'SicBank Debit',
    last4: '4821',
    expiry: '09/28',
    variant: 'gold',
  },
  {
    key: 'credit',
    type: 'Credito',
    brand: 'SicBank Plus',
    last4: '1937',
    expiry: '03/27',
    variant: 'violet',
  },
]

const FAKE_LIMITS = [
  { label: 'Spesa mensile', used: 640, max: 2000 },
  { label: 'Prelievo giornaliero', used: 100, max: 500 },
]

const FAKE_CARD_ACTIVITY = [
  { id: 1, label: 'Supermercato Esselunga', amount: -32.4 },
  { id: 2, label: 'Netflix', amount: -12.99 },
  { id: 3, label: 'Amazon', amount: -54.9 },
]

function ChipIcon() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="26" height="20" rx="3" />
      <line x1="1" y1="7" x2="27" y2="7" />
      <line x1="1" y1="15" x2="27" y2="15" />
      <line x1="9" y1="1" x2="9" y2="21" />
      <line x1="19" y1="1" x2="19" y2="21" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function Carte() {
  return (
    <BankLayout title="Carte" subtitle="Gestisci le carte collegate al tuo conto">
      {(user) => (
        <div className="bank-content page-container">
          <div className="page-header">
            <div>
              <h2 className="page-header-title">Le tue carte</h2>
              <p className="page-header-sub">Blocca, monitora e gestisci i limiti delle tue carte.</p>
            </div>
          </div>

          <div className="cards-grid">
            {FAKE_CARDS.map((card) => (
              <div className={`card-mockup card-mockup--${card.variant}`} key={card.key}>
                <div className="card-mockup-top">
                  <span className="card-mockup-brand">SicBank</span>
                  <span className="card-mockup-type">{card.type}</span>
                </div>
                <ChipIcon />
                <div className="card-mockup-number">•••• •••• •••• {card.last4}</div>
                <div className="card-mockup-bottom">
                  <div>
                    <div className="card-mockup-label">Titolare</div>
                    <div className="card-mockup-value">
                      {user.nome} {user.cognome}
                    </div>
                  </div>
                  <div>
                    <div className="card-mockup-label">Scadenza</div>
                    <div className="card-mockup-value">{card.expiry}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bank-card mt-4">
            <h2 className="section-title">
              <LockIcon /> Limiti di spesa
            </h2>
            <div className="category-bars">
              {FAKE_LIMITS.map((l) => (
                <div className="category-bar-row" key={l.label}>
                  <div className="category-bar-head">
                    <span>{l.label}</span>
                    <span className="category-bar-value">
                      {formatAmount(l.used)} € / {formatAmount(l.max)} €
                    </span>
                  </div>
                  <div className="category-bar-track">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${(l.used / l.max) * 100}%`, background: 'var(--color-primary)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bank-card mt-4">
            <h2 className="section-title">Ultimi utilizzi</h2>
            {FAKE_CARD_ACTIVITY.map((t) => (
              <div className="transaction-row" key={t.id}>
                <span>{t.label}</span>
                <span className="transaction-amount negative">{formatAmount(t.amount)} €</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </BankLayout>
  )
}

export default Carte
