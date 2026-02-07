const AdapterFactory = require('./src/modules/marketing/adapters');

console.log('🧪 Testando Adaptadores de Marketing\n');

// ===== FACEBOOK =====
console.log('📘 Facebook Lead Ads:');
const facebookPayload = {
    entry: [{
        changes: [{
            value: {
                form_id: '123456',
                field_data: [
                    { name: 'full_name', values: ['João Silva'] },
                    { name: 'email', values: ['joao@example.com'] },
                    { name: 'phone_number', values: ['11987654321'] },
                    { name: 'cidade', values: ['São Paulo'] },
                    { name: 'consumo', values: ['750'] }
                ]
            }
        }]
    }]
};

const fbAdapter = AdapterFactory.getAdapter('facebook');
const fbResult = fbAdapter.normalize(facebookPayload);
console.log(JSON.stringify(fbResult, null, 2));

// ===== GOOGLE =====
console.log('\n📗 Google Ads:');
const googlePayload = {
    google_key: 'abc123',
    lead_id: 'lead_456',
    user_column_data: [
        { column_id: 'FULL_NAME', string_value: 'Maria Santos' },
        { column_id: 'EMAIL', string_value: 'maria@example.com' },
        { column_id: 'PHONE_NUMBER', string_value: '21987654321' },
        { column_id: 'CITY', string_value: 'Rio de Janeiro' },
        { column_id: 'CONSUMPTION', string_value: '600' }
    ]
};

const googleAdapter = AdapterFactory.getAdapter('google');
const googleResult = googleAdapter.normalize(googlePayload);
console.log(JSON.stringify(googleResult, null, 2));

// ===== TIKTOK =====
console.log('\n📙 TikTok Lead Generation:');
const tiktokPayload = {
    page_id: 'page_789',
    ad_id: 'ad_101',
    form_id: 'form_202',
    leads: [{
        field_data: {
            name: 'Pedro Costa',
            email: 'pedro@example.com',
            phone: '31987654321',
            city: 'Belo Horizonte',
            consumo_kwh: '850'
        }
    }]
};

const tiktokAdapter = AdapterFactory.getAdapter('tiktok');
const tiktokResult = tiktokAdapter.normalize(tiktokPayload);
console.log(JSON.stringify(tiktokResult, null, 2));

// ===== TESTE DE FALLBACK (sem consumo) =====
console.log('\n⚠️  Teste de Fallback (sem consumo):');
const fallbackPayload = {
    entry: [{
        changes: [{
            value: {
                form_id: '999',
                field_data: [
                    { name: 'nome', values: ['Ana Oliveira'] },
                    { name: 'e_mail', values: ['ana@example.com'] }
                ]
            }
        }]
    }]
};

const fallbackResult = fbAdapter.normalize(fallbackPayload);
console.log(JSON.stringify(fallbackResult, null, 2));

console.log('\n✅ Todos os adaptadores testados com sucesso!');
