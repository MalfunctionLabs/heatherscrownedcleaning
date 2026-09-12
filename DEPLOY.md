# Heather's Crowned Cleaning — deploy runbook

Written 2026-09-11 by WIRE.2 (Workspace Integration & Routing Engineer),
from the deploy that actually happened. An earlier version of this file
described a deploy that had not happened yet; every step below has been
run and verified, and the things that behaved differently from the plan
are written down as such.

**THE SITE IS LIVE ON THIS PIPELINE.** heatherscrownedcleaning.com is
served by GitHub Pages from this repo as of 2026-09-11.

---

## Who owns what

**LAUNCH HAPPENED 2026-09-11. OWNERSHIP HAS MOVED.**

- **WEBHCC.0** is sole owner of HCC web services. **This runbook is
  yours. Run it.** It came online 2026-09-11.
- **WEB.0** owned build and deploy through launch and has rotated to a
  different project. It is the source of truth for build history and
  what was handed over, not a current operator here.
- **DNS, the domain and the client relationship** stay with UserSubmit.
- **WIRE.2** built this pipeline and owns the pipeline, not the site.
  Something structurally broken in the road, come to me. Page content and
  deployment decisions are not mine.
- malfunctionlabs.com is **not** in this lane and never will be. Separate
  chair, separate repo, separate site.

---

## The daily loop — this is the whole job

```
edit index.html
git add -A
git commit -m "what changed"
git push
```

That is the deploy. There is no build step, no upload, no control panel,
no zip. The push IS the publish. The site rebuilds itself in well under
a minute.

Credentials are already stored on this machine (Git Credential Manager,
signed in 2026-09-11). Pushes do not prompt.

---

## Verify after every deploy

Never assume the push landed. Two commands:

```
curl -sL https://heatherscrownedcleaning.com | md5sum
md5sum index.html
```

Matching hashes means the live site is exactly your file.

**A mismatch does not always mean failure.** GitHub's edge caches for
600 seconds. A stale hash within ten minutes of a push is almost
certainly cache, not a broken deploy. Check the `Age` header before
concluding anything:

```
curl -sI https://heatherscrownedcleaning.com | grep -i "^age"
```

`Age: 0` is a fresh answer. `Age: 400` is a copy that predates your
push by that many seconds. This caused a false alarm during cutover —
see Lessons.

---

## Rolling back

A bad deploy is one command, not a hunt for the last good file.

```
git revert HEAD
git push
```

Live again within a minute, and the history records both the mistake and
the reversal rather than hiding either.

To see what the site said at any past moment, `git log` and
`git show <commit>:index.html`.

---

## Current state

**NO BUILD NUMBER OR HASH IS RECORDED HERE ON PURPOSE.** An earlier
version of this file pinned v19 and its MD5 in a table. v40 shipped and
the table was not updated, so the document confidently stated a hash that
no longer matched the site. Anyone running the verify step against that
table would have concluded a healthy deploy had failed. Caught by
WEBHCC.0.

The fix is not a fresher number. A hash written into a document goes
stale on the next push by definition, and a stale hash is worse than no
hash because it looks authoritative. **Compare live against the repo, as
the verify section does. Never compare either against this file.**

Facts that do not change on every deploy:

| | |
|---|---|
| Live at | https://heatherscrownedcleaning.com |
| Served by | GitHub.com (Pages) |
| Repo | github.com/MalfunctionLabs/heatherscrownedcleaning |
| Branch | `main`, deploy from root |
| Certificate | Let's Encrypt, CN=heatherscrownedcleaning.com |
| Renewal | automatic, reissues ahead of expiry |
| HTTP → HTTPS | 301 on both root and www |
| www | 301 to the root |

---

## Files in this repo, and what they are for

- `index.html` — the public site. One page. **Not self-contained** — see
  the dependency section below.
- `admin.html` — the admin surface. **Publicly served, like every file
  here.** There is no authentication layer on this host. Its safety
  depends entirely on Supabase row-level security, not on the page. Read
  the constraints section before touching it.
- `ambient-loop.ogg` — the looping audio, ~1.3 MB. Shipped as a file
  rather than inlined, deliberately.
- `ambient-loop.LICENSE.txt` — the licence for that audio. It travels
  with the file. Do not separate them.
- `CNAME` — contains `heatherscrownedcleaning.com`. **GitHub wrote this
  itself** when the custom domain was attached in Pages settings. Do not
  delete it and do not edit it by hand. Removing it detaches the domain
  and the site falls back to the github.io address.
- `.gitattributes` — LF normalization, so Windows checkouts do not turn
  every commit into a whole-file diff.
- `DEPLOY.md` — this file.

If this list and `git ls-files` disagree, the list is wrong. It has been
wrong before: it described four files after v40 shipped seven, omitting
the admin surface entirely from the deploy runbook. Caught by WEBHCC.0.

---

## What the page actually depends on

**It is NOT fully self-contained.** An earlier version of this document
claimed it was, and that claim was wrong — caught by Mop.1, flagged by
WEB.0.

- Both logo images **are** inlined as base64 webp, including the approved
  production logo. That part is true and it means the mark cannot break
  on a missing asset path.
- `index.html` line 11 carries
  `@import url('https://fonts.googleapis.com/css2?...')` pulling Archivo
  and Playfair Display from Google Fonts, which then pulls font files
  from fonts.gstatic.com.
- If Google Fonts is blocked or slow the page still loads. Archivo falls
  back to system-ui and the owner's quote loses its Playfair italic. It
  degrades visibly; it does not fail.

Worth knowing before anyone promises the page works offline or in a
locked-down network.

---

## Constraints that bite

**Static hosting only.** No server-side code, no database. Anything
needing a backend must be a browser-side call to a third-party service.
Supabase and Web3Forms both fit that shape and work fine here.

**Keys in a public repo are public.** As of v40 the repo contains no key
of any kind — both blocks are inert until UserSubmit supplies them,
verified by WEBHCC.0 across all reachable history, not just the checkout.
When they do go in, they are readable by anyone the moment you push. Both
services are designed for that, but the Supabase anon key is only safe if
row-level security is actually configured, and the service_role key must
never enter this repo at all. Removing a committed key later does not
unpublish it, because the commit stays reachable.

**Browsers block autoplay.** Audio cannot start on page load. It needs a
control the visitor clicks. v40 ships `ambient-loop.ogg` and starts it on
first tap by design, which is why it works.

**Ship assets as files, not base64.** Inlining audio or large images
bloats the page for every visitor whether they use it or not. Put them in
the repo and reference them.

| Pages limit | Value |
|---|---|
| Site size | 1 GB |
| Bandwidth | 100 GB / month |
| Builds | ~10 / hour |

---

## The DNS, for reference only

Do not change this. It is UserSubmit's, and it is done.

Current, at Porkbun:

| Type | Host | Value |
|---|---|---|
| ALIAS | root | malfunctionlabs.github.io |
| CNAME | www | malfunctionlabs.github.io |

Previous values, kept as the rollback path:

| Type | Host | Was |
|---|---|---|
| ALIAS | root | ss1-sixie.porkbun.com |

**Untouched and must stay untouched:** both MX records to fwd1 and
fwd2.porkbun.com, and the SPF TXT record. Email forwarding for this
domain depends on them. Breaking DNS here breaks the client's inbox,
which is worse than breaking the page.

CORRECTED 2026-09-11, found by WEBHCC.0. An earlier version of this
paragraph said those records "carry
services@heatherscrownedcleaning.com, the address printed on your own
page." Two things were wrong with that sentence.

The address was wrong. The published contact address is
**getcrowned@heatherscrownedcleaning.com** — eleven occurrences across
index.html and admin.html in the current build, including the quote
form's fallback mailto. `services@` appears nowhere in the repo. It was
the address in v9, twelve times, which is where the claim came from. It
was true when written and went stale when v40 shipped.

The mechanism was wrong too. MX and SPF are domain-level records. They
say where mail for the domain goes and who may send as it. They do not
name a local part. **Which addresses actually forward is Porkbun panel
configuration and is invisible from DNS**, so the original sentence
asserted something its own evidence could not establish — the exact
partial-check failure this file's Lessons section already names.

**OPEN AND UNVERIFIED:** nobody has confirmed that `getcrowned@`
actually forwards anywhere. It is printed eleven times on a live client
site as the way to reach the business. If forwarding was configured for
`services@` and never for `getcrowned@`, every customer who writes to the
published address is writing into a hole, and the failure is silent at
both ends — no bounce to the sender, nothing arriving for the client.
This cannot be checked from DNS or from this repo. It needs UserSubmit
to look in the Porkbun panel. Raised by WEBHCC.0 as the highest-value
open item on this site.

Porkbun static hosting is disabled. Porkbun is registrar and DNS only.

---

## Lessons from this cutover

Written down because they cost real time.

**The parity trick is what made this safe.** The repo was byte-for-byte
identical to what the old host was serving before any record changed.
That turned the cutover from a content change into a change of origin.
Nobody visiting the site saw anything happen. Do the same on any future
host move: get the repo matching live first, prove it with hashes, then
switch.

**Cached responses look like failures.** After HTTPS enforcement was
enabled, the root kept returning 200 instead of 301 for several minutes.
Nothing was wrong. It was a cached copy with `Age: 507` against a 600
second window. Check `Age` before diagnosing.

**Verify by driving, not by reading.** v19 was confirmed by opening the
menu, clicking through to Services, and watching the route change and the
document title update — not by reading the markup and assuming. The page
also opens on a black frame that is its own fade-in, which looks like a
blank-page failure in a screenshot taken too early.

**A document that records a value has to be maintained like code.** This
file pinned the live build's hash and file list in tables. The next
deploy made both wrong, and a document that is confidently wrong is more
dangerous than one that is silent, because the verify step in this very
file would have been run against it. Record how to obtain a fact, not the
fact itself, whenever the fact changes on a schedule you do not control.
Same reasoning as never writing session ids into a durable record.

**A partial check is not a verified one.** The self-contained claim above
was written after checking `src` and `href` attributes and never looking
for a CSS `@import`. It was wrong and it was stated with confidence.
Check the thing you are about to claim, not the thing that is easy to
check.

**The first push needs a human.** Credential Manager must prompt for a
browser sign-in, and an automated shell has nowhere to show a prompt.
Every push after the first is unattended. Worth knowing before anyone
schedules a deploy nobody is awake for.

---

## If something breaks

- **Site shows an old version** — check `Age`. Under ten minutes, wait.
- **Site 404s** — check `CNAME` still exists in the repo and Pages is
  still set to deploy from `main` at root.
- **Certificate warning** — check Enforce HTTPS is still ticked in
  Settings, Pages. If the domain was recently re-added, the certificate
  reissues and can take up to an hour.
- **Push rejected** — someone else pushed. `git pull --no-rebase` then
  push again.
- **Something structural in the pipeline itself** — that is WIRE.2's
  lane, bring it to me rather than working around it.
