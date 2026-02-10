require('dotenv').config();
// Triggering restart for env sync
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pino = require('pino');
const logger = pino({ transport: { target: 'pino-pretty' } });
const { initWebSocket } = require('./websocket/gateway');
const ensureDefaultUser = require('../ensure_user');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true })); // Allow all for debugging
app.use(express.json());

const fs = require('fs');
const path = require('path');

// Detailed Request Logger to debug login issues
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLine = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url} | Status: ${res.statusCode} | Duration: ${duration}ms | Origin: ${req.headers.origin}\n`;
    fs.appendFileSync(path.join(__dirname, '../requests.log'), logLine);
  });
  console.log(`[REQUEST] ${req.method} ${req.originalUrl || req.url}`);
  logger.info(`${req.method} ${req.originalUrl || req.url}`);
  next();
});

const authRoutes = require('./modules/auth/routes');
const marketingRoutes = require('./modules/marketing/routes');
const { authenticate, authorize } = require('./middleware/auth');

// Orchestrator & Agents
const { maestro } = require('./orchestrator/maestro');
const leadAgent = require('./agents/lead-domain');
const calcAgent = require('./agents/calc-domain');
const proposalAgent = require('./agents/proposal-domain');
const inventoryAgent = require('./agents/inventory-domain');
const projectAgent = require('./agents/project-domain');
const serviceAgent = require('./agents/service-domain');
const pricingAgent = require('./agents/pricing-domain');
const AnalyticsAgent = require('./agents/analytics-domain');
const analyticsAgent = new AnalyticsAgent();

// Register Agents
maestro.registerAgent('lead', leadAgent);
maestro.registerAgent('calc', calcAgent);
maestro.registerAgent('proposal', proposalAgent);
maestro.registerAgent('inventory', inventoryAgent);
maestro.registerAgent('project', projectAgent);
maestro.registerAgent('service', serviceAgent);
maestro.registerAgent('pricing', pricingAgent);
maestro.registerAgent('analytics', analyticsAgent);


// Routes
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/copilot', require('./agents/copilot-domain/routes')(maestro));
app.use('/api/users', require('./modules/users/routes'));
app.use('/api/templates', require('./modules/templates/routes'));
app.use('/api/analytics', require('./modules/analytics/routes'));
app.use('/api/leads', require('./modules/leads/routes'));
app.use('/api/clients', require('./modules/clients/routes'));
app.use('/api/inventory', require('./modules/inventory/routes')); // Explicit naming
app.use('/api/services', require('./modules/service/routes'));
app.use('/api/pricing-rules', require('./modules/pricing-rules/routes'));
app.use('/api/proposals', require('./modules/proposals/routes'));
app.use('/api/search', require('./modules/search/routes'));
app.use('/api/messages', require('./modules/messages/routes'));
app.use('/api/projects', require('./modules/projects/routes'));
app.use('/api/documents', require('./modules/documents/routes'));


app.get('/', (req, res) => {
  res.json({ message: 'Quarks OS Backend API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Health check com verificação de conexão ao banco (para confirmar DATABASE_URL)
app.get('/api/health/db', async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    await prisma.$disconnect().catch(() => { });
    logger.error('Health DB check failed:', err);
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: err.message || 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.use(express.static('../frontend/dist')); // Serve frontend if built (optional)

// --- ORCHESTRATOR ROUTES ---

// Endpoint dedicated to Proposal Preview (Bypassing heavy workflow for now, just calling the preview action)
app.post('/api/orchestrate/preview-proposal', async (req, res) => {
  try {
    const result = await maestro.execute('PREVIEW_PROPOSAL_WORKFLOW', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dimensionamento IA: consumption + distributor -> system size, ROI, payback
app.post('/api/dimensionamento', async (req, res) => {
  try {
    const { consumption, distributor, state } = req.body;
    if (!consumption || isNaN(parseFloat(consumption))) {
      return res.status(400).json({ error: 'consumption (kWh) is required' });
    }
    const result = await maestro.execute('DIMENSIONAMENTO', {
      consumption: parseFloat(consumption),
      distributor: distributor || 'CEMIG',
      state: state || 'SP'
    });
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Orchestration Endpoint (Demo)
app.post('/api/orchestrate/create-proposal', authenticate, authorize(['COMERCIAL', 'ADMIN']), async (req, res) => {
  try {
    const { leadId, consumption, introduction, notes, paymentTerms } = req.body;
    const result = await maestro.execute('CREATE_PROPOSAL_WORKFLOW', { leadId, consumption, introduction, notes, paymentTerms });
    res.json({ success: true, proposal: result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Example Protected Route (Architecture Demo)
app.get('/leads', authenticate, authorize(['COMERCIAL', 'ADMIN']), (req, res) => {
  res.json({ message: 'Access granted to confidential leads' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR HANDLER]', err);
  logger.error({ err, path: req.originalUrl || req.url }, 'Unhandled error caught in global handler');
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
if (require.main === module) {
  (async () => {
    try {
      await ensureDefaultUser();

      const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });

      await initWebSocket(server);

      process.on('SIGINT', () => {
        logger.info('SIGINT received');
        server.close(() => process.exit(0));
      });

      process.on('SIGTERM', () => {
        logger.info('SIGTERM received');
        server.close(() => process.exit(0));
      });

    } catch (err) {
      logger.error('Startup failed:', err);
      process.exit(1);
    }
  })();
}

module.exports = app;
