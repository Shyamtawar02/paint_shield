'use client';

import { useState } from "react";
import { ShieldCheck, Download, Phone, Mail, Calendar, Car, KeyRound } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useStore, type Customer } from "@/lib/store";

export default function WarrantyPage() {
  const { state } = useStore();
  const [customer, setCustomer] = useState<Customer | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {customer ? (
          <WarrantyView customer={customer} onLogout={() => setCustomer(null)} />
        ) : (
          <LoginCard
            customers={state.customers || []}
            onLogin={(c) => setCustomer(c)}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function LoginCard({ customers, onLogin }: { customers: Customer[]; onLogin: (c: Customer) => void }) {
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [err, setErr] = useState("");

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-luxe">
        <div className="h-12 w-12 rounded-full bg-gradient-gold grid place-items-center mb-6 shadow-gold">
          <KeyRound className="h-5 w-5 text-ink" />
        </div>
        <h1 className="font-display text-3xl">Warranty Portal</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Demo: <span className="text-gold">9876543210</span> / <span className="text-gold">MP09-AB-1234</span>
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const found = customers.find(
              (c) =>
                c.contact.replace(/\D/g, "") === phone.replace(/\D/g, "") &&
                c.vehicleNo.toLowerCase() === vehicle.trim().toLowerCase(),
            );
            if (found) onLogin(found);
            else setErr("No matching record. Check your details or contact studio.");
          }}
        >
          <label className="block">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Phone Number</span>
            <input
              className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Vehicle No.</span>
            <input
              className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
              placeholder="MP09-AB-1234"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              required
            />
          </label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button className="w-full rounded-full bg-foreground text-background py-3 text-sm font-medium hover:bg-gold hover:text-ink transition-colors">
            Access My Warranty
          </button>
        </form>
      </div>
    </section>
  );
}

function WarrantyView({ customer, onLogout }: { customer: Customer; onLogout: () => void }) {
  const start = new Date(customer.serviceDate);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + customer.warranty);
  const now = new Date();
  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = Math.max(0, Math.min(totalMs, now.getTime() - start.getTime()));
  const remainingPct = Math.max(0, Math.min(100, ((totalMs - elapsedMs) / totalMs) * 100));
  const yearsLeft = ((totalMs - elapsedMs) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  const downloadCert = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>PAINT SHIELD Warranty - ${customer.name}</title>
    <style>body{font-family:Georgia,serif;padding:60px;color:#1a1a1a;background:#fff}
    h1{font-size:42px;margin:0;letter-spacing:-1px}.gold{color:#b8860b}
    .card{border:2px solid #d4af37;padding:40px;border-radius:12px;max-width:640px;margin:auto}
    .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee}
    </style></head><body><div class="card">
    <p style="letter-spacing:6px;font-size:11px" class="gold">PAINT SHIELD</p>
    <h1>Digital <span class="gold">Warranty</span></h1>
    <p>Certificate of Authenticity</p>
    <div style="margin-top:30px">
    <div class="row"><span>Customer</span><b>${customer.name}</b></div>
    <div class="row"><span>Vehicle</span><b>${customer.vehicleModel}</b></div>
    <div class="row"><span>Vehicle No.</span><b>${customer.vehicleNo}</b></div>
    <div class="row"><span>Service Date</span><b>${customer.serviceDate}</b></div>
    <div class="row"><span>Warranty</span><b class="gold">${customer.warranty} years</b></div>
    <div class="row"><span>Service</span><b>${customer.serviceType}</b></div>
    </div></div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurum-warranty-${customer.vehicleNo}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Verified Owner</p>
          <h1 className="font-display text-4xl">Welcome, {customer.name.split(" ")[0]}.</h1>
        </div>
        <button onClick={onLogout} className="text-sm text-muted-foreground hover:text-foreground">Sign out</button>
      </div>

      {/* Warranty card */}
      <div className="relative rounded-3xl border-2 border-gold bg-card p-8 md:p-10 shadow-luxe overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-gold opacity-20 blur-3xl" />
        <div className="relative flex items-start justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Aurum • Digital Warranty</p>
            <h2 className="font-display text-3xl mt-2">{customer.name}</h2>
          </div>
          <ShieldCheck className="h-10 w-10 text-gold" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <Detail icon={Car} label="Vehicle" value={`${customer.vehicleModel} • ${customer.vehicleNo}`} />
          <Detail icon={Calendar} label="Service Date" value={new Date(customer.serviceDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
          <Detail icon={Phone} label="Contact" value={customer.contact} />
          <Detail icon={Mail} label="Email" value={customer.email || "—"} />
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Years of Protection</p>
            <p className="font-display text-3xl">
              <span className="text-gradient-gold">{yearsLeft}</span>
              <span className="text-sm text-muted-foreground"> / {customer.warranty} yrs left</span>
            </p>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-gold transition-all duration-1000"
              style={{ width: `${remainingPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Coverage active until {end.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <button
          onClick={downloadCert}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-gold hover:text-ink transition-colors"
        >
          <Download className="h-4 w-4" /> Download Digital Certificate
        </button>
      </div>

      {/* Work Gallery */}
      <div className="mt-12">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Work Gallery</p>
        <h3 className="font-display text-3xl mb-6">Your installation, documented.</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => {
            const photo = customer.photos?.[i];
            return (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border bg-secondary/40">
                {photo ? (
                  <img src={photo} alt={`Work ${i + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">
                    Photo {i + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Detail({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center shrink-0">
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}