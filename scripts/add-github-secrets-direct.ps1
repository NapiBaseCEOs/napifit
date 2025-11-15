# GitHub Secrets Ekleme Script'i (Direkt)
# .env dosyasındaki bilgileri GitHub Secrets olarak ekler

$env:Path = $env:Path + ";C:\Program Files\GitHub CLI"

Write-Host "🔐 GitHub Secrets Ekleme Başlatılıyor..." -ForegroundColor Green
Write-Host ""

# Repository bilgisi
$repo = "NapiBaseCEOs/napifit"
Write-Host "📦 Repository: $repo" -ForegroundColor Cyan
Write-Host ""

# .env dosyasını oku
$envContent = Get-Content .env -Raw

# Secrets ekle
$secrets = @{
    "AUTH_SECRET" = if ($envContent -match 'AUTH_SECRET="([^"]+)"') { $matches[1] } else { $null }
    "GOOGLE_CLIENT_ID" = if ($envContent -match 'GOOGLE_CLIENT_ID="([^"]+)"') { $matches[1] } else { $null }
    "GOOGLE_CLIENT_SECRET" = if ($envContent -match 'GOOGLE_CLIENT_SECRET="([^"]+)"') { $matches[1] } else { $null }
    "NEXTAUTH_URL" = if ($envContent -match 'NEXTAUTH_URL="([^"]+)"') { $matches[1] } else { $null }
}

Write-Host "📋 Eklenenecek Secrets:" -ForegroundColor Yellow
foreach ($key in $secrets.Keys) {
    if ($secrets[$key]) {
        Write-Host "   - $key" -ForegroundColor Gray
    } else {
        Write-Host "   - $key (bulunamadı)" -ForegroundColor Yellow
    }
}
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($key in $secrets.Keys) {
    $value = $secrets[$key]
    
    if (-not $value) {
        Write-Host "⚠️  $key için değer bulunamadı, atlanıyor..." -ForegroundColor Yellow
        continue
    }
    
    Write-Host "🔐 $key ekleniyor..." -ForegroundColor Cyan -NoNewline
    
    $value | gh secret set "$key" --repo "$repo" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host " ❌" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "=== ÖZET ===" -ForegroundColor Green
Write-Host "✅ Başarılı: $successCount" -ForegroundColor Green
Write-Host "❌ Başarısız: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "✅ GitHub Secrets ekleme tamamlandı!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Bazı secrets eklenemedi. GitHub CLI'ye giriş yaptığınızdan emin olun." -ForegroundColor Yellow
    Write-Host "   Giriş için: gh auth login" -ForegroundColor Yellow
}

