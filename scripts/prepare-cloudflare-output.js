const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const outputDir = path.join(rootDir, ".open-next");
const assetsDir = path.join(outputDir, "assets");
const publicRoutesPath = path.join(rootDir, "public", "_routes.json");
const targetRoutesPath = path.join(outputDir, "_routes.json");
const workerPath = path.join(outputDir, "worker.js");
const workerTargetPath = path.join(outputDir, "_worker.js");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    ensureDir(dest);
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyAssetsToRoot() {
  // assets/ içindeki herşeyi .open-next/ root'una kopyala
  if (!fs.existsSync(assetsDir)) {
    console.warn("⚠️ .open-next/assets bulunamadı, static asset kopyalama atlanıyor.");
    return;
  }

  const entries = fs.readdirSync(assetsDir);
  for (const entry of entries) {
    const srcPath = path.join(assetsDir, entry);
    const destPath = path.join(outputDir, entry);
    
    // _routes.json'ı atlayalım (ayrıca kopyalanıyor)
    if (entry === "_routes.json") continue;
    
    copyRecursive(srcPath, destPath);
    console.log(`✓ assets/${entry} -> .open-next/${entry} kopyalandı`);
  }
}

function copyRoutesFile() {
  if (!fs.existsSync(publicRoutesPath)) {
    console.warn("⚠️ public/_routes.json bulunamadı, atlanıyor.");
    return;
  }

  ensureDir(outputDir);
  fs.copyFileSync(publicRoutesPath, targetRoutesPath);
  console.log("✓ public/_routes.json -> .open-next/_routes.json kopyalandı");
}

function ensureWorkerFile() {
  if (!fs.existsSync(workerPath)) {
    console.warn("⚠️ .open-next/worker.js bulunamadı, _worker.js oluşturulamadı.");
    return;
  }

  fs.copyFileSync(workerPath, workerTargetPath);
  console.log("✓ .open-next/_worker.js oluşturuldu");
}

function main() {
  if (!fs.existsSync(outputDir)) {
    console.error("❌ .open-next klasörü bulunamadı. Önce `opennextjs-cloudflare build` çalıştırın.");
    process.exit(1);
  }

  copyAssetsToRoot();
  copyRoutesFile();
  ensureWorkerFile();
}

main();

