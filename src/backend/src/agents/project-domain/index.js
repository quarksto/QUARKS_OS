const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const broadcaster = require('../../services/realtime/broadcaster');

class ProjectDomainAgent extends BaseDomainAgent {
    constructor() {
        super('project');
    }

    async execute(action, payload) {
        console.log(`[ProjectDomain] Received action: ${action}`);

        switch (action) {
            case 'GET_PROJECTS':
                return await this.getProjects();
            case 'GET_PROJECT':
                return await this.getProject(payload.id);
            case 'CREATE_PROJECT':
                return await this.createProject(payload);
            case 'UPDATE_STATUS':
                return await this.updateStatus(payload.projectId, payload.newStatus);
            case 'UPDATE_PROJECT':
                return await this.updateProject(payload.id, payload.data);
            case 'ADD_ACTIVITY':
                return await this.addActivity(payload.projectId, payload.action, payload.details);
            case 'GET_KANBAN':
                return await this.getKanban();
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    async getProjects() {
        return await prisma.project.findMany({
            include: {
                lead: true,
                technician: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async getProject(id) {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                lead: true,
                proposal: true,
                technician: {
                    select: { id: true, name: true, email: true }
                },
                activities: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!project) throw new Error(`Project not found: ${id}`);
        return project;
    }

    async createProject(data) {
        const { leadId, proposalId, name, technicianId } = data;

        const project = await prisma.project.create({
            data: {
                name,
                leadId,
                proposalId,
                technicianId,
                status: 'PLANNED'
            },
            include: {
                lead: true
            }
        });

        await this.addActivity(project.id, 'CREATE', 'Projeto criado e iniciado na fase de planejamento.');

        return project;
    }

    async updateStatus(projectId, newStatus) {
        const valid = ['PLANNED', 'SURVEYING', 'TECHNICAL_STUDY', 'APPROVED', 'INSTALLING', 'COMPLETED'];
        if (!valid.includes(newStatus)) throw new Error(`Invalid status: ${newStatus}`);

        const project = await prisma.project.update({
            where: { id: projectId },
            data: { status: newStatus },
            include: { lead: true }
        });

        await this.addActivity(projectId, 'STATUS_CHANGE', `Status alterado para ${newStatus}`);

        // Pode adicionar broadcast aqui se necessário
        return project;
    }

    async updateProject(id, data) {
        const allowed = ['name', 'technicalNotes', 'latitude', 'longitude', 'technicianId'];
        const safe = {};
        for (const k of allowed) {
            if (data[k] !== undefined) safe[k] = data[k];
        }

        const project = await prisma.project.update({
            where: { id },
            data: safe,
            include: { lead: true }
        });

        return project;
    }

    async addActivity(projectId, action, details) {
        return await prisma.projectActivity.create({
            data: {
                projectId,
                action,
                details
            }
        });
    }

    async getKanban() {
        const projects = await prisma.project.findMany({
            include: {
                lead: {
                    select: { name: true, location: true }
                },
                technician: {
                    select: { name: true }
                }
            }
        });

        const kanban = {
            'PLANNED': [],
            'SURVEYING': [],
            'TECHNICAL_STUDY': [],
            'APPROVED': [],
            'INSTALLING': [],
            'COMPLETED': []
        };

        projects.forEach(p => {
            if (kanban[p.status]) {
                kanban[p.status].push(p);
            }
        });

        return kanban;
    }
}

module.exports = new ProjectDomainAgent();
