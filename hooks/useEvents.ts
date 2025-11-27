import { useEffect, useState } from "react";

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
        const res = await fetch(`/api/events?${params}`);
        const json = await res.json();
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
