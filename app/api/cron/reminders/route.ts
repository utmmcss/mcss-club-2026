import { NextResponse } from 'next/server';
import { processEventReminders } from '@/lib/scheduler';

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// Recommended: Run every 15 minutes to catch the 24h window

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization'); // verify cron for security
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await processEventReminders();
        return NextResponse.json({
            success: true,
            processedEvents: result.processedEvents,
            processedSubs: result.processedSubs,
            errors: result.errors.length > 0 ? result.errors : undefined,
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    return GET(request);
}
