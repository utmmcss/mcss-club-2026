const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchWithCache(url: string) {
    const now = Date.now();
    const cached = cache.get(url);

    if (cached && now - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    cache.set(url, { data, timestamp: now });
    return data;
}
