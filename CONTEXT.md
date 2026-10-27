# 🍳 Rangooo KDS (Kitchen Display System)

## 📌 Visão Geral do Projeto

O **Rangooo KDS** é um sistema de exibição de pedidos em tempo real voltado para a cozinha e praças de preparo de estabelecimentos alimentícios (restaurantes, pizzarias, lanchonetes).
Ele substitui ou complementa as impressões térmicas, permitindo que a equipe de cozinha visualize, ordene, prepare e finalize pedidos com agilidade e controle de tempo.

---

## 🛠 Stack Tecnológica & Requisitos

- **Framework:** Next.js `16.2.4` (App Router)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL (hosted na **Neon**)
- **ORM & Schema:** Prisma ORM através do pacote compartilhado `@misael1981/rangooo-database`
- **Estilização:** Tailwind CSS + Shadcn UI
- **Tempo Real / WebSockets:** Pusher / Socket (para recebimento instantâneo de pedidos e atualizações de status)
- **Áudio / Notificações:** Web Audio API para alertas sonoros configuráveis (novo pedido, pedido atrasado)

---

## 🏗 Arquitetura do Sistema

- **Padrão:** Monolítico Modular (Next.js)
- **Multi-Tenant:** Suporte a múltiplos estabelecimentos (cada loja/tenant enxerga apenas seus pedidos)
- **Separação por Praças de Preparo (Kitchen Stations):**
  - Ex: _Cozinha_, _Bar/Bebidas_, _Chapa_, _Forno de Pizza_.
  - O KDS pode ser filtrado por categoria/praça para exibir apenas os itens relevantes para aquela tela.

---

## ⏱ Funcionalidades Fundamentais de um bom KDS

### 1. Tempo Real & Notificações

- Escuta ativa de eventos de **Novo Pedido** e **Cancelamento de Pedido**.
- Alerta sonoro (bip/sirene) configurável quando um novo pedido chega.

### 2. Gestão Visual do Tempo (SLA de Preparo)

- **Timers Individuais:** Cronômetro por pedido (contando tempo corrido desde o recebimento).
- **Indicadores Visuais de Status (Cores):**
  - 🟢 **Verde (No Prazo):** Pedido dentro do tempo ideal (ex: < 10 min).
  - 🟡 **Amarelo (Atenção):** Próximo do limite configurado (ex: 10 - 20 min).
  - 🔴 **Vermelho (Atrasado):** Acima do tempo limite (ex: > 20 min).

### 3. Modos de Visualização & Organização

- **Modo Grid (Cards):** Cards individuais por pedido ordenados por prioridade/tempo de chegada (FIFO - _First In, First Out_).
- **Modo Consolidado (Resumo de Itens):** Soma total de itens em preparo no momento (ex: _"5x X-Salada", "3x Coca-Cola 2L"_), essencial para a produção em lote.

### 4. Fluxo de Status do Pedido

- Transição simplificada de status com toque/clique único (ex: `PENDENTE` ➡️ `EM PREPARO` ➡️ `PRONTO`).
- Suporte para marcar **itens individuais** do pedido como concluídos antes de finalizar o pedido inteiro.
- Botão de **Desfazer / Histórico Recente** para resgatar pedidos finalizados por engano.

### 5. Resiliência & Experiência Operacional (UX da Cozinha)

- **Modo Fullscreen / Dark Mode Obrigatório:** Contraste alto para leitura rápida à distância em ambiente de cozinha.
- **Interação Amigável para Touchscreen e Atalhos de Teclado:** Botões grandes para toque com dedos/luvas ou atalhos numéricos no teclado.
- **Tratamento de Desconexão / Offline:** Indicador de status de rede visual (online/offline) e reconexão automática sem perder estado.
