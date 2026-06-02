// Lightweight client-side store with localStorage persistence + seeded demo data.
import { useEffect, useState } from "react";

export type ProductVariant = {
  id: string;
  typeName: string;
  microns: string;
  warranty: string;
  material: string;
  glossLevel: string;
  heatResistance: string;
  selfHealing: string;
  details: string;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  image?: string;
  variants: ProductVariant[];
};

export type Vlog = {
  id: string;
  title: string;
  description: string;
  url: string;
};

// FULLY SYNCED WITH MONGODB SCHEMA
export type Customer = {
  id?: string;
  _id?: string;
  customerName: string; // Matches MongoDB field
  vehicleModel: string;
  vehicleNo: string;
  contactNo: string;    // Matches MongoDB field
  email: string;
  warrantyYears: string; // Matches MongoDB field (e.g., "8 years")
  serviceDate: string;
  kmDriven: string;
  serviceType: string;
  workPhotos: string[]; // Matches MongoDB field
};

export type Faq = { id: string; q: string; a: string };

export type Studio = {
  address: string;
  hours: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  about: string;
};

// Bumped key — schema change for product variants.
const KEY = "ppf-store-v3";

type State = {
  products: Product[];
  vlogs: Vlog[];
  customers: Customer[];
  faqs: Faq[];
  studio: Studio;
};

const seed: State = {
  products: [
    {
      id: "ppf",
      name: "Paint Protection Film (PPF)",
      tagline: "Ultimate Paint Defense",
      variants: [
        {
          id: "ppf-std",
          typeName: "Standard Shield",
          microns: "160 microns",
          warranty: "5 Years",
          material: "Aliphatic TPU",
          glossLevel: "High Gloss ~92 GU",
          heatResistance: "Up to 120°C",
          selfHealing: "Heat-activated micro-scratch recovery",
          details:
            "Entry-tier TPU film engineered for daily commuters. Hydrophobic top-coat repels water and grime, while the elastomeric layer absorbs road impact and prevents stone chips. Optical clarity preserved without yellowing for 5 years.",
        },
        {
          id: "ppf-prem",
          typeName: "Premium Gloss",
          microns: "190 microns",
          warranty: "8 Years",
          material: "Ceramic-Infused TPU",
          glossLevel: "Ultra High Gloss > 95 GU",
          heatResistance: "Up to 140°C",
          selfHealing: "Rapid self-healing (60s @ 40°C)",
          details:
            "Thicker aliphatic TPU formulation with an enhanced ceramic-infused topcoat. Deeper wet-look gloss, superior chemical resistance against bird droppings, sap and industrial fallout. Backed by an 8-year warranty.",
        },
        {
          id: "ppf-ultra",
          typeName: "Ultra Stealth Matte",
          microns: "210 microns",
          warranty: "10 Years",
          material: "Hyper-Elastomeric TPU", // FIXED: Removed trailing ',b' syntax error
          glossLevel: "Matte ~12 GU",
          heatResistance: "Up to 160°C",
          selfHealing: "Advanced thermal regeneration",
          details:
            "Flagship 210-micron film with a satin matte finish that converts gloss paint into a sophisticated stealth aesthetic. Maximum impact resistance, anti-stain top layer, full 10-year warranty.",
        },
      ],
    },
    {
      id: "tint",
      name: "Window Tint",
      tagline: "Heat & Glare Rejection",
      variants: [
        {
          id: "tint-carbon",
          typeName: "Carbon Series",
          microns: "1.5 mil",
          warranty: "5 Years",
          material: "Multi-layer Carbon Polyester",
          glossLevel: "Non-reflective satin",
          heatResistance: "Rejects up to 55% IR",
          selfHealing: "Scratch-resistant hard coat",
          details:
            "True carbon-dyed film with no metallic interference. Blocks 99% UV and a strong portion of infrared heat without compromising signal clarity. A clean, OEM-grade aesthetic at an honest price.",
        },
        {
          id: "tint-ceramic",
          typeName: "Ceramic IR Pro",
          microns: "2.0 mil",
          warranty: "Lifetime",
          material: "Nano-Ceramic Particle Film",
          glossLevel: "Crystal optical clarity",
          heatResistance: "Rejects up to 88% IR",
          selfHealing: "Anti-scratch ceramic top-coat",
          details:
            "Flagship nano-ceramic tint that keeps cabins dramatically cooler, blocks 99% UV, and stays signal-friendly for GPS, 5G and toll transponders. Lifetime warranty against bubbling, fading and delamination.",
        },
      ],
    },
    {
      id: "ceramic",
      name: "Ceramic Coating",
      tagline: "Liquid Glass Protection",
      variants: [
        {
          id: "cc-9h",
          typeName: "9H Pro Coat",
          microns: "~2 µm cured layer",
          warranty: "3 Years",
          material: "SiO₂ 90% Quartz",
          glossLevel: "Mirror Gloss > 98 GU",
          heatResistance: "Up to 350°C",
          selfHealing: "N/A — sacrificial layer",
          details:
            "Single-layer 9H ceramic with deep hydrophobic beading and full chemical resistance for 3 years. Ideal for daily drivers seeking gloss enhancement and effortless washing.",
        },
        {
          id: "cc-graphene",
          typeName: "Graphene Infinity",
          microns: "~3 µm cured layer",
          warranty: "7 Years",
          material: "Graphene-Oxide + SiO₂ Matrix",
          glossLevel: "Liquid Glass > 99 GU",
          heatResistance: "Up to 450°C",
          selfHealing: "Self-leveling under heat",
          details:
            "Dual-layer graphene-infused coating with extreme anti-static properties, lower surface temperature and zero water-spotting. 7-year warranty with annual inspection.",
        },
      ],
    },
  ],
  vlogs: [
    { id: "v1", title: "XUV 700 — Full Body PPF", description: "Behind the scenes of a 14-hour Premium Gloss installation.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: "v2", title: "Defender — Ultra Stealth Wrap", description: "Matte transformation on a Land Rover Defender.", url: "https://www.youtube.com/embed/jNQXAC9IVRw" },
    { id: "v3", title: "Studio Tour 2025", description: "Inside India's most precise PPF detailing studio.", url: "https://www.youtube.com/embed/aqz-KE-bpKQ" },
  ],
  customers: [
    {
      _id: "6a1de410d38cf55b7475ea66",
      customerName: "Kunal Sharma",
      vehicleModel: "Mahindra XUV 700",
      vehicleNo: "MP09-AB-1234",
      contactNo: "9876543210", 
      email: "kunal@example.com", 
      warrantyYears: "8 years",
      serviceDate: "2025-02-14", 
      kmDriven: "12,400 km", 
      serviceType: "Full Body — Premium Gloss",
      workPhotos: [],
    },
  ],
  faqs: [
    { id: "f1", q: "How long does PPF last?", a: "Depending on the tier, our films carry a 5 to 10-year warranty. With proper maintenance, expect peak performance for the full warranty period — no yellowing, cracking or delamination." },
    { id: "f2", q: "Is it safe for original paint?", a: "Absolutely. PPF is a sacrificial layer that bonds non-permanently to your factory clearcoat. It can be removed cleanly at any time, leaving your OEM paint untouched and pristine." },
    { id: "f3", q: "How to maintain the gloss?", a: "Use pH-neutral car shampoo, a microfiber mitt and avoid automated brush washes. We recommend a ceramic top-up every 12 months — included free with every Premium and Ultra installation." },
    { id: "f4", q: "What does the warranty cover?", a: "Yellowing, cracking, peeling, blistering and delamination caused by manufacturing defects. Stone chips and accidental damage are not covered, but the film itself absorbs them — that's the point." },
  ],
  studio: {
    address: "PAINT SHIELD Studio, MP Nagar Zone-II, Bhopal — 462011",
    hours: "Mon – Sat • 10:00 AM – 8:00 PM",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    email: "studio@paintshield.com",
    instagram: "https://instagram.com/paintshield",
    facebook: "https://facebook.com/paintshield",
    youtube: "https://youtube.com/@paintshield",
    about:
      "PAINT SHIELD was founded on a simple obsession: paint deserves better. Every installation happens inside our dust-controlled, climate-stabilised bay, hand-finished by certified specialists with over a decade behind the squeegee. We don't wrap cars. We preserve them.",
  },
};

function read(): State {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed)); // Deep copy prevent references
    }
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      products: parsed.products ?? seed.products,
      vlogs: parsed.vlogs ?? seed.vlogs,
      customers: parsed.customers ?? seed.customers,
      faqs: parsed.faqs ?? seed.faqs,
      studio: { ...seed.studio, ...(parsed.studio ?? {}) },
    };
  } catch {
    return JSON.parse(JSON.stringify(seed));
  }
}

function write(s: State) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("ppf-store-update"));
}

export function useStore() {
  const [state, setState] = useState<State>(seed);

  useEffect(() => {
    setState(read());
    const sync = () => setState(read());
    window.addEventListener("ppf-store-update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ppf-store-update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = (fn: (s: State) => State) => {
    // Read fresh and deep clone to completely bypass reactivity mutations
    const freshState = JSON.parse(JSON.stringify(read())) as State;
    const next = fn(freshState);
    write(next);
    setState(next);
  };

  return { state, update };
}

export const id = () => Math.random().toString(36).slice(2, 10);