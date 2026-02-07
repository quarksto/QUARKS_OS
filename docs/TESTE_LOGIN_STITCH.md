# 🧪 Guia de Teste - Nova Login Page (Stitch)

**Data**: 2026-02-05 17:40  
**Status**: ✅ ATIVADA - PRONTA PARA TESTE  
**Arquivo**: `src/frontend/src/pages/LoginPageStitch.jsx`

---

## ✅ ATIVAÇÃO CONCLUÍDA

A nova Login Page gerada com Stitch MCP foi **ativada com sucesso**!

### Mudança Aplicada

```diff
// src/frontend/src/App.jsx

- import LoginPage from './pages/LoginPage';
+ import LoginPage from './pages/LoginPageStitch';
```

---

## 🧪 COMO TESTAR

### 1. Acessar a Página

Abra o navegador e acesse:

```
http://localhost:5173/login
```

### 2. Verificar Design Visual

Você deve ver:

#### ✅ Layout Geral
- [ ] Fundo cinza claro (#F1F5F9)
- [ ] Card branco centralizado
- [ ] Pattern de pontos sutil no fundo
- [ ] Layout responsivo (testar mobile, tablet, desktop)

#### ✅ Branding
- [ ] Logo "Quarks OS" no topo (petroleum #0F4C5C)
- [ ] Ícone SVG ao lado do logo
- [ ] Subtítulo "GESTÃO SOLAR INTELIGENTE"

#### ✅ Card de Login
- [ ] Título "Bem-vindo de volta"
- [ ] Subtítulo "Acesse sua conta para gerenciar seus ativos solares"
- [ ] Borda cinza clara (border-slate-200)
- [ ] Sombra sutil (shadow-sm)
- [ ] Cantos arredondados (rounded-lg)

#### ✅ Formulário
- [ ] Campo Email com ícone de envelope
- [ ] Campo Senha com ícone de cadeado
- [ ] Botão de visibilidade de senha (olho)
- [ ] Checkbox "Lembrar-me"
- [ ] Link "Esqueceu a senha?" (petroleum)
- [ ] Botão "Entrar" (solar #F59E0B, rounded-full)

#### ✅ Rodapé
- [ ] Divisor horizontal
- [ ] Texto "Ainda não tem conta?"
- [ ] Link "Solicitar acesso" (petroleum)
- [ ] Links legais: Termos, Privacidade, Suporte
- [ ] Linha decorativa no final

---

## 🔍 TESTES FUNCIONAIS

### 3. Testar Interações

#### ✅ Inputs
- [ ] Clicar no campo Email → Focus state petroleum
- [ ] Clicar no campo Senha → Focus state petroleum
- [ ] Digitar no Email → Texto aparece
- [ ] Digitar na Senha → Texto oculto (••••)

#### ✅ Password Toggle
- [ ] Clicar no ícone de olho → Senha fica visível
- [ ] Clicar novamente → Senha fica oculta

#### ✅ Checkbox
- [ ] Clicar em "Lembrar-me" → Checkbox marca/desmarca
- [ ] Hover no checkbox → Cor muda

#### ✅ Links
- [ ] Hover em "Esqueceu a senha?" → Underline aparece
- [ ] Hover em "Solicitar acesso" → Underline aparece
- [ ] Hover em links do rodapé → Cor muda para petroleum

#### ✅ Botão Entrar
- [ ] Hover → Cor muda para amber-600
- [ ] Click → Scale reduz (active:scale-[0.98])
- [ ] Sombra sutil (shadow-md)

---

## 🧪 TESTES DE AUTENTICAÇÃO

### 4. Testar Login

#### ✅ Login com Credenciais Válidas
1. Digite email válido (ex: `admin@quarks.com`)
2. Digite senha válida (ex: `admin123`)
3. Clique em "Entrar"
4. **Esperado**: 
   - Botão mostra spinner de loading
   - Redirecionamento para `/dashboard`

#### ✅ Login com Credenciais Inválidas
1. Digite email inválido
2. Digite senha inválida
3. Clique em "Entrar"
4. **Esperado**:
   - Mensagem de erro aparece (bg-red-50)
   - Ícone de erro visível
   - Botão volta ao estado normal

#### ✅ Validação de Formulário
1. Deixe campos vazios
2. Clique em "Entrar"
3. **Esperado**:
   - Validação HTML5 impede submit
   - Mensagem "Preencha este campo"

---

## 📱 TESTES DE RESPONSIVIDADE

### 5. Testar em Diferentes Tamanhos

#### ✅ Desktop (> 1024px)
- [ ] Card centralizado
- [ ] Largura máxima 448px (max-w-md)
- [ ] Espaçamento adequado

#### ✅ Tablet (768px - 1024px)
- [ ] Card centralizado
- [ ] Padding lateral adequado
- [ ] Elementos legíveis

#### ✅ Mobile (< 768px)
- [ ] Card ocupa largura disponível
- [ ] Padding reduzido
- [ ] Botões e inputs em tamanho adequado
- [ ] Texto legível

---

## ♿ TESTES DE ACESSIBILIDADE

### 6. Testar Acessibilidade

#### ✅ Navegação por Teclado
- [ ] Tab → Foco vai para Email
- [ ] Tab → Foco vai para Senha
- [ ] Tab → Foco vai para Checkbox
- [ ] Tab → Foco vai para "Esqueceu a senha?"
- [ ] Tab → Foco vai para "Entrar"
- [ ] Enter no botão → Submit do formulário

#### ✅ Focus States
- [ ] Inputs mostram ring petroleum ao focar
- [ ] Links mostram outline ao focar
- [ ] Botão mostra outline ao focar

#### ✅ Labels e ARIA
- [ ] Inputs têm labels associados
- [ ] Ícones são decorativos (não interferem)
- [ ] Mensagens de erro são anunciadas

---

## 🎨 COMPARAÇÃO VISUAL

### 7. Comparar com Design Stitch

Abra a imagem de referência:
```
screen_697a98eb765e4a4b954a4af3140604a8.png
```

Verifique se a implementação React corresponde ao design:

- [ ] Layout idêntico
- [ ] Cores corretas (petroleum + solar)
- [ ] Tipografia consistente
- [ ] Espaçamento igual
- [ ] Ícones corretos
- [ ] Bordas e sombras iguais

---

## 🐛 PROBLEMAS CONHECIDOS

### Possíveis Issues

1. **Gradiente no rodapé**: Há um gradiente decorativo sutil
   - Se não quiser, remover linha 225 de `LoginPageStitch.jsx`

2. **Ícone SVG customizado**: Logo usa SVG customizado
   - Se preferir, substituir por logo real do Quarks OS

3. **Links não funcionais**: Links de rodapé são `href="#"`
   - Implementar rotas reais se necessário

---

## ✅ CHECKLIST FINAL

### Antes de Aprovar

- [ ] Design visual conforme Stitch
- [ ] Cores petroleum + solar corretas
- [ ] SEM gradientes (exceto decorativo)
- [ ] Tema claro (light mode)
- [ ] Login funciona (credenciais válidas)
- [ ] Erro aparece (credenciais inválidas)
- [ ] Password toggle funciona
- [ ] Checkbox funciona
- [ ] Links funcionam
- [ ] Responsivo em todos os tamanhos
- [ ] Acessível (teclado + screen reader)
- [ ] Performance boa (sem lags)

---

## 📝 REPORTAR PROBLEMAS

Se encontrar algum problema, documente:

### Template de Bug Report

```markdown
**Problema**: [Descrição breve]

**Passos para Reproduzir**:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Esperado**: [O que deveria acontecer]

**Atual**: [O que está acontecendo]

**Screenshot**: [Se aplicável]

**Ambiente**:
- Browser: [Chrome, Firefox, Safari, etc.]
- Tamanho de tela: [Desktop, Tablet, Mobile]
- Sistema: [Windows, Mac, Linux]
```

---

## 🎉 PRÓXIMOS PASSOS

### Se Tudo Estiver OK

1. ✅ Marcar LoginPageStitch como aprovado
2. ✅ Remover LoginPage.jsx antigo (opcional)
3. ✅ Gerar próxima página (Dashboard, Leads, etc.)

### Se Houver Problemas

1. ⚠️ Documentar issues
2. ⚠️ Corrigir problemas
3. ⚠️ Testar novamente

---

**Status**: 🧪 AGUARDANDO TESTES  
**Testador**: Você  
**Prazo**: Agora! 😄
