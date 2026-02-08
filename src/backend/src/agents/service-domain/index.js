/**
 * ServiceDomainAgent - CRUD de Services e ServicePrices
 */

const BaseDomainAgent = require('../base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ServiceDomainAgent extends BaseDomainAgent {
    constructor() {
        super('service');
    }

    async execute(action, payload) {
        console.log(`[ServiceDomain] Received action: ${action}`);

        switch (action) {
            // Service Definitions
            case 'LIST_SERVICES':
                return await this.listServices(payload);
            case 'GET_SERVICE':
                return await this.getService(payload.id);
            case 'CREATE_SERVICE':
                return await this.createService(payload);
            case 'UPDATE_SERVICE':
                return await this.updateService(payload.id, payload.data);
            case 'DELETE_SERVICE':
                return await this.deleteService(payload.id);

            // Service Prices
            case 'ADD_PRICE':
                return await this.addPrice(payload);
            case 'UPDATE_PRICE':
                return await this.updatePrice(payload.id, payload.data);
            case 'DELETE_PRICE':
                return await this.deletePrice(payload.id);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    // ========== Services ==========

    async listServices({ active = true } = {}) {
        return await prisma.service.findMany({
            where: { active },
            include: {
                prices: {
                    where: { active: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    }

    async getService(id) {
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                prices: {
                    where: { active: true },
                    orderBy: { minPower: 'asc' }
                }
            }
        });
        if (!service) throw new Error(`Service not found: ${id}`);
        return service;
    }

    async createService({ name, type, description }) {
        if (!name || !type) throw new Error('Missing name or type');

        return await prisma.service.create({
            data: {
                name,
                type,
                description,
                active: true
            }
        });
    }

    async updateService(id, data) {
        return await prisma.service.update({
            where: { id },
            data
        });
    }

    async deleteService(id) {
        return await prisma.service.update({
            where: { id },
            data: { active: false }
        });
    }

    // ========== Prices ==========

    async addPrice(data) {
        const { serviceId, state, minPower, maxPower, priceType, priceValue } = data;

        // Basic validation
        if (!serviceId || !priceType || priceValue === undefined) {
            throw new Error('Missing required fields for price');
        }

        return await prisma.servicePrice.create({
            data: {
                serviceId,
                state: state || null, // null = National
                minPower: parseFloat(minPower || 0),
                maxPower: parseFloat(maxPower || 99999),
                priceType,
                priceValue: parseFloat(priceValue),
                active: true
            }
        });
    }

    async updatePrice(id, data) {
        const safe = {};
        if (data.priceValue !== undefined) safe.priceValue = parseFloat(data.priceValue);
        if (data.minPower !== undefined) safe.minPower = parseFloat(data.minPower);
        if (data.maxPower !== undefined) safe.maxPower = parseFloat(data.maxPower);
        if (data.state !== undefined) safe.state = data.state;
        if (data.priceType !== undefined) safe.priceType = data.priceType;

        return await prisma.servicePrice.update({
            where: { id },
            data: safe
        });
    }

    async deletePrice(id) {
        return await prisma.servicePrice.update({
            where: { id },
            data: { active: false }
        });
    }
}

module.exports = new ServiceDomainAgent();
