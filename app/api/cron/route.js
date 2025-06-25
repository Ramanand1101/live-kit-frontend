import { NextResponse } from 'next/server';

export async function GET(request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log("✅ CRON Triggered at:", new Date().toISOString());

  return NextResponse.json({ ok: true });
}
