
// Lightweight client-side store with localStorage persistence.
import { useEffect, useState } from "react";

export type ProductVariant = {
  id: string;
  typeName: string;
  name: string;
  microns: string;
  warranty: string;
  material: string;
  glossLevel: string;
  heatResistance: string;
  selfHealing: string;
  details: string;
  detailedInfo: string;
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

export type Customer = {
  id?: string;
  _id?: string;
  customerName: string;
  vehicleModel: string;
  vehicleNo: string;
  contactNo: string;
  email: string;
  warrantyYears: string;
  serviceDate: string;
  kmDriven: string;
  serviceType: string;
  workPhotos: string[];
};

export type Faq = {
  id: string;
  q: string;
  a: string;
};

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

const KEY = "ppf-store-v3";

type State = {
  products: Product[];
  vlogs: Vlog[];
  customers: Customer[];
  faqs: Faq[];
  studio: Studio;
};

const seed: State = {
  products: [],
  vlogs: [],
  customers: [],
  faqs: [],
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

// Remove large photo data from localStorage.
// Original photos remain in MongoDB and in current application state.
function getPersistableState(s: State): State {
  return {
    ...s,
    customers: s.customers.map((customer) => ({
      ...customer,
      workPhotos: [],
    })),
  };
}

function read(): State {
  if (typeof window === "undefined") return seed;

  try {
    const raw = localStorage.getItem(KEY);

    if (!raw) {
      return JSON.parse(JSON.stringify(seed));
    }

    const parsed = JSON.parse(raw) as Partial<State>;

    return {
      products: parsed.products ?? seed.products,
      vlogs: parsed.vlogs ?? seed.vlogs,

      // Photos are fetched from MongoDB, not localStorage.
      customers: (parsed.customers ?? seed.customers).map((customer) => ({
        ...customer,
        workPhotos: [],
      })),

      faqs: parsed.faqs ?? seed.faqs,
      studio: {
        ...seed.studio,
        ...(parsed.studio ?? {}),
      },
    };
  } catch (error) {
    console.error("STORE READ ERROR:", error);
    return JSON.parse(JSON.stringify(seed));
  }
}

function write(s: State) {
  if (typeof window === "undefined") return;

  try {
    const persistableState = getPersistableState(s);

    localStorage.setItem(
      KEY,
      JSON.stringify(persistableState)
    );
  } catch (error) {
    console.error("STORE STORAGE ERROR:", error);

    // Clear only the local cache and retry.
    // MongoDB data is not affected.
    try {
      localStorage.removeItem(KEY);

      localStorage.setItem(
        KEY,
        JSON.stringify(getPersistableState(s))
      );
    } catch (retryError) {
      console.error("STORE RETRY FAILED:", retryError);
    }
  }

  // Send full in-memory state to other components
  // without storing large photos in localStorage.
  window.dispatchEvent(
    new CustomEvent("ppf-store-update", {
      detail: s,
    })
  );
}

export function useStore() {
  const [state, setState] = useState<State>(seed);

  useEffect(() => {
    setState(read());

    const sync = (event?: Event) => {
      const customEvent = event as CustomEvent<State> | undefined;

      if (customEvent?.detail) {
        setState(customEvent.detail);
      } else {
        setState(read());
      }
    };

    window.addEventListener("ppf-store-update", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("ppf-store-update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = (fn: (s: State) => State) => {
    // Always work with the latest in-memory state.
    const freshState = JSON.parse(
      JSON.stringify(state)
    ) as State;

    const next = fn(freshState);

    write(next);
    setState(next);
  };

  return { state, update };
}

export const id = () =>
  Math.random().toString(36).slice(2, 10);
