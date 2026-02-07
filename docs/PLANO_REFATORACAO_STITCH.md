# 🎨 Plano de Refatoração UI/UX com Stitch MCP

**Data**: 2026-02-05 17:25  
**Objetivo**: Refatorar todas as páginas do Quarks OS usando Stitch MCP para garantir qualidade visual premium  
**Status**: 📋 PLANEJAMENTO

---

## 📊 MAPEAMENTO: Páginas → Projetos Stitch

### ✅ Projetos Stitch Disponíveis (LIGHT Mode, DESKTOP)

| ID | Nome | Theme | Device | Uso Recomendado |
|----|------|-------|--------|-----------------|
| `14779748916160144257` | **Quarks OS - Solar Edition Login** | LIGHT, Inter, petroleum | DESKTOP | `/login` |
| `5019214678898543770` | **Quarks OS Main Dashboard** | LIGHT, Inter, petroleum | DESKTOP | `/` (Dashboard) |
| `9249328830387004872` | **CRM Leads Dashboard** | LIGHT, Inter, petroleum | DESKTOP | `/leads` |
| `17089202674787739803` | **Kanban de Leads** | LIGHT, Inter, petroleum | DESKTOP | `/funnel` |
| `17000804498242659206` | **Tela de Gerenciamento de Agentes** | LIGHT, Inter | DESKTOP | `/settings` |
| `6379904341358805207` | **Solar Energy Proposal Dashboard** | LIGHT, Inter | DESKTOP | `/proposals/new` |
| `15850349924998865199` | **CRM Lead Overview** | DARK, Inter | DESKTOP | Referência (dark mode) |

---

## 🎯 PLANO DE REFATORAÇÃO POR PRIORIDADE

### 🔴 PRIORIDADE CRÍTICA (P0) - Semana 1

#### 1. Login Page (`/login`)
**Projeto Stitch**: `14779748916160144257` - Quarks OS - Solar Edition Login  
**Status Atual**: Página funcional, mas pode melhorar visualmente  
**Ações**:
1. Gerar código HTML/React do Stitch
2. Adaptar ao Design System (cores petroleum + solar)
3. Manter funcionalidade de autenticação
4. Adicionar animações sutis
5. Testar responsividade

**Estimativa**: 4-6 horas

---

#### 2. Dashboard (`/`)
**Projeto Stitch**: `5019214678898543770` - Quarks OS Main Dashboard  
**Status Atual**: ✅ Conforme ao DS (referência)  
**Ações**:
1. Comparar com Stitch para identificar melhorias
2. Adicionar micro-interações
3. Otimizar KpiGrid e KanbanBoard
4. Melhorar InsightBar

**Estimativa**: 2-3 horas (polish)

---

### 🟡 PRIORIDADE ALTA (P1) - Semana 2

#### 3. Leads List (`/leads`)
**Projeto Stitch**: `9249328830387004872` - CRM Leads Dashboard  
**Status Atual**: Usa UnifiedShell, precisa validação visual  
**Ações**:
1. Gerar código da tabela de leads do Stitch
2. Comparar com `LeadListTableRefactored`
3. Melhorar avatares, badges e hover actions
4. Adicionar filtros avançados
5. Implementar paginação visual

**Estimativa**: 6-8 horas

---

#### 4. Funnel/Kanban (`/funnel`)
**Projeto Stitch**: `17089202674787739803` - Kanban de Leads  
**Status Atual**: Usa KanbanBoard, precisa validação  
**Ações**:
1. Gerar código do Kanban do Stitch
2. Comparar com `KanbanBoard` atual
3. Melhorar drag-and-drop visual
4. Adicionar animações de transição
5. Otimizar cards de lead

**Estimativa**: 6-8 horas

---

#### 5. Workspace (`/workspace`)
**Projeto Stitch**: Criar novo ou adaptar CRM Lead Overview  
**Status Atual**: HybridShell (WhatsApp-like) - CORRETO  
**Ações**:
1. **NÃO refatorar estrutura** (manter HybridShell)
2. Melhorar componentes visuais:
   - ConversationList
   - LeadContextPanel
   - Badges e indicadores
3. Adicionar QuickChatPanel (Fase 1, Sprint 3)
4. Implementar real-time indicators

**Estimativa**: 8-10 horas (melhorias visuais)

---

### 🟢 PRIORIDADE MÉDIA (P2) - Semana 3

#### 6. Proposal Generator (`/proposals/new`)
**Projeto Stitch**: `6379904341358805207` - Solar Energy Proposal Dashboard  
**Status Atual**: Precisa validação  
**Ações**:
1. Gerar código do gerador de proposta
2. Melhorar formulários e inputs
3. Adicionar preview em tempo real
4. Otimizar cálculos visuais

**Estimativa**: 8-10 horas

---

#### 7. Proposals List (`/proposals`)
**Projeto Stitch**: Adaptar CRM Leads Dashboard  
**Status Atual**: Precisa validação  
**Ações**:
1. Criar tabela de propostas similar a leads
2. Adicionar filtros por status
3. Implementar cards de proposta
4. Melhorar visualização de valores

**Estimativa**: 4-6 horas

---

#### 8. Settings (`/settings`)
**Projeto Stitch**: `17000804498242659206` - Tela de Gerenciamento de Agentes  
**Status Atual**: Precisa validação  
**Ações**:
1. Gerar código de configurações
2. Organizar em tabs/sections
3. Melhorar formulários
4. Adicionar validações visuais

**Estimativa**: 6-8 horas

---

### 🔵 PRIORIDADE BAIXA (P3) - Semana 4

#### 9. Chat IA (`/chat`)
**Status Atual**: Precisa validação  
**Ações**:
1. Validar conformidade com CopilotSidebar
2. Melhorar interface de chat
3. Adicionar streaming visual
4. Otimizar mensagens

**Estimativa**: 4-6 horas

---

#### 10. Clients (`/clients`)
**Status Atual**: Precisa validação  
**Ações**:
1. Criar tabela de clientes
2. Adicionar cards de cliente
3. Implementar filtros

**Estimativa**: 4-6 horas

---

#### 11. Projects (`/projetos`)
**Status Atual**: Precisa validação  
**Ações**:
1. Validar ProjectKanbanBoard
2. Melhorar cards de projeto
3. Adicionar timeline

**Estimativa**: 4-6 horas

---

#### 12. Dimensionamento IA (`/dimensionamento`)
**Status Atual**: Precisa validação  
**Ações**:
1. Melhorar formulários de dimensionamento
2. Adicionar visualizações
3. Otimizar cálculos

**Estimativa**: 6-8 horas

---

#### 13. Cronograma (`/cronograma`)
**Status Atual**: Precisa validação  
**Ações**:
1. Criar timeline visual
2. Adicionar marcos e eventos
3. Implementar drag-and-drop

**Estimativa**: 6-8 horas

---

#### 14. Kits (`/kits`)
**Status Atual**: Precisa validação  
**Ações**:
1. Criar grid de kits
2. Melhorar cards de produto
3. Adicionar filtros e busca

**Estimativa**: 4-6 horas

---

## 📋 PROCESSO DE REFATORAÇÃO COM STITCH

### Passo a Passo

1. **Selecionar Projeto Stitch**
   ```javascript
   mcp_stitch_get_project({ name: "projects/{project_id}" })
   ```

2. **Listar Screens Disponíveis**
   ```javascript
   mcp_stitch_list_screens({ projectId: "{project_id}" })
   ```

3. **Buscar Código da Screen**
   ```javascript
   mcp_stitch_fetch_screen_code({ 
     projectId: "{project_id}", 
     screenId: "{screen_id}" 
   })
   ```

4. **Buscar Imagem da Screen**
   ```javascript
   mcp_stitch_fetch_screen_image({ 
     projectId: "{project_id}", 
     screenId: "{screen_id}" 
   })
   ```

5. **Adaptar ao Design System**
   - Substituir cores por tokens DS
   - Ajustar tipografia
   - Manter classes `.technical-card`, `.ds-title-page`, etc.
   - Garantir tema claro (sem gradientes)

6. **Integrar com Backend**
   - Conectar com APIs existentes
   - Manter lógica de negócio
   - Adicionar hooks e contexts

7. **Testar e Validar**
   - Testar responsividade
   - Validar acessibilidade
   - Verificar performance
   - Testar funcionalidades

---

## 🎨 DESIGN TOKENS A MANTER

### Cores
```css
--petroleum-900: #0F4C5C;
--petroleum-600: #0F4C5C;
--solar-600: #F59E0B;
--solar-50: #FEF3C7;
--canvas: #F1F5F9;
--slate-200: #E2E8F0;
```

### Tipografia
```css
.ds-title-page { font-size: 1.875rem; font-weight: 700; }
.ds-display-xl { font-size: 1.5rem; font-weight: 600; }
.ds-meta { font-size: 0.75rem; color: #64748B; }
```

### Componentes
```css
.technical-card { background: white; border-radius: 0.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.btn-pill { border-radius: 9999px; }
.badge-ultra-compact { padding: 0.125rem 0.5rem; font-size: 0.75rem; }
```

---

## 📊 ESTIMATIVA TOTAL

| Prioridade | Páginas | Esforço Total | Prazo |
|------------|---------|---------------|-------|
| **P0 (Crítica)** | 2 | 6-9 horas | Semana 1 |
| **P1 (Alta)** | 3 | 20-26 horas | Semana 2 |
| **P2 (Média)** | 3 | 18-24 horas | Semana 3 |
| **P3 (Baixa)** | 6 | 28-36 horas | Semana 4 |
| **TOTAL** | **14** | **72-95 horas** | **4 semanas** |

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

### Opção 1: Iniciar com Login (P0)
1. Buscar projeto Stitch `14779748916160144257`
2. Gerar código HTML/React
3. Adaptar ao Design System
4. Implementar funcionalidade
5. Testar e validar

### Opção 2: Melhorar Dashboard (P0)
1. Buscar projeto Stitch `5019214678898543770`
2. Comparar com código atual
3. Identificar melhorias visuais
4. Implementar micro-interações
5. Testar e validar

### Opção 3: Refatorar Leads (P1)
1. Buscar projeto Stitch `9249328830387004872`
2. Gerar código da tabela
3. Comparar com `LeadListTableRefactored`
4. Implementar melhorias
5. Testar e validar

---

## 💬 Qual caminho você prefere?

1. **Iniciar com Login** (ganho rápido, alta visibilidade)
2. **Melhorar Dashboard** (já conforme, polish)
3. **Refatorar Leads** (alta prioridade, muito usado)
4. **Melhorar Workspace** (WhatsApp-like, mantendo HybridShell)
5. **Outro** (especifique)

---

**Status**: 📋 PLANO PRONTO  
**Aguardando**: Decisão de prioridade
