"""
Schemas Pydantic — definem o formato de entrada e saída da API.
"""
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr


# --- Imóveis ---

class ImovelBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    tipo: Literal["apartamento", "casa", "studio", "cobertura", "terreno"]
    operacao: Literal["venda", "aluguel"]
    cidade: str
    bairro: str
    endereco: Optional[str] = None
    quartos: int = 0
    banheiros: int = 0
    vagas: int = 0
    area_m2: float = 0
    preco: float
    condominio: float = 0
    iptu: float = 0
    fotos: list[str] = []
    destaque: bool = False
    ativo: bool = True


class ImovelCreate(ImovelBase):
    pass


class ImovelUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    tipo: Optional[str] = None
    operacao: Optional[str] = None
    cidade: Optional[str] = None
    bairro: Optional[str] = None
    endereco: Optional[str] = None
    quartos: Optional[int] = None
    banheiros: Optional[int] = None
    vagas: Optional[int] = None
    area_m2: Optional[float] = None
    preco: Optional[float] = None
    condominio: Optional[float] = None
    iptu: Optional[float] = None
    fotos: Optional[list[str]] = None
    destaque: Optional[bool] = None
    ativo: Optional[bool] = None


class ImovelOut(ImovelBase):
    id: int

    class Config:
        from_attributes = True


# --- Auth ---

class CorretorRegister(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    telefone: Optional[str] = None
    creci: Optional[str] = None


class CorretorLogin(BaseModel):
    email: EmailStr
    senha: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    nome: str


# --- Chat ---

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str | list


class ChatRequest(BaseModel):
    mensagens: list[ChatMessage]
    role: Literal["cliente", "corretor"] = "cliente"
    contexto_pagina: Optional[dict] = None  # ex: {"imovel_id": 5} se o usuário está numa página de detalhes


class ChatResponse(BaseModel):
    resposta: str
    ferramentas_usadas: list[str]
    historico: list[dict]


# --- Leads ---

class LeadCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None
    interesse: Optional[str] = None
    imovel_id: Optional[int] = None
