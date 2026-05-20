/* ============================================================
   FC26 LEADERBOARD — Airtable client
   ============================================================
   A tiny vanilla wrapper around the Airtable REST API.
   Handles pagination so all records come back, even past 100.
   ============================================================ */

(function () {
  const CFG = window.FC26_CONFIG;

  function configIsReady() {
    return (
      CFG &&
      CFG.AIRTABLE_TOKEN &&
      CFG.AIRTABLE_BASE_ID &&
      CFG.AIRTABLE_TOKEN.indexOf('PASTE_YOUR') === -1 &&
      CFG.AIRTABLE_BASE_ID.indexOf('PASTE_YOUR') === -1
    );
  }

  async function fetchAllScores() {
    if (!configIsReady()) {
      throw new Error(
        'Airtable credentials missing. Open js/config.js and paste your token + base ID.'
      );
    }

    const endpoint = `https://api.airtable.com/v0/${CFG.AIRTABLE_BASE_ID}/${encodeURIComponent(
      CFG.AIRTABLE_TABLE_NAME
    )}`;

    let records = [];
    let offset;

    do {
      const url = new URL(endpoint);
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${CFG.AIRTABLE_TOKEN}` },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(
          `Airtable request failed (${res.status}). ${body.slice(0, 200)}`
        );
      }

      const data = await res.json();
      records = records.concat(data.records || []);
      offset = data.offset;
    } while (offset);

    // Normalize into a friendlier shape for the UI code.
    return records
      .map((r) => ({
        id: r.id,
        playerName: (r.fields['Player Name'] || '').trim(),
        score: typeof r.fields['Score'] === 'number' ? r.fields['Score'] : 0,
        week: r.fields['Week Number'] || '',
        location: (r.fields['Location'] || '').trim(),
        weeklyQualifier: !!r.fields['Weekly Qualifier'],
      }))
      // Drop any rows without a player name — these are likely empty/in-progress.
      .filter((r) => r.playerName.length > 0);
  }

  // Figure out which week is "current" based on today's date and the
  // WEEK_DATES map in config.js. The current week is the latest week whose
  // start date is <= today. Falls back to Week 1.
  function currentWeek() {
    const now = new Date();
    const weeks = Object.entries(CFG.WEEK_DATES)
      .map(([name, dateStr]) => ({ name, date: new Date(dateStr + 'T00:00:00') }))
      .sort((a, b) => a.date - b.date);

    let active = weeks[0].name;
    for (const w of weeks) {
      if (w.date <= now) active = w.name;
    }
    return active;
  }

  // Expose
  window.FC26_API = { fetchAllScores, currentWeek, configIsReady };
})();
