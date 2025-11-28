import { NextRouter } from "next/router";

export default function useQueryState(router: NextRouter) {
  const get = (key: string) => {
    const v = router.query[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const rawFilter = get("filter") ?? "all";
  const rawPage = get("page") ?? "1";
  const rawEventId = get("event") ?? null;

  return {
    filter: String(rawFilter),
    page: parseInt(String(rawPage), 10),
    eventId: rawEventId,
  };
}
