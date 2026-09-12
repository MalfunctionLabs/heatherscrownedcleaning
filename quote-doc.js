/* HCC quote document — v1, 2026-09-11, WEBHCC.0
   ONE definition of the printable quote, shared by index.html (customer's
   "Print this quote") and admin.html (Heather printing a saved quote).

   It lives in its own file for one reason: it used to be a string inside
   index.html, and adding the admin Quotes tab would have meant a second copy.
   Two copies of the same fact drift — this project already lost time today to
   a document that was true when written and stale after the next deploy.
   One copy cannot disagree with itself.

   Template authored by Ledger.0 (HCC_PRINTABLE_QUOTE_TEMPLATE.html), carried
   over byte-for-byte. The watermark block inside it is verbatim from the
   site footer; if the footer's TEXT changes, change it here too. */
(function (root) {
  'use strict';

  var TPL = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<title>Quote \u2014 Heather's Crowned Cleaning<\/title>\n<style>\n  :root {\n    --charcoal: #131110;\n    --ivory: #F8F5EF;\n    --blush: #8B6F68;\n    --taupe: #9C8B76;\n    --muted: #9A958D;\n  }\n  * { box-sizing: border-box; }\n  body {\n    margin: 0;\n    background: var(--charcoal);\n    color: var(--ivory);\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif;\n    -webkit-font-smoothing: antialiased;\n  }\n  .sheet {\n    max-width: 680px;\n    margin: 0 auto;\n    padding: 48px 40px 32px;\n  }\n  .brand {\n    text-align: center;\n    margin-bottom: 28px;\n  }\n  .brand img {\n    width: 84px;\n    height: 84px;\n    display: block;\n    margin: 0 auto 10px;\n  }\n  .brand .name {\n    font-weight: 800;\n    font-size: 20px;\n    letter-spacing: .02em;\n  }\n  .brand .tag {\n    font-size: 11px;\n    letter-spacing: .08em;\n    text-transform: uppercase;\n    color: var(--muted);\n    margin-top: 2px;\n  }\n  h1 {\n    text-align: center;\n    font-size: 22px;\n    margin: 0 0 4px;\n  }\n  .meta {\n    text-align: center;\n    font-size: 12px;\n    color: var(--muted);\n    margin-bottom: 28px;\n  }\n  .block {\n    border: 1px solid rgba(156,139,118,.35);\n    border-radius: 12px;\n    padding: 18px 20px;\n    margin-bottom: 18px;\n    background: rgba(248,245,239,.03);\n  }\n  .block h2 {\n    font-size: 12px;\n    text-transform: uppercase;\n    letter-spacing: .08em;\n    color: var(--taupe);\n    margin: 0 0 12px;\n  }\n  .cust-grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 8px 24px;\n    font-size: 14px;\n  }\n  .cust-grid .label {\n    color: var(--muted);\n    font-size: 11px;\n    text-transform: uppercase;\n    letter-spacing: .05em;\n  }\n  .notes {\n    margin-top: 12px;\n    font-size: 13px;\n    color: var(--ivory);\n    white-space: pre-wrap;\n  }\n  table.quote-table {\n    width: 100%;\n    border-collapse: collapse;\n    font-size: 14px;\n  }\n  table.quote-table td {\n    padding: 7px 0;\n    vertical-align: top;\n  }\n  table.quote-table td:last-child {\n    text-align: right;\n    white-space: nowrap;\n  }\n  table.quote-table tr.svc td {\n    font-weight: 700;\n    color: var(--ivory);\n    padding-bottom: 10px;\n  }\n  table.quote-table tr.total td {\n    border-top: 1px solid rgba(156,139,118,.35);\n    padding-top: 14px;\n    font-size: 20px;\n    font-weight: 800;\n  }\n  table.quote-table tr.time td {\n    color: var(--muted);\n    font-size: 12px;\n    padding-top: 4px;\n  }\n  .promo {\n    display: inline-block;\n    margin-top: 10px;\n    padding: 3px 8px;\n    font-size: 11px;\n    font-weight: 700;\n    letter-spacing: .06em;\n    text-transform: uppercase;\n    color: var(--charcoal);\n    background: var(--taupe);\n    border-radius: 4px;\n  }\n  .fine {\n    margin: 14px 0 0;\n    font-size: 11px;\n    line-height: 1.5;\n    color: var(--muted);\n  }\n  .print-btn-wrap {\n    text-align: center;\n    margin: 28px 0 8px;\n  }\n  .print-btn {\n    background: var(--taupe);\n    color: var(--charcoal);\n    border: none;\n    border-radius: 8px;\n    padding: 12px 28px;\n    font-size: 14px;\n    font-weight: 700;\n    cursor: pointer;\n  }\n  .print-btn:hover { opacity: .9; }\n  .watermark {\n    margin-top: 32px;\n    padding-top: 16px;\n    border-top: 1px solid rgba(156,139,118,.25);\n    text-align: center;\n    font-size: 11px;\n    line-height: 1.7;\n    color: var(--muted);\n  }\n  .watermark .line1 { display: flex; justify-content: space-between; }\n  .watermark .line2 { margin-top: 4px; }\n\n  @media print {\n    body { background: #fff; color: #1a1816; }\n    .sheet { max-width: 100%; padding: 0 8px; }\n    .print-btn-wrap { display: none; }\n    .block { border-color: #ccc; background: transparent; }\n    table.quote-table tr.svc td,\n    .brand .name, h1 { color: #1a1816; }\n    .watermark { color: #666; border-top-color: #ccc; }\n    .promo { color: #1a1816; background: #e4dccd; }\n  }\n<\/style>\n<\/head>\n<body>\n  <div class=\"sheet\">\n    <div class=\"brand\">\n      <img src=\"{{LOGO_SRC}}\" alt=\"Heather's Crowned Cleaning\" />\n      <div class=\"name\">Heather's Crowned Cleaning<\/div>\n      <div class=\"tag\">Clean Spaces \u00b7 Brighter Days<\/div>\n    <\/div>\n\n    <h1>Quote Request<\/h1>\n    <div class=\"meta\">{{QUOTE_DATE}}<!-- if {{QUOTE_REF}} is non-empty, WEB.0 may append \" \u00b7 Ref {{QUOTE_REF}}\" here --><\/div>\n\n    <div class=\"block\">\n      <h2>Customer<\/h2>\n      <div class=\"cust-grid\">\n        <div><div class=\"label\">Name<\/div>{{CUSTOMER_NAME}}<\/div>\n        <div><div class=\"label\">City / area<\/div>{{CUSTOMER_AREA}}<\/div>\n        <div><div class=\"label\">Phone<\/div>{{CUSTOMER_PHONE}}<\/div>\n        <div><div class=\"label\">Email<\/div>{{CUSTOMER_EMAIL}}<\/div>\n      <\/div>\n      <!-- omit the whole notes line if CUSTOMER_NOTES is empty -->\n      <div class=\"notes\">{{CUSTOMER_NOTES}}<\/div>\n    <\/div>\n\n    <div class=\"block\">\n      <h2>Service<\/h2>\n      <table class=\"quote-table\">\n        <tr class=\"svc\"><td colspan=\"2\">{{SERVICE_NAME}}<\/td><\/tr>\n        <!-- {{LINE_ITEMS_HTML}} \u2014 one <tr><td>label<\/td><td>amount<\/td><\/tr> per room/sq-ft line, same as quoteRender() already emits -->\n        {{LINE_ITEMS_HTML}}\n        <tr class=\"total\"><td>Total<\/td><td>{{TOTAL}}<\/td><\/tr>\n        <!-- omit this row entirely if TIME_ESTIMATE is empty, same rule as the site's own quoteRender() -->\n        <tr class=\"time\"><td>Estimated time on site<\/td><td>{{TIME_ESTIMATE}}<\/td><\/tr>\n      <\/table>\n      <!-- omit if SERVICE_BADGE is empty -->\n      <span class=\"promo\">{{SERVICE_BADGE}}<\/span>\n      <p class=\"fine\">Per visit, before tax. This is an instant estimate from the counts entered on the site; Heather confirms the final price after seeing the home. Times shown are an estimate for one cleaner in a home of that size. Actual time varies with the condition of the home, clutter and access, and Heather confirms it after seeing the home.<\/p>\n    <\/div>\n\n    <div class=\"print-btn-wrap\">\n      <button class=\"print-btn\" onclick=\"window.print()\">Print this quote<\/button>\n    <\/div>\n\n    <!-- WATERMARK \u2014 verbatim from the live site's own footer, pulled 2026-09-11. Do not paraphrase; if the site's footer changes, update this block to match. -->\n    <div class=\"watermark\">\n      <div class=\"line1\">\n        <span>\u00a9 2026 Heather's Crowned Cleaning, LLC<\/span>\n        <span>Site by Malfunction Labs\u2122 \u00b7 TRUST THE MALFUNCTION<\/span>\n      <\/div>\n      <div class=\"line2\">Heather's Crowned Cleaning, LLC. Licensed &amp; Insured since 2026<\/div>\n    <\/div>\n  <\/div>\n<\/body>\n<\/html>\n";

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* data: { ref, dateText, name, phone, email, area, notes, serviceName,
             badge, lineItems: [{label, amount}], totalText, timeEstimate,
             logoSrc }
     amount may be a number or an already-formatted string; lineItems are
     rendered exactly as given, so the saved copy prints what the customer
     was shown rather than a fresh calculation against today's prices. */
  function renderQuote(data) {
    data = data || {};
    var html = TPL;
    var notes = data.notes || '';
    var badge = data.badge || '';
    var time = data.timeEstimate || '';

    /* Same omissions the site has always made: an empty field prints as a
       blank box otherwise, which looks like a mistake on paper. */
    if (!notes) html = html.replace(/\s*<div class="notes">\{\{CUSTOMER_NOTES\}\}<\/div>/, '');
    if (!time) html = html.replace(/\s*<tr class="time">[\s\S]*?<\/tr>/, '');
    if (!badge) html = html.replace(/\s*<span class="promo">\{\{SERVICE_BADGE\}\}<\/span>/, '');

    var lines = (data.lineItems || []).map(function (l) {
      var amt = typeof l.amount === 'number' ? formatMoney(l.amount) : l.amount;
      return '<tr><td>' + esc(l.label) + '</td><td>' + esc(amt) + '</td></tr>';
    }).join('\n');

    var map = {
      '{{QUOTE_DATE}}': esc(data.dateText || '') + (data.ref ? ' · Ref ' + esc(data.ref) : ''),
      '{{QUOTE_REF}}': esc(data.ref || ''),
      '{{CUSTOMER_NAME}}': esc(data.name) || '—',
      '{{CUSTOMER_PHONE}}': esc(data.phone) || '—',
      '{{CUSTOMER_EMAIL}}': esc(data.email) || '—',
      '{{CUSTOMER_AREA}}': esc(data.area) || '—',
      '{{CUSTOMER_NOTES}}': esc(notes),
      '{{SERVICE_NAME}}': esc(data.serviceName || ''),
      '{{SERVICE_BADGE}}': esc(badge),
      '{{SERVICE_DESC}}': esc(data.serviceDesc || ''),
      '{{LINE_ITEMS_HTML}}': lines,
      '{{TOTAL}}': esc(data.totalText || ''),
      '{{TIME_ESTIMATE}}': esc(time),
      '{{LOGO_SRC}}': data.logoSrc || ''
    };
    Object.keys(map).forEach(function (k) { html = html.split(k).join(map[k]); });
    return html;
  }

  function formatMoney(n) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  }

  /* Opens the rendered sheet in its own tab. Returns false when the browser
     blocked the popup, so the caller can say so instead of looking broken. */
  function openQuote(data) {
    var w = window.open('', '_blank');
    if (!w) return false;
    w.document.write(renderQuote(data));
    w.document.close();
    return true;
  }

  root.HCCQuoteDoc = { TPL: TPL, render: renderQuote, open: openQuote, esc: esc, money: formatMoney };
})(window);
