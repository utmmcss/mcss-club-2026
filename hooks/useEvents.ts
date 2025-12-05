import { useEffect, useState } from "react";
import { fetchWithCache } from "@/lib/eventCache";

export default function useEvents({
  filter,
  page,
  perPage,
}: {
  filter: string;
  page: number;
  perPage: number;
}) {
  const [events, setEvents] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        ...(filter !== "all" ? { filter } : {}),
      });

      try {
        const json = await fetchWithCache(`/api/events?${params}`);
        if (!ignore) {
          setEvents(json.events ?? []);
          setMeta(json.meta);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [filter, page, perPage]);

  return { events, meta, loading };
}
