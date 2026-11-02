const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const output = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'script.js', 'inner.css', 'inner.js'];
const pages = ['about', 'music', 'videos', 'shows', 'photos', 'news', 'teaching', 'music-production', 'contact'];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
for (const page of pages) {
  fs.cpSync(path.join(root, page), path.join(output, page), { recursive: true });
}
console.log('Static site built successfully in dist/');
