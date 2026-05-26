// Bhai, top par "use client" zaroor lagana kyunki isme useState aur useEffect use ho rahe hain
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Lock, Plus, Trash2, Pencil, Search, X, Upload, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useStore, id, type Customer, type Product, type ProductVariant, type Vlog, type Faq, type Studio } from "@/lib/store";

const ADMIN_KEY = "ppf-admin-auth";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(ADMIN_KEY) === "1");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {authed ? (
          <Dashboard onLogout={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); }} />
        ) : (
          <LoginCard onSuccess={() => { sessionStorage.setItem(ADMIN_KEY, "1"); setAuthed(true); }} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-luxe">
        <div className="h-12 w-12 rounded-full bg-gradient-gold grid place-items-center mb-6 shadow-gold">
          <Lock className="h-5 w-5 text-ink" />
        </div>
        <h1 className="font-display text-3xl">Admin Access</h1>
        <p className="text-sm text-muted-foreground mt-1">Demo credentials: <span className="text-gold">admin / aurum</span></p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (u === "admin" && p === "aurum") onSuccess();
            else setErr("Invalid credentials");
          }}
        >
          <Field label="Username">
            <input className={inputCls} value={u} onChange={(e) => setU(e.target.value)} required />
          </Field>
          <Field label="Password">
            <input type="password" className={inputCls} value={p} onChange={(e) => setP(e.target.value)} required />
          </Field>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button className="w-full rounded-full bg-foreground text-background py-3 text-sm font-medium hover:bg-gold hover:text-ink transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"customers" | "products" | "vlogs" | "faq" | "studio">("customers");

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Studio Console</p>
          <h1 className="font-display text-4xl">Dashboard</h1>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {(["customers", "products", "vlogs", "faq", "studio"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "customers" && <CustomersPanel />}
      {tab === "products" && <ProductsPanel />}
      {tab === "vlogs" && <VlogsPanel />}
      {tab === "faq" && <FaqPanel />}
      {tab === "studio" && <StudioPanel />}
    </section>
  );
}

/* --------- CUSTOMERS PANEL --------- */

const emptyCustomer: Omit<Customer, "id"> = {
  name: "", vehicleModel: "", vehicleNo: "", contact: "", email: "",
  warranty: 5, serviceDate: new Date().toISOString().slice(0, 10),
  kmDriven: "", serviceType: "", photos: [],
};

function CustomersPanel() {
  const { state, update } = useStore();
  const [editing, setEditing] = useState<Customer | null>(null);
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");

  const filtered = state.customers.filter((c) =>
    [c.name, c.vehicleNo, c.vehicleModel, c.contact].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by name, vehicle no…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`${inputCls} pl-10`}
          />
        </div>
        <button onClick={() => setAdding(true)} className={btnGold}>
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Vehicle</th>
              <th className="text-left p-4">Contact</th>
              <th className="text-left p-4">Warranty</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No customers found.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-4">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </td>
                <td className="p-4">
                  <p>{c.vehicleModel}</p>
                  <p className="text-xs text-muted-foreground">{c.vehicleNo}</p>
                </td>
                <td className="p-4">{c.contact}</td>
                <td className="p-4"><span className="text-gold font-medium">{c.warranty} yrs</span></td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => setEditing(c)} className="h-9 w-9 grid place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                    <button
                      onClick={() => { 
                        if (confirm(`Delete ${c.name}?`)) {
                          update((s) => {
                            s.customers = s.customers.filter((x) => x.id !== c.id);
                            return s;
                          });
                        } 
                      }}
                      className="h-9 w-9 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <CustomerModal
          initial={editing ?? { id: "", ...emptyCustomer }}
          isNew={!editing}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={(c) => {
            update((s) => {
              if (editing) {
                s.customers = s.customers.map((x) => (x.id === editing.id ? c : x));
              } else {
                s.customers.push({ ...c, id: id() });
              }
              return s;
            });
            setAdding(false); setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function CustomerModal({
  initial, isNew, onClose, onSave,
}: { initial: Customer; isNew: boolean; onClose: () => void; onSave: (c: Customer) => void }) {
  const [c, setC] = useState<Customer>(initial);

  const set = <K extends keyof Customer>(k: K, v: Customer[K]) => setC((p) => ({ ...p, [k]: v }));

  const onPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4);
    Promise.all(
      files.map(
        (f) =>
          new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.readAsDataURL(f);
          }),
      ),
    ).then((urls) => set("photos", urls));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border shadow-luxe w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-display text-2xl">{isNew ? "Add" : "Edit"} Customer</h3>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); onSave(c); }}
          className="p-6 grid gap-4 sm:grid-cols-2"
        >
          <Field label="Customer Name"><input className={inputCls} value={c.name} required onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Email"><input type="email" className={inputCls} value={c.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Vehicle Model"><input className={inputCls} placeholder="e.g. XUV 700" value={c.vehicleModel} required onChange={(e) => set("vehicleModel", e.target.value)} /></Field>
          <Field label="Vehicle No."><input className={inputCls} placeholder="MP09-AB-1234" value={c.vehicleNo} required onChange={(e) => set("vehicleNo", e.target.value)} /></Field>
          <Field label="Contact No."><input className={inputCls} value={c.contact} required onChange={(e) => set("contact", e.target.value)} /></Field>
          <Field label="Warranty (years)">
            <select className={inputCls} value={c.warranty} onChange={(e) => set("warranty", Number(e.target.value))}>
              {[5, 8, 10].map((y) => <option key={y} value={y}>{y} years</option>)}
            </select>
          </Field>
          <Field label="Service Date"><input type="date" className={inputCls} value={c.serviceDate} onChange={(e) => set("serviceDate", e.target.value)} /></Field>
          <Field label="KM Driven"><input className={inputCls} value={c.kmDriven} onChange={(e) => set("kmDriven", e.target.value)} /></Field>
          <Field label="Service Type" full><input className={inputCls} placeholder="Full Body — Premium Gloss" value={c.serviceType} onChange={(e) => set("serviceType", e.target.value)} /></Field>

          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Work Photos (up to 4)</p>
            <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-border rounded-md cursor-pointer hover:border-gold transition-colors text-sm">
              <Upload className="h-4 w-4" />
              <span>{c.photos.length ? `${c.photos.length} photo(s) selected` : "Upload images"}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={onPhotos} />
            </label>
            {c.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {c.photos.map((p, i) => <img key={i} src={p} alt="" className="aspect-square object-cover rounded-md" />)}
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-secondary">Cancel</button>
            <button className={btnGold}>{isNew ? "Create" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --------- PRODUCTS PANEL --------- */

const emptyProduct: Omit<Product, "id"> = {
  name: "", tagline: "", variants: [],
};

const emptyVariant: Omit<ProductVariant, "id"> = {
  typeName: "", microns: "", warranty: "",
  material: "Aliphatic TPU", glossLevel: "", heatResistance: "",
  selfHealing: "", details: "",
};

function ProductsPanel() {
  const { state, update } = useStore();
  const [editingCat, setEditingCat] = useState<Product | null>(null);
  const [addingCat, setAddingCat] = useState(false);
  const [variantCtx, setVariantCtx] = useState<{ product: Product; variant: ProductVariant | null } | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Manage product categories and their variants.</p>
          <p className="text-xs text-muted-foreground mt-1">Each category can hold unlimited variants.</p>
        </div>
        <button onClick={() => setAddingCat(true)} className={btnGold}>
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="space-y-6">
        {state.products.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gold">{p.tagline}</p>
                <h3 className="font-display text-2xl mt-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{p.variants.length} variant(s)</p>
              </div>
              <div className="flex gap-1 items-center">
                <button onClick={() => setVariantCtx({ product: p, variant: null })} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Variant
                </button>
                <button onClick={() => setEditingCat(p)} className="h-9 w-9 grid place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                <button
                  onClick={() => { 
                    if (confirm(`Delete category "${p.name}"?`)) {
                      update((s) => {
                        s.products = s.products.filter((x) => x.id !== p.id);
                        return s;
                      });
                    }
                  }}
                  className="h-9 w-9 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {p.variants.length > 0 && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.variants.map((v) => (
                  <div key={v.id} className="rounded-xl border border-border bg-background p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{v.typeName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.microns} · {v.warranty}</p>
                      <p className="text-xs text-gold mt-1 truncate">{v.glossLevel}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setVariantCtx({ product: p, variant: v })} className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                      <button
                        onClick={() => {
                          if (!confirm(`Delete variant "${v.typeName}"?`)) return;
                          update((s) => {
                            s.products = s.products.map((x) => x.id === p.id ? { ...x, variants: x.variants.filter((y) => y.id !== v.id) } : x);
                            return s;
                          });
                        }}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {(addingCat || editingCat) && (
        <CategoryModal
          initial={editingCat ?? { id: "", ...emptyProduct }}
          isNew={!editingCat}
          onClose={() => { setAddingCat(false); setEditingCat(null); }}
          onSave={(pData) => {
            update((s) => {
              if (editingCat) {
                s.products = s.products.map((x) => (x.id === editingCat.id ? pData : x));
              } else {
                s.products.push({ ...pData, id: id(), variants: [] });
              }
              return s;
            });
            setAddingCat(false); setEditingCat(null);
          }}
        />
      )}

      {variantCtx && (
        <VariantModal
          product={variantCtx.product}
          initial={variantCtx.variant ?? { id: "", ...emptyVariant }}
          isNew={!variantCtx.variant}
          onClose={() => setVariantCtx(null)}
          onSave={(vData) => {
            const editing = variantCtx.variant;
            update((s) => {
              s.products = s.products.map((x) => x.id === variantCtx.product.id
                ? {
                    ...x,
                    variants: editing
                      ? x.variants.map((y) => y.id === editing.id ? vData : y)
                      : [...x.variants, { ...vData, id: id() }],
                  }
                : x);
              return s;
            });
            setVariantCtx(null);
          }}
        />
      )}
    </div>
  );
}

function CategoryModal({ initial, isNew, onClose, onSave }: { initial: Product; isNew?: boolean; onClose: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = useState(initial);
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(p); }}
        className="bg-card rounded-2xl border border-border shadow-luxe w-full max-w-lg my-8 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl">{isNew ? "Add" : "Edit"} Category</h3>
          <button type="button" onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-4">
          <Field label="Category Name" full><input className={inputCls} required placeholder="e.g. Paint Protection Film" value={p.name} onChange={(e) => setP(prev => ({ ...prev, name: e.target.value }))} /></Field>
          <Field label="Tagline" full><input className={inputCls} required placeholder="e.g. Ultimate Paint Defense" value={p.tagline} onChange={(e) => setP(prev => ({ ...prev, tagline: e.target.value }))} /></Field>
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-secondary">Cancel</button>
          <button className={btnGold}>{isNew ? "Create" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

function VariantModal({ product, initial, isNew, onClose, onSave }: { product: Product; initial: ProductVariant; isNew?: boolean; onClose: () => void; onSave: (v: ProductVariant) => void }) {
  const [v, setV] = useState(initial);
  const set = <K extends keyof ProductVariant>(k: K, val: ProductVariant[K]) => setV((x) => ({ ...x, [k]: val }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(v); }}
        className="bg-card rounded-2xl border border-border shadow-luxe w-full max-w-2xl my-8 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">{product.name}</p>
            <h3 className="font-display text-2xl mt-1">{isNew ? "Add Variant" : "Edit Variant"}</h3>
          </div>
          <button type="button" onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type Name" full><input className={inputCls} required placeholder="e.g. Ultra Stealth Matte" value={v.typeName} onChange={(e) => set("typeName", e.target.value)} /></Field>
          <Field label="Microns / Thickness"><input className={inputCls} placeholder="e.g. 210 microns" value={v.microns} onChange={(e) => set("microns", e.target.value)} /></Field>
          <Field label="Warranty"><input className={inputCls} placeholder="e.g. 10 Years" value={v.warranty} onChange={(e) => set("warranty", e.target.value)} /></Field>
          <Field label="Material"><input className={inputCls} value={v.material} onChange={(e) => set("material", e.target.value)} /></Field>
          <Field label="Gloss Level"><input className={inputCls} value={v.glossLevel} onChange={(e) => set("glossLevel", e.target.value)} /></Field>
          <Field label="Heat Resistance" full><input className={inputCls} value={v.heatResistance} onChange={(e) => set("heatResistance", e.target.value)} /></Field>
          <Field label="Self Healing" full><input className={inputCls} value={v.selfHealing} onChange={(e) => set("selfHealing", e.target.value)} /></Field>
          <Field label="Detailed Info" full>
            <textarea rows={5} className={inputCls} value={v.details} onChange={(e) => set("details", e.target.value)} />
          </Field>
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-secondary">Cancel</button>
          <button className={btnGold}>{isNew ? "Create" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

/* --------- VLOGS PANEL --------- */

function VlogsPanel() {
  const { state, update } = useStore();
  const [v, setV] = useState<Omit<Vlog, "id">>({ title: "", description: "", url: "" });

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update((s) => {
            s.vlogs.push({ ...v, id: id() });
            return s;
          });
          setV({ title: "", description: "", url: "" });
        }}
        className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4 h-fit"
      >
        <h3 className="font-display text-2xl">Add Vlog</h3>
        <Field label="Title"><input className={inputCls} value={v.title} required onChange={(e) => setV(prev => ({ ...prev, title: e.target.value }))} /></Field>
        <Field label="Description"><textarea rows={3} className={inputCls} value={v.description} onChange={(e) => setV(prev => ({ ...prev, description: e.target.value }))} /></Field>
        <Field label="Video URL (embed)"><input className={inputCls} placeholder="https://www.youtube.com/embed/…" value={v.url} required onChange={(e) => setV(prev => ({ ...prev, url: e.target.value }))} /></Field>
        <button className={btnGold}><Plus className="h-4 w-4" /> Publish</button>
      </form>

      <div className="space-y-3">
        {state.vlogs.map((vl) => (
          <div key={vl.id} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{vl.title}</p>
              <p className="text-xs text-muted-foreground truncate">{vl.url}</p>
            </div>
            <button
              onClick={() => { 
                if (confirm(`Delete vlog "${vl.title}"?`)) {
                  update((s) => {
                    s.vlogs = s.vlogs.filter((x) => x.id !== vl.id);
                    return s;
                  });
                }
              }}
              className="h-9 w-9 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------- FAQ PANEL --------- */

function FaqPanel() {
  const { state, update } = useStore();
  const [draft, setDraft] = useState<Omit<Faq, "id">>({ q: "", a: "" });

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update((s) => {
            s.faqs.push({ ...draft, id: id() });
            return s;
          });
          setDraft({ q: "", a: "" });
        }}
        className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4 h-fit"
      >
        <h3 className="font-display text-2xl">Add FAQ</h3>
        <Field label="Question"><input className={inputCls} required value={draft.q} onChange={(e) => setDraft(prev => ({ ...prev, q: e.target.value }))} /></Field>
        <Field label="Answer"><textarea rows={4} className={inputCls} required value={draft.a} onChange={(e) => setDraft(prev => ({ ...prev, a: e.target.value }))} /></Field>
        <button className={btnGold}><Plus className="h-4 w-4" /> Publish</button>
      </form>

      <div className="space-y-3">
        {state.faqs.map((f) => (
          <FaqRow key={f.id} faq={f} />
        ))}
      </div>
    </div>
  );
}

function FaqRow({ faq }: { faq: Faq }) {
  const { update } = useStore();
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState(faq);

  useEffect(() => {
    setD(faq);
  }, [faq]);

  if (edit) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update((s) => {
            s.faqs = s.faqs.map((x) => (x.id === faq.id ? d : x));
            return s;
          });
          setEdit(false);
        }}
        className="rounded-xl border border-gold bg-card p-4 space-y-3 shadow-soft"
      >
        <input className={inputCls} value={d.q} onChange={(e) => setD(prev => ({ ...prev, q: e.target.value }))} required />
        <textarea rows={3} className={inputCls} value={d.a} onChange={(e) => setD(prev => ({ ...prev, a: e.target.value }))} required />
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => { setD(faq); setEdit(false); }} className="px-4 py-2 text-sm rounded-full border border-border hover:bg-secondary">Cancel</button>
          <button className={btnGold}>Save</button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-medium">{faq.q}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{faq.a}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={() => setEdit(true)} className="h-9 w-9 grid place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
        <button
          onClick={() => { 
            if (confirm("Are you sure you want to delete this FAQ?")) {
              update((s) => {
                s.faqs = s.faqs.filter((x) => x.id !== faq.id);
                return s;
              });
            }
          }}
          className="h-9 w-9 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* --------- STUDIO PANEL --------- */

function StudioPanel() {
  const { state, update } = useStore();
  const [s, setS] = useState<Studio>(state.studio);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setS(state.studio);
  }, [state.studio]);

  const set = <K extends keyof Studio>(k: K, v: Studio[K]) => setS((p) => ({ ...p, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        update((st) => {
          st.studio = s;
          return st;
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-soft grid gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <h3 className="font-display text-2xl">Studio Contact</h3>
        <p className="text-sm text-muted-foreground">Updates the public footer + WhatsApp button.</p>
      </div>
      <Field label="Address" full><input className={inputCls} value={s.address} onChange={(e) => set("address", e.target.value)} /></Field>
      <Field label="Business Hours"><input className={inputCls} value={s.hours} onChange={(e) => set("hours", e.target.value)} /></Field>
      <Field label="Phone"><input className={inputCls} value={s.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
      <Field label="WhatsApp (digits only)"><input className={inputCls} value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} /></Field>
      <Field label="Email"><input type="email" className={inputCls} value={s.email} onChange={(e) => set("email", e.target.value)} /></Field>
      <Field label="Instagram URL"><input className={inputCls} value={s.instagram} onChange={(e) => set("instagram", e.target.value)} /></Field>
      <Field label="Facebook URL"><input className={inputCls} value={s.facebook} onChange={(e) => set("facebook", e.target.value)} /></Field>
      <Field label="YouTube URL" full><input className={inputCls} value={s.youtube} onChange={(e) => set("youtube", e.target.value)} /></Field>
      <Field label="About Studio" full><textarea rows={5} className={inputCls} value={s.about} onChange={(e) => set("about", e.target.value)} /></Field>
      <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-border">
        {saved && <span className="text-sm text-gold">Saved ✓</span>}
        <button className={btnGold}>Save Changes</button>
      </div>
    </form>
  );
}

/* --------- SHARED STYLES & COMPONENTS --------- */

const inputCls =
  "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition";

const btnGold =
  "inline-flex items-center gap-2 rounded-full bg-gradient-gold text-ink px-5 py-2.5 text-sm font-medium hover:shadow-gold transition-all";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}