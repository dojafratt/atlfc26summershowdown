/* ============================================================
   FC26 LEADERBOARD — Monthly page logic
   ============================================================
   Rules:
   - Each player is represented by their single best weekly score.
   - Players whose best (or any) score is flagged Weekly Qualifier
     count as "Qualified (weekly)" and do NOT consume a monthly spot.
   - Of the remaining players, the top MONTHLY_QUALIFIER_COUNT
     are marked "Monthly Qualifier". Everyone else: "In Contention".
   ============================================================ */

(function () {
  const CFG = window.FC26_CONFIG;
  const API = window.FC26_API;
  const MONTHLY_COUNT = CFG.MONTHLY_QUALIFIER_COUNT;

  const elBody = document.getElementById('board-body');
  const elState = document.getElementById('board-state');
  const elTallyCount = document.getElementById('tally-count');
  const elTallyFill = document.getElementById('tally-fill');
  const elTallyBreakdown = document.getElementById('tally-breakdown');

  function showState(html) {
    elBody.innerHTML = '';
    elState.innerHTML = html;
    elState.style.display = 'block';
  }
  function hideState() {
    elState.style.display = 'none';
    elState.innerHTML = '';
  }

  // Group raw rows into one entry per player using their best score.
  // A player counts as a weekly qualifier if ANY of their rows has the
  // Weekly Qualifier checkbox ticked.
  function buildPlayerSummary(records) {
    const byPlayer = new Map();

    for (const r of records) {
      const key = r.playerName.toLowerCase();
      const existing = byPlayer.get(key);
      if (!existing) {
        byPlayer.set(key, {
          playerName: r.playerName,
          bestScore: r.score,
          bestWeek: r.week,
          weeklyQualifier: r.weeklyQualifier,
        });
      } else {
        if (r.score > existing.bestScore) {
          existing.bestScore = r.score;
          existing.bestWeek = r.week;
        }
        if (r.weeklyQualifier) existing.weeklyQualifier = true;
      }
    }

    return Array.from(byPlayer.values()).sort((a, b) => b.bestScore - a.bestScore);
  }

  function renderTally(summary) {
    const weeklyCount = summary.filter((p) => p.weeklyQualifier).length;
    const monthlyCount = Math.min(
      MONTHLY_COUNT,
      summary.filter((p) => !p.weeklyQualifier).length
    );
    const totalFilled = weeklyCount + monthlyCount;
    const totalSpots = CFG.TOTAL_FINALS_SPOTS;

    elTallyCount.innerHTML =
      '<span class="filled">' +
      pad(totalFilled) +
      '</span><span class="total"> / ' +
      pad(totalSpots) +
      '</span>';

    const pct = Math.min(100, Math.round((totalFilled / totalSpots) * 100));
    elTallyFill.style.width = pct + '%';

    elTallyBreakdown.innerHTML =
      '<span>WEEKLY QUALIFIED: <strong>' +
      weeklyCount +
      '</strong></span>' +
      '<span>MONTHLY QUALIFIERS: <strong>' +
      monthlyCount +
      ' / ' +
      MONTHLY_COUNT +
      '</strong></span>' +
      '<span>TOTAL ENTRANTS: <strong>' +
      summary.length +
      '</strong></span>';
  }

  function renderBoard(summary) {
    if (!summary.length) {
      showState(
        '<div class="empty-state"><div class="icon">—</div>' +
          '<div>No scores recorded yet.</div></div>'
      );
      return;
    }

    hideState();
    elBody.innerHTML = '';

    // Walk the sorted list. Weekly qualifiers are "already qualified".
    // For the remaining (in-contention) players, the first MONTHLY_COUNT
    // get the "Monthly Qualifier" treatment.
    let monthlyAwarded = 0;
    let displayRank = 0;

    summary.forEach((p) => {
      displayRank += 1;
      const tr = document.createElement('tr');

      let badge = '';
      if (p.weeklyQualifier) {
        tr.classList.add('already-qualified');
        badge = '<span class="badge badge-dim">Qualified · Weekly</span>';
      } else if (monthlyAwarded < MONTHLY_COUNT) {
        tr.classList.add('qualifier-monthly');
        badge = '<span class="badge badge-silver">Monthly Qualifier</span>';
        monthlyAwarded += 1;
      } else {
        badge = '<span class="badge badge-muted">In Contention</span>';
      }

      tr.innerHTML = `
        <td class="rank">${pad(displayRank)}</td>
        <td>
          <div class="player">${escapeHtml(p.playerName)}</div>
        </td>
        <td class="score">${formatNumber(p.bestScore)}</td>
        <td class="week-cell">${escapeHtml(p.bestWeek) || '—'}</td>
        <td>${badge}</td>
      `;
      elBody.appendChild(tr);
    });
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function formatNumber(n) {
    if (typeof n !== 'number') return '0';
    return n.toLocaleString('en-US');
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function init() {
    showState(
      '<div class="loading-state"><div class="spinner"></div>' +
        '<div class="label">Loading monthly standings…</div></div>'
    );

    try {
      const records = await API.fetchAllScores();
      const summary = buildPlayerSummary(records);
      renderTally(summary);
      renderBoard(summary);
    } catch (err) {
      console.error(err);
      showState(
        '<div class="error-state"><div class="icon">!</div>' +
          '<div>Could not load leaderboard.</div>' +
          '<div class="help">' +
          escapeHtml(err.message) +
          '</div></div>'
      );
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
