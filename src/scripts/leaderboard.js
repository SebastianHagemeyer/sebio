// Shared leaderboard client, backed by Supabase (REST).
//
// SETUP (see docs/leaderboard-setup.md):
//   1. Create a Supabase project and a `scores` table with RLS policies.
//   2. Paste your project URL + anon (public) key below.
// The anon key is meant to be public; access is restricted by Row Level
// Security, so only validated inserts/reads are allowed.
(function () {
  const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
  const SUPABASE_ANON_KEY = "YOUR-SUPABASE-ANON-KEY";
  const TABLE = "scores";
  const TIMEOUT_MS = 8000;

  function isConfigured() {
    return !SUPABASE_URL.includes("YOUR-PROJECT-REF") && !SUPABASE_ANON_KEY.includes("YOUR-");
  }

  function authHeaders(extra) {
    return Object.assign(
      { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      extra || {}
    );
  }

  async function withTimeout(doFetch) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await doFetch(controller.signal);
    } finally {
      clearTimeout(timer);
    }
  }

  // Returns an array of { name, score }, highest first. Empty array if the
  // leaderboard isn't configured yet or the request fails.
  async function getScores(limit = 10) {
    if (!isConfigured()) return [];
    const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=name,score&order=score.desc&limit=${limit}`;
    const res = await withTimeout((signal) => fetch(url, { headers: authHeaders(), signal }));
    if (!res.ok) throw new Error(`Leaderboard read failed (${res.status})`);
    return res.json();
  }

  // Inserts a score. Name is clamped to 20 chars and score to a non-negative
  // integer; the RLS policy enforces the same bounds server-side.
  async function submitScore(name, score) {
    if (!isConfigured()) {
      console.warn("Leaderboard not configured — set the Supabase URL/key in leaderboard.js.");
      return;
    }
    const body = JSON.stringify({
      name: String(name || "Anonymous").slice(0, 20),
      score: Math.max(0, Math.floor(Number(score) || 0)),
    });
    const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;
    const res = await withTimeout((signal) =>
      fetch(url, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
        body,
        signal,
      })
    );
    if (!res.ok) throw new Error(`Leaderboard submit failed (${res.status})`);
  }

  window.Leaderboard = { getScores, submitScore, isConfigured };
})();
