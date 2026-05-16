import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatWidget from './ChatWidget'

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
            <span className="logo-mark">A</span>
            <span className="logo-text">aurea<span className="logo-dot">.</span></span>
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
              <span className="logo-mark">A</span>
              <span className="logo-text">aurea<span className="logo-dot">.</span></span>
            </div>
            <p className="footer-tag">Imóveis selecionados com curadoria especializada.</p>
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
              <a>+55 31 0000-0000</a>
              <a>contato@aurea.com</a>
            </div>
          </div>
        </div>
        <div className="footer-base">
          <span>© 2026 Aurea Imóveis · Todos os direitos reservados</span>
        </div>
      </footer>

      {/* Chat flutuante presente em todas as páginas */}
      <ChatWidget />

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(250, 247, 242, 0.85);
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
          background: var(--teal-deep);
          color: var(--cream);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-weight: 500;
          font-size: 1.1rem;
        }
        .logo-text { font-style: italic; letter-spacing: -0.02em; }
        .logo-dot { color: var(--terracotta); }

        .nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav a {
          font-size: 0.9rem;
          color: var(--graphite);
          font-weight: 400;
          letter-spacing: 0.01em;
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
        .nav-btn {
          font-size: 0.9rem;
          color: var(--graphite);
        }
        .nav-btn:hover { color: var(--ink); }
        .nav-btn-primary {
          padding: 10px 20px;
          background: var(--ink);
          color: var(--cream) !important;
          border-radius: 999px;
          font-size: 0.85rem;
        }
        .nav-btn-primary:hover { background: var(--teal-deep); }

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
