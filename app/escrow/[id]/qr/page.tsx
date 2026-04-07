"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { generateQRToken } from "@/lib/escrow";

const MOCK_TRANSACTIONS: Record<string, {
  id: string; listing: string; buyer: string; seller: string;
  amount: number; status: string; created: string;
}> = {
  txn1: { id: "txn1", listing: "Toyota Landcruiser 200 Series", buyer: "John Namaliu", seller: "You", amount: 185000, status: "held", created: "2025-01-15" },
  txn2: { id: "txn2", listing: "Solar Panel Kit 2kW", buyer: "Mary Kapi", seller: "You", amount: 8500, status: "in_transit", created: "2025-01-14" },
};

export default function QRPage() {
  const { id } = useParams<{ id: string }>();
  const txn = MOCK_TRANSACTIONS[id] || MOCK_TRANSACTIONS["txn1"];
  const [qrToken, setQrToken] = useState("");
  const [scanned, setScanned] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min expiry

  useEffect(() => {
    setQrToken(generateQRToken(txn.id));
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); setQrToken(generateQRToken(txn.id)); return 300; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [txn.id]);

  const qrUrl = `https://trust.dspng.tech/escrow/verify?token=${qrToken}&txn=${txn.id}`;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  async function simulateScan() {
    setScanned(true);
    setTimeout(() => {
      setReleasing(true);
      setTimeout(() => { setReleasing(false); setReleased(true); }, 2000);
    }, 1000);
  }

  if (released) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }} className="animate-in">
          <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "var(--accent)" }}>Funds Released!</h1>
          <p style={{ color: "var(--text2)", marginBottom: 32 }}>Transaction completed successfully</p>
          <div className="card" style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text2)" }}>Amount Released</span>
                <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 800 }}>K {(txn.amount * 0.975).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text2)" }}>Platform Fee (2.5%)</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>K {(txn.amount * 0.025).toLocaleString()}</span>
              </div>
              <div className="divider" style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>Total Transaction</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800 }}>K {txn.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Link href="/dashboard"><button className="btn-primary" style={{ width: "100%" }}>Back to Dashboard →</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Back */}
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text2)", fontSize: 14, marginBottom: 24 }}>
          ← Back to Dashboard
        </Link>

        <div className="animate-in">
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Delivery QR Code</h1>
          <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 28 }}>Buyer scans this to release funds from escrow</p>

          {/* Transaction Summary */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 4 }}>TRANSACTION</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{txn.listing}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text2)", fontSize: 13 }}>Buyer: {txn.buyer}</span>
              <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 18 }}>K {txn.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="card" style={{ textAlign: "center", padding: "32px" }}>
            {releasing ? (
              <div style={{ padding: "60px 0" }}>
                <div style={{ width: 48, height: 48, border: "4px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
                <p style={{ fontWeight: 700, color: "var(--accent)" }}>Releasing funds...</p>
              </div>
            ) : scanned ? (
              <div style={{ padding: "40px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <p style={{ fontWeight: 700, fontSize: 18, color: "var(--accent)" }}>QR Verified!</p>
                <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 8 }}>Processing payment release...</p>
              </div>
            ) : (
              <>
                <div style={{
                  display: "inline-block", padding: 20,
                  background: "white", borderRadius: 16,
                  boxShadow: "0 0 40px rgba(0,255,136,0.2)",
                  marginBottom: 20
                }}>
                  {qrToken && (
                    <QRCodeSVG value={qrUrl} size={200} level="H"
                      imageSettings={{ src: "/favicon.ico", x: undefined, y: undefined, height: 24, width: 24, excavate: true }} />
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: timeLeft > 60 ? "var(--accent)" : "var(--red)", animation: "pulse-glow 1s infinite" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: timeLeft > 60 ? "var(--accent)" : "var(--red)" }}>
                    Expires in {mins}:{String(secs).padStart(2, "0")}
                  </span>
                </div>
                <p style={{ color: "var(--text3)", fontSize: 12 }}>Auto-refreshes every 5 minutes</p>
              </>
            )}
          </div>

          {/* Instructions */}
          <div style={{ marginTop: 20, padding: "16px 20px", background: "var(--accent3)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: "var(--radius)" }}>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--text)" }}>How this works:</strong><br />
              1. Show this QR to the buyer on delivery<br />
              2. Buyer scans it with the Trust app<br />
              3. Funds are instantly released to your account
            </p>
          </div>

          {/* Demo simulate button */}
          {!scanned && !releasing && (
            <button onClick={simulateScan} className="btn-primary" style={{ width: "100%", marginTop: 20, fontSize: 15 }}>
              🎭 Simulate Buyer Scan (Demo)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
