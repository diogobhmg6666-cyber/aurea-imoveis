import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { fetchImovel, Imovel, formatPreco } from '@/lib/api'

export default function DetalhesImovel() {
  const router = useRouter()
  const { id } = router.query
  const [imovel, setImovel] = useState<Imovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [fotoAtiva, setFotoAtiva] = useState(0)
  const [interesse, setInteresse] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchImovel(id as string)
      .then(setImovel)
      .catch(() => setImovel(null))
      .finally(() => setLoading(false))
  }, [id])

  async function enviarInteresse(e: React.FormEvent) {
    e.preventDefault()
    if (!imovel) return
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await fetch(`${API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: interesse.nome,
          email: interesse.email,
          telefone: interesse.telefone,
          interesse: interesse.mensagem || `Interessado no imóvel "${imovel.titulo}"`,
          imovel_id: imovel.id,
        }),
      })
      setEnviado(true)
    } catch (err) {
      alert('Erro ao enviar. Tente novamente.')
    }
  }

  if (loading) return <div className="container" style={{ padding: '80px 24px' }}>Carregando…</div>
  if (!imovel) return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <h1>Imóvel não encontrado</h1>
      <Link href="/imoveis" className="btn btn-primary" style={{ marginTop: 24 }}>Voltar pra lista</Link>
    </div>
  )

  const fotos = imovel.fotos?.length ? imovel.fotos : ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200']

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/imoveis">Imóveis</Link>
          <span>·</span>
          <span>{imovel.bairro}</span>
          <span>·</span>
          <span className="atual">{imovel.titulo}</span>
        </div>

        <div className="header-info">
          <div>
            <div className="tags">
              <span className={`pill ${imovel.operacao === 'venda' ? 'pill-teal' : 'pill-gold'}`}>
                {imovel.operacao === 'venda' ? 'À venda' : 'Aluguel'}
              </span>
              {imovel.destaque && <span className="pill pill-soft">Destaque</span>}
            </div>
            <h1>{imovel.titulo}</h1>
            <p className="local">📍 {imovel.endereco ? `${imovel.endereco}, ` : ''}{imovel.bairro}, {imovel.cidade}</p>
          </div>
          <div className="preco-box">
            <div className="preco">{formatPreco(imovel.preco, imovel.operacao)}</div>
            {imovel.condominio > 0 && (
              <div className="preco-extra">Condomínio: {formatPreco(imovel.condominio)}</div>
            )}
            {imovel.iptu > 0 && (
              <div className="preco-extra">IPTU: {formatPreco(imovel.iptu)}/ano</div>
            )}
          </div>
        </div>

        <div className="galeria">
          <div className="foto-principal">
            <img src={fotos[fotoAtiva]} alt={imovel.titulo} />
          </div>
          {fotos.length > 1 && (
            <div className="thumbs">
              {fotos.map((f, i) => (
                <button
                  key={i}
                  className={i === fotoAtiva ? 'thumb active' : 'thumb'}
                  onClick={() => setFotoAtiva(i)}
                >
                  <img src={f} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="content">
          <div className="main">
            <section className="specs-grid">
              <div className="spec">
                <div className="spec-num">{imovel.quartos}</div>
                <div className="spec-lbl">Quartos</div>
              </div>
              <div className="spec">
                <div className="spec-num">{imovel.banheiros}</div>
                <div className="spec-lbl">Banheiros</div>
              </div>
              <div className="spec">
                <div className="spec-num">{imovel.vagas}</div>
                <div className="spec-lbl">Vagas</div>
              </div>
              <div className="spec">
                <div className="spec-num">{imovel.area_m2}<span>m²</span></div>
                <div className="spec-lbl">Área</div>
              </div>
            </section>

            <section>
              <h2>Sobre o imóvel</h2>
              <p className="descricao">{imovel.descricao || 'Sem descrição disponível.'}</p>
            </section>

            <section className="cta-ia">
              <h3>💬 Conversar com a Aurea sobre este imóvel</h3>
              <p>Tem dúvidas? Pergunte à nossa assistente de IA — ela conhece todos os detalhes deste imóvel e do bairro.</p>
              <p className="dica">Abra o chat no canto inferior direito ↘</p>
            </section>
          </div>

          <aside className="form-card">
            {enviado ? (
              <div className="ok">
                <h3>Mensagem enviada! ✨</h3>
                <p>Um corretor entrará em contato em breve. Obrigado pelo interesse!</p>
              </div>
            ) : (
              <form onSubmit={enviarInteresse}>
                <h3>Tenho interesse</h3>
                <p className="form-sub">Deixe seus dados e um corretor falará com você.</p>
                <input
                  type="text" placeholder="Seu nome" required
                  value={interesse.nome}
                  onChange={(e) => setInteresse((s) => ({ ...s, nome: e.target.value }))}
                />
                <input
                  type="email" placeholder="Seu e-mail" required
                  value={interesse.email}
                  onChange={(e) => setInteresse((s) => ({ ...s, email: e.target.value }))}
                />
                <input
                  type="tel" placeholder="Telefone (com DDD)"
                  value={interesse.telefone}
                  onChange={(e) => setInteresse((s) => ({ ...s, telefone: e.target.value }))}
                />
                <textarea
                  placeholder="Mensagem (opcional)"
                  rows={3}
                  value={interesse.mensagem}
                  onChange={(e) => setInteresse((s) => ({ ...s, mensagem: e.target.value }))}
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Enviar mensagem
                </button>
              </form>
            )}
          </aside>
        </div>
      </div>

      <style jsx>{`
        .page { padding: 30px 0 80px; }
        .breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 0.85rem;
          color: var(--stone);
          margin-bottom: 30px;
        }
        .breadcrumb a { color: var(--graphite); }
        .breadcrumb a:hover { color: var(--terracotta); }
        .atual { color: var(--ink); }

        .header-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .tags {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        h1 {
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .local {
          color: var(--graphite);
          font-size: 1rem;
        }
        .preco-box {
          text-align: right;
          background: var(--ivory);
          padding: 20px 26px;
          border-radius: 14px;
          min-width: 240px;
        }
        .preco {
          font-family: var(--font-display);
          font-size: 2.2rem;
          color: var(--teal-deep);
          font-style: italic;
          font-weight: 500;
        }
        .preco-extra {
          font-size: 0.8rem;
          color: var(--stone);
          margin-top: 4px;
        }

        .galeria { margin-bottom: 60px; }
        .foto-principal {
          aspect-ratio: 16/9;
          border-radius: 18px;
          overflow: hidden;
          background: var(--ivory);
          margin-bottom: 12px;
        }
        .foto-principal img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .thumbs {
          display: flex;
          gap: 10px;
          overflow-x: auto;
        }
        .thumb {
          flex-shrink: 0;
          width: 100px;
          aspect-ratio: 16/10;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          padding: 0;
          opacity: 0.7;
          transition: all 0.2s;
        }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .thumb.active { border-color: var(--teal-deep); opacity: 1; }
        .thumb:hover { opacity: 1; }

        .content {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 50px;
          align-items: start;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 28px;
          background: var(--ivory);
          border-radius: 14px;
          margin-bottom: 40px;
        }
        .spec { text-align: center; }
        .spec-num {
          font-family: var(--font-display);
          font-size: 2.4rem;
          color: var(--teal-deep);
          line-height: 1;
          font-style: italic;
        }
        .spec-num span { font-size: 1.2rem; color: var(--stone); margin-left: 4px; }
        .spec-lbl {
          font-size: 0.75rem;
          color: var(--stone);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 8px;
        }

        section h2 {
          font-size: 1.8rem;
          margin-bottom: 16px;
        }
        .descricao {
          color: var(--graphite);
          font-size: 1.05rem;
          line-height: 1.75;
          margin-bottom: 40px;
        }

        .cta-ia {
          background: var(--ink);
          color: var(--cream);
          padding: 32px;
          border-radius: 16px;
          margin-top: 30px;
        }
        .cta-ia h3 {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-style: italic;
          margin-bottom: 10px;
        }
        .cta-ia p { color: var(--whisper); margin-bottom: 8px; }
        .cta-ia .dica { color: var(--terracotta); font-weight: 500; margin-top: 14px; }

        .form-card {
          background: var(--cream);
          border: 1px solid var(--whisper);
          border-radius: 16px;
          padding: 28px;
          position: sticky;
          top: 100px;
        }
        .form-card h3 {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-style: italic;
          margin-bottom: 6px;
        }
        .form-sub {
          font-size: 0.85rem;
          color: var(--stone);
          margin-bottom: 18px;
        }
        .form-card input, .form-card textarea {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 10px;
          background: var(--ivory);
          border: 1px solid transparent;
          border-radius: 10px;
          color: var(--ink);
          outline: none;
          font-family: inherit;
        }
        .form-card input:focus, .form-card textarea:focus { border-color: var(--teal); }
        .ok h3 { color: var(--teal-deep); margin-bottom: 10px; }
        .ok p { color: var(--graphite); }

        @media (max-width: 880px) {
          .content { grid-template-columns: 1fr; }
          .form-card { position: static; }
          .specs-grid { grid-template-columns: repeat(2, 1fr); }
          .preco-box { width: 100%; text-align: left; }
        }
      `}</style>
    </div>
  )
}
