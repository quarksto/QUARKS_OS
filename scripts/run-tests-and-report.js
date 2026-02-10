#!/usr/bin/env node
/**
 * Executa testes automatizados (Backend + Frontend + E2E) e gera relatório único
 * com erros separados por Backend, Frontend e E2E.
 *
 * Uso (na raiz do projeto):
 *   node scripts/run-tests-and-report.js
 *   npm run test:report
 *
 * Requisito E2E: frontend (localhost:5173) e backend (localhost:3001) rodando.
 *
 * Gera:
 *   test-results/report.md   – relatório com status e erros por área
 *   test-results/backend.log
 *   test-results/frontend.log
 *   test-results/e2e.log
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESULTS_DIR = path.join(ROOT, 'test-results');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function run(commandLine, cwd, env = {}, options = {}) {
  const timeout = options.timeout || 120000;
  const result = spawnSync(commandLine, {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    timeout,
    shell: true,
  });
  const stdout = (result.stdout && result.stdout.toString()) || '';
  const stderr = (result.stderr && result.stderr.toString()) || '';
  const output = [stdout, stderr].filter(Boolean).join('\n');
  return {
    exitCode: result.status,
    stdout,
    stderr,
    output: output || '(sem saída)',
  };
}

function extractFailureBlocks(output) {
  const blocks = [];
  const lines = output.split('\n');
  let inFail = false;
  let current = [];
  for (const line of lines) {
    if (line.includes('FAIL ') || line.includes('● ') || line.includes('AssertionError') || line.includes('Error:')) {
      if (current.length) blocks.push(current.join('\n'));
      inFail = true;
      current = [line];
    } else if (inFail && (line.trim() === '' || line.match(/^\s+\d+\)/) || line.includes('at ') || line.includes('Expected') || line.includes('Received'))) {
      current.push(line);
    } else if (inFail && line.includes('Test Suites:') || line.includes('Tests:') || line.includes('PASS ')) {
      if (current.length) blocks.push(current.join('\n'));
      inFail = false;
      current = [];
    }
  }
  if (current.length) blocks.push(current.join('\n'));
  return blocks.slice(0, 15);
}

function extractSummary(output) {
  // Vitest: "Tests  7 passed" ou "Test Files  2 passed"
  const testsLine = output.match(/Tests\s+(\d+) passed(?:\s*,\s*(\d+) failed)?/i);
  if (testsLine) {
    return { passed: parseInt(testsLine[1], 10) || 0, failed: parseInt(testsLine[2], 10) || 0 };
  }
  // Jest: "Tests: 18 passed, 0 failed" ou "Tests:       18 passed, 0 total"
  const m = output.match(/Tests:\s*(?:(\d+) passed)?[,\s]*(?:(\d+) failed)?/i)
    || output.match(/(\d+) passed[,\s]*(\d+) failed/i)
    || output.match(/(\d+) passed/i);
  if (m) {
    return {
      passed: parseInt(m[1], 10) || 0,
      failed: parseInt(m[2], 10) || 0,
    };
  }
  return {
    passed: output.includes('passed') ? 1 : 0,
    failed: output.includes('FAIL') || output.includes('failed') ? 1 : 0,
  };
}

function extractPlaywrightSummary(output) {
  // "  4 passed (12.7s)" ou "  3 passed, 1 failed"
  const passedMatch = output.match(/(\d+)\s+passed/);
  const failedMatch = output.match(/(\d+)\s+failed/);
  return {
    passed: passedMatch ? parseInt(passedMatch[1], 10) : 0,
    failed: failedMatch ? parseInt(failedMatch[1], 10) : 0,
  };
}

function extractPlaywrightFailures(output) {
  const blocks = [];
  const lines = output.split('\n');
  let current = [];
  for (const line of lines) {
    if (line.match(/\d+\)\s+.*›/) || line.trim().startsWith('Error:')) {
      if (current.length) blocks.push(current.join('\n'));
      current = [line];
    } else if (current.length && (line.includes('at ') || line.includes('Error') || line.trim().startsWith('>'))) {
      current.push(line);
    } else if (current.length && line.match(/^\s*\d+ passed/)) {
      if (current.length) blocks.push(current.join('\n'));
      current = [];
    }
  }
  if (current.length) blocks.push(current.join('\n'));
  return blocks.slice(0, 10);
}

function main() {
  ensureDir(RESULTS_DIR);

  const report = {
    backend: { exitCode: null, output: '', summary: {}, failures: [] },
    frontend: { exitCode: null, output: '', summary: {}, failures: [] },
    e2e: { exitCode: null, output: '', summary: {}, failures: [] },
    timestamp: new Date().toISOString(),
  };

  // --- Backend (Jest) ---
  console.log('Executando testes do Backend (Jest)...');
  const backendDir = path.join(ROOT, 'src', 'backend');
  const backendEnv = {
    E2E_LOGIN_EMAIL: process.env.E2E_LOGIN_EMAIL || 'master@quarks.solar',
    E2E_LOGIN_PASSWORD: process.env.E2E_LOGIN_PASSWORD || 'master123',
  };
  const backendResult = run(
    'npx jest __tests__/api.test.js --no-coverage',
    backendDir,
    backendEnv
  );
  report.backend.exitCode = backendResult.exitCode;
  report.backend.output = backendResult.output;
  report.backend.summary = extractSummary(backendResult.output);
  if (backendResult.exitCode !== 0) {
    report.backend.failures = extractFailureBlocks(backendResult.output);
  }
  fs.writeFileSync(path.join(RESULTS_DIR, 'backend.log'), backendResult.output, 'utf8');

  // --- Frontend (Vitest) ---
  console.log('Executando testes do Frontend (Vitest)...');
  const frontendResult = run('npm run test', path.join(ROOT, 'src', 'frontend'));
  report.frontend.exitCode = frontendResult.exitCode;
  report.frontend.output = frontendResult.output;
  report.frontend.summary = extractSummary(frontendResult.output);
  if (frontendResult.exitCode !== 0) {
    report.frontend.failures = extractFailureBlocks(frontendResult.output);
  }
  fs.writeFileSync(path.join(RESULTS_DIR, 'frontend.log'), frontendResult.output, 'utf8');

  // --- E2E (Playwright) ---
  console.log('Executando testes E2E (Playwright)...');
  const e2eEnv = {
    E2E_LOGIN_EMAIL: process.env.E2E_LOGIN_EMAIL || 'master@quarks.solar',
    E2E_LOGIN_PASSWORD: process.env.E2E_LOGIN_PASSWORD || 'master123',
  };
  const e2eResult = run(
    'npx playwright test --config=e2e/playwright.config.js',
    ROOT,
    e2eEnv,
    { timeout: 180000 }
  );
  report.e2e.exitCode = e2eResult.exitCode;
  report.e2e.output = e2eResult.output;
  report.e2e.summary = extractPlaywrightSummary(e2eResult.output);
  if (e2eResult.exitCode !== 0) {
    report.e2e.failures = extractPlaywrightFailures(e2eResult.output);
  }
  fs.writeFileSync(path.join(RESULTS_DIR, 'e2e.log'), e2eResult.output, 'utf8');

  // --- Relatório Markdown ---
  const backendOk = report.backend.exitCode === 0;
  const frontendOk = report.frontend.exitCode === 0;
  const e2eOk = report.e2e.exitCode === 0;

  let md = `# Relatório de Testes Automatizados\n\n`;
  md += `**Data:** ${report.timestamp}\n\n`;
  md += `---\n\n`;

  md += `## Backend (Jest – APIs)\n\n`;
  md += `**Status:** ${backendOk ? '✅ OK' : '❌ FALHOU'}\n\n`;
  if (report.backend.summary.passed !== undefined || report.backend.summary.failed !== undefined) {
    md += `- Passaram: ${report.backend.summary.passed ?? '-'}\n`;
    md += `- Falharam: ${report.backend.summary.failed ?? '-'}\n\n`;
  }
  if (!backendOk && report.backend.failures.length > 0) {
    md += `### Erros (trechos)\n\n\`\`\`\n${report.backend.failures.join('\n\n---\n\n')}\n\`\`\`\n\n`;
  }
  md += `*Log completo:* \`test-results/backend.log\`\n\n---\n\n`;

  md += `## Frontend (Vitest – componentes)\n\n`;
  md += `**Status:** ${frontendOk ? '✅ OK' : '❌ FALHOU'}\n\n`;
  if (report.frontend.summary.passed !== undefined || report.frontend.summary.failed !== undefined) {
    md += `- Passaram: ${report.frontend.summary.passed ?? '-'}\n`;
    md += `- Falharam: ${report.frontend.summary.failed ?? '-'}\n\n`;
  }
  if (!frontendOk && report.frontend.failures.length > 0) {
    md += `### Erros (trechos)\n\n\`\`\`\n${report.frontend.failures.join('\n\n---\n\n')}\n\`\`\`\n\n`;
  }
  md += `*Log completo:* \`test-results/frontend.log\`\n\n---\n\n`;

  md += `## E2E (Playwright – fluxos no navegador)\n\n`;
  md += `**Status:** ${e2eOk ? '✅ OK' : '❌ FALHOU'}\n\n`;
  md += `- Passaram: ${report.e2e.summary.passed ?? '-'}\n`;
  md += `- Falharam: ${report.e2e.summary.failed ?? '-'}\n\n`;
  if (!e2eOk && report.e2e.failures.length > 0) {
    md += `### Erros (trechos)\n\n\`\`\`\n${report.e2e.failures.join('\n\n---\n\n')}\n\`\`\`\n\n`;
  }
  md += `*Log completo:* \`test-results/e2e.log\`\n\n`;
  md += `*Requisito:* frontend (localhost:5173) e backend (localhost:3001) devem estar rodando.\n\n---\n\n`;

  md += `## Resumo\n\n`;
  md += `| Área     | Status |\n|----------|--------|\n`;
  md += `| Backend  | ${backendOk ? '✅ OK' : '❌ Falhou'} |\n`;
  md += `| Frontend | ${frontendOk ? '✅ OK' : '❌ Falhou'} |\n`;
  md += `| E2E      | ${e2eOk ? '✅ OK' : '❌ Falhou'} |\n`;

  fs.writeFileSync(path.join(RESULTS_DIR, 'report.md'), md, 'utf8');
  console.log('\nRelatório gravado em test-results/report.md');

  const failed = !backendOk || !frontendOk || !e2eOk;
  process.exit(failed ? 1 : 0);
}

main();
