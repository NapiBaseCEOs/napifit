# 🚀 API Server Başlatma

## Durum

API server yeni bir PowerShell penceresinde başlatıldı. Lütfen açılan pencerede server'ın çalıştığını kontrol edin.

## API Server'ı Manuel Başlatma

Eğer server başlamadıysa, yeni bir terminal açıp şu komutu çalıştırın:

```powershell
cd C:\Users\Administrator\Desktop\NapiBase\api-server
npm run dev
```

Server başladığında şu mesajı göreceksiniz:
```
🚀 NapiFit API Server running on port 3001
📡 CORS enabled for: *
```

## Test

Server başladıktan sonra, tarayıcıda şu adresi açın:
```
http://localhost:3001/health
```

Şu yanıtı görmelisiniz:
```json
{"status":"ok","timestamp":"..."}
```

## Android Emulator İçin

Android emulator'de `localhost` çalışmaz. Bunun yerine:
- **Emulator için:** `http://10.0.2.2:3001/api/` ✅ (Zaten yapılandırıldı)
- **Fiziksel cihaz için:** Bilgisayarınızın IP adresini kullanın

## Sorun Giderme

### Port 3001 Kullanımda
```powershell
# Port'u kullanan process'i bul
netstat -ano | findstr :3001

# Process'i sonlandır (PID'yi yukarıdaki komuttan alın)
taskkill /PID <PID> /F
```

### Server Başlamıyor
1. `node_modules` klasörünün var olduğundan emin olun
2. `.env` dosyasının ana dizinde olduğundan emin olun
3. Supabase credentials'ların doğru olduğundan emin olun

## Sonraki Adımlar

1. ✅ API server'ı başlatın
2. ✅ Server'ın çalıştığını test edin (`http://localhost:3001/health`)
3. ✅ Android uygulamasını yeniden çalıştırın
4. ✅ Logcat'te API çağrılarını kontrol edin


