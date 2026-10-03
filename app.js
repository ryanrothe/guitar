/* Guitar — fifteen minutes a day, song first. Plan: karl/outputs/personal/guitar/PLAN-2026-10-03.md
   Three views (Today, Progress, Songs), one storage key, sync to Karl through shared/sync.js. */
(function () {
  "use strict";
  const KEY = "guitar_v1", RUN_KEY = "guitar_run", START = "2026-10-04", TARGET = 5;
  const pad = (n) => String(n).padStart(2, "0");
  const dstr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => dstr(new Date());
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return dstr(d); };
  const dayN = (s) => Math.round((parse(s) - parse(START)) / 86400000) + 1;
  const monday = (s) => { const d = parse(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dstr(d); };
  const isSunday = (s) => parse(s).getDay() === 0;
  const fmtDate = (s) => parse(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = (p) => p + Math.random().toString(36).slice(2, 9);
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const $ = (id) => document.getElementById(id);

  /* ------------------------------------------------------------------ the ladder */
  const LADDER = [
    { stage: 1, days: [1, 14], chords: "Em and D6/9", goal: "Full tempo with the recording. Day 7: a slow-tempo play-through.",
      candidates: [
        { title: "A Horse With No Name", artist: "America", chords: "Em, D6/9", lesson: "https://www.justinguitar.com/songs/america-a-horse-with-no-name-chords-tabs-guitar-lesson-sg-014" },
        { title: "Eleanor Rigby", artist: "The Beatles", chords: "Em, C" },
        { title: "Songbird", artist: "Oasis", chords: "G, Em" },
        { title: "Jambalaya", artist: "Hank Williams", chords: "C, G" }] },
    { stage: 2, days: [15, 45], chords: "G, C, D, Em and one strum pattern", goal: "Play-through with the strum pattern. Day 30: play Song 1 for the family.",
      candidates: [
        { title: "Knockin' on Heaven's Door", artist: "Bob Dylan", chords: "G, D, Am, C" },
        { title: "Stand By Me", artist: "Ben E. King", chords: "G, Em, C, D" },
        { title: "Ring of Fire", artist: "Johnny Cash", chords: "G, C, D" },
        { title: "Wagon Wheel", artist: "Old Crow Medicine Show", chords: "G, D, Em, C" },
        { title: "Amazing Grace", artist: "hymn", chords: "G, C, D" },
        { title: "Brown Eyed Girl", artist: "Van Morrison", chords: "G, C, D, Em" }] },
    { stage: 3, days: [46, 90], chords: "A, D, E or a capo song, plus Am", goal: "Three-song setlist recorded on day 90.",
      candidates: [
        { title: "Three Little Birds", artist: "Bob Marley", chords: "A, D, E" },
        { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", chords: "D, C, G" },
        { title: "I'm Yours", artist: "Jason Mraz, capo 4", chords: "C, G, Am, F" },
        { title: "Let It Be", artist: "The Beatles", chords: "C, G, Am, F" },
        { title: "Come Thou Fount", artist: "hymn", chords: "G, C, D, Em" }] }
  ];
  const MILESTONES = [
    { day: 7, q: "Playing along with Song 1 at slow tempo, both chords?" }, { day: 14, q: "Song 1 at full tempo with the recording?" },
    { day: 30, q: "Song 1 played for the family?" }, { day: 45, q: "Song 2 through with the strum pattern?" },
    { day: 90, q: "Three-song setlist recorded?" }];
  const STATUS = [["not-started", "Not started"], ["learning", "Learning"], ["slow", "Slow tempo"], ["full", "Full tempo"], ["recorded", "Recorded"]];
  const SECTIONS = ["Intro", "Verse", "Chorus", "Verse and chorus", "Full, slow", "Full, tempo"];
  const BLOCKS = [
    { id: "tune", label: "Tune and warm", sub: "Tuner app. Fret 1-2-3-4 up and down each string, slowly.", min: 2 },
    { id: "changes", label: "One-minute changes", sub: "Hardest transition in the song. Two rounds. Best count is the score.", min: 4 },
    { id: "loop", label: "Section loop", sub: "Current section with the recording at 0.75x. Move on when it is clean.", min: 7 },
    { id: "play", label: "Play it through", sub: "Start to finish, however it sounds. Then log.", min: 2 }];
  /* Days 1 to 3 are the ramp. Ryan starts from zero (2026-10-03): no tuning, no chords, no chord boxes.
     Justin Guitar's Module 0 and the Horse lesson carry the video; these blocks carry the order. */
  const LINKS = {
    tune: "https://www.justinguitar.com/guitar-lessons/how-to-tune-a-guitar-for-beginners-b1-101",
    basics: "https://www.justinguitar.com/modules/before-you-begin-guitar-basics",
    course: "https://www.justinguitar.com/classes/beginner-guitar-course-grade-one",
    horse: "https://www.justinguitar.com/songs/america-a-horse-with-no-name-chords-tabs-guitar-lesson-sg-014"
  };
  const RAMP = {
    1: [
      { id: "r1-tune", label: "Tune it, first time", sub: "Install a tuner app (GuitarTuna is free). Thickest string is the low E, nearest your face. Pluck one string, turn its peg until the app says it is on. Six strings: E A D G B e.", min: 6, link: LINKS.tune },
      { id: "r1-hold", label: "Hold it", sub: "Sit. Waist of the guitar on your right thigh, neck tilted slightly up, left thumb flat behind the neck, wrist relaxed.", min: 2, link: LINKS.basics },
      { id: "r1-note", label: "One clean note", sub: "Index fingertip on the low E string, just behind the 3rd metal fret wire. Press, pluck. Buzz means move closer to the wire or press with the very tip. Do it on every string.", min: 5 },
      { id: "r1-strum", label: "Strum open strings", sub: "All six strings, down strokes only, counting a slow 1 2 3 4. Pick or thumb. That is a bar.", min: 2 }],
    2: [
      { id: "r2-tune", label: "Tune", sub: "Every session starts here from now on. It gets fast.", min: 2, link: LINKS.tune },
      { id: "r2-em", label: "Learn Em", sub: "Open the Horse lesson and read the Em chord box: the grid is the neck, dots are fingertips. Two fingers, one fret. Place, strum, pluck each string one at a time to find the muted one, fix it, lift, place again. Ten times.", min: 7, link: LINKS.horse },
      { id: "r2-strum", label: "Strum Em in time", sub: "Four slow down strokes per bar, counting 1 2 3 4, four bars in a row.", min: 4 },
      { id: "r2-play", label: "Play with the record", sub: "Start the song at 0.75x on YouTube and strum Em along with it, ignoring the second chord. You are playing a song.", min: 2 }],
    3: [
      { id: "r3-tune", label: "Tune", sub: "One minute now.", min: 1, link: LINKS.tune },
      { id: "r3-d6", label: "Learn D6/9", sub: "The second chord in the lesson (Justin calls it D6). Same drill: place, pluck each string, fix, lift, repeat. Ten times.", min: 6, link: LINKS.horse },
      { id: "r3-switch", label: "Switch Em to D6/9", sub: "No strumming. Em, then D6/9, then back. As slow as it takes to land clean. Ten switches. Notice which finger can stay close to the neck.", min: 5 },
      { id: "r3-count", label: "First one-minute count", sub: "Run one 60-second round below and log whatever the number is. Two to six is normal on day 3. That number is the scoreboard from here on.", min: 3 }]
  };
  const rampDay = (n) => (n >= 1 && n <= 3 ? n : n < 1 ? 1 : 0);

  /* ------------------------------------------------------------------ state */
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  function fresh() {
    return { v: 1, started: START, sessions: [],
      songs: LADDER.map((l) => l.stage === 1 ? Object.assign({ stage: 1, status: "learning", section: "Verse" }, l.candidates[0]) : { stage: l.stage, title: null, status: "not-started", section: "Verse" }) };
  }
  let S = (() => { try { const s = JSON.parse(lsGet(KEY) || "null"); return s && s.v === 1 ? s : fresh(); } catch (e) { return fresh(); } })();
  function save() {
    lsSet(KEY, JSON.stringify(S));
    GSync.schedule();
  }
  let R = (() => { try { const r = JSON.parse(lsGet(RUN_KEY) || "null"); return r && r.date === today() ? r : null; } catch (e) { return null; } })();
  function run() {
    if (!R || R.date !== today()) R = { date: today(), done: {}, rounds: [], tapping: null, timer: null };
    return R;
  }
  const saveRun = () => lsSet(RUN_KEY, JSON.stringify(R));

  const sessions = () => S.sessions.slice().sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  const byDate = (d) => S.sessions.find((s) => s.date === d);
  const activeStage = (d) => { const n = dayN(d); return LADDER.find((l) => n <= l.days[1]) || LADDER[2]; };
  const songFor = (stage) => S.songs.find((s) => s.stage === stage);
  const currentSong = () => { const st = activeStage(today()); const s = songFor(st.stage); return s && s.title ? s : songFor(1); };
  function weekSessions(mon) { const set = new Set(); S.sessions.forEach((s) => { if (s.date >= mon && s.date < addDays(mon, 7)) set.add(s.date); }); return set; }
  function weekRecorded(mon) { return S.sessions.some((s) => s.date >= mon && s.date < addDays(mon, 7) && s.recording); }
  function weekStreak() {
    let n = 0, mon = monday(today());
    if (weekSessions(mon).size < TARGET) mon = addDays(mon, -7);
    while (mon >= monday(START) && weekSessions(mon).size >= TARGET) { n++; mon = addDays(mon, -7); }
    return n;
  }

  /* ------------------------------------------------------------------ sync contract */
  GSync.init({ slug: "guitar", storageKey: KEY, hasData: () => S.sessions.length > 0,
    payload: () => ({ state: S, entries: sessions().map((s) => ({ date: s.date, min: s.min, changes: s.changes, song: s.song, section: s.section, recording: !!s.recording, note: s.note || "", floor: !!s.floor })),
      summary: { started: START, dayN: dayN(today()), thisWeek: weekSessions(monday(today())).size, target: TARGET, recordedThisWeek: weekRecorded(monday(today())), weekStreak: weekStreak(), song: currentSong().title } }) });

  /* ------------------------------------------------------------------ render */
  let view = location.hash.replace("#", "") || "today";
  if (!["today", "progress", "songs"].includes(view)) view = "today";
  const I = {
    today: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><rect x="7.5" y="13" width="4" height="4" rx="1"/></svg>',
    progress: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M7.5 15l4-4.5 3 3L20 7.5"/></svg>',
    songs: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>'
  };
  function paintTabs() {
    $("tabs").innerHTML = [["today", "Today"], ["progress", "Progress"], ["songs", "Songs"]].map(([k, l]) =>
      `<button class="tab" data-view="${k}"${k === view ? ' aria-current="page"' : ""}><span class="ico">${I[k]}</span><span>${l}</span></button>`).join("");
  }
  function render() {
    paintTabs();
    const app = $("app");
    app.innerHTML = view === "today" ? renderToday() : view === "progress" ? renderProgress() : renderSongs();
    GSync.paint();
    window.scrollTo(0, 0);
  }
  function go(v) { view = v; location.hash = v; render(); }

  /* ------------------------------------------------------------------ today */
  const clock = (sec) => `${Math.floor(sec / 60)}:${pad(sec % 60)}`;
  function renderToday() {
    const t = today(), n = dayN(t), r = run(), song = currentSong(), stage = activeStage(t), logged = byDate(t), sun = isSunday(t);
    const ms = MILESTONES.find((m) => m.day === n);
    const head = `<header class="page-head"><div><div class="eyebrow">${DOW[parse(t).getDay()]} · ${fmtDate(t)}${n >= 1 ? ` · <span class="olive">day ${n}</span>` : ` · starts ${fmtDate(START)}`}</div><h1>Today</h1></div></header>`;
    const songCard = `<section class="card song-card"><div class="eyebrow">Song ${stage.stage} · days ${stage.days[0]} to ${stage.days[1]}</div><div class="title">${esc(song.title)}</div><div class="sub">${esc(song.artist)}${song.section ? ` · working on: <b>${esc(song.section)}</b>` : ""}</div>
      <div class="chips"><span class="chip">${esc(song.chords)}</span><span class="chip">${esc(STATUS.find((x) => x[0] === song.status)[1])}</span></div>
      ${song.lesson ? `<a class="link olive" href="${esc(song.lesson)}" target="_blank" rel="noopener">Open the lesson ›</a>` : ""}</section>`;
    const msCard = ms ? `<section class="card pad" style="border-color:var(--olive)"><div class="eyebrow olive">Day ${ms.day} check-in</div><div style="font-size:16px;font-weight:600;margin-top:4px">${esc(ms.q)}</div><div class="hint" style="margin-top:4px">Yes or no. Put the answer in today's note when you log.</div></section>` : "";
    if (logged) {
      return head + songCard + msCard + `<section class="card pad"><div class="eyebrow olive">Logged today</div>
        <div class="big" style="margin-top:6px"><b>${logged.changes != null ? logged.changes : "–"}</b><span>clean changes in 60 s</span></div>
        <div class="hint" style="margin-top:6px">${logged.min} min · ${esc(logged.section)}${logged.recording ? " · recorded" : ""}${logged.floor ? " · floor session" : ""}${logged.note ? ` · ${esc(logged.note)}` : ""}</div>
        <div class="actions2" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px"><button class="btn" data-act="edit" data-id="${logged.id}">Edit</button><button class="btn btn-ghost" data-act="go" data-view="progress">Progress ›</button></div></section>` + weekStrip(t);
    }
    const rd = rampDay(n);
    const todayBlocks = rd ? RAMP[rd] : BLOCKS;
    const blocks = todayBlocks.map((b) => {
      if (!rd && b.id === "changes" && sun) b = { id: "changes", label: "Record 30 to 60 seconds", sub: "Sunday swaps the drill for the recording. Phone propped up, whole song, keep every take.", min: 4 };
      const done = !!r.done[b.id];
      const live = r.timer && r.timer.block === b.id;
      const left = live ? Math.max(0, Math.round((r.timer.endsAt - Date.now()) / 1000)) : b.min * 60;
      return `<div class="block${done ? " done" : ""}"><button class="chk" data-act="toggle" data-block="${b.id}" aria-label="Mark ${esc(b.label)} done">${done ? I.check : ""}</button>
        <div class="t"><b>${esc(b.label)}</b><small>${esc(b.sub)}${b.link ? ` <a class="olive" href="${esc(b.link)}" target="_blank" rel="noopener" style="font-weight:700">Watch ›</a>` : ""}</small></div>
        ${done ? "" : `<button class="clock${live ? " live" : ""}" data-act="timer" data-block="${b.id}" data-min="${b.min}" aria-label="${live ? "Stop" : "Start"} ${b.min} minute timer">${clock(left)}</button>`}</div>`;
    }).join("");
    const rampHead = rd ? `<div class="row-head"><span class="eyebrow olive">Starting from zero · ramp day ${rd} of 3</span><span class="hint">${rd === 3 ? "tomorrow: the full session" : "no counting yet"}</span></div>` : "";
    const tapping = r.tapping, tapLeft = tapping ? Math.max(0, Math.round((tapping.endsAt - Date.now()) / 1000)) : 60;
    const best = r.rounds.length ? Math.max.apply(null, r.rounds) : null;
    const changes = `<section class="card changes"><div class="top"><b>One-minute changes</b><small>${esc(song.chords)}</small></div>
      <div class="tapzone${tapping ? " live" : ""}" data-act="tap" role="button" tabindex="0" aria-label="${tapping ? "Tap once per clean change" : "Start a 60 second round"}">
        <b>${tapping ? tapping.count : (best != null ? best : "Start")}</b><small>${tapping ? `tap each clean change · ${tapLeft}s left` : (r.rounds.length ? `best of ${r.rounds.length} round${r.rounds.length > 1 ? "s" : ""} · tap for round ${r.rounds.length + 1}` : "tap to start round 1")}</small></div>
      <div class="rounds">${r.rounds.map((c, i) => `<span>Round ${i + 1}: <b>${c}</b></span>`).join("")}${r.rounds.length ? `<button class="textbtn" data-act="clear-rounds" style="margin-left:auto">Reset</button>` : ""}</div></section>`;
    const actions = `<section class="card pad" style="display:flex;flex-direction:column;gap:10px"><button class="btn btn-olive btn-block" data-act="log">Log today's session</button>
      <button class="btn btn-ghost" data-act="floor">Floor session: played it through once (5 min)</button></section>`;
    const showChanges = !rd || rd === 3;
    return head + songCard + msCard + rampHead + `<section class="card list">${blocks}</section>` + (showChanges ? changes : "") + actions + weekStrip(t) + basicsCard(n);
  }
  function basicsCard(n) {
    return `<details class="card pad"${n <= 3 ? " open" : ""}><summary class="eyebrow" style="cursor:pointer;list-style:none">Basics · tap to ${n <= 3 ? "close" : "open"}</summary>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;font-size:14px;line-height:1.5">
        <div><b>Strings.</b> Thickest to thinnest: E A D G B e. The thick low E is nearest your face. "Eddie Ate Dynamite, Good Bye Eddie."</div>
        <div><b>Frets.</b> The metal wires. "3rd fret" means the space just behind the 3rd wire counting from the headstock. Press right behind the wire, not in the middle of the space.</div>
        <div><b>Chord box.</b> Six vertical lines are the strings (low E on the left), horizontal lines are frets, dots are fingertips, a number on a dot is which finger (1 index, 2 middle, 3 ring, 4 pinky), O above a string means play it open, X means skip it.</div>
        <div><b>Buzz or mute.</b> Fingertip not pad, closer to the fret wire, arch the finger so it does not touch the string below, thumb behind the neck. Pluck each string one at a time to find the culprit.</div>
        <div><b>Sore fingertips.</b> Normal through day 14. Stop at 10 minutes if they are done. Calluses end it.</div>
        <div><b>Tuning.</b> Tuner app, one string at a time, turn the peg slowly. Sharp means too high, flat means too low. <a class="olive" href="${LINKS.tune}" target="_blank" rel="noopener" style="font-weight:700">Justin's tuning lesson ›</a></div>
        <div><a class="olive" href="${LINKS.basics}" target="_blank" rel="noopener" style="font-weight:700">Module 0: Before You Begin ›</a> · <a class="olive" href="${LINKS.course}" target="_blank" rel="noopener" style="font-weight:700">Beginner course ›</a></div>
      </div></details>`;
  }
  function weekStrip(t) {
    const mon = monday(t), done = weekSessions(mon), rec = new Set(S.sessions.filter((s) => s.recording).map((s) => s.date));
    const cells = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(mon, i), on = done.has(d), past = d < t;
      cells.push(`<div><span${d === t ? ' class="now"' : ""}>${DOW[parse(d).getDay()]}</span><div class="dot ${on ? "on" : past ? "past" : "open"}${rec.has(d) ? " rec" : ""}">${on ? I.check : ""}</div></div>`);
    }
    return `<section class="card pad"><div class="row-head" style="padding:0;min-height:0;margin-bottom:10px"><span class="eyebrow">This week · ${done.size} of ${TARGET}</span><span class="hint">${weekRecorded(mon) ? "recorded" : "no recording yet"}</span></div><div class="strip">${cells.join("")}</div></section>`;
  }

  /* ------------------------------------------------------------------ progress */
  function renderProgress() {
    const t = today(), all = sessions(), mon = monday(t), last = all[all.length - 1];
    const since = last ? Math.round((parse(t) - parse(last.date)) / 86400000) : null;
    const head = `<header class="page-head"><div><div class="eyebrow">Day ${Math.max(0, dayN(t))} of 90</div><h1>Progress</h1></div></header>`;
    const stats = `<section class="card pad"><div class="stats">
      <div class="stat"><div class="v">${weekSessions(mon).size}<span style="font-size:15px;color:var(--muted)"> / ${TARGET}</span></div><div class="k">this week</div></div>
      <div class="stat"><div class="v">${since == null ? "–" : since}</div><div class="k">days since last</div></div>
      <div class="stat"><div class="v">${weekStreak()}</div><div class="k">weeks at ${TARGET}+</div></div></div></section>`;
    const pts = all.filter((s) => s.changes != null);
    let chart = `<section class="card pad chart"><div class="eyebrow">One-minute changes</div>`;
    if (pts.length < 2) chart += `<div class="empty">Two logged counts draw the line.</div>`;
    else {
      const W = 320, H = 130, px = 14, py = 14, max = Math.max.apply(null, pts.map((p) => p.changes)), min = Math.min.apply(null, pts.map((p) => p.changes));
      const x = (i) => px + (i / (pts.length - 1)) * (W - 2 * px), y = (v) => H - py - ((v - Math.max(0, min - 2)) / Math.max(1, max - Math.max(0, min - 2))) * (H - 2 * py);
      const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.changes).toFixed(1)}`).join(" ");
      const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.changes).toFixed(1)}" r="4" fill="${p.recording ? "#C27C0E" : "#2F6B4F"}"/>`).join("");
      chart += `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Clean chord changes per session, ${pts[0].changes} to ${last.changes}"><path d="${line}" fill="none" stroke="#2F6B4F" stroke-width="2.2" stroke-linejoin="round"/>${dots}
        <text x="${px}" y="${H - 1}" font-size="10" fill="#5C5F66">${fmtDate(pts[0].date)}</text><text x="${W - px}" y="${H - 1}" font-size="10" fill="#5C5F66" text-anchor="end">${fmtDate(pts[pts.length - 1].date)}</text>
        <text x="${W - px}" y="11" font-size="10" fill="#5C5F66" text-anchor="end">best ${max}</text></svg>
        <div class="legend"><span><i style="background:#2F6B4F"></i>session best</span><span><i style="background:#C27C0E"></i>recording day</span></div>
        <div class="hint" style="margin-top:6px">Read it this way: each dot is one session's best count of clean changes in 60 seconds. Through the first month this line climbs almost every session. A flat week means the transition needs the anchor-finger drill, not more strumming.</div>`;
    }
    chart += `</section>`;
    const n = dayN(t);
    const ms = `<section class="card list">${MILESTONES.map((m) => { const d = addDays(START, m.day - 1); const cls = m.day === n ? "now" : m.day < n ? "past" : ""; return `<div class="ms ${cls}"><div class="d">D${m.day}</div><div class="t"><b>${esc(m.q)}</b><small>${fmtDate(d)}${m.day === n ? " · today" : m.day < n ? "" : ` · in ${m.day - n} days`}</small></div></div>`; }).join("")}</section>`;
    const weeks = []; for (let m = monday(START); m <= mon; m = addDays(m, 7)) weeks.push(m);
    const wk = `<section class="card list">${weeks.slice().reverse().map((m) => { const c = weekSessions(m).size; return `<div class="row"><div class="t"><b>Week of ${fmtDate(m)}</b><small>${weekRecorded(m) ? "recorded" : m === mon ? "no recording yet" : "no recording"}</small></div><div class="n" style="color:${c >= TARGET ? "var(--olive)" : "var(--ink)"}">${c}<span style="font-size:13px;color:var(--muted)">/${TARGET}</span></div></div>`; }).join("")}</section>`;
    const log = all.length ? `<section class="card list">${all.slice().reverse().slice(0, 30).map((s) => `<button class="row" style="width:100%;border:0;background:transparent;text-align:left;cursor:pointer" data-act="edit" data-id="${s.id}"><div class="t"><b>${fmtDate(s.date)} · ${esc(s.section)}</b><small>${s.min} min${s.recording ? " · recorded" : ""}${s.floor ? " · floor" : ""}${s.note ? ` · ${esc(s.note)}` : ""}</small></div><div class="n">${s.changes != null ? s.changes : "–"}</div></button>`).join("")}</section>` : `<section class="card"><div class="empty">No sessions yet. Day 1 is ${fmtDate(START)}.</div></section>`;
    const about = `<section class="card pad sync-card"><h3>Sync to Karl</h3><p>Every save posts this app's data to a private sync endpoint so Karl can read it and coach from it. The phone stays the source of truth. Give Karl the device token once.</p>
      <p><strong>Device token:</strong> <code id="sync-token" style="user-select:all;font-size:13px">${GSync.token()}</code><br><span id="sync-status" style="font-size:12px;color:var(--muted)">Sync: not yet</span></p>
      <div class="ex-actions"><button class="btn" data-act="copy-token">Copy token</button><button class="btn" data-act="sync-now">↑ Sync now</button><button class="btn" data-act="restore">↓ Restore from a token</button></div>
      <div class="ex-actions" style="margin-top:8px"><button class="btn" data-act="export">Export JSON</button><label class="btn" style="cursor:pointer">Import JSON<input type="file" accept="application/json" id="import-file" hidden></label></div></section>`;
    return head + stats + chart + `<div class="row-head"><span class="eyebrow">Milestones</span></div>` + ms + `<div class="row-head"><span class="eyebrow">Weeks</span></div>` + wk + `<div class="row-head"><span class="eyebrow">Sessions</span></div>` + log + about;
  }

  /* ------------------------------------------------------------------ songs */
  function renderSongs() {
    const t = today(), n = dayN(t);
    const head = `<header class="page-head"><div><div class="eyebrow">Three songs · 90 days</div><h1>Songs</h1></div></header>`;
    const cards = LADDER.map((l) => {
      const s = songFor(l.stage), active = n >= l.days[0] && n <= l.days[1];
      const d0 = addDays(START, l.days[0] - 1), d1 = addDays(START, l.days[1] - 1);
      const body = s.title
        ? `<div class="title" style="font-family:var(--disp);font-stretch:80%;font-weight:800;font-size:24px;line-height:1.05;margin-top:4px">${esc(s.title)}</div><div class="sub" style="font-size:13px;color:var(--muted)">${esc(s.artist)} · ${esc(s.chords)}</div>
           ${s.lesson ? `<a class="link olive" href="${esc(s.lesson)}" target="_blank" rel="noopener">Open the lesson ›</a>` : ""}
           <div class="lab" style="margin-top:12px">Status</div><div class="seg olive">${STATUS.map(([k, lab]) => `<button data-act="status" data-stage="${l.stage}" data-status="${k}"${s.status === k ? ' class="on"' : ""} style="font-size:12px;padding:0 2px">${lab}</button>`).join("")}</div>
           <div class="lab" style="margin-top:12px">Working on</div><select class="field" data-act="section" data-stage="${l.stage}">${SECTIONS.map((x) => `<option${s.section === x ? " selected" : ""}>${x}</option>`).join("")}</select>`
        : `<div style="font-size:15px;margin-top:4px">Pick when you get there. ${l.candidates.length} candidates, or name your own.</div>`;
      return `<section class="card pad" style="display:flex;flex-direction:column;gap:6px${active ? ";border-color:var(--olive)" : ""}"><div class="stage-head"><span class="eyebrow">Song ${l.stage} · days ${l.days[0]} to ${l.days[1]}</span><small>${fmtDate(d0)} to ${fmtDate(d1)}</small></div>
        <div class="hint">${esc(l.chords)}. Done when: ${esc(l.goal)}</div>${body}
        <button class="btn" style="margin-top:10px" data-act="swap" data-stage="${l.stage}">${s.title ? "Swap the song" : "Pick the song"}</button></section>`;
    }).join("");
    return head + `<section class="card pad hint" style="font-size:13px">The song is disposable, the habit is not. Not fun after three sessions: swap it inside its row. Never swap the plan.</section>` + cards;
  }

  /* ------------------------------------------------------------------ sheets */
  function openSheet(html) { $("sheet").innerHTML = `<div class="grabber"></div>` + html; $("sheet-wrap").hidden = false; }
  function closeSheet() { $("sheet-wrap").hidden = true; $("sheet").innerHTML = ""; }
  function logSheet(existing) {
    const t = today(), r = run(), song = currentSong();
    const best = r.rounds.length ? Math.max.apply(null, r.rounds) : "";
    const s = existing || { date: t, min: 15, changes: best, section: song.section || "Verse", recording: isSunday(t), note: "" };
    openSheet(`<div class="sheet-head"><h2>${existing ? "Edit session" : "Log session"}</h2><button class="x-btn" data-act="close" aria-label="Close">×</button></div>
      <div class="grid2"><div><label class="lab" for="f-date">Date</label><input class="field" id="f-date" type="date" value="${s.date}"></div><div><label class="lab" for="f-min">Minutes</label><input class="field" id="f-min" type="number" inputmode="numeric" min="1" max="120" value="${s.min}"></div></div>
      <div class="grid2"><div><label class="lab" for="f-changes">Clean changes in 60 s</label><input class="field" id="f-changes" type="number" inputmode="numeric" min="0" max="200" value="${s.changes == null ? "" : s.changes}" placeholder="${rampDay(dayN(t)) && rampDay(dayN(t)) < 3 ? "from day 3" : "best round"}"></div>
        <div><label class="lab" for="f-section">Section</label><select class="field" id="f-section">${SECTIONS.map((x) => `<option${s.section === x ? " selected" : ""}>${x}</option>`).join("")}</select></div></div>
      <div><label class="lab">Recording made</label><div class="seg olive" id="f-rec"><button data-rec="1"${s.recording ? ' class="on"' : ""}>Yes</button><button data-rec="0"${s.recording ? "" : ' class="on"'}>No</button></div></div>
      <div><label class="lab" for="f-note">Note</label><input class="field" id="f-note" value="${esc(s.note || "")}" placeholder="buzz · slow change · sore · bored · breakthrough"></div>
      <button class="btn btn-olive btn-block" data-act="save" data-id="${existing ? existing.id : ""}">${existing ? "Save changes" : "Save session"}</button>
      ${existing ? `<button class="btn btn-ghost btn-danger" data-act="delete" data-id="${existing.id}">Delete this session</button>` : ""}`);
  }
  function swapSheet(stage) {
    const l = LADDER.find((x) => x.stage === stage), s = songFor(stage);
    openSheet(`<div class="sheet-head"><h2>Song ${stage}</h2><button class="x-btn" data-act="close" aria-label="Close">×</button></div><div class="hint">${esc(l.chords)}. Pick one you already know by ear.</div>
      <div class="card pad list" style="padding:4px 16px">${l.candidates.map((c, i) => `<button class="pick${s.title === c.title ? " on" : ""}" data-act="choose" data-stage="${stage}" data-i="${i}"><div class="t"><b>${esc(c.title)}</b><small>${esc(c.artist)} · ${esc(c.chords)}</small></div>${s.title === c.title ? `<span class="olive">${I.check}</span>` : ""}</button>`).join("")}</div>
      <button class="btn" data-act="choose-custom" data-stage="${stage}">Another song</button>`);
  }

  /* ------------------------------------------------------------------ timers */
  let tick = null;
  function ensureTick() {
    if (tick) return;
    tick = setInterval(() => {
      const r = run(); let changed = false;
      if (r.timer && Date.now() >= r.timer.endsAt) { r.done[r.timer.block] = true; r.timer = null; buzz(); changed = true; }
      if (r.tapping && Date.now() >= r.tapping.endsAt) { r.rounds.push(r.tapping.count); r.tapping = null; if (r.rounds.length >= 2) r.done.changes = true; buzz(); changed = true; }
      if (changed) { saveRun(); if (view === "today") render(); return; }
      if (view !== "today") return;
      if (r.timer) { const el = document.querySelector(`.clock[data-block="${r.timer.block}"]`); if (el) el.textContent = clock(Math.max(0, Math.round((r.timer.endsAt - Date.now()) / 1000))); }
      if (r.tapping) { const el = document.querySelector(".tapzone small"); if (el) el.textContent = `tap each clean change · ${Math.max(0, Math.round((r.tapping.endsAt - Date.now()) / 1000))}s left`; }
      if (!r.timer && !r.tapping) { clearInterval(tick); tick = null; }
    }, 250);
  }
  const buzz = () => { try { if (navigator.vibrate) navigator.vibrate([120, 60, 120]); } catch (e) {} };
  function toast(msg) { const el = $("toast"); el.textContent = msg; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 1800); }

  /* ------------------------------------------------------------------ actions */
  document.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-view]"); if (tab && tab.classList.contains("tab")) { go(tab.dataset.view); return; }
    const b = e.target.closest("[data-act]"); if (!b) { if (e.target.id === "sheet-wrap") closeSheet(); return; }
    const act = b.dataset.act, r = run();
    if (act === "go") return go(b.dataset.view);
    if (act === "toggle") { r.done[b.dataset.block] = !r.done[b.dataset.block]; if (r.timer && r.timer.block === b.dataset.block) r.timer = null; saveRun(); return render(); }
    if (act === "timer") {
      if (r.timer && r.timer.block === b.dataset.block) r.timer = null; else r.timer = { block: b.dataset.block, endsAt: Date.now() + Number(b.dataset.min) * 60000 };
      saveRun(); render(); ensureTick(); return;
    }
    if (act === "tap") {
      if (r.tapping) { r.tapping.count++; const el = document.querySelector(".tapzone b"); if (el) el.textContent = r.tapping.count; saveRun(); return; }
      r.tapping = { count: 0, endsAt: Date.now() + 60000 }; saveRun(); render(); ensureTick(); return;
    }
    if (act === "clear-rounds") { r.rounds = []; r.done.changes = false; saveRun(); return render(); }
    if (act === "log") return logSheet(null);
    if (act === "edit") return logSheet(S.sessions.find((s) => s.id === b.dataset.id));
    if (act === "floor") {
      if (byDate(today())) return toast("Already logged today");
      S.sessions.push({ id: uid("s"), date: today(), min: 5, changes: null, song: currentSong().title, section: "Full, slow", recording: false, note: "floor", floor: true });
      save(); toast("Floor session logged. It counts."); return render();
    }
    if (act === "close") return closeSheet();
    if (act === "save") {
      const date = $("f-date").value, min = Number($("f-min").value) || 15, ch = $("f-changes").value;
      const recording = $("f-rec").querySelector(".on").dataset.rec === "1";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return toast("Pick a date");
      const row = { id: b.dataset.id || uid("s"), date, min, changes: ch === "" ? null : Number(ch), song: currentSong().title, section: $("f-section").value, recording, note: $("f-note").value.trim(), floor: false };
      const other = S.sessions.find((s) => s.date === date && s.id !== row.id);
      if (other) return toast(`${fmtDate(date)} already has a session. Edit that one.`);
      const i = S.sessions.findIndex((s) => s.id === row.id); if (i >= 0) S.sessions[i] = row; else S.sessions.push(row);
      save(); closeSheet(); toast(b.dataset.id ? "Saved" : "Logged. See you tomorrow."); return render();
    }
    if (act === "delete") { if (!confirm("Delete this session?")) return; S.sessions = S.sessions.filter((s) => s.id !== b.dataset.id); save(); closeSheet(); return render(); }
    if (act === "status") { songFor(Number(b.dataset.stage)).status = b.dataset.status; save(); return render(); }
    if (act === "swap") return swapSheet(Number(b.dataset.stage));
    if (act === "choose") {
      const l = LADDER.find((x) => x.stage === Number(b.dataset.stage)), c = l.candidates[Number(b.dataset.i)], s = songFor(l.stage);
      Object.assign(s, { title: c.title, artist: c.artist, chords: c.chords, lesson: c.lesson || null, status: s.status === "not-started" ? "learning" : s.status });
      save(); closeSheet(); return render();
    }
    if (act === "choose-custom") {
      const title = prompt("Song title"); if (!title) return;
      const artist = prompt("Artist") || ""; const chords = prompt("Chords, comma separated") || "";
      const s = songFor(Number(b.dataset.stage)); Object.assign(s, { title: title.trim(), artist: artist.trim(), chords: chords.trim(), lesson: null, status: "learning" });
      save(); closeSheet(); return render();
    }
    if (act === "copy-token") { const t = GSync.token(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Token copied. Send it to Karl once."), () => toast(t)); return; }
    if (act === "sync-now") { GSync.status = { at: null, ok: null, msg: "sending…" }; GSync.paint(); GSync.push(); return; }
    if (act === "restore") {
      const t = prompt("Paste the device token from the other phone (24 characters). This REPLACES this phone's data with that phone's.");
      if (!t || !/^[a-f0-9]{24}$/.test(t.trim())) { if (t) alert("That is not a 24-character token."); return; }
      GSync.pull(t.trim()).then((p) => { if (!p.state || !confirm(`Found data saved ${p.savedAt}. Replace this phone's data with it?`)) return; lsSet("guitar_sync_token", t.trim()); lsSet(KEY, JSON.stringify(p.state)); location.reload(); }).catch((err) => alert("Restore failed: " + err.message));
      return;
    }
    if (act === "export") {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `guitar-${today()}.json`; document.body.appendChild(a); a.click(); a.remove(); return;
    }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "import-file") {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((txt) => { const p = JSON.parse(txt); if (!p || p.v !== 1 || !Array.isArray(p.sessions)) throw new Error("not a Guitar export"); if (!confirm(`Replace this phone's data with ${p.sessions.length} sessions from the file?`)) return; S = p; save(); render(); toast("Imported"); }).catch((err) => alert("Import failed: " + err.message));
      return;
    }
    if (e.target.dataset.act === "section") { songFor(Number(e.target.dataset.stage)).section = e.target.value; save(); }
  });
  document.addEventListener("click", (e) => { const seg = e.target.closest("#f-rec button"); if (!seg) return; seg.parentNode.querySelectorAll("button").forEach((x) => x.classList.remove("on")); seg.classList.add("on"); });
  window.addEventListener("hashchange", () => { const v = location.hash.replace("#", ""); if (["today", "progress", "songs"].includes(v) && v !== view) { view = v; render(); } });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") { if (run().timer || run().tapping) ensureTick(); render(); } });

  render();
  if (run().timer || run().tapping) ensureTick();
})();
