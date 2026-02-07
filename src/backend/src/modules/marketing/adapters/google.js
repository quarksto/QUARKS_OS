class GoogleAdapter {
    normalize(payload) {
        // Payload do Google Ads Lead Form Extension
        // Estrutura: { google_key, lead_id, user_column_data: [{ column_id, string_value }] }

        const userData = {};
        if (Array.isArray(payload.user_column_data)) {
            payload.user_column_data.forEach(col => {
                const key = col.column_id?.toUpperCase();
                const value = col.string_value || col.value;
                if (key && value) userData[key] = value;
            });
        }

        // Extração de nome (múltiplas variações)
        const name = userData['FULL_NAME'] || userData['NAME'] || userData['NOME'] || userData['NOME_COMPLETO'] || 'Lead Google';

        // Extração de email
        const email = userData['EMAIL'] || userData['E_MAIL'] || null;

        // Extração de telefone (múltiplas variações)
        const phone = userData['PHONE_NUMBER'] || userData['PHONE'] || userData['TELEFONE'] || userData['CELULAR'] || null;

        // Extração de cidade/localização (múltiplas variações)
        const location = userData['CITY'] || userData['CIDADE'] || userData['LOCATION'] || userData['MUNICIPIO'] || null;

        // Consumo com fallback inteligente
        let consumption = parseFloat(userData['CONSUMPTION'] || userData['CONSUMO'] || userData['CONSUMO_KWH']);
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
            origin: 'GOOGLE_ADS'
        };
    }
}

module.exports = { GoogleAdapter };
