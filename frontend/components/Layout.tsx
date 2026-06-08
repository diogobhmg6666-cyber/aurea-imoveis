import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatWidget from './ChatWidget'
import WhatsAppButton from './WhatsAppButton'

const WHATSAPP_NUMERO = '5531999990000'  // formato: 55 + DDD + número, sem espaços ou hífen
const INSTAGRAM_URL = 'https://instagram.com/bemmorarimoveis'  // troque pelo seu @
const FACEBOOK_URL = '#'  // opcional

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [logged, setLogged] = useState(false)
  const [nome, setNome] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const t = localStorage.getItem('token')
    const n = localStorage.getItem('nome')
    setLogged(!!t)
    setNome(n || '')
  }, [router.pathname])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('nome')
    router.push('/')
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">B</span>
            <span className="logo-text">bem morar<span className="logo-dot">.</span></span>
          </Link>

          <nav className="nav">
            <Link href="/imoveis" className={router.pathname.startsWith('/imoveis') ? 'active' : ''}>Imóveis</Link>
            <Link href="/sobre" className={router.pathname === '/sobre' ? 'active' : ''}>Sobre</Link>
            <Link href="/contato" className={router.pathname === '/contato' ? 'active' : ''}>Contato</Link>
            {logged ? (
              <>
                <Link href="/corretor" className={router.pathname.startsWith('/corretor') ? 'active' : ''}>Painel</Link>
                <button onClick={logout} className="nav-btn">Sair</button>
              </>
            ) : (
              <Link href="/corretor/login" className="nav-btn-primary">Área do Corretor</Link>
            )}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-mark">B</span>
              <span className="logo-text">bem morar<span className="logo-dot">.</span></span>
            </div>
            <p className="footer-tag">Pra você morar bem, com calma e com a casa certa.</p>
            <div className="footer-social">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              {FACEBOOK_URL !== '#' && (
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Navegue</h4>
              <Link href="/imoveis">Imóveis</Link>
              <Link href="/sobre">Sobre nós</Link>
              <Link href="/contato">Contato</Link>
            </div>
            <div>
              <h4>Contato</h4>
              <a>Belo Horizonte, MG</a>
              <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a>contato@bemmorar.com.br</a>
            </div>
          </div>
        </div>
        <div className="footer-base">
          <span>© 2026 Bem Morar Imóveis · Todos os direitos reservados</span>
        </div>
      </footer>

      <ChatWidget />
      <WhatsAppButton numero={WHATSAPP_NUMERO} />

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(250, 245, 236, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 1.5rem;
        }
        .logo-mark {
          width: 36px;
          height: 36px;
          background: var(--terracotta);
          color: var(--cream);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-weight: 500;
          font-size: 1.1rem;
        }
        .logo-text { font-style: italic; letter-spacing: -0.02em; }
        .logo-dot { color: var(--gold); }

        .nav { display: flex; align-items: center; gap: 32px; }
        .nav a {
          font-size: 0.9rem;
          color: var(--graphite);
          font-weight: 400;
          transition: color 0.2s;
          position: relative;
        }
        .nav a:hover { color: var(--ink); }
        .nav a.active { color: var(--ink); }
        .nav a.active::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 1px;
          background: var(--terracotta);
        }
        .nav-btn { font-size: 0.9rem; color: var(--graphite); }
        .nav-btn:hover { color: var(--ink); }
        .nav-btn-primary {
          padding: 10px 20px;
          background: var(--ink);
          color: var(--cream) !important;
          border-radius: 999px;
          font-size: 0.85rem;
        }
        .nav-btn-primary:hover { background: var(--terracotta); }

        .footer {
          background: var(--ink);
          color: var(--ivory);
          margin-top: 120px;
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 1.5fr 2fr;
          gap: 60px;
          padding: 80px 24px 40px;
        }
        .footer-brand .logo { color: var(--cream); }
        .footer-brand .logo-mark { background: var(--cream); color: var(--ink); }
        .footer-tag {
          margin-top: 16px;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.05rem;
          color: var(--whisper);
          max-width: 280px;
          line-height: 1.4;
        }
        .footer-social {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .footer-social a {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          color: var(--whisper);
          transition: all 0.2s;
        }
        .footer-social a:hover {
          background: var(--terracotta);
          color: var(--cream);
          border-color: var(--terracotta);
        }
        .footer-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .footer-cols h4 {
          font-family: var(--font-body);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--stone);
          margin-bottom: 20px;
          font-weight: 500;
        }
        .footer-cols a {
          display: block;
          font-size: 0.9rem;
          padding: 4px 0;
          color: var(--ivory);
        }
        .footer-cols a:hover { color: var(--terracotta); }
        .footer-base {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 20px 24px;
          text-align: center;
          font-size: 0.8rem;
          color: var(--stone);
        }

        @media (max-width: 768px) {
          .nav { gap: 16px; }
          .nav a:not(.nav-btn-primary):not(.active) { display: none; }
          .footer-inner { grid-template-columns: 1fr; gap: 40px; padding: 60px 24px 30px; }
        }
      `}</style>
    </>
  )
}
