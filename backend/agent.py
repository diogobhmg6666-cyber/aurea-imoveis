"""
Agente Claude: faz o loop de tool use até produzir resposta final.
"""
from anthropic import Anthropic
from sqlalchemy.orm import Session
from agent_tools import get_tools_for_role, executar_ferramenta

client = Anthropic()

MODEL = "claude-opus-4-7"  # troque pra claude-haiku-4-5 se quiser mais barato/rápido
MAX_TOKENS = 1024
MAX_ITERACOES = 6


def system_prompt(role: str, contexto_pagina: dict | None) -> str:
    base = """Você é o assistente virtual da Aurea Imóveis, uma imobiliária digital sofisticada.
Tom: caloroso, conciso, profissional. Use português brasileiro.
Use as ferramentas disponíveis pra dar respostas baseadas em dados reais — nunca invente imóveis, preços ou disponibilidade.
Ao listar imóveis, seja objetivo: título, bairro, quartos e preço formatado em R$. Não exiba IDs internos a clientes."""

    if role == "cliente":
        base += """

Você atende um VISITANTE do site. Seu trabalho:
1. Entender o que ele busca, sem ser invasivo
2. Mostrar imóveis que combinem com o perfil
3. Tirar dúvidas dos imóveis usando as ferramentas
4. Se houver interesse claro, oferecer contato com corretor — só peça nome/e-mail/telefone se o cliente topar

NUNCA peça dados pessoais sem antes ter conversado um pouco e identificado interesse genuíno."""

    elif role == "corretor":
        base += """

Você atende um CORRETOR autenticado. Seu trabalho:
1. Cadastrar e gerenciar imóveis via conversa natural
2. Antes de salvar qualquer cadastro ou alteração, RESUMIR os dados e CONFIRMAR
3. Ser eficiente, não fazer perguntas desnecessárias"""

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
