const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export type Imovel = {
  id: number
  titulo: string
  descricao?: string
  tipo: string
  operacao: string
  cidade: string
  bairro: string
  endereco?: string
  quartos: number
  banheiros: number
  vagas: number
  area_m2: number
  preco: number
  condominio: number
  iptu: number
  fotos: string[]
  destaque: boolean
  ativo: boolean
}

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const t = localStorage.getItem('token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function fetchImoveis(params: Record<string, any> = {}): Promise<Imovel[]> {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') qs.append(k, String(v))
  }
  const res = await fetch(`${API}/imoveis?${qs}`)
  if (!res.ok) throw new Error('Erro ao buscar imóveis')
  return res.json()
}

export async function fetchImovel(id: number | string): Promise<Imovel> {
  const res = await fetch(`${API}/imoveis/${id}`)
  if (!res.ok) throw new Error('Imóvel não encontrado')
  return res.json()
}

export async function login(email: string, senha: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  })
  if (!res.ok) throw new Error('Credenciais inválidas')
  return res.json()
}

export async function register(payload: any) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Falha no cadastro')
  return res.json()
}

export async function meusImoveis(): Promise<Imovel[]> {
  const res = await fetch(`${API}/corretor/imoveis`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Não autenticado')
  return res.json()
}

export async function criarImovel(payload: Partial<Imovel>): Promise<Imovel> {
  const res = await fetch(`${API}/corretor/imoveis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Erro ao criar imóvel')
  return res.json()
}

export async function editarImovel(id: number, payload: Partial<Imovel>): Promise<Imovel> {
  const res = await fetch(`${API}/corretor/imoveis/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Erro ao editar')
  return res.json()
}

export async function deletarImovel(id: number) {
  const res = await fetch(`${API}/corretor/imoveis/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Erro ao deletar')
  return res.json()
}

export async function meusLeads() {
  const res = await fetch(`${API}/corretor/leads`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Não autenticado')
  return res.json()
}

export async function enviarChat(mensagens: any[], role: 'cliente' | 'corretor', contextoPagina?: any) {
  const res = await fetch(`${API}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ mensagens, role, contexto_pagina: contextoPagina }),
  })
  if (!res.ok) throw new Error('Erro no chat')
  return res.json()
}

export function formatPreco(v: number, operacao?: string): string {
  const sufixo = operacao === 'aluguel' ? '/mês' : ''
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) + sufixo
}
