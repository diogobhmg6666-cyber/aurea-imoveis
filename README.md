# Aurea Imóveis

Site completo de imobiliária com **agente de IA integrado**, construído como base sólida pra evoluir.

A Aurea (a IA assistente da casa) atende clientes em qualquer página, busca imóveis no catálogo real, registra leads quando há interesse, e ajuda corretores autenticados a cadastrar/editar imóveis por **conversa natural**.

---

## Stack

**Backend** — Python + FastAPI + SQLAlchemy + SQLite + Claude API (tool use)
**Frontend** — Next.js 14 + TypeScript + CSS-in-JS (styled-jsx)
**Autenticação** — JWT (corretores)
**Modelo de IA** — `claude-opus-4-7` (configurável em `backend/agent.py`)

---

## Estrutura

```
imobiliaria/
├── backend/
│   ├── main.py              # rotas FastAPI
│   ├── agent.py             # loop de tool use com Claude
│   ├── agent_tools.py       # ferramentas do agente (com controle de permissão)
│   ├── models.py            # Imovel, Corretor, Lead
│   ├── schemas.py           # validação Pydantic
│   ├── auth.py              # JWT + bcrypt
│   ├── database.py          # SQLAlchemy engine
│   ├── seed.py              # popula banco com dados demo
│   └── requirements.txt
└── frontend/
    ├── pages/
    │   ├── index.tsx              # home com hero + destaques
    │   ├── imoveis/
    │   │   ├── index.tsx          # lista com filtros
    │   │   └── [id].tsx           # página de detalhes
    │   ├── corretor/
    │   │   ├── login.tsx
    │   │   ├── cadastro.tsx
    │   │   └── index.tsx          # painel (imóveis + leads + novo)
    │   ├── sobre.tsx
    │   └── contato.tsx
    ├── components/
    │   ├── Layout.tsx             # header + footer
    │   ├── ChatWidget.tsx         # chat flutuante com Aurea
    │   └── ImovelCard.tsx
    ├── lib/api.ts                 # cliente da API
    └── styles/globals.css         # design tokens
```

---

## Como rodar

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# defina sua chave da Anthropic (https://console.anthropic.com/)
export ANTHROPIC_API_KEY="sk-ant-..."

# popula o banco com corretor demo + 8 imóveis em BH
python seed.py

# sobe a API em http://localhost:8000
uvicorn main:app --reload
```

A documentação interativa fica em `http://localhost:8000/docs`.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:3000`.

---

## Credenciais demo

```
E-mail:  corretor@aurea.com
Senha:   aurea123
```

Ou crie sua própria conta em `/corretor/cadastro`.

---

## Como usar o chat IA

O botão **"Fale com a Aurea"** fica fixo no canto inferior direito de **todas as páginas**.

A Aurea muda de comportamento conforme o contexto:

### Como cliente (não logado)
Tem acesso a:
- **buscar_imoveis** — filtra catálogo por cidade, bairro, tipo, operação, quartos, preço
- **detalhar_imovel** — mostra detalhes completos de um imóvel
- **registrar_lead** — cria lead quando o cliente fornece nome/e-mail/telefone

Experimente:
> "Quero apartamento em Lourdes, 3 quartos, até 1 milhão"
> "Tem casa pra alugar em BH?"
> "Me conta mais sobre aquela cobertura"

### Como corretor (logado)
Ganha 3 ferramentas adicionais:
- **cadastrar_imovel** — cria imóvel via conversa
- **atualizar_imovel** — edita preço/descrição/etc
- **listar_meus_imoveis** — lista os imóveis do corretor

Experimente (depois de fazer login):
> "Cadastra um apartamento em Funcionários, 2 quartos, 78m², R$ 520 mil"
> "Lista meus imóveis"
> "Reduz o preço do imóvel 3 para 750 mil"

---

## Endpoints da API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET  | `/imoveis` | público | Lista imóveis (com filtros via query params) |
| GET  | `/imoveis/{id}` | público | Detalhes de um imóvel |
| POST | `/leads` | público | Registra lead |
| POST | `/auth/register` | público | Cadastra corretor |
| POST | `/auth/login` | público | Login (retorna JWT) |
| GET  | `/auth/me` | corretor | Dados do corretor logado |
| GET  | `/corretor/imoveis` | corretor | Meus imóveis |
| POST | `/corretor/imoveis` | corretor | Cadastrar imóvel |
| PATCH | `/corretor/imoveis/{id}` | corretor | Editar imóvel |
| DELETE | `/corretor/imoveis/{id}` | corretor | Deletar imóvel |
| GET  | `/corretor/leads` | corretor | Leads recebidos |
| POST | `/chat` | ambos | Conversa com a IA (role auto-detectado) |

---

## Adaptar pra produção

Algumas mudanças sugeridas antes de hospedar:

**Backend**
- Trocar SQLite por **Postgres** — só mude `DATABASE_URL` (ex: `postgresql+psycopg2://...`)
- Restringir CORS em `main.py` ao domínio do frontend
- Trocar `SECRET_KEY` por algo aleatório forte (em `.env`)
- Adicionar rate limiting nos endpoints públicos (especialmente `/chat` e `/leads`)
- Adicionar logs estruturados (loguru, structlog)

**Frontend**
- Setar `NEXT_PUBLIC_API_URL` apontando pra URL pública da API
- Rodar `npm run build && npm start` em produção
- Adicionar Plausible/PostHog pra analytics

**Hospedagem sugerida**
- Backend: Railway, Render, Fly.io
- Frontend: Vercel (Next.js nativo)
- Banco: Supabase ou Neon (Postgres gerenciado)

---

## Próximos passos

Ideias pra evoluir o projeto:

- Upload de imagens (S3/Cloudinary) ao invés de URLs manuais
- Sistema de favoritos pra clientes (sem precisar criar conta — usar localStorage)
- Histórico de conversas do chat persistido por sessão
- Tour virtual / vídeos no detalhe do imóvel
- Sistema de visitas agendadas com calendário
- Notificação por e-mail/WhatsApp quando o corretor recebe lead
- Mapa interativo na lista de imóveis (Leaflet/Mapbox)
- Comparador de imóveis (lado a lado)
- Filtros mais avançados (próximo a escolas/metrô, financiamento aceito)
