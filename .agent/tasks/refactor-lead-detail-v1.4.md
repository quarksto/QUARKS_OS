# Task: Refatoramento Total LeadDetailPage v1.4

**Status**: 🏗️ Em Planejamento
**Agente**: `frontend-specialist`
**User Request**: Refatorar a página de detalhes do lead seguindo `dsoficial.md` e `ui-ux-pro-max`.

## 🎯 Objetivo
Transformar a `LeadDetailPage` em uma interface de alta fidelidade, seguindo o padrão **Super Flat**, **Zero Sombras**, e **h-8**.

## 🛠️ Stack Técnica
- React (Frontend)
- Tailwind CSS (Estilização DS v1.4)
- Material Symbols Outlined (Ícones stroke-300)
- Lucide React (Ícones de marca se necessário)

## 📋 Checklist de Mudanças

### 1. Estrutura de Layout (LeadDetailPage.jsx)
- [ ] Ajustar padding global para `p-6` (padrão Workspace).
- [ ] Refinar as Tabs horizontais: usar bordas sutis e animação `scale-x` no indicador ativo.
- [ ] Implementar Barra de Pipeline interativa (DS §260).

### 2. Componentes de Dados (Technical Sheet & Canvas)
- [ ] **LeadTechnicalSheet**: Padronizar KPIs com `.ds-display-l` (32px).
- [ ] Remover sombras residuais em cards.
- [ ] Validar todos os botões para `rounded-full` e `h-8`.
- [ ] Trocar ícones para `ds-icon-w300`.

### 3. Sistema de Edição (Side Drawer)
- [ ] Implementar `LeadDetailDrawer.jsx` para edição de dados básicos e qualificação.
- [ ] Utilizar `ModalPrimitives.jsx` para garantir a mesma assinatura visual de overlays.

### 4. Integração IA (Copilot)
- [ ] Garantir que o `CopilotContext` seja atualizado em cada troca de Tab.
- [ ] Adicionar "Action Pills" nas sugestões da IA.

## 📅 Protótipo de Fluxo
1. Usuário entra na página -> Vê KPIs técnicos e pipeline.
2. Clica em "Editar" -> Abre Drawer à direita com formulários `h-8`.
3. Altera status -> Feedback visual imediato na barra de pipeline.
4. IA sugere ação -> Usuário clica na pílula -> IA executa.

## 🧪 Verificação
- [ ] Validar responsividade (Mobile/Desktop).
- [ ] Verificar contraste de cores (Petroleum/Slate).
- [ ] Testar builds e ausência de erros no console.
