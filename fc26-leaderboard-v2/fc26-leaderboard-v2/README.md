# FC26 Leaderboard — V2 (drop-in replacement)

## What was wrong with the live site

`https://atlfc26summershowdown.vercel.app/` was loading the HTML page but
rendering it unstyled, with no leaderboard data and no week tabs. That
means **two things were failing at the same time**: the `css/styles.css`
file and the JavaScript files in `js/` were both returning 404 from
Vercel. The HTML was found and served, but every other asset was not.

The most likely cause is that the `css/` and `js/` subfolders never made
it into your GitHub repo. This happens commonly:

- **GitHub Desktop:** if you only dragged some files into the repo
  folder, the subfolders can be missed.
- **GitHub web upload:** the drag-and-drop uploader on github.com
  silently drops nested folders in many browsers.
- **Vercel root directory:** if the Vercel project's Root Directory
  setting points to a parent of the actual files, subfolders won't
  resolve.

## What V2 fixes

This rebuild **eliminates the subfolders entirely**. Everything is now
in four flat files at the root:

```
fc26-leaderboard/
├── index.html      ← Weekly leaderboard (home) — all CSS + JS inlined
├── monthly.html    ← Monthly leaderboard — all CSS + JS inlined
├── about.html      ← About / event info — all CSS inlined
└── config.js       ← THE ONLY FILE YOU EDIT (Airtable token + base ID)
```

Whatever caused the subfolder upload issue cannot recur with this
structure — there are no subfolders to lose.

The visual design, the data flow, the Airtable schema, the qualifier
logic, and the admin workflow are all **identical** to V1. No changes
to how you manage scores.

## How to deploy V2

### If your existing repo still has the broken V1 files

1. **Delete the old files from the repo.** Easiest path:
   - Go to your repo on github.com
   - Click each file/folder (`index.html`, `monthly.html`, `about.html`,
     `css/`, `js/`, `README.md`, `ADMIN_CHEATSHEET.html`) and delete it
   - Or in GitHub Desktop: delete the files locally, commit, and push

2. **Add the V2 files to the repo root:**
   - `index.html`
   - `monthly.html`
   - `about.html`
   - `config.js`

3. **Edit `config.js`** to paste in your Airtable token and base ID
   (same values as before — copy from the old `js/config.js` if you
   still have it locally).

4. **Commit and push.** Vercel auto-redeploys in ~30 seconds.

### Or, fresh start

Delete the Vercel project, delete the GitHub repo, then:

1. Create a new empty GitHub repo.
2. Drop the four V2 files into it.
3. Edit `config.js` with your Airtable token + base ID.
4. Commit and push.
5. In Vercel, **Add New → Project**, import the new repo, click Deploy.
   Leave all settings at defaults.

## How to verify after deploying

1. Open your Vercel URL. You should see the dark green-and-white themed
   page with "WEEKLY LEADERBOARD" in big bold type and the four week
   tabs visible.
2. If you have at least one score row in Airtable, it should appear.
3. If the styling looks right but you see a red "Could not load
   leaderboard" error block, the token or base ID in `config.js` is
   wrong — open the file, fix it, push again.
4. If you still see unstyled HTML: open the deployed URL, view source
   in your browser (right-click → View Page Source), and confirm you
   see a giant `<style>` block near the top with hundreds of lines of
   CSS, plus two `<script>` blocks near the bottom. If those are
   missing, the wrong file got pushed.

## What stayed the same

- **The Airtable base.** Same schema. Same `Scores` table. Same six
  columns. Don't change anything in Airtable.
- **The admin workflow.** Tick the Weekly Qualifier checkbox at the
  end of each week for that week's top 4. Everything else just
  appears.
- **The look and feel.** Pixel-identical to V1 because the CSS is the
  same — just embedded instead of linked.
- **The single editable file.** You still only edit `config.js`. It
  just lives at the root now instead of in `/js/`.

## File reference

| File           | Purpose                                       | You edit it? |
|----------------|-----------------------------------------------|--------------|
| `index.html`   | Weekly leaderboard. Self-contained.           | No           |
| `monthly.html` | Monthly leaderboard. Self-contained.          | No           |
| `about.html`   | About page. Self-contained.                   | Event copy   |
| `config.js`    | Airtable token, base ID, week dates           | **Yes**      |

The original `ADMIN_CHEATSHEET.html` from V1 still applies word-for-word
— bring it across if you want to keep using it.
