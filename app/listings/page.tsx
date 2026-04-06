"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";

const ALL_LISTINGS = [
  { id: "1", title: "Toyota Landcruiser 200 Series", price: 185000, category: "vehicles", condition: "good", location: "Port Moresby, NCD", seller: "Kila Wari", verified: true, image: "🚙", views: 247, date: "2025-01-15" },
  { id: "2", title: "Solar Panel Kit 2kW", price: 8500, category: "electronics", condition: "new", location: "Lae, Morobe", seller: "Mary Kapi", verified: true, image: "☀️", views: 89, date: "2025-01-14" },
  { id: "3", title: "5 Acres Agricultural Land", price: 45000, category: "agriculture", condition: "new", location: "Mt Hagen, WHP", seller: "Peter Mondo", verified: false, image: "🌱", views: 312, date: "2025-01-12" },
  { id: "4", title: "Samsung Galaxy S24", price: 2800, category: "electronics", condition: "like_new", location: "Port Moresby, NCD", seller: "Ruth Narokobi", verified: true, image: "📱", views: 156, date: "2025-01-13" },
  { id: "5", title: "3 Bedroom House — Gordons", price: 320000, category: "property", condition: "good", location: "Gordons, NCD", seller: "John Namaliu", verified: true, image: "🏠", views: 420, date: "2025-01-10" },
  { id: "6", title: "Fresh Vanilla Beans — 50kg", price: 4200, category: "agriculture", condition: "new", location: "Alotau, Milne Bay", seller: "Agnes Sere", verified: false, image: "🌿", views: 67, date: "2025-01-16" },
  { id: "7", title: "Honda Generator 6.5kVA", price: 3500, category: "electronics", condition: "good", location: "Kokopo, ENB", seller: "Tom Kaupa", verified: true, image: "⚡", views: 201, date: "2025-01-11" },
  { id: "8", title: "Traditional Bilum Collection", price: 850, category: "clothing", condition: "new", location: "Goroka, EHP", seller: "Rosa Kagl", verified: false, image: "👜", views: 44, date: "2025-01-16" },
];

const CATEGORIES = ["all", "electronics", "vehicles", "property", "agriculture", "clothing", "services"];

export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = ALL_LISTINGS
    .filter(l => category === "all" || l.category === category)
    .filter(l => !verifiedOnly || l.verified)
    .filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "price_asc" ? a.price - b.price : sortBy === "price_desc" ? b.price - a.price : 0);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        background: "rgba(10,15,13,0.95)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#0A0F0D" }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 15 }}>trust.<span style={{ color: "var(--accent)" }}>dspng</span></span>
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/dashboard"><button className="btn-ghost" style={{ fontSize: 13 }}>Dashboard</button></Link>
          <Link href="/listings/new"><button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }}>+ List Item</button></Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Marketplace</h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>{filtered.length} listings available — all with escrow protection</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="🔍 Search listings or location..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 220, maxWidth: 360 }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "auto", minWidth: 160 }}>
            <option value="date">Sort: Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--text2)", whiteSpace: "nowrap" }}>
            <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)}
              style={{ width: "auto", accentColor: "var(--accent)" }} />
            Verified sellers only
          </label>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600,
              background: category === cat ? "var(--accent)" : "var(--surface)",
              color: category === cat ? "#0A0F0D" : "var(--text2)",
              border: `1px solid ${category === cat ? "var(--accent)" : "var(--border)"}`,
              cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", textTransform: "capitalize"
            }}>
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Listing Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map(l => (
            <div key={l.id} className="card" style={{ padding: 0, overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
              {/* Image area */}
              <div style={{ background: "var(--surface)", height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
                {l.image}
                {l.verified && (
                  <div className="badge badge-green" style={{ position: "absolute", top: 12, right: 12, fontSize: 11 }}>
                    ✓ Verified
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: "var(--text3)", textTransform: "capitalize", marginBottom: 4 }}>{l.category} · {l.condition?.replace("_", " ")}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{l.title}</h3>
                <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>📍 {l.location}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                    K {l.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>👁 {l.views}</span>
                </div>
                <div className="divider" style={{ margin: "12px 0" }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/escrow/new?listing=${l.id}`} style={{ flex: 1 }}>
                    <button className="btn-primary" style={{ width: "100%", padding: "9px", fontSize: 13 }}>🔒 Buy w/ Escrow</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text2)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No listings found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
