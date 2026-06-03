// Lightweight client-side store with localStorage persistence + seeded demo data.
import { useEffect, useState } from "react";

export type ProductVariant = {
  id: string;
  typeName: string;
  name:string,
  microns: string;
  warranty: string;
  material: string;
  glossLevel: string;
  heatResistance: string;
  selfHealing: string;
  details: string;
  detailedInfo:string
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
  ],
  vlogs: [
    ],
  customers: [
  ],
  faqs: [
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