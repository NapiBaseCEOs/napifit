"use client";

import { useState, useEffect, useRef } from "react";

interface UseAnimatedNumberOptions {
  duration?: number; // Animasyon süresi (ms)
  easing?: (t: number) => number; // Easing fonksiyonu
}

// Easing fonksiyonları
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export function useAnimatedNumber(
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
): number {
  const { duration = 1000, easing = easeOutCubic } = options;
  const [currentValue, setCurrentValue] = useState(0); // İlk değeri 0'dan başlat
  const animationFrameRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // İlk render'da hedef değere animasyonlu git
    if (isFirstRender.current) {
      isFirstRender.current = false;
      startValueRef.current = 0;
      startTimeRef.current = null;
      
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        const diff = targetValue - startValueRef.current;
        const newValue = Math.round(startValueRef.current + diff * easedProgress);

        setCurrentValue(newValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentValue(targetValue);
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    // Sonraki güncellemelerde normal animasyon
    if (targetValue === currentValue) return;

    // Animasyon zaten devam ediyorsa iptal et
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    startValueRef.current = currentValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      const diff = targetValue - startValueRef.current;
      const newValue = Math.round(startValueRef.current + diff * easedProgress);

      setCurrentValue(newValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue); // Son değeri tam olarak ayarla
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue, duration]);

  return currentValue;
}

