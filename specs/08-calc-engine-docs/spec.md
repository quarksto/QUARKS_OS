# Backend Calc Engine Documentation

**Branch**: `08-calc-engine-docs`
**Status**: DOCUMENTATION
**Created**: 2026-02-03

## Goal Description

Documentar formalmente o calc_engine Python existente, que é o motor de cálculos do Quarks OS. Este módulo já está **implementado** e operacional. A spec serve para:

1. Formalizar os endpoints existentes
2. Documentar os modelos de dados
3. Definir gaps para futuras melhorias

## Existing Implementation

O calc_engine é uma aplicação **FastAPI** que roda na porta 8000 e oferece:

### Endpoints de Cálculo (Core)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/calculate/generation` | POST | Calcula geração solar baseado no consumo |
| `/calculate/roi` | POST | Calcula ROI, payback e savings |
| `/calculate/tariff` | POST | Obtém tarifa da distribuidora |
| `/generate/proposal` | POST | Gera HTML da proposta |

### Endpoints de API (Migração Python)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Autenticação |
| `/api/leads` | CRUD | Gerenciamento de leads |
| `/api/copilot/*` | Various | Copilot multimodal |

### Modelos de Dados

#### GenerationRequest

```python
class GenerationRequest:
    consumption: float      # kWh mensal
    location: str?          # Cidade/UF (para irradiação)
    panel_power: float?     # Potência do painel (default 550W)
```

#### GenerationResponse

```python
class GenerationResponse:
    system_size_kwp: float
    panels_count: int
    estimated_generation_monthly: float
    area_required_m2: float
```

#### ROIRequest

```python
class ROIRequest:
    system_cost: float
    generation_monthly: float
    tariff_price: float
```

#### ROIResponse

```python
class ROIResponse:
    payback_years: float
    monthly_savings: float
    total_savings: float
    roi_percentage: float
```

## Technical Context

- **Framework**: FastAPI 0.109+
- **Python**: 3.11+
- **Database**: PostgreSQL via Prisma (Python client)
- **Port**: 8000 (default)
- **Location**: `src/calc_engine/`

## Gaps Identificados

### P1 - Melhorias de Cálculo

- [ ] Suporte a irradiação por coordenadas GPS
- [ ] Cálculo de degradação de painéis (25 anos)
- [ ] Simulação GD2 (Geração Distribuída 2)

### P2 - Integração

- [ ] Cache de tarifas (Redis)
- [ ] Rate limiting para endpoints públicos
- [ ] Metrics/Observability (Prometheus)

### P3 - Documentação

- [ ] Swagger/OpenAPI atualizado
- [ ] Exemplos de request/response
- [ ] Diagramas de fluxo

## Verification

O calc_engine está rodando e pode ser verificado:

```bash
curl http://localhost:8000/health
# {"status":"ok","service":"calc-engine"}
```

## Conclusion

Este módulo está **100% operacional**. Esta spec serve como documentação de referência e roadmap de melhorias futuras.
