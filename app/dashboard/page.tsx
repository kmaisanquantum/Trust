"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const MOCK_STATS = { listings: 4, activeEscrow: 2, totalSales: 18450, rating: 4.8, sevisId: "SVS-2025-00142" };
const MOCK_LISTINGS = [
  { id: "1", title: "Toyota Landcruiser 200 Series", price: 185000, category: "vehicles", status: "active", views: 247, image: "🚙" },
  { id: "2", title: "Solar Panel Kit 2kW", price: 8500, category: "electronics", status: "active", views: 89, image: "☀️" },
  { id: "3", title: "5 Acres Agricultural Land", price: 45000, category: "agriculture", status: "sold", views: 312, image: "🌱" },
  { id: "4", title: "Samsung Galaxy S24", price: 2800, category: "electronics", status: "active", views: 156, image: "📱" },
];
const MOCK_TRANSACTIONS = [
  { id: "txn1", listing: "Toyota Landcruiser 200 Series", buyer: "John Namaliu", amount: 185000, status: "held", date: "2025-01-15" },
  { id: "txn2", listing: "Solar Panel Kit", buyer: "Mary Kapi", amount: 8500, status: "in_transit", date: "2025-01-14" },
  { id: "txn3", listing: "Samsung Galaxy S24", buyer: "Peter Mondo", amount: 2800, status: "completed", date: "2025-01-10" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "badge-green", sold: "badge-gray", held: "badge-blue",
  in_transit: "badge-gold", completed: "badge-green", disputed: "badge-red",
};
const STATUS_LABELS: Record<string, string> = {
  active: "Active", sold: "Sold", held: "Funds Held",
  in_transit: "In Transit", completed: "Completed", disputed: "Disputed",
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<"listings" | "escrow" | "profile">("listings");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth/login");
      else setUser(data.user);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Seller";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        background: "var(--bg2)", position: "sticky", top: 0, zIndex: 100
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#0A0F0D" }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 15 }}>trust.<span style={{ color: "var(--accent)" }}>dspng</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11 }}>🪪</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{MOCK_STATS.sevisId}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent) 0%, #006633 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#0A0F0D"
            }}>
              {displayName[0].toUpperCase()}
            </div>
            <button onClick={handleSignOut} className="btn-ghost" style={{ fontSize: 13, padding: "6px 12px" }}>Sign Out</button>
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px" }}>
        {/* Welcome + Stats */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
            Howdy, {displayName} 👋
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>Your seller dashboard</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Revenue", value: `K ${MOCK_STATS.totalSales.toLocaleString()}`, icon: "💰", color: "var(--accent)" },
            { label: "Active Listings", value: MOCK_STATS.listings, icon: "📦", color: "var(--blue)" },
            { label: "In Escrow", value: MOCK_STATS.activeEscrow, icon: "🔒", color: "var(--gold)" },
            { label: "Seller Rating", value: `★ ${MOCK_STATS.rating}`, icon: "⭐", color: "var(--gold)" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "var(--font-mono)", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--surface)", padding: 4, borderRadius: "var(--radius)", width: "fit-content" }}>
          {(["listings", "escrow", "profile"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: tab === t ? "var(--bg2)" : "transparent",
              color: tab === t ? "var(--text)" : "var(--text2)",
              border: tab === t ? "1px solid var(--border)" : "1px solid transparent",
              transition: "all 0.2s", cursor: "pointer"
            }}>
              {t === "listings" ? "📦 Listings" : t === "escrow" ? "🔒 Escrow" : "🪪 Profile"}
            </button>
          ))}
        </div>

        {/* LISTINGS TAB */}
        {tab === "listings" && (
          <div className="animate-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Your Listings</h2>
              <Link href="/listings/new">
                <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>+ New Listing</button>
              </Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {MOCK_LISTINGS.map(l => (
                <div key={l.id} className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {l.image}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14 }}>K {l.price.toLocaleString()}</span>
                      <span style={{ color: "var(--text3)", fontSize: 12 }}>👁 {l.views} views</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <span className={`badge ${STATUS_COLORS[l.status]}`}>{STATUS_LABELS[l.status]}</span>
                    <Link href={`/escrow/new?listing=${l.id}`}>
                      <button className="btn-secondary" style={{ padding: "7px 14px", fontSize: 13 }}>Sell w/ Escrow</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESCROW TAB */}
        {tab === "escrow" && (
          <div className="animate-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Escrow Transactions</h2>
              <Link href="/escrow/new">
                <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>+ New Escrow</button>
              </Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {MOCK_TRANSACTIONS.map(t => (
                <div key={t.id} className="card" style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t.listing}</div>
                      <div style={{ color: "var(--text2)", fontSize: 13 }}>Buyer: {t.buyer} · {t.date}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 16 }}>K {t.amount.toLocaleString()}</span>
                      <span className={`badge ${STATUS_COLORS[t.status]}`}>{STATUS_LABELS[t.status]}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link href={`/escrow/${t.id}`}>
                      <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }}>View Details</button>
                    </Link>
                    {t.status === "held" && (
                      <Link href={`/escrow/${t.id}/qr`}>
                        <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>📱 Generate QR</button>
                      </Link>
                    )}
                    {t.status === "in_transit" && (
                      <Link href={`/escrow/${t.id}/qr`}>
                        <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, animation: "pulse-glow 2s infinite" }}>📱 Show QR Code</button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && (
          <div className="animate-in">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>SevisPass Profile</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent) 0%, #006633 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, fontWeight: 700, color: "#0A0F0D", flexShrink: 0
                  }}>
                    {displayName[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{displayName}</div>
                    <div style={{ color: "var(--text2)", fontSize: 13 }}>{user.email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "SevisPass ID", value: MOCK_STATS.sevisId, mono: true },
                    { label: "Verification", value: "✓ Verified Seller", mono: false },
                    { label: "Member Since", value: new Date(user.created_at || Date.now()).toLocaleDateString(), mono: false },
                    { label: "Total Sales", value: `K ${MOCK_STATS.totalSales.toLocaleString()}`, mono: true },
                  ].map(f => (
                    <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ color: "var(--text2)", fontSize: 13 }}>{f.label}</span>
                      <span style={{ fontWeight: 600, fontSize: 14, fontFamily: f.mono ? "var(--font-mono)" : undefined, color: f.label === "Verification" ? "var(--accent)" : "var(--text)" }}>
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Edit Profile</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Display Name</label>
                    <input defaultValue={displayName} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Phone</label>
                    <input placeholder="+675 7XXX XXXX" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Location</label>
                    <input placeholder="Port Moresby, NCD" />
                  </div>
                  <button className="btn-primary" style={{ marginTop: 8 }}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
