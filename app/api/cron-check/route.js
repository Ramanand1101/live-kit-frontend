export const config = {
  schedule: '*/5 * * * *', // Runs every 5 minutes
};

export async function GET() {
  try {
    const res = await fetch('http://localhost:3001/api/cron-courses/check-started');
    const data = await res.json();
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
