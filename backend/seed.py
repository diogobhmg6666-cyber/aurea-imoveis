"""
Popula o banco de dados com dados iniciais pra demo.
Rode com: python seed.py
"""
from database import SessionLocal, engine, Base
from models import Corretor, Imovel
from auth import hash_senha


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Apaga dados antigos pra começar limpo
    db.query(Imovel).delete()
    db.query(Corretor).delete()
    db.commit()

    # Corretor demo
    corretor = Corretor(
        nome="Marina Costa",
        email="corretor@aurea.com",
        senha_hash=hash_senha("aurea123"),
        telefone="(31) 99999-0000",
        creci="CRECI-MG 12345",
    )
    db.add(corretor)
    db.commit()
    db.refresh(corretor)

    imoveis = [
        dict(
            titulo="Apartamento moderno em Savassi",
            descricao="Apartamento com vista para o parque, 2 suítes, varanda gourmet integrada e área de lazer completa com piscina aquecida e fitness 24h.",
            tipo="apartamento", operacao="venda",
            cidade="Belo Horizonte", bairro="Savassi", endereco="Rua Antônio de Albuquerque, 800",
            quartos=3, banheiros=2, vagas=2, area_m2=110,
            preco=850000, condominio=1200, iptu=380,
            fotos=[
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
                "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200",
            ],
            destaque=True,
        ),
        dict(
            titulo="Casa térrea no Buritis",
            descricao="Casa térrea com amplo quintal, área gourmet, piscina e 4 quartos sendo uma suíte master com closet.",
            tipo="casa", operacao="venda",
            cidade="Belo Horizonte", bairro="Buritis", endereco="Rua das Acácias, 245",
            quartos=4, banheiros=3, vagas=3, area_m2=220,
            preco=1250000, iptu=520,
            fotos=[
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
            ],
            destaque=True,
        ),
        dict(
            titulo="Studio mobiliado no Centro",
            descricao="Studio totalmente mobiliado a 200m do metrô, ideal pra profissionais e estudantes. Pronto pra morar.",
            tipo="studio", operacao="aluguel",
            cidade="Belo Horizonte", bairro="Centro", endereco="Av. Afonso Pena, 1500",
            quartos=1, banheiros=1, vagas=0, area_m2=35,
            preco=1800, condominio=450, iptu=80,
            fotos=[
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
            ],
        ),
        dict(
            titulo="Cobertura duplex em Lourdes",
            descricao="Cobertura duplex com piscina privativa, churrasqueira gourmet e vista panorâmica 360º da cidade. Acabamento de altíssimo padrão.",
            tipo="cobertura", operacao="venda",
            cidade="Belo Horizonte", bairro="Lourdes", endereco="Av. do Contorno, 6500",
            quartos=4, banheiros=4, vagas=4, area_m2=320,
            preco=2800000, condominio=2800, iptu=1200,
            fotos=[
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
            ],
            destaque=True,
        ),
        dict(
            titulo="Apartamento 2 quartos em Funcionários",
            descricao="Apartamento aconchegante, recém-reformado, próximo ao Mercado Central e bons restaurantes.",
            tipo="apartamento", operacao="venda",
            cidade="Belo Horizonte", bairro="Funcionários", endereco="Rua Tomé de Souza, 1100",
            quartos=2, banheiros=2, vagas=1, area_m2=78,
            preco=520000, condominio=680, iptu=210,
            fotos=[
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
            ],
        ),
        dict(
            titulo="Casa em condomínio fechado — Nova Lima",
            descricao="Casa em condomínio de alto padrão com segurança 24h, área verde preservada e quadra esportiva.",
            tipo="casa", operacao="venda",
            cidade="Nova Lima", bairro="Vale do Sereno", endereco="Alameda das Sibipirunas, 88",
            quartos=4, banheiros=4, vagas=4, area_m2=380,
            preco=2200000, condominio=1500, iptu=950,
            fotos=[
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
                "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200",
            ],
        ),
        dict(
            titulo="Apartamento 1 quarto em Lourdes",
            descricao="Apartamento compacto e bem-iluminado, mobiliado, pronto pra alugar.",
            tipo="apartamento", operacao="aluguel",
            cidade="Belo Horizonte", bairro="Lourdes", endereco="Rua Curitiba, 1800",
            quartos=1, banheiros=1, vagas=1, area_m2=48,
            preco=2500, condominio=550, iptu=120,
            fotos=[
                "https://images.unsplash.com/photo-1522444195799-478538b28823?w=1200",
            ],
        ),
        dict(
            titulo="Loft industrial no Sion",
            descricao="Loft estilo industrial com pé-direito duplo, mezanino e acabamento em cimento queimado. Único no bairro.",
            tipo="apartamento", operacao="venda",
            cidade="Belo Horizonte", bairro="Sion", endereco="Av. Afonso Pena, 4200",
            quartos=2, banheiros=2, vagas=2, area_m2=130,
            preco=950000, condominio=1100, iptu=420,
            fotos=[
                "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200",
            ],
            destaque=True,
        ),
    ]

    for dados in imoveis:
        db.add(Imovel(corretor_id=corretor.id, **dados))

    db.commit()
    db.close()
    print(f"✅ Banco populado: 1 corretor, {len(imoveis)} imóveis.")
    print("Login do corretor: corretor@aurea.com / aurea123")


if __name__ == "__main__":
    seed()
