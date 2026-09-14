import { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import BankLayout from '../components/BankLayout'
import { getTransfers, createTransfer, confirmTransfer, rejectTransfer } from '../services/transferApi'
import { capitalize, formatAmount, formatInputAmount, parseInputAmount } from '../utils/format'

const Req = () => <span className="required-asterisk">*</span>

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
  </svg>
)

function Transfers() {
  return (
    <BankLayout title="Bonifici" subtitle="Gestisci i bonifici in entrata e in uscita">
      {(user) => <TransfersContent user={user} />}
    </BankLayout>
  )
}

function TransfersContent({ user }) {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState('form') // form | confirm
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [iban, setIban] = useState('')
  const [amount, setAmount] = useState('')
  const [code, setCode] = useState('')
  const [pendingTransfer, setPendingTransfer] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [attempted, setAttempted] = useState(false)

  const loadTransfers = () => {
    getTransfers()
      .then(({ data }) => setTransfers(data))
      .catch(() => setListError('Impossibile caricare i bonifici.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadTransfers, [])

  const incoming = transfers.filter((t) => t.destinationIban === user.iban)
  const outgoing = transfers.filter((t) => t.sourceIban === user.iban)

  const nomeInvalid = !nome.trim()
  const cognomeInvalid = !cognome.trim()
  const ibanInvalid = !iban.trim()
  const amountInvalid = !(Number(amount) > 0)

  const openModal = () => {
    setStep('form')
    setNome('')
    setCognome('')
    setIban('')
    setAmount('')
    setCode('')
    setError('')
    setAttempted(false)
    setPendingTransfer(null)
    setShowModal(true)
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (nomeInvalid || cognomeInvalid || ibanInvalid || amountInvalid) {
      setAttempted(true)
      return
    }
    if (Number(amount) > user.balance) {
      setError('Importo superiore al saldo disponibile.')
      return
    }
    setSubmitting(true)
    try {
      const { data } = await createTransfer(user.iban, iban.trim(), Number(amount))
      setPendingTransfer(data)
      setStep('confirm')
      loadTransfers()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile creare il bonifico. Riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await confirmTransfer(pendingTransfer.id, code)
      setShowModal(false)
      loadTransfers()
    } catch (err) {
      setError(err.response?.data?.message || 'Codice non valido. Riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelTransfer = async () => {
    setError('')
    setSubmitting(true)
    try {
      await rejectTransfer(pendingTransfer.id)
      setShowModal(false)
      loadTransfers()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile annullare il bonifico.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bank-content transfers-page">
      <div className="transfers-header">
        <div>
          <h2 className="transfers-header-title">I tuoi bonifici</h2>
          <p className="transfers-header-sub">Crea, invia e monitora i tuoi bonifici in tempo reale.</p>
        </div>
        <Button type="button" className="btn-primary transfers-new-btn" onClick={openModal}>
          <PlusIcon /> Nuovo bonifico
        </Button>
      </div>

      {listError && <div className="auth-alert">{listError}</div>}

      <div className="transfers-columns">
        <div className="bank-card">
          <h2 className="section-title">Bonifici in entrata</h2>
          {loading ? (
            <p className="empty-state">Caricamento…</p>
          ) : incoming.length === 0 ? (
            <p className="empty-state">Nessun bonifico in entrata.</p>
          ) : (
            incoming.map((t) => (
              <TransferRow key={t.id} transfer={t} counterpart={t.sourceIban} positive />
            ))
          )}
        </div>

        <div className="bank-card">
          <h2 className="section-title">Bonifici in uscita</h2>
          {loading ? (
            <p className="empty-state">Caricamento…</p>
          ) : outgoing.length === 0 ? (
            <p className="empty-state">Nessun bonifico in uscita.</p>
          ) : (
            outgoing.map((t) => (
              <TransferRow key={t.id} transfer={t} counterpart={t.destinationIban} />
            ))
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{step === 'form' ? 'Nuovo bonifico' : 'Conferma bonifico'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="auth-alert">{error}</div>}

          {step === 'form' ? (
            <Form onSubmit={handleCreateSubmit} noValidate>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3" controlId="transferNome">
                    <Form.Label>
                      Nome <Req />
                    </Form.Label>
                    <Form.Control
                      value={nome}
                      onChange={(e) => setNome(capitalize(e.target.value))}
                      placeholder="Mario"
                      isInvalid={attempted && nomeInvalid}
                      autoFocus
                    />
                    <Form.Control.Feedback type="invalid">Il nome è obbligatorio.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3" controlId="transferCognome">
                    <Form.Label>
                      Cognome <Req />
                    </Form.Label>
                    <Form.Control
                      value={cognome}
                      onChange={(e) => setCognome(capitalize(e.target.value))}
                      placeholder="Rossi"
                      isInvalid={attempted && cognomeInvalid}
                    />
                    <Form.Control.Feedback type="invalid">
                      Il cognome è obbligatorio.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="transferIban">
                <Form.Label>
                  IBAN destinatario <Req />
                </Form.Label>
                <Form.Control
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  placeholder="IT00X0000000000000000000000"
                  isInvalid={attempted && ibanInvalid}
                />
                <Form.Control.Feedback type="invalid">L&apos;IBAN è obbligatorio.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="transferAmount">
                <Form.Label>
                  Importo <Req />
                </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    inputMode="decimal"
                    value={formatInputAmount(amount)}
                    onChange={(e) => setAmount(parseInputAmount(e.target.value))}
                    placeholder="es. 100"
                    isInvalid={attempted && amountInvalid}
                  />
                  <InputGroup.Text>€</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    Inserisci un importo valido maggiore di zero.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Button type="submit" className="w-100 btn-primary" disabled={submitting}>
                {submitting ? 'Invio in corso…' : 'Invia bonifico'}
              </Button>
            </Form>
          ) : (
            <>
              <p className="mb-3" style={{ color: 'var(--color-muted-fg)' }}>
                Abbiamo inviato un codice a 6 cifre alla tua email per confermare il bonifico di{' '}
                <strong>{formatAmount(Number(amount))} €</strong> a {nome} {cognome}.
              </p>
              <Form onSubmit={handleConfirmSubmit}>
                <Form.Group className="mb-3" controlId="transferCode">
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
                <div className="d-flex gap-2">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    className="btn-cancel flex-fill"
                    onClick={handleCancelTransfer}
                    disabled={submitting}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    className="btn-primary flex-fill"
                    disabled={submitting || code.length !== 6}
                  >
                    {submitting ? 'Conferma in corso…' : 'Conferma bonifico'}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

function TransferRow({ transfer, counterpart, positive }) {
  return (
    <div className="transaction-row">
      <div>
        <div className="transfer-counterpart">{counterpart}</div>
        <span className={`status-badge status-badge--${transfer.result.toLowerCase()}`}>
          {transfer.result}
        </span>
      </div>
      <span className={`transaction-amount ${positive ? 'positive' : 'negative'}`}>
        {positive ? '+' : '-'}
        {formatAmount(transfer.amount)} €
      </span>
    </div>
  )
}

export default Transfers
