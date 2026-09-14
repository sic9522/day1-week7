const FOOTER_COLUMNS = [
  {
    title: 'Prodotti',
    items: ['Conto corrente', 'Carte', 'Bonifici', 'Risparmio e depositi'],
  },
  {
    title: 'Assistenza',
    items: ['Centro assistenza', 'Contattaci', 'Sicurezza', 'Domande frequenti'],
  },
  {
    title: 'Azienda',
    items: ['Chi siamo', 'Lavora con noi', 'Investor relations', 'Sostenibilità'],
  },
  {
    title: 'Legale',
    items: ['Termini e condizioni', 'Privacy', 'Cookie', 'Trasparenza'],
  },
]

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <div className="brand">
            <span className="brand-mark">S</span>
            <span className="brand-name">SicBank</span>
          </div>
          <span className="site-footer-tagline">La banca digitale pensata per la tua tranquillità.</span>
        </div>

        <nav className="footer-menus">
          {FOOTER_COLUMNS.map((col) => (
            <div className="footer-menu" key={col.title}>
              <button type="button" className="footer-menu-trigger">
                {col.title} <ChevronIcon />
              </button>
              <div className="footer-menu-dropdown">
                <ul>
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="site-footer-legal">
        <p>
          SicBank S.p.A. · Sede legale: Via dell&apos;Innovazione 1, 00100 Roma (RM) · Iscritta
          all&apos;Albo delle Banche al n. 5678.1 · Progetto dimostrativo a scopo didattico, nessun
          servizio bancario reale. · © {new Date().getFullYear()} SicBank. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  )
}

export default Footer
