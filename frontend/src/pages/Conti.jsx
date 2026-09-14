import BankLayout from '../components/BankLayout'
import { formatCurrency } from '../utils/format'

const FAKE_ACCOUNTS = [
  {
    key: 'deposito',
    name: 'Conto Deposito',
    description: 'Vincolato 12 mesi · tasso 2,5%',
    iban: 'IT60X0542811101000000123456',
    balance: 5000,
  },
  {
    key: 'risparmio',
    name: 'Conto Risparmio',
    description: 'Libero, nessun vincolo',
    iban: 'IT28W0300203280000000654321',
    balance: 320.5,
  },
]

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12h-4a2 2 0 0 0 0 4h4v-4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Conti() {
  return (
    <BankLayout title="Conti" subtitle="Panoramica dei tuoi prodotti SicBank">
      {(user) => (
        <div className="bank-content page-container">
          <div className="page-header">
            <div>
              <h2 className="page-header-title">I tuoi conti</h2>
              <p className="page-header-sub">Tutti i conti collegati al tuo profilo SicBank.</p>
            </div>
          </div>

          <div className="account-list">
            <div className="bank-card account-card">
              <div className="account-card-icon">
                <WalletIcon />
              </div>
              <div className="account-card-body">
                <div className="account-card-top">
                  <span className="account-card-name">Conto Corrente</span>
                  <span className="account-badge">Principale</span>
                </div>
                <div className="account-card-desc">
                  Intestato a {user.nome} {user.cognome}
                </div>
                <div className="transfer-counterpart">{user.iban}</div>
              </div>
              <div className="account-card-balance">{formatCurrency(user.balance)}</div>
            </div>

            {FAKE_ACCOUNTS.map((acc) => (
              <div className="bank-card account-card" key={acc.key}>
                <div className="account-card-icon">
                  <WalletIcon />
                </div>
                <div className="account-card-body">
                  <div className="account-card-top">
                    <span className="account-card-name">{acc.name}</span>
                  </div>
                  <div className="account-card-desc">{acc.description}</div>
                  <div className="transfer-counterpart">{acc.iban}</div>
                </div>
                <div className="account-card-balance">{formatCurrency(acc.balance)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </BankLayout>
  )
}

export default Conti
