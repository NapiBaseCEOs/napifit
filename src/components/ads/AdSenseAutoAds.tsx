"use client";

import { useEffect } from "react";

/**
 * Google AdSense Auto Ads bileşeni
 * Google'ın otomatik reklam yerleşimi için kullanılır
 * 
 * Bu bileşen sayfaya eklendiğinde, Google AdSense otomatik olarak
 * en uygun yerlere reklamları yerleştirir.
 * 
 * AdSense dashboard'da Auto ads'i açmanız gerekir.
 */
export default function AdSenseAutoAds() {
  useEffect(() => {
    // Auto ads için özel bir script gerekmez
    // AdSense script'i zaten layout.tsx'de yükleniyor
    // AdSense dashboard'da Auto ads açık olduğunda otomatik çalışır
  }, []);

  // Auto ads görünür bir bileşen gerektirmez
  // Google otomatik olarak reklamları yerleştirir
  return null;
}

