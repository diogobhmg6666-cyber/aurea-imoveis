import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchImoveis, Imovel } from '@/lib/api'
import ImovelCard from '@/components/ImovelCard'

export default function ListaImoveis() {
  const router = useRouter()
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    cidade: '', bairro: '', tipo: '', operacao: '',
    quartos_min: '', preco_min: '', preco_max: '',
  })

  // Sincroniza filtros com a URL ao carregar
  useEffect(() => {
    if (!router.isReady) return
    const q = router.query
    setFiltros({
      cidade: (q.cidade as string) || '',
      bairro: (q.bairro as string) || '',
      tipo: (q.tipo as string) || '',
      operacao: (q.operacao as string) || '',
      quartos_min: (q.quartos_min as string) || '',
      preco_min: (q.preco_min as string) || '',
      preco_max: (q.preco_max as string) || '',
    })
  }, [router.isReady])

  // Busca quando filtros mudam
  useEffect(() => {
    setLoading(true)
    fetchImoveis(filtros)
      .then(setImoveis)
      .catch(() => setImoveis([]))
      .finally(() => setLoading(false))
  }, [filtros])

  function aplicar(e: React.FormEvent) {
    e.preventDefault()
    // já está reagindo automaticamente via useEffect
  }

  function limpar() {
    setFiltros({ cidade: '', bairro: '', tipo: '', operacao: '', quartos_min: '', preco_min: '', preco_max: '' })
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-head fade-up">
          <span className="kicker">Catálogo</span>
          <h1>Encontre <span className="italic">o seu</span></h1>
          <p>Explore nosso portfólio completo de imóveis selecionados.</p>
        </header>

        <div className="layout">
          <aside className="filtros">
            <form onSubmit={aplicar}>
              <div className="filtro-bloco">
                <h3>Operação</h3>
                <div className="pills">
                  {['', 'venda', 'aluguel'].map((op) => (
                    <button
                      key={op || 'todas'}
                      type="button"
                      className={filtros.operacao === op ? 'p-active' : ''}
                      onClick={() => setFiltros((f) => ({ ...f, operacao: op }))}
                    >
                      {op === '' ? 'Todas' : op === 'venda' ? 'Comprar' : 'Alugar'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filtro-bloco">
                <h3>Tipo</h3>
                <select value={filtros.tipo} onChange={(e) => setFiltros((f) => ({ ...f, tipo: e.target.value }))}>
                  <option value="">Qualquer</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="studio">Studio</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="terreno">Terreno</option>
                </select>
              </div>

              <div className="filtro-bloco">
                <h3>Localização</h3>
                <input
                  type="text"
                  placeholder="Cidade"
                  value={filtros.cidade}
                  onChange={(e) => setFiltros((f) => ({ ...f, cidade: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Bairro"
                  value={filtros.bairro}
                  onChange={(e) => setFiltros((f) => ({ ...f, bairro: e.target.value }))}
                  style={{ marginTop: 8 }}
                />
              </div>

              <div className="filtro-bloco">
                <h3>Quartos (mínimo)</h3>
                <div className="pills">
                  {['', '1', '2', '3', '4'].map((q) => (
                    <button
                      key={q || 'qq'}
                      type="button"
                      className={filtros.quartos_min === q ? 'p-active' : ''}
                      onClick={() => setFiltros((f) => ({ ...f, quartos_min: q }))}
                    >
                      {q === '' ? 'Qq' : q === '4' ? '4+' : q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filtro-bloco">
                <h3>Preço</h3>
                <input
                  type="number"
                  placeholder="Mínimo (R$)"
                  value={filtros.preco_min}
                  onChange={(e) => setFiltros((f) => ({ ...f, preco_min: e.target.value }))}
                />
                <input
                  type="number"
                  placeholder="Máximo (R$)"
                  value={filtros.preco_max}
                  onChange={(e) => setFiltros((f) => ({ ...f, preco_max: e.target.value }))}
                  style={{ marginTop: 8 }}
                />
              </div>

              <button type="button" className="limpar" onClick={limpar}>Limpar filtros</button>
            </form>
          </aside>

          <div className="resultados">
            <div className="resultados-head">
              <span className="total">{loading ? 'Buscando…' : `${imoveis.length} imóveis encontrados`}</span>
            </div>
            {loading && <div className="empty">Carregando…</div>}
            {!loading && imoveis.length === 0 && (
              <div className="empty">
                <p>Nenhum imóvel encontrado com esses filtros.</p>
                <p style={{ marginTop: 12, color: 'var(--stone)' }}>
                  Que tal pedir ajuda à <strong style={{ color: 'var(--teal-deep)' }}>Aurea</strong>?
                  Clique no botão de chat no canto inferior direito.
                </p>
              </div>
            )}
            {!loading && imoveis.length > 0 && (
              <div className="grid">
                {imoveis.map((i, idx) => (
                  <ImovelCard key={i.id} imovel={i} delay={idx * 50} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page { padding: 60px 0 80px; }
        .page-head { text-align: center; margin-bottom: 60px; }
        .page-head h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin: 16px 0 12px;
        }
        .page-head .italic { font-style: italic; color: var(--teal-deep); }
        .page-head p { color: var(--graphite); }
        .kicker {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--terracotta);
          font-weight: 500;
        }

        .layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 40px;
        }

        .filtros {
          background: var(--cream);
          border: 1px solid var(--whisper);
          border-radius: 14px;
          padding: 24px;
          height: fit-content;
          position: sticky;
          top: 90px;
        }
        .filtro-bloco { margin-bottom: 22px; }
        .filtro-bloco h3 {
          font-family: var(--font-body);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--stone);
          font-weight: 500;
          margin-bottom: 10px;
        }
        .filtros select, .filtros input {
          width: 100%;
          padding: 10px 12px;
          background: var(--ivory);
          border: 1px solid transparent;
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--ink);
          outline: none;
        }
        .filtros select:focus, .filtros input:focus { border-color: var(--teal); }
        .pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .pills button {
          padding: 7px 14px;
          background: var(--ivory);
          border-radius: 999px;
          font-size: 0.8rem;
          color: var(--graphite);
          transition: all 0.2s;
        }
        .pills button.p-active {
          background: var(--ink);
          color: var(--cream);
        }
        .limpar {
          width: 100%;
          padding: 10px;
          color: var(--terracotta);
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid var(--whisper);
          border-radius: 8px;
          transition: all 0.2s;
        }
        .limpar:hover { background: var(--ivory); }

        .resultados-head {
          padding-bottom: 16px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--whisper);
        }
        .total {
          font-size: 0.85rem;
          color: var(--graphite);
          font-weight: 500;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .empty {
          padding: 80px 20px;
          text-align: center;
          color: var(--graphite);
        }

        @media (max-width: 880px) {
          .layout { grid-template-columns: 1fr; }
          .filtros { position: static; }
        }
      `}</style>
    </div>
  )
}
