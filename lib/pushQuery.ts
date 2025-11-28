import { NextRouter } from "next/router";

export default function pushQuery(
  router: NextRouter,
  updates: Record<string, any>
) {
  const query = { ...router.query };

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      delete query[key];
    } else {
      query[key] = value;
    }
  });

  router.push({ pathname: router.pathname, query }, undefined, {
    shallow: true,
  });
}
