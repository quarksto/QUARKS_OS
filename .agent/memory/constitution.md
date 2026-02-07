# QUARKS_OS Constitution

**Project**: QUARKS_OS — Solar Edition  
**Version**: 1.2.0  
**Ratification Date**: 2026-02-03  
**Last Amended Date**: 2026-02-05

---

## 1. Executive Summary

QUARKS_OS é uma plataforma unificada para CRM solar, dimensionamento automático, geração de propostas, simulação financeira, gestão de kits, pipeline comercial e Copilot técnico com IA.

---

## 2. Core Principles

### Principle 1: Python-First Backend

**Statement**: Para lógica de backend e cálculos técnicos, Python (FastAPI) DEVE ser a linguagem principal.

**Rationale**: Python oferece estabilidade, ecossistema rico para cálculos solares, e integração nativa com IA/ML. Node.js é reservado para orquestração leve e BFF (Backend for Frontend).

**Compliance Criteria**:
- Todos os endpoints de cálculo (kWp, ROI, payback) DEVEM usar Python/FastAPI
- Services de domínio (leads, propostas, catálogo) DEVEM ser implementados em Python
- Node.js é permitido apenas para camada de orquestração/BFF quando necessário

---

### Principle 2: Idioma PT-BR

**Statement**: Toda documentação, comentários de código orientados ao usuário, e interface de usuário DEVEM estar em Português Brasileiro.

**Rationale**: O público-alvo são integradores solares brasileiros. A comunicação em PT-BR reduz barreiras e aumenta adoção.

**Compliance Criteria**:
- Docs em `/docs` DEVEM estar em PT-BR
- UI labels, mensagens de erro e tooltips DEVEM estar em PT-BR
- Comentários técnicos do código PODEM estar em inglês para compatibilidade com ferramentas

---

### Principle 3: Spec-Driven Development

**Statement**: Toda feature significativa DEVE passar pelo pipeline Speckit completo: Specify → Clarify → Plan → Tasks → Implement → Validate.

**Rationale**: Desenvolvimento orientado por especificação reduz retrabalho, melhora comunicação e garante rastreabilidade.

**Compliance Criteria**:
- Features novas DEVEM ter `spec.md` antes da implementação
- Plans DEVEM ser aprovados antes de iniciar código
- Tasks DEVEM ser marcadas conforme progresso

---

### Principle 4: Modularidade e Clean Architecture

**Statement**: O sistema DEVE seguir arquitetura de camadas com separação clara entre domínio, aplicação e infraestrutura.

**Rationale**: Modularidade permite evolução independente de componentes, facilita testes e reduz acoplamento.

**Compliance Criteria**:
- Cada módulo (Leads, Proposta, Copilot, etc.) DEVE ter boundaries bem definidos
- Domain Agents DEVEM encapsular lógica de negócio
- Dependências DEVEM fluir de fora para dentro (infra → app → domain)

---

### Principle 5: Design System Minimalista

**Statement**: A interface DEVE seguir o Design System QUARKS_OS com estética minimalista e tema claro.

**Rationale**: Consistência visual melhora UX e reduz carga cognitiva para usuários técnicos.

**Compliance Criteria**:
- Componentes DEVEM usar tokens CSS do Design System
- Gradientes e dark mode NÃO DEVEM ser usados (tema light only)
- Cores DEVEM vir da paleta definida em `src/frontend/src/styles/`

---

### Principle 6: Métricas de Sucesso

**Statement**: O produto DEVE atingir os KPIs definidos no PRD v2.1.

**Rationale**: Métricas objetivas permitem avaliar se o produto entrega valor real.

**Compliance Criteria**:
- Tempo de proposta < 5 minutos
- Taxa de fechamento +25% vs baseline
- Erro de dimensionamento < 3%
- Margem média ≥ meta definida

---

### Principle 7: Ironclad Anti-Regression

**Statement**: Implementações DEVEM seguir os protocolos Ironclad: Blast Radius mínimo, padrão Strangler, e TDD quando aplicável.

**Rationale**: Prevenir regressões é mais eficiente que corrigi-las após o fato.

**Compliance Criteria**:
- Mudanças DEVEM ter escopo mínimo necessário
- Refatorações grandes DEVEM usar padrão Strangler (nova implementação paralela)
- Funcionalidades críticas DEVEM ter testes automatizados

---

---

### Principle 8: Frontend Excellence & Specialized Skills

**Statement**: O desenvolvimento de interfaces DEVE utilizar as capacidades avançadas de "Frontend Skills" (Stitch, Chrome DevTools, Visual Analysis) para garantir fidelidade absoluta ao Design System e alta qualidade de UX.

**Rationale**: Ferramentas especializadas como Stitch permitem iterações rápidas e precisas de UI, enquanto Chrome DevTools garante que a implementação final seja livre de defeitos visuais e técnicos.

**Compliance Criteria**:
- Novas telas ou refatorações complexas DEVEM usar `mcp_stitch` para geração de variantes de design.
- Validações de UI DEVEM incluir auditoria visual via screenshots e inspeção de DOM via `mcp_chrome-devtools`.
- Assets visuais (ícones complexos, placeholders premium) DEVEM ser gerados via `generate_image` para manter o padrão estético.

---

## 3. Governance

### 3.1 Amendment Procedure

1. Propor mudança via PR com justificativa
2. Review por pelo menos 1 stakeholder
3. Atualizar versão conforme Semver:
   - MAJOR: Mudança quebra compatibilidade ou remove princípio
   - MINOR: Adiciona princípio ou expande significativamente
   - PATCH: Clarificações e refinamentos
4. Atualizar `Last Amended Date`

### 3.2 Compliance Review

- Cada `/speckit.analyze` DEVE validar contra esta constitution
- Conflitos com princípios são classificados como CRITICAL
- Specs que não atendem princípios DEVEM ser revisadas antes da implementação

---

## 4. Module Scope

Os seguintes módulos estão no escopo do PRD v2.1:

| Módulo | Descrição | Status |
|--------|-----------|--------|
| CRM Leads | Gestão de leads e pipeline comercial | Em desenvolvimento |
| Proposta Interativa | Geração de propostas PDF e interativas | Planejado |
| Simulador Solar | Cálculo kWp, ROI, payback | Parcialmente implementado |
| Kit Builder | Montagem e gestão de kits | Planejado |
| Financeiro | Simulação financeira | Planejado |
| Copilot IA | Assistente técnico multimodal | Em desenvolvimento |
| Analytics | Dashboard de métricas | Implementado |

### Fora de Escopo v2.1

- Monitoramento IoT
- SCADA
- Integração direta com concessionárias

---

## 5. Technical Stack

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Backend Cálculo | Python 3.11+ / FastAPI | Performance, ecossistema IA |
| Backend Orquestração | Node.js (opcional) | BFF quando necessário |
| Frontend | React + Vite | Performance, DX |
| Database | Supabase (Postgres) | Managed, RLS, Realtime |
| IA | Google Gemini | Multimodal, context window |
| Styling | CSS vanilla (Design System) | Controle total, sem deps |

---

## 6. Conventions

### 6.1 Feature Numbering

Features e specs DEVEM usar numeração de **2 dígitos** (01-99).

**Formato**: `NN-feature-name`

**Exemplos**:
- `01-multimodal-copilot`
- `05-leads-refactor-stitch`
- `12-new-feature`

**Rationale**: Mantém consistência com specs existentes. Se o projeto ultrapassar 99 features, a convenção será reavaliada.

### 6.2 Branch Naming

Branches de feature DEVEM seguir o padrão:

```
NN-short-description
```

- `NN`: Número de 2 dígitos
- `short-description`: 2-4 palavras em kebab-case

### 6.3 File Naming

- Arquivos de código: `camelCase.js` ou `PascalCase.jsx` (componentes React)
- Arquivos de docs: `SCREAMING_SNAKE_CASE.md` ou `Title_Case.md`
- Arquivos de spec: `spec.md`, `plan.md`, `tasks.md` (lowercase)

### 6.4 Backend-First Development

O desenvolvimento DEVE priorizar **APIs e lógica de backend** antes de interfaces de usuário.

**Rationale**: APIs robustas e testáveis permitem que o frontend seja desenvolvido posteriormente (por outro time ou via Stitch/UI generators).

**Ordem de Prioridade**:
1. Schema/Modelos (Prisma)
2. Domain Agents (lógica de negócio)
3. REST APIs (CRUD + workflows)
4. Integração com Maestro/Orchestrator
5. (Opcional) Frontend/UI - escopo separado

---

## Sync Impact Report

<!-- 
Version: 1.1.0
Last Amended: 2026-02-03
Changes:
- Added Section 6: Conventions (feature numbering, branch naming, file naming)
Templates updated: N/A
Deferred TODOs: None
-->
