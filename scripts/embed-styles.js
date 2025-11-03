#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Prefer standalone CSS, then lib CSS (lib exists after build:lib)
const sourceCssPaths = [
  resolve(projectRoot, 'dist-standalone/adk-client-web-component.css'),
  resolve(projectRoot, 'dist-lib/adk-client-web-component.css'),
];

let css = '';
for (const p of sourceCssPaths) {
  try {
    const data = await readFile(p, 'utf8');
    if (data && data.length > 0) {
      css = data;
      console.log(`[embed-styles] Found CSS at: ${p}`);
      break;
    }
  } catch {
    // continue
  }
}

if (!css) {
  console.warn('[embed-styles] CSS not found, emitting empty compiledStyles.ts');
}

// Escape backticks and ${ to keep template literal safe
const safe = css
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

const outPath = resolve(projectRoot, 'src/web-component/compiledStyles.ts');
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `export default \`${safe}\`;\n`, 'utf8');
console.log(`[embed-styles] Wrote ${outPath} (${safe.length} chars)`);