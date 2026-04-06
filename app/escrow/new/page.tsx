"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MOCK_LISTINGS = [
  { id: "1", title: "Toyota Landcruiser 200 Series", price: 185000, category: "vehicles" },
  { id: "2", title: "Solar Panel Kit 2kW", price: 8500, category: "electronics" },
  { id: "3", title: "Samsung Galaxy S24", price: 2800, category: "electronics" },
];

function NewEscrowForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedListing = searchParams.get("listing") || "";
  const [step, setStep] = useState(1);
  const [listingId, setListingId] = useState(preselectedListing);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [txnId] = useState("txn-" + Math.random().toString(36).slice(2,8).toUpperCase());

  const selectedListing = MOCK_LISTINGS.find(l => l.id === listingId);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) { setStep(s => s + 1); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setCreated(true);
  }

  if (created) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }} className="animate-in">
        <div style={{ fontSize: 72, marginBottom: 20 }}>🔒</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Escrow Created!</h2>
        <p style={{ color: "var(--text2)", marginBottom: 32, fontSize: 15 }}>
          Awaiting payment from {buyerName || "buyer"}
        </p>
        <div className="card" style={{ marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>ESCROW REFERENCE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, color: "var(--accent)", marginBottom: 16 }}>{txnId}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Item", value: selectedListing?.title || "—" },
              { label: "Amount", value: `K ${selectedListing?.price.toLocaleString()}` },
              { label: "Buyer", value: buyerName || buyerEmail },
              { label: "Payment", value: paymentMethod === "bank_transfer" ? "BSP Bank Transfer" : "BRED PNG" },
            ].map(f => (
              <div key={f.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text2)" }}>{f.label}</span>
                <span style={{ fontWeight: 600 }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/dashboard" style={{ flex: 1 }}>
            <button className="btn-secondary" style={{ width: "100%", fontSize: 15 }}>Dashboard</button>
          </Link>
          <Link href={`/escrow/txn1/qr`} style={{ flex: 1 }}>
            <button className="btn-primary" style={{ width: "100%", fontSize: 15 }}>📱 Get QR Code →</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleCreate}>
      {/* Step 1: Select Listing */}
      {step === 1 && (
        <div className="animate-in">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Select Item</h2>
          <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 24 }}>Which listing is this escrow for?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {MOCK_LISTINGS.map(l => (
              <label key={l.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 20px", borderRadius: "var(--radius)",
                border: `2px solid ${listingId === l.id ? "var(--accent)" : "var(--border)"}`,
                background: listingId === l.id ? "var(--accent3)" : "var(--surface)",
                cursor: "pointer", transition: "all 0.2s"
              }}>
                <input type="radio" name="listing" value={l.id} checked={listingId === l.id}
                  onChange={() => setListingId(l.id)} style={{ display: "none" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{l.title}</div>
                  <div style={{ color: "var(--text3)", fontSize: 13 }}>{l.category}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--accent)", fontSize: 16 }}>
                  K {l.price.toLocaleString()}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Buyer Info */}
      {step === 2 && (
        <div className="animate-in">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Buyer Details</h2>
          <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 24 }}>Who is buying this item?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Buyer Full Name</label>
              <input placeholder="e.g. John Namaliu" value={buyerName} onChange={e => setBuyerName(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Buyer Email</label>
              <input type="email" placeholder="buyer@example.com" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Delivery Address</label>
              <textarea placeholder="Full delivery address in PNG" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                rows={3} style={{ resize: "none" }} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Delivery Notes (Optional)</label>
              <input placeholder="e.g. Leave at gate, call on arrival..." value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="animate-in">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Payment Method</h2>
          <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 24 }}>How will the buyer pay?</p>

          {/* Summary */}
          {selectedListing && (
            <div style={{ background: "var(--accent3)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Escrow Amount</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                K {selectedListing.price.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
                You receive K {(selectedListing.price * 0.975).toLocaleString()} after 2.5% platform fee
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {[
              { value: "bank_transfer", label: "BSP Bank Transfer", desc: "Bank South Pacific — most common in PNG", icon: "🏦" },
              { value: "bred_png", label: "BRED PNG", desc: "BRED Bank Papua New Guinea", icon: "🏧" },
              { value: "kina_bank", label: "Kina Bank", desc: "Kina Bank PNG", icon: "💳" },
            ].map(m => (
              <label key={m.value} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px", borderRadius: "var(--radius)",
                border: `2px solid ${paymentMethod === m.value ? "var(--accent)" : "var(--border)"}`,
                background: paymentMethod === m.value ? "var(--accent3)" : "var(--surface)",
                cursor: "pointer", transition: "all 0.2s"
              }}>
                <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value}
                  onChange={() => setPaymentMethod(m.value)} style={{ display: "none" }} />
                <span style={{ fontSize: 22 }}>{m.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                  <div style={{ color: "var(--text3)", fontSize: 12 }}>{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Nav Buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {step > 1 && (
          <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary" style={{ flex: 1 }}>
            ← Back
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={loading || (step === 1 && !listingId)}
          style={{ flex: 2, opacity: (loading || (step === 1 && !listingId)) ? 0.7 : 1 }}>
          {loading ? "Creating Escrow..." : step === 3 ? "🔒 Lock Funds in Escrow →" : "Continue →"}
        </button>
      </div>
    </form>
  );
}

export default function NewEscrowPage() {
  return (
    <div style={{ minHeight: "100vh", padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text2)", fontSize: 14, marginBottom: 28 }}>
          ← Dashboard
        </Link>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 28 }}>🔒</div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>New Escrow Transaction</h1>
              <p style={{ color: "var(--text2)", fontSize: 14 }}>Protect both buyer and seller</p>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ display: "flex", gap: 4 }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "var(--accent)", width: s <= 1 ? "100%" : "0%", transition: "width 0.4s" }} />
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <Suspense fallback={<div>Loading...</div>}>
            <NewEscrowForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
