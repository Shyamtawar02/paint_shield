"use client";

import { useState, memo } from "react";
import Image from "next/image"; 
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

// Static Local Asset Imports
import gallery1 from "@/public/assets/gallery-1.jpg";
import gallery2 from "@/public/assets/gallery-2.jpg";
import gallery3 from "@/public/assets/gallery-3.jpg";
import studioBay from "@/public/assets/studio-bay.jpg";
import pillarNonYellow from "@/public/assets/pillar-nonyellow.jpg";
import pillarSelfHeal from "@/public/assets/pillar-selfheal.jpg";
import pillarAntiStain from "@/public/assets/pillar-antistain.jpg";
import pillarUv from "@/public/assets/pillar-uv.jpg";
import prodPpf from "@/public/assets/prod-ppf.jpg";
import prodTint from "@/public/assets/prod-tint.jpg";
import prodCeramic from "@/public/assets/prod-ceramic.jpg";

type NextStaticAsset = string | { src: string; height: number; width: number; blurDataURL?: string };

const productImages: Record<string, NextStaticAsset> = {
  ppf: prodPpf,
  tint: prodTint,
  ceramic: prodCeramic,
};

const benefits = [
  { Icon: Ban, title: "Non-Yellowing", text: "Aliphatic TPU resists UV oxidation for a decade.", image: pillarNonYellow },
  { Icon: Wand2, title: "Self-Healing", text: "Micro-scratches vanish under sun or warm water.", image: pillarSelfHeal },
  { Icon: Droplets, title: "Anti-Stain", text: "Hydrophobic top-coat repels sap, bugs and acid.", image: pillarAntiStain },
  { Icon: Sun, title: "UV Protection", text: "Blocks 99% UV, prevents paint fade and oxidation.", image: pillarUv },
];

const careTips = [
  { Icon: SprayCan, title: "How to Wash", text: "Wait 7 days post-install. Use pH-neutral shampoo, two-bucket method, plush microfiber mitt. Avoid pressure washers within 6 inches of edges." },
  { Icon: Sun, title: "Sun Protection", text: "Park under shade when possible. UV exposure is harmless to the film, but accelerates contamination bonding. A monthly rinse keeps optics pristine." },
  { Icon: FlaskConical, title: "Chemical Safety", text: "Skip alkaline degreasers, automatic brush washes, and abrasive polishes. Bird droppings and tree sap should be wiped within 48 hours with a damp microfiber." },
];

export default function HomePage() {
  const { state } = useStore();
  
  const initialCategoryId = state?.products?.[0]?.id ?? "";
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategoryId);
  const [active, setActive] = useState<{ product: Product; variant: ProductVariant } | null>(null);
  const [activePillar, setActivePillar] = useState(0);

  const currentCategory =
    state?.products?.find((p) => p.id === activeCategoryId) ?? state?.products?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-gold/30 selection:text-white">
      <SiteHeader />
      <HeroSlider />

      {/* ABOUT OUR STUDIO */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-12 md:gap-16 md:grid-cols-2 items-center">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-luxe">
            <Image
              src={studioBay}
              alt="Gold Guard Forge detailing studio bay"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-6 right-6 z-10 bg-card border border-border rounded-xl shadow-luxe p-5 hidden md:block">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Clean-Room</p>
              <p className="font-display text-lg mt-1">22°C · 45% RH</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">About our Studio</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">An elite atelier for <em className="text-gradient-gold not-italic">automotive perfection.</em></h2>
            <div className="my-8 gold-divider" />
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              Gold Guard Forge is an elite automotive detailing studio dedicated to preserving your
              vehicle&apos;s pristine condition. We combine international standards, clean-room environments,
              and certified master installers to deliver flawless Paint Protection Film (PPF) and Ceramic
              Coating services. Your vehicle deserves nothing less than perfection.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { k: "Certified", v: "Master Installers" },
                { k: "Clean-Room", v: "Filtered Bay" },
                { k: "International", v: "Standards" },
              ].map((s, index) => (
                <div key={`${s.v}-${index}`}>
                  <p className="font-display text-lg text-gradient-gold">{s.k}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6"><div className="gold-divider" /></div>

      {/* WHY CHOOSE — synced with pillar imagery */}
  <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
  <div className="text-center max-w-2xl mx-auto mb-14">
    <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Why PAINT SHIELD</p>
    <h2 className="font-display text-4xl md:text-5xl">Engineered to disappear.</h2>
    <p className="mt-4 text-muted-foreground">Four pillars define every film we install. Tap a pillar to see it in action.</p>
  </div>

  <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-stretch">
    
    {/* DESKTOP IMAGE VIEW: Only visible on lg (Desktop) screens */}
    <div className="hidden lg:block relative rounded-2xl overflow-hidden border border-border shadow-luxe bg-secondary/40 min-h-[450px]">
      {benefits.map((b, i) => (
        <Image
          key={b.title}
          src={b.image}
          alt={b.title}
          fill
          sizes="50vw"
          className={`object-cover transition-opacity duration-700 ease-out ${
            activePillar === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Pillar 0{activePillar + 1}</p>
        <h3 className="font-display text-4xl text-white">{benefits[activePillar].title}</h3>
        <p className="mt-2 text-white/80 text-sm max-w-md">{benefits[activePillar].text}</p>
      </div>
    </div>

    {/* PILLARS / BUTTONS LIST */}
    <div className="grid gap-px bg-border rounded-2xl overflow-hidden border border-border sm:grid-cols-2 lg:grid-cols-1">
      {benefits.map(({ Icon, title, text, image }, i) => {
        const isActive = activePillar === i;
        return (
          <div
            key={title}
            className={`flex flex-col transition-all ${
              isActive ? "bg-secondary/60" : "bg-card"
            }`}
          >
            {/* Main Accordion/Tab Trigger */}
            <button
              type="button"
              onClick={() => setActivePillar(i)}
              onMouseEnter={() => setActivePillar(i)}
              className="text-left p-6 sm:p-7 flex flex-col items-start gap-3 w-full outline-none"
            >
              <div className={`h-11 w-11 rounded-full grid place-items-center transition-colors ${
                isActive ? "bg-gold text-foreground shadow-gold" : "border border-gold/40 text-gold"
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="font-display text-lg">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
              <span className={`mt-1 h-px transition-all ${isActive ? "bg-gold w-16" : "bg-border w-10"}`} />
            </button>

            {/* MOBILE IMAGE SLOT: Renders right below the text when active on mobile/tablet */}
            {isActive && (
              <div className="block lg:hidden px-6 pb-6 w-full animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-border/60 shadow-md">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>

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

    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
      {state?.products?.map((p) => {
        const isActive = currentCategory?.id === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveCategoryId(p.id)}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] border transition-all ${
              isActive
                ? "bg-gradient-gold text-background border-transparent shadow-gold"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-gold/60"
            }`}
          >
            {p.name}
          </button>
        );
      })}
    </div>

    {currentCategory && (
      <div key={currentCategory.id} className="animate-fade-in">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] items-start mb-12">
          
          {/* DYNAMIC IMAGE BLOCK */}
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-border shadow-luxe bg-secondary/40">
            <Image
              // FIXED: Ab yeh data direct state/backend se image uthayega. Agar p.image nahi hoga tabhi local wrapper use karega.
              src={currentCategory.image || productImages[currentCategory.id] || prodPpf}
              alt={currentCategory.name}
              fill
              sizes="(max-width: 1024px) 100vw, 35vw"
              className="object-cover"
              // Remote URL filters handler optimized
              unoptimized={typeof currentCategory.image === 'string' && currentCategory.image.startsWith('http')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">{currentCategory.tagline}</p>
              <h3 className="font-display text-3xl md:text-4xl text-white">{currentCategory.name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Available Variants</p>
            <h4 className="font-display text-2xl md:text-3xl">Choose the right grade for your build.</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every variant is hand-installed in our clean-room bay. Tap any card below for a full technical specification.
            </p>
            <div className="gold-divider" />
            <ul className="space-y-3">
              {currentCategory.variants?.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-display text-base">{v.typeName}</span>
                  <span className="text-gold text-xs uppercase tracking-[0.2em]">{v.warranty}</span>
                </li>
              ))}
            </ul>
          </div>
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
      </div>
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

      {/* PRO CARE (image_3a4030.png section fixed) */}
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
                {/* FIXED: Changed text-white/text-background to text-foreground (Black/Charcoal vibe) */}
                <div className="h-14 w-14 rounded-full bg-gradient-gold grid place-items-center shadow-gold mb-6">
                  <Icon className="h-6 w-6 text-foreground" />
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
          {state?.vlogs?.[0] && <GalleryVideo vlog={state.vlogs[0]} />}
          <GalleryPhoto src={gallery2} ratio="aspect-[4/3]" caption="Premium Gloss — Hood Install" />
          <GalleryPhoto src={gallery3} ratio="aspect-square" caption="Defender — Matte Mastery" />
          {state?.vlogs?.[1] && <GalleryVideo vlog={state.vlogs[1]} />}
          {state?.vlogs?.[2] && <GalleryVideo vlog={state.vlogs[2]} />}
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section className="bg-secondary/30 border-y border-border py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 grid gap-16 md:grid-cols-2 items-center">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-luxe order-2 md:order-1">
            <Image src={gallery1} alt="Studio bay" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <div className="absolute bottom-6 left-6 z-10 bg-card border border-border rounded-xl shadow-luxe p-5 max-w-[200px] hidden md:block">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Certified</p>
              <p className="font-display text-lg mt-1">XPEL · STEK · Suntek</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Our Craftsmanship</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">Measured in <em className="text-gradient-gold not-italic">microns,</em> proven in years.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{state?.studio?.about}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every panel is decontaminated, clay-barred and IPA-wiped before a single inch of film touches paint. Our installers train annually with XPEL and STEK, and we maintain a positive-pressure bay calibrated to 22°C and 45% humidity.
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
                <div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Studio</p><p>{state?.studio?.address}</p></div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                <Clock className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Hours</p><p>{state?.studio?.hours}</p></div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card sm:col-span-2">
                <Phone className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Bookings</p><p>{state?.studio?.phone}</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Answered</p>
            <h2 className="font-display text-4xl md:text-5xl">Frequently asked.</h2>
          </div>
          <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border shadow-soft px-6">
            {state?.faqs?.map((f) => (
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

const VariantCard = memo(function VariantCard({
  variant, featured, onOpen,
}: { variant: ProductVariant; featured?: boolean; onOpen: () => void }) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-card p-8 transition-all hover:shadow-luxe hover:-translate-y-1 ${
        featured ? "border-gold shadow-gold" : "border-border shadow-soft"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-background text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-semibold">
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
        type="button"
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
});

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
  const previewImage = productImages[product.id] ?? prodPpf;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto animate-fade-in" 
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border shadow-luxe w-full max-w-4xl my-auto animate-scale-in overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-[5fr_7fr] w-full overflow-hidden">
          <div className="relative bg-secondary/40 hidden md:block md:h-full min-h-[450px]">
            <Image 
              src={previewImage} 
              alt={variant.typeName} 
              fill 
              sizes="35vw"
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{product.tagline}</p>
              <p className="font-display text-xl text-white mt-1">{product.name}</p>
            </div>
          </div>

          <div className="flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-y-auto w-full">
            <div className="p-6 md:p-8 border-b border-border flex items-start justify-between gap-4 sticky top-0 bg-card z-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{product.name}</p>
                <h3 className="font-display text-2xl md:text-3xl mt-2">{variant.typeName}</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{variant.details}</p>
              </div>
              <button 
                type="button" 
                onClick={onClose} 
                aria-label="Close" 
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary shrink-0 border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-5 font-semibold">
                Technical Specification
              </p>
              <div className="divide-y divide-border">
                {rows.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 py-4 md:py-5">
                    {/* FIXED: Changed text-background to text-foreground for modal spec details */}
                    <div className="h-10 w-10 rounded-full bg-gradient-gold grid place-items-center text-foreground shrink-0 shadow-gold">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        {label}
                      </p>
                      <p className="font-display text-base sm:text-lg text-foreground break-words sm:text-right">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryPhoto({ src, ratio, caption }: { src: NextStaticAsset; ratio: string; caption: string }) {
  return (
    <figure className="break-inside-avoid mb-6 rounded-xl overflow-hidden border border-border bg-card shadow-soft group">
      <div className={`overflow-hidden relative ${ratio}`}>
        <Image src={src} alt={caption} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
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
      <div className="aspect-video bg-muted relative">
        <iframe src={vlog.url} title={vlog.title} className="w-full h-full border-0" loading="lazy" allowFullScreen />
      </div>
      <figcaption className="px-4 py-3">
        <p className="font-display text-base">{vlog.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{vlog.description}</p>
      </figcaption>
    </figure>
  );
}