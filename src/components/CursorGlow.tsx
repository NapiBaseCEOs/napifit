"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] hidden select-none lg:block"
      style={{
        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.18), transparent 65%)`,
      }}
    />
  );
}

