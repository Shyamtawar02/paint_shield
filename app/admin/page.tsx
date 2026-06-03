// app/admin/page.tsx
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Lock, Plus, Trash2, Pencil, Search, X, Upload, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useStore, id, type Customer, type Product, type ProductVariant, type Vlog, type Faq, type Studio } from "@/lib/store";

const ADMIN_KEY = "ppf-admin-auth";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(ADMIN_KEY) === "1");
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background grid place-items-center">
        <p className="text-sm text-muted-foreground animate-pulse">Initializing Studio Console...</p>
      </div>
    );
  }

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

/* --------- PRODUCTION ADMIN LOGIN CARD --------- */
function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "admin_login",
          username: u,
          password: p,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess();
      } else {
        setErr(data.error || "Invalid username or password");
      }
    } catch (error) {
      setErr("Database server se connect nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-luxe">
        <div className="h-12 w-12 rounded-full bg-gradient-gold grid place-items-center mb-6 shadow-gold">
          <Lock className="h-5 w-5 text-ink" />
        </div>
        <h1 className="font-display text-3xl">PaintShield Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter database credentials to access console</p>

        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          <Field label="Username/Email">
            <input className={inputCls} value={u} onChange={(e) => setU(e.target.value)} disabled={loading} required />
          </Field>
          <Field label="Password">
            <input type="password" className={inputCls} value={p} onChange={(e) => setP(e.target.value)} disabled={loading} required />
          </Field>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-foreground text-background py-3 text-sm font-medium hover:bg-gold hover:text-ink transition-colors disabled:opacity-50">
            {loading ? "Verifying..." : "Sign In"}
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
/* --------- CUSTOMERS PANEL --------- */
const emptyCustomer: Customer = {
  id: "",
  customerName: "", 
  vehicleModel: "", 
  vehicleNo: "", 
  contactNo: "", 
  email: "",
  warrantyYears: "5 years", 
  serviceDate: new Date().toISOString().slice(0, 10),
  kmDriven: "", 
  serviceType: "", 
  workPhotos: [],
};

function CustomersPanel() {
  const { state, update } = useStore();
  const [editing, setEditing] = useState<Customer | null>(null);
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [fetchingData, setFetchingData] = useState(false);

  // 1. Fetch Customers from Database on Load
  useEffect(() => {
    const fetchCustomers = async () => {
      setFetchingData(true);
      try {
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_customers" }),
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
          update((s) => {
            // Backend se jo dynamic formatted data aa raha hai use handle karne ke liye
            s.customers = data.data.map((item: any) => ({
              id: item.id,
              customerName: item.name || item.customerName || "",
              email: item.email || "",
              vehicleModel: item.vehicleModel || "",
              vehicleNo: item.vehicleNo || "",
              contactNo: item.contact || item.contactNo || "",
              warrantyYears: item.warranty ? `${item.warranty} years` : (item.warrantyYears || "5 years"),
              serviceDate: item.serviceDate || "",
              kmDriven: item.kmDriven || "",
              serviceType: item.serviceType || "",
              workPhotos: item.photos || item.workPhotos || []
            }));
            return s;
          });
        } else {
          console.error("Failed to load customers:", data.error);
        }
      } catch (err) {
        console.error("Database connection error:", err);
      } finally {
        setFetchingData(false);
      }
    };

    fetchCustomers();
  }, []); 

  // 2. Delete Customer from Database
  const handleDeleteCustomer = async (customer: Customer) => {
    const targetId = customer.id || customer._id;
    if (!targetId) return;

    if (confirm(`Are you sure you want to permanently delete ${customer.customerName}?`)) {
      try {
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete_customer",
            customerId: targetId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          update((s) => {
            s.customers = s.customers.filter((x) => x.id !== targetId && x._id !== targetId);
            return s;
          });
          alert("Customer record deleted successfully.");
        } else {
          alert("Delete failed: " + (data.error || "Unknown server error"));
        }
      } catch (err) {
        console.error(err);
        alert("Failed to sync delete with Database.");
      }
    }
  };

  const filtered = (state.customers || []).filter((c) =>
    [c.customerName, c.vehicleNo, c.vehicleModel, c.contactNo].join(" ").toLowerCase().includes(q.toLowerCase()),
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
            {fetchingData ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">⏳ Loading dynamic records from Database...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No customers found.</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id || c._id} className="border-t border-border">
                  <td className="p-4">
                    <p className="font-medium">{c.customerName}</p>
                    <p className="text-xs text-muted-foreground">{c.email || "—"}</p>
                  </td>
                  <td className="p-4">
                    <p>{c.vehicleModel}</p>
                    <p className="text-xs text-muted-foreground">{c.vehicleNo}</p>
                  </td>
                  <td className="p-4">{c.contactNo}</td>
                  <td className="p-4">
                    <span className="text-gold font-medium">
                      {c.warrantyYears}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => setEditing(c)} className="h-9 w-9 grid place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                      <button
                        onClick={() => handleDeleteCustomer(c)}
                        className="h-9 w-9 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <CustomerModal
          initial={editing ?? emptyCustomer}
          isNew={!editing}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={(savedCustomer) => {
            update((s) => {
              if (editing) {
                const targetId = editing.id || editing._id;
                s.customers = s.customers.map((x) => (x.id === targetId || x._id === targetId ? savedCustomer : x));
              } else {
                s.customers.unshift(savedCustomer);
              }
              return s;
            });
            setAdding(false); 
            setEditing(null);
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
  const [loading, setLoading] = useState(false);

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
    ).then((urls) => set("workPhotos", urls));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNew) {
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create_customer",
            customerData: c,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          onSave({ ...c, id: data.id });
          alert("Customer record created successfully!");
        } else {
          alert("Error: " + (data.error || "Failed to create customer"));
        }
      } else {
        const targetId = c.id || c._id;
        
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_customer",
            customerId: targetId,
            customerData: c,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          onSave(c);
          alert("Customer record updated successfully!");
        } else {
          alert("Update failed: " + (data.error || "Unknown error"));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Database link failure! Sync nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border shadow-luxe w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-display text-2xl">{isNew ? "Add" : "Edit"} Customer</h3>
          <button onClick={onClose} disabled={loading} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid gap-4 sm:grid-cols-2">
          <Field label="Customer Name"><input className={inputCls} value={c.customerName} required disabled={loading} onChange={(e) => set("customerName", e.target.value)} /></Field>
          <Field label="Email"><input type="email" className={inputCls} value={c.email} disabled={loading} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Vehicle Model"><input className={inputCls} placeholder="e.g. Fortuner" value={c.vehicleModel} required disabled={loading} onChange={(e) => set("vehicleModel", e.target.value)} /></Field>
          <Field label="Vehicle No."><input className={inputCls} placeholder="DL-3C-AA-1111" value={c.vehicleNo} required disabled={loading} onChange={(e) => set("vehicleNo", e.target.value)} /></Field>
          <Field label="Contact No."><input className={inputCls} value={c.contactNo} required disabled={loading} onChange={(e) => set("contactNo", e.target.value)} /></Field>
          <Field label="Warranty (years)">
            <select className={inputCls} value={c.warrantyYears} disabled={loading} onChange={(e) => set("warrantyYears", e.target.value)}>
              {["5 years", "8 years", "10 years"].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="Service Date"><input type="date" className={inputCls} value={c.serviceDate} disabled={loading} onChange={(e) => set("serviceDate", e.target.value)} /></Field>
          <Field label="KM Driven"><input className={inputCls} value={c.kmDriven} disabled={loading} onChange={(e) => set("kmDriven", e.target.value)} /></Field>
          <Field label="Service Type" full><input className={inputCls} placeholder="PaintShield Premium Gloss PPF" value={c.serviceType} disabled={loading} onChange={(e) => set("serviceType", e.target.value)} /></Field>

          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Work Photos (up to 4)</p>
            <label className={`flex items-center gap-2 px-4 py-3 border border-dashed border-border rounded-md cursor-pointer hover:border-gold transition-colors text-sm ${loading ? "opacity-50 pointer-events-none" : ""}`}>
              <Upload className="h-4 w-4" />
              <span>{c.workPhotos?.length ? `${c.workPhotos.length} photo(s) selected` : "Upload images"}</span>
              <input type="file" accept="image/*" multiple className="hidden" disabled={loading} onChange={onPhotos} />
            </label>
            {c.workPhotos && c.workPhotos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {c.workPhotos.map((p, i) => <img key={i} src={p} alt="" className="aspect-square object-cover rounded-md" />)}
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-secondary">Cancel</button>
            <button type="submit" disabled={loading} className={btnGold}>
              {loading ? "Saving to Cloud..." : isNew ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
/* --------- PRODUCTS PANEL --------- */
const emptyProduct: Omit<Product, "id"> = { name: "", tagline: "", variants: [] };
const emptyVariant: Omit<ProductVariant, "id"> = {
  typeName: "",name:"", microns: "", warranty: "", material: "Aliphatic TPU", glossLevel: "", heatResistance: "", selfHealing: "", details: "", detailedInfo: ""
};

function ProductsPanel() {
  const { state, update } = useStore();
  const [editingCat, setEditingCat] = useState<Product | null>(null);
  const [addingCat, setAddingCat] = useState(false);
  const [variantCtx, setVariantCtx] = useState<{ product: Product; variant: ProductVariant | null } | null>(null);

  // 1. Database se products data fetch karne ke liye (No loop)
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_products_data" }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          update((s) => {
            s.products = data.data.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              tagline: cat.tagline,
              image: cat.image || "", // 🔥 FIXED: Fetch karte waqt image string ko local state me load karo
              variants: cat.variants.map((v: any) => ({
                id: v.id,
                typeName: v.name,
                microns: v.microns,
                warranty: v.warranty,
                material: v.material,
                glossLevel: v.glossLevel,
                heatResistance: v.heatResistance,
                selfHealing: v.selfHealing,
                details: v.detailedInfo || ""
              }))
            }));
            return s;
          });
        }
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };

    fetchProductsData();
  }, []); // Empty array loop rokne ke liye

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
              <div className="flex items-center gap-4">
                {/* 🔥 LIVE DATABASE IMAGE PREVIEW IN PANEL LIST */}
                {p.image && (
                  <div className="h-14 w-14 rounded-lg overflow-hidden border border-border bg-secondary/30 shrink-0">
                    <img src={p.image} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold">{p.tagline}</p>
                  <h3 className="font-display text-2xl mt-1">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.variants.length} variant(s)</p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <button onClick={() => setVariantCtx({ product: p, variant: null })} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Variant
                </button>
                <button onClick={() => setEditingCat(p)} className="h-9 w-9 grid place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                <button
                  onClick={async () => { 
                    if (confirm(`Delete category "${p.name}"?`)) {
                      try {
                        const res = await fetch("/api/admin", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "delete_category", categoryId: p.id }),
                        });
                        if (res.ok) {
                          update((s) => {
                            s.products = s.products.filter((x) => x.id !== p.id);
                            return s;
                          });
                        }
                      } catch (err) { console.error(err); }
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
                        onClick={async () => {
                          if (!confirm(`Delete variant "${v.typeName}"?`)) return;
                          try {
                            const res = await fetch("/api/admin", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ action: "delete_variant", variantId: v.id }),
                            });
                            if (res.ok) {
                              update((s) => {
                                s.products = s.products.map((x) => x.id === p.id ? { ...x, variants: x.variants.filter((y) => y.id !== v.id) } : x);
                                return s;
                              });
                            }
                          } catch (err) { console.error(err); }
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
          onSave={async (pData) => {
            try {
              const isNew = !editingCat;
              const res = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: isNew ? "create_category" : "update_category",
                  categoryId: editingCat?.id,
                  // 🔥 FIXED: image property ko payload me bheja taaki backend ise receive kar sake
                  categoryData: { 
                    name: pData.name, 
                    tagline: pData.tagline,
                    image: pData.image || "" 
                  }
                })
              });
              const data = await res.json();
              if (res.ok) {
                update((s) => {
                  if (editingCat) {
                    s.products = s.products.map((x) => (x.id === editingCat.id ? pData : x));
                  } else {
                    s.products.push({ ...pData, id: data.id || Date.now().toString(), variants: [] });
                  }
                  return s;
                });
              }
            } catch (err) { console.error(err); }
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
          onSave={async (vData) => {
            const editing = variantCtx.variant;
            try {
              const isNew = !editing;
              const res = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: isNew ? "create_variant" : "update_variant",
                  categoryId: variantCtx.product.id,
                  variantId: editing?.id,
                  variantData: {
                    name: vData.typeName,
                    microns: vData.microns,
                    warranty: vData.warranty,
                    material: vData.material,
                    glossLevel: vData.glossLevel,
                    heatResistance: vData.heatResistance,
                    selfHealing: vData.selfHealing,
                    detailedInfo: vData.details
                  }
                })
              });
              const data = await res.json();
              if (res.ok) {
                update((s) => {
                  s.products = s.products.map((x) => x.id === variantCtx.product.id
                    ? {
                        ...x,
                        variants: editing
                          ? x.variants.map((y) => y.id === editing.id ? vData : y)
                          : [...x.variants, { ...vData, id: data.id || Date.now().toString() }],
                      }
                    : x);
                  return s;
                });
              }
            } catch (err) { console.error(err); }
            setVariantCtx(null);
          }}
        />
      )}
    </div>
  );
}

function CategoryModal({ initial, isNew, onClose, onSave }: { initial: Product; isNew?: boolean; onClose: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = useState(initial);

  // 🔥 Image ko base64 string mein convert karke state mein save karne ke liye helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setP((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <form 
        onSubmit={(e) => { 
          e.preventDefault(); 
          onSave(p); 
        }} 
        className="bg-card rounded-2xl border border-border shadow-luxe w-full max-w-lg my-8 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl">{isNew ? "Add" : "Edit"} Category</h3>
          <button type="button" onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid gap-4">
          <Field label="Category Name" full>
            <input className={inputCls} required placeholder="e.g. Paint Protection Film" value={p.name} onChange={(e) => setP(prev => ({ ...prev, name: e.target.value }))} />
          </Field>
          
          <Field label="Tagline" full>
            <input className={inputCls} required placeholder="e.g. Ultimate Paint Defense" value={p.tagline} onChange={(e) => setP(prev => ({ ...prev, tagline: e.target.value }))} />
          </Field>

          {/* 🔥 NEW: Dynamic Image Upload Section */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Category Showcase Image</label>
            <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-border rounded-md cursor-pointer hover:border-gold transition-colors text-sm bg-background/50">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{p.image ? "Change Product Image" : "Choose Dynamic Banner"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            
            {/* Live Preview Block */}
            {p.image && (
              <div className="relative mt-2 border border-border rounded-lg overflow-hidden bg-secondary/20">
                <img src={p.image} alt="Preview" className="h-28 w-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setP(prev => ({ ...prev, image: "" }))} 
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-secondary">
            Cancel
          </button>
          <button type="submit" className={btnGold}>
            {isNew ? "Create" : "Save"}
          </button>
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
      <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className="bg-card rounded-2xl border border-border shadow-luxe w-full max-w-2xl my-8 p-6">
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
  // Aapka existing store state aur update function
  const { state, update } = useStore();
  const [v, setV] = useState<Omit<Vlog, "id">>({ title: "", description: "", url: "" });
  const [loading, setLoading] = useState(false);

  // 1. Initial Sync: Page load hote hi MongoDB se data laakar local store me inject karna
  useEffect(() => {
    const syncWithDatabase = async () => {
      try {
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_vlogs" }),
        });
        const resData = await response.json();
        
        if (resData.success && resData.data) {
          // Local store ko database ke data se overwrite/sync karna
          update((s) => {
            s.vlogs = resData.data;
            return s;
          });
        }
      } catch (err) {
        console.error("Database sync failed for vlogs:", err);
      }
    };

    syncWithDatabase();
  }, []); // Khali array taaki component mount par sirf ek baar chale

  // 2. Submit Handler: MongoDB me save karega, fir response 'id' ke sath Local Store me add karega
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_vlog",
          vlogData: v,
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        // DB me save ho gaya! Ab local store me bhi push kar dete hain database ki genuine '_id' ke sath
        update((s) => {
          s.vlogs.push({ 
            ...v, 
            id: resData.id // Backend se aayi hui real MongoDB ObjectId use hogi yahan
          });
          return s;
        });

        // Form reset
        setV({ title: "", description: "", url: "" });
      } else {
        alert(resData.error || "Failed to save in Database");
      }
    } catch (err) {
      console.error("Error creating vlog:", err);
      alert("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Handler: MongoDB se delete karega, fir state/store se remove karega
  const handleDelete = async (vlogId: string, title: string) => {
    if (!confirm(`Delete vlog "${title}"?`)) return;

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_vlog",
          vlogId: vlogId, // MongoDB is id ko delete karega
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        // DB se remove hone ke baad, local store ko update/filter karo
        update((s) => {
          s.vlogs = s.vlogs.filter((x) => x.id !== vlogId);
          return s;
        });
      } else {
        alert(resData.error || "Failed to delete from Database");
      }
    } catch (err) {
      console.error("Error deleting vlog:", err);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* FORM SECTION */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4 h-fit"
      >
        <h3 className="font-display text-2xl">Add Vlog</h3>
        
        <Field label="Title">
          <input 
            className={inputCls} 
            value={v.title} 
            required 
            onChange={(e) => setV(prev => ({ ...prev, title: e.target.value }))} 
          />
        </Field>
        
        <Field label="Description">
          <textarea 
            rows={3} 
            className={inputCls} 
            value={v.description} 
            onChange={(e) => setV(prev => ({ ...prev, description: e.target.value }))} 
          />
        </Field>
        
        <Field label="Video URL (embed)">
          <input 
            className={inputCls} 
            placeholder="https://www.youtube.com/embed/…" 
            value={v.url} 
            required 
            onChange={(e) => setV(prev => ({ ...prev, url: e.target.value }))} 
          />
        </Field>
        
        <button type="submit" disabled={loading} className={btnGold}>
          <Plus className="h-4 w-4" /> {loading ? "Publishing..." : "Publish"}
        </button>
      </form>

      {/* DISPLAY LIST SECTION (Purely sync with state.vlogs) */}
      <div className="space-y-3">
        {state.vlogs.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No vlogs found. Add your first vlog!</p>
        ) : (
          state.vlogs.map((vl) => (
            <div key={vl.id} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{vl.title}</p>
                <p className="text-xs text-muted-foreground truncate">{vl.url}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(vl.id, vl.title)}
                className="h-9 w-9 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* --------- FAQ PANEL --------- */
function FaqPanel() {
  const { state, update } = useStore();
  const [draft, setDraft] = useState<Omit<Faq, "id">>({ q: "", a: "" });
  const [loading, setLoading] = useState(false);

  // 1. Database Sync on Load
  useEffect(() => {
    const syncFaqs = async () => {
      try {
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_faqs" }),
        });
        const resData = await response.json();
        if (resData.success && resData.data) {
          update((s) => {
            s.faqs = resData.data;
            return s;
          });
        }
      } catch (err) {
        console.error("Failed to fetch FAQs from DB:", err);
      }
    };
    syncFaqs();
  }, []);

  // 2. Form Submit (Add to DB + Local Store)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_faq",
          faqData: draft,
        }),
      });
      const resData = await response.json();

      if (resData.success) {
        update((s) => {
          s.faqs.push({ ...draft, id: resData.id }); // Using the DB insertedId
          return s;
        });
        setDraft({ q: "", a: "" });
      } else {
        alert(resData.error || "Failed to create FAQ");
      }
    } catch (err) {
      console.error("Error creating FAQ:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4 h-fit"
      >
        <h3 className="font-display text-2xl">Add FAQ</h3>
        <Field label="Question">
          <input 
            className={inputCls} 
            required 
            value={draft.q} 
            onChange={(e) => setDraft(prev => ({ ...prev, q: e.target.value }))} 
          />
        </Field>
        <Field label="Answer">
          <textarea 
            rows={4} 
            className={inputCls} 
            required 
            value={draft.a} 
            onChange={(e) => setDraft(prev => ({ ...prev, a: e.target.value }))} 
          />
        </Field>
        <button type="submit" disabled={loading} className={btnGold}>
          <Plus className="h-4 w-4" /> {loading ? "Publishing..." : "Publish"}
        </button>
      </form>

      <div className="space-y-3">
        {state.faqs.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No FAQs available. Create one!</p>
        ) : (
          state.faqs.map((f) => (
            <FaqRow key={f.id} faq={f} />
          ))
        )}
      </div>
    </div>
  );
}

/* --------- FAQ ROW (EDIT & DELETE INCLUDED) --------- */
function FaqRow({ faq }: { faq: Faq }) {
  const { update } = useStore();
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState(faq);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setD(faq);
  }, [faq]);

  // Handle Edit Save to DB
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_faq",
          faqId: faq.id,
          faqData: { q: d.q, a: d.a },
        }),
      });
      const resData = await response.json();

      if (resData.success) {
        update((s) => {
          s.faqs = s.faqs.map((x) => (x.id === faq.id ? d : x));
          return s;
        });
        setEdit(false);
      } else {
        alert(resData.error || "Failed to update FAQ");
      }
    } catch (err) {
      console.error("Error updating FAQ:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Handle Delete from DB
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_faq",
          faqId: faq.id,
        }),
      });
      const resData = await response.json();

      if (resData.success) {
        update((s) => {
          s.faqs = s.faqs.filter((x) => x.id !== faq.id);
          return s;
        });
      } else {
        alert(resData.error || "Failed to delete FAQ");
      }
    } catch (err) {
      console.error("Error deleting FAQ:", err);
    }
  };

  if (edit) {
    return (
      <form
        onSubmit={handleEditSubmit}
        className="rounded-xl border border-gold bg-card p-4 space-y-3 shadow-soft"
      >
        <input className={inputCls} value={d.q} onChange={(e) => setD(prev => ({ ...prev, q: e.target.value }))} required />
        <textarea rows={3} className={inputCls} value={d.a} onChange={(e) => setD(prev => ({ ...prev, a: e.target.value }))} required />
        <div className="flex gap-2 justify-end">
          <button type="button" disabled={updating} onClick={() => { setD(faq); setEdit(false); }} className="px-4 py-2 text-sm rounded-full border border-border hover:bg-secondary">Cancel</button>
          <button type="submit" disabled={updating} className={btnGold}>{updating ? "Saving..." : "Save"}</button>
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
        <button type="button" onClick={() => setEdit(true)} className="h-9 w-9 grid place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
        <button
          type="button"
          onClick={handleDelete}
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
  const [loading, setLoading] = useState(false);

  // 1. Initial Sync: Database se studio profiles load karna
  useEffect(() => {
    const fetchStudioDetails = async () => {
      try {
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_studio" }),
        });
        const resData = await response.json();
        
        if (resData.success && resData.data) {
          // Client Store ko backend DB ke sath update kar rahe hain
          update((st) => {
            st.studio = resData.data;
            return st;
          });
          setS(resData.data);
        }
      } catch (err) {
        console.error("Failed to sync studio data with DB:", err);
      }
    };

    fetchStudioDetails();
  }, []);

  // Safe setter function fields ke liye
  const set = <K extends keyof Studio>(k: K, v: Studio[K]) => setS((p) => ({ ...p, [k]: v }));

  // 2. Form Submit: MongoDB & LocalStore me sync karna
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_studio",
          studioData: s,
        }),
      });
      const resData = await response.json();

      if (resData.success) {
        // Local store ko update karo taaki pure platform par instantly changes live ho jayein
        update((st) => {
          st.studio = s;
          return st;
        });
        
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert(resData.error || "Failed to update studio info in DB");
      }
    } catch (err) {
      console.error("Error updating studio details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-soft grid gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <h3 className="font-display text-2xl">Studio Contact</h3>
        <p className="text-sm text-muted-foreground">Updates the public footer + WhatsApp button.</p>
      </div>
      
      <Field label="Address" full>
        <input className={inputCls} value={s.address} onChange={(e) => set("address", e.target.value)} required />
      </Field>
      
      <Field label="Business Hours">
        <input className={inputCls} value={s.hours} onChange={(e) => set("hours", e.target.value)} required />
      </Field>
      
      <Field label="Phone">
        <input className={inputCls} value={s.phone} onChange={(e) => set("phone", e.target.value)} required />
      </Field>
      
      <Field label="WhatsApp (digits only)">
        <input 
          className={inputCls} 
          value={s.whatsapp} 
          required 
          onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} 
        />
      </Field>
      
      <Field label="Email">
        <input type="email" className={inputCls} value={s.email} onChange={(e) => set("email", e.target.value)} required />
      </Field>
      
      <Field label="Instagram URL">
        <input className={inputCls} value={s.instagram} onChange={(e) => set("instagram", e.target.value)} />
      </Field>
      
      <Field label="Facebook URL">
        <input className={inputCls} value={s.facebook} onChange={(e) => set("facebook", e.target.value)} />
      </Field>
      
      <Field label="YouTube URL" full>
        <input className={inputCls} value={s.youtube} onChange={(e) => set("youtube", e.target.value)} />
      </Field>
      
      <Field label="About Studio" full>
        <textarea rows={5} className={inputCls} value={s.about} onChange={(e) => set("about", e.target.value)} required />
      </Field>
      
      <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-border">
        {saved && <span className="text-sm text-gold animate-fade-in">Saved ✓</span>}
        <button type="submit" disabled={loading} className={btnGold}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/* --------- SHARED STYLES & COMPONENTS --------- */
const inputCls =
  "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition disabled:opacity-60 disabled:cursor-not-allowed";

const btnGold =
  "inline-flex items-center gap-2 rounded-full bg-gradient-gold text-ink px-5 py-2.5 text-sm font-medium hover:shadow-gold transition-all disabled:opacity-50";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""} space-y-2`}>
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}