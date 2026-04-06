import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "trust.dspng.tech", ts: new Date().toISOString() });
}
