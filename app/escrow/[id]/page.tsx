"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";

const MOCK_TRANSACTIONS: Record<string, {
  id: string; listing: string; buyer: string; seller: string;
  amount: number; status: string; created: string; address: string;
  events: { type: string; label: string; time: string; done: boolean }[];
}> = {
  txn1: {
    id: "txn1", listing: "Toyota Landcruiser 200 Series", buyer: "John Namaliu",
    seller: "You", amount: 185000, status: "held", created: "2025-01-15",
    address: "Waigani Drive, NCD, Port Moresby",
    events: [
      { type: "created", label: "Escrow Created", time: "Jan 15, 10:23 AM", done: true },
      { type: "held", label: "Payment Held in Escrow", time: "Jan 15, 10:45 AM", done: true },
      { type: "shipped", label: "Marked for Delivery", time: "Pending", done: false },
      { type: "delivered", label: "QR Scan on Delivery", time: "Pending", done: false },
      { type: "completed", label: "Funds Released", time: "Pending", done: false },
    ]
  },
  txn2: {
    id: "txn2", listing: "Solar Panel Kit 2kW", buyer: "Mary Kapi",
    seller: "You", amount: 8500, status: "in_transit", created: "2025-01-14",
    address: "Lae City, Morobe Province",
    events: [
      { type: "created", label: "Escrow Created", time: "Jan 14, 2:15 PM", done: true },
      { type: "held", label: "Payment Held in Escrow", time: "Jan 14, 2:30 PM", done: true },
      { type: "shipped", label: "Marked for Delivery", time: "Jan 14, 3:00 PM", done: true },
      { type: "delivered", label: "QR Scan on Delivery", time: "Pending", done: false },
      { type: "completed", label: "Funds Released", time: "Pending", done: false },
    ]
  },
};

const STATUS_STEPS = ["pending", "held", "in_transit", "completed"];
const STATUS_LABELS: Record<string, string> = {
  held: "Funds Held", in_transit: "In Transit", completed: "Completed", pending: "Pending"
};
const STATUS_BADGE: Record<string, string> = {
  held: "badge-blue", in_transit: "badge-gold", completed: "badge-green", pending: "badge-gray"
};

export default function EscrowDetail() {
  const { id } = useParams<{ id: string }>();
  const txn = MOCK_TRANSACTIONS[id] || MOCK_TRANSACTIONS["txn1"];

  return (
    <div style={{ minHeight: "100vh", padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text2)", fontSize: 14, marginBottom: 24 }}>
        ← Dashboard
      </Link>

      <div className="animate-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Escrow #{txn.id}</h1>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>{txn.listing}</p>
          </div>
          <span className={`badge ${STATUS_BADGE[txn.status]}`} style={{ fontSize: 13 }}>
            {STATUS_LABELS[txn.status]}
          </span>
        </div>

        {/* Amount */}
        <div className="card" style={{ textAlign: "center", padding: "32px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>ESCROWED AMOUNT</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            K {txn.amount.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)" }}>K {(txn.amount * 0.975).toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>You receive</div>
            </div>
            <div style={{ width: 1, background: "var(--border)" }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)" }}>K {(txn.amount * 0.025).toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Platform fee (2.5%)</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Transaction Details</h3>
          {[
            { label: "Buyer", value: txn.buyer },
            { label: "Delivery Address", value: txn.address },
            { label: "Payment Method", value: "Bank Transfer (BSP)" },
            { label: "Created", value: txn.created },
          ].map(f => (
            <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
              <span style={{ color: "var(--text2)" }}>{f.label}</span>
              <span style={{ fontWeight: 600 }}>{f.value}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Escrow Timeline</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {txn.events.map((ev, i) => (
              <div key={ev.type} style={{ display: "flex", gap: 14, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: ev.done ? "var(--accent)" : "var(--surface)",
                    border: ev.done ? "none" : "2px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, color: ev.done ? "#0A0F0D" : "var(--text3)",
                    zIndex: 1
                  }}>
                    {ev.done ? "✓" : i + 1}
                  </div>
                  {i < txn.events.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: ev.done ? "var(--accent)" : "var(--border)", minHeight: 28, opacity: 0.4 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 20, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: ev.done ? "var(--text)" : "var(--text3)" }}>{ev.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(txn.status === "held" || txn.status === "in_transit") && (
            <Link href={`/escrow/${txn.id}/qr`} style={{ flex: 1 }}>
              <button className="btn-primary" style={{ width: "100%", fontSize: 15, padding: "14px", animation: "pulse-glow 2s infinite" }}>
                📱 Show Delivery QR Code
              </button>
            </Link>
          )}
          <button className="btn-secondary" style={{ padding: "14px 20px", fontSize: 14, color: "var(--red)", borderColor: "rgba(255,68,68,0.3)" }}>
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}
