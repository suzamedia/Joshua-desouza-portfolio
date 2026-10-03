# Admin setup (one-time)

The footer year (© 2026) on every page links to `/admin`. Login is checked on the server, so the password is never in the page code.

1. In Vercel: Project → Storage → Create → **Blob**, connect it to the project (adds `BLOB_READ_WRITE_TOKEN`).
2. Project → Settings → Environment Variables, add:
   - `ADMIN_EMAIL` — the only email allowed in
   - `ADMIN_PASSWORD` — a long, unique password
   - `SESSION_SECRET` — optional, any random string
3. Redeploy. The `api/` folder and `package.json` (needs `@vercel/blob`) are picked up automatically.

## Using it
- `/admin` → log in → **News** / **Upcoming projects**: add, edit, delete, reorder. Publishing creates the new card on the Updates page (and Home for upcoming projects) automatically.
- **Edit site text & images** opens the site with editing on: click any text to change it, hover an image and press *Replace image*, then *Save changes*. Cards on Updates and Home are edited from the manager instead.
- Edits are stored in Blob as `site-content.json` and applied on top of the page text, so the original files stay as the fallback. Changes can take ~15 seconds to appear for visitors.

Not covered: the two printable work-history pages.
