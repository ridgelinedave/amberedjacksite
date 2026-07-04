# ⚠️ LIVE PRODUCTION SITE — The Ambered Jack

**Live domain:** https://www.amberedjack.com  (canonical; apex 301→www)
**Status:** in production, serving real customers.
**Deploy:** git → GitHub repo `amberedjacksite` → Cloudflare Pages (auto-publishes on push to `main`). See this repo's `CLAUDE.md`.

## Rules
- **All edits route through Claude Code**, never edited directly from the planning side (web-developer.md §0).
- Make changes against the local `site/` build, test, then **commit + push to `main`** — Cloudflare Pages auto-publishes; **never hand-edit the live site**.
- Verify on a real mobile viewport + the form before pushing (web-developer.md §3.7–3.8).
- **Deploy = git push to `main`.** Confirm in Cloudflare → Deployments; rollback via "Rollback to this deployment." Deploy zips in `website-deploys/` are frozen backups, NOT the deploy path.
