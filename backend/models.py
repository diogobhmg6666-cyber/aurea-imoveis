"""
Models do banco de dados.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base


class Corretor(Base):
    __tablename__ = "corretores"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    telefone = Column(String)
    creci = Column(String)
    criado_em = Column(DateTime, default=datetime.utcnow)

    imoveis = relationship("Imovel", back_populates="corretor")


class Imovel(Base):
    __tablename__ = "imoveis"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False, index=True)
    descricao = Column(Text)

    # tipo e operação
    tipo = Column(String, nullable=False, index=True)         # apartamento, casa, studio, cobertura, terreno
    operacao = Column(String, nullable=False, index=True)     # venda, aluguel

    # localização
    cidade = Column(String, nullable=False, index=True)
    bairro = Column(String, nullable=False, index=True)
    endereco = Column(String)

    # características
    quartos = Column(Integer, default=0)
    banheiros = Column(Integer, default=0)
    vagas = Column(Integer, default=0)
    area_m2 = Column(Float, default=0)

    # preço
    preco = Column(Float, nullable=False, index=True)
    condominio = Column(Float, default=0)
    iptu = Column(Float, default=0)

    # mídia (lista de URLs)
    fotos = Column(JSON, default=list)

    # metadata
    destaque = Column(Boolean, default=False)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=datetime.utcnow)

    corretor_id = Column(Integer, ForeignKey("corretores.id"))
    corretor = relationship("Corretor", back_populates="imoveis")

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "descricao": self.descricao,
            "tipo": self.tipo,
            "operacao": self.operacao,
            "cidade": self.cidade,
            "bairro": self.bairro,
            "endereco": self.endereco,
            "quartos": self.quartos,
            "banheiros": self.banheiros,
            "vagas": self.vagas,
            "area_m2": self.area_m2,
            "preco": self.preco,
            "condominio": self.condominio,
            "iptu": self.iptu,
            "fotos": self.fotos or [],
            "destaque": self.destaque,
            "ativo": self.ativo,
        }


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, nullable=False)
    telefone = Column(String)
    interesse = Column(Text)
    imovel_id = Column(Integer, ForeignKey("imoveis.id"), nullable=True)
    origem = Column(String, default="chat")  # chat, formulario, etc
    criado_em = Column(DateTime, default=datetime.utcnow)
