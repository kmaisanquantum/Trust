"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  }

  async function handleSevisPassLogin() {
    setLoading(true); setError("");
    // In a real environment, this would call Supabase auth or a mock service.
    // For this demo, we'll simulate a successful login by redirecting directly
    // since the environment doesn't have a real Supabase backend connection.
    console.log("Mock SevisPass Login Initiated");

    // Simulate some work
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40, justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#0A0F0D" }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>trust.<span style={{ color: "var(--accent)" }}>dspng</span>.tech</span>
        </Link>

        <div className="card animate-in">
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>Sign in to your account</p>
          </div>

          {error && (
            <div style={{ background: "rgba(255,68,68,0.1)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 20, color: "var(--red)", fontSize: 14 }}>
              {error}
            </div>
          )}

          <button
            className="btn-secondary"
            onClick={handleSevisPassLogin}
            disabled={loading}
            style={{ width: "100%", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, border: "1px solid var(--accent)", color: "var(--accent)" }}
          >
            <span style={{ fontSize: 20 }}>🪪</span>
            {loading ? "Connecting SevisPass..." : "Continue with SevisPass"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>OR EMAIL</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: "center", color: "var(--text2)", fontSize: 14 }}>
            No account?{" "}
            <Link href="/auth/register" style={{ color: "var(--accent)", fontWeight: 600 }}>Get your SevisPass →</Link>
          </p>
        </div>

        <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: "var(--radius)", background: "var(--accent3)", border: "1px solid rgba(0,255,136,0.15)" }}>
          <p style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>
            🔒 DEMO CREDENTIALS<br />
            Email: demo@trust.png &nbsp;|&nbsp; Pass: Demo1234!
          </p>
        </div>
      </div>
    </div>
  );
}
