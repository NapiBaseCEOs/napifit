const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const outputDir = path.join(rootDir, ".open-next");
const publicRoutesPath = path.join(rootDir, "public", "_routes.json");
const targetRoutesPath = path.join(outputDir, "_routes.json");
const workerPath = path.join(outputDir, "worker.js");
const workerTargetPath = path.join(outputDir, "_worker.js");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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

  copyRoutesFile();
  ensureWorkerFile();
}

main();

