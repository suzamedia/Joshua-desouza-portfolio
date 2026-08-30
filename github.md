repo: suzamedia/Joshua-desouza-portfolio
branch: main

## Last sync
date: 2026-08-30T07:39:01Z

### Updated in this project (not yet reflected on GitHub — manual upload pending)
- Site-wide bug pass: fixed a double-render on the home page hero title, removed a dead animation loop on the Updates page, removed 3 broken image references, slowed/added top-zone auto-scroll on Union Work & Freelance pages.
- About page and Updates page images now scale up on hover.
- Page transitions changed from a sliding animation to a quick opacity fade.
- Repo (github.com/suzamedia/Joshua-desouza-portfolio) has accumulated stray upload folders (`github-export/`, `github-update/`, `update-package/`, `screenshots/`, `examples/`, `Digital portfolio website design/`) and duplicate loose images at root — repo's `index.html` and other root files are stale versus this project. User is manually cleaning up and re-uploading.

## Sync history
- 2026-08-21T16:03:21Z @ 24193376c809 — initial connection; noted repo lacked shared JS modules (image-slot.js, page-transition.js, support.js, upcoming-projects.js) at the time.

## Screen map
| Project screen | Repo files |
|---|---|
| Landing | Joshua DeSouza Landing.dc.html, uploads/* |
| Union Work | Joshua DeSouza Portfolio.dc.html |
| Freelance | Joshua DeSouza Freelance.dc.html |
| About | Joshua DeSouza About.dc.html |
| Updates/Press | Joshua DeSouza Press.dc.html |
| Union credits (print) | Joshua DeSouza Credits.dc.html — not in repo yet |
| Freelance credits (print) | Joshua DeSouza Freelance Credits.dc.html — not in repo yet |

Note: the repo doesn't yet have the shared JS modules (image-slot.js, page-transition.js, support.js, doc-page.js, upcoming-projects.js) that these pages load — worth adding so the site runs standalone from the repo.
