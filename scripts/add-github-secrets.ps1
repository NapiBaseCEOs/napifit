# GitHub Secrets Ekleme Script'i
# .env dosyasındaki bilgileri GitHub Secrets olarak ekler

Write-Host "🔐 GitHub Secrets Ekleme Başlatılıyor..." -ForegroundColor Green
Write-Host ""

# GitHub CLI kontrolü
$ghPath = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $ghPath)) {
    # PATH'de kontrol et
    $ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $ghInstalled) {
        Write-Host "❌ GitHub CLI bulunamadı!" -ForegroundColor Red
        Write-Host "💡 GitHub CLI'yı yükleyin: https://cli.github.com/" -ForegroundColor Yellow
        exit 1
    }
    $ghPath = "gh"
} else {
    # PATH'e ekle
    $env:Path = "$env:Path;C:\Program Files\GitHub CLI"
}

Write-Host "✅ GitHub CLI bulundu" -ForegroundColor Green

# GitHub authentication kontrolü
$authStatus = & $ghPath auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  GitHub'a giriş yapılmamış!" -ForegroundColor Yellow
    Write-Host "💡 GitHub'a giriş yapın: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub authentication başarılı" -ForegroundColor Green
Write-Host ""

# Repository bilgisi
$repo = "NapiBaseCEOs/napifit"
Write-Host "📦 Repository: $repo" -ForegroundColor Cyan
Write-Host ""

# .env dosyasını oku
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env dosyası bulunamadı!" -ForegroundColor Red
    exit 1
}

Write-Host "📄 .env dosyası okunuyor..." -ForegroundColor Cyan

# .env dosyasından değerleri oku
$secrets = @{}

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            
            # Tırnak işaretlerini kaldır
            $value = $value.TrimStart('"').TrimEnd('"').TrimStart("'").TrimEnd("'")
            
            # Boş değerleri atla
            if ($value) {
                $secrets[$key] = $value
            }
        }
    }
}

# GitHub Secrets için gerekli key'leri belirle
$githubSecrets = @{}
$githubSecrets["AUTH_SECRET"] = $secrets["AUTH_SECRET"]
$githubSecrets["GOOGLE_CLIENT_ID"] = $secrets["GOOGLE_CLIENT_ID"]
$githubSecrets["GOOGLE_CLIENT_SECRET"] = $secrets["GOOGLE_CLIENT_SECRET"]
$githubSecrets["NEXTAUTH_URL"] = $secrets["NEXTAUTH_URL"]

# Cloudflare için bilgiler (opsiyonel)
if ($secrets.ContainsKey("CLOUDFLARE_API_TOKEN")) {
    $githubSecrets["CLOUDFLARE_API_TOKEN"] = $secrets["CLOUDFLARE_API_TOKEN"]
}
if ($secrets.ContainsKey("CLOUDFLARE_ACCOUNT_ID")) {
    $githubSecrets["CLOUDFLARE_ACCOUNT_ID"] = $secrets["CLOUDFLARE_ACCOUNT_ID"]
}

Write-Host "📋 Eklenenecek Secrets:" -ForegroundColor Yellow
foreach ($key in $githubSecrets.Keys) {
    Write-Host "   - $key" -ForegroundColor Gray
}
Write-Host ""

# Secrets ekle
$successCount = 0
$failCount = 0

foreach ($key in $githubSecrets.Keys) {
    $value = $githubSecrets[$key]
    
    if (-not $value) {
        Write-Host "⚠️  $key için değer bulunamadı, atlanıyor..." -ForegroundColor Yellow
        continue
    }
    
    Write-Host "🔐 $key ekleniyor..." -ForegroundColor Cyan -NoNewline
    
    # GitHub CLI ile secret ekle
    $value | & $ghPath secret set "$key" --repo "$repo" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "   Hata: Secret eklenemedi" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "=== ÖZET ===" -ForegroundColor Green
Write-Host "✅ Başarılı: $successCount" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "❌ Başarısız: $failCount" -ForegroundColor Red
} else {
    Write-Host "❌ Başarısız: $failCount" -ForegroundColor Gray
}
Write-Host ""

# Cloudflare Secrets kontrolü
if (-not $githubSecrets.ContainsKey("CLOUDFLARE_API_TOKEN")) {
    Write-Host "⚠️  CLOUDFLARE_API_TOKEN .env dosyasında bulunamadı" -ForegroundColor Yellow
    Write-Host "💡 Cloudflare Pages deploy için gerekli!" -ForegroundColor Yellow
    Write-Host "   Manuel eklemek için: gh secret set CLOUDFLARE_API_TOKEN --repo $repo" -ForegroundColor Gray
}

if (-not $githubSecrets.ContainsKey("CLOUDFLARE_ACCOUNT_ID")) {
    Write-Host "⚠️  CLOUDFLARE_ACCOUNT_ID .env dosyasında bulunamadı" -ForegroundColor Yellow
    Write-Host "💡 Cloudflare Pages deploy için gerekli!" -ForegroundColor Yellow
    Write-Host "   Manuel eklemek için: gh secret set CLOUDFLARE_ACCOUNT_ID --repo $repo" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ GitHub Secrets ekleme tamamlandı!" -ForegroundColor Green
