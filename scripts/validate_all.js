#!/usr/bin/env node
/**
 * Validação rápida — QUARKS_OS
 * Requer: backend rodando em http://localhost:3001 (node src/server.js a partir de src/backend)
 * Uso: node scripts/validate_all.js
 */

const http = require('http');

const BASE = 'http://localhost:3001';
const TIMEOUT = 8000;

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE);
        const options = {
            hostname: url.hostname,
            port: url.port || 3001,
            path: url.pathname + url.search,
            method,
            headers: { 'Content-Type': 'application/json' },
            timeout: TIMEOUT
        };
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: data ? JSON.parse(data) : {} });
                } catch {
                    resolve({ status: res.statusCode, data });
                }
            });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function main() {
    console.log('=== Validação QUARKS_OS ===\n');
    let ok = 0;
    let fail = 0;

    // 1. Health
    try {
        const r = await request('GET', '/health');
        if (r.status === 200) {
            console.log('✅ GET /health');
            ok++;
        } else {
            console.log('❌ GET /health', r.status);
            fail++;
        }
    } catch (e) {
        console.log('❌ GET /health —', e.message, '(backend está rodando?)');
        fail++;
    }

    // 2. Analytics Dashboard (KPIs)
    try {
        const r = await request('GET', '/api/analytics/dashboard');
        if (r.status === 200 && (r.data.activeLeads !== undefined || r.data.conversionRate !== undefined)) {
            console.log('✅ GET /api/analytics/dashboard');
            ok++;
        } else {
            console.log('❌ GET /api/analytics/dashboard', r.status, r.data);
            fail++;
        }
    } catch (e) {
        console.log('❌ GET /api/analytics/dashboard —', e.message);
        fail++;
    }

    // 3. Pipeline (Kanban)
    try {
        const r = await request('GET', '/api/leads/pipeline');
        if (r.status === 200 && typeof r.data === 'object' && Array.isArray(r.data.NEW)) {
            console.log('✅ GET /api/leads/pipeline');
            ok++;
        } else {
            console.log('❌ GET /api/leads/pipeline', r.status);
            fail++;
        }
    } catch (e) {
        console.log('❌ GET /api/leads/pipeline —', e.message);
        fail++;
    }

    // 4. Webhook Marketing (consumption default, schema Lead)
    try {
        const payload = {
            entry: [{
                changes: [{
                    value: {
                        form_id: 'VAL_' + Date.now(),
                        field_data: [
                            { name: 'full_name', values: ['Validação Script'] },
                            { name: 'email', values: ['validate@quarks.local'] },
                            { name: 'city', values: ['Belo Horizonte'] }
                        ]
                    }
                }]
            }
        };
        const r = await request('POST', '/api/marketing/webhook/facebook_ads', payload);
        if (r.status === 200 && r.data.success && r.data.id) {
            console.log('✅ POST /api/marketing/webhook/facebook_ads (lead criado:', r.data.id + ')');
            ok++;
        } else {
            console.log('❌ POST /api/marketing/webhook/facebook_ads', r.status, r.data);
            fail++;
        }
    } catch (e) {
        console.log('❌ POST /api/marketing/webhook —', e.message);
        fail++;
    }

    // 5. Catálogo — Kits
    try {
        const r = await request('GET', '/api/inventory/kits');
        if (r.status === 200 && Array.isArray(r.data)) {
            console.log('✅ GET /api/inventory/kits');
            ok++;
        } else {
            console.log('❌ GET /api/inventory/kits', r.status);
            fail++;
        }
    } catch (e) {
        console.log('❌ GET /api/inventory/kits —', e.message);
        fail++;
    }

    // 6. Search (busca global — requer auth; 401 = rota existe)
    try {
        const r = await request('GET', '/api/search?q=test');
        if (r.status === 200 && r.data && (r.data.leads !== undefined || r.data.proposals !== undefined)) {
            console.log('✅ GET /api/search');
            ok++;
        } else if (r.status === 401) {
            console.log('✅ GET /api/search (rota ok; requer login)');
            ok++;
        } else {
            console.log('❌ GET /api/search', r.status);
            fail++;
        }
    } catch (e) {
        console.log('❌ GET /api/search —', e.message);
        fail++;
    }

    console.log('\n--- Resultado ---');
    console.log(`OK: ${ok} | Falhas: ${fail}`);
    process.exit(fail > 0 ? 1 : 0);
}

main();
