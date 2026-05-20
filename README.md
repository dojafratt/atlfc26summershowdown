# Atlanta FC26 Monthly Challenge — Leaderboard Site

A static leaderboard site for a four-week FC&nbsp;26 skills tournament.
Scores live in Airtable, the website reads them directly in the browser, and
Vercel hosts everything for free.

**You will not write any code.** The only file you ever need to touch on the
website is `js/config.js`, where you paste two values from Airtable.

---

## What's in this folder

```
fc26-leaderboard/
├── index.html         ← Weekly leaderboard (home)
├── monthly.html       ← Monthly leaderboard
├── about.html         ← About / event info
├── css/
│   └── styles.css     ← All styling
└── js/
    ├── config.js      ← ★ THIS IS THE ONLY FILE YOU EDIT ★
    ├── airtable.js    ← Fetches data from Airtable
    ├── weekly.js      ← Weekly leaderboard logic
    └── monthly.js     ← Monthly leaderboard logic
```

---

## Setup — start to finish

You'll do these five things, in order:

1. Create a free Airtable base with the right columns
2. Get an Airtable token + base ID and paste them into `config.js`
3. Push the folder to a free GitHub repo
4. Connect that repo to a free Vercel account and deploy
5. Add a test row in Airtable and confirm it shows up on the live site

Plan on about 30 minutes start to finish.

---

### Step 1 — Create the Airtable base

1. Go to <https://airtable.com> and sign up for the free plan.
2. Click **Create a base** → **Start from scratch**. Name the base
   **`FC26 Leaderboard`**.
3. Rename the default first table to **`Scores`** (right-click the tab → Rename).
4. Delete the default columns that came with the empty table. Then add these
   six columns in this exact order, with these exact names and types:

   | Column name        | Type              | Notes                                                       |
   |--------------------|-------------------|-------------------------------------------------------------|
   | `Player Name`      | Single line text  | The player's display name                                   |
   | `Score`            | Number            | Integer. Set "Allow negative numbers" to off.               |
   | `Week Number`      | Single select     | Options: `Week 1`, `Week 2`, `Week 3`, `Week 4` (exact)     |
   | `Location`         | Single line text  | Atlanta Parks & Rec or YMCA location                        |
   | `Weekly Qualifier` | Checkbox          | Tick this AFTER the week ends for the top 4 of that week    |
   | `Notes`            | Long text         | Admin-only. Never shown on the site.                        |

5. **Important:** the column names must match exactly — including capitalization
   and spaces. The website looks them up by name.

6. (Optional but recommended) Click the dropdown on each column → **Edit field
   description** and paste in a short reminder of what the field is for. Future
   you will thank present you.

---

### Step 2 — Get your Airtable token and Base ID, and put them in `config.js`

**Personal Access Token (the "API key"):**

1. Go to <https://airtable.com/create/tokens>.
2. Click **Create new token**.
3. Name it `FC26 Leaderboard Read`.
4. Under **Scopes**, add only one scope: `data.records:read`.
5. Under **Access**, add your `FC26 Leaderboard` base.
6. Click **Create token**, then **Copy** the token. It looks like
   `pat14ABCDEFGHIJKLMN...`.

   ⚠️ Airtable only shows you this token once. Paste it into `config.js`
   immediately. If you lose it, just create a new one.

**Base ID:**

1. Go to <https://airtable.com/developers/web/api/introduction>.
2. Click your `FC26 Leaderboard` base in the list.
3. The Base ID appears on the right and in the URL. It starts with `app...`,
   like `appAbCdEfGhIjKlMn`.

**Now edit `js/config.js`:**

Open `js/config.js` in any text editor (Notepad, TextEdit, VS Code — anything).
Find these two lines near the top:

```js
AIRTABLE_TOKEN: 'PASTE_YOUR_AIRTABLE_TOKEN_HERE',
AIRTABLE_BASE_ID: 'PASTE_YOUR_BASE_ID_HERE',
```

Replace the placeholder text with your real token and base ID — keep the single
quotes around them. Save the file.

You can also adjust the `WEEK_DATES` section in this same file if your event
dates differ from the defaults. The site uses these dates to auto-highlight
the current week.

---

### Step 3 — Push the folder to GitHub

If you've never used GitHub before, the easiest path is **GitHub Desktop**:

1. Go to <https://github.com> and create a free account.
2. Download **GitHub Desktop** from <https://desktop.github.com> and install
   it. Sign in with your GitHub account.
3. In GitHub Desktop: **File → Add Local Repository**, choose this
   `fc26-leaderboard` folder.
4. It will say the folder isn't a repository yet — click **create a
   repository** in the dialog. Leave defaults, click **Create Repository**.
5. Click **Publish repository** in the top bar. Uncheck "Keep this code
   private" if you want the code public (the leaderboard site will still work
   either way). Click **Publish Repository**.

Your code is now on GitHub.

---

### Step 4 — Deploy to Vercel

1. Go to <https://vercel.com/signup> and sign up using your **GitHub account**
   (this auto-connects the two services).
2. Once you're in, click **Add New** → **Project**.
3. You'll see a list of your GitHub repositories. Find `fc26-leaderboard` and
   click **Import**.
4. On the configure screen: leave **everything** at defaults. The framework
   preset should auto-detect as "Other" — that's correct.
5. Click **Deploy**.

About 30 seconds later, Vercel gives you a live URL like
`https://fc26-leaderboard.vercel.app`. Open it. You should see the leaderboard
page with "No scores yet" — that's expected because Airtable is still empty.

**Every time you push a change to GitHub from now on, Vercel auto-redeploys
within ~30 seconds.** No clicking required.

---

### Step 5 — Add a test row and confirm

1. Go back to Airtable, open your `FC26 Leaderboard` base.
2. Add a test row:
   - Player Name: `Test Player`
   - Score: `1000`
   - Week Number: `Week 1`
   - Location: `Piedmont Park YMCA`
   - Weekly Qualifier: leave unchecked
3. Refresh your Vercel URL. The test player should appear on the Week 1 tab.
4. Delete the test row in Airtable. Refresh the site. The row should be gone.

If it works, you're done. From here on, all you do is open Airtable and add or
edit rows. The site updates automatically when visitors refresh.

---

## Day-to-day admin workflow

See **`ADMIN_CHEATSHEET.md`** in this folder. Print it or pin it to your
desktop. It covers exactly what to enter for each field and when to tick the
Weekly Qualifier box.

---

## How the monthly leaderboard logic works

You only manage the spreadsheet. The site does the rest. Specifically, the
Monthly Leaderboard page:

1. Pulls every row from Airtable.
2. Groups rows by player name. For each player, it keeps only the **single
   highest score** that player ever posted.
3. Sorts the players by that best score, highest first.
4. Any player whose `Weekly Qualifier` checkbox is ticked on ANY of their rows
   is treated as "already qualified" — they show up on the board (greyed out)
   but they do NOT consume a monthly qualifier spot.
5. Of the remaining (non-weekly-qualifier) players, the top 16 are awarded the
   monthly qualifier spots and shown with the silver highlight.
6. Anyone past spot 16 is shown as "In Contention."

So the only thing you need to do as admin to drive this is: at the end of each
week, look at the Weekly leaderboard, find that week's top 4 players, and tick
their `Weekly Qualifier` checkbox in Airtable. That's it.

---

## Free-tier limits — you won't hit them

- **Airtable free plan:** 1,000 records per base and 100 automations per month.
  A four-week event with even 50 players posting two scores per week is 400
  records — well under the limit. You're not using automations at all.
- **Vercel free plan ("Hobby"):** unlimited static deploys, automatic HTTPS,
  generous bandwidth (100 GB/month). This site is just static files and tiny
  fetch calls, so you'd need tens of thousands of visitors before this matters.

---

## Common issues

**"Could not load leaderboard" with a long error message**

Open `js/config.js` and make sure both the token and base ID are pasted in
correctly with the quotes around them. The most common mistake is extra
whitespace inside the quotes.

**Scores aren't updating on the site**

Hard-refresh the page: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows).
Browsers cache static files aggressively. The data itself is fetched live from
Airtable every page load.

**A player name appears twice on the monthly leaderboard**

You probably typed the name slightly differently on two rows (e.g. "Devon
Mitchell" vs "Devon mitchell" — note the casing). The matching is
case-insensitive but whitespace and spelling have to match exactly. Fix the
typo in Airtable.

**I want to change the week dates**

Edit `WEEK_DATES` in `js/config.js`, save, commit + push the change to GitHub.
Vercel will redeploy automatically.

**Someone made an Airtable change I want to undo**

Airtable has full row history. Right-click any row → **Expand record** →
**Activity** to see who changed what and roll back.

---

## Security note

The Airtable token sits in `js/config.js`, which is downloaded by every
visitor's browser. That's why you created it with the **`data.records:read`
scope only** — even if someone copies the token out of the page source, they
can only READ the Scores table. They cannot edit, delete, or access anything
else in your Airtable account.

For a private community event of this size, that's a perfectly acceptable
tradeoff. If you ever want stricter access control, the upgrade path is to
add a Cloudflare Worker or Vercel Function that holds the token server-side
and proxies requests — but that's overkill for this event and breaks the
"no-server, no-build" promise of this setup.

---

## File-by-file reference

| File              | Purpose                                                       | Do you edit it?           |
|-------------------|---------------------------------------------------------------|---------------------------|
| `index.html`      | Weekly leaderboard page                                       | No                        |
| `monthly.html`    | Monthly standings page                                        | No                        |
| `about.html`      | About / event info page                                       | Only for event copy tweaks|
| `css/styles.css`  | All styling                                                   | Only for visual tweaks    |
| `js/config.js`    | Airtable credentials and event settings                       | **Yes — first-time setup**|
| `js/airtable.js`  | Talks to the Airtable API                                     | No                        |
| `js/weekly.js`    | Renders the weekly board, top-4 highlighting, tab switching   | No                        |
| `js/monthly.js`   | Best-score-per-player aggregation, qualifier exclusion, tally | No                        |

That's the whole site.
