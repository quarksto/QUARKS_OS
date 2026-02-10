# Auditoria: Skills de Frontend vs Design System Quarks OS

**Data:** 2026-02-09  
**Objetivo:** Verificar se as skills de frontend (Cursor) estão alinhadas ao Design System (DS v1.4) e ao stack real do projeto.

---

## 1. Resumo do Design System Quarks OS

| Fonte | Conteúdo principal |
|-------|--------------------|
| `docs/dsoficial.md` | O Design System oficial v1.4. Tokens (petroleum, solar, canvas, slate), tipografia, componentes (.technical-card), **sem gradientes**, **tema claro**, **PT-BR**, sombras leves, regras de cores proibidas (purple) e badges em outline. |
| `src/frontend/tailwind.config.js` | Cores `canvas`, `petroleum`, `solar`; fontes Geist/Geist Mono; border-radius md/pill |
| `src/frontend/src/index.css` | Classes .technical-card, .ds-*, variáveis CSS (--text-high-contrast, --quarks-solar, etc.) |

**Stack real do frontend:**
- **Vite** + **React** + **React Router**
- **Tailwind CSS** (tokens do DS)
- **Mantine 8** (core, hooks, notifications) — usado em vários componentes
- **Geist** como fonte; **Material Symbols** para ícones (conforme DS)

---

## 2. Skills auditadas e nível de alinhamento

### 2.1 frontend-developer

| Aspecto | Alinhamento | Observação |
|---------|-------------|------------|
| Stack | Parcial | Foca em React 19 e **Next.js 15**; o projeto é **Vite SPA** com React Router. |
| Design system | Genérico | Menciona "Design tokens and theming systems" e "Tailwind CSS", mas não cita tokens Quarks (petroleum, solar, .ds-*) nem regras do DS. |
| Dark mode | **Conflito** | Skill cita "Dark mode and theme switching patterns"; o **DS proíbe dark mode** (só light). |
| A11y e performance | Alinhado | Boas práticas de acessibilidade e Core Web Vitals são compatíveis. |

**Recomendações:**  
- Usar para arquitetura React e performance; ignorar prescrições de Next.js quando o contexto for Quarks.  
- Em tarefas de UI, **sempre** cruzar com os docs do DS (sem gradientes, petroleum/solar, tema claro, PT-BR).  
- Não sugerir dark mode; referenciar "light mode only" do DS.

---

### 2.2 frontend-design

| Aspecto | Alinhamento | Observação |
|---------|-------------|------------|
| Estética | **Risco** | Skill prega "intentional aesthetic", "evitar AI-defaults", "uma display font expressiva"; o DS é **deliberadamente contido**: Geist só, paleta fixa (petroleum/solar), sem gradientes. |
| Cores | Conflito potencial | "One dominant tone, one accent" até combina; mas "Avoid evenly-balanced palettes" e "CSS variables exclusively" podem desviar do uso de **Tailwind** (petroleum, solar) e das classes utilitárias do DS. |
| Tipografia | Conflito | "Avoid system fonts and AI-defaults (Inter, Roboto)"; DS usa **Geist** (que pode ser tratado como "modern default"). Pode incentivar troca de fonte. |
| Anti-patterns | Conflito | Lista "Purple-on-white SaaS gradients" e "Default Tailwind layouts"; o DS **é** Tailwind + layout padrão (Shell, KpiGrid). |

**Recomendações:**  
- **Não** usar esta skill para definir ou alterar identidade visual do Quarks; o DS já é a referência.  
- Usar apenas para **hierarquia visual, ritmo e clareza** dentro dos limites do DS (petroleum, solar, .technical-card, .ds-*).  
- Em prompts, deixar explícito: "manter conformidade com docs/dsoficial.md".

---

### 2.3 frontend-dev-guidelines

| Aspecto | Alinhamento | Observação |
|---------|-------------|------------|
| Stack | **Desalinhado** | Skill exige **MUI v7**, **TanStack Router**, **useSuspenseQuery**; o projeto usa **Mantine** e **React Router**. |
| Estrutura | Parcial | Feature-based e organização de código são úteis; mas aliases e padrões (e.g. `~features`, `@/`) podem não bater com a estrutura atual. |
| Styling | **Desalinhado** | Grid e `sx` do MUI não se aplicam; o projeto estiliza com **Tailwind** + classes do DS + alguns componentes Mantine. |
| Data fetching | Parcial | Boas práticas gerais servem; Suspense é opcional no projeto atual (não é Suspense-first). |

**Recomendações:**  
- **Não** aplicar esta skill como padrão principal no Quarks; ela é orientada a outro stack (MUI + TanStack Router).  
- Se for manter uma skill "frontend guidelines" para o Quarks, criar uma **variante ou skill específica** que reflita: Mantine + React Router + Tailwind + tokens e classes do DS.

---

### 2.4 core-components

| Aspecto | Alinhamento | Observação |
|---------|-------------|------------|
| Tokens | **Diferente** | Skill usa tokens genéricos (`$1`, `$2`, `$textPrimary`, `$primary500`); o DS usa **petroleum**, **solar**, **canvas**, **slate** e classes como `.ds-title-page`, `.ds-display-xl`, `.kpi-value`. |
| Componentes | Diferente | Box, Text, Button, Card genéricos; no DS os blocos são **.technical-card**, **DashboardShell**, **AdaptiveHeader**, **.btn-pill**, **.badge-kanban-***, etc. |
| Semântica | Conflito | "Primary actions" na skill não equivale automaticamente a "CTA solar" (bg-[#F59E0B]) e "petroleum" para navegação/header. |

**Recomendações:**  
- **Não** usar core-components para definir ou nomear tokens/componentes no Quarks.  
- Para Quarks, tratar como referência de **padrões de uso** (evitar hardcode, usar tokens), mas **mapeando** para os tokens e componentes do DS (petroleum, solar, .technical-card, .ds-*).

---

### 2.5 tailwind-design-system

| Aspecto | Alinhamento | Observação |
|---------|-------------|------------|
| Tailwind | Alinhado | Projeto usa Tailwind; skill é adequada para configuração e padrões. |
| Tokens | Parcial | Skill fala em "design tokens"; não menciona os **nomes** do DS (petroleum, solar, canvas) nem as **regras** (sem gradientes, tema claro). |
| Dark mode | Cuidado | Skill menciona "dark mode and color schemes"; o DS é **light only**. |

**Recomendações:**  
- Usar para padrões Tailwind (extend, variantes, responsividade).  
- Sempre que aplicar, **sobrescrever** com as regras do DS: cores petroleum/solar/canvas, sem gradientes, sem dark mode.

---

### 2.6 react-best-practices (Vercel)

| Aspecto | Alinhamento | Observação |
|---------|-------------|------------|
| Escopo | Parcial | Focado em **Next.js** (SSR, RSC, API routes); o projeto é **Vite SPA**. |
| Performance React | Alinhado | Regras de bundle, re-render, lazy loading e Core Web Vitals são úteis em qualquer React. |

**Recomendações:**  
- Usar regras **agnósticas de framework** (evitar waterfalls, otimizar bundle, memoização).  
- Ignorar prescrições específicas de Next.js quando o contexto for Quarks.

---

### 2.7 ui-skills

| Aspecto | Alinhamento | Observação |
|---------|-------------|------------|
| Conteúdo | Vago | "Opinionated, evolving constraints" sem referência a tokens, cores ou DS. |

**Recomendações:**  
- Manter como guia genérico; **não** substitui o DS. Em conflito, o DS vence.

---

### 2.8 Outras skills citadas (menção breve)

| Skill | Alinhamento com DS |
|-------|---------------------|
| **radix-ui-design-system** | Genérico; não cita Quarks; pode sugerir Radix em vez de Mantine + Tailwind. Usar com cautela. |
| **web-design-guidelines** | Útil para a11y e revisão; não define paleta Quarks. |
| **ui-ux-pro-max** | Muitos estilos e paletas; risco de sugerir cores/estilos fora do DS. Validar sempre contra petroleum/solar e regras de cor. |
| **stitch-ui-design** | Para telas geradas no Stitch; DESIGN_SYSTEM_RULES.md já declara que Stitch deve seguir essas regras. Alinhado se o prompt do Stitch incluir o DS. |

---

## 3. Inconsistência interna no projeto (theme.js vs DS)

O arquivo `src/frontend/src/theme.js` (Mantine) define:

- **primaryColor: 'solarBlue'** com base **#1E3A8A** (azul).
- **solarGold** com base **#F59E0B** (ok para solar).

O DS define:

- **Petroleum** (#0F4C5C) como cor primária (sidebar, botões, nav, headers).
- **Solar** (#F59E0B) como ação/destaque (CTA, gráficos).

Ou seja: a **cor primária** do theme Mantine (solarBlue #1E3A8A) **não corresponde** ao petroleum (#0F4C5C) do DS. Isso pode fazer componentes Mantine (Button primary, etc.) usarem azul em vez de petroleum.

**Recomendação:** Ajustar `theme.js` para que a cor primária do Mantine seja **petroleum** (#0F4C5C) e o accent seja **solar** (#F59E0B), ou documentar que "primary" no Mantine é apenas para certos casos e que a maioria da UI deve usar Tailwind (petroleum/solar) e classes do DS.

---

## 4. Checklist de alinhamento (para novas features de UI)

Ao usar skills de frontend em tarefas do Quarks, garantir:

- [ ] **Cores:** Apenas petroleum, solar, canvas, slate; sem purple; sem gradientes (conforme dsoficial.md).
- [ ] **Tema:** Apenas light; não sugerir dark mode.
- [ ] **Tipografia:** Geist / Geist Mono; classes .ds-title-page, .ds-display-*, .ds-meta, .kpi-* quando aplicável.
- [ ] **Componentes:** Base em .technical-card, Shell/Header/Sidebar do DS; botões e badges conforme DS (e.g. .btn-pill, CTA solar).
- [ ] **Stack:** Preferir Vite + React Router + Tailwind + Mantine; não prescrever MUI v7 nem TanStack Router.
- [ ] **Idioma:** Labels e mensagens em PT-BR.
- [ ] **Focus/inputs:** Foco minimalista (borda petroleum, sem ring/glow), conforme QUARKS_OS_Design_System_v1.md.

---

## 5. Recomendações gerais

1. **Criar uma skill ou regra "Quarks Frontend / DS"** que referencie explicitamente:
   - `docs/QUARKS_OS_Design_System_v1.md`
   - `docs/DESIGN_SYSTEM_RULES.md`
   - Stack: Vite, React, React Router, Mantine, Tailwind
   - Tokens: petroleum, solar, canvas, slate; classes .ds-*, .technical-card, etc.
   - Proibições: gradientes, dark mode, purple, fills semânticos em badges.

2. **Desencorajar** o uso de **frontend-dev-guidelines** como fonte única de padrões (stack diferente).

3. **Usar frontend-design** apenas para questões de hierarquia e clareza **dentro** do DS, nunca para redefinir identidade ou paleta.

4. **Corrigir theme.js** (Mantine) para alinhar primary ao petroleum ou documentar o desvio.

5. Em **prompts de geração de UI** (incluindo Stitch), incluir: "Seguir docs/dsoficial.md; cores petroleum e solar; tema claro; PT-BR."

---

*Auditoria concluída. Documento vivo: atualizar quando o DS ou o stack do frontend mudar.*
