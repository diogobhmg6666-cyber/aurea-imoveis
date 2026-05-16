"""
API FastAPI principal: serve o catálogo de imóveis, autenticação de corretores
e o endpoint do chat com o agente de IA.
"""
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import Corretor, Imovel, Lead
from auth import (
    hash_senha, verificar_senha, criar_token,
    get_corretor_atual, exigir_corretor,
)
from agent import chat as agent_chat
import schemas

# Cria tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aurea Imóveis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrinja em produção pro domínio do frontend
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Health ---

@app.get("/")
def root():
    return {"status": "ok", "api": "Aurea Imóveis"}


# --- Imóveis (público) ---

@app.get("/imoveis", response_model=list[schemas.ImovelOut])
def listar_imoveis(
    cidade: Optional[str] = None,
    bairro: Optional[str] = None,
    tipo: Optional[str] = None,
    operacao: Optional[str] = None,
    quartos_min: Optional[int] = None,
    preco_min: Optional[float] = None,
    preco_max: Optional[float] = None,
    destaque: Optional[bool] = None,
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Imovel).filter(Imovel.ativo == True)
    if cidade:
        q = q.filter(Imovel.cidade.ilike(f"%{cidade}%"))
    if bairro:
        q = q.filter(Imovel.bairro.ilike(f"%{bairro}%"))
    if tipo:
        q = q.filter(Imovel.tipo == tipo)
    if operacao:
        q = q.filter(Imovel.operacao == operacao)
    if quartos_min is not None:
        q = q.filter(Imovel.quartos >= quartos_min)
    if preco_min is not None:
        q = q.filter(Imovel.preco >= preco_min)
    if preco_max is not None:
        q = q.filter(Imovel.preco <= preco_max)
    if destaque is not None:
        q = q.filter(Imovel.destaque == destaque)
    return q.limit(limit).all()


@app.get("/imoveis/{imovel_id}", response_model=schemas.ImovelOut)
def detalhar(imovel_id: int, db: Session = Depends(get_db)):
    imovel = db.query(Imovel).filter(Imovel.id == imovel_id).first()
    if not imovel:
        raise HTTPException(404, "Imóvel não encontrado")
    return imovel


# --- Leads (público) ---

@app.post("/leads")
def criar_lead(payload: schemas.LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(**payload.model_dump(), origem="formulario")
    db.add(lead)
    db.commit()
    return {"ok": True, "id": lead.id}


# --- Autenticação ---

@app.post("/auth/register", response_model=schemas.Token)
def register(payload: schemas.CorretorRegister, db: Session = Depends(get_db)):
    if db.query(Corretor).filter(Corretor.email == payload.email).first():
        raise HTTPException(400, "E-mail já cadastrado")

    corretor = Corretor(
        nome=payload.nome,
        email=payload.email,
        senha_hash=hash_senha(payload.senha),
        telefone=payload.telefone,
        creci=payload.creci,
    )
    db.add(corretor)
    db.commit()
    db.refresh(corretor)

    token = criar_token({"sub": corretor.id})
    return {"access_token": token, "nome": corretor.nome}


@app.post("/auth/login", response_model=schemas.Token)
def login(payload: schemas.CorretorLogin, db: Session = Depends(get_db)):
    corretor = db.query(Corretor).filter(Corretor.email == payload.email).first()
    if not corretor or not verificar_senha(payload.senha, corretor.senha_hash):
        raise HTTPException(401, "E-mail ou senha inválidos")

    token = criar_token({"sub": corretor.id})
    return {"access_token": token, "nome": corretor.nome}


@app.get("/auth/me")
def me(corretor: Corretor = Depends(exigir_corretor)):
    return {"id": corretor.id, "nome": corretor.nome, "email": corretor.email}


# --- Painel do corretor ---

@app.get("/corretor/imoveis", response_model=list[schemas.ImovelOut])
def meus_imoveis(
    corretor: Corretor = Depends(exigir_corretor),
    db: Session = Depends(get_db),
):
    return db.query(Imovel).filter(Imovel.corretor_id == corretor.id).all()


@app.post("/corretor/imoveis", response_model=schemas.ImovelOut)
def criar_imovel(
    payload: schemas.ImovelCreate,
    corretor: Corretor = Depends(exigir_corretor),
    db: Session = Depends(get_db),
):
    imovel = Imovel(**payload.model_dump(), corretor_id=corretor.id)
    db.add(imovel)
    db.commit()
    db.refresh(imovel)
    return imovel


@app.patch("/corretor/imoveis/{imovel_id}", response_model=schemas.ImovelOut)
def editar_imovel(
    imovel_id: int,
    payload: schemas.ImovelUpdate,
    corretor: Corretor = Depends(exigir_corretor),
    db: Session = Depends(get_db),
):
    imovel = db.query(Imovel).filter(
        Imovel.id == imovel_id, Imovel.corretor_id == corretor.id
    ).first()
    if not imovel:
        raise HTTPException(404, "Imóvel não encontrado")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(imovel, campo, valor)
    db.commit()
    db.refresh(imovel)
    return imovel


@app.delete("/corretor/imoveis/{imovel_id}")
def deletar_imovel(
    imovel_id: int,
    corretor: Corretor = Depends(exigir_corretor),
    db: Session = Depends(get_db),
):
    imovel = db.query(Imovel).filter(
        Imovel.id == imovel_id, Imovel.corretor_id == corretor.id
    ).first()
    if not imovel:
        raise HTTPException(404, "Imóvel não encontrado")
    db.delete(imovel)
    db.commit()
    return {"ok": True}


@app.get("/corretor/leads")
def meus_leads(
    corretor: Corretor = Depends(exigir_corretor),
    db: Session = Depends(get_db),
):
    # Leads ligados a imóveis desse corretor + leads gerais
    leads = (
        db.query(Lead)
        .outerjoin(Imovel, Lead.imovel_id == Imovel.id)
        .filter((Imovel.corretor_id == corretor.id) | (Lead.imovel_id.is_(None)))
        .order_by(Lead.criado_em.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "id": l.id, "nome": l.nome, "email": l.email,
            "telefone": l.telefone, "interesse": l.interesse,
            "imovel_id": l.imovel_id, "origem": l.origem,
            "criado_em": l.criado_em.isoformat() if l.criado_em else None,
        }
        for l in leads
    ]


# --- Chat ---

@app.post("/chat", response_model=schemas.ChatResponse)
def chat_endpoint(
    req: schemas.ChatRequest,
    corretor: Optional[Corretor] = Depends(get_corretor_atual),
    db: Session = Depends(get_db),
):
    # Validação de role: só pode usar role "corretor" se realmente estiver logado
    role = req.role
    if role == "corretor" and corretor is None:
        role = "cliente"

    corretor_id = corretor.id if corretor else None
    mensagens = [m.model_dump() for m in req.mensagens]

    resultado = agent_chat(
        mensagens=mensagens,
        role=role,
        db=db,
        corretor_id=corretor_id,
        contexto_pagina=req.contexto_pagina,
    )

    return schemas.ChatResponse(
        resposta=resultado["resposta"],
        ferramentas_usadas=resultado["ferramentas_usadas"],
        historico=[_serializa(m) for m in resultado["mensagens"]],
    )


def _serializa(msg: dict) -> dict:
    content = msg["content"]
    if isinstance(content, str):
        return msg
    novo = []
    for bloco in content:
        if isinstance(bloco, dict):
            novo.append(bloco)
        elif hasattr(bloco, "model_dump"):
            novo.append(bloco.model_dump())
        else:
            novo.append(dict(bloco))
    return {"role": msg["role"], "content": novo}
