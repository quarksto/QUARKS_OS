const express = require('express');
const router = express.Router();
const projectAgent = require('../../agents/project-domain');
const { authenticate, authorize } = require('../../middleware/auth');

/**
 * @route GET /api/projects
 * @desc Get all projects
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const projects = await projectAgent.execute('GET_PROJECTS');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/projects/kanban
 * @desc Get projects grouped for Kanban
 */
router.get('/kanban', authenticate, async (req, res) => {
    try {
        const kanban = await projectAgent.execute('GET_KANBAN');
        res.json(kanban);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/projects/:id
 * @desc Get single project data
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const project = await projectAgent.execute('GET_PROJECT', { id: req.params.id });
        res.json(project);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @route POST /api/projects
 * @desc Create a new project manually
 */
router.post('/', authenticate, authorize(['ENGENHARIA', 'ADMIN']), async (req, res) => {
    try {
        const project = await projectAgent.execute('CREATE_PROJECT', req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PATCH /api/projects/:id/status
 * @desc Update project status
 */
router.patch('/:id/status', authenticate, authorize(['ENGENHARIA', 'ADMIN']), async (req, res) => {
    try {
        const project = await projectAgent.execute('UPDATE_STATUS', {
            projectId: req.params.id,
            newStatus: req.body.status
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PATCH /api/projects/:id
 * @desc Update project details
 */
router.patch('/:id', authenticate, authorize(['ENGENHARIA', 'ADMIN']), async (req, res) => {
    try {
        const project = await projectAgent.execute('UPDATE_PROJECT', {
            id: req.params.id,
            data: req.body
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/projects/:id/activities
 * @desc Add a technical log/activity
 */
router.post('/:id/activities', authenticate, authorize(['ENGENHARIA', 'ADMIN']), async (req, res) => {
    try {
        const activity = await projectAgent.execute('ADD_ACTIVITY', {
            projectId: req.params.id,
            action: req.body.action,
            details: req.body.details
        });
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
