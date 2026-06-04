'use client';

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Paths ko clean public/assets string paths mein badal diya
const hero1 = "/assets/hero-car.jpg";
const hero2 = "/assets/hero-2.jpg";
const hero3 = "/assets/hero-3.jpg";

// Premium dynamic links agar assets folder mein photos na hon toh safe fallback ke liye
const fallbacks = [
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1600", // Dark Luxury Car
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600", // Studio Detail
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600"  // Supercar
];

const slides = [
  { src: hero1, fallback: fallbacks[0], eyebrow: "Paint Shield • Est. 2018", title: "The Art of", italic: "Protection.", body: "Hand-applied Paint Protection Film, calibrated for paint that deserves to outlive trends." },
  { src: hero2, fallback: fallbacks[1], eyebrow: "Self-Healing TPU", title: "Engineered to", italic: "Disappear.", body: "Aliphatic films that resist yellowing, repel grime and heal under sunlight." },
  { src: hero3, fallback: fallbacks[2], eyebrow: "10-Year Warranty", title: "Showroom Gloss,", italic: "Forever.", body: "Hydrophobic, anti-stain, optically pure. Your paint, preserved at factory depth." },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const next = useCallback(() => setI((x) => (x + 1) % slides.length), []);
  const prev = useCallback(() => setI((x) => (x - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative h-[92vh] min-h-[560px] w-full overflow-hidden group">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === idx ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={s.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading={idx === 0 ? "eager" : "lazy"}
            onError={(e) => {
              // Agar public/assets folder mein photo na milti ho toh internet waali load ho jaye
              (e.target as HTMLImageElement).src = s.fallback;
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)" }} />
        </div>
      ))}

      <div className="relative z-20 mx-auto max-w-7xl px-6 h-full flex flex-col justify-end pb-20 md:pb-32">
        <div key={i} className="animate-fade-in">
          <p className="text-gold text-xs md:text-sm uppercase tracking-[0.4em] mb-6">{slides[i].eyebrow}</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] max-w-4xl">
            {slides[i].title}<br />
            <span className="italic text-gradient-gold">{slides[i].italic}</span>
          </h1>
          <p className="mt-6 text-white/80 max-w-xl text-base md:text-lg font-light">{slides[i].body}</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#tiers" className="inline-flex items-center gap-2 rounded-full bg-gold text-black px-7 py-3 text-sm font-medium tracking-wide hover:shadow-gold transition-all">Explore Tiers</a>
          <a href="#gallery" className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-7 py-3 text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-colors">View Gallery</a>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 h-11 w-11 md:h-12 md:w-12 grid place-items-center rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-gold hover:text-black transition-all md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 h-11 w-11 md:h-12 md:w-12 grid place-items-center rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-gold hover:text-black transition-all md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-8 bg-gold" : "w-4 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}