/* Guitar — sync to Karl. Lifted from the Exercise Library's shared/setlog.js (sync section,
   2026-09-24) so the two apps share one Worker and one contract. Local storage stays the
   source of truth; every save PUTs the app's state to the workout-sync Worker under the
   slug "guitar". If this phone already holds the library's device token (same origin in
   Safari), it is adopted, so Karl's pull.py reads it with the library key. A home-screen
   install has its own storage and mints its own token; About shows it. */
window.GSync = (function () {
  "use strict";
  const SYNC_BASE = "https://workout-sync.ryanrothe.workers.dev/v1/";
  const TOKEN_KEY = "guitar_sync_token";
  const ADOPT_KEYS = ["workout_sync_token"];
  const TOKEN_RE = /^[a-f0-9]{24}$/;
  const sync = { cfg: null, timer: null, status: { at: null, ok: null, msg: "not yet" } };
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  sync.token = function () {
    let t = lsGet(TOKEN_KEY);
    if (t && TOKEN_RE.test(t)) return t;
    for (const k of ADOPT_KEYS) { const o = lsGet(k); if (o && TOKEN_RE.test(o)) { t = o; break; } }
    if (!t || !TOKEN_RE.test(t)) {
      const bytes = new Uint8Array(12);
      (window.crypto || window.msCrypto).getRandomValues(bytes);
      t = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    }
    lsSet(TOKEN_KEY, t);
    return t;
  };
  sync.init = function (cfg) {
    sync.cfg = cfg;
    sync.token();
    const flush = () => { if (sync.timer) sync.push(true); };
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
    window.addEventListener("pagehide", flush);
    if (!cfg.hasData || cfg.hasData()) { clearTimeout(sync.timer); sync.timer = setTimeout(sync.push, 800); }
  };
  sync.schedule = function () { if (!sync.cfg) return; clearTimeout(sync.timer); sync.timer = setTimeout(sync.push, 1500); };
  sync.push = async function (unloading) {
    if (!sync.cfg) return;
    clearTimeout(sync.timer); sync.timer = null;
    let payload;
    try {
      payload = Object.assign({ program: sync.cfg.slug, schema: 1, savedAt: new Date().toISOString(), ua: navigator.userAgent }, sync.cfg.payload());
    } catch (e) { sync.status = { at: Date.now(), ok: false, msg: "could not build the payload: " + e.message }; sync.paint(); return; }
    if (lsGet("guitar_sync_off") === "1") { sync.status = { at: Date.now(), ok: null, msg: "off on this device (testing)" }; sync.paint(); return; }
    try {
      const body = JSON.stringify(payload);
      const keepalive = !!unloading && body.length < 60000;
      const r = await fetch(`${SYNC_BASE}${sync.cfg.slug}/${sync.token()}`, { method: "PUT", headers: { "content-type": "application/json" }, body, keepalive });
      sync.status = { at: Date.now(), ok: r.ok, msg: r.ok ? "synced" : `server said ${r.status}` };
    } catch (e) {
      sync.status = { at: Date.now(), ok: false, msg: "offline, will retry on the next save" };
    }
    sync.paint();
  };
  sync.pull = async function (token) {
    const r = await fetch(`${SYNC_BASE}${sync.cfg.slug}/${token}`);
    if (!r.ok) throw new Error(r.status === 404 ? "no data for that token" : `server said ${r.status}`);
    return r.json();
  };
  sync.paint = function () {
    const el = document.getElementById("sync-status");
    if (!el) return;
    const s = sync.status;
    const when = s.at ? new Date(s.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";
    el.textContent = s.ok === null ? "Sync: " + s.msg : `Sync: ${s.msg}${when ? " · " + when : ""}`;
    el.style.color = s.ok === false ? "var(--danger)" : "var(--muted)";
  };
  return sync;
})();
