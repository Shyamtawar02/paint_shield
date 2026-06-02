'use client';

import { useState, useEffect } from "react";
import { 
  ShieldCheck, Download, Phone, Mail, Calendar, Car, KeyRound, 
  SprayCan, Sun, FlaskConical, CheckCircle2 
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { type Customer } from "@/lib/store";

// Global style classes
const btnGold = "inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-3 text-sm font-medium hover:bg-gold hover:text-ink transition-colors";
const inputCls = "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition";

export default function WarrantyPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial State ko localStorage se check karwaya taaki refresh survival ho sake
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("ggf_customer_session");
    if (saved) {
      try {
        setCustomer(JSON.parse(saved));
      } catch (e) {
        console.error("Session parse error", e);
      }
    }
  }, []);

  // 2. Persistent Login Handler
  const handleLogin = (customerData: Customer) => {
    localStorage.setItem("ggf_customer_session", JSON.stringify(customerData));
    setCustomer(customerData);
  };

  // 3. Persistent Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("ggf_customer_session");
    setCustomer(null);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <div className="flex-1" />
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-gold/30 selection:text-white">
      <SiteHeader />
      <main className="flex-1">
        {customer ? (
          <WarrantyView customer={customer} onLogout={handleLogout} />
        ) : (
          <LoginCard onLogin={handleLogin} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function LoginCard({ onLogin }: { onLogin: (c: Customer) => void }) {
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <section className="mx-auto max-w-md px-6 py-24 animate-fade-in">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-luxe">
        <div className="h-12 w-12 rounded-full bg-gradient-gold grid place-items-center mb-6 shadow-gold">
          <KeyRound className="h-5 w-5 text-ink" />
        </div>
        <h1 className="font-display text-3xl">Warranty Portal</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter details to verify your live digital certificate.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr("");
            setLoading(true);

            try {
              const res = await fetch("/api/warranty", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone, vehicleNo: vehicle }),
              });

              const data = await res.json();

              if (!res.ok) {
                setErr(data.error || "No matching record. Check your details or contact studio.");
              } else {
                onLogin(data);
              }
            } catch (error) {
              console.error("Search Error:", error);
              setErr("Server connectivity issue. Try again later.");
            }
          }}
        >
          <label className="block">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Phone Number</span>
            <input
              type="text"
              className={inputCls}
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Vehicle No.</span>
            <input
              type="text"
              className={inputCls}
              placeholder="MP09-AB-1234"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          {err && <p className="text-sm text-destructive font-medium">{err}</p>}
          <button 
            type="submit" 
            disabled={loading} 
            className={`${btnGold} w-full disabled:opacity-50`}
          >
            {loading ? "Verifying..." : "Access My Warranty"}
          </button>
        </form>
      </div>
    </section>
  );
}

function WarrantyView({ customer, onLogout }: { customer: Customer; onLogout: () => void }) {
  const start = new Date(customer.serviceDate || new Date());
  const warrantyNum = parseInt(String(customer.warrantyYears || "5").replace(/\D/g, "")) || 5;
  
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + warrantyNum);
  const now = new Date();
  
  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = Math.max(0, Math.min(totalMs, now.getTime() - start.getTime()));
  const remainingPct = Math.max(0, Math.min(100, ((totalMs - elapsedMs) / totalMs) * 100));
  const yearsLeft = ((totalMs - elapsedMs) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  const serviceYear = start.getFullYear() || new Date().getFullYear();
  const serialSeed = (customer.id || customer._id || customer.vehicleNo || "0001").replace(/\D/g, "").slice(-4).padStart(4, "0") || "0001";
  
  // Certificate number Prefix changed to PS (Paint Shield)
  const certificateNo = `PS-${serviceYear}-${serialSeed}`;
  const serviceDateFmt = start.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const endDateFmt = end.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const issuedFmt = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const downloadCert = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Paint Shield — Warranty Certificate ${certificateNo}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Times New Roman', Georgia, serif; color: #1a1a1a; background: #fff; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .sheet { width: 210mm; min-height: 297mm; padding: 14mm; margin: 0 auto; background:#fff; }
  .frame { border: 2px solid #b8860b; padding: 10mm; position: relative; min-height: 268mm; }
  .frame::before { content:""; position:absolute; inset:4px; border:1px solid #e6c764; pointer-events:none; }
  .gold { color: #b8860b; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #d4af37; padding-bottom: 14px; gap: 24px; }
  .brand-eyebrow { font-size: 9px; letter-spacing: 6px; color:#b8860b; margin:0 0 6px; text-transform: uppercase; }
  .brand-name { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; margin: 0 0 8px; letter-spacing: 1px; }
  .title { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin: 6px 0 0; letter-spacing: 3px; text-transform: uppercase; }
  .studio { font-size: 11px; line-height: 1.55; text-align: right; min-width: 220px; }
  .studio b { color:#b8860b; letter-spacing: 1px; font-size: 10px; text-transform: uppercase; display:block; margin-bottom:4px; }
  .meta { display:flex; justify-content:space-between; align-items:center; background:#fbf6e7; border:1px solid #e6c764; padding:8px 14px; margin: 14px 0 18px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
  .meta b { color:#b8860b; }
  .section-label { font-size: 9px; letter-spacing: 4px; color:#b8860b; text-transform: uppercase; margin: 14px 0 6px; border-bottom:1px solid #eadfbb; padding-bottom: 4px; }
  table.details { width:100%; border-collapse: collapse; font-size: 12px; }
  table.details td { padding: 7px 4px; border-bottom: 1px dotted #d8c98a; vertical-align: top; }
  table.details td.k { color:#666; width: 30%; text-transform: uppercase; letter-spacing: 1px; font-size: 10px; }
  table.details td.v { font-weight: bold; }
  .coverage { display:flex; justify-content:space-between; align-items:center; margin-top: 8px; padding: 10px 14px; background:#fbf6e7; border:1px solid #e6c764; }
  .coverage .yrs { font-family:'Playfair Display', Georgia, serif; font-size: 22px; color:#b8860b; }
  .terms { margin-top: 18px; border:1px solid #d4af37; padding: 12px 14px; background: #fffdf6; }
  .terms h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 10px; color:#1a1a1a; border-bottom: 1px solid #e6c764; padding-bottom: 6px; text-align:center; }
  .terms-grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .term { font-size: 10.5px; line-height: 1.5; }
  .term .num { font-family:'Playfair Display', Georgia, serif; font-size: 16px; color:#b8860b; }
  .term b { display:block; margin: 2px 0 4px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
  .footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top: 22px; padding-top: 14px; border-top: 1px solid #d4af37; font-size: 10px; color:#555; }
  .sign { text-align:right; }
  .sign .line { width: 220px; border-bottom: 1px solid #b8860b; height: 28px; margin-left:auto; }
  .sign .role { margin-top: 4px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color:#1a1a1a; }
  .seal { position:absolute; bottom: 26mm; left: 18mm; width: 90px; height: 90px; border:2px solid #b8860b; border-radius:50%; display:flex; align-items:center; justify-content:center; text-align:center; font-size:9px; letter-spacing:2px; color:#b8860b; text-transform:uppercase; opacity:0.85; transform: rotate(-8deg); font-family:'Playfair Display', Georgia, serif; line-height:1.2; }
  @media print { body { background:#fff; } .noprint { display:none; } }
</style></head><body>
<div class="sheet"><div class="frame">
  <div class="header">
    <div>
      <p class="brand-eyebrow">Premium Detailing Studio</p>
      <h1 class="brand-name">PAINT SHIELD</h1>
      <p class="title">Digital Warranty Certificate</p>
    </div>
    <div class="studio">
      <b>Studio Contact</b>
      Paint Shield Studio<br/>
      Contact: +91 7400829575<br/>
      Email: shyamtawar4@gmail.com<br/>
      Services: Premium PPF, Window Tint &amp; Ceramic Coatings
    </div>
  </div>

  <div class="meta">
    <span>Certificate No: <b>${certificateNo}</b></span>
    <span>Issued: <b>${issuedFmt}</b></span>
    <span>Status: <b>ACTIVE</b></span>
  </div>

  <p class="section-label">Customer &amp; Service Details</p>
  <table class="details">
    <tr><td class="k">Customer Name</td><td class="v">${customer.customerName}</td>
        <td class="k">Vehicle Model</td><td class="v">${customer.vehicleModel || "—"}</td></tr>
    <tr><td class="k">Vehicle No.</td><td class="v">${customer.vehicleNo}</td>
        <td class="k">KM at Service</td><td class="v">${customer.kmDriven || "—"}</td></tr>
    <tr><td class="k">Contact</td><td class="v">${customer.contactNo}</td>
        <td class="k">Email</td><td class="v">${customer.email || "—"}</td></tr>
    <tr><td class="k">Service Type</td><td class="v">${customer.serviceType}</td>
        <td class="k">Service Date</td><td class="v">${serviceDateFmt}</td></tr>
    <tr><td class="k">Warranty Period</td><td class="v gold">${warrantyNum} Years</td>
        <td class="k">Valid Until</td><td class="v">${endDateFmt}</td></tr>
  </table>

  <div class="coverage">
    <div><b>Coverage Remaining</b><br/><span style="font-size:10px;color:#666;">Years of Protection Left</span></div>
    <div class="yrs">${yearsLeft} / ${warrantyNum} yrs</div>
  </div>

  <div class="terms">
    <h3>Official Maintenance Terms &amp; Pro-Care Guidelines</h3>
    <div class="terms-grid">
      <div class="term"><span class="num">1.</span><b>How to Wash</b>Wait 7 days post-install. Use pH-neutral shampoo, two-bucket method, and a plush microfiber mitt. Avoid pressure washers within 6 inches of edges.</div>
      <div class="term"><span class="num">2.</span><b>Sun Protection</b>Park under shade when possible. While UV exposure is harmless to the film, a monthly rinse keeps optics pristine and prevents contamination bonding.</div>
      <div class="term"><span class="num">3.</span><b>Chemical Safety</b>Strictly avoid alkaline degreasers, automatic brush washes, and abrasive polishes. Wipe bird droppings or tree sap within 48 hours using a damp microfiber.</div>
    </div>
    <p style="margin:10px 0 0;font-size:9.5px;color:#777;text-align:center;letter-spacing:1px;text-transform:uppercase;">Failure to follow these guidelines may void warranty coverage.</p>
  </div>

  <div class="seal">Paint<br/>Shield<br/>Verified</div>

  <div class="footer">
    <div>This certificate is digitally issued and verifiable at the Paint Shield Warranty Portal.<br/>Certificate ID: ${certificateNo}</div>
    <div class="sign">
      <div class="line"></div>
      <div class="role">Authorized Signatory — Paint Shield</div>
    </div>
  </div>
</div></div>
<script>setTimeout(function(){window.print();},400);</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); return; }
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paintshield-warranty-${customer.vehicleNo}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const careGuidelines = [
    { Icon: SprayCan, title: "How to Wash", text: "Wait 7 days post-install. Use pH-neutral shampoo, two-bucket method, plush microfiber mitt. Avoid pressure washers within 6 inches of edges." },
    { Icon: Sun, title: "Sun Protection", text: "Park under shade when possible. UV exposure is harmless to the film, but accelerates contamination bonding. A monthly rinse keeps optics pristine." },
    { Icon: FlaskConical, title: "Chemical Safety", text: "Skip alkaline degreasers, automatic brush washes, and abrasive polishes. Bird droppings and tree sap should be wiped within 48 hours with a damp microfiber." },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Verified Owner</p>
          <h1 className="font-display text-4xl">Welcome, {customer.customerName ? customer.customerName.split(" ")[0] : "Customer"}.</h1>
        </div>
        <button onClick={onLogout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign out</button>
      </div>

      {/* Warranty card */}
      <div className="relative rounded-3xl border-2 border-gold bg-card p-8 md:p-10 shadow-luxe overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-gold opacity-20 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-wrap items-start justify-between gap-6 border-b border-gold/40 pb-6 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Premium Detailing Studio</p>
            <h2 className="font-display text-3xl md:text-4xl mt-2 tracking-wide">PAINT SHIELD</h2>
            <p className="mt-2 font-display text-base uppercase tracking-[0.25em] text-foreground/90">
              Digital Warranty Certificate
            </p>
          </div>
          <div className="md:text-right text-sm leading-relaxed shrink-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">Studio Contact</p>
            <p className="font-medium">Paint Shield Studio</p>
            <p className="text-muted-foreground text-xs">Contact: +91 7400829575</p>
            <p className="text-muted-foreground text-xs">Email: shyamtawar4@gmail.com</p>
          </div>
        </div>

        {/* Certificate Metadata strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gold/50 bg-gold/5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] mb-8">
          <span>Certificate No: <span className="text-gold font-semibold">{certificateNo}</span></span>
          <span>Issued: <span className="text-foreground font-semibold">{issuedFmt}</span></span>
          <span className="flex items-center gap-1.5 text-gold"><ShieldCheck className="h-3.5 w-3.5" /> Status: Active</span>
        </div>

        {/* Modified Layout Container for Details */}
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 mb-10 border-b border-gold/20 pb-8">
          <Detail icon={Car} label="Vehicle" value={`${customer.vehicleModel || "—"} • ${customer.vehicleNo}`} />
          <Detail icon={Calendar} label="Service Date" value={serviceDateFmt} />
          <Detail icon={Phone} label="Contact" value={customer.contactNo} />
          <Detail icon={Mail} label="Email" value={customer.email || "—"} />
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Years of Protection</p>
            <p className="font-display text-3xl">
              <span className="text-gradient-gold">{yearsLeft}</span>
              <span className="text-sm text-muted-foreground"> / {warrantyNum} yrs left</span>
            </p>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-gold transition-all duration-1000"
              style={{ width: `${remainingPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Coverage active until {endDateFmt}
          </p>
        </div>

        {/* Official Maintenance Terms inside certificate area */}
        <div className="mt-10 rounded-xl border border-gold/50 bg-background/60 p-6">
          <p className="text-center font-display text-base tracking-[0.3em] uppercase border-b border-gold/40 pb-3 mb-5">
            Official Maintenance Terms & Pro-Care Guidelines
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { n: "1.", t: "How to Wash", d: "Wait 7 days post-install. Use pH-neutral shampoo, two-bucket method, and a plush microfiber mitt. Avoid pressure washers within 6 inches of edges." },
              { n: "2.", t: "Sun Protection", d: "Park under shade when possible. While UV exposure is harmless to the film, a monthly rinse keeps optics pristine and prevents contamination bonding." },
              { n: "3.", t: "Chemical Safety", d: "Strictly avoid alkaline degreasers, automatic brush washes, and abrasive polishes. Wipe bird droppings or tree sap within 48 hours using a damp microfiber." },
            ].map((r) => (
              <div key={r.t} className="text-sm">
                <span className="font-display text-2xl text-gold">{r.n}</span>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] font-semibold">{r.t}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{r.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Failure to follow these guidelines may void warranty coverage.
          </p>
        </div>

        {/* Sign-off */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-gold/40 pt-5 text-xs text-muted-foreground">
          <p className="max-w-sm">This certificate is digitally issued and verifiable at the Paint Shield Warranty Portal. Certificate ID: <span className="text-gold font-semibold">{certificateNo}</span></p>
          <div className="text-right">
            <div className="w-56 h-8 border-b border-gold ml-auto" />
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-foreground">Authorized Signatory — Paint Shield</p>
          </div>
        </div>

        <button
          onClick={downloadCert}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-gold hover:text-ink transition-colors"
        >
          <Download className="h-4 w-4" /> Download / Print A4 Certificate
        </button>
      </div>

      {/* Work Gallery */}
      <div className="mt-12">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Work Gallery</p>
        <h3 className="font-display text-3xl mb-6">Your installation, documented.</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => {
            const photo = customer.workPhotos?.[i];
            return (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border bg-secondary/40 relative">
                {photo ? (
                  <img 
                    src={photo} 
                    alt={`Work ${i + 1}`} 
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
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

      {/* Terms & Maintenance Guidelines */}
      <div className="mt-12 rounded-3xl border border-border bg-card p-8 md:p-10 shadow-soft">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Terms &amp; Maintenance Guidelines</p>
            <h3 className="font-display text-3xl">Keep your warranty active.</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Follow these three foundational care pillars to preserve your finish and maintain warranty coverage.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
            <ShieldCheck className="h-4 w-4" /> Required
          </div>
        </div>

        <ul className="space-y-4">
          {careGuidelines.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4 rounded-xl border border-border bg-background/60 p-5 hover:border-gold/60 transition-colors">
              <div className="h-11 w-11 rounded-full bg-gradient-gold grid place-items-center shrink-0">
                <Icon className="h-5 w-5 text-ink" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-lg">{title}</h4>
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

{/* Cleaned & Updated Detail Component to match Lovable UI */}
function Detail({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-1.5">
      <div className="h-10 w-10 rounded-full bg-secondary/60 grid place-items-center text-gold shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5 text-foreground">{value}</p>
      </div>
    </div>
  );
}