import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType | null> {
  try {
    if (client) return client;
    const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || '';
    if (!url) return null;
    client = createClient({ url });
    client.on('error', (err) => {
      console.error('Redis error:', err);
    });
    if (!client.isOpen) await client.connect();
    return client;
  } catch (err) {
    console.error('Redis connection failed:', err);
    return null;
  }
}

export async function closeRedis() {
  if (client && client.isOpen) await client.quit();
  client = null;
}
