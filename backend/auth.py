"""
Autenticação JWT pra corretores.
"""
import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models import Corretor

# Configuração — em produção, coloque num .env
SECRET_KEY = os.getenv("SECRET_KEY", "troque-essa-chave-em-producao-com-algo-bem-aleatorio")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 dias

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)


def verificar_senha(senha: str, hash_armazenado: str) -> bool:
    return pwd_context.verify(senha, hash_armazenado)


def criar_token(data: dict) -> str:
    payload = data.copy()
    expira = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expira})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_corretor_atual(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Optional[Corretor]:
    """Retorna o corretor logado (None se não estiver autenticado)."""
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        corretor_id: int = payload.get("sub")
        if corretor_id is None:
            return None
    except JWTError:
        return None
    return db.query(Corretor).filter(Corretor.id == corretor_id).first()


def exigir_corretor(
    corretor: Optional[Corretor] = Depends(get_corretor_atual),
) -> Corretor:
    """Mesmo que get_corretor_atual, mas levanta 401 se não estiver logado."""
    if corretor is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não autenticado",
        )
    return corretor
