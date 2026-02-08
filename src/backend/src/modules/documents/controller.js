const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const uploadFile = async (req, res) => {
    try {
        const { leadId } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!leadId) {
            // Clean up file if no leadId
            fs.unlinkSync(file.path);
            return res.status(400).json({ error: 'leadId is required' });
        }

        const document = await prisma.leadDocument.create({
            data: {
                leadId: leadId,
                name: file.originalname,
                path: file.path,
                type: file.mimetype,
                size: file.size
            }
        });

        res.status(201).json(document);
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getLeadDocuments = async (req, res) => {
    try {
        const { leadId } = req.params;
        const documents = await prisma.leadDocument.findMany({
            where: { leadId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await prisma.leadDocument.findUnique({ where: { id } });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Delete file from disk
        if (fs.existsSync(document.path)) {
            fs.unlinkSync(document.path);
        }

        await prisma.leadDocument.delete({ where: { id } });

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const downloadDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await prisma.leadDocument.findUnique({ where: { id } });

        if (!document || !fs.existsSync(document.path)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(document.path, document.name);
    } catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    uploadFile,
    getLeadDocuments,
    deleteDocument,
    downloadDocument
};
