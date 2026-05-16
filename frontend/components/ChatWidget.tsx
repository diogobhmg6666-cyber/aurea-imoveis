import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { enviarChat } from '@/lib/api'

type Mensagem = { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [texto, setTexto] = useState('')
  const [historico, setHistorico] = useState<any[]>([])
  const [visiveis, setVisiveis] = useState<Mensagem[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou a Aurea, sua assistente. Posso ajudar a encontrar o imóvel ideal pra você. O que está buscando?'
    },
  ])
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visiveis])

  // Detecta se o usuário é corretor logado
  const ehCorretor = typeof window !== 'undefined' && !!localStorage.getItem('token')
  const role: 'cliente' | 'corretor' = ehCorretor && router.pathname.startsWith('/corretor') ? 'corretor' : 'cliente'

  // Contexto da página atual
  const contextoPagina = (() => {
    if (router.pathname.startsWith('/imoveis/') && router.query.id) {
      return { pagina: 'detalhes_imovel', imovel_id: Number(router.query.id) }
    }
    if (router.pathname === '/imoveis') return { pagina: 'lista_imoveis' }
    if (router.pathname === '/') return { pagina: 'home' }
    if (router.pathname.startsWith('/corretor')) return { pagina: 'painel_corretor' }
    return null
  })()

  async function enviar() {
    const msg = texto.trim()
    if (!msg || carregando) return

    setTexto('')
    setVisiveis((m) => [...m, { role: 'user', content: msg }])
    setCarregando(true)

    try {
      const novoHistorico = historico.length === 0
        ? [{ role: 'user', content: msg }]
        : [...historico, { role: 'user', content: msg }]

      const res = await enviarChat(novoHistorico, role, contextoPagina)

      setVisiveis((m) => [...m, { role: 'assistant', content: res.resposta }])
      setHistorico(res.historico)
    } catch (err: any) {
      setVisiveis((m) => [...m, { role: 'assistant', content: '⚠️ Ops, não consegui processar. Tente novamente.' }])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        className={`chat-fab ${aberto ? 'oculto' : ''}`}
        onClick={() => setAberto(true)}
        aria-label="Abrir chat"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Fale com a Aurea</span>
      </button>

      {/* Painel do chat */}
      <div className={`chat-panel ${aberto ? 'visivel' : ''}`}>
        <div className="chat-header">
          <div className="chat-id">
            <div className="avatar">A</div>
            <div>
              <div className="nome">Aurea <span className="badge">IA</span></div>
              <div className="status"><span className="dot"></span> Online agora</div>
            </div>
          </div>
          <button className="fechar" onClick={() => setAberto(false)} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="chat-msgs">
          {visiveis.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.content}
            </div>
          ))}
          {carregando && (
            <div className="msg assistant typing">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={fimRef} />
        </div>

        <form
          className="chat-input"
          onSubmit={(e) => { e.preventDefault(); enviar() }}
        >
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={carregando}
          />
          <button type="submit" disabled={carregando || !texto.trim()} aria-label="Enviar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .chat-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          background: var(--teal-deep);
          color: var(--cream);
          border-radius: 999px;
          font-weight: 500;
          font-size: 0.9rem;
          box-shadow: 0 8px 32px rgba(31, 58, 61, 0.3);
          transition: all 0.3s ease;
        }
        .chat-fab:hover {
          background: var(--teal);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(31, 58, 61, 0.4);
        }
        .chat-fab.oculto {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.8);
        }

        .chat-panel {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 201;
          width: 380px;
          height: 580px;
          max-height: calc(100vh - 56px);
          background: var(--cream);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: scale(0.9) translateY(20px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--whisper);
        }
        .chat-panel.visivel {
          transform: scale(1) translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .chat-header {
          background: var(--teal-deep);
          color: var(--cream);
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .chat-id { display: flex; align-items: center; gap: 12px; }
        .avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--cream);
          color: var(--teal-deep);
          display: grid;
          place-items: center;
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-style: italic;
        }
        .nome {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .badge {
          font-family: var(--font-body);
          font-style: normal;
          font-size: 0.6rem;
          background: var(--terracotta);
          color: var(--cream);
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.1em;
          font-weight: 500;
        }
        .status {
          font-size: 0.7rem;
          color: var(--whisper);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }
        .dot {
          width: 6px; height: 6px;
          background: #6ee7b7;
          border-radius: 50%;
          display: inline-block;
        }
        .fechar {
          color: var(--cream);
          opacity: 0.7;
          padding: 4px;
        }
        .fechar:hover { opacity: 1; }

        .chat-msgs {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--cream);
        }

        .msg {
          max-width: 82%;
          padding: 11px 16px;
          font-size: 0.9rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
          animation: msgIn 0.3s ease-out;
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg.user {
          background: var(--teal-deep);
          color: var(--cream);
          align-self: flex-end;
          border-radius: 18px 18px 4px 18px;
        }
        .msg.assistant {
          background: var(--ivory);
          color: var(--ink);
          align-self: flex-start;
          border-radius: 18px 18px 18px 4px;
        }
        .msg.typing {
          display: flex;
          gap: 4px;
          padding: 14px 16px;
        }
        .msg.typing span {
          width: 6px; height: 6px;
          background: var(--stone);
          border-radius: 50%;
          animation: dot 1.2s infinite;
        }
        .msg.typing span:nth-child(2) { animation-delay: 0.2s; }
        .msg.typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }

        .chat-input {
          display: flex;
          gap: 8px;
          padding: 14px 16px;
          background: var(--cream);
          border-top: 1px solid var(--whisper);
        }
        .chat-input input {
          flex: 1;
          padding: 12px 16px;
          background: var(--ivory);
          border: 1px solid transparent;
          border-radius: 999px;
          outline: none;
          font-size: 0.9rem;
          color: var(--ink);
          transition: border-color 0.2s;
        }
        .chat-input input:focus { border-color: var(--teal); }
        .chat-input button[type="submit"] {
          width: 44px; height: 44px;
          background: var(--teal-deep);
          color: var(--cream);
          border-radius: 50%;
          display: grid;
          place-items: center;
          transition: all 0.2s;
        }
        .chat-input button[type="submit"]:hover:not(:disabled) {
          background: var(--teal);
          transform: scale(1.05);
        }
        .chat-input button[type="submit"]:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chat-fab { bottom: 16px; right: 16px; }
          .chat-fab span { display: none; }
          .chat-fab { padding: 14px; }
          .chat-panel {
            bottom: 0; right: 0; left: 0; top: 0;
            width: 100%; height: 100%;
            max-height: 100%;
            border-radius: 0;
          }
        }
      `}</style>
    </>
  )
}
