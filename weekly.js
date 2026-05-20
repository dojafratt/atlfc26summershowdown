/* ============================================================
   FC26 LEADERBOARD — Weekly page logic
   ============================================================ */

(function () {
  const CFG = window.FC26_CONFIG;
  const API = window.FC26_API;

  const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const QUALIFIER_COUNT = CFG.WEEKLY_QUALIFIER_COUNT;

  const elTabs = document.getElementById('week-tabs');
  const elBody = document.getElementById('board-body');
  const elState = document.getElementById('board-state');
  const elMetaLabel = document.getElementById('meta-label');
  const elMetaStat = document.getElementById('meta-stat');
  const elDeadline = document.getElementById('deadline-label');

  let allRecords = [];
  let activeWeek = API.currentWeek();

  function showState(html) {
    elBody.innerHTML = '';
    elState.innerHTML = html;
    elState.style.display = 'block';
  }

  function hideState() {
    elState.style.display = 'none';
    elState.innerHTML = '';
  }

  function renderTabs() {
    elTabs.innerHTML = '';
    const current = API.currentWeek();
    WEEKS.forEach((w) => {
      const btn = document.createElement('button');
      btn.className = 'week-tab' + (w === activeWeek ? ' active' : '');
      btn.type = 'button';
      btn.innerHTML =
        w.toUpperCase() +
        (w === current ? ' <span class="current-flag">LIVE</span>' : '');
      btn.addEventListener('click', () => {
        activeWeek = w;
        renderTabs();
        renderBoard();
      });
      elTabs.appendChild(btn);
    });
  }

  function renderBoard() {
    const rows = allRecords
      .filter((r) => r.week === activeWeek)
      .sort((a, b) => b.score - a.score);

    elMetaLabel.textContent = activeWeek.toUpperCase() + ' LEADERBOARD';
    elMetaStat.innerHTML = rows.length
      ? `<strong>${rows.length}</strong> ${rows.length === 1 ? 'entry' : 'entries'}`
      : '<strong>0</strong> entries';

    if (!rows.length) {
      showState(
        '<div class="empty-state"><div class="icon">—</div>' +
          '<div>No scores yet for ' +
          activeWeek +
          '.</div></div>'
      );
      return;
    }

    hideState();
    elBody.innerHTML = '';

    rows.forEach((r, i) => {
      const rank = i + 1;
      const isQualifier = rank <= QUALIFIER_COUNT;
      const tr = document.createElement('tr');
      if (isQualifier) tr.classList.add('qualifier-weekly');

      tr.innerHTML = `
        <td class="rank">${pad(rank)}</td>
        <td>
          <div class="player">${escapeHtml(r.playerName)}</div>
        </td>
        <td class="location col-location">${escapeHtml(r.location) || '—'}</td>
        <td class="score">${formatNumber(r.score)}</td>
        <td>
          ${
            isQualifier
              ? '<span class="badge badge-gold">Qualifier</span>'
              : '<span class="badge badge-muted">Pending</span>'
          }
        </td>
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
    elDeadline.textContent = CFG.WEEKLY_DEADLINE_LABEL;
    renderTabs();

    showState(
      '<div class="loading-state"><div class="spinner"></div>' +
        '<div class="label">Loading scores…</div></div>'
    );

    try {
      allRecords = await API.fetchAllScores();
      renderBoard();
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
