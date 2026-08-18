import { spawnSync } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const commands = [
  'audit:image-budgets',
  'audit:visuals',
  'audit:performance',
  'audit:ui-resilience',
  'audit:reference-carousel',
  'audit:motion-preview',
  'audit:rate-freshness',
  'audit:seo-release',
  'audit:external-integrations',
  'audit:security-readiness',
  'audit:critical-flows',
  'lint',
  'build',
];

for (const script of commands) {
  console.log(`\n> ${npmCommand} run ${script}`);
  const result = process.platform === 'win32'
    ? spawnSync(`${npmCommand} run ${script}`, { stdio: 'inherit', shell: true })
    : spawnSync(npmCommand, ['run', script], { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    break;
  }
}
