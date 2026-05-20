/* ============================================================
   FC26 LEADERBOARD — CONFIG
   ============================================================
   Edit this file to plug in your Airtable credentials.
   This is the ONLY file you should need to change after setup.
   ============================================================ */

window.FC26_CONFIG = {
  // Your Airtable Personal Access Token (read-only scope is sufficient).
  // Get one at: https://airtable.com/create/tokens
  // Required scope: data.records:read   |   Required base: your FC26 base
  AIRTABLE_TOKEN: 'patmp1SWmV1v90LD3.63ec2ab8c540f596615310fbb17e296f6b0b05f8fb422c25e1efeebfba8a1e95',

  // Your Airtable Base ID — starts with "app..."
  // Find it at: https://airtable.com/api  (open your base and copy the ID from the URL)
  AIRTABLE_BASE_ID: 'app7RFMT3x0TPljWg',

  // The table name inside your base. Must match exactly.
  AIRTABLE_TABLE_NAME: 'Scores',

  // ----- Event settings (safe to edit) ---------------------------------
  // The Sunday-night deadline shown on the weekly board.
  WEEKLY_DEADLINE_LABEL: 'Sunday at 11:59 PM',

  // How many spots count as "weekly qualifiers" per week.
  WEEKLY_QUALIFIER_COUNT: 4,

  // How many monthly qualifier spots are available (excluding weekly qualifiers).
  MONTHLY_QUALIFIER_COUNT: 16,

  // Total finals invitations: 4 weekly × 4 weeks + 16 monthly = 32
  TOTAL_FINALS_SPOTS: 32,

  // Week start dates (used to auto-detect the current week on the weekly page).
  // Format: YYYY-MM-DD (Monday of each week). Edit if your event dates change.
  // Default below assumes the event runs the four weeks leading into July 28th.
  WEEK_DATES: {
    'Week 1': '2026-06-29',
    'Week 2': '2026-07-06',
    'Week 3': '2026-07-13',
    'Week 4': '2026-07-20',
  },
};
