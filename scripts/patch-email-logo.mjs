import fs from 'fs';

const files = [
  'apps/web/lib/services/emailService.ts',
  'apps/web/lib/services/emailService.ts.bak'
];

const logo = 'https://soullab.life/Soullablogo.png';
// Match src="data:image...base64,..." even across newlines
const rx = /src="data:image[^"]*;base64,[^"]*"/gs;

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.warn(`Skip (not found): ${f}`);
    continue;
  }
  const s = fs.readFileSync(f, 'utf8');
  const out = s.replace(rx, `src="${logo}"`);
  if (out !== s) {
    fs.writeFileSync(f, out);
    console.log(`✅ Patched: ${f}`);
  } else {
    console.log(`ℹ️  No base64 src found: ${f}`);
  }
}

console.log('\n🎉 Email logo swap complete!');
