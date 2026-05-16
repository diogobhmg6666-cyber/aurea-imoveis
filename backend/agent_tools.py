"""
Ferramentas que o agente de IA pode chamar.
"""
import json
from sqlalchemy.orm import Session
from models import Imovel, Lead


TOOLS = [
    {
        "name": "buscar_imoveis",
        "description": (
            "Busca imóveis disponíveis no catálogo com base em filtros. "
            "Use sempre que o cliente quiser ver opções. Combine vários filtros se possível."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "cidade": {"type": "string"},
                "bairro": {"type": "string"},
                "tipo": {
                    "type": "string",
                    "enum": ["apartamento", "casa", "studio", "cobertura", "terreno"],
                },
                "operacao": {"type": "string", "enum": ["venda", "aluguel"]},
                "quartos_min": {"type": "integer"},
                "preco_min": {"type": "number"},
                "preco_max": {"type": "number"},
            },
            "required": [],
        },
        "access": "cliente",
    },
    {
        "name": "detalhar_imovel",
        "description": "Retorna detalhes completos de um imóvel pelo ID.",
        "input_schema": {
            "type": "object",
            "properties": {"imovel_id": {"type": "integer"}},
            "required": ["imovel_id"],
        },
        "access": "cliente",
    },
    {
        "name": "registrar_lead",
        "description": (
            "Registra contato de um cliente interessado em ser atendido por um corretor. "
            "Use APENAS depois de o cliente fornecer espontaneamente nome, e-mail e telefone, "
            "demonstrando interesse em algum imóvel específico ou em ser contatado."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "nome": {"type": "string"},
                "email": {"type": "string"},
                "telefone": {"type": "string"},
                "interesse": {"type": "string", "description": "O que o cliente busca"},
                "imovel_id": {"type": "integer", "description": "ID do imóvel de interesse, se houver"},
            },
            "required": ["nome", "email", "telefone", "interesse"],
        },
        "access": "cliente",
    },
    {
        "name": "cadastrar_imovel",
        "description": (
            "Cadastra um novo imóvel. Use quando o corretor descrever um imóvel que quer publicar. "
            "Sempre confirme com o corretor todos os dados antes de salvar."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "titulo": {"type": "string"},
                "descricao": {"type": "string"},
                "tipo": {"type": "string", "enum": ["apartamento", "casa", "studio", "cobertura", "terreno"]},
                "operacao": {"type": "string", "enum": ["venda", "aluguel"]},
                "cidade": {"type": "string"},
                "bairro": {"type": "string"},
                "quartos": {"type": "integer"},
                "banheiros": {"type": "integer"},
                "vagas": {"type": "integer"},
                "area_m2": {"type": "number"},
                "preco": {"type": "number"},
            },
            "required": ["titulo", "tipo", "operacao", "cidade", "bairro", "preco"],
        },
        "access": "corretor",
    },
    {
        "name": "atualizar_imovel",
        "description": "Atualiza um imóvel existente (preço, descrição, etc).",
        "input_schema": {
            "type": "object",
            "properties": {
                "imovel_id": {"type": "integer"},
                "mudancas": {"type": "object"},
            },
            "required": ["imovel_id", "mudancas"],
        },
        "access": "corretor",
    },
    {
        "name": "listar_meus_imoveis",
        "description": "Lista todos os imóveis cadastrados pelo corretor logado.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
        "access": "corretor",
    },
]


def get_tools_for_role(role: str) -> list[dict]:
    """Remove o campo `access` (não faz parte da API) e filtra por role."""
    return [
        {k: v for k, v in tool.items() if k != "access"}
        for tool in TOOLS
        if tool["access"] == role or role == "corretor"
    ]


def executar_ferramenta(
    nome: str,
    args: dict,
    role: str,
    db: Session,
    corretor_id: int | None = None,
) -> str:
    """Executa a ferramenta e retorna o resultado como JSON string."""
    tool = next((t for t in TOOLS if t["name"] == nome), None)
    if tool is None:
        return json.dumps({"erro": f"Ferramenta '{nome}' não existe."})

    if tool["access"] == "corretor" and role != "corretor":
        return json.dumps({"erro": "Sem permissão."})

    try:
        if nome == "buscar_imoveis":
            return _buscar(db, args)
        if nome == "detalhar_imovel":
            return _detalhar(db, args["imovel_id"])
        if nome == "registrar_lead":
            return _lead(db, args)
        if nome == "cadastrar_imovel":
            return _cadastrar(db, args, corretor_id)
        if nome == "atualizar_imovel":
            return _atualizar(db, args, corretor_id)
        if nome == "listar_meus_imoveis":
            return _listar_meus(db, corretor_id)
    except Exception as e:
        return json.dumps({"erro": str(e)})

    return json.dumps({"erro": "Não implementada"})


# --- Implementações ---

def _buscar(db: Session, args: dict) -> str:
    q = db.query(Imovel).filter(Imovel.ativo == True)
    if "cidade" in args:
        q = q.filter(Imovel.cidade.ilike(f"%{args['cidade']}%"))
    if "bairro" in args:
        q = q.filter(Imovel.bairro.ilike(f"%{args['bairro']}%"))
    if "tipo" in args:
        q = q.filter(Imovel.tipo == args["tipo"])
    if "operacao" in args:
        q = q.filter(Imovel.operacao == args["operacao"])
    if "quartos_min" in args:
        q = q.filter(Imovel.quartos >= args["quartos_min"])
    if "preco_min" in args:
        q = q.filter(Imovel.preco >= args["preco_min"])
    if "preco_max" in args:
        q = q.filter(Imovel.preco <= args["preco_max"])

    resultados = [i.to_dict() for i in q.limit(10).all()]
    return json.dumps({"total": len(resultados), "imoveis": resultados}, ensure_ascii=False)


def _detalhar(db: Session, imovel_id: int) -> str:
    imovel = db.query(Imovel).filter(Imovel.id == imovel_id).first()
    if not imovel:
        return json.dumps({"erro": "Imóvel não encontrado"})
    return json.dumps(imovel.to_dict(), ensure_ascii=False)


def _lead(db: Session, args: dict) -> str:
    lead = Lead(
        nome=args["nome"],
        email=args["email"],
        telefone=args.get("telefone"),
        interesse=args.get("interesse"),
        imovel_id=args.get("imovel_id"),
        origem="chat",
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return json.dumps({
        "ok": True,
        "mensagem": f"Lead registrado! Um corretor entrará em contato em breve com {args['nome']}.",
        "lead_id": lead.id,
    }, ensure_ascii=False)


def _cadastrar(db: Session, args: dict, corretor_id: int) -> str:
    imovel = Imovel(corretor_id=corretor_id, **args)
    db.add(imovel)
    db.commit()
    db.refresh(imovel)
    return json.dumps({"ok": True, "imovel": imovel.to_dict()}, ensure_ascii=False)


def _atualizar(db: Session, args: dict, corretor_id: int) -> str:
    imovel = db.query(Imovel).filter(
        Imovel.id == args["imovel_id"],
        Imovel.corretor_id == corretor_id,
    ).first()
    if not imovel:
        return json.dumps({"erro": "Imóvel não encontrado ou não é seu"})
    for campo, valor in args["mudancas"].items():
        if hasattr(imovel, campo):
            setattr(imovel, campo, valor)
    db.commit()
    db.refresh(imovel)
    return json.dumps({"ok": True, "imovel": imovel.to_dict()}, ensure_ascii=False)


def _listar_meus(db: Session, corretor_id: int) -> str:
    imoveis = db.query(Imovel).filter(Imovel.corretor_id == corretor_id).all()
    return json.dumps({"total": len(imoveis), "imoveis": [i.to_dict() for i in imoveis]}, ensure_ascii=False)
