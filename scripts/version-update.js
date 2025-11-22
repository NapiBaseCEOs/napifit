/**
 * Versiyon Güncelleme Script'i
 * Bu script package.json ve version.ts dosyalarındaki versiyonu küçük bir artışla günceller
 */

const fs = require('fs');
const path = require('path');

// Mevcut versiyonu al
const packageJsonPath = path.join(process.cwd(), 'package.json');
const versionTsPath = path.join(process.cwd(), 'src', 'config', 'version.ts');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Patch versiyonunu artır (0.1.0 -> 0.1.1)
const newVersion = `${major}.${minor}.${patch + 1}`;

console.log(`📦 Versiyon güncelleniyor: ${currentVersion} -> ${newVersion}`);

// package.json'ı güncelle
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// version.ts'yi güncelle
const versionTsContent = `export const APP_VERSION = "${newVersion}";
`;
fs.writeFileSync(versionTsPath, versionTsContent);

console.log(`✅ Versiyon güncellendi: ${newVersion}`);
console.log(`   - ${packageJsonPath}`);
console.log(`   - ${versionTsPath}`);

module.exports = { oldVersion: currentVersion, newVersion };

