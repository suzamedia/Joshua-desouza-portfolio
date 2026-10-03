# Deploying this site on GitHub

This is a static site — no build step. Every page works by opening the file directly.

## 1. Create a new GitHub repo
1. Go to github.com → New repository. Name it whatever you like (e.g. `joshua-desouza-portfolio`).
2. Keep it public (needed for free GitHub Pages) or private if you're hosting elsewhere (e.g. Vercel).
3. Don't initialize with a README — you're uploading existing files.

## 2. Upload the files
Easiest path (no git command line needed):
1. On the new repo's page, click "uploading an existing file".
2. Drag in every file and folder from this zip, preserving the `uploads/` folder structure.
3. Commit directly to `main`.

Or with git:
```
git init
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git add .
git commit -m "Initial site upload"
git branch -M main
git push -u origin main
```

## 3. Host it
**Option A — Vercel (recommended — this project includes a `vercel.json`)**
1. vercel.com → Add New Project → Import your GitHub repo.
2. Framework preset: "Other" (static). No build command, no output directory override needed.
3. Deploy. Add your custom domain under Project → Settings → Domains.

The clean URLs (`/home`, `/union-work`, `/about-me`, …) are produced by the rewrites in `vercel.json`, so Vercel is the host this site is set up for.

**Option B — GitHub Pages (free, but needs link changes)**
GitHub Pages has no rewrite support, so every clean path (`/home`, `/union-work`, …) would 404. To use Pages you'd have to either rename the pages to match those paths (e.g. a `union-work/index.html`) or change every internal link to the real filenames. Only take this route if you don't want Vercel.

1. Repo → Settings → Pages.
2. Source: "Deploy from a branch" → branch `main`, folder `/ (root)`.
3. Save. Your site will be live at `https://YOUR-USERNAME.github.io/YOUR-REPO/` in a minute or two.
4. To use your own domain (e.g. jdesouza.ca): add a `CNAME` file at the repo root containing just your domain, then point your domain's DNS at GitHub Pages (an `A` record to GitHub's IPs, or a `CNAME` record to `YOUR-USERNAME.github.io`) and set the custom domain in the same Settings → Pages screen.


## What's in this export
- `Joshua DeSouza Home.dc.html` — home page (served at `/` via vercel.json rewrite)
- `Joshua DeSouza Portfolio.dc.html` — Union Work
- `Joshua DeSouza Freelance.dc.html` — Freelance
- `Joshua DeSouza About.dc.html` — About
- `Joshua DeSouza Press.dc.html` — Updates
- `Joshua DeSouza Credits.dc.html` / `Joshua DeSouza Freelance Credits.dc.html` — printable resume pages
- `404.html` — custom not-found page
- `support.js`, `page-transition.js`, `image-slot.js`, `mesh-text.js`, `footer-name-fit.js`, `doc-page.js`, `upcoming-projects.js` — shared scripts every page loads; keep them at the repo root alongside the pages
- `uploads/` — every image the pages reference
- `robots.txt`, `sitemap.xml`, `vercel.json`

All internal links use clean paths like `/home`, `/union-work`, etc. They resolve through the rewrites in `vercel.json`, so keep the files at the repo root with their current names — don't rename or nest them.
