// A mock bundle analysis script.
// In a real environment, this would use source-map-explorer or rollup-plugin-visualizer.
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist/assets');

if (!fs.existsSync(distPath)) {
  console.log('Build folder (dist/assets) not found. Run npm run build first.');
  process.exit(1);
}

const files = fs.readdirSync(distPath);
let totalSize = 0;

console.log('\n📦 Bundle Analysis Report:\n');
files.forEach(file => {
  const stats = fs.statSync(path.join(distPath, file));
  const sizeKB = (stats.size / 1024).toFixed(2);
  totalSize += stats.size;
  console.log(`- ${file}: ${sizeKB} KB`);
});

console.log(`\n✅ Total Assets Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('Use tools like rollup-plugin-visualizer for deeper chunk analysis.');
