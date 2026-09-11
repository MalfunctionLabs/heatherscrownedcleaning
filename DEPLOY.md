# Heather's Crowned Cleaning — deployment

Built 2026-09-11 by WIRE.2 (Workspace Integration & Routing Engineer).
This is the deployment road, not the site design.

WHO OWNS WHAT (corrected 2026-09-11, later the same day, per direct
UserSubmit statement — an earlier version of this line placed deployment
with UserSubmit and was written before the structure was set):

- WEB.0 owns HCC build AND deployment, through launch. It runs Trial.
  Document. Adjust. Launch. At launch it hands over and rotates to a
  different project.
- WEBHCC.0 comes online at launch and becomes sole owner of HCC web
  services from that point.
- DNS and the client relationship stay with UserSubmit.
- malfunctionlabs.com is NOT in this lane and never will be. That is
  WEBML's chair, a separate repo and a separate site.
- WIRE.2 built this repo and owns the pipeline itself, not the site.

## What this repo is

One page. `index.html`, 109 KB, from
`heatherscrownedcleaningv19porkbun.zip` — build v19, supplied by
UserSubmit 2026-09-11.

This repo starts at v19 deliberately. An earlier local commit held v9,
the build that is live at the current host, so the diff between live and
proposed would sit in the history. UserSubmit's call was to start clean
at v19 while the road is still being laid, and nothing had been pushed,
so the history was still ours to choose. The v9 zip remains untouched in
the parent folder if that comparison is ever wanted.

Per v19's own changelog comment, it sits on top of v18 and makes home an
in-page route so the lockup and back link work in viewers that block
reloads, adds Home as the first menu and footer item, and closes the
menu on any selection. Beyond that it carries a six-item nav, social
links for TikTok, Instagram and X alongside Facebook, a revised owner
quote, and a licensed-and-insured line.

VERIFIED BY DRIVING IT, not by reading it: served locally, page renders
with the approved logo, menu opens, selecting Services routes in-page,
the document title updates, and the menu closes. All three of v19's
stated changes confirmed working.

CORRECTED 2026-09-11, per Mop.1, flagged by WEB.0: the claim below that
this page is fully self-contained is WRONG. `index.html` line 11 opens
with `@import url('https://fonts.googleapis.com/css2?...')` pulling
Archivo and Playfair Display from Google Fonts, which in turn pulls the
actual font files from fonts.gstatic.com. Two outbound dependencies
exist beyond the Facebook link: the stylesheet import and the font
files it loads. If Google Fonts is blocked or slow, Archivo falls back
to system-ui and the owner's quote loses its Playfair italic — the page
degrades visibly, it does not fail to load. Both logo images ARE
correctly inlined as base64 webp (verified), so that part of the
original claim stands; only the "no external stylesheets" part was
wrong.

Original (incorrect) text, kept for paper trail: "Verified self-
contained: no external stylesheets, scripts, or image files. The only
outbound references in the whole document are a Facebook link and a
`mailto:` address. Both logo images are inlined as base64 webp, which
means the approved production logo travels inside the file and cannot
be broken by a missing asset path."

Consequence: **there is no build step.** No bundler and no generator.
What is in this folder is exactly what gets served. It is not dependency
free, per the correction above, but nothing has to be compiled or
assembled before serving it.

## Why GitHub Pages

- A `git push` is the whole deploy. The site rebuilds on its own, well
  under a minute.
- Every change is a commit, so there is a dated history of what the
  client's site said and when — the same discipline the rest of this org
  runs on, applied to the thing the client actually sees.
- A bad deploy is `git revert` plus a push. Rolling back does not mean
  finding an old zip.
- Free TLS certificate on the custom domain, issued and renewed by
  GitHub.

## Limits, stated plainly

Static hosting only. No server-side code and no database. If the page
ever needs a working contact form, it needs a third-party form endpoint —
the current page uses a `mailto:` link, which needs nothing.

A private repo requires a paid GitHub plan to publish Pages. A public
repo publishes free. This page contains no secrets, only public business
contact details already published on the live site.

| Limit | Value |
|---|---|
| Site size | 1 GB |
| Bandwidth | 100 GB / month |
| Builds | ~10 / hour |

## Current state of this machine

Checked 2026-09-11, all verified rather than assumed:

- `git` 2.55.0.windows.5 — INSTALLED.
- GitHub CLI (`gh`) — NOT INSTALLED. Not required; plain git over HTTPS
  is enough.
- Global git identity — WAS UNSET. Not changed. This repo carries a
  repo-local identity instead, so nothing machine-wide was touched:
  - `user.name` = Malfunction Labs
  - `user.email` = joshdeanvaldez@gmail.com
  - Change with `git config user.name` / `user.email` inside this folder.
- SSH keys — NONE present.
- Stored git credentials — NONE present.
- Git Credential Manager 2.9.1 — INSTALLED, and already set as the
  system credential helper.

**No access token is needed.** That last line is why. Credential Manager
opens a browser sign-in on the first push and Windows stores the result,
so no token has to be created, pasted, or handled by anyone. An earlier
version of this file called for a personal access token; that was
written before Credential Manager was checked for, and it is not the
path to use.

**The only real gap between this repo and a live site is that first
sign-in.** Everything else is done.

## Remaining steps — these need UserSubmit, not a specialist

The GitHub account is `MalfunctionLabs` — a personal account, no
organizations, verified 2026-09-11.

1. Create the GitHub repo under that account. Public unless the paid
   plan is already in place. Leave every initialize box unticked: a
   generated readme or licence will collide with the commits already
   here.
2. Run the first push yourself, so the Credential Manager sign-in window
   appears on your own screen. After it succeeds, credentials are cached
   and a specialist can push without further authentication.
3. Point the remote at it and push:

   ```
   git remote add origin <repo url>
   git push -u origin main
   ```

4. In the repo: Settings → Pages → deploy from branch `main`, folder
   root. The site goes live at the `github.io` address within a minute.
5. Custom domain, when and only when UserSubmit decides to move off the
   current host:
   - Add a file named `CNAME` to this folder containing exactly
     `heatherscrownedcleaning.com` and nothing else.
   - At the registrar, point the apex A records at GitHub's four Pages
     addresses and `www` at the `github.io` hostname.
   - Tick Enforce HTTPS once the certificate issues.

   **`CNAME` is deliberately absent from this repo.** Adding it before
   DNS is switched takes the default `github.io` URL out of service, and
   the live site stays where it is until UserSubmit moves it.

## Cutover note

**PARITY CONFIRMED 2026-09-11.** This repo is byte-for-byte identical to
what is serving at heatherscrownedcleaning.com right now. Fetched the
live page and compared: both 109,470 bytes, both MD5
`ccd1a36f492b8364bac7552d9f944fe0`. Not "looks the same" — the same
file.

That is why the repo starts at v19 rather than v9, and it changes what
the cutover is. Pointing DNS at Pages does not change what a visitor
sees. It changes only where the identical bytes are served from. The
comparison step is therefore a confirmation, not a judgement call: stand
Pages up, fetch its `github.io` address, and check the hash still
matches before touching DNS.

Re-run the check any time with:

```
curl -sL https://heatherscrownedcleaning.com | md5sum
md5sum index.html
```

If those ever stop matching, the repo and the live site have diverged
and the cutover is no longer invisible. Find out why before switching.

The site is live at the current host right now and nothing here touches
that. The move is reversible at every point up until the DNS switch, and
reversible after it by putting the records back.

## Updating the site after this is live

Edit `index.html`, commit, push. That is the entire procedure.

Do not edit the page's design without WEB.0. Do not regenerate or replace
the inlined logo: `HCC_logo_LIVE_SITE_900.webp` is the only approved
production logo, per Mesh.0's sealed record, and it is already embedded
in this file.
