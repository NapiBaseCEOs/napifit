#!/bin/bash
# Deploy Script - Cloudflare Pages'e deploy eder

echo "🚀 NapiFit Deployment Başlatılıyor..."
echo ""

# Versiyonu güncelle
echo "📦 Versiyon güncelleniyor..."
node scripts/version-update.js

# Build yap
echo ""
echo "🔨 Build yapılıyor..."
npm run cloudflare:build

# Git commit ve push
echo ""
echo "📤 Git commit ve push yapılıyor..."
node scripts/git-commit-push.js

echo ""
echo "✅ Deployment hazır!"
echo ""
echo "Sonraki adımlar:"
echo "1. GitHub repository URL'ini ekleyin: git remote add origin <url>"
echo "2. Push yapın: git push -u origin main"
echo "3. Cloudflare Pages otomatik deploy edecek"
echo ""

