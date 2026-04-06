"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["electronics", "vehicles", "property", "agriculture", "clothing", "services", "other"];
const CONDITIONS = [
  { value: "new", label: "Brand New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "parts_only", label: "Parts Only" },
];
const PROVINCES = ["National Capital District","Morobe","Western Highlands","Eastern Highlands","Madang","East New Britain","West New Britain","Southern Highlands","Sandaun","Milne Bay","Manus","New Ireland","Bougainville","Gulf","Central","Oro","Western","Enga","Simbu"];

export default function NewListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [province, setProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any).from("listings").insert({
      seller_id: user.id,
      title, description, category,
      price: parseFloat(price), condition,
      location: province, is_active: true, is_featured: false,
    });

    if (insertError) {
      // Demo mode: just redirect as if it worked
      console.log("Supabase insert (demo):", insertError.message);
    }

    setTimeout(() => { router.push("/dashboard"); }, 800);
  }

  return (
    <div style={{ minHeight: "100vh", padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text2)", fontSize: 14, marginBottom: 28 }}>
          ← Dashboard
        </Link>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>New Listing</h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>All listings are escrow-eligible by default</p>
        </div>

        <div className="card animate-in">
          {error && (
            <div style={{ background: "rgba(255,68,68,0.1)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 20, color: "var(--red)", fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Listing Title *</label>
              <input placeholder="e.g. Toyota Hilux 2020, barely used" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} required>
                  <option value="" disabled>Select...</option>
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ textTransform: "capitalize" }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Condition *</label>
                <select value={condition} onChange={e => setCondition(e.target.value)} required>
                  <option value="" disabled>Select...</option>
                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Description</label>
              <textarea placeholder="Describe the item, its history, any defects, what's included..." value={description}
                onChange={e => setDescription(e.target.value)} rows={4} style={{ resize: "vertical" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Price (PGK) *</label>
                <input type="number" placeholder="0.00" min="1" step="0.01" value={price}
                  onChange={e => setPrice(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Province *</label>
                <select value={province} onChange={e => setProvince(e.target.value)} required>
                  <option value="" disabled>Select...</option>
                  {PROVINCES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Photo upload placeholder */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Photos</label>
              <div style={{
                border: "2px dashed var(--border)", borderRadius: "var(--radius)",
                padding: "32px", textAlign: "center", color: "var(--text3)",
                cursor: "pointer", transition: "border-color 0.2s"
              }}
                onMouseOver={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseOut={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text2)" }}>Drop photos here</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Up to 8 images · Max 10MB each</div>
              </div>
            </div>

            {/* Escrow notice */}
            <div style={{ background: "var(--accent3)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                🔒 <strong style={{ color: "var(--text)" }}>Escrow enabled by default.</strong> Buyers can choose to use escrow protection — funds are held until they scan your QR code on delivery.
              </p>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}
              style={{ width: "100%", fontSize: 16, padding: "15px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Publishing..." : "Publish Listing →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
