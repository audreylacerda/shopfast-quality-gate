# ShopFast — Mini-SQAP (Quality Gate + Risco + Clean Code)
Autor: Audrey Pereira Lacerda — Matrícula 2320113

## Contexto (Black Friday Incident)
Na última Black Friday, o cupom BLACK50 acionou um fluxo “verde na tela”, mas o back-end não validou o pagamento (saldo zerado / autorização recusada).
Resultado: pedidos foram despachados sem quitação, gerando falha funcional e aumento do Change Failure Rate.

## A) Política do Quality Gate (IEEE 730 — Enforcement, não intenção)

### Regra Imutável 1 — Deploy bloqueado sem evidência de comportamento (BDD/Contratos)
Nenhuma alteração em preço/cupom/frete/pagamento entra na branch principal se:
1) Testes automatizados falharem (unitários + integração simulada), e
2) O cenário de validação do cupom (incluindo exceções técnicas e de negócio) não estiver coberto por teste de comportamento.
ENFORCEMENT: pipeline CI obrigatório + branch protection com “required status checks”.

### Regra Imutável 2 — Proibição de “integração nociva” no domínio (Clean Code/Testabilidade)
Funções de domínio não podem chamar HTTP/banco/logística diretamente (sem dependência hardcoded).
Toda integração deve ser injetada via interface/porta (mockável).
ENFORCEMENT: lint + testes unitários obrigatórios e revisão por PR (sem merge direto).

## B) Sumário Executivo — Gestão de Risco (Matriz P×I)

### Risco: “Despacho sem pagamento confirmado” (cupom BLACK50 + saldo inválido)
Probabilidade: ALTA (fluxo de promoções é frequente e sofre pressão de prazo)
Impacto: ALTO (prejuízo direto + estoque + logística + reputação)

Classificação: CRÍTICO (P alta × I alto) — não é aceitável seguir para produção.

Mitigação (SQA):
- Quality Gate obrigatório (bloqueia merge/deploy sem evidência).
- Testes de comportamento e exceções (negócio e técnica) para o fluxo de cupom.
- Código refatorado e isolado (sem dependências diretas), permitindo testes rápidos e confiáveis.

Efeito esperado:
Com processos de bloqueio automatizado e critérios objetivos de “go/no-go”, reduzimos a chance de liberar mudanças frágeis e diminuímos o Change Failure Rate ao evitar vazamento de defeitos para produção.
