import api from "@/services/api.server";

export const config = {
  schedule: "*/5 * * * *" // Run every 5 minutes (UTC time)
};

export async function GET() {
  try {
    const res = await api.get("/cron-courses/check-started");
    console.log("✅ Cron executed. Response:", res.data);

    return Response.json({ success: true, data: res.data });
  } catch (error) {
    console.error("❌ Cron failed:", error?.message || error);
    return Response.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
