import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { meusImoveis, meusLeads, deletarImovel, criarImovel, Imovel, formatPreco } from '@/lib/api'

export default function PainelCorretor() {
  const router = useRouter()
  const [aba, setAba] = useState<'imoveis' | 'leads' | 'novo'>('imoveis')
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')

  // Form de novo imóvel
  const [novoImovel, setNovoImovel] = useState<any>({
    titulo: '', descricao: '', tipo: 'apartamento', operacao: 'venda',
    cidade: 'Belo Horizonte', bairro: '', endereco: '',
    quartos: 2, banheiros: 1, vagas: 1, area_m2: 60,
    preco: 0, condominio: 0, iptu: 0, fotos: [],
  })
  const [fotosTexto, setFotosTexto] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/corretor/login')
      return
    }
    setNome(localStorage.getItem('nome') || '')
    carregar()
  }, [])

  async function carregar() {
    setLoading(true)
    try {
      const [im, ld] = await Promise.all([meusImoveis(), meusLeads()])
      setImoveis(im)
      setLeads(ld)
    } catch {
      router.push('/corretor/login')
    } finally {
      setLoading(false)
    }
  }

  async function deletar(id: number) {
    if (!confirm('Deletar este imóvel?')) return
    await deletarImovel(id)
    carregar()
  }

  async function salvarNovo(e: React.FormEvent) {
    e.preventDefault()
    const fotos = fotosTexto.split('\n').map((s) => s.trim()).filter(Boolean)
    try {
      await criarImovel({ ...novoImovel, fotos, preco: Number(novoImovel.preco) })
      alert('Imóvel cadastrado!')
      setNovoImovel({
        titulo: '', descricao: '', tipo: 'apartamento', operacao: 'venda',
        cidade: 'Belo Horizonte', bairro: '', endereco: '',
        quartos: 2, banheiros: 1, vagas: 1, area_m2: 60,
        preco: 0, condominio: 0, iptu: 0, fotos: [],
      })
      setFotosTexto('')
      setAba('imoveis')
      carregar()
    } catch (err: any) {
      alert('Erro: ' + err.message)
    }
  }

  if (loading) return <div className="container" style={{ padding: '80px 24px' }}>Carregando…</div>

  return (
    <div className="page">
      <div className="container">
        <header className="head">
          <div>
            <span className="kicker">Painel</span>
            <h1>Olá, <span className="italic">{nome.split(' ')[0]}</span>.</h1>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="n">{imoveis.length}</div>
              <div className="l">Imóveis ativos</div>
            </div>
            <div className="stat">
              <div className="n">{leads.length}</div>
              <div className="l">Leads recebidos</div>
            </div>
          </div>
        </header>

        <div className="tabs">
          <button className={aba === 'imoveis' ? 'tab active' : 'tab'} onClick={() => setAba('imoveis')}>
            Meus imóveis
          </button>
          <button className={aba === 'leads' ? 'tab active' : 'tab'} onClick={() => setAba('leads')}>
            Leads
          </button>
          <button className={aba === 'novo' ? 'tab active' : 'tab'} onClick={() => setAba('novo')}>
            + Novo imóvel
          </button>
        </div>

        {aba === 'imoveis' && (
          <div className="lista">
            {imoveis.length === 0 ? (
              <div className="vazio">
                <p>Você ainda não tem imóveis cadastrados.</p>
                <button onClick={() => setAba('novo')} className="btn btn-primary" style={{ marginTop: 20 }}>
                  Cadastrar primeiro imóvel
                </button>
              </div>
            ) : (
              imoveis.map((i) => (
                <div className="row" key={i.id}>
                  <div className="row-foto">
                    <img src={i.fotos[0] || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400'} alt="" />
                  </div>
                  <div className="row-info">
                    <div className="row-tags">
                      <span className={`pill ${i.operacao === 'venda' ? 'pill-teal' : 'pill-gold'}`}>{i.operacao}</span>
                      {!i.ativo && <span className="pill pill-soft">Pausado</span>}
                    </div>
                    <h3>{i.titulo}</h3>
                    <div className="row-meta">
                      {i.bairro} · {i.quartos} qtos · {i.area_m2}m² · <strong>{formatPreco(i.preco, i.operacao)}</strong>
                    </div>
                  </div>
                  <div className="row-acoes">
                    <Link href={`/imoveis/${i.id}`} className="acao">Ver</Link>
                    <button className="acao danger" onClick={() => deletar(i.id)}>Deletar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {aba === 'leads' && (
          <div className="lista">
            {leads.length === 0 ? (
              <div className="vazio"><p>Ainda nenhum lead.</p></div>
            ) : (
              leads.map((l) => (
                <div className="lead" key={l.id}>
                  <div className="lead-head">
                    <h3>{l.nome}</h3>
                    <span className="pill pill-soft">{l.origem}</span>
                  </div>
                  <div className="lead-info">
                    <div>📧 {l.email}</div>
                    {l.telefone && <div>📞 {l.telefone}</div>}
                    {l.imovel_id && <div>🏠 Imóvel #{l.imovel_id}</div>}
                  </div>
                  {l.interesse && <p className="lead-msg">"{l.interesse}"</p>}
                </div>
              ))
            )}
          </div>
        )}

        {aba === 'novo' && (
          <div className="form-novo">
            <p style={{ marginBottom: 20, color: 'var(--graphite)' }}>
              💡 <strong>Dica:</strong> você também pode cadastrar imóveis conversando com a Aurea no chat!
              Diga algo como: <em>"cadastra um apartamento em Lourdes, 3 quartos, 850 mil"</em>.
            </p>
            <form onSubmit={salvarNovo}>
              <div className="grid-form">
                <div className="campo full">
                  <label>Título</label>
                  <input type="text" required value={novoImovel.titulo} onChange={(e) => setNovoImovel((s: any) => ({ ...s, titulo: e.target.value }))} />
                </div>
                <div className="campo">
                  <label>Tipo</label>
                  <select value={novoImovel.tipo} onChange={(e) => setNovoImovel((s: any) => ({ ...s, tipo: e.target.value }))}>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="studio">Studio</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="terreno">Terreno</option>
                  </select>
                </div>
                <div className="campo">
                  <label>Operação</label>
                  <select value={novoImovel.operacao} onChange={(e) => setNovoImovel((s: any) => ({ ...s, operacao: e.target.value }))}>
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>
                <div className="campo">
                  <label>Cidade</label>
                  <input type="text" required value={novoImovel.cidade} onChange={(e) => setNovoImovel((s: any) => ({ ...s, cidade: e.target.value }))} />
                </div>
                <div className="campo">
                  <label>Bairro</label>
                  <input type="text" required value={novoImovel.bairro} onChange={(e) => setNovoImovel((s: any) => ({ ...s, bairro: e.target.value }))} />
                </div>
                <div className="campo">
                  <label>Endereço</label>
                  <input type="text" value={novoImovel.endereco} onChange={(e) => setNovoImovel((s: any) => ({ ...s, endereco: e.target.value }))} />
                </div>
                <div className="campo">
                  <label>Preço (R$)</label>
                  <input type="number" required value={novoImovel.preco} onChange={(e) => setNovoImovel((s: any) => ({ ...s, preco: e.target.value }))} />
                </div>
                <div className="campo">
                  <label>Quartos</label>
                  <input type="number" value={novoImovel.quartos} onChange={(e) => setNovoImovel((s: any) => ({ ...s, quartos: Number(e.target.value) }))} />
                </div>
                <div className="campo">
                  <label>Banheiros</label>
                  <input type="number" value={novoImovel.banheiros} onChange={(e) => setNovoImovel((s: any) => ({ ...s, banheiros: Number(e.target.value) }))} />
                </div>
                <div className="campo">
                  <label>Vagas</label>
                  <input type="number" value={novoImovel.vagas} onChange={(e) => setNovoImovel((s: any) => ({ ...s, vagas: Number(e.target.value) }))} />
                </div>
                <div className="campo">
                  <label>Área (m²)</label>
                  <input type="number" value={novoImovel.area_m2} onChange={(e) => setNovoImovel((s: any) => ({ ...s, area_m2: Number(e.target.value) }))} />
                </div>
                <div className="campo full">
                  <label>Descrição</label>
                  <textarea rows={4} value={novoImovel.descricao} onChange={(e) => setNovoImovel((s: any) => ({ ...s, descricao: e.target.value }))} />
                </div>
                <div className="campo full">
                  <label>URLs das fotos (uma por linha)</label>
                  <textarea rows={3} value={fotosTexto} onChange={(e) => setFotosTexto(e.target.value)} placeholder="https://..."/>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }}>
                Cadastrar imóvel
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .page { padding: 50px 0 80px; }
        .head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 30px;
        }
        .kicker {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--terracotta);
          font-weight: 500;
        }
        h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-top: 12px;
        }
        .italic { font-style: italic; color: var(--teal-deep); }
        .stats { display: flex; gap: 32px; }
        .stat .n {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: var(--teal-deep);
          font-style: italic;
          line-height: 1;
        }
        .stat .l {
          font-size: 0.75rem;
          color: var(--stone);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 6px;
        }

        .tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--whisper);
        }
        .tab {
          padding: 12px 22px;
          color: var(--graphite);
          font-weight: 500;
          font-size: 0.9rem;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .tab:hover { color: var(--ink); }
        .tab.active {
          color: var(--ink);
          border-bottom-color: var(--teal-deep);
        }

        .lista { display: flex; flex-direction: column; gap: 12px; }
        .vazio {
          text-align: center;
          padding: 60px 20px;
          color: var(--graphite);
        }

        .row {
          display: flex;
          gap: 20px;
          padding: 20px;
          background: var(--cream);
          border: 1px solid var(--whisper);
          border-radius: 12px;
          align-items: center;
        }
        .row-foto {
          width: 100px;
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          background: var(--ivory);
          flex-shrink: 0;
        }
        .row-foto img { width: 100%; height: 100%; object-fit: cover; }
        .row-info { flex: 1; min-width: 0; }
        .row-tags { display: flex; gap: 6px; margin-bottom: 6px; }
        .row-info h3 {
          font-size: 1.15rem;
          margin-bottom: 4px;
        }
        .row-meta {
          font-size: 0.85rem;
          color: var(--graphite);
        }
        .row-acoes { display: flex; gap: 8px; }
        .acao {
          padding: 8px 16px;
          background: var(--ivory);
          color: var(--ink);
          border-radius: 8px;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .acao:hover { background: var(--whisper); }
        .acao.danger { color: #b91c1c; }
        .acao.danger:hover { background: #fef2f2; }

        .lead {
          padding: 20px;
          background: var(--cream);
          border: 1px solid var(--whisper);
          border-radius: 12px;
        }
        .lead-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .lead-head h3 { font-size: 1.15rem; }
        .lead-info {
          display: flex;
          gap: 20px;
          font-size: 0.85rem;
          color: var(--graphite);
          flex-wrap: wrap;
        }
        .lead-msg {
          margin-top: 12px;
          padding: 12px;
          background: var(--ivory);
          border-radius: 8px;
          font-family: var(--font-display);
          font-style: italic;
          color: var(--graphite);
        }

        .form-novo {
          background: var(--cream);
          border: 1px solid var(--whisper);
          border-radius: 14px;
          padding: 30px;
        }
        .grid-form {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .campo.full { grid-column: 1 / -1; }
        .campo label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--stone);
          margin-bottom: 6px;
        }
        .campo input, .campo select, .campo textarea {
          width: 100%;
          padding: 10px 12px;
          background: var(--ivory);
          border: 1px solid transparent;
          border-radius: 8px;
          font-family: inherit;
          color: var(--ink);
          outline: none;
        }
        .campo input:focus, .campo select:focus, .campo textarea:focus { border-color: var(--teal); }

        @media (max-width: 720px) {
          .grid-form { grid-template-columns: 1fr; }
          .row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  )
}
