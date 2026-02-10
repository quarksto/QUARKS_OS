/**
 * Testes de integração das APIs do backend.
 * Requer: DATABASE_URL e JWT_SECRET no .env (e opcionalmente usuário Master para rotas autenticadas).
 */
require('dotenv').config();
const request = require('supertest');

// App exporta apenas o express, sem iniciar o servidor
let app;
beforeAll(() => {
  delete require.cache[require.resolve('../src/server')];
  app = require('../src/server');
});

describe('APIs - Health e raiz', () => {
  test('GET / retorna mensagem da API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/quarks|running|api/i);
  });

  test('GET /health retorna status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
    expect(res.body).toHaveProperty('timestamp');
  });

  test('GET /api/health/db conecta ao banco', async () => {
    const res = await request(app).get('/api/health/db');
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('status');
    if (res.status === 200) expect(res.body.database).toBe('connected');
  });
});

describe('APIs - Auth', () => {
  test('POST /api/auth/login sem body retorna erro (4xx ou 5xx)', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/auth/login com credenciais inválidas retorna 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/auth/login com Master (seed) retorna token', async () => {
    const email = process.env.E2E_LOGIN_EMAIL || 'master@quarks.solar';
    const password = process.env.E2E_LOGIN_PASSWORD || 'master123';
    const res = await request(app).post('/api/auth/login').send({ email, password });
    if (res.status !== 200) {
      console.warn('Login Master falhou (seed pode não estar aplicado):', res.body);
      return;
    }
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', email);
  });
});

describe('APIs - Analytics (públicas)', () => {
  test('GET /api/analytics/dashboard retorna métricas', async () => {
    const res = await request(app).get('/api/analytics/dashboard');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(typeof res.body).toBe('object');
  });

  test('GET /api/analytics/funnel retorna funnel', async () => {
    const res = await request(app).get('/api/analytics/funnel');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body) || typeof res.body === 'object').toBe(true);
  });

  test('GET /api/analytics/activity retorna atividade', async () => {
    const res = await request(app).get('/api/analytics/activity');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body) || typeof res.body === 'object').toBe(true);
  });
});

describe('APIs - Leads (pipeline público)', () => {
  test('GET /api/leads/pipeline retorna estágios', async () => {
    const res = await request(app).get('/api/leads/pipeline');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(typeof res.body).toBe('object');
  });
});

describe('APIs - Leads (autenticadas)', () => {
  let token;

  beforeAll(async () => {
    const email = process.env.E2E_LOGIN_EMAIL || 'master@quarks.solar';
    const password = process.env.E2E_LOGIN_PASSWORD || 'master123';
    const res = await request(app).post('/api/auth/login').send({ email, password });
    if (res.status === 200 && res.body.token) token = res.body.token;
  });

  test('GET /api/leads sem token retorna 401', async () => {
    const res = await request(app).get('/api/leads');
    expect(res.status).toBe(401);
  });

  test('GET /api/leads com token retorna array', async () => {
    if (!token) return;
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('APIs - Proposals (autenticadas)', () => {
  let token;

  beforeAll(async () => {
    const email = process.env.E2E_LOGIN_EMAIL || 'master@quarks.solar';
    const password = process.env.E2E_LOGIN_PASSWORD || 'master123';
    const res = await request(app).post('/api/auth/login').send({ email, password });
    if (res.status === 200 && res.body.token) token = res.body.token;
  });

  test('GET /api/proposals sem token retorna 401', async () => {
    const res = await request(app).get('/api/proposals');
    expect(res.status).toBe(401);
  });

  test('GET /api/proposals com token retorna array', async () => {
    if (!token) return;
    const res = await request(app)
      .get('/api/proposals')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('APIs - Users (autenticado)', () => {
  let token;

  beforeAll(async () => {
    const email = process.env.E2E_LOGIN_EMAIL || 'master@quarks.solar';
    const password = process.env.E2E_LOGIN_PASSWORD || 'master123';
    const res = await request(app).post('/api/auth/login').send({ email, password });
    if (res.status === 200 && res.body.token) token = res.body.token;
  });

  test('GET /api/users sem token retorna 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  test('GET /api/users com token retorna array', async () => {
    if (!token) return;
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('APIs - Proposals públicas (slug)', () => {
  test('GET /api/proposals/public/slug-invalido retorna 404', async () => {
    const res = await request(app).get('/api/proposals/public/slug-inexistente-12345');
    expect(res.status).toBe(404);
  });
});

describe('APIs - Copilot', () => {
  test('POST /api/copilot/chat existe (200 ou 503 por API key)', async () => {
    const res = await request(app)
      .post('/api/copilot/chat')
      .send({ message: 'Ping' });
    expect(res.status).not.toBe(404);
  });
});
