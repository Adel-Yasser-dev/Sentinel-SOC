---
trigger: always_on
---

---

name: nextjs-dashboard-data-fetching
description: Decide how to fetch and manage data in a Next.js (App Router) dashboard - Server Components vs React Query (TanStack Query) vs Server Actions. Use this skill whenever the user is building or refactoring a Next.js dashboard, admin panel, analytics or monitoring page, data table, or any data-heavy UI, and asks things like "should I use React Query or server components", "how do I fetch data in Next.js", "how do I add polling/filters/pagination", or "how do I hydrate React Query from the server", even if they don't name both options explicitly.

---

# Next.js Dashboard Data Fetching

Default answer: **use both, for different jobs.** Server Components load the initial data; React Query owns anything interactive or live. Do not pick one for the whole dashboard.

## Step 1: Classify each widget (not the whole dashboard)

Ask, per widget or section:

| Situation                                                                     | Use                                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Loads once, rarely changes (layout, user info, summary cards, static reports) | Server Component only                                        |
| User-driven filters, search, sorting, pagination                              | React Query (client)                                         |
| Live or auto-refreshing data (stats, alerts, feeds)                           | React Query with `refetchInterval`, or WebSocket/SSE         |
| Create/edit/delete with instant UI feedback                                   | React Query mutations (optimistic updates) or Server Actions |
| Secrets, API keys, sensitive queries                                          | Server side only                                             |
| Infinite scroll, dependent queries                                            | React Query                                                  |

If the dashboard is fully static or report-style, recommend Server Components alone and skip React Query. If the user has not said what the dashboard shows (static vs live), give the default hybrid answer and ask which it is.

## Step 2: Use the hybrid pattern

Fetch on the server for first paint, then let React Query take over on the client.

**Simple version: `initialData`**

```tsx
// app/dashboard/page.tsx (Server Component)
export default async function Page() {
  const initial = await getAlerts();
  return <AlertsTable initialData={initial} />;
}
```

```tsx
// AlertsTable.tsx
"use client";
import { useQuery } from "@tanstack/react-query";

export function AlertsTable({ initialData }: { initialData: Alert[] }) {
  const { data } = useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
    initialData,
    refetchInterval: 15_000,
  });
  return /* table */;
}
```

**Scalable version: `prefetchQuery` + `HydrationBoundary`** (use for bigger apps or many queries on one page)

```tsx
// app/dashboard/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["alerts"], queryFn: getAlerts });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AlertsTable />
    </HydrationBoundary>
  );
}
```

Setup reminders:

- Create the `QueryClient` inside a client `Providers` component with `useState(() => new QueryClient())` so it is not shared between requests.
- Set a `staleTime` (e.g. 30-60s) so hydrated data is not instantly refetched on mount.
- Use the same `queryKey` and a shared fetch function on server and client so cache entries match.
- Put `"use client"` only on interactive leaf components; keep pages and layouts as Server Components.

## Step 3: Flag the common mistakes

- **React Query for everything**: loses server rendering, shows spinners on first load, ships more JS.
- **Server Components for everything in a highly interactive dashboard**: ends up fighting `router.refresh()` and URL search params for every filter and refresh.
- **Fetching secrets or calling internal-only APIs from the client**: move to the server or a route handler.
- **Mismatched query keys** between prefetch and `useQuery`, which causes a double fetch.
- **Passing non-serializable values** (class instances, functions, Dates in some cases) from Server to Client Components.

Also mention, when relevant: Suspense boundaries and `loading.tsx` around slow server-rendered widgets so one slow query does not block the whole page.

## Response format

1. State the recommendation in one or two sentences (hybrid unless the dashboard is static).
2. Show the split for the user's actual widgets if known; otherwise give the decision table.
3. Provide the minimal code for the chosen pattern, matching their stack (TypeScript by default).
4. List the mistakes that apply to their case. Keep it short; do not dump every item.
