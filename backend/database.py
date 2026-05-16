"""
Configuração do banco de dados.
Usa SQLite por padrão (arquivo local), mas é fácil trocar pra Postgres
mudando a DATABASE_URL.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./imobiliaria.db")

# `check_same_thread` só é necessário pro SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency do FastAPI: abre uma sessão por request e fecha no fim."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
