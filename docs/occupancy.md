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

## 15-minute swipe estimate

The requested default model assumes each entrance swipe produces exactly one departure 15 minutes later. Use this timestamped aggregate feed to apply the model in the app:

```json
{
  "kind": "swipes",
  "updatedAt": "2026-10-16T23:15:00Z",
  "coverageStartedAt": "2026-10-16T23:00:00Z",
  "source": "Harding Dining swipe feed",
  "entries": [
    {"enteredAt": "2026-10-16T23:05:00Z", "count": 12},
    {"enteredAt": "2026-10-16T23:10:00Z", "count": 8}
  ]
}
```

This illustrative payload yields 20 estimated diners. The provider must supply complete entry counts for at least the preceding 15 minutes, declared by `coverageStartedAt`. Each entry expires at precisely its timestamp plus 15 minutes. Entries exactly 15 minutes old are excluded; newer ones are included. Do not send cumulative totals repeatedly as new entries or duplicate swipe events. No student or card identifiers are needed.

The panel always labels swipe-derived counts as estimates because real visits may be shorter or longer. With a fresh feed it recalculates on every 30-second poll. If the feed stops updating, it freezes the estimate at the last observation time and labels it stale, rather than draining a disconnected feed to a misleading zero. Incomplete coverage or invalid entries show unavailable.

A direct `occupancy` aggregate payload is still supported for a provider that actually accounts for departures; entry totals alone must not be labeled actual occupancy.

Data older than two minutes is visibly labeled stale. A failed or invalid response shows “Count unavailable.” Future timestamps more than one minute ahead are rejected. Zero is a valid count; missing data is never rendered as zero.

This feature is implemented but not connected to Harding’s access-control systems. It needs an authorized aggregate feed before it can display real attendance. The public menu service does not supply swipe records.
