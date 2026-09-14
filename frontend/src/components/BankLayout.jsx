import { useEffect, useState } from 'react'
import { Button, Dropdown, Modal } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { deleteAccount, getMe } from '../services/authApi'
import { EyeIcon, EyeOffIcon } from './icons'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: GridIcon, to: '/banca' },
  { key: 'conti', label: 'Conti', icon: ListIcon, to: '/banca/conti' },
  { key: 'bonifici', label: 'Bonifici', icon: SwapIcon, to: '/banca/bonifici' },
  { key: 'carte', label: 'Carte', icon: CardIcon, to: '/banca/carte' },
  { key: 'impostazioni', label: 'Impostazioni', icon: SlidersIcon, to: '/banca/impostazioni' },
]

function GridIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3.5" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SwapIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 7h13l-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 17H5l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <circle cx="4" cy="12" r="2" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <circle cx="12" cy="10" r="2" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <circle cx="20" cy="14" r="2" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round" />
      <line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function BankLayout({ title, subtitle, children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [ibanCopied, setIbanCopied] = useState(false)
  const [ibanVisible, setIbanVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/')
      return
    }
    getMe()
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify({ id: data.id, nome: data.nome, cognome: data.cognome }))
        setUser(data)
      })
      .catch(() => navigate('/'))
  }, [navigate])

  const clearSessionAndGoToLogin = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    setDeleting(true)
    try {
      await deleteAccount(user.id)
      clearSessionAndGoToLogin()
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Impossibile eliminare l'account. Riprova.")
    } finally {
      setDeleting(false)
    }
  }

  const handleCopyIban = async () => {
    try {
      await navigator.clipboard.writeText(user.iban)
      setIbanCopied(true)
      setTimeout(() => setIbanCopied(false), 1800)
    } catch {
      setIbanCopied(false)
    }
  }

  if (!user) return null

  const initials = `${user.nome?.[0] ?? ''}${user.cognome?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="bank-shell">
      <aside className="bank-sidebar">
        <div className="brand">
          <span className="brand-mark">S</span>
          <span className="brand-name sidebar-label">SicBank</span>
        </div>
        <nav className="bank-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon, to }) => {
            const active = to === location.pathname
            const className = `bank-nav-item ${active ? 'active' : ''}`
            return to ? (
              <Link key={key} to={to} className={className}>
                <Icon />
                <span className="sidebar-label">{label}</span>
              </Link>
            ) : (
              <button key={key} type="button" className={className}>
                <Icon />
                <span className="sidebar-label">{label}</span>
              </button>
            )
          })}
          <button type="button" className="bank-nav-item" onClick={clearSessionAndGoToLogin}>
            <LogoutIcon />
            <span className="sidebar-label">Esci</span>
          </button>
        </nav>
      </aside>
      <div className="sidebar-backdrop" />

      <div className="bank-main">
        <header className="bank-topbar">
          <div>
            <h1 className="bank-topbar-title">{title}</h1>
            <p className="bank-topbar-subtitle">
              {typeof subtitle === 'function' ? subtitle(user) : subtitle}
            </p>
          </div>

          <div className="bank-topbar-right">
            <div className="my-iban">
              {ibanVisible ? (
                <span className="my-iban-value">{user.iban}</span>
              ) : (
                <span className="my-iban-label">Il mio IBAN</span>
              )}
              <button
                type="button"
                className="iban-eye-btn"
                onClick={() => setIbanVisible((v) => !v)}
                aria-label={ibanVisible ? "Nascondi l'IBAN" : "Mostra l'IBAN"}
              >
                {ibanVisible ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
              <button
                type="button"
                className="iban-copy-btn"
                onClick={handleCopyIban}
                aria-label="Copia IBAN"
              >
                {ibanCopied ? 'Copiato!' : <CopyIcon />}
              </button>
            </div>

            <Dropdown align="end">
              <Dropdown.Toggle as="button" className="bank-avatar" id="user-menu">
                {initials || 'U'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={clearSessionAndGoToLogin}>
                  <LogoutIcon /> Esci
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item-danger" onClick={() => setShowDeleteModal(true)}>
                  <TrashIcon /> Elimina account
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        {children(user)}
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Elimina account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <div className="auth-alert">{deleteError}</div>}
          <p className="mb-0">
            Sei sicuro di voler eliminare il tuo account SicBank? L&apos;operazione è
            irreversibile e cancellerà tutti i tuoi dati.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            className="btn-cancel"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? 'Eliminazione in corso…' : 'Elimina definitivamente'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default BankLayout
