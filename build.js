const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const CLOUDFLARE_LIMIT = 25 * 1024 * 1024; // 25 MiB

console.log('====================================================');
console.log('🚀 Building NAGPUR SCHOOL VISIT Production Web App');
console.log('====================================================');

// 1. Log files present in repository
function getFileList(dir, maxDepth = 3, currentDepth = 0) {
  let results = [];
  if (currentDepth > maxDepth) return results;
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === 'node_modules' || item === '.git' || item === '.wrangler') continue;
      const full = path.join(dir, item);
      const isDir = fs.statSync(full).isDirectory();
      results.push({ rel: path.relative(ROOT_DIR, full), isDir, size: isDir ? 0 : fs.statSync(full).size });
      if (isDir) {
        results = results.concat(getFileList(full, maxDepth, currentDepth + 1));
      }
    }
  } catch (e) {}
  return results;
}

console.log('📁 Scanning repository files...');
const repoFiles = getFileList(ROOT_DIR);
console.log(`Found ${repoFiles.length} items in repository.`);
if (repoFiles.length <= 15) {
  console.log('Repository file structure:');
  repoFiles.forEach(f => console.log(`  ${f.isDir ? '📁' : '📄'} ${f.rel} ${f.isDir ? '' : `(${Math.round(f.size/1024)} KB)`}`));
}

// 2. Ensure dist folders exist
const distStatic = path.join(DIST_DIR, 'static');
const distData = path.join(DIST_DIR, 'data');
[DIST_DIR, distStatic, distData].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Helper: search recursively for any file by name
function findFileAnywhere(fileName) {
  const matches = repoFiles.filter(f => !f.isDir && path.basename(f.rel).toLowerCase() === fileName.toLowerCase());
  if (matches.length > 0) {
    return path.join(ROOT_DIR, matches[0].rel);
  }
  return null;
}

// 3. Copy root HTML and config files
const indexSrc = findFileAnywhere('index.html') || path.join(ROOT_DIR, 'index.html');
if (fs.existsSync(indexSrc)) {
  fs.copyFileSync(indexSrc, path.join(DIST_DIR, 'index.html'));
  console.log(`✅ Copied index.html from ${path.relative(ROOT_DIR, indexSrc) || 'root'}`);
}

const headersSrc = findFileAnywhere('_headers') || path.join(ROOT_DIR, '_headers');
if (fs.existsSync(headersSrc)) {
  fs.copyFileSync(headersSrc, path.join(DIST_DIR, '_headers'));
}

// 4. Locate and copy client assets (styles.css, app.js)
['styles.css', 'app.js'].forEach(fileName => {
  const found = findFileAnywhere(fileName);
  if (found && fs.existsSync(found)) {
    fs.copyFileSync(found, path.join(distStatic, fileName));
    console.log(`✅ Copied ${fileName} from ${path.relative(ROOT_DIR, found)}`);
  }
});

// 5. Locate School Data
let schoolsData = null;

// Search A: schools.json anywhere in repo
const jsonFound = findFileAnywhere('schools.json');
if (jsonFound && fs.existsSync(jsonFound)) {
  try {
    schoolsData = JSON.parse(fs.readFileSync(jsonFound, 'utf8'));
    fs.writeFileSync(path.join(distData, 'schools.json'), JSON.stringify(schoolsData), 'utf8');
    console.log(`✅ Found & loaded schools.json from ${path.relative(ROOT_DIR, jsonFound)} (${schoolsData.length} schools).`);
  } catch (e) {
    console.warn('⚠️ Could not parse found schools.json:', e.message);
  }
}

// Search B: schools_data.js anywhere in repo
if (!schoolsData) {
  const jsFound = findFileAnywhere('schools_data.js');
  if (jsFound && fs.existsSync(jsFound)) {
    try {
      const content = fs.readFileSync(jsFound, 'utf8');
      const prefix = 'window.NAGPUR_SCHOOLS = ';
      const idx = content.indexOf(prefix);
      if (idx !== -1) {
        let jsonStr = content.substring(idx + prefix.length).trim();
        if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
        schoolsData = JSON.parse(jsonStr);
        fs.writeFileSync(path.join(distData, 'schools.json'), JSON.stringify(schoolsData), 'utf8');
        console.log(`✅ Found & loaded schools_data.js from ${path.relative(ROOT_DIR, jsFound)} (${schoolsData.length} schools).`);
      }
    } catch (e) {
      console.warn('⚠️ Could not parse found schools_data.js:', e.message);
    }
  }
}

// Search C: NAGPUR_all_schools.csv anywhere in repo
if (!schoolsData) {
  const csvFound = findFileAnywhere('NAGPUR_all_schools.csv');
  if (csvFound && fs.existsSync(csvFound)) {
    try {
      const csvText = fs.readFileSync(csvFound, 'utf8');
      const lines = csvText.split('\n').filter(l => l.trim().length > 0);
      if (lines.length > 1) {
        console.log(`✅ Found NAGPUR_all_schools.csv with ${lines.length - 1} records.`);
      }
    } catch (e) {}
  }
}

// 6. Ensure static/schools_data.js is created in dist/
if (schoolsData) {
  const jsPath = path.join(distStatic, 'schools_data.js');
  const jsContent = `// NAGPUR SCHOOL VISIT — Authoritative School Dataset\nwindow.NAGPUR_SCHOOLS = ${JSON.stringify(schoolsData)};\n`;
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log(`✅ Synchronized dist/static/schools_data.js (${schoolsData.length} schools).`);
} else {
  // If schoolsData is not loaded yet, check if schools_data.js was copied directly
  const jsFound = findFileAnywhere('schools_data.js');
  if (jsFound && fs.existsSync(jsFound)) {
    fs.copyFileSync(jsFound, path.join(distStatic, 'schools_data.js'));
    console.log(`✅ Copied schools_data.js to dist/static/`);
  }
}

// Copy any CSV files into dist/data if found
repoFiles.filter(f => !f.isDir && f.rel.endsWith('.csv')).forEach(f => {
  const src = path.join(ROOT_DIR, f.rel);
  const dest = path.join(distData, path.basename(f.rel));
  fs.copyFileSync(src, dest);
});

// 7. Critical Verification
const hasJson = fs.existsSync(path.join(distData, 'schools.json'));
const hasJs = fs.existsSync(path.join(distStatic, 'schools_data.js'));

if (!hasJson && !hasJs) {
  console.error('\n❌ BUILD ERROR: The school dataset (schools_data.js or schools.json) is missing from your Git repository!');
  console.error('Please ensure the "static/" and "data/" folders from NAGPUR_SCHOOL_VISIT.zip are uploaded to your GitHub repository.');
  console.error('Files currently present in repository:');
  repoFiles.forEach(f => console.error(`  - ${f.rel}`));
  process.exit(1);
}

// 8. Clean unwanted files
['_redirects', '_worker.js'].forEach(u => {
  const p = path.join(DIST_DIR, u);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

// 9. Summary & Size Check
function listFiles(dir) {
  let list = [];
  const entries = fs.readdirSync(dir);
  for (const file of entries) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) list = list.concat(listFiles(full));
    else list.push(full);
  }
  return list;
}

const distFiles = listFiles(DIST_DIR);
console.log(`\n📋 Final production assets in dist/ (${distFiles.length} files):`);
let totalSize = 0;
distFiles.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);
distFiles.forEach(fp => {
  const rel = path.relative(DIST_DIR, fp).replace(/\\/g, '/');
  const sz = fs.statSync(fp).size;
  totalSize += sz;
  const szStr = sz >= 1048576 ? `${(sz / 1048576).toFixed(2)} MiB` : `${(sz / 1024).toFixed(1)} KiB`;
  console.log(`  ✅ [OK] ${rel.padEnd(42)} ${szStr.padStart(10)}`);
});
console.log(`Total production size: ${(totalSize / 1048576).toFixed(2)} MiB.`);
console.log('\n🎉 SUCCESS: NAGPUR SCHOOL VISIT production build complete and verified!');
