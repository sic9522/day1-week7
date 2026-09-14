import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { login, forgotPassword, resetPassword, getMe } from '../services/authApi'
import PasswordField from '../components/PasswordField'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showForgot, setShowForgot] = useState(false)
  const [forgotStep, setForgotStep] = useState('email') // email | reset | done
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotCode, setForgotCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await login(username, password)
      if (data?.token) localStorage.setItem('token', data.token)
      const { data: me } = await getMe()
      localStorage.setItem('user', JSON.stringify({ id: me.id, nome: me.nome, cognome: me.cognome }))
      navigate('/banca')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenziali non valide. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  const openForgot = () => {
    setForgotStep('email')
    setForgotEmail('')
    setForgotCode('')
    setNewPassword('')
    setConfirmNewPassword('')
    setForgotError('')
    setResendMsg('')
    setShowForgot(true)
  }

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)
    try {
      await forgotPassword(forgotEmail)
      setForgotStep('reset')
    } catch (err) {
      setForgotError(err.response?.data?.message || "Impossibile inviare l'email. Riprova più tardi.")
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendMsg('')
    try {
      await forgotPassword(forgotEmail)
      setResendMsg('Codice inviato di nuovo. Controlla la tua casella email.')
    } catch (err) {
      setResendMsg(err.response?.data?.message || "Impossibile inviare l'email. Riprova più tardi.")
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setForgotError('')
    if (newPassword !== confirmNewPassword) {
      setForgotError('Le password inserite non coincidono.')
      return
    }
    if (newPassword.length < 8) {
      setForgotError('La password deve avere almeno 8 caratteri.')
      return
    }
    setForgotLoading(true)
    try {
      await resetPassword(forgotEmail, forgotCode, newPassword)
      setForgotStep('done')
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Codice non valido. Riprova.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <span className="brand-mark">S</span>
          <span className="brand-name">SicBank</span>
        </div>
        <h1>Accedi al tuo conto</h1>

        {error && <div className="auth-alert">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Il tuo username"
              autoComplete="username"
              required
            />
          </Form.Group>
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="La tua password"
            autoComplete="current-password"
            required
          />
          <Button type="submit" className="w-100 btn-primary" disabled={loading}>
            {loading ? 'Accesso in corso…' : 'Accedi'}
          </Button>
        </Form>

        <div className="auth-links-row">
          <button type="button" className="link-btn" onClick={openForgot}>
            Password dimenticata?
          </button>
          <span>
            Non ho un account? <Link to="/registrati">Registrati</Link>
          </span>
        </div>
      </div>

      <Modal show={showForgot} onHide={() => setShowForgot(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recupera password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forgotError && <div className="auth-alert">{forgotError}</div>}

          {forgotStep === 'email' && (
            <Form onSubmit={handleForgotEmailSubmit}>
              <Form.Group controlId="forgotEmail">
                <Form.Label>Inserisci la tua email</Form.Label>
                <Form.Control
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nome@esempio.it"
                  required
                  autoFocus
                />
              </Form.Group>
              <Button type="submit" className="w-100 btn-primary mt-3" disabled={forgotLoading}>
                {forgotLoading ? 'Invio in corso…' : 'Invia codice'}
              </Button>
            </Form>
          )}

          {forgotStep === 'reset' && (
            <>
              <p className="mb-3" style={{ color: 'var(--color-muted-fg)' }}>
                Se l&apos;indirizzo <strong>{forgotEmail}</strong> è registrato, riceverai un
                codice a 6 cifre via email. Inseriscilo insieme alla nuova password.
              </p>
              <Form onSubmit={handleResetSubmit}>
                <Form.Group className="mb-3" controlId="forgotCode">
                  <Form.Control
                    className="code-input"
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </Form.Group>
                <PasswordField
                  id="newPassword"
                  label="Nuova password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Scegli una nuova password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
                <PasswordField
                  id="confirmNewPassword"
                  label="Conferma nuova password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Ripeti la nuova password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  isInvalid={confirmNewPassword.length > 0 && confirmNewPassword !== newPassword}
                  feedback="Le password non coincidono."
                />
                <Button
                  type="submit"
                  className="w-100 btn-primary"
                  disabled={forgotLoading || forgotCode.length !== 6}
                >
                  {forgotLoading ? 'Salvataggio…' : 'Salva nuova password'}
                </Button>
              </Form>
              <div className="auth-links">
                <button type="button" className="link-btn" onClick={handleResendCode}>
                  Codice non arrivato? Riprova!
                </button>
                {resendMsg && <span style={{ fontSize: 13 }}>{resendMsg}</span>}
              </div>
            </>
          )}

          {forgotStep === 'done' && (
            <>
              <p className="mb-3">
                Password aggiornata. Ora puoi accedere con la tua nuova password.
              </p>
              <Button
                type="button"
                className="w-100 btn-primary"
                onClick={() => setShowForgot(false)}
              >
                Chiudi
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Login
