class TikTokAdapter {
    normalize(payload) {
        // Payload do TikTok Lead Generation
        // Estrutura: { page_id, ad_id, form_id, leads: [{ field_data: { email, name, ... } }] }

        const lead = payload.leads?.[0] || {};
        const fields = lead.field_data || {};

        // Extração de nome (múltiplas variações)
        const name = fields.name || fields.full_name || fields.nome || fields.nome_completo || 'Lead TikTok';

        // Extração de email
        const email = fields.email || fields.e_mail || null;

        // Extração de telefone (múltiplas variações)
        const phone = fields.phone_number || fields.phone || fields.telefone || fields.celular || null;

        // Extração de cidade/localização (múltiplas variações)
        const location = fields.city || fields.cidade || fields.location || fields.municipio || null;

        // Consumo com fallback inteligente
        let consumption = parseFloat(fields.consumption || fields.consumo || fields.consumo_kwh);
        if (isNaN(consumption) || consumption <= 0) {
            consumption = 500; // Default: 500 kWh/mês
        }

        // Retorna apenas campos válidos do schema Lead
        return {
            name,
            email,
            phone,
            location,
            consumption,
            origin: 'TIKTOK_ADS'
        };
    }
}

module.exports = { TikTokAdapter };
