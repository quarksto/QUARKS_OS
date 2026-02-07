# Planejamento: Google Maps + Solar API no Modal Ficha do Lead

**Data:** 2026-02-03  
**Referência:** MCP Stitch (Ficha do Lead), DS v1, Dashboard de referência.

---

## 1. Objetivo

Integrar no modal de detalhe do lead (ao clicar no card Kanban) as possibilidades das APIs do Google:

- **Google Maps** — Visualização do endereço (mapa estático/embed).
- **Google Solar API** — Potencial solar do telhado, insights de instalação.

---

## 2. APIs Consideradas

| API | Uso | Pré-requisito |
|-----|-----|---------------|
| **Maps Embed API** | Iframe com mapa do endereço | API key (place mode) |
| **Geocoding API** | Endereço → lat/lng | API key (para Solar) |
| **Solar API** | buildingInsights, dataLayers | Lat/lng + API key |

### Fluxo de Dados

```
lead.location (ex: "Curitiba, PR") 
    → Maps Embed: iframe com q=endereço
    → Solar API: Geocoding (endereço→lat,lng) → buildingInsights
```

---

## 3. Componentes (MCP + DS)

### 3.1 LeadModalAddress (Endereço e Instalação)

Estrutura MCP "Ficha do Lead" — seção com:

- Título: "Endereço e Instalação" (ícone `map`)
- Container do mapa (h-32 min, rounded-lg, border)
- Botão "Ver no Mapa" (hover)
- Texto do endereço (lead.location)

**Implementação:**
- Se `VITE_GOOGLE_MAPS_API_KEY` definido → iframe Maps Embed (place mode)
- Senão → placeholder + link "Abrir no Google Maps" (maps.google.com?q=...)

### 3.2 LeadModalMap

Componente reutilizável:

- Props: `address`, `apiKey` (opcional)
- Renderiza iframe ou fallback link
- Classes DS: `technical-card`, `rounded-lg`, `border-slate-200`

### 3.3 LeadModalSolarInsights

Card para dados da Solar API:

- **Campos esperados** (quando backend fornecer): 
  - Área útil do telhado (m²)
  - Energia anual estimada (kWh)
  - Potência instalável recomendada (kWp)
  - Qualidade do telhado (sunshine, shade)
- **Estado sem API:** placeholder "Configure Solar API para ver potencial do telhado" + CTA "Dimensionar"
- **Estado com dados:** grid com os valores (ds-meta, ds-display-l)

---

## 4. Backend (Proxy opcional)

### 4.1 Endpoint Solar/Geocoding

```
GET /api/leads/:id/solar
```

- Geocodifica `lead.location` via Geocoding API
- Chama Solar API `buildingInsights` com lat/lng
- Retorna: `{ roofArea, yearlyEnergy, recommendedCapacity, ... }`
- Requer `GOOGLE_MAPS_API_KEY` e habilitação Solar no projeto GCP

### 4.2 Variáveis de Ambiente

| Variável | Uso |
|----------|-----|
| `VITE_GOOGLE_MAPS_API_KEY` | Frontend: Maps Embed iframe |
| `GOOGLE_MAPS_API_KEY` | Backend: Geocoding + Solar API (server-side) |

---

## 5. Checklist de Implementação

- [x] LeadModalMap (iframe + fallback)
- [x] LeadModalAddress (seção Endereço + Mapa)
- [x] LeadModalSolarInsights (estrutura + placeholder)
- [x] Integrar no LeadDetailModal
- [ ] Backend: proxy Solar (quando key configurada)
- [ ] Documentar setup no README

---

## 6. Referências

- [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started)
- [Solar API Overview](https://developers.google.com/maps/documentation/solar/overview)
- MCP Stitch: Ficha do Lead (screenId: 4ceea72db8e2497db3f7933d49575c14)
- DS v1: `technical-card`, `ds-title`, `ds-meta`, `badge-kanban-*`
