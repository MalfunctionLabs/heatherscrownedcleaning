/* HCC pricing merge — v1, 2026-09-12, WEBHCC.0
   Shared by index.html and admin.html. ONE definition, because if the site
   and the admin ever merge a saved sheet differently, the admin shows Heather
   one set of prices and customers are quoted another.

   THE PROBLEM THIS SOLVES.

   A saved price sheet used to override the built-in table completely. So any
   correction shipped in code — a fixed time estimate, a repriced service —
   reached nobody, because the saved sheet won every field including the ones
   Heather had never touched. The only way to adopt a correction was to press
   "Load the built-in prices" and Save, which also reset everything she HAD
   set, discounts included. UserSubmit, after doing it once per deploy:
   "I have loaded that damn built in thing everytime. that needs to change."

   THE RULE NOW. Three-way merge, field by field:

       saved value === the default it was saved against
           -> she never touched this. Take the CURRENT default.
       saved value !== the default it was saved against
           -> she changed it on purpose. Keep hers, forever.

   So a corrected default reaches the live site on its own, and an edit of
   hers is never silently overwritten by one. Nobody presses a button.

   HOW THE COMPARISON IS POSSIBLE. Saving now records `basedOn`: a copy of the
   built-in table as it stood at that moment. That snapshot is what "the
   default it was saved against" means. Sheets saved before this existed have
   no snapshot, so LEGACY_BASELINE below stands in for them.

   WHICH BUILD LEGACY_BASELINE COPIES, AND WHY IT IS THIS ONE. It is the
   built-in table as of site v51 — the same values the page ships with today.
   That is not laziness, it is what the one live sheet was actually made from:
   UserSubmit pressed "Load the built-in prices" and saved at 07:05 UTC on
   2026-09-12, so every field in it came from the built-ins. Checked field by
   field against the live row before choosing: zero differences.

   Using an older build here would have been worse than useless. Every field
   would then look like a deliberate edit, get pinned forever, and no future
   correction would ever reach the site again — the exact complaint this file
   exists to answer.

   The legacy fallback matters exactly once per sheet. The next save writes a
   real snapshot and LEGACY_BASELINE is never consulted for it again. */
(function (root) {
  'use strict';

  var LEGACY_BASELINE = {
    discount: 0,
    discountNote: '',
    services: {
      weekly:   { rates: { bedroom: 18, bathroom: 24, kitchen: 27, dining: 12, living: 15, other: 10 },
                  minutes: { bedroom: 35, bathroom: 46, kitchen: 58, dining: 23, living: 35, other: 23 } },
      biweekly: { rates: { bedroom: 20, bathroom: 26, kitchen: 29, dining: 13, living: 16, other: 11 },
                  minutes: { bedroom: 40, bathroom: 49, kitchen: 62, dining: 24, living: 36, other: 24 } },
      monthly:  { rates: { bedroom: 22, bathroom: 29, kitchen: 33, dining: 14, living: 18, other: 12 },
                  minutes: { bedroom: 44, bathroom: 56, kitchen: 67, dining: 27, living: 40, other: 27 } },
      deep:     { rates: { bedroom: 32, bathroom: 45, kitchen: 50, dining: 20, living: 25, other: 16 },
                  minutes: { bedroom: 67, bathroom: 86, kitchen: 95, dining: 38, living: 57, other: 38 } },
      movein:   { rates: { bedroom: 32, bathroom: 45, kitchen: 48, dining: 20, living: 24, other: 15 },
                  minutes: { bedroom: 65, bathroom: 86, kitchen: 97, dining: 39, living: 54, other: 39 } },
      moveout:  { rates: { bedroom: 34, bathroom: 48, kitchen: 52, dining: 21, living: 27, other: 17 },
                  minutes: { bedroom: 70, bathroom: 91, kitchen: 104, dining: 41, living: 59, other: 41 } },
      construction: { perSqFt: 0.3, minutesPerSqFt: 0.07 },
      spring:   { rates: { bedroom: 37, bathroom: 52, kitchen: 58, dining: 23, living: 29, other: 18 },
                  minutes: { bedroom: 78, bathroom: 99, kitchen: 110, dining: 44, living: 66, other: 44 } }
    }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* Take the saved value only where it differs from the baseline. An unknown
     baseline means we cannot tell whether she chose it, so we keep hers —
     never overwrite a real value on a guess. */
  function pickField(out, saved, base, field) {
    if (!(field in saved)) return;
    if (base && (field in base) && saved[field] === base[field]) return;
    out[field] = saved[field];
  }

  function pickGroup(out, saved, base, group) {
    if (!saved[group]) return;
    out[group] = out[group] || {};
    var b = (base && base[group]) || null;
    Object.keys(saved[group]).forEach(function (room) {
      var sv = saved[group][room];
      if (b && (room in b) && sv === b[room]) return;   // untouched, keep the default
      out[group][room] = sv;
    });
  }

  /* defaults: the built-in table shipped in the page, unmodified.
     saved:    the row from Supabase, or null.
     returns:  a new merged table. Neither argument is mutated. */
  function mergeSaved(defaults, saved) {
    var out = clone(defaults);
    if (!saved || typeof saved !== 'object' || !saved.services) return out;

    var base = (saved.basedOn && saved.basedOn.services) ? saved.basedOn : LEGACY_BASELINE;

    pickField(out, saved, base, 'discount');
    pickField(out, saved, base, 'discountNote');

    Object.keys(saved.services).forEach(function (k) {
      var o = out.services[k], sv = saved.services[k];
      if (!o || !sv) return;
      var bs = (base.services && base.services[k]) || {};
      ['perSqFt', 'minutesPerSqFt', 'discount', 'discountNote', 'description']
        .forEach(function (f) { pickField(o, sv, bs, f); });
      pickGroup(o, sv, bs, 'rates');
      pickGroup(o, sv, bs, 'minutes');
    });
    return out;
  }

  /* What to store alongside a save, so the next merge can tell an edit from an
     untouched default. Strip anything not compared, to keep the row small. */
  function snapshot(defaults) {
    var out = { discount: defaults.discount || 0, discountNote: defaults.discountNote || '', services: {} };
    Object.keys(defaults.services).forEach(function (k) {
      var s = defaults.services[k], o = {};
      ['perSqFt', 'minutesPerSqFt', 'discount', 'discountNote', 'description']
        .forEach(function (f) { if (f in s) o[f] = s[f]; });
      if (s.rates) o.rates = clone(s.rates);
      if (s.minutes) o.minutes = clone(s.minutes);
      out.services[k] = o;
    });
    return out;
  }

  root.HCCPricing = { merge: mergeSaved, snapshot: snapshot, LEGACY_BASELINE: LEGACY_BASELINE };
})(window);
