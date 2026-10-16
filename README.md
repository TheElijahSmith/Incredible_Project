# Incredible Project — Hard to Swallow

An independent Harding University cafeteria community with a dark interface, sarcastic copy, live chat, food reviews, and official dining menus.

## Features

- Harding MyDiningHub menus grouped by station, with date, meal, and location selectors.
- Server-side menu fetching with a five-minute cache, source links, and retrieval timestamps.
- Shared dining chat refreshed every three seconds.
- Persistent food reviews and one-to-five-star ratings stored in Cloudflare D1.
- Responsive layouts and self-chosen display names.

## Run locally

Requires Node.js 22.13 or newer and pnpm. This repository includes a pnpm lockfile.

```sh
pnpm install --frozen-lockfile
pnpm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_rapid_kabuki.sql
pnpm run dev
```

Apply the initial migration only once per local database. Use the local URL printed by the development server. Local data is separate from the hosted database.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Dining community interface and reviews/chat |
| `app/official-menu.tsx` | Official menu browser |
| `app/api/menu/route.ts` | Read-only Harding menu integration |
| `app/api/posts/route.ts` | Chat and review API |
| `app/globals.css` | Dark theme and responsive styles |
| `db/schema.ts` | D1 schema |
| `drizzle/` | Database migrations |

## Hosting

The current app is hosted through ChatGPT Sites on Cloudflare Workers with a D1 binding named `DB`. `.openai/hosting.json` retains that existing Site identity. Pushing to GitHub does not automatically redeploy the Site. Standalone Cloudflare hosting needs its own account, deployment configuration, and production database migration.

The live Site currently allows only its owner to visit. Reviews use self-chosen, unverified display names. Before opening access broadly, add the account and moderation controls appropriate for your community.

The app is independent of Harding University. Menu content comes from Harding's public MyDiningHub catalog; provider availability and menu changes can affect listings. No substitute dishes appear if retrieval fails.

See [runtime details](docs/runtime.md) for build, database, and environment information.

## Validation

TypeScript checking and the production build passed for the app source. The menu handler was checked against the live Harding dinner feed and rejected an invalid menu selection. Browser interaction testing has not been performed.
