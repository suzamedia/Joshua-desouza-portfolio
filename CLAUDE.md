# Homepage rework brief (jdesouza.ca) — standing instructions

Homepage (Joshua DeSouza Home.dc.html, served at / and /home) becomes client-facing. Evolve the existing site; never rebuild. Don't touch other pages unless needed to support the homepage. Keep nav, Recent Work functionality, project content, responsive behavior, typography, colors, animation language. No new libraries.

Core idea: concept → funding → production → finished project → out in the world.
Flow: YOUR IDEA → CREATIVE COLLABORATION → FUNDING → YOUR TEAM → PRODUCTION → POST & RELEASE → RECENT WORK.

## Hero
"YOUR [FILM / COMMERCIAL / PSA / MUSIC VIDEO] COMES TO LIFE"
YOUR (left) · cycling word fixed in place, sentence never shifts · COMES TO LIFE (right). Large, bold, existing type. Polished cinematic flip — primary motion statement, not a generic carousel. Hero stays clean.

## Process (major chapters: big numbers, big type, sticky/scroll interaction, visual continuity)
01 CREATIVE COLLABORATION — "Shape the idea. Find the story. Build the plan." — From the first conversation to the first draft, I help turn loose ideas into clear, producible projects. We talk through the vision, develop the approach, and figure out what it actually takes to make it happen.
02 GRANTS & FUNDING — "Turn great ideas into funded projects." — I've helped raise $75,000+ in grant funding for films I've produced. From identifying opportunities to developing applications, budgets, and project materials, I work collaboratively to position projects for funding. ($75,000+ very prominent; strongest credibility moment.)
03 CREW ASSEMBLY — "The right people make all the difference." — I bring a deep network of trusted creatives, technicians, and production professionals to the table. People I know, people I trust, and people who love being on set with me. (Network + trust + relationships; nothing cheesy/literal.)
04 PRODUCTION MANAGEMENT — "Paperwork handled. Details covered." — Contracts. Insurance. Permits. Call sheets. Schedules. Budgets. Receipts. Releases. / I take care of the moving pieces behind the scenes so the creative team can focus on what happens in front of the camera. (Items may appear on scroll. Never title it "Production Paperwork & Accounting".)
05 PRODUCTION — "Now we make it." — This is where the planning becomes tangible. I keep the production moving, solve problems as they come, and make sure the team has what they need to execute the vision. Then: "YOU MAKE THE VISION. / I MAKE IT HAPPEN." (one of the strongest moments; use BTS/production imagery already on site.)
06 POST, FESTIVALS & DISTRIBUTION — "Finish strong. Get it out there." — The shoot isn't the finish line. I help carry projects through post-production, final deliverables, festival submissions, and the next steps toward getting your work seen. (Don't oversell distribution.)

## Recent Work
Follows the process as its proof ("Okay, what has this actually produced?"). Keep existing content/functionality.

## Tone
Cinematic, modern, editorial, bold, personal, professional, confident. Independent producer, not a company/agency. Message: "I understand the creative vision, and I know how to actually make it happen."
Avoid: agency layouts, corporate/buzzword copy, stock aesthetics, heavy gradients, complicated UI, excessive animation, résumé feel.
Copy above is verbatim — don't rewrite.

## Tucked-away code
- "View Union work and freelance work home page buttons" (cta-buttons block in Joshua DeSouza Home.dc.html) is hidden behind `showHomeButtons: false` in renderVals. Restore by setting it true when the user asks for that phrase.

## Parked — come back to another day
- **Hidden admin / CMS** (built, NOT deployed or tested). Footer "2026" links to /admin. Files: admin.html, site-cms.js, site-content.js, news-items.js, loadUpcoming() in upcoming-projects.js, api/*.js, package.json, vercel.json /admin rewrite, ADMIN.md (setup: Vercel Blob + ADMIN_EMAIL / ADMIN_PASSWORD env vars). Pages load site-cms.js and read news/upcoming from /api/content, falling back to the built-in lists. Before relying on it: set up Vercel Blob + env vars, deploy, then test login, text edit, image replace, and add/edit/delete of news and upcoming. Remind the user it's parked when they mention admin, login, or editing the site.
