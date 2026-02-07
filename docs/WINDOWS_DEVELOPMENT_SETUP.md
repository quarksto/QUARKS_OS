# Desenvolvimento no Windows — Scripts Speckit

**Atualizado**: 2026-02-03

O projeto usa scripts Bash para o fluxo Speckit (`/speckit.specify`, `/speckit.implement`, etc.). No Windows, é necessário um ambiente compatível com Bash.

---

## Opções de Execução

### 1. Git Bash (Recomendado)

Se você instalou **Git for Windows**, o Git Bash já está disponível.

- **Como executar**: Abra "Git Bash" no menu Iniciar ou integrado ao terminal do VS Code/Cursor.
- **Verificar**: `bash --version` deve retornar a versão do Bash.
- **Caminho dos scripts**:
  - `.specify/scripts/bash/check-prerequisites.sh` — usado por `/speckit.implement`
  - `.agent/skills/scripts/bash/create-new-feature.sh` — usado por `/speckit.specify`
  - `.agent/skills/scripts/bash/setup-plan.sh` — usado por `/speckit.plan`

**Configurar Cursor/VS Code**:
- Em `settings.json`, defina o terminal integrado como Git Bash:
  ```json
  "terminal.integrated.defaultProfile.windows": "Git Bash"
  ```
- Ou use o perfil "Git Bash" ao abrir um novo terminal.

### 2. WSL (Windows Subsystem for Linux)

- Instale WSL2: `wsl --install`
- Abra um terminal WSL (Ubuntu ou outra distro).
- Navegue até o repositório (ex.: `/mnt/d/QUARKS_OS`).
- Execute os scripts normalmente: `./.specify/scripts/bash/check-prerequisites.sh --json`

**Nota**: Paths no WSL usam `/mnt/d/` para `D:\`. O Cursor pode abrir o workspace via path Windows; dentro do WSL use o path montado.

### 3. PowerShell (Limitado)

Os scripts são Bash puro e **não rodam nativamente no PowerShell**. Para usar PowerShell:

- **Alternativa 1**: Invocar Bash explicitamente:
  ```powershell
  bash .\.specify\scripts\bash\check-prerequisites.sh --json
  ```
  (Requer Git Bash no PATH.)

- **Alternativa 2**: Scripts PowerShell equivalentes não existem no momento. Use Git Bash ou WSL para o fluxo Speckit completo.

---

## Scripts e Caminhos

| Script | Caminho | Uso |
|--------|---------|-----|
| check-prerequisites.sh | `.specify/scripts/bash/` | Implement — verifica plan.md, tasks.md |
| common.sh | `.specify/scripts/bash/` | Sourced por check-prerequisites |
| create-new-feature.sh | `.agent/skills/scripts/bash/` | Specify — cria branch e spec |
| setup-plan.sh | `.agent/skills/scripts/bash/` | Plan — setup de plan.md |

O `create-new-feature.sh` usa o template em `.specify/templates/spec-template.md`. Certifique-se de que `.specify/` existe (criado pela auditoria de metodologia).

---

## Troubleshooting

### "bash: command not found"
- Instale Git for Windows ou use WSL.
- Verifique que `bash` está no PATH: `where bash` (PowerShell) ou `which bash` (Git Bash).

### "Permission denied" ao executar script
- No Git Bash: `chmod +x .specify/scripts/bash/check-prerequisites.sh`
- Ou execute com: `bash .specify/scripts/bash/check-prerequisites.sh`

### Script falha com "specs directory not found"
- O repositório deve ter a pasta `specs/` na raiz.
- Em não-git repos, o script usa `SPECIFY_FEATURE` ou a última pasta em `specs/`.

### Numeração de branches (01 vs 001)
- Specs existentes usam 2 dígitos (01, 02, 06).
- O `create-new-feature.sh` gera 3 dígitos (001, 002).
- O `common.sh` em `.specify/scripts/bash/` aceita ambos (regex `[0-9]{2,3}-`).

---

## Referências

- [Metodologia Speckit](../.agent/workflows/00-speckit.all.md)
- [Constitution](../.specify/memory/constitution.md)
- [JORNADA_E_FLUXO](JORNADA_E_FLUXO.md)
