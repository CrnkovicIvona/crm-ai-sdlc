import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  applyReportUpdate,
  buildReport,
  countPlaywright,
  parseRecordedSha,
  shouldSkipUpdate,
} from '../../scripts/update-ci-test-report.mjs';

const sampleJson = {
  suites: [
    {
      specs: [
        {
          tests: [
            { results: [{ status: 'passed' }] },
            { results: [{ status: 'passed' }] },
            { expectedStatus: 'skipped', results: [] },
          ],
        },
      ],
      suites: [
        {
          specs: [
            {
              tests: [{ results: [{ status: 'failed' }] }],
            },
          ],
        },
      ],
    },
  ],
};

describe('countPlaywright', () => {
  it('counts passed, failed, and skipped (skipped ≠ passed)', () => {
    expect(countPlaywright(sampleJson)).toEqual({
      passed: 2,
      failed: 1,
      skipped: 1,
      other: 0,
    });
  });
});

describe('parseRecordedSha', () => {
  it('reads SHA from a legacy AUTH-001 snapshot', () => {
    const md = `# Test report: AUTH-001\n\n- SHA: \`b7f181e8d8d85e3dc10922de399455d575627b81\`\n`;
    expect(parseRecordedSha(md)).toBe(
      'b7f181e8d8d85e3dc10922de399455d575627b81',
    );
  });
});

describe('shouldSkipUpdate', () => {
  it('skips when SHA and Playwright counts match the meta block', () => {
    const md = buildReport({
      existing: null,
      id: 'AUTH-001',
      sha: 'abc',
      passed: 7,
      failed: 0,
      skipped: 0,
      runId: '1',
      repo: 'org/repo',
      vitest: 'PASSED',
      eslint: 'PASSED',
      planPath: '../test-plans/AUTH-001.md',
      risk: 'High',
    });
    expect(
      shouldSkipUpdate(md, { sha: 'abc', passed: 7, failed: 0, skipped: 0 }),
    ).toBe(true);
    expect(
      shouldSkipUpdate(md, { sha: 'def', passed: 7, failed: 0, skipped: 0 }),
    ).toBe(false);
  });
});

describe('applyReportUpdate', () => {
  it('archives the old snapshot and writes latest CI when SHA changes', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'ci-report-'));
    const reportPath = path.join(dir, 'AUTH-001.md');
    const jsonPath = path.join(dir, 'playwright-results.json');
    await writeFile(
      reportPath,
      `# Test report: AUTH-001

- SHA: \`b7f181e8d8d85e3dc10922de399455d575627b81\`
- Date: 2026-08-22

## Evidence

| Test | Result |
| ---- | ------ |
| TC-001 | SKIPPED |
`,
    );
    await writeFile(jsonPath, JSON.stringify(sampleJson));
    const first = await applyReportUpdate({
      reportPath,
      jsonPath,
      id: 'AUTH-001',
      sha: '18a7e291d3c5e010f07831da0e28a94a8b0e1395',
      runId: '32592515663',
      repo: 'CrnkovicIvona/crm-ai-sdlc',
      vitest: 'PASSED',
      eslint: 'PASSED',
    });
    expect(first.updated).toBe(true);
    const md = await readFile(reportPath, 'utf8');
    expect(md).toContain('18a7e291d3c5e010f07831da0e28a94a8b0e1395');
    expect(md).toContain('32592515663');
    expect(md).toContain('2 passed / 1 failed / 1 skipped');
    expect(md).toContain('SKIPPED is never PASSED');
    expect(md).toContain('Historical snapshot');
    expect(md).toContain('TC-001 | SKIPPED');
    expect(md).toContain(
      'Report updated automatically from latest CI run for SHA',
    );
    const second = await applyReportUpdate({
      reportPath,
      jsonPath,
      id: 'AUTH-001',
      sha: '18a7e291d3c5e010f07831da0e28a94a8b0e1395',
      runId: '32592515663',
      repo: 'CrnkovicIvona/crm-ai-sdlc',
      vitest: 'PASSED',
      eslint: 'PASSED',
    });
    expect(second).toMatchObject({ updated: false, reason: 'unchanged' });
  });
});
