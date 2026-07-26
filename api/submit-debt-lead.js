// Vercel serverless function — debt-consolidation funnel lead handler.
// Runs the debt model (for context), AI-qualifies the lead, fires a
// CALLBACK-FIRST alert to the underwriter, logs to Google Sheet, and (when
// SMTP is configured) sends the lead a confirmation email. No filesystem
// writes, no PDF. SMS is intentionally deferred (add later). Posts here from
// /calculator/debt and /debt-consolidation — a separate endpoint from the
// residential /api/submit-lead so the two funnels never collide.
import nodemailer from 'nodemailer';
import { runDebtConsolidation } from '../lib/debt-model.js';

const BRAND = process.env.EMAIL_FROM_NAME || 'Purple Dot Financial';

const money = (n) => {
  const num = Number(String(n).replace(/[^\d.]/g, ''));
  if (!num) return String(n || '—');
  return '$' + Math.round(num).toLocaleString('en-CA');
};
const pct = (n) => (n || n === 0 ? Number(n).toFixed(2).replace(/\.00$/, '') + '%' : '—');
const row = (label, val) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap;">${label}</td><td style="padding:6px 0;font-weight:600;">${val}</td></tr>`;

function mailer() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) !== 587,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function enrichLead(lead) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = `You are a senior Canadian mortgage underwriting analyst triaging an inbound DEBT-CONSOLIDATION lead. The homeowner wants to roll high-interest consumer debt into home-equity borrowing. Return ONLY a valid JSON object — no markdown fences, no prose.

Lead:
- Name: ${lead.firstName} ${lead.lastName}
- Province: ${lead.province}
- Phone: ${lead.phone}
- High-interest debt: ${money(lead.totalDebt)} at ~${pct(lead.debtRate)}
- Currently paying on it: ${money(lead.debtPayment)}/mo
- Home value: ${money(lead.homeValue)} · Mortgage balance: ${money(lead.mortgageBalance)}
- Estimated equity room at 80% LTV: ${money(lead.equityRoom)}
- Modeled new payment: ${money(lead.newPayment)}/mo · monthly cash freed: ${money(lead.monthlyFreed)}
- Fits within equity: ${lead.fitsInEquity === null ? 'unknown' : lead.fitsInEquity ? 'yes' : 'no (may exceed 80% LTV)'}
- Source: ${lead.source}

Return exactly this JSON shape:
{"leadScore": <1-10>, "priority": "<hot|warm|medium|cold>", "estDealSize": "<short>", "suitability": "<one line>", "qualificationNotes": "<1-2 sentences>", "callTalkingPoints": ["<p1>","<p2>","<p3>"]}`;
  const msg = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
    max_tokens: 1024, messages: [{ role: 'user', content: prompt }],
  });
  const raw = msg.content[0].text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '');
  return JSON.parse(raw);
}

async function appendToGoogleSheet(lead) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_DEBT || process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
  } catch (err) { console.error('Sheet failed:', err.message); }
}

async function notifyUnderwriter(m, lead) {
  if (!m || !process.env.UNDERWRITER_EMAIL) return;
  const e = lead.enrichment || {};
  const dot = { hot: '🔴', warm: '🟠', medium: '🟡', cold: '🟢' }[(e.priority || '').toLowerCase()] || '⚪';
  const points = (e.callTalkingPoints || []).map((p) => `<li style="margin-bottom:4px;">${p}</li>`).join('');
  await m.sendMail({
    from: `"${BRAND} Leads" <${process.env.SMTP_USER}>`,
    to: process.env.UNDERWRITER_EMAIL, replyTo: lead.email,
    subject: `${dot} CALL NOW — ${lead.firstName} ${lead.lastName} · ${lead.phone} · ${money(lead.totalDebt)} debt (${lead.province})`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
      <div style="background:#4c1d95;padding:20px 28px;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;font-size:18px;margin:0;">📞 New Debt-Consolidation Lead — CALL THEM</h1>
        <p style="color:#d8b4fe;font-size:13px;margin:4px 0 0;">${BRAND} · Meta Ads funnel</p>
      </div>
      <div style="background:#ecfdf5;padding:18px 28px;border:1px solid #a7f3d0;border-top:none;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#065f46;letter-spacing:.1em;">CALL NOW</p>
        <a href="tel:${lead.phone}" style="font-size:26px;font-weight:800;color:#047857;text-decoration:none;">${lead.phone}</a>
        <p style="margin:6px 0 0;font-size:13px;color:#047857;">${lead.firstName} ${lead.lastName} · ${lead.province} · <a href="mailto:${lead.email}" style="color:#047857;">${lead.email}</a></p>
      </div>
      <div style="background:#faf5ff;padding:24px 28px;border:1px solid #e9d5ff;border-top:none;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row('High-interest debt', `${money(lead.totalDebt)} @ ~${pct(lead.debtRate)}`)}
          ${row('Paying now', `${money(lead.debtPayment)}/mo`)}
          ${row('Modeled new payment', `<strong>${money(lead.newPayment)}/mo</strong>`)}
          ${row('Monthly cash freed', `<strong style="color:#047857;">${money(lead.monthlyFreed)}/mo</strong>`)}
          ${row('1st-yr interest saved', money(lead.firstYearInterestSaved))}
          ${row('Home value', money(lead.homeValue))}${row('Mortgage balance', money(lead.mortgageBalance))}
          ${row('Equity room (80% LTV)', `${money(lead.equityRoom)}${lead.fitsInEquity === false ? ' ⚠ debt may exceed room' : ''}`)}
          ${row('CASL consent', lead.caslConsent ? 'Yes' : 'No')}${row('Source', lead.source)}
        </table>
        ${e.leadScore ? `<div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e9d5ff;border-radius:8px;">
          <p style="margin:0 0 8px;font-weight:bold;color:#4c1d95;">AI Qualification ${dot} ${(e.priority || '').toUpperCase()} · Score ${e.leadScore}/10</p>
          <p style="margin:0 0 6px;"><strong>Deal size:</strong> ${e.estDealSize || '—'}</p>
          <p style="margin:0 0 6px;"><strong>Suitability:</strong> ${e.suitability || '—'}</p>
          <p style="margin:0 0 8px;"><strong>Notes:</strong> ${e.qualificationNotes || '—'}</p>
          ${points ? `<p style="margin:0 0 4px;font-weight:bold;color:#4c1d95;">Talking points:</p><ul style="margin:0;padding-left:18px;color:#4b5563;">${points}</ul>` : ''}
        </div>` : ''}
      </div></div>`,
  });
}

async function sendLeadEmail(m, lead) {
  if (!m) return;
  await m.sendMail({
    from: `"${BRAND}" <${process.env.SMTP_USER}>`,
    to: lead.email,
    subject: `${lead.firstName}, we've got your numbers — an advisor will call you shortly 📞`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#374151;">
      <div style="background:#4c1d95;padding:24px 32px;border-radius:8px 8px 0 0;"><h1 style="color:#fff;font-size:20px;margin:0;">${BRAND}</h1><p style="color:#d8b4fe;font-size:13px;margin:4px 0 0;">Debt consolidation for Canadian homeowners</p></div>
      <div style="background:#f9fafb;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <h2 style="font-size:18px;color:#111827;margin:0 0 16px;">Thanks, ${lead.firstName} — you're all set.</h2>
        <p style="margin:0 0 12px;">We received your debt-consolidation estimate. Here's the headline from your numbers:</p>
        <div style="display:flex;gap:12px;margin:0 0 20px;">
          <div style="flex:1;background:#fff;border:1px solid #a7f3d0;border-radius:8px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#047857;">${money(lead.monthlyFreed)}</div><div style="font-size:11px;color:#6b7280;">Est. cash freed / month</div></div>
          <div style="flex:1;background:#fff;border:1px solid #e9d5ff;border-radius:8px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#7B2D8B;">${money(lead.newPayment)}</div><div style="font-size:11px;color:#6b7280;">Est. new monthly payment</div></div>
        </div>
        <p style="margin:0 0 12px;"><strong>What happens next:</strong> a licensed mortgage professional will call you personally — usually within one business day — to confirm your exact qualified rate and payment. No cost, no obligation.</p>
        <p style="margin:0 0 24px;">Prefer to pick a time? <a href="https://calendly.com/purpledotfinancial/" style="color:#7B2D8B;font-weight:bold;">Book a free call here</a>, or just reply to this email.</p>
        <p style="margin:0;font-size:14px;color:#6b7280;">— The ${BRAND} Team · 647-524-8645</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">Figures are illustrative estimates only, not financial advice or an offer of credit, and not a guarantee of results. Debt consolidation using home equity secures the debt against your home and, over a longer amortization, can increase total interest paid. Your actual rate, payment, and approval depend on your credit, income, property, and lender criteria. ${BRAND} operates as a mortgage agent team under Choice Financial Corp. (Independently Owned &amp; Operated) — Mortgage Agent Licence #M19002147.</p>
      </div></div>`,
  });
}

async function notifyTelegram(lead) {
  const tk = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!tk || !chatId) return;
  const e = lead.enrichment || {};
  const dot = { hot: '🔴', warm: '🟠', medium: '🟡', cold: '🟢' }[(e.priority || '').toLowerCase()] || '⚪';
  const text = [`📞 *CALL NOW — Debt Lead*`, ``, `👤 *${lead.firstName} ${lead.lastName}* (${lead.province})`, `📱 ${lead.phone}`, `📧 ${lead.email}`, ``,
    `💳 ${money(lead.totalDebt)} @ ~${pct(lead.debtRate)}`, `💸 frees ~${money(lead.monthlyFreed)}/mo · new pay ${money(lead.newPayment)}`, ``,
    `${dot} *${(e.priority || 'unknown').toUpperCase()}* · Score ${e.leadScore ?? '—'}/10`].join('\n');
  try {
    await fetch(`https://api.telegram.org/bot${tk}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }) });
  } catch (err) { console.error('Telegram failed:', err.message); }
}

export default async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ success: false, error: 'Method not allowed' }); return; }
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  const required = ['firstName', 'lastName', 'phone', 'email', 'province'];
  const missing = required.filter((f) => !b[f] || String(b[f]).trim() === '');
  if (missing.length) { res.status(400).json({ success: false, error: `Missing: ${missing.join(', ')}` }); return; }

  const num = (v) => String(v || '').replace(/[^\d.]/g, '');
  const lead = {
    id: `debt_${Date.now()}`,
    firstName: String(b.firstName).trim(), lastName: String(b.lastName).trim(),
    phone: String(b.phone).trim(), email: String(b.email).trim(), province: String(b.province).trim(),
    homeowner: b.homeowner || 'Yes',
    totalDebt: num(b.totalDebt), debtRate: num(b.debtRate), debtPayment: num(b.debtPayment),
    homeValue: num(b.homeValue), mortgageBalance: num(b.mortgageBalance),
    newPayment: '', monthlyFreed: '', firstYearInterestSaved: '', equityRoom: '', fitsInEquity: null,
    caslConsent: !!b.caslConsent, source: b.source || 'Debt Calculator (Meta)',
    submittedAt: new Date().toISOString(), pageUrl: b.pageUrl || '', enrichment: null,
  };

  try {
    const model = runDebtConsolidation({
      totalDebt: lead.totalDebt, debtRate: lead.debtRate, debtPayment: lead.debtPayment,
      homeValue: lead.homeValue, mortgageBalance: lead.mortgageBalance,
    });
    lead.newPayment = Math.round(model.newDebtPayment);
    lead.monthlyFreed = Math.round(model.monthlyFreed);
    lead.firstYearInterestSaved = Math.round(model.firstYearInterestSaved);
    lead.equityRoom = Math.round(model.equityAvailableAt80);
    lead.fitsInEquity = model.fitsInEquity;
  } catch (err) { console.error('Model failed:', err.message); }

  try { lead.enrichment = await enrichLead(lead); }
  catch (err) { console.error('Enrichment failed:', err.message); lead.enrichment = null; }

  const m = mailer();
  await Promise.all([
    appendToGoogleSheet(lead),
    notifyUnderwriter(m, lead).catch((e) => console.error('Underwriter email:', e.message)),
    sendLeadEmail(m, lead).catch((e) => console.error('Lead email:', e.message)),
    notifyTelegram(lead),
  ]).catch(() => {});

  res.status(200).json({ success: true, preview: { monthlyFreed: money(lead.monthlyFreed), newPayment: money(lead.newPayment) } });
};
