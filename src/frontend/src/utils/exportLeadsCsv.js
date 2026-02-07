import { getStageLabel } from './pipeline';
import { getLeadPotential } from './pipeline';

function escapeCsvCell(value) {
  if (value == null) return '';
  const s = String(value).trim();
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Gera CSV dos leads (nome, email, telefone, status, consumo, potencial, origem, criado em).
 * @param {Array<object>} leads - Lista de leads
 * @returns {string} Conteúdo CSV
 */
export function leadsToCsv(leads) {
  const headers = [
    'Nome',
    'E-mail',
    'Telefone',
    'Status',
    'Consumo (kWh)',
    'Potencial (R$)',
    'Origem',
    'Local',
    'CEP',
    'Endereço',
    'Criado em',
  ];
  const rows = (leads || []).map((lead) => {
    const potential = getLeadPotential(lead);
    const created = lead.createdAt
      ? new Date(lead.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      : '';
    return [
      escapeCsvCell(lead.name),
      escapeCsvCell(lead.email),
      escapeCsvCell(lead.phone),
      escapeCsvCell(getStageLabel(lead.status)),
      escapeCsvCell(lead.consumption),
      escapeCsvCell(potential.toFixed(2)),
      escapeCsvCell(lead.origin),
      escapeCsvCell(lead.location),
      escapeCsvCell(lead.cep),
      escapeCsvCell(lead.fullAddress),
      escapeCsvCell(created),
    ];
  });
  const headerLine = headers.join(',');
  const dataLines = rows.map((r) => r.join(','));
  return [headerLine, ...dataLines].join('\r\n');
}

/**
 * Dispara download de um arquivo CSV com os leads.
 * @param {Array<object>} leads - Lista de leads
 * @param {string} [filename] - Nome do arquivo (sem extensão)
 */
export function downloadLeadsCsv(leads, filename = 'leads') {
  const csv = leadsToCsv(leads);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
