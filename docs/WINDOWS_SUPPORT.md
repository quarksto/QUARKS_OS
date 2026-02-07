# Suporte Windows para Scripts Speckit

**Versão**: 1.0  
**Data**: 2026-02-03

---

## Contexto

Os scripts do Speckit (`.agent/skills/scripts/bash/`) são escritos em **Bash**. Para executá-los no Windows, você precisa de um ambiente compatível.

---

## Opções de Ambiente

### Opção 1: Git Bash (Recomendado)

O **Git for Windows** inclui o Git Bash, que fornece um ambiente Bash completo.

#### Instalação

1. Baixe o Git for Windows: https://git-scm.com/download/win
2. Execute o instalador com as opções padrão
3. Durante a instalação, selecione "Use Git and optional Unix tools from the Command Prompt"

#### Uso

```bash
# Abra o Git Bash e navegue até o projeto
cd /d/QUARKS_OS

# Execute scripts normalmente
./.agent/skills/scripts/bash/create-new-feature.sh --json "Add new feature"
```

#### Integração com VS Code

Defina o Git Bash como terminal padrão no VS Code:

```json
// settings.json
{
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

---

### Opção 2: WSL (Windows Subsystem for Linux)

O WSL fornece um ambiente Linux completo no Windows.

#### Instalação

```powershell
# No PowerShell como Administrador
wsl --install

# Reinicie o computador quando solicitado
# Após reiniciar, configure seu usuário Linux
```

#### Uso

```bash
# Abra o terminal WSL
wsl

# Navegue até o projeto (drives montados em /mnt/)
cd /mnt/d/QUARKS_OS

# Execute scripts
./.agent/skills/scripts/bash/create-new-feature.sh --json "Add new feature"
```

#### Configuração Adicional

Para melhor compatibilidade com arquivos Windows:

```bash
# Crie/edite /etc/wsl.conf
sudo nano /etc/wsl.conf

# Adicione:
[automount]
options = "metadata,umask=22,fmask=11"

[interop]
appendWindowsPath = true
```

---

### Opção 3: PowerShell (Limitado)

Alguns comandos podem ser adaptados para PowerShell, mas **não é recomendado** para scripts complexos.

---

## Scripts Disponíveis

| Script | Propósito | Uso |
|--------|-----------|-----|
| `create-new-feature.sh` | Cria nova feature/branch | `--json --short-name "name" "description"` |
| `setup-plan.sh` | Configura plan.md | `--json` |
| `check-prerequisites.sh` | Valida pré-requisitos | `--json --require-tasks` |
| `update-agent-context.sh` | Atualiza contexto de agentes | `[agent_type]` |

---

## Troubleshooting

### Erro: "Permission denied"

```bash
# Adicione permissão de execução
chmod +x .agent/skills/scripts/bash/*.sh
```

### Erro: "bad interpreter: /bin/bash^M"

O script tem line endings Windows (CRLF). Converta para Unix (LF):

```bash
# Com sed
sed -i 's/\r$//' .agent/skills/scripts/bash/*.sh

# Ou com dos2unix
dos2unix .agent/skills/scripts/bash/*.sh
```

### Erro: "command not found: jq"

Alguns scripts podem requerer ferramentas Unix adicionais:

```bash
# Git Bash com Chocolatey
choco install jq

# WSL (Ubuntu)
sudo apt install jq
```

---

## Alternativas para o Futuro

### PowerShell Wrappers (Planejado)

Uma alternativa seria criar wrappers PowerShell para os scripts mais usados:

```powershell
# Exemplo futuro: New-SpeckitFeature.ps1
function New-SpeckitFeature {
    param([string]$Description, [string]$ShortName)
    # Implementação nativa em PowerShell
}
```

> [!NOTE]
> Esta é uma melhoria de baixa prioridade. O Git Bash atende 100% dos casos de uso atuais.

---

## Referências

- [Git for Windows](https://git-scm.com/download/win)
- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Speckit Skills](./../.agent/skills/)
