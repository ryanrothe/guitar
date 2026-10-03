/* Guitar: songs, not chords. Plan: karl/outputs/personal/guitar/PLAN-OPUS-2026-10-03.md
   Three views (Tonight, Songs, Progress), one storage key, sync to Karl through shared/sync.js.
   Rebuilt 2026-10-03 on the Opus plan: progress is songs finished plus voice memos. No minutes,
   no streaks, no session log. Every video ID below was checked against YouTube oEmbed on 2026-10-03. */
(function () {
  "use strict";
  const KEY = "guitar_v2", START = "2026-10-04";
  const pad = (n) => String(n).padStart(2, "0");
  const dstr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => dstr(new Date());
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return dstr(d); };
  const fmtDate = (s) => parse(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const clock = (sec) => `${Math.floor(sec / 60)}:${pad(sec % 60)}`;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const $ = (id) => document.getElementById(id);

  /* ------------------------------------------------------------------ videos */
  const JG = "JustinGuitar", AG = "Andy Guitar";
  const V = {
    tune: { id: "X2EmpWr9vUc", t: "How to tune your guitar", by: JG },
    hold: { id: "MlV6WhM9YhE", t: "How to hold a guitar", by: JG },
    fret: { id: "olnMpmcuQKA", t: "Fingertips close to the fret", by: JG },
    thumb: { id: "QkrIZBLZEXw", s: 307, t: "Where your thumb goes", by: JG },
    pick: { id: "-04Et5qIoa4", t: "How to hold a pick", by: JG },
    strum: { id: "c5pipuvb-EM", t: "Strumming: arm, angle, loose grip", by: JG },
    chart: { id: "LlN2yrFQKzY", t: "How to read a chord chart", by: JG },
    drill: { id: "mAgc7hr44WM", t: "The one-minute drill", by: JG }
  };
  const CHORD = {
    Em: { id: "lqcd3jVysXY", t: "The Em chord", by: JG },
    D6: { id: "lPVK7eI2dKY", t: "D6, taught in the Horse lesson", by: JG },
    G: { id: "i0G69vCTv4s", t: "The G chord, plus easier versions", by: JG },
    C: { id: "f18EV2dr008", t: "The C chord", by: JG },
    D: { id: "QkrIZBLZEXw", t: "The D chord", by: JG },
    Am: { id: "1Y2veGF9s44", t: "The Am chord", by: JG },
    A: { id: "1X2rW5ATdLQ", t: "The A chord", by: JG },
    E: { id: "9NSoRXC9PJI", t: "The E chord", by: JG },
    B7: { id: "JBUKxR_y0nA", s: 491, t: "The B7 chord", by: JG },
    Cadd9: { id: "A2zVlXB-_U8", t: "Cadd9, taught in the Sweet Home lesson", by: AG }
  };

  /* ------------------------------------------------------------------ the plan */
  const STEPS = [
    { name: "Along", what: "Play with the recording. Strum once when each chord starts, even if only one chord comes out right. You're playing a song." },
    { name: "Changes", what: "Every chord, one strum per bar, with the video slowed to 0.75 (gear icon, then Playback speed). Use the one-minute drill on the hardest switch." },
    { name: "Groove", what: "The real strum pattern from the lesson, still slow if you need it." },
    { name: "Through", what: "Start to finish without stopping. Mistakes are fine; stopping isn't. When you can do this, the song is done and goes on your list." },
    { name: "Sing", what: "Sing it while you play." }
  ];
  const STEP_BTN = ["Step 1 feels solid", "Step 2 feels solid", "Step 3 feels solid", "I played it start to finish", "I sang it while playing"];
  const GROUPS = ["Learning the four main chords", "No new chords", "New chords again"];
  const SONGS = [
    { id: "horse", g: 0, title: "A Horse With No Name", artist: "America", kind: "Classic rock", chords: ["Em", "D6"], fresh: ["Em", "D6"], v: { id: "lPVK7eI2dKY", by: JG },
      note: "Justin calls the second chord D6 (properly D6/9). It's the Em shape with two fingers moved. For step 1, strum Em along with the record and ignore the second chord until it feels easy." },
    { id: "jambalaya", g: 0, title: "Jambalaya (On the Bayou)", artist: "Hank Williams", kind: "Country", chords: ["G", "C"], fresh: ["G", "C"], v: { id: "iYEeSHeQtpY", by: JG },
      note: "C is the hardest of the main chords. The G to C switch is where the one-minute drill earns its keep." },
    { id: "knockin", g: 0, title: "Knockin' on Heaven's Door", artist: "Bob Dylan", kind: "Classic rock", chords: ["G", "D", "Am", "C"], fresh: ["D", "Am"], v: { id: "zoPj5Z80AxA", by: JG },
      note: "Slow and mellow, good for the evening. The lesson shows an easier G." },
    { id: "wagon", g: 1, title: "Wagon Wheel", artist: "Old Crow Medicine Show", kind: "Country", chords: ["G", "D", "Em", "C"], fresh: [], capo: 2, v: { id: "1SVDLRuLV-c", by: AG },
      note: "Capo on the 2nd fret; the shapes stay the same. Andy Guitar teaches this one because JustinGuitar has no lesson for it. Optional riff at 10:30." },
    { id: "browneyed", g: 1, title: "Brown Eyed Girl", artist: "Van Morrison", kind: "Classic rock", chords: ["G", "C", "D", "Em"], fresh: [], v: { id: "QoZoklnIbtI", by: JG }, note: "" },
    { id: "sweethome", g: 1, title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", kind: "Southern rock", chords: ["D", "Cadd9", "G"], fresh: [], v: { id: "A2zVlXB-_U8", by: AG },
      note: "Cadd9 is an easier C: two fingers stay where they were for G. Two beats D, two beats Cadd9, four beats G." },
    { id: "ringoffire", g: 1, title: "Ring of Fire", artist: "Johnny Cash", kind: "Country", chords: ["G", "C", "D"], fresh: [], v: { id: "cpNDUupxWE0", by: JG },
      note: "The rhythm is uneven: some bars are shorter than others. The lesson runs 20 minutes, so take it in pieces." },
    { id: "badmoon", g: 2, title: "Bad Moon Rising", artist: "Creedence Clearwater Revival", kind: "Classic rock", chords: ["D", "A", "G"], fresh: ["A"], v: { id: "tFPs89WBPuU", s: 424, by: JG },
      note: "The video opens at 7:04, where the no-capo D, A, G version starts. The first half teaches a capo version you can skip." },
    { id: "folsom", g: 2, title: "Folsom Prison Blues", artist: "Johnny Cash", kind: "Country", chords: ["E", "A", "B7"], fresh: ["E", "B7"], v: { id: "etYciOKiPUQ", by: JG },
      note: "B7 is the hardest chord on the list. Simple strums first, then the boom-chick." }
  ];
  const BASICS = [
    { id: "tune", label: "Tune it", short: "Tuner app, six strings", vids: ["tune"],
      what: "Get a free tuner app (GuitarTuna works). The strings, thickest to thinnest, are E A D G B E, and the thick one is nearest your face. Pluck one string and turn its peg slowly until the app says it's in tune. Do all six. Every session starts here, and it gets quick." },
    { id: "hold", label: "Hold it", short: "Posture and where the neck sits", vids: ["hold"],
      what: "Sit down. The guitar's curve rests on your right thigh, the neck tilts up a little, and your fretting hand doesn't hold the guitar up. Relaxed shoulders, relaxed wrist." },
    { id: "fret", label: "Press one clean note", short: "Fingertip, close to the fret", vids: ["fret", "thumb"],
      what: "Put a fingertip just behind a metal fret wire, not in the middle of the space. Press lightly and pluck. A buzz means move closer to the wire or press with the very tip. Try it on every string at the 2nd fret. The second video shows where your thumb goes." },
    { id: "strum", label: "Hold the pick and strum", short: "Pick grip and down strums", vids: ["pick", "strum"],
      what: "Hold the pick loosely between your thumb and the side of your index finger. Strum all six open strings, down only, counting a slow 1 2 3 4. That's one bar. Play four bars." },
    { id: "chart", label: "Read a chord chart", short: "Dots, lines, O and X", vids: ["chart"],
      what: "Vertical lines are strings, with the thick E on the left. Horizontal lines are frets. Dots are fingertips, and their numbers are fingers: 1 index to 4 pinky. O over a string means play it open; X means skip it." }
  ];
  const REC = [
    { k: "d1", day: 1, label: "Day 1", what: "30 seconds in your phone's Voice Memos app. Whatever you can play, even open strings. Keep it; you'll want it later." },
    { k: "d30", day: 30, label: "Day 30", what: "The same song as day 1 if you can. Then play both back to back." },
    { k: "d90", day: 90, label: "Day 90", what: "Your best song, start to finish." }
  ];
  const recDate = (r) => addDays(START, r.day - 1);

  /* ------------------------------------------------------------------ state */
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  function fresh() {
    const songs = {}; SONGS.forEach((s) => { songs[s.id] = { step: 0, done: null }; });
    return { v: 2, started: START, basics: {}, songs, current: "horse", rec: { d1: null, d30: null, d90: null } };
  }
  function load() {
    try {
      const s = JSON.parse(lsGet(KEY) || "null");
      if (s && s.v === 2) {
        const f = fresh();
        s.songs = Object.assign(f.songs, s.songs || {}); s.basics = s.basics || {}; s.rec = Object.assign(f.rec, s.rec || {});
        if (!SONGS.some((x) => x.id === s.current)) s.current = "horse";
        return s;
      }
    } catch (e) {}
    return fresh();
  }
  let S = load();
  function save() { lsSet(KEY, JSON.stringify(S)); GSync.schedule(); }

  const basicsDone = () => BASICS.every((b) => S.basics[b.id]);
  const owned = () => SONGS.filter((s) => S.songs[s.id].step >= 4);
  const cur = () => SONGS.find((s) => s.id === S.current) || SONGS[0];
  const nextSong = () => SONGS.find((s) => s.id !== S.current && S.songs[s.id].step < 4);
  const songVid = (s) => ({ id: s.v.id, s: s.v.s, t: `${s.title} lesson`, by: s.v.by });

  /* ------------------------------------------------------------------ sync contract */
  GSync.init({ slug: "guitar", storageKey: KEY,
    hasData: () => Object.keys(S.basics).length > 0 || SONGS.some((s) => S.songs[s.id].step > 0) || REC.some((r) => S.rec[r.k]),
    payload: () => ({ schema: 2, state: S,
      summary: { started: START, basicsDone: basicsDone(), current: cur().title, currentStep: S.songs[cur().id].step,
        songsDone: owned().map((s) => ({ title: s.title, on: S.songs[s.id].done })), recordings: S.rec } }) });

  /* ------------------------------------------------------------------ render */
  let view = location.hash.replace("#", "") || "tonight";
  if (!["tonight", "songs", "progress"].includes(view)) view = "tonight";
  const OPENS = {};
  const isOpen = (key, dflt) => (key in OPENS ? OPENS[key] : dflt);
  const I = {
    tonight: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
    songs: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>',
    progress: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="M9 9l2 2 4-4M9 15h6"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    play: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="#FFFFFF"/></svg>'
  };
  function paintTabs() {
    $("tabs").innerHTML = [["tonight", "Tonight"], ["songs", "Songs"], ["progress", "Progress"]].map(([k, l]) =>
      `<button class="tab" data-view="${k}"${k === view ? ' aria-current="page"' : ""}><span class="ico">${I[k]}</span><span>${l}</span></button>`).join("");
  }
  function render(keep) {
    paintTabs();
    const y = window.scrollY;
    $("app").innerHTML = view === "tonight" ? renderTonight() : view === "songs" ? renderSongs() : renderProgress();
    GSync.paint();
    window.scrollTo(0, keep ? y : 0);
  }
  function go(v) { view = v; location.hash = v; render(); }

  /* shared pieces */
  function vid(v) {
    const url = `https://www.youtube.com/watch?v=${v.id}${v.s ? `&t=${v.s}s` : ""}`;
    return `<div class="vid-wrap"><div class="vid" data-act="play" data-yt="${esc(v.id)}" data-s="${v.s || 0}" role="button" tabindex="0" aria-label="Play: ${esc(v.t)}">
      <img src="https://i.ytimg.com/vi/${esc(v.id)}/mqdefault.jpg" alt="" loading="lazy"><span class="play"><i>${I.play}</i></span></div>
      <div class="vid-cap"><span>${esc(v.t)} · ${esc(v.by)}${v.s ? ` · from ${clock(v.s)}` : ""}</span><a class="olive" href="${url}" target="_blank" rel="noopener">YouTube ›</a></div></div>`;
  }
  const stepsBar = (st) => `<div class="steps" aria-label="${Math.min(st, 5)} of 5 steps done">${STEPS.map((_, i) => `<i class="${i < st ? "on" : i === st ? "now" : ""}"></i>`).join("")}</div>`;
  const chordLinks = (s) => `<div class="meta">Chord videos: ${s.chords.map((c) => `<button class="textlink" data-act="chord" data-c="${c}">${c}</button>`).join(" · ")}</div>`;
  const songMeta = (s) => `${esc(s.artist)} · ${esc(s.chords.join(", "))}${s.capo ? ` · capo ${s.capo}` : ""}`;

  /* ------------------------------------------------------------------ tonight */
  function renderTonight() {
    const t = today();
    const head = `<header class="page-head"><div><div class="eyebrow">${DOW[parse(t).getDay()]} · ${fmtDate(t)}</div><h1>Tonight</h1>
      <div class="trigger">After the kids are down, before the phone.</div></div></header>`;
    if (!basicsDone()) return head + startHere() + recCard(t);
    return head + openCard(t) + climbCard() + closeCard() + recCard(t);
  }
  function startHere() {
    const n = BASICS.filter((b) => S.basics[b.id]).length, first = BASICS.find((b) => !S.basics[b.id]);
    const items = BASICS.map((b) => {
      const done = !!S.basics[b.id], key = "b-" + b.id;
      return `<details class="item${done ? " done" : ""}" data-key="${key}"${isOpen(key, first && b.id === first.id) ? " open" : ""}>
        <summary><span class="chk">${done ? I.check : ""}</span><div class="t"><b>${esc(b.label)}</b><small>${esc(b.short)}</small></div><span class="chev">›</span></summary>
        <div class="body">${b.vids.map((k) => vid(V[k])).join("")}<p>${esc(b.what)}</p>
          <button class="btn${done ? "" : " btn-olive"}" data-act="basic" data-id="${b.id}">${done ? "Mark as not done" : "Done"}</button></div></details>`;
    }).join("");
    return `<section class="card pad stack"><div class="eyebrow olive">Start here · ${n} of ${BASICS.length}</div><div class="title-lg">Before your first song</div>
      <p class="body">Five short videos. Watch one, try it on the guitar, mark it done. One tonight is enough; all five is fine too.</p></section>
      <section class="card list">${items}</section>
      <p class="aside">Next comes song 1, A Horse With No Name. Sore fingertips are normal for the first 2 to 3 weeks. Stop when they've had enough.</p>`;
  }
  function openCard(t) {
    const own = owned();
    let body;
    if (own.length) {
      const s = own[Array.from(t).reduce((a, c) => a + c.charCodeAt(0), 0) % own.length];
      body = `<div class="title-md">${esc(s.title)}</div><div class="meta">Play it once through, just for you.</div>`;
    } else body = `<div class="meta">Tune, then play the chords you know, slowly. Let every string ring. Nothing is on your list yet; the climb below is how songs get there.</div>`;
    return `<section class="card pad stack"><div class="eyebrow">1 · Open</div>${body}</section>`;
  }
  function climbCard() {
    const s = cur(), st = S.songs[s.id].step, nx = nextSong();
    const nextBtn = nx ? `<button class="btn" data-act="next-song">Start the next song: ${esc(nx.title)}</button>` : "";
    if (st >= 5) {
      return `<section class="card pad stack current"><div class="eyebrow olive">2 · Climb</div><div class="title-lg">${esc(s.title)}</div>${stepsBar(5)}
        <p class="body">Every step done. It's yours.</p>${nextBtn}</section>`;
    }
    const step = STEPS[st];
    return `<section class="card pad stack current"><div class="eyebrow olive">2 · Climb</div>
      <div><div class="title-lg">${esc(s.title)}</div><div class="meta">${songMeta(s)}</div></div>${stepsBar(st)}
      <div><div class="step-name">Step ${st + 1} of 5 · ${step.name}</div><p class="body">${esc(step.what)}</p></div>
      ${vid(songVid(s))}${s.note ? `<p class="hint">${esc(s.note)}</p>` : ""}${chordLinks(s)}${st === 1 ? drill() : ""}
      <button class="btn btn-olive btn-block" data-act="step-up" data-id="${s.id}">${STEP_BTN[st]}</button>${st >= 4 ? nextBtn : ""}</section>`;
  }
  function drill() {
    const left = drillLeft();
    return `<div class="drill"><div class="t"><b>One-minute drill</b><small>Pick the hardest switch. Go back and forth for 60 seconds and count the clean ones in your head. Nothing gets logged. <button class="textlink" data-act="vsheet" data-k="drill">How it works</button></small></div>
      <button class="btn" data-act="drill">${left ? `${left}s` : "Start 60 s"}</button></div>`;
  }
  function closeCard() {
    const bad = owned().length ? "Bad night? Play one song you know, once. That counts." : "Bad night? Strum Em along with the record, once. That counts.";
    return `<section class="card pad stack"><div class="eyebrow">3 · Close</div><div class="meta">Play anything that feels good. Then the guitar goes back on the stand, not in the case.</div></section><p class="aside">${bad}</p>`;
  }
  function recCard(t) {
    const r = REC.find((x) => !S.rec[x.k] && t >= recDate(x));
    if (!r) return "";
    return `<section class="card pad stack rec"><div class="eyebrow">${r.label} recording</div><div class="meta">${esc(r.what)}</div>
      <button class="btn" data-act="rec" data-k="${r.k}">Recorded</button></section>`;
  }

  /* ------------------------------------------------------------------ songs */
  function renderSongs() {
    const head = `<header class="page-head"><div><div class="eyebrow">Nine songs · five steps each</div><h1>Songs</h1></div></header>`;
    const how = `<details class="card item" data-key="how"${isOpen("how", false) ? " open" : ""}><summary><div class="t"><b>How the five steps work</b><small>Step 4 means the song is done</small></div><span class="chev">›</span></summary>
      <div class="body"><ol class="steplist">${STEPS.map((x) => `<li><b>${x.name}.</b> ${esc(x.what)}</li>`).join("")}</ol></div></details>`;
    const groups = GROUPS.map((g, gi) => `<div class="row-head"><span class="eyebrow">${g}</span></div><section class="card list">${SONGS.filter((s) => s.g === gi).map(songItem).join("")}</section>`).join("");
    return head + how + groups + `<p class="aside">Want a different song? Tell Karl the title, and it goes where its chords fit.</p>`;
  }
  function songItem(s) {
    const n = SONGS.indexOf(s) + 1, st = S.songs[s.id].step, isCur = s.id === S.current, key = "s-" + s.id;
    const status = st >= 5 ? "Every step done" : st >= 4 ? "On your list" : st > 0 || isCur ? `Step ${st + 1} of 5` : "Not started";
    return `<details class="item song${isCur ? " current" : ""}" data-key="${key}"${isOpen(key, isCur) ? " open" : ""}>
      <summary><span class="num">${n}</span><div class="t"><b>${esc(s.title)}</b><small>${esc(s.artist)} · ${esc(s.kind)} · ${status}${isCur ? " · your song now" : ""}</small>${stepsBar(st)}</div><span class="chev">›</span></summary>
      <div class="body">${vid(songVid(s))}
        <div class="meta"><b>Chords</b> ${esc(s.chords.join(", "))}${s.capo ? ` · capo ${s.capo}` : ""} · ${s.fresh.length ? `<b>New</b> ${esc(s.fresh.join(", "))}` : "nothing new"}</div>
        ${s.note ? `<p class="hint">${esc(s.note)}</p>` : ""}${chordLinks(s)}
        <div class="grid2"><button class="btn" data-act="step-down" data-id="${s.id}"${st === 0 ? " disabled" : ""}>Back a step</button><button class="btn" data-act="step-up" data-id="${s.id}"${st >= 5 ? " disabled" : ""}>Step done</button></div>
        ${isCur ? "" : `<button class="btn btn-olive" data-act="make-current" data-id="${s.id}">Make this my song</button>`}</div></details>`;
  }

  /* ------------------------------------------------------------------ progress */
  function renderProgress() {
    const t = today(), own = owned(), c = cur();
    const head = `<header class="page-head"><div><div class="eyebrow">Songs, not minutes</div><h1>Progress</h1></div></header>`;
    const list = own.length
      ? `<div class="list">${own.map((s) => `<div class="row"><div class="t"><b>${esc(s.title)}</b><small>${esc(s.artist)}${S.songs[s.id].done ? ` · since ${fmtDate(S.songs[s.id].done)}` : ""}</small></div>${S.songs[s.id].step >= 5 ? `<span class="hint">sung</span>` : ""}</div>`).join("")}</div>`
      : `<p class="body">None yet. A song lands here when you can play it start to finish without stopping.</p>`;
    const songs = `<section class="card pad stack"><div class="eyebrow">Songs I can play</div><div class="title-xl">${own.length}<span> ${own.length === 1 ? "song" : "songs"}</span></div>${list}
      <div class="hint">Working on ${esc(c.title)}, step ${Math.min(S.songs[c.id].step + 1, 5)} of 5.</div></section>`;
    const recs = `<div class="row-head"><span class="eyebrow">Recordings</span><span class="hint">Voice Memos on your phone</span></div><section class="card list">${REC.map((r) => {
      const at = S.rec[r.k], d = recDate(r), due = !at && t >= d;
      return `<div class="row"><div class="t"><b>${r.label}</b><small>${at ? `Recorded ${fmtDate(at)}` : due ? "Ready when you are" : `On ${fmtDate(d)}`}</small></div>
        ${at || due ? `<button class="btn${due ? " btn-olive" : ""}" data-act="rec" data-k="${r.k}">${at ? "Undo" : "Recorded"}</button>` : ""}</div>`;
    }).join("")}</section>`;
    const basics = `<details class="card item" data-key="basics"${isOpen("basics", false) ? " open" : ""}><summary><div class="t"><b>The basics videos</b><small>Tuning, holding, fingers, pick, chord charts</small></div><span class="chev">›</span></summary>
      <div class="body">${BASICS.map((b) => `<div class="meta"><b>${esc(b.label)}</b> ${b.vids.map((k) => `<button class="textlink" data-act="vsheet" data-k="${k}">${esc(V[k].t)}</button>`).join(" · ")}</div>`).join("")}</div></details>`;
    const about = `<section class="card pad sync-card"><h3>Sync to Karl</h3><p>Every save posts this app's data to a private sync endpoint so Karl can see which song you're on when you ask for help. The phone stays the source of truth. Give Karl the device token once.</p>
      <p><strong>Device token:</strong> <code id="sync-token" style="user-select:all;font-size:13px">${GSync.token()}</code><br><span id="sync-status" style="font-size:12px;color:var(--muted)">Sync: not yet</span></p>
      <div class="ex-actions"><button class="btn" data-act="copy-token">Copy token</button><button class="btn" data-act="sync-now">↑ Sync now</button><button class="btn" data-act="restore">↓ Restore from a token</button></div>
      <div class="ex-actions" style="margin-top:8px"><button class="btn" data-act="export">Export JSON</button><label class="btn" style="cursor:pointer">Import JSON<input type="file" accept="application/json" id="import-file" hidden></label></div></section>`;
    return head + songs + recs + basics + about;
  }

  /* ------------------------------------------------------------------ sheets, drill, toast */
  function openSheet(html) { $("sheet").innerHTML = `<div class="grabber"></div>` + html; $("sheet-wrap").hidden = false; }
  function closeSheet() { $("sheet-wrap").hidden = true; $("sheet").innerHTML = ""; }
  function videoSheet(title, v) { openSheet(`<div class="sheet-head"><h2>${esc(title)}</h2><button class="x-btn" data-act="close" aria-label="Close">×</button></div>${vid(v)}`); }
  let drillEnd = 0, drillTick = null;
  function drillLeft() { return drillEnd ? Math.max(0, Math.ceil((drillEnd - Date.now()) / 1000)) : 0; }
  function stopDrill() { clearInterval(drillTick); drillTick = null; drillEnd = 0; const el = document.querySelector('[data-act="drill"]'); if (el) el.textContent = "Start 60 s"; }
  const buzz = () => { try { if (navigator.vibrate) navigator.vibrate([120, 60, 120]); } catch (e) {} };
  function toast(msg) { const el = $("toast"); el.textContent = msg; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2000); }

  /* ------------------------------------------------------------------ actions */
  document.addEventListener("toggle", (e) => { const d = e.target; if (d && d.dataset && d.dataset.key) OPENS[d.dataset.key] = d.open; }, true);
  document.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-view]"); if (tab && tab.classList.contains("tab")) { go(tab.dataset.view); return; }
    const b = e.target.closest("[data-act]"); if (!b) { if (e.target.id === "sheet-wrap") closeSheet(); return; }
    const act = b.dataset.act;
    if (act === "play") {
      const id = b.dataset.yt, s = Number(b.dataset.s) || 0;
      b.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?playsinline=1&rel=0&autoplay=1${s ? `&start=${s}` : ""}" title="Lesson video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      b.removeAttribute("data-act"); b.removeAttribute("role"); b.classList.add("on"); return;
    }
    if (act === "basic") {
      const id = b.dataset.id, i = BASICS.findIndex((x) => x.id === id);
      if (S.basics[id]) delete S.basics[id];
      else { S.basics[id] = today(); OPENS["b-" + id] = false; const nx = BASICS.find((x, j) => j > i && !S.basics[x.id]); if (nx) OPENS["b-" + nx.id] = true; }
      save();
      if (basicsDone()) toast("Basics done. Song 1 is up.");
      return render(!basicsDone());
    }
    if (act === "step-up" || act === "step-down") {
      const s = SONGS.find((x) => x.id === b.dataset.id) || cur(), st = S.songs[s.id];
      if (act === "step-up") {
        st.step = Math.min(5, st.step + 1);
        if (st.step === 4) { st.done = today(); toast(`${s.title} is on your list.`); }
        else if (st.step === 5) toast("Every step done.");
        else toast(`Step ${st.step + 1}: ${STEPS[st.step].name}`);
      } else { st.step = Math.max(0, st.step - 1); if (st.step < 4) st.done = null; }
      stopDrill(); save(); return render(view === "songs");
    }
    if (act === "make-current") { S.current = b.dataset.id; OPENS["s-" + b.dataset.id] = true; save(); toast("That's your song now."); return render(true); }
    if (act === "next-song") { const nx = nextSong(); if (!nx) return; S.current = nx.id; save(); return render(); }
    if (act === "chord") return videoSheet(b.dataset.c, CHORD[b.dataset.c]);
    if (act === "vsheet") return videoSheet(V[b.dataset.k].t, V[b.dataset.k]);
    if (act === "drill") {
      if (drillEnd) return stopDrill();
      drillEnd = Date.now() + 60000; b.textContent = "60s";
      drillTick = setInterval(() => {
        const el = document.querySelector('[data-act="drill"]'), left = drillLeft();
        if (el) el.textContent = left ? `${left}s` : "Start 60 s";
        if (!left) { stopDrill(); buzz(); toast("Time."); }
      }, 250);
      return;
    }
    if (act === "rec") { const k = b.dataset.k; S.rec[k] = S.rec[k] ? null : today(); save(); if (S.rec[k]) toast("Kept. You'll be glad you did."); return render(true); }
    if (act === "close") return closeSheet();
    if (act === "copy-token") { const t = GSync.token(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Token copied. Send it to Karl once."), () => toast(t)); return; }
    if (act === "sync-now") { GSync.status = { at: null, ok: null, msg: "sending…" }; GSync.paint(); GSync.push(); return; }
    if (act === "restore") {
      const t = prompt("Paste the device token from the other phone (24 characters). This REPLACES this phone's data with that phone's.");
      if (!t || !/^[a-f0-9]{24}$/.test(t.trim())) { if (t) alert("That is not a 24-character token."); return; }
      GSync.pull(t.trim()).then((p) => {
        if (!p.state || p.state.v !== 2) { alert("That token holds data from the old version of this app."); return; }
        if (!confirm(`Found data saved ${p.savedAt}. Replace this phone's data with it?`)) return;
        lsSet("guitar_sync_token", t.trim()); lsSet(KEY, JSON.stringify(p.state)); location.reload();
      }).catch((err) => alert("Restore failed: " + err.message));
      return;
    }
    if (act === "export") {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `guitar-${today()}.json`; document.body.appendChild(a); a.click(); a.remove(); return;
    }
  });
  document.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('.vid[data-act="play"]')) { e.preventDefault(); e.target.click(); } });
  document.addEventListener("change", (e) => {
    if (e.target.id !== "import-file") return;
    const f = e.target.files[0]; if (!f) return;
    f.text().then((txt) => {
      const p = JSON.parse(txt); if (!p || p.v !== 2 || !p.songs) throw new Error("not a Guitar export from this version");
      if (!confirm("Replace this phone's data with the file?")) return;
      S = p; save(); render(); toast("Imported");
    }).catch((err) => alert("Import failed: " + err.message));
  });
  window.addEventListener("hashchange", () => { const v = location.hash.replace("#", ""); if (["tonight", "songs", "progress"].includes(v) && v !== view) { view = v; render(); } });

  render();
})();
