import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { register } from '@/lib/api'

export default function CadastroCorretor() {
  const router = useRouter()
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '', creci: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const { access_token, nome } = await register(form)
      localStorage.setItem('token', access_token)
      localStorage.setItem('nome', nome)
      router.push('/corretor')
    } catch (err: any) {
      setErro(err.message || 'Erro ao cadastrar.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="page">
      <div className="container login-wrap">
        <div className="card fade-up">
          <span className="kicker">Cadastro de corretor</span>
          <h1>Junte-se à <span className="italic">Aurea</span></h1>
          <p className="sub">Crie sua conta e comece a anunciar seus imóveis.</p>

          <form onSubmit={cadastrar}>
            <div className="campo">
              <label>Nome completo</label>
              <input type="text" required value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
            </div>
            <div className="campo">
              <label>E-mail</label>
              <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="campo">
              <label>Senha</label>
              <input type="password" required minLength={6} value={form.senha} onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))} />
            </div>
            <div className="campo">
              <label>Telefone</label>
              <input type="tel" value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} />
            </div>
            <div className="campo">
              <label>CRECI</label>
              <input type="text" value={form.creci} onChange={(e) => setForm((f) => ({ ...f, creci: e.target.value }))} />
            </div>

            {erro && <div className="erro">{erro}</div>}

            <button type="submit" disabled={carregando} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {carregando ? 'Criando…' : 'Criar conta'}
            </button>
          </form>

          <p className="rodape">
            Já tem conta? <Link href="/corretor/login">Faça login</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .page { padding: 80px 0; min-height: 70vh; }
        .login-wrap { max-width: 480px; margin: 0 auto; }
        .card {
          background: var(--cream);
          border: 1px solid var(--whisper);
          border-radius: 18px;
          padding: 48px 40px;
        }
        .kicker {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--terracotta);
          font-weight: 500;
        }
        h1 {
          font-size: 2.4rem;
          line-height: 1.1;
          margin: 14px 0 12px;
        }
        .italic { font-style: italic; color: var(--teal-deep); }
        .sub { color: var(--graphite); margin-bottom: 32px; }

        .campo { margin-bottom: 14px; }
        .campo label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--stone);
          margin-bottom: 6px;
        }
        .campo input {
          width: 100%;
          padding: 12px 14px;
          background: var(--ivory);
          border: 1px solid transparent;
          border-radius: 10px;
          color: var(--ink);
          outline: none;
        }
        .campo input:focus { border-color: var(--teal); }

        .erro {
          padding: 10px 14px;
          background: #fef2f2;
          color: #b91c1c;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .rodape {
          text-align: center;
          margin-top: 24px;
          font-size: 0.9rem;
          color: var(--graphite);
        }
        .rodape a { color: var(--terracotta); font-weight: 500; }
      `}</style>
    </div>
  )
}
