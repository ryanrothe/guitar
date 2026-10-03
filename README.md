# Guitar

Songs, not chords. A standalone PWA in the Exercise Library's format (same tokens, cards, type and sync contract), with its own icon and URL. Rebuilt 2026-10-03 on the Opus plan: progress is songs finished plus voice memos, with no minutes, streaks or session log.

- **Live:** https://ryanrothe.github.io/guitar/
- **Source of truth:** `karl/outputs/personal/guitar/app/` (iCloud). `~/Developer/guitar` is only the deploy target; `./deploy.sh` rsyncs from iCloud, commits and pushes.
- **Plan:** `../PLAN-OPUS-2026-10-03.md` · thread `guitar-habit` · the Fable plan and brief beside it are superseded

## Screens
- **Tonight**: until the five basics are marked done, a "Start here" list (tune, hold, fretting hand, pick and strum, chord charts), each with its video and a Done button. After that, the evening session: Open (a song from the finished list, picked by date), Climb (the current song's next step, its lesson video, chord videos, the one-minute drill on step 2, a button to move up a step), Close. A recording card appears on days 1, 30 and 90 until marked.
- **Songs**: the nine-song ladder in three groups. Each row shows its five-step bar; open it for the lesson, chords, new chords, notes, chord videos, step back and forward, and "Make this my song".
- **Progress**: songs at step 4 or beyond, the three recordings, the basics videos, and Sync to Karl (token, sync now, restore, export, import).

## Videos
Thumbnails from `i.ytimg.com` until tapped, then a `youtube-nocookie.com` embed in place (`playsinline`, `start` for timestamps, referrer policy `strict-origin-when-cross-origin`). YouTube now refuses embeds that arrive with no referrer (Error 153), so never add a `no-referrer` policy. IDs live in `V`, `CHORD` and `SONGS` in `app.js`; all were oEmbed-checked 2026-10-03. To check again:
`curl -s -o /dev/null -w '%{http_code}' "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json"` (200 is live, 404 is gone).

## Data
`localStorage["guitar_v2"]`: `{ v:2, started, basics:{id:date}, songs:{id:{step:0-5, done:date|null}}, current, rec:{d1,d30,d90} }`. Step 4 means the song is done. The old `guitar_v1` key is left alone and unused.

## Sync
`shared/sync.js` PUTs the state to `https://workout-sync.ryanrothe.workers.dev/v1/guitar/<token>` on every save. Payload: `{ program:"guitar", schema:2, savedAt, state, summary:{ basicsDone, current, currentStep, songsDone, recordings } }`. A home-screen install has its own storage and mints its own token; Progress shows it. Karl reads it with `automation/workout-sync/pull.py guitar --json` (needs a `"guitar"` entry in `~/.workout-sync.json`, the token Ryan sends once from Progress) only when Ryan asks for help. Nothing in the morning brief or the wrap reads it, by design.

## Deploy
1. Edit in iCloud. Bump `CACHE` in `sw.js` on every deploy (installed PWAs serve stale files forever without it).
2. `cd ~/Developer/guitar && ./deploy.sh "message"`
3. On the phone: open the app on wifi, pull to refresh.

Local preview: `.claude/launch.json` entry `guitar` (port 8786). Sync fails locally by design (the Worker allows localhost only on 8777); test sync on the live URL. Set `localStorage.guitar_sync_off = "1"` in a test browser so test data never reaches the Worker.
