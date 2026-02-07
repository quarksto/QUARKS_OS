class BaseDomainAgent {
    constructor(name) {
        this.name = name;
    }

    async execute(action, payload) {
        console.log(`[${this.name}] Executing ${action}`);
        throw new Error('Method not implemented');
    }
}

module.exports = BaseDomainAgent;
