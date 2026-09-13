/* HCC invoice document — v1, 2026-09-13, WEBHCC.0
   The printable invoice, opened from the Invoices tab in admin.html. Same
   palette and header as the printable quote, so the papers Heather hands a
   customer match. It opens through HCCQuoteDoc.openHtml (quote-doc.js), so
   it gets the same full-size-on-phones fix. Load quote-doc.js first.

   Printed wording, same rule as the quote: "Document by Malfunction Labs".

   Numbering is shown here and nowhere else decides it: the database hands
   out cust_no and inv_no; this file only formats them.

   Money is worked out in compute() and ONLY there. The admin editor and the
   printed invoice both call it, so the screen and the paper cannot disagree.
   Order: line amounts -> subtotal -> discount (capped at the subtotal) ->
   tax on what is left -> total. Every step rounds to the cent. */
(function (root) {
  'use strict';

  /* THE INVOICE'S OWN VERSION. Frozen on purpose, same rule as SHEET_TAG in
     admin.html: ML.WD.WEBHCC-v1,rev<site>.<admin>.<invoice>. The first two
     are the build this layout was last edited against, the last is the
     layout's own revision. It changes ONLY when this printed invoice is
     edited; whoever edits it sets it by hand to the current build and bumps
     the last number. NOT a find-and-replace target. */
  var INVOICE_TAG = 'ML.WD.WEBHCC-v1,rev60.32.1';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function pad4(n) { n = parseInt(n, 10); if (!(n > 0)) return ''; var s = String(n); return s.length >= 4 ? s : ('0000' + s).slice(-4); }
  function custNo(n) { var p = pad4(n); return p ? 'HCC-' + p : ''; }
  function invNo(n) { var p = pad4(n); return p ? 'INV.HCC.' + p : ''; }

  /* Quotes store discounts as text like "−$113.75" with a typographic minus
     (U+2212), which parseFloat reads as nothing; it is turned into "-" first. */
  function num(v) {
    var x = parseFloat(String(v == null ? '' : v).replace(/[\u2212\u2013]/g, '-').replace(/[$,\s]/g, ''));
    return isFinite(x) ? x : 0;
  }
  function round2(x) { return Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * 100) / 100; }

  function money(n) {
    n = round2(num(n));
    var s = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (n < 0 ? '−$' : '$') + s;
  }

  /* inv: { line_items:[{label,qty,rate}], discount_type, discount_value, tax_rate } */
  function compute(inv) {
    inv = inv || {};
    var lines = (Array.isArray(inv.line_items) ? inv.line_items : []).map(function (l) {
      var qty = num(l.qty), rate = num(l.rate);
      return { label: String(l.label || ''), qty: qty, rate: rate, amount: round2(qty * rate) };
    });
    var subtotal = round2(lines.reduce(function (a, l) { return a + l.amount; }, 0));
    var dv = Math.max(0, num(inv.discount_value)), discount = 0;
    if (inv.discount_type === 'percent') discount = round2(subtotal * Math.min(dv, 100) / 100);
    else if (inv.discount_type === 'amount') discount = round2(dv);
    discount = Math.max(0, Math.min(discount, subtotal));
    var taxable = round2(subtotal - discount);
    var taxRate = Math.max(0, num(inv.tax_rate));
    var tax = round2(taxable * taxRate / 100);
    return { lines: lines, subtotal: subtotal, discount: discount, taxable: taxable, taxRate: taxRate, tax: tax, total: round2(taxable + tax) };
  }

  /* 'YYYY-MM-DD' -> 'Sep 13, 2026', read as a calendar date, never shifted by
     time zone (new Date('2026-09-13') is midnight UTC, the day before in Utah). */
  function dateText(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ''));
    if (!m) return '';
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function qtyText(q) { return (Math.round(q * 100) / 100).toString(); }
  function pctText(p) { return (Math.round(p * 1000) / 1000).toString() + '%'; }

  var CSS = [
    ':root { --charcoal:#131110; --ivory:#F8F5EF; --blush:#8B6F68; --taupe:#9C8B76; --muted:#9A958D; --line:rgba(156,139,118,.35); }',
    '* { box-sizing: border-box; }',
    'body { margin:0; background:var(--charcoal); color:var(--ivory); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; -webkit-font-smoothing:antialiased; font-size:14px; }',
    '.sheet { position:relative; max-width:720px; margin:0 auto; padding:26px 30px 20px; }',
    '.head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:18px; }',
    '.brand { display:flex; align-items:center; gap:12px; }',
    '.brand img { width:58px; height:58px; display:block; }',
    '.brand .name { font-weight:800; font-size:18px; letter-spacing:.02em; }',
    '.brand .tag { font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin-top:2px; }',
    '.doc { text-align:right; }',
    '.doc h1 { margin:0; font-size:24px; letter-spacing:.04em; text-transform:uppercase; }',
    '.doc .no { font-size:14px; font-weight:700; margin-top:2px; }',
    '.st { display:inline-block; margin-top:6px; padding:2px 8px; font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; border-radius:4px; border:1px solid var(--taupe); color:var(--taupe); }',
    '.st-paid { background:var(--taupe); color:var(--charcoal); }',
    '.st-void { border-color:#c98b84; color:#c98b84; }',
    '.block { border:1px solid var(--line); border-radius:9px; padding:12px 14px; margin-bottom:11px; background:rgba(248,245,239,.03); }',
    '.block h2 { font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--taupe); margin:0 0 8px; }',
    '.two { display:grid; grid-template-columns:1fr 1fr; gap:14px 24px; }',
    '.who { font-weight:700; font-size:15px; }',
    '.addr { white-space:pre-wrap; margin-top:2px; }',
    '.contact { margin-top:4px; color:rgba(248,245,239,.85); overflow-wrap:anywhere; }',
    'dl.kv { display:grid; grid-template-columns:auto 1fr; gap:3px 14px; margin:0; font-size:13px; }',
    'dl.kv dt { color:var(--muted); font-size:11px; text-transform:uppercase; letter-spacing:.05em; padding-top:1px; }',
    'dl.kv dd { margin:0; text-align:right; overflow-wrap:anywhere; }',
    'table { width:100%; border-collapse:collapse; }',
    'table.lines th { font-size:10px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); font-weight:700; text-align:right; padding:0 0 6px; border-bottom:1px solid var(--line); }',
    'table.lines th:first-child, table.lines td:first-child { text-align:left; }',
    'table.lines td { padding:6px 0; vertical-align:top; text-align:right; white-space:nowrap; }',
    'table.lines td:first-child { white-space:normal; padding-right:10px; }',
    'table.lines td.q, table.lines th.q { width:52px; }',
    'table.lines td.r, table.lines th.r { width:92px; }',
    'table.lines td.a, table.lines th.a { width:98px; }',
    'table.sums { margin-top:8px; border-top:1px solid var(--line); }',
    'table.sums td { padding:5px 0; text-align:right; }',
    'table.sums td:first-child { color:var(--muted); padding-right:14px; }',
    'table.sums tr.disc td:last-child { color:var(--taupe); font-weight:700; }',
    'table.sums tr.total td { border-top:1px solid var(--line); padding-top:9px; font-size:19px; font-weight:800; color:var(--ivory); }',
    'table.sums tr.due td { font-weight:700; color:var(--ivory); }',
    '.notes { white-space:pre-wrap; font-size:13px; }',
    '.fine { margin:12px 0 0; font-size:11px; color:var(--muted); text-align:center; }',
    '.print-btn-wrap { margin:16px 0 4px; display:flex; gap:10px; justify-content:center; }',
    '.print-btn { background:var(--ivory); color:var(--charcoal); border:0; border-radius:8px; padding:12px 22px; font-size:14px; font-weight:700; cursor:pointer; }',
    '.close-btn { background:none; color:var(--muted); border:1px solid var(--muted); border-radius:8px; padding:12px 22px; font-size:14px; font-weight:700; cursor:pointer; }',
    '.close-btn:hover { color:var(--ivory); border-color:var(--ivory); }',
    '.watermark { margin-top:14px; padding-top:10px; border-top:1px solid var(--line); font-size:10px; color:var(--muted); text-align:center; }',
    '.watermark .line1 { display:flex; flex-wrap:wrap; justify-content:center; gap:2px 14px; }',
    '.watermark .line2 { margin-top:3px; }',
    '.watermark .ver { margin-top:3px; font-size:9px; letter-spacing:.04em; opacity:.8; }',
    '.stamp { position:absolute; right:26px; bottom:18px; width:40px; opacity:.12; pointer-events:none; }',
    /* phone screens only: never applies to paper */
    '@media screen and (max-width:560px) { .sheet { padding:18px 14px 16px; } .head { flex-direction:column; } .doc { text-align:left; } .two { grid-template-columns:1fr; } dl.kv dd { text-align:left; } table.lines td.r, table.lines th.r { width:74px; } table.lines td.q, table.lines th.q { width:34px; } }',
    '@media print {',
    '  @page { size: letter; margin: 13mm; }',
    '  body { background:#fff; color:#1a1816; font-size:13.5px; }',
    '  .sheet { max-width:none; padding:0 0 8px; }',
    '  .block { background:transparent; border-color:#ccc; }',
    '  .doc h1, .brand .name, .who, table.sums tr.total td, table.sums tr.due td { color:#1a1816; }',
    '  .contact { color:#1a1816; }',
    '  table.lines th, table.sums, table.sums tr.total td { border-color:#ccc; }',
    '  .st-paid { background:#e4dccd; color:#1a1816; border-color:#9C8B76; }',
    '  .print-btn-wrap { display:none; }',
    '  .watermark { color:#666; border-top-color:#ccc; }',
    '  .stamp { opacity:.11; }',
    '}'
  ].join('\n');

  /* data: an invoice row (see HCC_supabase_setup_v7.sql) plus
     { issuedText, logoSrc, stampSrc }. stampSrc stays absolute, as on the quote. */
  function render(data) {
    data = data || {};
    var c = compute(data);
    var status = data.status === 'paid' ? 'paid' : (data.status === 'void' ? 'void' : 'unpaid');
    var statusLabel = { unpaid: 'Unpaid', paid: 'Paid', void: 'Void' }[status];
    var no = invNo(data.inv_no) || 'Not saved yet';

    var kv = function (k, v) { return v ? '<dt>' + k + '</dt><dd>' + esc(v) + '</dd>' : ''; };
    var details =
      kv('Customer ID', data.customer_no) +
      kv('Issued', data.issuedText) +
      kv('Service date', dateText(data.service_date)) +
      kv('Due', status === 'unpaid' ? dateText(data.due_date) : '') +
      kv('Quote #', data.quote_ref) +
      kv('WO #', data.wo_number);

    var contact = [data.bill_phone, data.bill_email].filter(Boolean).map(esc).join('<br>');

    var rows = c.lines.map(function (l) {
      return '<tr><td>' + esc(l.label) + '</td><td class="q">' + esc(qtyText(l.qty)) + '</td><td class="r">' +
        esc(money(l.rate)) + '</td><td class="a">' + esc(money(l.amount)) + '</td></tr>';
    }).join('');
    if (!rows) rows = '<tr><td colspan="4" style="color:#9A958D">No services listed.</td></tr>';

    var discLabel = 'Discount' +
      (data.discount_type === 'percent' ? ' (' + pctText(Math.min(num(data.discount_value), 100)) + ')' : '') +
      (data.discount_note ? ' · ' + esc(data.discount_note) : '');

    var sums =
      '<tr><td>Subtotal</td><td>' + money(c.subtotal) + '</td></tr>' +
      (c.discount > 0 ? '<tr class="disc"><td>' + discLabel + '</td><td>−' + money(c.discount) + '</td></tr>' : '') +
      (c.taxRate > 0 ? '<tr><td>Tax (' + esc(pctText(c.taxRate)) + ')</td><td>' + money(c.tax) + '</td></tr>' : '') +
      '<tr class="total"><td>Total</td><td>' + money(c.total) + '</td></tr>';
    if (status === 'paid') {
      var paidBits = ['Paid'];
      if (data.paid_on) paidBits.push(dateText(data.paid_on));
      if (data.payment_method) paidBits.push(esc(data.payment_method));
      sums += '<tr class="due"><td>' + paidBits.join(' · ') + '</td><td>' + money(0) + ' due</td></tr>';
    } else if (status === 'unpaid') {
      sums += '<tr class="due"><td>Balance due' + (data.due_date ? ' by ' + esc(dateText(data.due_date)) : '') + '</td><td>' + money(c.total) + '</td></tr>';
    }

    var notesBlock = '';
    var noteText = [data.notes, status === 'paid' ? data.payment_note : ''].filter(Boolean).join('\n');
    if (noteText) notesBlock = '<div class="block"><h2>Notes</h2><div class="notes">' + esc(noteText) + '</div></div>';

    return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
      '<title>Invoice ' + esc(no) + ' — Heather\'s Crowned Cleaning</title>\n' +
      '<style>\n' + CSS + '\n</style>\n</head>\n<body>\n' +
      '<div class="sheet">\n' +
      '<img class="stamp" src="' + esc(data.stampSrc || '') + '" alt="" />\n' +
      '<div class="head">' +
        '<div class="brand">' + (data.logoSrc ? '<img src="' + esc(data.logoSrc) + '" alt="Heather\'s Crowned Cleaning" />' : '') +
          '<div><div class="name">Heather\'s Crowned Cleaning</div><div class="tag">Clean Spaces · Brighter Days</div></div></div>' +
        '<div class="doc"><h1>Invoice</h1><div class="no">' + esc(no) + '</div><div class="st st-' + status + '">' + statusLabel + '</div></div>' +
      '</div>\n' +
      '<div class="block two">' +
        '<div><h2>Bill to</h2><div class="who">' + (esc(data.bill_name) || '—') + '</div>' +
          (data.bill_address ? '<div class="addr">' + esc(data.bill_address) + '</div>' : '') +
          (contact ? '<div class="contact">' + contact + '</div>' : '') + '</div>' +
        '<div><h2>Details</h2><dl class="kv">' + details + '</dl></div>' +
      '</div>\n' +
      '<div class="block"><h2>Services</h2>' +
        '<table class="lines"><thead><tr><th>Description</th><th class="q">Qty</th><th class="r">Rate</th><th class="a">Amount</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<table class="sums">' + sums + '</table>' +
      '</div>\n' +
      notesBlock + '\n' +
      '<p class="fine">Thank you for choosing Heather\'s Crowned Cleaning.</p>\n' +
      '<div class="print-btn-wrap"><button class="print-btn" onclick="window.print()">Print this invoice</button>' +
        '<button class="close-btn" onclick="window.close()">Close this tab</button></div>\n' +
      '<div class="watermark"><div class="line1"><span>© 2026 Heather\'s Crowned Cleaning, LLC</span>' +
        '<span>Document by Malfunction Labs™ · TRUST THE MALFUNCTION</span></div>' +
        '<div class="line2">Heather\'s Crowned Cleaning, LLC. Licensed &amp; Insured since 2026</div>' +
        '<div class="ver">' + INVOICE_TAG + '</div></div>\n' +
      '</div>\n</body>\n</html>';
  }

  /* Returns false when the popup was blocked. */
  function open(data) {
    if (!root.HCCQuoteDoc || !root.HCCQuoteDoc.openHtml) return false;
    return root.HCCQuoteDoc.openHtml(render(data));
  }

  root.HCCInvoice = { TAG: INVOICE_TAG, render: render, open: open, compute: compute, money: money,
    custNo: custNo, invNo: invNo, dateText: dateText, esc: esc, num: num };
})(window);
