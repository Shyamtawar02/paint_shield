"use client";

import { useState } from "react";
import {
  ChevronDown, Sparkles, ShieldCheck, Award, Sun, Droplets, Wand2, Ban, X, Layers, Thermometer, Gauge, Clock,
  SprayCan, FlaskConical, MapPin, Phone,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { BeforeAfter } from "@/components/before-after";
import { HeroSlider } from "@/components/hero-slider";
import { ScrollTop } from "@/components/scroll-top";
import { Testimonials } from "@/components/testimonials";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { useStore, type Product, type ProductVariant } from "@/lib/store";
import gallery1 from "@/public/assets/gallery-1.jpg";
import gallery2 from "@/public/assets/gallery-2.jpg";
import gallery3 from "@/public/assets/gallery-3.jpg";

// Supporting StaticImageData Type Declaration
type NextStaticImageAsset = string | { src: string; height: number; width: number; blurDataURL?: string };

const benefits = [
  { Icon: Ban, title: "Non-Yellowing", text: "Aliphatic TPU resists UV oxidation for a decade." },
  { Icon: Wand2, title: "Self-Healing", text: "Micro-scratches vanish under sun or warm water." },
  { Icon: Droplets, title: "Anti-Stain", text: "Hydrophobic top-coat repels sap, bugs and acid." },
  { Icon: Sun, title: "UV Protection", text: "Blocks 99% UV, prevents paint fade and oxidation." },
];

const careTips = [
  { Icon: SprayCan, title: "How to Wash", text: "Wait 7 days post-install. Use pH-neutral shampoo, two-bucket method, plush microfiber mitt. Avoid pressure washers within 6 inches of edges." },
  { Icon: Sun, title: "Sun Protection", text: "Park under shade when possible. UV exposure is harmless to the film, but accelerates contamination bonding. A monthly rinse keeps optics pristine." },
  { Icon: FlaskConical, title: "Chemical Safety", text: "Skip alkaline degreasers, automatic brush washes, and abrasive polishes. Bird droppings and tree sap should be wiped within 48 hours with a damp microfiber." },
];

export default function HomePage() {
  const { state } = useStore();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(state.products[0]?.id ?? "");
  const [active, setActive] = useState<{ product: Product; variant: ProductVariant } | null>(null);

  // Keep selected category valid when products change (e.g. after admin edits).
  const currentCategory =
    state.products.find((p) => p.id === activeCategoryId) ?? state.products[0];

  // Safely extract string path for gallery1 context asset fallback
  const gallery1Path = typeof gallery1 === 'object' && 'src' in gallery1 ? gallery1.src : gallery1;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <HeroSlider />

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Why PAINT SHIELD</p>
          <h2 className="font-display text-4xl md:text-5xl">Engineered to disappear.</h2>
          <p className="mt-4 text-muted-foreground">Four pillars define every film we install.</p>
        </div>
        <div className="grid gap-px bg-border rounded-2xl overflow-hidden border border-border sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, text }) => (
            <div key={title} className="bg-card p-8 sm:p-10 flex flex-col items-start gap-4 group hover:bg-secondary/40 transition-colors">
              <div className="h-12 w-12 rounded-full border border-gold/40 grid place-items-center text-gold group-hover:bg-gold group-hover:text-ink transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6"><div className="gold-divider" /></div>

      {/* PRODUCTS — CATEGORY SWITCHER */}
      <section id="tiers" className="bg-secondary/30 border-y border-border py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Our Protection Suite</p>
            <h2 className="font-display text-4xl md:text-5xl">Choose your shield.</h2>
            <p className="mt-4 text-muted-foreground">
              Select a category, then tap any variant to view its full technical specification.
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
            {state.products.map((p) => {
              const isActive = currentCategory?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveCategoryId(p.id)}
                  className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] border transition-all ${
                    isActive
                      ? "bg-gradient-gold text-ink border-transparent shadow-gold"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-gold/60"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {currentCategory && (
            <>
              <div className="text-center mb-10">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">{currentCategory.tagline}</p>
                <h3 className="font-display text-2xl md:text-3xl mt-2">{currentCategory.name} — Variants</h3>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {currentCategory.variants?.map((v, i) => (
                  <VariantCard
                    key={v.id}
                    variant={v}
                    featured={i === 1 && currentCategory.variants.length > 2}
                    onOpen={() => setActive({ product: currentCategory, variant: v })}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Before · After</p>
          <h2 className="font-display text-4xl md:text-5xl">See the gloss.</h2>
          <p className="mt-4 text-muted-foreground">Drag the gold handle to reveal the depth difference.</p>
        </div>
        <BeforeAfter />
      </section>

      {/* PRO CARE */}
      <section className="bg-secondary/30 border-y border-border py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Pro Care</p>
            <h2 className="font-display text-4xl md:text-5xl">Maintain the magic.</h2>
            <p className="mt-4 text-muted-foreground">Three habits that keep your PPF performing like day one.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {careTips.map(({ Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-8 shadow-soft hover:shadow-luxe hover:-translate-y-1 transition-all">
                <div className="h-14 w-14 rounded-full bg-gradient-gold grid place-items-center shadow-gold mb-6">
                  <Icon className="h-6 w-6 text-ink" />
                </div>
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Studio Showcase</p>
            <h2 className="font-display text-4xl md:text-5xl">Behind the glass.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Finished work and unedited footage from our installation bay.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          <GalleryPhoto src={gallery1} ratio="aspect-[4/5]" caption="Stealth Coupe — Ultra Stealth" />
          {state.vlogs?.[0] && <GalleryVideo vlog={state.vlogs[0]} />}
          <GalleryPhoto src={gallery2} ratio="aspect-[4/3]" caption="Premium Gloss — Hood Install" />
          <GalleryPhoto src={gallery3} ratio="aspect-square" caption="Defender — Matte Mastery" />
          {state.vlogs?.[1] && <GalleryVideo vlog={state.vlogs[1]} />}
          {state.vlogs?.[2] && <GalleryVideo vlog={state.vlogs[2]} />}
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section className="bg-secondary/30 border-y border-border py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 grid gap-16 md:grid-cols-2 items-center">
          <div className="relative order-2 md:order-1">
            <img src={gallery1Path} alt="Studio bay" className="rounded-2xl shadow-luxe w-full object-cover aspect-[4/5]" loading="lazy" />
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl shadow-luxe p-5 max-w-[200px] hidden md:block">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Certified</p>
              <p className="font-display text-lg mt-1">XPEL · STEK · Suntek</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Our Craftsmanship</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">Measured in <em className="text-gradient-gold not-italic">microns,</em> proven in years.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{state.studio.about}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every panel is decontaminated, clay-barred and IPA-wiped before a single inch of film touches paint. Our installers train annually with XPEL and STEK, and we maintain a positive-pressure bay calibrated to 22°C and 45% humidity — the only way to guarantee zero contamination under the film.
            </p>

            <div className="my-8 gold-divider" />

            <div className="grid grid-cols-3 gap-6">
              {[
                { k: "1,200+", v: "Cars Protected" },
                { k: "8 yr", v: "Median Warranty" },
                { k: "0", v: "Compromises" },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-display text-3xl text-gradient-gold">{s.k}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Studio</p><p>{state.studio.address}</p></div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                <Clock className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Hours</p><p>{state.studio.hours}</p></div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card sm:col-span-2">
                <Phone className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Bookings</p><p>{state.studio.phone}</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Answered</p>
            <h2 className="font-display text-4xl md:text-5xl">Frequently asked.</h2>
          </div>
          <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border shadow-soft px-6">
            {state.faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-border last:border-0">
                <AccordionTrigger className="font-display text-base md:text-lg py-5 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SiteFooter />
      <WhatsappFab />
      <ScrollTop />

      {active && (
        <SpecSheet product={active.product} variant={active.variant} onClose={() => setActive(null)} />
      )}
    </div>
  );
}

function VariantCard({
  variant, featured, onOpen,
}: { variant: ProductVariant; featured?: boolean; onOpen: () => void }) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-card p-8 transition-all hover:shadow-luxe hover:-translate-y-1 ${
        featured ? "border-gold shadow-gold" : "border-border shadow-soft"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-semibold">
          Most Popular
        </span>
      )}
      <div className="flex items-center gap-2 text-gold">
        <Sparkles className="h-4 w-4" />
        <p className="text-xs uppercase tracking-[0.25em]">{variant.warranty}</p>
      </div>
      <h3 className="font-display text-3xl mt-3">{variant.typeName}</h3>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <Spec label="Thickness" value={variant.microns} />
        <Spec label="Warranty" value={variant.warranty} />
      </div>
      <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <span>{variant.selfHealing}</span>
      </div>

      <button
        onClick={onOpen}
        className="mt-8 inline-flex items-center justify-between w-full text-left text-sm font-medium border-t border-border pt-4 hover:text-gold transition-colors group"
      >
        View Technical Spec
        <ChevronDown className="h-4 w-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
        <Award className="h-3.5 w-3.5 text-gold" />
        Hand-installed by certified specialists
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="font-display text-2xl mt-1">{value}</p>
    </div>
  );
}

function SpecSheet({
  product, variant, onClose,
}: { product: Product; variant: ProductVariant; onClose: () => void }) {
  const rows = [
    { Icon: Layers, label: "Material", value: variant.material },
    { Icon: Gauge, label: "Thickness", value: variant.microns },
    { Icon: Sparkles, label: "Gloss Level", value: variant.glossLevel },
    { Icon: Thermometer, label: "Heat Resistance", value: variant.heatResistance },
    { Icon: Clock, label: "Warranty", value: variant.warranty },
    { Icon: Wand2, label: "Self-Healing", value: variant.selfHealing },
  ];
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto animate-fade-in" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-luxe w-full max-w-2xl my-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-border flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{product.name} · {product.tagline}</p>
            <h3 className="font-display text-3xl mt-2">{variant.typeName}</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{variant.details}</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary shrink-0"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-5">Technical Specification</p>
          <div className="divide-y divide-border">
            {rows.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 py-4">
                <div className="h-10 w-10 rounded-full border border-gold/40 grid place-items-center text-gold shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 flex items-baseline justify-between gap-4 flex-wrap">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
                  <p className="font-display text-lg text-right">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryPhoto({ src, ratio, caption }: { src: NextStaticImageAsset; ratio: string; caption: string }) {
  const resolvedSrc = typeof src === 'object' && 'src' in src ? src.src : src;

  return (
    <figure className="break-inside-avoid mb-6 rounded-xl overflow-hidden border border-border bg-card shadow-soft group">
      <div className={`overflow-hidden ${ratio}`}>
        <img src={resolvedSrc} alt={caption} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <figcaption className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between">
        <span>{caption}</span>
        <span className="text-gold">PPF</span>
      </figcaption>
    </figure>
  );
}

function GalleryVideo({ vlog }: { vlog: { url: string; title: string; description: string } }) {
  return (
    <figure className="break-inside-avoid mb-6 rounded-xl overflow-hidden border border-border bg-card shadow-soft">
      <div className="aspect-video bg-muted">
        <iframe src={vlog.url} title={vlog.title} className="w-full h-full" loading="lazy" allowFullScreen />
      </div>
      <figcaption className="px-4 py-3">
        <p className="font-display text-base">{vlog.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{vlog.description}</p>
      </figcaption>
    </figure>
  );
}