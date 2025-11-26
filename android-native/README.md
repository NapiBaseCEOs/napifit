# NapiFit Android Native App

Native Android application for NapiFit built with Kotlin, Material Design 3, and Jetpack libraries.

## Architecture

- **MVVM Architecture**: ViewModel + LiveData/StateFlow
- **Navigation**: Jetpack Navigation Component
- **API Client**: Retrofit + OkHttp
- **Database**: Room (for offline caching)
- **Authentication**: Supabase Auth
- **UI**: Material Design 3

## Setup

1. Open the project in Android Studio
2. Update `API_BASE_URL` in `app/build.gradle` to point to your API server
3. Configure Supabase credentials (if needed)
4. Sync Gradle files
5. Build and run

## Project Structure

```
app/src/main/java/com/napibase/napifit/
├── api/              # API client and models
├── data/             # Room database, repositories
├── ui/                # Activities, Fragments, ViewModels
│   ├── dashboard/
│   ├── health/
│   ├── water/
│   ├── community/
│   └── profile/
└── utils/             # Utilities, extensions
```

## Building APK

1. Build release APK:
```bash
./gradlew assembleRelease
```

2. APK will be generated at:
```
app/build/outputs/apk/release/app-release.apk
```

## Signing

To sign the APK for release:

1. Generate a keystore:
```bash
keytool -genkey -v -keystore napifit-release.keystore -alias napifit -keyalg RSA -keysize 2048 -validity 10000
```

2. Update `app/build.gradle` with signing config:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('napifit-release.keystore')
            storePassword 'your-store-password'
            keyAlias 'napifit'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

