"""
Agente Claude: faz o loop de tool use até produzir resposta final.
Personalizado pra Bem Morar Imóveis com a assistente Judite.
"""
from anthropic import Anthropic
from sqlalchemy.orm import Session
from agent_tools import get_tools_for_role, executar_ferramenta

client = Anthropic()

MODEL = "claude-haiku-4-5-20251001"  # modelo mais barato e rápido; trocável por claude-opus-4-7 se quiser mais sofisticação
MAX_TOKENS = 1024
MAX_ITERACOES = 6


def system_prompt(role: str, contexto_pagina: dict | None) -> str:
    base = """Você é a Judite, assistente virtual da Bem Morar Imóveis — uma imobiliária acolhedora, próxima e que valoriza o cuidado com cada cliente.

Seu tom é:
- Caloroso, cordial, brasileiro
- Direto sem ser frio
- Profissional sem ser engessado
- Use português brasileiro natural, pode chamar a pessoa pelo nome se ela disser

Sempre use as ferramentas disponíveis pra dar respostas baseadas em dados REAIS — nunca invente imóveis, preços ou disponibilidade.

Ao listar imóveis, seja objetiva e clara: título, bairro, quartos e preço formatado em R$.
Nunca exiba IDs internos pra clientes.
Pode usar emojis com moderação (🏠 ✨ 💛) pra deixar a conversa mais leve, mas sem exagerar."""

    if role == "cliente":
        base += """

Você está atendendo um VISITANTE do site. Seu trabalho:
1. Entender o que ele busca, sem ser invasiva nem fazer muitas perguntas de uma vez
2. Mostrar imóveis que combinem com o perfil dele
3. Tirar dúvidas sobre os imóveis usando as ferramentas
4. Se houver interesse claro, oferecer contato com um corretor humano

IMPORTANTE: NUNCA peça dados pessoais (nome, e-mail, telefone) sem antes ter conversado um pouco e identificado interesse genuíno. Quando pedir, explique o motivo: 'pra um corretor entrar em contato com você sobre esse imóvel'."""

    elif role == "corretor":
        base += """

Você está atendendo um CORRETOR autenticado da Bem Morar. Seu trabalho:
1. Cadastrar e gerenciar imóveis via conversa natural
2. Antes de salvar qualquer cadastro ou alteração, RESUMIR todos os dados e CONFIRMAR
3. Ser eficiente e profissional, sem perguntas desnecessárias"""

    if contexto_pagina:
        base += f"\n\nCONTEXTO ATUAL: o usuário está navegando em {contexto_pagina}"

    return base


def chat(
    mensagens: list[dict],
    role: str,
    db: Session,
    corretor_id: int | None = None,
    contexto_pagina: dict | None = None,
) -> dict:
    tools = get_tools_for_role(role)
    sistema = system_prompt(role, contexto_pagina)

    ferramentas_usadas: list[str] = []
    iteracao = 0

    while iteracao < MAX_ITERACOES:
        iteracao += 1

        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=sistema,
            tools=tools,
            messages=mensagens,
        )

        mensagens.append({"role": "assistant", "content": response.content})

        if response.stop_reason != "tool_use":
            texto = "".join(b.text for b in response.content if b.type == "text")
            return {
                "resposta": texto,
                "ferramentas_usadas": ferramentas_usadas,
                "mensagens": mensagens,
            }

        # Executar tools pedidas
        tool_results = []
        for bloco in response.content:
            if bloco.type == "tool_use":
                ferramentas_usadas.append(bloco.name)
                resultado = executar_ferramenta(
                    bloco.name, bloco.input, role, db, corretor_id,
                )
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": bloco.id,
                    "content": resultado,
                })
        mensagens.append({"role": "user", "content": tool_results})

    return {
        "resposta": "Desculpe, tive um problema. Pode reformular?",
        "ferramentas_usadas": ferramentas_usadas,
        "mensagens": mensagens,
    }
