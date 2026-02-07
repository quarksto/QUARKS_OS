class BaseAdapter {
    normalize(payload) {
        throw new Error('Method not implemented');
    }
}

class FacebookAdapter extends BaseAdapter {
    normalize(payload) {
        // Payload típico do Facebook Lead Ads
        // Estrutura: { entry: [{ changes: [{ value: { form_id, field_data: [...] } }] }] }
        const leadData = payload.entry?.[0]?.changes?.[0]?.value || {};

        // Mapeamento de campos (field_data vem como array de objetos { name, values })
        const formData = {};
        if (leadData.form_id && Array.isArray(leadData.field_data)) {
            leadData.field_data.forEach(field => {
                const key = field.name?.toLowerCase();
                const value = field.values?.[0];
                if (key && value) formData[key] = value;
            });
        }

        // Extração de nome (múltiplas variações)
        const name = formData.full_name || formData.name || formData.nome_completo || formData.nome || 'Lead Facebook';

        // Extração de email
        const email = formData.email || formData.e_mail || null;

        // Extração de telefone (múltiplas variações)
        const phone = formData.phone_number || formData.phone || formData.telefone || formData.celular || null;

        // Extração de cidade/localização (múltiplas variações)
        const location = formData.city || formData.cidade || formData.location || formData.municipio || formData.localidade || null;

        // Consumo com fallback inteligente
        let consumption = parseFloat(formData.consumption || formData.consumo || formData.consumo_kwh);
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
            origin: 'FACEBOOK_ADS'
        };
    }
}

module.exports = { FacebookAdapter };
