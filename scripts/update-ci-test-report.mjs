#!/usr/bin/env node
/**
 * Update docs/test-reports/<ID>.md from a CI Playwright JSON result.
 * Does not invent PASSED. SKIPPED is never treated as PASSED.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const META_RE =
  /<!-- ci-report-meta\nsha: ([0-9a-f]+)\nplaywrightPassed: (\d+)\nplaywrightFailed: (\d+)\nplaywrightSkipped: (\d+)\nrunId: (\d+)\n-->/;

const SHA_LINE_RE = /^- SHA: `([0-9a-f]+)`/m;

const HISTORICAL_HEADING =
  '## Historical snapshot (first recorded execute-tests)';
const LATEST_HEADING = '## Latest CI';

export function parseRecordedSha(markdown) {
  const meta = markdown.match(META_RE);
  if (meta) {
    return meta[1];
  }
  const line = markdown.match(SHA_LINE_RE);
  return line ? line[1] : null;
}

export function parseLatestMeta(markdown) {
  const meta = markdown.match(META_RE);
  if (!meta) {
    return null;
  }
  return {
    sha: meta[1],
    playwrightPassed: Number(meta[2]),
    playwrightFailed: Number(meta[3]),
    playwrightSkipped: Number(meta[4]),
    runId: meta[5],
  };
}

export function countPlaywright(report) {
  const counts = { passed: 0, failed: 0, skipped: 0, other: 0 };

  function addStatus(status) {
    if (status === 'passed' || status === 'expected' || status === 'flaky') {
      counts.passed += 1;
    } else if (status === 'skipped') {
      counts.skipped += 1;
    } else if (
      status === 'failed' ||
      status === 'timedOut' ||
      status === 'interrupted' ||
      status === 'unexpected'
    ) {
      counts.failed += 1;
    } else {
      counts.other += 1;
    }
  }

  function walkSuite(suite) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        if (test.expectedStatus === 'skipped') {
          counts.skipped += 1;
          continue;
        }
        const last = test.results?.[test.results.length - 1];
        const status = last?.status ?? test.status ?? 'failed';
        addStatus(status);
      }
    }
    for (const child of suite.suites ?? []) {
      walkSuite(child);
    }
  }

  for (const suite of report.suites ?? []) {
    walkSuite(suite);
  }

  return counts;
}

function formatDateUtc(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function runUrl(repo, runId) {
  return `https://github.com/${repo}/actions/runs/${runId}`;
}

function metaBlock({ sha, passed, failed, skipped, runId }) {
  return [
    '<!-- ci-report-meta',
    `sha: ${sha}`,
    `playwrightPassed: ${passed}`,
    `playwrightFailed: ${failed}`,
    `playwrightSkipped: ${skipped}`,
    `runId: ${runId}`,
    '-->',
  ].join('\n');
}

function latestCiSection({
  id,
  sha,
  passed,
  failed,
  skipped,
  runId,
  repo,
  vitest,
  eslint,
}) {
  const url = runUrl(repo, runId);
  const skipNote =
    skipped > 0
      ? 'SKIPPED Playwright tests are **not** PASSED (secrets missing or `test.skip`).'
      : 'No Playwright tests were skipped in this run.';
  return `${metaBlock({ sha, passed, failed, skipped, runId })}

${LATEST_HEADING}

- CI run: [${runId}](${url})
- SHA: \`${sha}\`
- Report updated automatically from latest CI run for SHA \`${sha}\`. Previous snapshot was outdated.

| Suite      | Result                                      | Evidence        |
| ---------- | ------------------------------------------- | --------------- |
| Playwright | ${passed} passed / ${failed} failed / ${skipped} skipped | [${runId}](${url}) |
| Vitest     | ${vitest}                                   | [${runId}](${url}) |
| ESLint     | ${eslint}                                   | [${runId}](${url}) |

${skipNote}

Work item: ${id}. AC coverage follows the test plan; skipped ≠ passed.
`;
}

function extractHistorical(existing) {
  if (existing.includes(HISTORICAL_HEADING)) {
    const idx = existing.indexOf(HISTORICAL_HEADING);
    return existing.slice(idx).trimEnd();
  }
  const withoutTitle = existing.replace(/^# Test report:.*\n+/, '');
  return `${HISTORICAL_HEADING}

The block below is the first recorded execute-tests snapshot. It is not
the latest CI. Do not treat SKIPPED rows there as the current release
evidence.

${withoutTitle.trim()}
`;
}

export function buildReport({
  existing,
  id,
  sha,
  passed,
  failed,
  skipped,
  runId,
  repo,
  vitest,
  eslint,
  planPath,
  risk,
}) {
  const latest = latestCiSection({
    id,
    sha,
    passed,
    failed,
    skipped,
    runId,
    repo,
    vitest,
    eslint,
  });
  const historical = existing
    ? extractHistorical(existing)
    : `${HISTORICAL_HEADING}

No earlier execute-tests snapshot was in the repository.
`;
  const header = `# Test report: ${id}

- SHA: \`${sha}\`
- Date: ${formatDateUtc()}
- Plan: [docs/test-plans/${id}.md](${planPath})
- Risk level: ${risk}
- CI: [${runId}](${runUrl(repo, runId)})

## Summary

| Result                            | Count |
| --------------------------------- | ----- |
| Passed (Playwright, this CI run)  | ${passed} |
| Failed (Playwright, this CI run)  | ${failed} |
| Skipped (Playwright, this CI run) | ${skipped} |
| Blocked                           | 0     |

SKIPPED is never PASSED.

`;
  return `${header}${latest}\n${historical}\n`;
}

export function shouldSkipUpdate(existing, { sha, passed, failed, skipped }) {
  if (!existing) {
    return false;
  }
  const meta = parseLatestMeta(existing);
  if (meta) {
    return (
      meta.sha === sha &&
      meta.playwrightPassed === passed &&
      meta.playwrightFailed === failed &&
      meta.playwrightSkipped === skipped
    );
  }
  return false;
}

export async function applyReportUpdate(options) {
  const {
    reportPath,
    jsonPath,
    id,
    sha,
    runId,
    repo,
    vitest = 'see CI job',
    eslint = 'see CI job',
    planPath = `../test-plans/${id}.md`,
    risk = 'High',
  } = options;

  let jsonRaw;
  try {
    jsonRaw = await readFile(jsonPath, 'utf8');
  } catch {
    return { updated: false, reason: 'missing-playwright-json' };
  }
  const report = JSON.parse(jsonRaw);
  const { passed, failed, skipped } = countPlaywright(report);

  let existing = null;
  try {
    existing = await readFile(reportPath, 'utf8');
  } catch {
    existing = null;
  }

  if (shouldSkipUpdate(existing, { sha, passed, failed, skipped })) {
    return { updated: false, reason: 'unchanged', passed, failed, skipped };
  }

  const markdown = buildReport({
    existing,
    id,
    sha,
    passed,
    failed,
    skipped,
    runId,
    repo,
    vitest,
    eslint,
    planPath,
    risk,
  });

  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, markdown);
  return {
    updated: true,
    reason: existing ? 'updated' : 'created',
    passed,
    failed,
    skipped,
  };
}

function jobResultLabel(value) {
  const v = (value || '').toLowerCase();
  if (v === 'success') {
    return 'PASSED';
  }
  if (v === 'failure') {
    return 'FAILED';
  }
  if (v === 'skipped' || v === 'cancelled') {
    return 'SKIPPED (not PASSED)';
  }
  return value || 'see CI job';
}

async function main() {
  const args = new Map();
  for (let i = 2; i < process.argv.length; i += 2) {
    const key = process.argv[i];
    const val = process.argv[i + 1];
    if (key?.startsWith('--')) {
      args.set(key.slice(2), val);
    }
  }
  const id = args.get('id') || process.env.TEST_REPORT_ID || 'AUTH-001';
  const sha = args.get('sha') || process.env.GITHUB_SHA;
  const runId = args.get('run-id') || process.env.GITHUB_RUN_ID;
  const repo = args.get('repo') || process.env.GITHUB_REPOSITORY;
  const jsonPath = args.get('json') || 'playwright-results.json';
  const reportPath =
    args.get('report') || path.join('docs', 'test-reports', `${id}.md`);
  if (!sha || !runId || !repo) {
    console.error('Need --sha, --run-id, and --repo (or GITHUB_* env).');
    process.exit(2);
  }
  const result = await applyReportUpdate({
    reportPath,
    jsonPath,
    id,
    sha,
    runId,
    repo,
    vitest: jobResultLabel(args.get('vitest') || process.env.VITEST_RESULT),
    eslint: jobResultLabel(args.get('eslint') || process.env.ESLINT_RESULT),
  });
  console.log(JSON.stringify(result));
  if (result.reason === 'missing-playwright-json') {
    process.exit(1);
  }
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  await main();
}
