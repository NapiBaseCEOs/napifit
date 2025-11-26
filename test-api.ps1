# API Server Test Script

$baseUrl = "https://napifit-idn9undo5-sefas-projects-21462460.vercel.app"

Write-Host "Testing API Server..." -ForegroundColor Green
Write-Host ""

# Test Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -UseBasicParsing
    Write-Host "✅ Health Check: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Feature Requests (Public endpoint)
Write-Host "2. Testing Feature Requests..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/feature-requests" -Method GET -UseBasicParsing
    Write-Host "✅ Feature Requests: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Feature Requests Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Auth Signin (should return 400/401 without credentials)
Write-Host "3. Testing Auth Signin..." -ForegroundColor Yellow
try {
    $body = @{
        email = "test@example.com"
        password = "test123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/signin" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Auth Signin: $($response.StatusCode)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401 -or $statusCode -eq 400) {
        Write-Host "✅ Auth Signin: $statusCode (Expected - Invalid credentials)" -ForegroundColor Green
    } else {
        Write-Host "❌ Auth Signin Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Green


