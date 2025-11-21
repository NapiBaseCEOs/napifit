# Supabase Migration Otomatik Çalıştırma Script'i
# Bu script'i çalıştırmadan önce Supabase Access Token'ınızı alın

# ============================================
# ADIM 1: SUPABASE ACCESS TOKEN ALIN
# ============================================
# 1. https://supabase.com/dashboard adresine gidin
# 2. Sağ üstteki profil ikonuna tıklayın
# 3. "Account Settings" > "Access Tokens" bölümüne gidin
# 4. "Generate New Token" butonuna tıklayın
# 5. Token'ı kopyalayın ve aşağıdaki $TOKEN değişkenine yapıştırın

# ============================================
# ADIM 2: TOKEN'I BURAYA YAPIŞTIRIN
# ============================================
$TOKEN = "YOUR_ACCESS_TOKEN_HERE"

# ============================================
# ADIM 3: SCRIPT'I ÇALIŞTIRIN
# ============================================
# PowerShell'de: .\run_with_token.ps1

if ($TOKEN -eq "YOUR_ACCESS_TOKEN_HERE") {
    Write-Host "❌ Lütfen önce Supabase Access Token'ınızı script içine ekleyin!" -ForegroundColor Red
    Write-Host "Token'ı almak için: https://supabase.com/dashboard > Account Settings > Access Tokens" -ForegroundColor Yellow
    exit 1
}

# Environment variable set et
$env:SUPABASE_ACCESS_TOKEN = $TOKEN

# Projeyi link et
Write-Host "🔗 Projeyi link ediyorum..." -ForegroundColor Cyan
npx supabase link --project-ref eaibfqnjgkflvxdxfbw

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Proje link edilemedi!" -ForegroundColor Red
    exit 1
}

# Migration'ları push et
Write-Host "📤 Migration'ları push ediyorum..." -ForegroundColor Cyan
npx supabase db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration'lar push edilemedi!" -ForegroundColor Red
    exit 1
}

# Öneriyi eklemek için SQL dosyasını çalıştır
Write-Host "📝 Öneriyi ekliyorum..." -ForegroundColor Cyan
Write-Host "⚠️  Not: Öneriyi eklemek için 'run_migrations_and_add_request.sql' dosyasını Supabase Dashboard SQL Editor'de çalıştırmanız gerekiyor." -ForegroundColor Yellow

Write-Host "✅ Migration'lar başarıyla uygulandı!" -ForegroundColor Green
Write-Host "📋 Sonraki adım: 'run_migrations_and_add_request.sql' dosyasını Supabase Dashboard SQL Editor'de çalıştırın." -ForegroundColor Cyan

