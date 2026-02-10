# Fluxos Frontend — Conformidade speckit + dsoficial

**Referências:** `docs/dsoficial.md` (Design System v1.4), `.agent/skills/speckit.frontend/SKILL.md`, `docs/AUDITORIA_FLUXOS_FRONTEND.md`.

---

## 1. Mapeamento de Contexto (speckit.frontend §0)

### 1.1 Screen Purpose

| Tela | As-Is | To-Be |
|------|-------|-------|
| LeadDetailPage | Ficha do lead com abas (Perfil, Command Center, Dados, Qualificação, Proposta, **Documentos**, Histórico) | Conformidade DS v1.4; aba Documentos integrada a `GET/POST /api/documents/lead/:id` |
| LeadDocumentsTab | Upload, listagem, download, delete de documentos do lead | Mesmo; **corrigir** URL de download e tokens DS |
| LeadsPage | Lista/Kanban de leads; usePipelineData + useLeadRealtime | Alinhado |
| SalesWorkspace | Pipeline Kanban; usePipelineData (hook compartilhado) | Alinhado |
| DashboardRefactored | KPIs + funnel; useDashboardData | Alinhado |

### 1.2 Data Source (Prisma)

| Modelo | Uso |
|--------|-----|
| Lead | LeadDetailPage, LeadsPage, SalesWorkspace |
| LeadDocument | LeadDocumentsTab (`GET /api/documents/lead/:leadId`, `POST /api/documents/upload`, `DELETE /api/documents/:id`, `GET /api/documents/download/:id`) |
| Proposal | LeadDetailPage (aba Proposta) |

### 1.3 Orchestration

- **LeadDomainAgent**: status, patch lead
- **Documents module**: upload, list, delete, download (controller direto, sem agent)

---

## 2. Regras dsoficial (aplicadas)

### 2.1 Tokens obrigatórios

- **Primário (CTA)**: `bg-solar hover:bg-amber-600 text-white` — **sem sombra** (`shadow-none` se houver)
- **Secundário**: `border border-petroleum text-petroleum hover:bg-petroleum hover:text-white`
- **Focus**: `focus:border-petroleum/60 focus:ring-0`
- **Badges**: Outline apenas (`border-*-200 text-*-700 bg-white`)
- **Card**: `bg-white border border-slate-100` ou `border-slate-200` (DS §4)

### 2.2 Proibido

- Roxo
- Sombras pesadas (apenas `shadow-sm` em hover)
- Gradientes, blur, glow

### 2.3 LeadDocumentsTab

- Botão Upload: `bg-solar hover:bg-amber-600` (não `bg-solar-500`)
- Download: usar `api.get('/documents/download/:id', { responseType: 'blob' })` + `URL.createObjectURL` em vez de `window.open` com URL incorreta
- Empty state: `text-slate-300` + `text-slate-500`

---

## 3. Status dos fluxos

| Fluxo | Status |
|-------|--------|
| Menu (Clients, Settings, Chat, Cronograma, Kits) | ✅ Presente em `DashboardSidebar.getNavConfig()` |
| SalesWorkspace pipeline | ✅ Usa `usePipelineData` (hook compartilhado) |
| Documentos na LeadDetailPage | ✅ LeadDocumentsTab integrado; download via api.get(blob); tokens DS aplicados |
| Realtime no LeadsPage | ✅ `usePipelineData` inclui `useLeadRealtime` |
| LeadsListPage | ✅ Removido (já deletado no branch) |

---

## 4. Próximas ações

1. ~~Corrigir LeadDocumentsTab~~ ✅ Concluído
2. ~~Remover ou arquivar LeadsListPage~~ ✅ Já removido
3. DashboardSidebar: tokens `solar-500` → `solar` (dsoficial §2.1) ✅ Concluído
4. ~~Adicionar /kits ao menu~~ ✅ Concluído (Produtos + Kits separados)
5. ~~Tokens DS em componentes adicionais~~ ✅ CreateLeadModal, LeadDetailDrawer, KanbanBoard, KpiGrid, CopilotBar, etc.
6. Auditoria visual (Chrome DevTools) conforme speckit.frontend §2
5. ~~Adicionar /kits ao menu~~ ✅ Concluído
6. ~~Tokens solar-500 → solar em mais componentes~~ ✅ Concluído
