'use client';

import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";

// Bhai agar tere paas apni khud ki image hai, toh use public/assets/before-after.jpg par daal dena
// Abhi ke liye maine ek premium luxury car detailing image ka link daal diya hai taaki error na aaye
const beforeAfter = "/assets/before-after.jpg"; 
const fallbackImage = "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  // Image source path jo safe rahega
  const imgSrc = beforeAfter || fallbackImage;

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border shadow-luxe select-none cursor-ew-resize touch-none"
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX); }}
      onTouchMove={(e) => dragging.current && move(e.touches[0].clientX)}
      onTouchEnd={() => { dragging.current = false; }}
    >
      {/* AFTER IMAGE (Full Base Layer) */}
      <img 
        src={imgSrc} 
        alt="After PPF" 
        className="absolute inset-0 h-full w-full object-cover" 
        loading="lazy" 
        onError={(e) => {
          // Agar local assets waali image na mile toh automatic live link par switch ho jaye
          (e.target as HTMLImageElement).src = fallbackImage;
        }}
      />
      
      {/* BEFORE IMAGE (Clipped to left using safer width and container logic) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div className="absolute inset-0 w-[100vw] h-full" style={{ width: ref.current ? `${ref.current.offsetWidth}px` : '100%' }}>
          <img
            src={imgSrc}
            alt="Before PPF"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(0.55) brightness(0.78) contrast(0.9)" }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>
      </div>

      {/* Badges Labels */}
      <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] bg-background/80 text-foreground px-3 py-1 rounded-full z-10">Before</span>
      <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.3em] bg-gold text-ink px-3 py-1 rounded-full z-10">After</span>

      {/* Drag Divider Line + Center Gold Handle */}
      <div className="absolute inset-y-0 z-20" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -translate-x-1/2 w-px bg-background/90" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gold text-ink grid place-items-center shadow-gold transition-transform active:scale-95 cursor-grab">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}