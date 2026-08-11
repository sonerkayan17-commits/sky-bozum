import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const add = (name, ok, detail = '') => checks.push({ name, ok, detail });

const globalErrorPath = path.join(root, 'app/global-error.tsx');
add('global-error.tsx exists', fs.existsSync(globalErrorPath));

const globalError = fs.existsSync(globalErrorPath) ? read('app/global-error.tsx') : '';
add('Global error owns html/body boundary', /<html\s+lang="tr"/.test(globalError) && /<body/.test(globalError));
add('Global error exposes a reset action', /onClick=\{reset\}/.test(globalError));
add('Global error provides a safe homepage escape', /href="\/"/.test(globalError));
add('Global error avoids production console leakage', /process\.env\.NODE_ENV\s*!==\s*['"]production['"]/.test(globalError));
add('Global error has accessible heading relation', /aria-labelledby="global-error-title"/.test(globalError) && /id="global-error-title"/.test(globalError));

const routeError = read('app/error.tsx');
add('Route error avoids production console leakage', /process\.env\.NODE_ENV\s*!==\s*['"]production['"]/.test(routeError));
add('Route error retains retry action', /onClick=\{reset\}/.test(routeError));

const layout = read('app/layout.tsx');
add('Organization phone comes from central site config', /telephone:\s*siteConfig\.phone/.test(layout));
add('Layout does not duplicate the raw schema phone', !/telephone:\s*['"][+]?[0-9]/.test(layout));

const nextConfig = read('next.config.ts');
for (const header of [
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
  'X-DNS-Prefetch-Control',
]) {
  add(`Security header: ${header}`, nextConfig.includes(header));
}

const failed = checks.filter((check) => !check.ok);
console.log('\nV37.5 Production Resilience Audit');
for (const check of checks) console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name}${check.detail ? ` — ${check.detail}` : ''}`);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exit(1);
