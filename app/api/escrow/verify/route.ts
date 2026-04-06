import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decodeQRToken, isQRTokenExpired } from "@/lib/escrow";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const payload = decodeQRToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid QR token" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: txn, error } = await (supabase as any)
    .from("escrow_transactions")
    .select("*")
    .eq("id", payload.txn)
    .eq("qr_token", token)
    .single();

  if (error || !txn) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  if (txn.status === "completed") return NextResponse.json({ error: "Already completed" }, { status: 400 });
  if (txn.qr_expires_at && isQRTokenExpired(txn.qr_expires_at))
    return NextResponse.json({ error: "QR code expired" }, { status: 400 });

  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("escrow_transactions").update({
    status: "completed", delivered_at: now, completed_at: now, qr_token: null,
  }).eq("id", payload.txn);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("transaction_events").insert({
    transaction_id: payload.txn,
    event_type: "funds_released",
    metadata: { released_at: now, payout: txn.seller_payout },
  });

  return NextResponse.json({ success: true, message: "Funds released to seller", payout: txn.seller_payout });
}
