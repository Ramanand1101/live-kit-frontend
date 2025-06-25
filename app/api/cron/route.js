import { NextResponse } from 'next/server';

export async function GET() {
  console.log("✅ Cron job TRIGGERED at:", new Date().toISOString());
  return NextResponse.json({ ok: true });
}