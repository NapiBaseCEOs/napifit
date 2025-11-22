"use client";

import { useEffect } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  style?: React.CSSProperties;
  className?: string;
  fullWidthResponsive?: boolean;
}

/**
 * Google AdSense reklam bileşeni
 * 
 * Kullanım:
 * <AdSenseAd 
 *   adSlot="1234567890" 
 *   adFormat="auto"
 *   fullWidthResponsive={true}
 * />
 */
export default function AdSenseAd({
  adSlot,
  adFormat = "auto",
  style,
  className = "",
  fullWidthResponsive = true,
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // AdSense script yüklendikten sonra reklamları başlat
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense reklam yükleme hatası:", error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...(fullWidthResponsive && { width: "100%" }),
        }}
        data-ad-client="ca-pub-9781131812136360"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

