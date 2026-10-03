repo: suzamedia/Joshua-desouza-portfolio
branch: main

## Last sync
date: 2026-10-02T21:07:09Z
tree: d94d7ff0d50c (read-only; repo index.html read as reference for the original Recent Work / Upcoming panels)

### Updated in this project (not yet reflected on GitHub — manual upload pending)
- Homepage rework started: "YOUR [FILM / COMMERCIAL / PSA / MUSIC VIDEO] COMES TO LIFE" hero added below current homepage content (staging position).
- Theatre-curtain / Coming Soon experiment removed; original Recent Work + Upcoming panels kept.

### Earlier (2026-08-31)
- Mobile footer compressed: Explore / Connect / More collapse into tap-to-open accordions under 720px (footer 271px collapsed vs ~900px before). Desktop footer unchanged. Intro blurb hidden on mobile; all footer tap targets 44px+.
- Union Work banners: removed the scale-in "shimmer" animation and hover scale, and matched the Freelance scrim gradient — Union and Freelance banners now behave identically.
- DEPLOY.md corrected: clean URLs (`/home`, `/union-work`, …) depend on `vercel.json` rewrites and do NOT work on GitHub Pages.
- Full functional pass: search + highlight, all 16 Union project details, prev/next, contact modal (open + Escape), mobile nav burger, image references (0 broken), all 7 routes present in vercel.json and sitemap.xml. No console errors. No unreferenced files in uploads/.

### Repo cleanup still needed (stale from earlier uploads)
- Delete folders: `github-export/`, `github-update/`, `update-package/`, `examples/`
- Delete root files: `Joshua DeSouza Landing.dc.html`, `Landing CTA Label Options.dc.html`, `mobile-test.html`, `round-carousel.js`
- Delete the ~47 loose images at the repo root (Adam.jpg, SNW Poster.jpg, Screenshot *.png, etc.) — all of them are duplicated inside `uploads/`, which is the only copy the pages load.
- Then upload the current project files over the root.

## Sync history
- 2026-08-31T20:40:07Z — read-only inspection; footer, banner, and deploy-doc fixes logged.
- 2026-08-30T07:39:01Z — noted stray upload folders and duplicate root images; repo root files stale versus project.
- 2026-08-21T16:03:21Z @ 24193376c809 — initial connection; repo lacked shared JS modules at the time (now present at root).

## Screen map
| Project screen | Repo files |
|---|---|
| Landing (Joshua DeSouza Home.dc.html) | index.html, uploads/*, mesh-text.js, upcoming-projects.js |
| Union Work | Joshua DeSouza Portfolio.dc.html |
| Freelance | Joshua DeSouza Freelance.dc.html |
| About | Joshua DeSouza About.dc.html |
| Updates/Press | Joshua DeSouza Press.dc.html |
| Union credits (print) | Joshua DeSouza Credits.dc.html |
| Freelance credits (print) | Joshua DeSouza Freelance Credits.dc.html |
| Shared | support.js, page-transition.js, image-slot.js, footer-name-fit.js, doc-page.js |
