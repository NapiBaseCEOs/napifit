"""
Roboflow API Integration Test
Bu script Roboflow API'sinin çalıştığını test eder ve model bilgilerini doğrular.
"""

import requests
import base64
import json
import os

# Test configuration
API_KEY = os.getenv("ROBOFLOW_API_KEY", "IlmTchUDH2TV1mY7dIHe")
MODEL_ID = os.getenv("ROBOFLOW_MODEL_ID", "justinshenk/food")
MODEL_VERSION = os.getenv("ROBOFLOW_MODEL_VERSION", "5")
API_URL = os.getenv("ROBOFLOW_API_URL", "https://classify.roboflow.com")

def create_test_image_base64():
    """Create a minimal test image (1x1 pixel PNG)"""
    # Minimal PNG: 1x1 pixel, transparent
    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

def test_roboflow_api():
    """Test Roboflow API with current configuration"""
    print("=" * 60)
    print("Roboflow API Integration Test")
    print("=" * 60)
    print(f"\nConfiguration:")
    print(f"  API Key: {API_KEY[:20]}...")
    print(f"  Model ID: {MODEL_ID}")
    print(f"  Model Version: {MODEL_VERSION}")
    print(f"  API URL: {API_URL}")
    
    # Determine endpoint type
    endpoint_type = "classification" if "classify" in API_URL else "detection"
    print(f"  Endpoint Type: {endpoint_type}")
    
    # Prepare request
    url = f"{API_URL}/{MODEL_ID}/{MODEL_VERSION}"
    test_image = create_test_image_base64()
    
    params = {"api_key": API_KEY}
    data = {"image": test_image}
    
    print(f"\nTesting API call...")
    print(f"  URL: {url}")
    
    try:
        response = requests.post(
            url,
            params=params,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=15
        )
        
        print(f"\nResponse:")
        print(f"  Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"  [SUCCESS] API calisiyor!")
            print(f"  Response keys: {list(result.keys())}")
            
            # Check response format
            if "predictions" in result:
                print(f"  Detection model response detected")
                print(f"  Predictions count: {len(result.get('predictions', []))}")
            elif "top" in result:
                print(f"  Classification model response detected")
                print(f"  Top class: {result.get('top')}")
                print(f"  Confidence: {result.get('confidence', 0)}")
            else:
                print(f"  Response: {json.dumps(result, indent=2)[:500]}")
            
            print(f"\n[SUCCESS] Roboflow entegrasyonu hazir!")
            print(f"\n.env dosyasina ekle:")
            print(f"ROBOFLOW_API_KEY={API_KEY}")
            print(f"ROBOFLOW_MODEL_ID={MODEL_ID}")
            print(f"ROBOFLOW_MODEL_VERSION={MODEL_VERSION}")
            if endpoint_type == "detection":
                print(f"ROBOFLOW_API_URL=https://detect.roboflow.com")
            
            return True
            
        else:
            error_text = response.text[:500]
            print(f"  [ERROR] API cagrisi basarisiz")
            print(f"  Error: {error_text}")
            
            if response.status_code == 401 or response.status_code == 403:
                print(f"\n[INFO] API key gecersiz. Roboflow Dashboard'dan yeni key alin:")
                print(f"  https://app.roboflow.com/settings/api")
            elif response.status_code == 404:
                print(f"\n[INFO] Model bulunamadi. Model ID ve version'i kontrol edin:")
                print(f"  https://app.roboflow.com/{MODEL_ID.split('/')[0]}")
            elif response.status_code == 405:
                print(f"\n[INFO] Endpoint hatasi. Model tipini kontrol edin:")
                print(f"  - Classification: https://classify.roboflow.com")
                print(f"  - Detection: https://detect.roboflow.com")
            
            return False
            
    except requests.exceptions.Timeout:
        print(f"  [ERROR] Request timeout")
        return False
    except Exception as e:
        print(f"  [ERROR] Exception: {str(e)[:200]}")
        return False

if __name__ == "__main__":
    success = test_roboflow_api()
    
    if not success:
        print("\n" + "=" * 60)
        print("Model Olusturma Rehberi")
        print("=" * 60)
        print("\n1. Roboflow Dashboard'a git:")
        print("   https://app.roboflow.com/napibase")
        print("\n2. 'Create Project' butonuna tikla")
        print("\n3. Project bilgilerini gir:")
        print("   - Project name: meal-detector")
        print("   - Project type: Object Detection")
        print("\n4. Dataset'e gorseller yukle:")
        print("   - En az 50-100 yiyecek fotografi")
        print("   - Her fotografi etiketle (bounding box)")
        print("\n5. Model egit:")
        print("   - 'Train' butonuna tikla")
        print("   - Model otomatik egitilecek")
        print("\n6. Deploy:")
        print("   - 'Deploy' > 'Hosted API'")
        print("   - Model ID ve Version'i kopyala")
        print("\n7. .env dosyasina ekle:")
        print("   ROBOFLOW_MODEL_ID=napibase/meal-detector")
        print("   ROBOFLOW_MODEL_VERSION=1")



