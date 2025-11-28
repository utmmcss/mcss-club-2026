import { NextResponse } from "next/server";
import { processEventReminders } from "@/lib/scheduler";

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  const header = req.headers.get("x-cron-secret");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7);
    if (token === secret) return true;
  }
  if (header && header === secret) return true;
  return false;
}

async function handle() {
  try {
    const summary = await processEventReminders();
    return NextResponse.json(summary, {
      status: 200,
      headers: {
        "cache-control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handle();
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handle();
}
