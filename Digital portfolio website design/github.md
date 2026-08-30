repo: suzamedia/Joshua-desouza-portfolio
branch: main

## Last sync
date: 2026-08-21T16:14:44Z
commit: 1a8f962ce22c

### Updated in this project
- Confirmed the mobile fixes, image-alignment fix, and full carousel/mesh-text work are all present on GitHub already (user manually uploaded a full export).
- Fixed a real iOS Safari bug found in the repo's Landing page: adjacent slide content bled through the left edge of the "Recent Work" and "Upcoming Projects" flex carousels during transitions — added per-slide `transform: translateZ(0)` + `backface-visibility: hidden` to force layer isolation. Not yet re-uploaded to GitHub.

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
