# Launch the homepage rework as a new branch

Repo: `suzamedia/Joshua-desouza-portfolio` · live branch: `main` · new branch: `oct-4th-updates`

## Before uploading
Leave out of the upload: `screenshots/`, `downloads/`, `Headline Drafts.dc.html`, `Camera Man.html`, `Girl Poses.html`, `Missed Shots.html` (drafts, not site pages). Everything else goes at the repo root, keeping `uploads/` and `api/` as folders.

## Option A — GitHub website (no command line)
1. Open the repo on github.com.
2. Click the branch dropdown (says `main`) → type `oct-4th-updates` → "Create branch oct-4th-updates from main".
3. With `oct-4th-updates` selected: Add file → Upload files → drag in the files from this zip → "Commit directly to the oct-4th-updates branch".
4. Delete `index.html` on this branch if it exists (so `/` serves the new homepage via `vercel.json`).

## Option B — git
```
git clone https://github.com/suzamedia/Joshua-desouza-portfolio.git
cd Joshua-desouza-portfolio
git checkout -b oct-4th-updates
# copy the zip contents over the repo root, replacing files
git add -A
git commit -m "Homepage rework: process chapters + new hero"
git push -u origin oct-4th-updates
```

## Preview it (Vercel)
Vercel builds a preview for every branch automatically.
1. vercel.com → your project → Deployments.
2. Find the `oct-4th-updates` deployment → Visit. URL looks like `joshua-desouza-portfolio-git-oct-4th-updates-….vercel.app`.
3. Check: `/`, `/home`, `/about-me`, `/union-work`, `/freelance`, mobile layout, Recent Work, contact modal.

## Launch it (make it live on jdesouza.ca)
1. On GitHub: Pull requests → New pull request → base `main` ← compare `oct-4th-updates` → Create → Merge.
2. Vercel deploys `main` to jdesouza.ca within a minute or two.

## Roll back
Vercel → Deployments → pick the previous production deployment → ⋯ → "Promote to Production". Or on GitHub, open the merged PR and click "Revert".

## Note
The admin/CMS files (`admin.html`, `api/`, `site-cms.js`, `package.json`) are parked and untested. Pages fall back to built-in content if `/api/content` isn't set up, so they're safe to include.
