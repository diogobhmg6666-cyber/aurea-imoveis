import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { fetchImoveis, Imovel } from '@/lib/api'
import ImovelCard from '@/components/ImovelCard'

export default function Home() {
  const router = useRouter()
  const [destaques, setDestaques] = useState<Imovel[]>([])
  const [tipoBusca, setTipoBusca] = useState('')
  const [cidadeBusca, setCidadeBusca] = useState('')
  const [operacaoBusca, setOperacaoBusca] = useState('venda')

  useEffect(() => {
    fetchImoveis({ destaque: true, limit: 6 }).then(setDestaques).catch(() => {})
  }, [])

  function buscar(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (tipoBusca) params.set('tipo', tipoBusca)
    if (cidadeBusca) params.set('cidade', cidadeBusca)
    if (operacaoBusca) params.set('operacao', operacaoBusca)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="kicker fade-up">Pra você morar bem · 2026</span>
            <h1 className="fade-up" style={{ animationDelay: '100ms' }}>
              A sua próxima casa,<br/>
              <span className="italic">com o cuidado</span> que ela merece.
            </h1>
            <p className="hero-tag fade-up" style={{ animationDelay: '200ms' }}>
              Imóveis selecionados com calma, atendimento humano de verdade
              e uma IA simpática chamada Judite pra te ajudar a qualquer hora.
            </p>

            <form className="hero-search fade-up" style={{ animationDelay: '300ms' }} onSubmit={buscar}>
              <div className="search-tabs">
                <button type="button" className={operacaoBusca === 'venda' ? 'tab active' : 'tab'} onClick={() => setOperacaoBusca('venda')}>
                  Comprar
                </button>
                <button type="button" className={operacaoBusca === 'aluguel' ? 'tab active' : 'tab'} onClick={() => setOperacaoBusca('aluguel')}>
                  Alugar
                </button>
              </div>
              <div className="search-fields">
                <div className="field">
                  <label>Tipo</label>
                  <select value={tipoBusca} onChange={(e) => setTipoBusca(e.target.value)}>
                    <option value="">Qualquer</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="studio">Studio</option>
                    <option value="cobertura">Cobertura</option>
                  </select>
                </div>
                <div className="field">
                  <label>Cidade ou bairro</label>
                  <input
                    type="text"
                    placeholder="Ex: Savassi"
                    value={cidadeBusca}
                    onChange={(e) => setCidadeBusca(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-search">
                  Buscar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="hero-img fade-up" style={{ animationDelay: '400ms' }}>
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400" alt="Casa acolhedora" />
            <div className="hero-img-overlay">
              <div className="hero-stat">
                <div className="num">+</div>
                <div className="lbl">Imóveis com cuidado</div>
              </div>
              <div className="hero-stat">
                <div className="num">24h</div>
                <div className="lbl">A Judite responde</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Selecionados da semana</span>
            <h2>Pra você <span className="italic">já se imaginar morando</span></h2>
            <p className="section-sub">Olha os imóveis que separamos com mais carinho pra você.</p>
          </div>
          <div className="grid">
            {destaques.map((i, idx) => (
              <ImovelCard key={i.id} imovel={i} delay={idx * 80} />
            ))}
          </div>
          <div className="section-cta">
            <Link href="/imoveis" className="btn btn-secondary">
              Ver todos os imóveis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="diff">
        <div className="container diff-inner">
          <div className="diff-text">
            <span className="kicker">Como a gente trabalha</span>
            <h2>Tecnologia <span className="italic">que acolhe</span>,<br/>gente <span className="italic">que cuida</span>.</h2>
            <p>
              A nossa <strong>Judite</strong> é uma assistente de IA carinhosa que conversa com você
              24 horas, entende o que você procura, mostra imóveis no seu jeito
              e te conecta com um corretor humano quando for a hora certa.
            </p>
            <p>
              Sem formulários longos. Sem ligação intrometida.
              Só uma boa conversa, no seu tempo. ✨
            </p>
            <div className="diff-stats">
              <div>
                <div className="num">3 min</div>
                <div className="lbl">Pra encontrar opções com a Judite</div>
              </div>
              <div>
                <div className="num">100%</div>
                <div className="lbl">Imóveis verificados</div>
              </div>
            </div>
          </div>
          <div className="diff-visual">
            <div className="chat-mock">
              <div className="mock-msg user">Tô procurando um apartamento de 2 quartos por aqui no Buritis</div>
              <div className="mock-msg bot">Achei 3 opções lindas no Buritis! 💛 Quer ver?</div>
              <div className="mock-msg user">Quero!</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          position: relative;
          padding: 60px 0 80px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 80% 20%, rgba(194, 101, 74, 0.08), transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(184, 149, 106, 0.06), transparent 50%);
          z-index: -1;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .hero-content { max-width: 580px; }
        .kicker {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--terracotta);
          font-weight: 500;
          display: block;
          margin-bottom: 24px;
        }
        h1 {
          font-size: clamp(3rem, 6vw, 5rem);
          line-height: 1.05;
          color: var(--ink);
          margin-bottom: 24px;
        }
        .italic { font-style: italic; color: var(--terracotta); }
        .hero-tag {
          font-size: 1.1rem;
          color: var(--graphite);
          max-width: 480px;
          margin-bottom: 36px;
          line-height: 1.55;
        }

        .hero-search {
          background: var(--cream);
          border: 1px solid var(--whisper);
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.04);
        }
        .search-tabs {
          display: flex;
          gap: 4px;
          background: var(--ivory);
          padding: 4px;
          border-radius: 999px;
          margin-bottom: 20px;
          width: fit-content;
        }
        .tab {
          padding: 8px 22px;
          border-radius: 999px;
          font-size: 0.85rem;
          color: var(--graphite);
          font-weight: 500;
          transition: all 0.2s;
        }
        .tab.active {
          background: var(--ink);
          color: var(--cream);
        }
        .search-fields {
          display: grid;
          grid-template-columns: 1fr 1.4fr auto;
          gap: 12px;
          align-items: end;
        }
        .field label {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--stone);
          margin-bottom: 6px;
          font-weight: 500;
        }
        .field select, .field input {
          width: 100%;
          padding: 12px 14px;
          background: var(--ivory);
          border: 1px solid transparent;
          border-radius: 10px;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s;
        }
        .field select:focus, .field input:focus { border-color: var(--terracotta); }
        .btn-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--terracotta);
          color: var(--cream);
          padding: 13px 24px;
          border-radius: 10px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-search:hover { background: var(--terracotta-deep); }

        .hero-img {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 20px;
          overflow: hidden;
        }
        .hero-img img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .hero-img-overlay {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: rgba(250, 245, 236, 0.96);
          backdrop-filter: blur(12px);
          padding: 20px;
          border-radius: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .hero-stat .num {
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--terracotta);
          font-style: italic;
          line-height: 1;
          margin-bottom: 4px;
        }
        .hero-stat .lbl {
          font-size: 0.75rem;
          color: var(--graphite);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .section { padding: 100px 0; }
        .section-head {
          text-align: center;
          margin-bottom: 60px;
        }
        .section-head h2 {
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          margin-bottom: 16px;
        }
        .section-sub {
          color: var(--graphite);
          max-width: 520px;
          margin: 0 auto;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 60px;
        }
        .section-cta { text-align: center; }

        .diff {
          background: var(--ink);
          color: var(--cream);
          padding: 100px 0;
          margin-top: 40px;
        }
        .diff-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .diff-text h2 {
          font-size: clamp(2rem, 3.5vw, 3rem);
          margin: 16px 0 24px;
          color: var(--cream);
        }
        .diff-text .italic { color: var(--gold); }
        .diff-text p {
          color: var(--whisper);
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .diff-text strong { color: var(--cream); font-weight: 500; }
        .diff-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .diff-stats .num {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: var(--gold);
          font-style: italic;
          line-height: 1;
        }
        .diff-stats .lbl {
          font-size: 0.85rem;
          color: var(--stone);
          margin-top: 6px;
        }

        .chat-mock {
          background: var(--cream);
          color: var(--ink);
          padding: 28px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.3);
        }
        .mock-msg {
          padding: 12px 18px;
          font-size: 0.95rem;
          max-width: 85%;
        }
        .mock-msg.user {
          background: var(--terracotta);
          color: var(--cream);
          align-self: flex-end;
          border-radius: 18px 18px 4px 18px;
        }
        .mock-msg.bot {
          background: var(--ivory);
          align-self: flex-start;
          border-radius: 18px 18px 18px 4px;
        }

        @media (max-width: 880px) {
          .hero-inner, .diff-inner { grid-template-columns: 1fr; gap: 40px; }
          .search-fields { grid-template-columns: 1fr; }
          .hero-img { aspect-ratio: 16/10; }
        }
      `}</style>
    </>
  )
}
