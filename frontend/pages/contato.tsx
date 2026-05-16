import { useState } from 'react'

export default function Contato() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [enviado, setEnviado] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await fetch(`${API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome, email: form.email,
          telefone: form.telefone, interesse: form.mensagem,
        }),
      })
      setEnviado(true)
    } catch {
      alert('Erro ao enviar.')
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="layout">
          <div className="lado fade-up">
            <span className="kicker">Fale conosco</span>
            <h1>Vamos <span className="italic">conversar</span>.</h1>
            <p className="intro">
              Pra dúvidas, parcerias, ou se você quer anunciar seu imóvel —
              deixe uma mensagem e nossa equipe responde rapidinho.
            </p>

            <div className="info">
              <div className="info-item">
                <div className="info-lbl">Endereço</div>
                <div className="info-val">Av. do Contorno, 6500 — sala 1208<br/>Funcionários · Belo Horizonte</div>
              </div>
              <div className="info-item">
                <div className="info-lbl">Telefone</div>
                <div className="info-val">+55 31 0000-0000</div>
              </div>
              <div className="info-item">
                <div className="info-lbl">E-mail</div>
                <div className="info-val">contato@aurea.com</div>
              </div>
              <div className="info-item">
                <div className="info-lbl">Atendimento</div>
                <div className="info-val">Segunda a sábado, 9h–19h<br/><strong>IA Aurea: 24 horas</strong></div>
              </div>
            </div>
          </div>

          <div className="form-wrap fade-up" style={{ animationDelay: '150ms' }}>
            {enviado ? (
              <div className="ok">
                <div className="ok-ico">✦</div>
                <h2>Recebemos!</h2>
                <p>Sua mensagem chegou pra nossa equipe.<br/>Em breve entraremos em contato.</p>
              </div>
            ) : (
              <form onSubmit={enviar}>
                <h2>Envie sua mensagem</h2>
                <div className="campo">
                  <label>Nome</label>
                  <input
                    type="text" required
                    value={form.nome}
                    onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  />
                </div>
                <div className="campo">
                  <label>E-mail</label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="campo">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={form.telefone}
                    onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                  />
                </div>
                <div className="campo">
                  <label>Mensagem</label>
                  <textarea
                    rows={5} required
                    value={form.mensagem}
                    onChange={(e) => setForm((f) => ({ ...f, mensagem: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Enviar mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page { padding: 60px 0 100px; }
        .layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .kicker {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--terracotta);
          font-weight: 500;
        }
        h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin: 16px 0 24px;
          line-height: 1.05;
        }
        .italic { font-style: italic; color: var(--teal-deep); }
        .intro {
          font-size: 1.1rem;
          color: var(--graphite);
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .info { display: flex; flex-direction: column; gap: 24px; }
        .info-lbl {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--stone);
          margin-bottom: 6px;
        }
        .info-val {
          font-family: var(--font-display);
          font-size: 1.15rem;
          color: var(--ink);
          line-height: 1.4;
        }
        .info-val strong { color: var(--teal-deep); font-style: italic; font-weight: 500; }

        .form-wrap {
          background: var(--cream);
          border: 1px solid var(--whisper);
          border-radius: 18px;
          padding: 40px;
        }
        .form-wrap h2 {
          font-size: 1.8rem;
          margin-bottom: 24px;
        }
        .campo { margin-bottom: 16px; }
        .campo label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--stone);
          margin-bottom: 6px;
        }
        .campo input, .campo textarea {
          width: 100%;
          padding: 12px 14px;
          background: var(--ivory);
          border: 1px solid transparent;
          border-radius: 10px;
          color: var(--ink);
          outline: none;
          font-family: inherit;
        }
        .campo input:focus, .campo textarea:focus { border-color: var(--teal); }

        .ok {
          text-align: center;
          padding: 60px 20px;
        }
        .ok-ico {
          font-family: var(--font-display);
          font-size: 4rem;
          color: var(--terracotta);
          line-height: 1;
          margin-bottom: 20px;
        }
        .ok h2 {
          font-size: 2rem;
          margin-bottom: 12px;
          color: var(--teal-deep);
        }
        .ok p { color: var(--graphite); }

        @media (max-width: 880px) {
          .layout { grid-template-columns: 1fr; gap: 40px; }
          .form-wrap { padding: 28px; }
        }
      `}</style>
    </div>
  )
}
