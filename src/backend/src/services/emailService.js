/**
 * Email service: send proposal notification to lead.
 * If SMTP env vars are set (SMTP_HOST, SMTP_USER, SMTP_PASS), sends via Nodemailer.
 * Otherwise logs the email content to console (for dev / later wiring to a provider).
 */

const FRONTEND_URL = process.env.FRONTEND_URL || process.env.VITE_APP_URL || 'http://localhost:5173';

function buildClientLink(slug) {
    return `${FRONTEND_URL.replace(/\/$/, '')}/view-proposal/${slug}`;
}

/**
 * Send "proposta enviada" email to lead with the client link.
 * @param {string} to - Lead email
 * @param {string} leadName - Lead name for personalization
 * @param {string} clientLinkSlug - Public slug for view-proposal URL
 * @returns {Promise<{ sent: boolean, error?: string }>}
 */
async function sendProposalSentEmail(to, leadName, clientLinkSlug) {
    const clientLink = buildClientLink(clientLinkSlug);
    const subject = 'Sua proposta de energia solar está disponível';
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; max-width: 560px;">
  <p>Olá, ${escapeHtml(leadName || 'Cliente')}!</p>
  <p>Enviamos uma proposta de sistema de energia solar para você.</p>
  <p><strong>Acesse pelo link abaixo para visualizar, aceitar ou solicitar alterações:</strong></p>
  <p><a href="${escapeHtml(clientLink)}" style="color: #0d9488;">${escapeHtml(clientLink)}</a></p>
  <p>Qualquer dúvida, entre em contato conosco.</p>
  <p>Att,<br>Equipe Quarks OS</p>
</body>
</html>`;
    const text = `Olá, ${leadName || 'Cliente'}!\n\nEnviamos uma proposta de energia solar. Acesse: ${clientLink}\n\nAtt,\nEquipe Quarks OS`;

    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    if (hasSmtp) {
        try {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to,
                subject,
                text,
                html
            });
            return { sent: true };
        } catch (err) {
            console.error('[EmailService] SMTP send failed:', err.message);
            return { sent: false, error: err.message };
        }
    }

    // No SMTP: log so devs can see the email and wire a provider later
    console.log('[EmailService] (no SMTP) Would send proposal email:', { to, subject, clientLink });
    console.log('[EmailService] Body (text):', text);
    return { sent: true };
}

function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

module.exports = { sendProposalSentEmail, buildClientLink };
