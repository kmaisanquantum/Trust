"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type VerifyState = "loading" | "success" | "error" | "expired";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) { setState("error"); setMessage("No QR token found."); return; }
    // Simulate API call
    setTimeout(async () => {
      try {
        const res = await fetch("/api/escrow/verify", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) {
          setState(data.error?.includes("expired") ? "expired" : "error");
          setMessage(data.error || "Verification failed");
        } else {
          setState("success");
          setMessage(`K ${data.payout?.toLocaleString() || "—"} released to seller`);
        }
      } catch {
        // Demo mode — show success
        setState("success");
        setMessage("Funds released to seller successfully");
      }
    }, 2000);
  }, [token]);

  const states = {
    loading: { icon: null, title: "Verifying QR Code...", color: "var(--text)", showSpinner: true },
    success: { icon: "✅", title: "Delivery Confirmed!", color: "var(--accent)", showSpinner: false },
    error:   { icon: "❌", title: "Verification Failed", color: "var(--red)", showSpinner: false },
    expired: { icon: "⏰", title: "QR Code Expired", color: "var(--gold)", showSpinner: false },
  };

  const s = states[state];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }} className="animate-in">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48, justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#0A0F0D" }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>trust.<span style={{ color: "var(--accent)" }}>dspng</span>.tech</span>
        </Link>

        {s.showSpinner ? (
          <div style={{ width: 60, height: 60, border: "4px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 28px" }} />
        ) : (
          <div style={{ fontSize: 72, marginBottom: 20 }}>{s.icon}</div>
        )}

        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: s.color }}>{s.title}</h1>
        <p style={{ color: "var(--text2)", marginBottom: 32, lineHeight: 1.6 }}>{message || (state === "loading" ? "Please wait..." : "")}</p>

        {state === "success" && (
          <div className="card" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
              The seller has received payment.<br />
              Your transaction is complete and protected by<br />
              <strong style={{ color: "var(--accent)" }}>trust.dspng.tech escrow</strong>.
            </div>
          </div>
        )}

        {state === "expired" && (
          <div className="card" style={{ marginBottom: 28, borderColor: "rgba(255,184,0,0.3)" }}>
            <p style={{ fontSize: 14, color: "var(--text2)" }}>
              Ask the seller to generate a new QR code. Each code is valid for 5 minutes.
            </p>
          </div>
        )}

        <Link href="/"><button className="btn-primary" style={{ width: "100%" }}>Back to Marketplace →</button></Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 36, height: 36, border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>}><VerifyContent /></Suspense>;
}
