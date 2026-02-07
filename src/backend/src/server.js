require('dotenv').config();
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
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
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

// Register Agents
maestro.registerAgent('lead', leadAgent);
maestro.registerAgent('calc', calcAgent);
maestro.registerAgent('proposal', proposalAgent);
maestro.registerAgent('inventory', inventoryAgent);
maestro.registerAgent('project', projectAgent);


// Routes
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/copilot', require('./agents/copilot-domain/routes')(maestro));
app.use('/api/analytics', require('./modules/analytics/routes'));
app.use('/api/leads', require('./modules/leads/routes'));
app.use('/api/inventory', require('./modules/inventory/routes')); // Explicit naming
app.use('/api/pricing-rules', require('./modules/pricing-rules/routes'));
app.use('/api/proposals', require('./modules/proposals/routes'));
app.use('/api/search', require('./modules/search/routes'));
app.use('/api/messages', require('./modules/messages/routes'));
app.use('/api/projects', require('./modules/projects/routes'));


app.get('/', (req, res) => {
  res.json({ message: 'Quarks OS Backend API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Orchestration Endpoint (Demo)
app.post('/api/orchestrate/create-proposal', authenticate, authorize(['COMERCIAL', 'ADMIN']), async (req, res) => {
  try {
    const { leadId, consumption } = req.body;
    const result = await maestro.execute('CREATE_PROPOSAL_WORKFLOW', { leadId, consumption });
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
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
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
