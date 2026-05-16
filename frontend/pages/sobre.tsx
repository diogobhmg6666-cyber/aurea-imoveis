export default function Sobre() {
  return (
    <div className="page">
      <div className="container">
        <header className="head fade-up">
          <span className="kicker">Sobre a Aurea</span>
          <h1>Imóveis com <span className="italic">alma</span>,<br/>tecnologia com <span className="italic">propósito</span>.</h1>
        </header>

        <div className="manifest">
          <div className="ms-img">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200" alt="Escritório Aurea" />
          </div>
          <div className="ms-text">
            <span className="kicker">Nosso manifesto</span>
            <h2>Mais que números —<br/>histórias.</h2>
            <p>
              A Aurea nasceu da convicção de que comprar ou alugar um imóvel
              é uma das decisões mais íntimas e importantes da vida.
              Nenhuma planilha resolve isso sozinha.
            </p>
            <p>
              Por isso unimos curadoria humana especializada com tecnologia
              de inteligência artificial de ponta — pra te ajudar a encontrar
              não apenas <em>um lugar</em>, mas <em>o seu lugar</em>.
            </p>
          </div>
        </div>

        <section className="valores">
          <h2 className="valores-h">O que nos guia</h2>
          <div className="valores-grid">
            <div className="valor">
              <div className="num">01</div>
              <h3>Curadoria</h3>
              <p>Cada imóvel é visitado e verificado antes de entrar no catálogo. Sem fotos enganosas, sem informações desatualizadas.</p>
            </div>
            <div className="valor">
              <div className="num">02</div>
              <h3>Transparência</h3>
              <p>Mostramos tudo: preço final, condomínio, IPTU, condições de financiamento. Sem letras miúdas.</p>
            </div>
            <div className="valor">
              <div className="num">03</div>
              <h3>Inteligência</h3>
              <p>Nossa IA Aurea conversa com você 24h, entende suas preferências e aprende com cada interação.</p>
            </div>
            <div className="valor">
              <div className="num">04</div>
              <h3>Humanidade</h3>
              <p>Quando você decide visitar ou negociar, um corretor especializado de verdade entra na conversa.</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .page { padding: 60px 0 80px; }
        .head { text-align: center; margin-bottom: 80px; }
        .kicker {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--terracotta);
          font-weight: 500;
        }
        h1 {
          font-size: clamp(2.5rem, 6vw, 5rem);
          line-height: 1.05;
          margin-top: 20px;
        }
        .italic { font-style: italic; color: var(--teal-deep); }

        .manifest {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 120px;
        }
        .ms-img {
          aspect-ratio: 4/5;
          border-radius: 20px;
          overflow: hidden;
        }
        .ms-img img { width: 100%; height: 100%; object-fit: cover; }
        .ms-text h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.1;
          margin: 16px 0 24px;
        }
        .ms-text p {
          color: var(--graphite);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .ms-text em {
          font-family: var(--font-display);
          font-style: italic;
          color: var(--ink);
          font-size: 1.15em;
        }

        .valores {
          padding: 80px 0;
          border-top: 1px solid var(--whisper);
        }
        .valores-h {
          font-size: clamp(2rem, 4vw, 3rem);
          text-align: center;
          margin-bottom: 60px;
        }
        .valores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 40px;
        }
        .valor .num {
          font-family: var(--font-display);
          font-size: 3rem;
          color: var(--terracotta);
          font-style: italic;
          line-height: 1;
          margin-bottom: 16px;
        }
        .valor h3 {
          font-size: 1.4rem;
          margin-bottom: 10px;
        }
        .valor p {
          color: var(--graphite);
          line-height: 1.6;
        }

        @media (max-width: 880px) {
          .manifest { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </div>
  )
}
