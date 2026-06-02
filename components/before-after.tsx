'use client';

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { GripVertical } from "lucide-react";

// Premium Quality Real Detailing Images Path (Public folder me rakhna hai)
const BEFORE_IMAGE = "/assets/ba-before.jpg";
const AFTER_IMAGE = "/assets/ba-after.jpg";

// Fallback images agar local media check fail ho jaye (Premium detailing close-up)
const FALLBACK_BEFORE = "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200";
const FALLBACK_AFTER = "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] select-none cursor-ew-resize touch-none bg-zinc-950"
      onMouseDown={(e) => {
        setIsDragging(true);
        move(e.clientX);
      }}
      onMouseMove={(e) => isDragging && move(e.clientX)}
      onTouchStart={(e) => {
        setIsDragging(true);
        move(e.touches[0].clientX);
      }}
      onTouchMove={(e) => isDragging && move(e.touches[0].clientX)}
    >
      {/* 1. AFTER IMAGE (Luxury Gloss Base Layer) */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src={AFTER_IMAGE}
          alt="After Gold Guard Protection"
          fill
          sizes="(max-width: 1200px) 100vw"
          className="object-cover"
          priority
          draggable={false}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src !== FALLBACK_AFTER) img.src = FALLBACK_AFTER;
          }}
        />
      </div>

      {/* 2. BEFORE IMAGE (Clipped Layer - Real Swirls & Dull Finish) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <div className="absolute inset-0 h-full w-full aspect-[16/9]">
          <Image
            src={BEFORE_IMAGE}
            alt="Before - Dull Oxidized Car Paint"
            fill
            sizes="(max-width: 1200px) 100vw"
            className="object-cover"
            priority
            draggable={false}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src !== FALLBACK_BEFORE) img.src = FALLBACK_BEFORE;
            }}
          />
        </div>
      </div>

      {/* Luxury Badges */}
      <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] bg-black/70 backdrop-blur-md text-zinc-300 px-3 py-1.5 rounded-full z-10 border border-white/10">
        Before
      </span>
      <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.3em] bg-[#D4AF37] text-black font-semibold px-3 py-1.5 rounded-full z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
        After
      </span>

      {/* Elegant Gold Slider Bar & Handle */}
      <div 
        className="absolute inset-y-0 z-20 pointer-events-none" 
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent shadow-[0_0_10px_#D4AF37]" />
        <div 
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gradient-to-r from-[#B38728] via-[#FBF5B7] to-[#AA771C] text-black grid place-items-center shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-grab transition-transform ${
            isDragging ? "scale-110 cursor-grabbing bg-gold" : "hover:scale-105"
          }`}
        >
          <GripVertical className="h-4 w-4 text-black stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
}