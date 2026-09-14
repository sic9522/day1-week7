import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BankLayout from '../components/BankLayout'

function Impostazioni() {
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(false)
  const [notifyPromo, setNotifyPromo] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <BankLayout title="Impostazioni" subtitle="Gestisci il tuo profilo e le preferenze">
      {(user) => (
        <div className="bank-content page-container">
          <div className="page-header">
            <div>
              <h2 className="page-header-title">Impostazioni</h2>
              <p className="page-header-sub">Profilo, sicurezza e preferenze del tuo account.</p>
            </div>
          </div>

          <div className="bank-card mb-4">
            <h2 className="section-title">Profilo</h2>
            <div className="account-info-row">
              <span>Nome</span>
              <span>{user.nome}</span>
            </div>
            <div className="account-info-row">
              <span>Cognome</span>
              <span>{user.cognome}</span>
            </div>
            <div className="account-info-row">
              <span>Username</span>
              <span>{user.username}</span>
            </div>
            <div className="account-info-row">
              <span>Email</span>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="bank-card mb-4">
            <h2 className="section-title">Sicurezza</h2>
            <p className="empty-state mb-3">
              Puoi reimpostare la password in qualsiasi momento dalla pagina di accesso.
            </p>
            <Button as={Link} to="/" variant="outline-secondary" className="btn-cancel">
              Cambia password
            </Button>
          </div>

          <Form onSubmit={handleSave}>
            <div className="bank-card mb-4">
              <h2 className="section-title">Notifiche</h2>
              <label className="settings-row">
                <span>
                  <span className="settings-row-title">Notifiche via email</span>
                  <span className="settings-row-desc">Movimenti, bonifici e avvisi di sicurezza.</span>
                </span>
                <span className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                  />
                  <span className="toggle-switch-track" />
                </span>
              </label>
              <label className="settings-row">
                <span>
                  <span className="settings-row-title">Notifiche SMS</span>
                  <span className="settings-row-desc">Codici di conferma via messaggio.</span>
                </span>
                <span className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifySms}
                    onChange={(e) => setNotifySms(e.target.checked)}
                  />
                  <span className="toggle-switch-track" />
                </span>
              </label>
              <label className="settings-row">
                <span>
                  <span className="settings-row-title">Offerte promozionali</span>
                  <span className="settings-row-desc">Novità su prodotti e carte SicBank.</span>
                </span>
                <span className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifyPromo}
                    onChange={(e) => setNotifyPromo(e.target.checked)}
                  />
                  <span className="toggle-switch-track" />
                </span>
              </label>
            </div>

            <div className="bank-card mb-4">
              <h2 className="section-title">Preferenze</h2>
              <div className="settings-row">
                <span className="settings-row-title">Lingua</span>
                <Form.Select className="settings-select" defaultValue="it">
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                </Form.Select>
              </div>
              <div className="settings-row">
                <span className="settings-row-title">Valuta</span>
                <Form.Select className="settings-select" defaultValue="eur">
                  <option value="eur">Euro (€)</option>
                  <option value="usd">Dollaro USA ($)</option>
                </Form.Select>
              </div>
            </div>

            <Button type="submit" className="btn-primary">
              {saved ? 'Preferenze salvate ✓' : 'Salva preferenze'}
            </Button>
          </Form>
        </div>
      )}
    </BankLayout>
  )
}

export default Impostazioni
