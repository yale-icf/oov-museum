const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'js-src');
const OUT_DIR = path.join(__dirname, 'js');

const OPTIONS = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 8,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersType: 'function',
  unicodeEscapeSequence: false,
};

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.js'));

for (const file of files) {
  const src = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
  const result = JavaScriptObfuscator.obfuscate(src, OPTIONS);
  fs.writeFileSync(path.join(OUT_DIR, file), result.getObfuscatedCode(), 'utf8');
  console.log(`Obfuscated: ${file}`);
}

console.log(`\nDone — ${files.length} file(s) written to js/`);
