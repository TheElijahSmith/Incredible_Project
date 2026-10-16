# Caf occupancy integration

The Caf panel polls `/api/occupancy` every 30 seconds. Until a feed is configured, it displays “Swipe feed not connected” without a fabricated count.

Configure server-side runtime settings through the hosting provider:

- `CAF_OCCUPANCY_FEED_URL`: an HTTPS endpoint supplied or approved by Harding Dining or campus IT, returning the aggregate payload below.
- `CAF_OCCUPANCY_FEED_TOKEN`: optional bearer credential, stored as a runtime secret. Never commit credentials or put them in browser code.

Example payload (illustration only, not real attendance data):

```json
{
  "count": 73,
  "updatedAt": "2026-10-16T23:15:00Z",
  "kind": "occupancy",
  "source": "Harding Dining",
  "method": "Current occupancy calculated from entries and departures"
}
```

`count` must be a nonnegative integer, `updatedAt` an ISO timestamp with timezone, and `kind` either `occupancy` or `estimate`. Include source and method text. The proxy returns only these aggregate fields; individual card IDs and swipe records are not accepted or displayed.

The data provider must account for departures to describe its number as current occupancy. Entry-only swipe totals are arrivals, not current occupancy. If Harding supplies a dwell-time model rather than departures, set `kind` to `estimate` and explain the model and time window in `method`. The app does not invent an average visit duration or convert arrivals into headcount.

Data older than two minutes is visibly labeled stale. A failed or invalid response shows “Count unavailable.” Future timestamps more than one minute ahead are rejected. Zero is a valid count; missing data is never rendered as zero.

This feature is implemented but not connected to Harding’s access-control systems. It needs an authorized aggregate feed before it can display real attendance. The public menu service does not supply swipe records.
