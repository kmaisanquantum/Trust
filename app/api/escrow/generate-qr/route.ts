import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateQRToken } from "@/lib/escrow";

export async function POST(req: NextRequest) {
  const { transactionId } = await req.json();
  if (!transactionId) return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const token = generateQRToken(transactionId);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("escrow_transactions")
    .update({ qr_token: token, qr_expires_at: expiresAt, status: "in_transit", shipped_at: new Date().toISOString() })
    .eq("id", transactionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("transaction_events").insert({
    transaction_id: transactionId,
    event_type: "qr_generated",
    metadata: { expires_at: expiresAt },
  });

  return NextResponse.json({ token, expiresAt, qrUrl: `https://trust.dspng.tech/escrow/verify?token=${token}` });
}
