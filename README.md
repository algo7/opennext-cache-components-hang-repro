# Cache Components: runtime render of a non-prerendered param hangs on workerd

Minimal reproduction for `@opennextjs/cloudflare`.

With `cacheComponents: true`, a request for a dynamic-route param that was
not returned by `generateStaticParams()` hangs the Worker:

```
Error: The Workers runtime canceled this request because it detected that your
Worker's code had hung and would never generate a response.
```

The same build served by `next start` answers correctly.

## App

- `next.config.mjs`: `cacheComponents: true`, nothing else
- `app/[slug]/page.tsx`: `generateStaticParams()` returns `a`, `b`; any other slug calls `notFound()`
- `app/ok/[slug]/page.tsx`: control, `generateStaticParams()` returns `a`; never calls `notFound()`, just renders the slug
- `open-next.config.ts`: static-assets incremental cache (no KV/R2/D1 needed)
- no middleware/proxy, no bindings other than `ASSETS`

## Run

```sh
pnpm install
pnpm preview            # opennextjs-cloudflare build && preview (workerd)
curl -i localhost:8787/a        # 200  prerendered
curl -i localhost:8787/a/b/c    # 404  matches no route
curl -i localhost:8787/zzz      # 500  hung   (expected 404)
curl -i localhost:8787/ok/zzz   # 500  hung   (expected 200)

pnpm build && pnpm start        # plain Node
curl -i localhost:3000/zzz      # 404
curl -i localhost:3000/ok/zzz   # 200
```

## Results (wrangler 4.167.0, workerd 1.20261123.1)

| next | @opennextjs/cloudflare | `/zzz` | `/ok/zzz` |
|---|---|---|---|
| 16.2.11 | 1.20.2 | 404 | 200 |
| 16.2.11 | 1.20.18 | 404 | 200 |
| 16.3.8 | 1.20.11 | hang | hang |
| 16.4.5 | 1.20.16 | hang | hang |
| 16.4.6 | 1.20.18 | hang | hang |

Prerendered params (`/a`, `/ok/a`) and paths matching no route (`/a/b/c`)
answer correctly in every row. The hang is deterministic and does not
affect later requests to prerendered pages.
