import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  { name: "Aditya Verma", car: "BMW M340i", rating: 5, text: "The Premium Gloss install on my M340i is flawless. Three months in, water still beads off like the day it was wrapped. Studio is hospital-clean — they take this seriously." },
  { name: "Sneha Kapoor", car: "Range Rover Velar", rating: 5, text: "I went in for paint correction and walked out with Ultra Stealth. The matte conversion is unreal. Felt every rupee was earned, not charged." },
  { name: "Rohit Mehra", car: "Porsche 911 Carrera", rating: 5, text: "Finally a studio in central India that doesn't compromise. Edges are tucked, no orange peel, and the warranty card is digital. Top class." },
  { name: "Priya Nair", car: "Audi Q5", rating: 5, text: "Booked Standard Shield for my daily. Bug splatter, sap, parking dings — all wipe off. Worth every minute of the install." },
  { name: "Kunal Sharma", car: "Mahindra XUV 700", rating: 5, text: "Ek dum top notch kaam. 8-year warranty mil gayi, photos bhi share kiye, aur portal pe sab record hai. Highly recommend." },
  { name: "Devansh Gupta", car: "Mercedes GLE", rating: 5, text: "Crew explained every layer, every micron. Transparent pricing, no upsell pressure. Paint looks deeper than factory." },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (idx: number) => {
    const el = ref.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - 24, behavior: "smooth" });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0, dist = Infinity;
      cards.forEach((c, i) => {
        const cc = c.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(cc - center);
        if (d < dist) { dist = d; nearest = i; }
      });
      setActive(nearest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const move = (dir: 1 | -1) => {
    const next = Math.max(0, Math.min(reviews.length - 1, active + dir));
    scrollTo(next);
  };

  return (
    <section className="bg-secondary/30 border-y border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Word of Mouth</p>
            <h2 className="font-display text-4xl md:text-5xl">Trusted by enthusiasts.</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => move(-1)} aria-label="Previous review" className="h-11 w-11 rounded-full border border-border bg-card grid place-items-center hover:border-gold hover:text-gold transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => move(1)} aria-label="Next review" className="h-11 w-11 rounded-full border border-border bg-card grid place-items-center hover:border-gold hover:text-gold transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={ref}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {reviews.map((r, idx) => (
            <article
              key={idx}
              className="snap-start shrink-0 w-[85%] sm:w-[420px] rounded-2xl border border-border bg-card p-8 shadow-soft relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gold/20" />
              <div className="flex gap-0.5 text-gold mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed">"{r.text}"</p>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-display text-lg">{r.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{r.car}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-4">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to review ${idx + 1}`}
              onClick={() => scrollTo(idx)}
              className={`h-1.5 rounded-full transition-all ${active === idx ? "w-8 bg-gold" : "w-2 bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
