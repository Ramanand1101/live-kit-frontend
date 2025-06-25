// app/api/cron-courses/route.js

import api from '@/services/api.server';

export async function GET() {
  try {
    console.log('⏰ Cron triggered at', new Date().toISOString());

    const res = await api.get('/api/cron-courses/check-started'); // ✅ Adjusted path if internal

    console.log('✅ Cron executed successfully:', res.data);

    return Response.json({ success: true, data: res.data });
  } catch (error) {
    console.error('❌ Cron failed:', error.message || error);
    return Response.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
