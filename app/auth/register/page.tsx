"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sevisId, setSevisId] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true); setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone } }
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    if (data.user) {
      // Simulate SevisPass ID generation and profile update
      const mockId = "SVS-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 99999)).padStart(5, "0");

      // Since handle_new_user trigger creates the profile, we update it
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .update({
          is_verified: true,
          sevispass_id: mockId,
          phone: phone
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      setSevisId(mockId);
      setStep(3);
    }
    setLoading(false);
  }

  if (step === 3) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }} className="animate-in">
          <div style={{ fontSize: 64, marginBottom: 24 }}>🪪</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>SevisPass Issued!</h1>
          <p style={{ color: "var(--text2)", marginBottom: 32 }}>Your digital identity is ready</p>
          <div style={{ background: "var(--surface)", border: "2px solid var(--accent)", borderRadius: "var(--radius-lg)", padding: "28px", marginBottom: 32 }}>
            <p style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>SEVISPASS ID</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: 2 }}>{sevisId}</p>
            <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 12 }}>{fullName}</p>
          </div>
          <button className="btn-primary" style={{ width: "100%" }} onClick={() => router.push("/dashboard")}>
            Enter Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40, justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#0A0F0D" }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>trust.<span style={{ color: "var(--accent)" }}>dspng</span>.tech</span>
        </Link>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
          {[1, 2].map(s => (
            <div key={s} style={{ width: s === step ? 32 : 8, height: 8, borderRadius: 4, background: s <= step ? "var(--accent)" : "var(--border)", transition: "all 0.3s" }} />
          ))}
        </div>

        <div className="card animate-in">
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
              {step === 1 ? "Create Account" : "Verify Identity"}
            </h1>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>
              {step === 1 ? "Step 1 of 2 — Basic info" : "Step 2 of 2 — SevisPass verification (mock)"}
            </p>
          </div>

          {error && (
            <div style={{ background: "rgba(255,68,68,0.1)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 20, color: "var(--red)", fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {step === 1 ? (
              <>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Full Name</label>
                  <input placeholder="Kila Wari" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Password</label>
                  <input type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Phone (PNG)</label>
                  <input placeholder="+675 7XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div style={{ background: "var(--accent3)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "var(--radius)", padding: "14px 16px", fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                  🪪 SevisPass uses your PNG National ID for one-time verification. This is a <strong style={{ color: "var(--text)" }}>mock demo</strong> — enter any value below.
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>PNG National ID Number</label>
                  <input placeholder="NID-XXXXXXXX" value={nationalId} onChange={(e) => setNationalId(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Province</label>
                  <select defaultValue="">
                    <option value="" disabled>Select province</option>
                    {["National Capital District","Morobe","Western Highlands","Eastern Highlands","Madang","East New Britain","West New Britain","Southern Highlands","Sandaun","Milne Bay"].map(p => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Processing..." : step === 1 ? "Continue →" : "Issue SevisPass →"}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: "center", color: "var(--text2)", fontSize: 14 }}>
            Have an account?{" "}
            <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
