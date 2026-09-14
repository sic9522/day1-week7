import { formatAmount, formatCurrency } from '../utils/format'
import BankLayout from '../components/BankLayout'
import BalanceChart from '../components/BalanceChart'
import CategoryBars from '../components/CategoryBars'

const PAST_MONTHS = [
  { label: 'Apr', value: 1600 },
  { label: 'Mag', value: 1820 },
  { label: 'Giu', value: 1740 },
  { label: 'Lug', value: 2005 },
  { label: 'Ago', value: 1950 },
]

const CATEGORY_SPENDING = [
  { label: 'Casa & Bollette', value: 620, color: '#8b5cf6' },
  { label: 'Spesa & Supermercato', value: 410, color: '#0e9aa8' },
  { label: 'Trasporti', value: 180, color: '#b8730a' },
  { label: 'Svago', value: 240, color: '#c2478a' },
]

const FAKE_TRANSACTIONS = [
  { id: 1, label: 'Stipendio', amount: 1800, positive: true },
  { id: 2, label: 'Supermercato', amount: -64.3, positive: false },
  { id: 3, label: 'Bolletta luce', amount: -48.9, positive: false },
  { id: 4, label: 'Abbonamento palestra', amount: -35, positive: false },
]

const FAKE_NEWS = [
  {
    title: 'SicBank lancia i pagamenti istantanei tra conti',
    source: 'SicBank News',
    time: '2 giorni fa',
  },
  {
    title: 'Mutui e risparmi: cosa cambia con i nuovi tassi',
    source: 'Mercati',
    time: '4 giorni fa',
  },
  {
    title: 'Cinque consigli per risparmiare senza rinunciare a nulla',
    source: 'Educazione finanziaria',
    time: '1 settimana fa',
  },
  {
    title: 'Nuova carta SicBank Plus: cashback fino al 2%',
    source: 'Prodotti',
    time: '1 settimana fa',
  },
]

function NewsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="7" y1="16" x2="13" y2="16" />
    </svg>
  )
}

function Bank() {
  return (
    <BankLayout title="Dashboard" subtitle={(user) => `Bentornato/a, ${user.nome} ${user.cognome}`}>
      {(user) => {
        const balanceHistory = [...PAST_MONTHS, { label: 'Ora', value: user.balance }]

        return (
          <div className="bank-content">
            <div className="bank-content-main">
              <div className="stat-cards">
                <div className="bank-card stat-card">
                  <div className="stat-label">Saldo disponibile</div>
                  <div className="balance-amount">{formatCurrency(user.balance)}</div>
                </div>
                <div className="bank-card stat-card">
                  <div className="stat-label">Entrate (mese)</div>
                  <div className="stat-value positive">+{formatAmount(1800)} €</div>
                </div>
                <div className="bank-card stat-card">
                  <div className="stat-label">Uscite (mese)</div>
                  <div className="stat-value negative">-{formatAmount(148.2)} €</div>
                </div>
              </div>

              <div className="bank-card">
                <h2 className="section-title">Andamento saldo</h2>
                <BalanceChart data={balanceHistory} />
              </div>

              <div className="bank-card">
                <h2 className="section-title">Spese per categoria</h2>
                <CategoryBars data={CATEGORY_SPENDING} />
              </div>

              <div className="bank-card">
                <h2 className="section-title">Ultimi movimenti</h2>
                {FAKE_TRANSACTIONS.map((t) => (
                  <div className="transaction-row" key={t.id}>
                    <span>{t.label}</span>
                    <span className={`transaction-amount ${t.positive ? 'positive' : 'negative'}`}>
                      {t.positive ? '+' : '-'}
                      {formatAmount(t.amount)} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="bank-content-side">
              <div className="bank-card">
                <h2 className="section-title">Il tuo conto</h2>
                <div className="account-info-row">
                  <span>Intestatario</span>
                  <span>
                    {user.nome} {user.cognome}
                  </span>
                </div>
                <div className="account-info-row">
                  <span>Stato</span>
                  <span className="badge-verified">Verificato</span>
                </div>
              </div>

              <div className="bank-card">
                <h2 className="section-title">
                  <NewsIcon /> Notizie
                </h2>
                <div className="news-list">
                  {FAKE_NEWS.map((n) => (
                    <article className="news-item" key={n.title}>
                      <p className="news-title">{n.title}</p>
                      <p className="news-meta">
                        {n.source} · {n.time}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )
      }}
    </BankLayout>
  )
}

export default Bank
