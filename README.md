# Incredible Project — Taste and See

An independent Harding University cafeteria community with a dark interface, sarcastic copy, live chat, food reviews, and official dining menus.

## Features

- Harding MyDiningHub menus grouped by station, with date, meal, and location selectors. Today follows America/Chicago time, rolls over automatically at midnight, refreshes every five minutes, and refreshes when the app resumes. Manually selected dates remain selected until Back to today is pressed.
- Server-side menu fetching with a five-minute cache, source links, and retrieval timestamps.
- Shared dining chat refreshed every three seconds.
- Persistent food reviews and 0–27-star ratings (legacy reviews keep their original five-star scale) stored in Cloudflare D1.
- Review the reviews: signed-in users give food reviews 0–16 stars, with average scores and rating counts. Each account gets one editable rating per review.
- Maximum food/review scores use “The Wild Donkey's quench their thirst.”; zero scores use “Weeping and Gnashing of teeth”.
- Each menu dish has a read-only average slider: 25+ is Beatific, above 4 and below 25 is Aight, and 4 or lower is satanic panic. Aggregates include all food reviews for the matching dish/channel, normalize legacy five-star scores, and refresh every 15 seconds or after a review is posted.
- Responsive layouts and self-chosen display names.
- Caf occupancy panel with an aggregate feed adapter, stale-data labels, and an explicit disconnected state. A Harding-authorized feed is required for real counts; see [occupancy integration](docs/occupancy.md).

## Run locally

Requires Node.js 22.13 or newer and pnpm. This repository includes a pnpm lockfile.

```sh
pnpm install --frozen-lockfile
pnpm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_rapid_kabuki.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_curious_purple_man.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_clever_forge.sql
pnpm run dev
```

Apply each migration only once per local database. Use the local URL printed by the development server. Local data is separate from the hosted database.

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
