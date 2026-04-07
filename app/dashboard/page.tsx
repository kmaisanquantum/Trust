"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const STATUS_COLORS: Record<string, string> = {
  active: "badge-green", sold: "badge-gray", held: "badge-blue",
  in_transit: "badge-gold", completed: "badge-green", disputed: "badge-red",
  pending: "badge-gold"
};
const STATUS_LABELS: Record<string, string> = {
  active: "Active", sold: "Sold", held: "Funds Held",
  in_transit: "In Transit", completed: "Completed", disputed: "Disputed",
  pending: "Awaiting Payment"
};

const MOCK_PROFILE = {
  full_name: "Kila Wari",
  is_verified: true,
  sevispass_id: "SVS-2025-DEMO1",
  total_sales: 18450,
  seller_rating: 4.8,
  created_at: new Date().toISOString(),
  phone: "+675 7000 1234",
  location: "Port Moresby, NCD"
};

const MOCK_LISTINGS = [
  { id: "1", title: "Toyota Landcruiser 200 Series", price: 185000, category: "vehicles", is_active: true, view_count: 247 },
  { id: "2", title: "Solar Panel Kit 2kW", price: 8500, category: "electronics", is_active: true, view_count: 89 },
];

const MOCK_TRANSACTIONS = [
  { id: "txn1", status: "held", amount: 185000, created_at: new Date().toISOString(), listings: { title: "Toyota Landcruiser 200 Series" } },
  { id: "txn2", status: "in_transit", amount: 8500, created_at: new Date().toISOString(), listings: { title: "Solar Panel Kit" } },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(MOCK_PROFILE);
  const [listings, setListings] = useState<any[]>(MOCK_LISTINGS);
  const [transactions, setTransactions] = useState<any[]>(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"listings" | "escrow" | "profile">("listings");
  const [lang, setLang] = useState<"en" | "tpi">("en");

  const t = {
    en: {
      welcome: "Howdy",
      dashboard: "Your seller dashboard",
      totalRevenue: "Total Revenue",
      activeListings: "Active Listings",
      inEscrow: "In Escrow",
      sellerRating: "Seller Rating",
      yourListings: "Your Listings",
      newListing: "+ New Listing",
      escrowTransactions: "Escrow Transactions",
      newEscrow: "+ New Escrow",
      sevisProfile: "SevisPass Profile",
      editProfile: "Edit Profile",
      signOut: "Sign Out",
      verification: "Verification",
      verified: "Verified Seller",
      unverified: "Unverified",
      memberSince: "Member Since",
      totalSales: "Total Sales",
      saveChanges: "Save Changes",
      sellEscrow: "Sell w/ Escrow",
      viewDetails: "View Details",
      generateQR: "📱 Generate QR",
      showQR: "📱 Show QR Code"
    },
    tpi: {
      welcome: "Gude",
      dashboard: "Dashboard bilong yu",
      totalRevenue: "Olgeta Mani",
      activeListings: "Ol Samting yu salim",
      inEscrow: "Mani i stap hait",
      sellerRating: "Mak bilong yu",
      yourListings: "Ol Samting bilong yu",
      newListing: "+ Nupela Samting",
      escrowTransactions: "Ol Transaksen",
      newEscrow: "+ Nupela Escrow",
      sevisProfile: "SevisPass Identi",
      editProfile: "Senisim Identi",
      signOut: "Log Aut",
      verification: "Verapikasin",
      verified: "Yu ken salim samting",
      unverified: "No gat mak yet",
      memberSince: "Yu bin join long",
      totalSales: "Olgeta seils",
      saveChanges: "Seivim ol senis",
      sellEscrow: "Salim wantaim Escrow",
      viewDetails: "Lukluk gen",
      generateQR: "📱 Mekim QR",
      showQR: "📱 Soim QR Code"
    }
  }[lang];

  useEffect(() => {
    async function loadData() {
      // In this environment, we bypass the real Supabase call and use mock data
      // but the structure is identical to what the real Supabase data would return
      console.log("Mocking Supabase data for dashboard");
    }
    loadData();
  }, []);

  async function handleSignOut() {
    router.push("/");
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const displayName = profile?.full_name || "Seller";

  const stats = {
    revenue: profile?.total_sales || 0,
    listings: listings.filter(l => l.is_active).length,
    escrow: transactions.filter(tr => ["held", "in_transit"].includes(tr.status)).length,
    rating: profile?.seller_rating || "0.0"
  };

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
          <span style={{ fontWeight: 800, fontSize: 15 }}>Trust</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setLang(l => l === "en" ? "tpi" : "en")}
            className="badge badge-gray"
            style={{ cursor: "pointer", border: "1px solid var(--border2)" }}
          >
            {lang === "en" ? "🇵🇳 Tok Pisin" : "🇬🇧 English"}
          </button>
          {profile?.is_verified && (
            <div className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11 }}>🪪</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{profile.sevispass_id}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent) 0%, #006633 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#0A0F0D"
            }}>
              {displayName[0].toUpperCase()}
            </div>
            <button onClick={handleSignOut} className="btn-ghost" style={{ fontSize: 13, padding: "6px 12px" }}>{t.signOut}</button>
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px" }}>
        {/* Welcome + Stats */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
            {t.welcome}, {displayName} 👋
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>{t.dashboard}</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: t.totalRevenue, value: `K ${stats.revenue.toLocaleString()}`, icon: "💰", color: "var(--accent)" },
            { label: t.activeListings, value: stats.listings, icon: "📦", color: "var(--blue)" },
            { label: t.inEscrow, value: stats.escrow, icon: "🔒", color: "var(--gold)" },
            { label: t.sellerRating, value: `★ ${stats.rating}`, icon: "⭐", color: "var(--gold)" },
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
          {(["listings", "escrow", "profile"] as const).map(tabKey => (
            <button key={tabKey} onClick={() => setTab(tabKey)} style={{
              padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: tab === tabKey ? "var(--bg2)" : "transparent",
              color: tab === tabKey ? "var(--text)" : "var(--text2)",
              border: tab === tabKey ? "1px solid var(--border)" : "1px solid transparent",
              transition: "all 0.2s", cursor: "pointer"
            }}>
              {tabKey === "listings" ? `📦 ${lang === 'en' ? 'Listings' : 'Samting'}` : tabKey === "escrow" ? `🔒 ${lang === 'en' ? 'Escrow' : 'Transaksen'}` : `🪪 ${lang === 'en' ? 'Profile' : 'Identi'}`}
            </button>
          ))}
        </div>

        {/* LISTINGS TAB */}
        {tab === "listings" && (
          <div className="animate-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t.yourListings}</h2>
              <Link href="/listings/new">
                <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>{t.newListing}</button>
              </Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {listings.map(l => (
                <div key={l.id} className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {l.category === 'vehicles' ? '🚙' : l.category === 'electronics' ? '☀️' : '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14 }}>K {l.price.toLocaleString()}</span>
                      <span style={{ color: "var(--text3)", fontSize: 12 }}>👁 {l.view_count} views</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <span className={`badge ${STATUS_COLORS[l.is_active ? 'active' : 'sold']}`}>{STATUS_LABELS[l.is_active ? 'active' : 'sold']}</span>
                    <Link href={`/escrow/new?listing=${l.id}`}>
                      <button className="btn-secondary" style={{ padding: "7px 14px", fontSize: 13 }}>{t.sellEscrow}</button>
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
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t.escrowTransactions}</h2>
              <Link href="/escrow/new">
                <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>{t.newEscrow}</button>
              </Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {transactions.map(tr => (
                <div key={tr.id} className="card" style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tr.listings?.title || "Unknown Item"}</div>
                      <div style={{ color: "var(--text2)", fontSize: 13 }}>ID: {tr.id.slice(0,8)} · {new Date(tr.created_at).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 16 }}>K {tr.amount.toLocaleString()}</span>
                      <span className={`badge ${STATUS_COLORS[tr.status]}`}>{STATUS_LABELS[tr.status]}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link href={`/escrow/${tr.id}`}>
                      <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }}>{t.viewDetails}</button>
                    </Link>
                    {tr.status === "held" && (
                      <Link href={`/escrow/${tr.id}/qr`}>
                        <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>{t.generateQR}</button>
                      </Link>
                    )}
                    {tr.status === "in_transit" && (
                      <Link href={`/escrow/${tr.id}/qr`}>
                        <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, animation: "pulse-glow 2s infinite" }}>{t.showQR}</button>
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
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{t.sevisProfile}</h2>
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
                    <div style={{ color: "var(--text2)", fontSize: 13 }}>demo@trust.png</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "SevisPass ID", value: profile?.sevispass_id || "Not Issued", mono: true },
                    { label: t.verification, value: profile?.is_verified ? t.verified : t.unverified, mono: false },
                    { label: t.memberSince, value: new Date(profile?.created_at || Date.now()).toLocaleDateString(), mono: false },
                    { label: t.totalSales, value: `K ${stats.revenue.toLocaleString()}`, mono: true },
                  ].map(f => (
                    <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ color: "var(--text2)", fontSize: 13 }}>{f.label}</span>
                      <span style={{ fontWeight: 600, fontSize: 14, fontFamily: f.mono ? "var(--font-mono)" : undefined, color: f.label === t.verification ? "var(--accent)" : "var(--text)" }}>
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{t.editProfile}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Display Name</label>
                    <input defaultValue={displayName} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Phone</label>
                    <input placeholder="+675 7XXX XXXX" defaultValue={profile?.phone || ""} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Location</label>
                    <input placeholder="Port Moresby, NCD" defaultValue={profile?.location || ""} />
                  </div>
                  <button className="btn-primary" style={{ marginTop: 8 }}>{t.saveChanges}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
