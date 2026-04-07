"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 32px", borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,15,13,0.92)", backdropFilter: "blur(20px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#0A0F0D"
          }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
            Trust
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/listings" className="btn-ghost" style={{ display: "none" }}>Browse</Link>
          <Link href="/auth/login">
            <button className="btn-secondary" style={{ padding: "10px 20px", fontSize: 14 }}>Sign In</button>
          </Link>
          <Link href="/auth/register">
            <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Get SevisPass</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "80px 24px 60px",
        textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div className="badge badge-green animate-in" style={{ marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          Papua New Guinea&apos;s Verified Marketplace
        </div>

        <h1 style={{
          fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 800,
          lineHeight: 1.05, letterSpacing: "-0.03em",
          marginBottom: 24, maxWidth: 800,
          animation: "fadeIn 0.5s ease 0.1s both"
        }}>
          Buy & Sell with{" "}
          <span style={{
            color: "var(--accent)",
            textShadow: "0 0 40px rgba(0,255,136,0.4)"
          }}>Total Trust</span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2.5vw, 20px)", color: "var(--text2)",
          maxWidth: 560, lineHeight: 1.6, marginBottom: 40,
          animation: "fadeIn 0.5s ease 0.2s both"
        }}>
          SevisPass digital identity + escrow-protected payments.
          Your funds are released only when the goods arrive safely.
        </p>

        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center",
          animation: "fadeIn 0.5s ease 0.3s both"
        }}>
          <Link href="/auth/register">
            <button className="btn-primary" style={{ fontSize: 16, padding: "16px 32px" }}>
              Start Selling Free →
            </button>
          </Link>
          <Link href="/listings">
            <button className="btn-secondary" style={{ fontSize: 16, padding: "16px 32px" }}>
              Browse Listings
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 48, marginTop: 72, flexWrap: "wrap", justifyContent: "center",
          animation: "fadeIn 0.5s ease 0.4s both"
        }}>
          {[
            { n: "K 0 Disputes", label: "Escrow-protected" },
            { n: "SevisPass ID", label: "Every verified seller" },
            { n: "2.5%", label: "Platform fee only" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-mono)" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>How It Works</h2>
        <p style={{ textAlign: "center", color: "var(--text2)", marginBottom: 48 }}>Three steps to a safe transaction</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { step: "01", icon: "🪪", title: "Get SevisPass ID", desc: "Verify your identity with PNG national ID. One-time setup, forever trusted." },
            { step: "02", icon: "🔒", title: "Funds Go to Escrow", desc: "Buyer pays. Funds are held securely — the seller can't touch them yet." },
            { step: "03", icon: "📱", title: "Scan QR on Delivery", desc: "Seller shows QR code. Buyer scans it. Funds release instantly to seller." },
          ].map(item => (
            <div key={item.step} className="card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: 16, right: 20,
                fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 700,
                color: "var(--border)", lineHeight: 1
              }}>{item.step}</div>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: "var(--text2)", lineHeight: 1.6, fontSize: 14 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: "0 24px 60px", borderRadius: "var(--radius-lg)",
        background: "linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)",
        border: "1px solid var(--border)",
        padding: "60px 40px", textAlign: "center"
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          Ready to trade with confidence?
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 32, fontSize: 16 }}>
          Join PNG&apos;s most trusted marketplace today.
        </p>
        <Link href="/auth/register">
          <button className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
            Create Free Account →
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "24px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12
      }}>
        <span style={{ color: "var(--text3)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
          © 2025 Trust — Port Moresby, PNG
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Support"].map(l => (
            <span key={l} style={{ color: "var(--text3)", fontSize: 13, cursor: "pointer" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--text3)")}>{l}</span>
          ))}
        </div>
      </footer>
    </main>
  );
}
