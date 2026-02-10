# Quarks OS Core - Specification (Migrated)

> Esta especificação foi gerada automaticamente a partir da análise da base de código existente.

## Visão Geral

O **Quarks OS** é uma plataforma de CRM e Cálculo Solar composta por um backend Node.js modular e um motor de cálculo Python. O sistema gerencia Leads, Propostas, Inventário e integrações com serviços externos (Google Solar, Webhooks).

## Arquitetura de Alto Nível

- **Orquestrador (Maestro)**: Camada central em Node.js que coordena agentes de domínio.
- **Agentes de Domínio**: Módulos especializados (Lead, Proposal, Calc, Inventory) que encapsulam lógica de negócio.
- **Frontend**: Aplicação React (estrutura inferida por referências).
- **Banco de Dados**: PostgreSQL gerenciado via Prisma ORM.

## Requisitos Funcionais Identificados

### Gestão de Leads
- Criação e listagem de leads.
- Pipeline de vendas (Kanban).
- Rastreamento de origem (Webhooks: Facebook, Google, TikTok).

### Motor de Cálculo
- Dimensionamento de sistemas fotovoltaicos.
- Cálculo de payback, economia e geração.
- Geração de propostas em PDF via serviço Python.
- **Regras de Precificação**: Gestão dinâmica de margens e taxas via `pricing-rules`.

### Templates de Mensagem
- Criação e gestão de templates de mensagem (WhatsApp/Email).
- Categorização e contagem de uso.

### Propostas
- Criação de rascunhos e envio para clientes.
- Acompanhamento de status (Visualizado, Aceito, Rejeitado).
- Links públicos para visualização externa.

### Autenticação e Usuários
- Login JWT com roles (ADMIN, INTEGRADOR, COMERCIAL).
- Gestão de usuários e permissões.

## Entidades Principais (Schema Inferido)

- **User**: Usuários do sistema com roles.
- **Lead**: Clientes potenciais com dados de consumo e localização.
- **Proposal**: Propostas comerciais vinculadas a um Lead e um Kit.
- **Kit**: Conjuntos de equipamentos (painéis, inversores).
- **Product**: Itens individuais do inventário.

## Integrações
- **Google Maps/Solar API**: Para geocodificação e análise de telhado.
- **Webhooks**: Recepção de leads de campanhas de marketing.
