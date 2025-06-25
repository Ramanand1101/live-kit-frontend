// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   const auth = request.headers.get('Authorization');
//   if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new NextResponse('Unauthorized', { status: 401 });
//   }

//   console.log("✅ CRON Triggered at:", new Date().toISOString());

//   return NextResponse.json({ ok: true });
// }
import { NextResponse } from 'next/server';
import api from '@/services/api.server'; // or wherever your `api.js` lives

export async function GET(request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log("✅ CRON Triggered at:", new Date().toISOString());

  try {
    const res = await api.get('/api/cron-courses/check-started');
    console.log("📦 Backend Response:", res.data);

    return NextResponse.json({ ok: true, backendResponse: res.data });
  } catch (error) {
    console.error("❌ Backend API call failed:", error.message);
    return new NextResponse("Backend API call failed", { status: 500 });
  }
}
