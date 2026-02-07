---
description: Diretriz para integração com APIs externas (Google, Facebook, TikTok) e ingestão de Leads.
---

# Regra de Integrações e APIs Externas

1. **Mindset API-First**:
   - Ao desenhar novas funcionalidades, sempre verifique se existe uma API de mercado (Google Maps, Calendar, Gmail) que possa enriquecer a experiência antes de construir do zero.

2. **Gestão de Leads (Marketing Integrations)**:
   - O `LeadDomainAgent` deve ser preparado para ingerir leads de múltiplas fontes via **Webhooks** padronizados.
   - **Fontes Obrigatórias**:
     - **Google Ads**: Configurar endpoint para *Lead Form Extensions*.
     - **Facebook/Meta Ads**: Integração via *Webhooks* ou Graph API para *Lead Ads*.
     - **TikTok Ads**: Integração via *Marketing API* para eventos de conversão e coleta de leads.

3. **Arquitetura de Adapters**:
   - Utilize o padrão **Adapter** para normalizar dados vindo destas fontes diferentes para o formato canônico de `Lead` do Quarks OS.
   - Exemplo: `FacebookLeadAdapter`, `GoogleAdsAdapter`.

4. **Escalabilidade & Rate Limiting**:
   - Todas as chamadas para APIs externas devem considerar *Jobs Assíncronos* (Queue) para respeitar limites de taxa (Rate Limits) e evitar bloqueio da thread principal.
