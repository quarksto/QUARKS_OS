# Page Implementation Analysis — Quarks OS

**Date:** 2026-02-02  
**Purpose:** Analyze current routes vs. planned routes and recommend next pages to implement

---

## 📊 Current Route Status

### ✅ Implemented Routes (App.jsx)

| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/` | `DashboardRefactored` | ✅ Full | Main dashboard with KPIs, kanban, insight bar |
| `/dashboard` | `DashboardRefactored` | ✅ Full | Alias for `/` |
| `/leads` | `LeadsPage` | ✅ Full | Leads & Clientes page with DashboardShell |
| `/proposals` | `ProposalPage` | ✅ Full | Gerador de Propostas with DashboardShell |
| `/chat` | `ChatPage` | ✅ Full | Chat IA (Copilot) with DashboardShell |
| `/projetos` | `ProjetosPage` | ⚠️ Placeholder | "Em breve" placeholder |
| `/dimensionamento` | `DimensionamentoPage` | ⚠️ Placeholder | "Em breve" placeholder |
| `/cronograma` | `CronogramaPage` | ⚠️ Placeholder | "Em breve" placeholder |

### ❌ Missing Routes (Referenced but Not Implemented)

| Route | Referenced In | Expected Component | Priority |
|-------|---------------|-------------------|----------|
| `/kits` | `MainLayout.jsx` (line 17) | `KitsPage` or `PlaceholderPage` | 🔴 HIGH |
| `/settings` | `MainLayout.jsx` (line 18) | `SettingsPage` or `PlaceholderPage` | 🔴 HIGH |

### 📋 Routes Referenced in Navigation

**DashboardSidebar.jsx** (lines 4-16):
- ✅ All routes match App.jsx implementation
- No missing routes here

**MainLayout.jsx** (lines 14-18):
- ⚠️ `/dashboard` → exists (alias for `/`)
- ✅ `/leads` → exists
- ✅ `/proposals` → exists
- ❌ `/kits` → **MISSING**
- ❌ `/settings` → **MISSING**

---

## 🏗️ Architecture Analysis

### Current Routing Structure

```jsx
// App.jsx uses DashboardShell wrapper pattern:
<Route path="/leads" element={
  <DashboardShell title="Leads" subtitle="Leads & Clientes" headerIcon="person_search">
    <LeadsPage />
  </DashboardShell>
} />
```

**Pattern:** All routes (except Dashboard) use `DashboardShell` wrapper with:
- `title` (header title)
- `subtitle` (header subtitle)
- `headerIcon` (Material Symbols icon)

### PlaceholderPage Component

```jsx
// PlaceholderPage.jsx - Simple placeholder component
export default function PlaceholderPage({ title = 'Em breve' }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Title order={1} mb="md">{title}</Title>
      <Text c="dimmed">Esta seção está em construção e estará disponível em breve.</Text>
    </div>
  );
}
```

**Note:** Current placeholder pages (`ProjetosPage`, `DimensionamentoPage`, `CronogramaPage`) use custom placeholder UI with Design System classes, not the generic `PlaceholderPage` component.

---

## 📚 Documentation Requirements

### From PRD v2.1 (docs/QUARKS_OS_PRD_v2_1.md)

**Modules Required:**
1. ✅ CRM Leads — **Implemented** (`/leads`)
2. ✅ Proposta Interativa — **Implemented** (`/proposals`)
3. ❌ Simulador Solar — **Not implemented** (no route)
4. ❌ Kit Builder — **Not implemented** (no route, but `/kits` referenced)
5. ❌ Financeiro — **Not implemented** (no route)
6. ✅ Copilot IA — **Implemented** (`/chat`)
7. ✅ Analytics — **Implemented** (Dashboard)

### From O_QUE_FALTA.md

**Missing Pages:**
- `/kits` — "Kits & Tarifas" (MainLayout references it)
- `/settings` — "Configurações" (MainLayout references it)
- Simulador Solar — No route defined
- Kit Builder — No route defined (but `/kits` might be it)
- Financeiro — No route defined

**From FLUXOS_MODULOS.md:**
- Auth routes (`/auth/login`, `/auth/register`) — Not in frontend routes
- Marketing webhook routes — Backend only

---

## 🎯 Recommendations

### Priority 1: Fix Broken Navigation (HIGH)

**Issue:** `MainLayout.jsx` has navigation links to `/kits` and `/settings` that don't exist in `App.jsx`, causing 404 errors.

**Solution Options:**

**Option A: Create Placeholder Pages (Quick Fix)**
```jsx
// Add to App.jsx:
<Route
  path="/kits"
  element={
    <DashboardShell title="Kits & Tarifas" subtitle="Catálogo de Produtos" headerIcon="solar_power">
      <PlaceholderPage title="Kits & Tarifas" />
    </DashboardShell>
  }
/>
<Route
  path="/settings"
  element={
    <DashboardShell title="Configurações" subtitle="Ajustes do Sistema" headerIcon="settings">
      <PlaceholderPage title="Configurações" />
    </DashboardShell>
  }
/>
```

**Option B: Remove from MainLayout (Temporary)**
- Comment out `/kits` and `/settings` from MainLayout navigation until implemented

**Recommendation:** **Option A** — Create placeholder pages to maintain navigation consistency.

---

### Priority 2: Implement Core Missing Pages (MEDIUM)

Based on PRD v2.1 and architecture:

#### 1. `/kits` — Kit Builder & Catalog
**Status:** Referenced in MainLayout, not implemented  
**Backend:** Requires Product/Kit CRUD APIs (see `gap_analysis_proposal.md`)  
**Priority:** HIGH (needed for proposal engine)

**Implementation Plan:**
- Create `KitsPage.jsx` component
- Integrate with `/api/products` and `/api/kits` (when available)
- Display catalog of solar panels, inverters, structures, cables
- Kit builder interface (drag-and-drop or form-based)

#### 2. `/settings` — System Settings
**Status:** Referenced in MainLayout, not implemented  
**Backend:** Requires settings API  
**Priority:** MEDIUM (user preferences, system config)

**Implementation Plan:**
- Create `SettingsPage.jsx` component
- User profile settings
- System preferences
- Integration settings (if applicable)

#### 3. `/simulador` — Solar Simulator
**Status:** Not referenced, but required by PRD  
**Backend:** Uses calc_engine (Python) for ROI/payback  
**Priority:** MEDIUM (core feature from PRD)

**Implementation Plan:**
- Create `SimuladorPage.jsx` component
- Form: consumption, location, distributor
- Results: kWp, generation, ROI, payback
- Uses same calc engine as proposal preview

#### 4. `/financeiro` — Financial Module
**Status:** Not referenced, but required by PRD  
**Backend:** Requires PricingRule, margin calculations  
**Priority:** LOW (can come after core features)

**Implementation Plan:**
- Create `FinanceiroPage.jsx` component
- Pricing rules management
- Margin analysis
- Financial reports

---

### Priority 3: Enhance Placeholder Pages (LOW)

Current placeholder pages (`/projetos`, `/dimensionamento`, `/cronograma`) have basic placeholders. Consider:

1. **`/projetos`** — Projects List
   - List of solar projects
   - Filter by status, date, customer
   - Link to proposals

2. **`/dimensionamento`** — AI Dimensioning
   - Form for consumption/location
   - AI-powered system sizing
   - Integration with calc_engine

3. **`/cronograma`** — Schedule/Calendar
   - Project timeline view
   - Installation scheduling
   - Calendar integration

---

## 📝 Implementation Checklist

### Immediate (Fix Navigation)
- [ ] Create `/kits` route with placeholder page
- [ ] Create `/settings` route with placeholder page
- [ ] Test navigation from MainLayout

### Short Term (Core Features)
- [ ] Implement `/kits` page with catalog view
- [ ] Implement `/settings` page with user preferences
- [ ] Add `/simulador` route and page
- [ ] Backend: Product/Kit CRUD APIs

### Medium Term (Enhancements)
- [ ] Enhance `/projetos` page (projects list)
- [ ] Enhance `/dimensionamento` page (AI dimensioning)
- [ ] Enhance `/cronograma` page (schedule view)
- [ ] Implement `/financeiro` page

### Long Term (PRD Requirements)
- [ ] Auth pages (`/login`, `/register`) if needed
- [ ] Additional modules from PRD v2.1

---

## 🔍 Code References

### Files to Modify

1. **`src/frontend/src/App.jsx`**
   - Add routes for `/kits` and `/settings`
   - Consider adding `/simulador` route

2. **`src/frontend/src/pages/KitsPage.jsx`** (NEW)
   - Create new page component
   - Use DashboardShell wrapper
   - Follow Design System patterns

3. **`src/frontend/src/pages/SettingsPage.jsx`** (NEW)
   - Create new page component
   - Use DashboardShell wrapper
   - User settings form

4. **`src/frontend/src/pages/SimuladorPage.jsx`** (NEW)
   - Create new page component
   - Form + results display
   - Integration with calc_engine

### Design System Classes Available

From `index.css` and existing pages:
- `section-title` — Section headings
- `support-text` — Secondary text
- `technical-card` — Card containers
- `btn-pill` — Rounded buttons
- `kpi-title`, `kpi-value` — KPI displays

---

## 📊 Summary Table

| Page | Route | Status | Priority | Backend API Needed |
|------|-------|--------|----------|-------------------|
| Dashboard | `/` | ✅ Done | — | `/api/analytics/dashboard` |
| Leads | `/leads` | ✅ Done | — | `/api/leads/pipeline` |
| Proposals | `/proposals` | ✅ Done | — | `/orchestrate/preview-proposal` |
| Chat | `/chat` | ✅ Done | — | `/api/copilot/chat` |
| Kits | `/kits` | ❌ Missing | 🔴 HIGH | `/api/products`, `/api/kits` |
| Settings | `/settings` | ❌ Missing | 🔴 HIGH | `/api/settings` (if needed) |
| Simulador | `/simulador` | ❌ Missing | 🟡 MEDIUM | `/orchestrate/preview-proposal` (reuse) |
| Projetos | `/projetos` | ⚠️ Placeholder | 🟢 LOW | `/api/projects` (if needed) |
| Dimensionamento | `/dimensionamento` | ⚠️ Placeholder | 🟢 LOW | `/api/dimensionamento` (if needed) |
| Cronograma | `/cronograma` | ⚠️ Placeholder | 🟢 LOW | `/api/schedule` (if needed) |
| Financeiro | `/financeiro` | ❌ Missing | 🟢 LOW | `/api/pricing`, `/api/financial` |

---

## 🚀 Next Steps

1. **Immediate:** Create placeholder pages for `/kits` and `/settings` to fix navigation
2. **Short-term:** Implement `/kits` page with catalog (requires backend Product/Kit APIs)
3. **Medium-term:** Implement `/simulador` page (reuses existing calc_engine)
4. **Long-term:** Enhance placeholder pages and add `/financeiro` module

---

*Analysis based on: App.jsx, MainLayout.jsx, DashboardSidebar.jsx, O_QUE_FALTA.md, PRD v2.1, FLUXOS_MODULOS.md*
