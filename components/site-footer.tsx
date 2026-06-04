'use client';

import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useStore } from "@/lib/store";

// Agar logo image public/assets/ ya public/ mein daali hai toh direct string path de sakte hain
const logo = "/assets/paint-shield-logo.jpeg";

export function SiteFooter() {
  const { state } = useStore();
  const s = state.studio;

  // Icons ko seedhe SVG inline functions bana diya taaki lucide ka error hamesha ke liye khatam ho jaye
  const socialIcons = [
    {
      // href: s.instagram,
      component: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
      )
    },
    {
      // href: s.facebook,
      component: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
      )
    },
    {
      // href: s.youtube,
      component: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" /><polygon points="10 15 15 12 10 9 10 15" /></svg>
      )
    },
    {
      href: `mailto:${s.email}`,
      component: <Mail className="h-4 w-4" />
    }
  ];

  return (
    <footer className="bg-secondary/40 border-t border-border mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Paint Shield" className="h-11 w-11 object-contain" onError={(e) => {
              // Agar logo image nahi milti toh alt text or fallback standard box crash nahi hone dega
              (e.target as HTMLElement).style.display = 'none';
            }} />
            <h3 className="font-display text-lg tracking-[0.22em] uppercase">Paint<span className="ml-1 text-gold">Shield</span></h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Premium Paint Protection Film, Ceramic Coating & Window Tint solutions engineered to preserve your vehicle's showroom finish.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socialIcons.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Social"
                className="h-10 w-10 grid place-items-center rounded-full border border-border text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-all duration-300"
              >
                {item.component}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Support Hours</p>
          {/* <div className="mt-4 text-sm leading-relaxed flex gap-2">
            <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
            <span>{s.address}</span>
          </div> */}
          <div className="mt-3 text-sm flex gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-gold mt-0.5 shrink-0" />
            <span>{s.hours}</span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>✓ Appointment Booking Assistance</p>
            <p>✓ Warranty & Aftercare Support</p>
            <p>✓ Product Consultation Available</p>
          </div>
        </div>

        <div>
  <p className="text-xs uppercase tracking-[0.25em] text-gold">
    Reach Us
  </p>

  <div className="mt-4">
    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
      Phone
    </p>

    <div className="text-sm flex gap-2 items-center">
      <Phone className="h-4 w-4 text-gold shrink-0" />
      <a
        href={`tel:${s.phone}`}
        className="hover:text-gold transition"
      >
        {s.phone}
      </a>
    </div>
  </div>

  <div className="mt-4">
    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
      Email
    </p>

    <div className="text-sm flex gap-2 items-center">
      <Mail className="h-4 w-4 text-gold shrink-0" />
      <a
        href={`mailto:${s.email}`}
        className="hover:text-gold transition"
      >
        {s.email}
      </a>
    </div>
  </div>
</div>

        {/* <div className="rounded-xl overflow-hidden border border-border bg-background h-44 shadow-soft">
          <iframe
            title="Studio Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.39%2C23.23%2C77.45%2C23.27&layer=mapnik"
            className="w-full h-full"
            loading="lazy"
          />
        </div> */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            Warranty & Support
          </p>

          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-gold">✓</span>
              <span>Up to 15-Year Warranty Coverage</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-gold">✓</span>
              <span>Professional Installation Guarantee</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-gold">✓</span>
              <span>Self-Healing & UV Protection Technology</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-gold">✓</span>
              <span>Dedicated Aftercare & Customer Support</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hairline">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p className="text-muted-foreground text-sm">
  © 2026 Paint Shield India. All rights reserved.
</p>
          <p className="tracking-[0.15em]">
            Crafted with precision · Developed by{" "}
            <span className="text-gold font-medium">Shyam</span>
          </p>
        </div>
      </div>
    </footer>
  );
}