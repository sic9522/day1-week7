import { useEffect, useState } from 'react'
import { Accordion, Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { register, verifyCode, resendCode, login, getMe } from '../services/authApi'
import PasswordField from '../components/PasswordField'
import { capitalize, formatInputAmount, parseInputAmount } from '../utils/format'

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M5 12l7 7M5 12l7-7" />
  </svg>
)

const Req = () => <span className="required-asterisk">*</span>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState('form') // form | code | welcome

  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [initialDeposit, setInitialDeposit] = useState('')
  const [via, setVia] = useState('')
  const [civico, setCivico] = useState('')
  const [cap, setCap] = useState('')
  const [citta, setCitta] = useState('')
  const [provincia, setProvincia] = useState('')
  const [nazione, setNazione] = useState('Italia')
  const [telefono, setTelefono] = useState('')
  const [confirmTelefono, setConfirmTelefono] = useState('')
  const [consentMarketing, setConsentMarketing] = useState(false)
  const [consentData, setConsentData] = useState(false)
  const [consentTerms, setConsentTerms] = useState(false)
  const [code, setCode] = useState('')

  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  useEffect(() => {
    if (step !== 'welcome') return
    const timer = setTimeout(() => navigate('/banca'), 500)
    return () => clearTimeout(timer)
  }, [step, navigate])

  const nomeInvalid = !nome.trim()
  const cognomeInvalid = !cognome.trim()
  const emailInvalid = !EMAIL_RE.test(email)
  const usernameInvalid = !username.trim()
  const passwordInvalid = password.length < 8
  const confirmPasswordInvalid = confirmPassword !== password
  const depositInvalid = !(Number(initialDeposit) > 0)
  const confirmTelefonoInvalid = confirmTelefono !== telefono
  const consentDataInvalid = !consentData
  const consentTermsInvalid = !consentTerms

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (
      nomeInvalid ||
      cognomeInvalid ||
      emailInvalid ||
      usernameInvalid ||
      passwordInvalid ||
      confirmPasswordInvalid ||
      depositInvalid ||
      confirmTelefonoInvalid ||
      consentDataInvalid ||
      consentTermsInvalid
    ) {
      setAttempted(true)
      return
    }
    setLoading(true)
    try {
      await register(nome, cognome, email, username, password, Number(initialDeposit))
      setStep('code')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrazione non riuscita. Controlla i dati e riprova.')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyCode(code)
      const { data } = await login(email, password)
      if (data?.token) localStorage.setItem('token', data.token)
      const me = await getMe()
      localStorage.setItem('user', JSON.stringify({ id: me.data.id, nome, cognome }))
      setStep('welcome')
    } catch (err) {
      setError(err.response?.data?.message || 'Codice non valido. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendMsg('')
    try {
      await resendCode(email)
      setResendMsg('Codice inviato di nuovo. Controlla la tua casella email.')
    } catch (err) {
      setResendMsg(err.response?.data?.message || "Impossibile inviare l'email. Riprova più tardi.")
    }
  }

  return (
    <div className="auth-page">
      <div className="brand">
        <span className="brand-mark">S</span>
        <span className="brand-name">SicBank</span>
      </div>

      <Modal show={step === 'form'} centered backdrop="static" keyboard={false}>
        <Modal.Header>
          <button
            type="button"
            className="modal-back-btn"
            onClick={() => navigate('/')}
            aria-label="Torna al login"
          >
            <ArrowLeftIcon />
          </button>
          <Modal.Title>Crea il tuo account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="auth-alert">{error}</div>}
          <Form noValidate onSubmit={handleRegisterSubmit}>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="nome">
                  <Form.Label>
                    Nome <Req />
                  </Form.Label>
                  <Form.Control
                    value={nome}
                    onChange={(e) => setNome(capitalize(e.target.value))}
                    placeholder="Mario"
                    isInvalid={attempted && nomeInvalid}
                    required
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">Il nome è obbligatorio.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="cognome">
                  <Form.Label>
                    Cognome <Req />
                  </Form.Label>
                  <Form.Control
                    value={cognome}
                    onChange={(e) => setCognome(capitalize(e.target.value))}
                    placeholder="Rossi"
                    isInvalid={attempted && cognomeInvalid}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Il cognome è obbligatorio.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>
                    Email <Req />
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@esempio.it"
                    isInvalid={attempted && emailInvalid}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Inserisci un indirizzo email valido.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>
                    Username <Req />
                  </Form.Label>
                  <Form.Control
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    placeholder="mario.rossi"
                    isInvalid={attempted && usernameInvalid}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Lo username è obbligatorio.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <PasswordField
                  id="password"
                  label={
                    <>
                      Password <Req />
                    </>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Scegli una password sicura"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  isInvalid={attempted && passwordInvalid}
                  feedback="La password deve avere almeno 8 caratteri."
                />
              </Col>
              <Col xs={6}>
                <PasswordField
                  id="confirmPassword"
                  label={
                    <>
                      Conferma password <Req />
                    </>
                  }
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ripeti la password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  isInvalid={attempted && confirmPasswordInvalid}
                  feedback="Le password non coincidono."
                />
              </Col>
            </Row>

            <div className="accordion-section-title">
              Informazioni aggiuntive <span className="accordion-optional">(facoltativo)</span>
            </div>
            <Accordion className="mb-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Indirizzo &amp; Contatti</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col xs={6}>
                      <Form.Group className="mb-3" controlId="via">
                        <Form.Label>Via</Form.Label>
                        <Form.Control
                          value={via}
                          onChange={(e) => setVia(e.target.value)}
                          placeholder="Via Roma"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={3}>
                      <Form.Group className="mb-3" controlId="civico">
                        <Form.Label>Civico</Form.Label>
                        <Form.Control
                          value={civico}
                          onChange={(e) => setCivico(e.target.value)}
                          placeholder="12"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={3}>
                      <Form.Group className="mb-3" controlId="cap">
                        <Form.Label>CAP</Form.Label>
                        <Form.Control
                          value={cap}
                          onChange={(e) => setCap(e.target.value)}
                          placeholder="00100"
                          inputMode="numeric"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4}>
                      <Form.Group className="mb-3" controlId="citta">
                        <Form.Label>Città</Form.Label>
                        <Form.Control
                          value={citta}
                          onChange={(e) => setCitta(e.target.value)}
                          placeholder="Roma"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={4}>
                      <Form.Group className="mb-3" controlId="provincia">
                        <Form.Label>Provincia</Form.Label>
                        <Form.Control
                          value={provincia}
                          onChange={(e) => setProvincia(e.target.value)}
                          placeholder="RM"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={4}>
                      <Form.Group className="mb-3" controlId="nazione">
                        <Form.Label>Nazione</Form.Label>
                        <Form.Control
                          value={nazione}
                          onChange={(e) => setNazione(e.target.value)}
                          placeholder="Italia"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <Form.Group controlId="telefono">
                        <Form.Label>Numero di telefono</Form.Label>
                        <Form.Control
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="+39 333 1234567"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group controlId="confirmTelefono">
                        <Form.Label>Conferma numero di telefono</Form.Label>
                        <Form.Control
                          type="tel"
                          value={confirmTelefono}
                          onChange={(e) => setConfirmTelefono(e.target.value)}
                          placeholder="Ripeti il numero"
                          isInvalid={attempted && confirmTelefonoInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                          I numeri di telefono non coincidono.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Form.Group className="mb-4" controlId="initialDeposit">
              <Form.Label>
                Con quanti soldi vuoi aprire il conto? <Req />
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  value={formatInputAmount(initialDeposit)}
                  onChange={(e) => setInitialDeposit(parseInputAmount(e.target.value))}
                  placeholder="es. 1'000"
                  isInvalid={attempted && depositInvalid}
                  required
                />
                <InputGroup.Text>€</InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  Inserisci un importo valido maggiore di zero.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="consent-list mb-4">
              <Form.Check
                type="checkbox"
                id="consentMarketing"
                className="consent-check"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                label={
                  <span>
                    <span className="consent-title">
                      Inserzioni pubblicitarie <span className="accordion-optional">(facoltativo)</span>
                    </span>
                    <span className="consent-desc">
                      Acconsento a ricevere comunicazioni promozionali, offerte e novità sui prodotti
                      SicBank.
                    </span>
                  </span>
                }
              />
              <Form.Check
                type="checkbox"
                id="consentData"
                className="consent-check"
                checked={consentData}
                onChange={(e) => setConsentData(e.target.checked)}
                isInvalid={attempted && consentDataInvalid}
                feedback="Devi acconsentire al trattamento dei dati personali per registrarti."
                feedbackType="invalid"
                label={
                  <span>
                    <span className="consent-title">
                      Trattamento dei dati personali <Req />
                    </span>
                    <span className="consent-desc">
                      Acconsento al trattamento dei miei dati personali secondo l&apos;informativa
                      sulla privacy, necessario per l&apos;apertura del conto.
                    </span>
                  </span>
                }
              />
              <Form.Check
                type="checkbox"
                id="consentTerms"
                className="consent-check"
                checked={consentTerms}
                onChange={(e) => setConsentTerms(e.target.checked)}
                isInvalid={attempted && consentTermsInvalid}
                feedback="Devi accettare i termini e le condizioni per registrarti."
                feedbackType="invalid"
                label={
                  <span>
                    <span className="consent-title">
                      Termini e condizioni <Req />
                    </span>
                    <span className="consent-desc">
                      Dichiaro di aver letto e di accettare i termini e le condizioni del servizio
                      SicBank.
                    </span>
                  </span>
                }
              />
            </div>

            <div className="d-flex gap-2">
              <Button
                type="button"
                variant="outline-secondary"
                className="btn-cancel flex-fill"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Annulla
              </Button>
              <Button type="submit" className="btn-primary flex-fill" disabled={loading}>
                {loading ? 'Registrazione in corso…' : 'Registrati'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={step === 'code'} centered backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Verifica la tua email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3" style={{ color: 'var(--color-muted-fg)' }}>
            Abbiamo inviato un codice a 6 cifre a <strong>{email}</strong>.
          </p>
          {error && <div className="auth-alert">{error}</div>}
          <Form onSubmit={handleCodeSubmit}>
            <Form.Group className="mb-3" controlId="code">
              <Form.Control
                className="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100 btn-primary"
              disabled={loading || code.length !== 6}
            >
              {loading ? 'Verifica in corso…' : 'Verifica codice'}
            </Button>
          </Form>
          <div className="auth-links">
            <button type="button" className="link-btn" onClick={handleResend}>
              Email non arrivata? Riprova!
            </button>
            {resendMsg && <span style={{ fontSize: 13 }}>{resendMsg}</span>}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={step === 'welcome'} centered backdrop="static" keyboard={false}>
        <Modal.Body className="welcome-message">
          <h1 style={{ marginBottom: 0 }}>
            Benvenuto/a, {nome} {cognome}
          </h1>
          <p>La sua registrazione è stata completata con successo. Stiamo aprendo il suo conto SicBank.</p>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Register
