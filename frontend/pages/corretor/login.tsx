import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { login } from '@/lib/api'

export default function LoginCorretor() {
  const router = useRouter()
  const [email, setEmail] = useState('corretor@aurea.com')
  const [senha, setSenha] = useState('aurea123')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const { access_token, nome } = await login(email, senha)
      localStorage.setItem('token', access_token)
      localStorage.setItem('nome', nome)
      router.push('/corretor')
    } catch (err: any) {
      setErro('E-mail ou senha inválidos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="page">
      <div className="container login-wrap">
        <div className="card fade-up">
          <span className="kicker">Área restrita</span>
          <h1>Bem-vindo de volta,<br/><span className="italic">corretor.</span></h1>
          <p className="sub">Entre pra gerenciar seus imóveis e leads.</p>

          <form onSubmit={entrar}>
            <div className="campo">
              <label>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="campo">
              <label>Senha</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>

            {erro && <div className="erro">{erro}</div>}

            <button type="submit" disabled={carregando} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {carregando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="rodape">
            Ainda não tem conta? <Link href="/corretor/cadastro">Cadastre-se</Link>
          </p>

          <div className="demo">
            <strong>Demo:</strong> corretor@aurea.com / aurea123
          </div>
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

        .campo { margin-bottom: 16px; }
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

        .demo {
          margin-top: 30px;
          padding: 12px 16px;
          background: var(--ivory);
          border-radius: 10px;
          font-size: 0.8rem;
          color: var(--graphite);
          text-align: center;
        }
      `}</style>
    </div>
  )
}
