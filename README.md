# Guitar

Fifteen minutes a day, song first. A standalone PWA in the Exercise Library's format (same tokens, cards, type and sync contract), with its own icon and URL.

- **Live:** https://ryanrothe.github.io/guitar/
- **Source of truth:** `karl/outputs/personal/guitar/app/` (iCloud). `~/Developer/guitar` is only the deploy target; `./deploy.sh` rsyncs from iCloud, commits and pushes.
- **Plan:** `../PLAN-2026-10-03.md` · **Brief:** `../DESIGN-BRIEF-2026-10-03.md` · thread `guitar-habit`

## Screens
- **Today**: days 1 to 3 show the beginner ramp (tune, hold, one clean note, Em, D6/9, first count) with Watch links to Justin Guitar, plus a Basics card (strings, frets, chord boxes, buzz fixes) that stays open through day 3. From day 4, the 15-minute session as four blocks with timers (tune 2, one-minute changes 4, section loop 7, play-through 2), a tap counter for the 60-second change rounds (best of two is the score), the log sheet, and a five-minute floor button. Sunday swaps the drill block for the recording.
- **Progress**: week dots against 5, days since last, weeks at 5+, the one-minute-changes line, milestones (days 7, 14, 30, 45, 90), weeks, sessions, and Sync to Karl (token, sync now, restore, export, import).
- **Songs**: the three-stage ladder with candidates, status, the section being worked on, swap within the row.

## Data
`localStorage["guitar_v1"]`: `{ v:1, started, sessions:[{id,date,min,changes,song,section,recording,note,floor}], songs:[{stage,title,artist,chords,lesson,status,section}] }`. One session per date. `guitar_run` holds today's in-progress timers so a reload does not lose them.

## Sync
`shared/sync.js` PUTs the state to `https://workout-sync.ryanrothe.workers.dev/v1/guitar/<token>` on every save (same Worker and contract as the Exercise Library; the Worker already allows this origin). Payload: `{ program:"guitar", schema:1, savedAt, state, entries, summary }`. A home-screen install has its own storage and mints its own token; Progress shows it. Karl reads it with `automation/guitar/read_log.py`, which falls back to the vault plan note's Practice Log table when no token is on file.

## Deploy
1. Edit in iCloud. Bump `CACHE` in `sw.js` on every deploy (installed PWAs serve stale files forever without it).
2. `cd ~/Developer/guitar && ./deploy.sh "message"`
3. On the phone: open the app on wifi, pull to refresh.

Local preview: `.claude/launch.json` entry `guitar` (port 8786). Sync fails locally by design (the Worker allows localhost only on 8777); test sync on the live URL.
