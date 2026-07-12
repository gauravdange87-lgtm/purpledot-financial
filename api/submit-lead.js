// Vercel serverless function — residential refi funnel lead handler.
// Runs the Smith Manoeuvre model, builds a PDF report, emails it to the lead,
// notifies the underwriter, and logs to Google Sheet. No filesystem writes
// (serverless fs is read-only) — the Sheet + emails are the record.
import nodemailer from 'nodemailer';
import { runSmithManoeuvre } from '../lib/sm-model.js';
import { buildReportPDF } from '../lib/pdf-report.js';

const BRAND = process.env.EMAIL_FROM_NAME || 'Purple Dot Financial';

const GOAL_LABELS = {
  faster: 'Pay off mortgage faster', taxsavings: 'Make mortgage interest tax-deductible',
  invest: 'Invest while paying down the mortgage', cashdam: 'Cash damming (business / rental)',
  notsure: 'Not sure — wants to learn options',
};
const TIMEFRAME_LABELS = { asap: 'As soon as possible', '1-3': '1–3 months', '3-6': '3–6 months', exploring: 'Just exploring' };

const money = (n) => {
  const num = Number(String(n).replace(/[^\d.]/g, ''));
  if (!num) return String(n || '—');
  return '$' + Math.round(num).toLocaleString('en-CA');
};
const yrsShort = (y) => {
  const w = Math.floor(y), mo = Math.round((y - w) * 12);
  if (mo === 0) return `${w} yr${w === 1 ? '' : 's'}`;
  if (mo === 12) return `${w + 1} yrs`;
  return `${w} yr${w === 1 ? '' : 's'} ${mo} mo`;
};
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
  const prompt = `You are a senior Canadian mortgage underwriting analyst. Analyze this inbound refinance lead for a funnel that promotes the Smith Manoeuvre, cash damming, and all-in-one readvanceable mortgages. Return ONLY a valid JSON object — no markdown fences, no prose.

Lead:
- Name: ${lead.firstName} ${lead.lastName}
- Province: ${lead.province}
- Homeowner: ${lead.homeowner}
- Property value: ${money(lead.propertyValue)}
- Mortgage balance: ${money(lead.mortgageBalance)}
- Estimated equity: ${money(lead.estEquity)}
- Income: ${money(lead.income)}
- Primary goal: ${GOAL_LABELS[lead.goal] || lead.goal}
- Source: ${lead.source}

Return exactly this JSON shape:
{"leadScore": <1-10>, "priority": "<hot|warm|medium|cold>", "estDealSize": "<short>", "suitability": "<one line>", "qualificationNotes": "<1-2 sentences>", "underwriterTalkingPoints": ["<p1>","<p2>","<p3>"]}`;
  const msg = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
    max_tokens: 1024, messages: [{ role: 'user', content: prompt }],
  });
  const raw = msg.content[0].text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '');
  return JSON.parse(raw);
}

async function appendToGoogleSheet(lead) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
  } catch (err) { console.error('Sheet failed:', err.message); }
}

async function notifyUnderwriter(m, lead) {
  if (!m || !process.env.UNDERWRITER_EMAIL) return;
  const e = lead.enrichment || {};
  const dot = { hot: '🔴', warm: '🟠', medium: '🟡', cold: '🟢' }[(e.priority || '').toLowerCase()] || '⚪';
  await m.sendMail({
    from: `"${BRAND} Leads" <${process.env.SMTP_USER}>`,
    to: process.env.UNDERWRITER_EMAIL, replyTo: lead.email,
    subject: `${dot} New Refi Lead — ${lead.firstName} ${lead.lastName} (${lead.province}) · ${money(lead.mortgageBalance)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
      <div style="background:#4c1d95;padding:20px 28px;border-radius:8px 8px 0 0;"><h1 style="color:#fff;font-size:18px;margin:0;">New Residential Refi Lead</h1><p style="color:#d8b4fe;font-size:13px;margin:4px 0 0;">${BRAND} · Meta Ads funnel</p></div>
      <div style="background:#faf5ff;padding:28px;border:1px solid #e9d5ff;border-top:none;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row('Name', `${lead.firstName} ${lead.lastName}`)}${row('Phone', `<a href="tel:${lead.phone}">${lead.phone}</a>`)}${row('Email', `<a href="mailto:${lead.email}">${lead.email}</a>`)}
          ${row('Province', lead.province)}${row('Home value', money(lead.propertyValue))}${row('Mortgage balance', money(lead.mortgageBalance))}${row('Est. equity', money(lead.estEquity))}${row('Income', money(lead.income))}
          ${row('Primary goal', GOAL_LABELS[lead.goal] || lead.goal)}${row('CASL consent', lead.caslConsent ? 'Yes' : 'No')}
        </table>
        ${lead.report ? `<div style="margin-top:16px;padding:14px 16px;background:#f5f3ff;border:1px dashed #c4b5fd;border-radius:8px;font-size:13px;">
          <p style="margin:0 0 4px;font-weight:bold;color:#4c1d95;">📄 Personalized report generated &amp; emailed</p>
          <p style="margin:0 0 6px;color:#4b5563;">${money(lead.propertyValue)} home · ${money(lead.mortgageBalance)} @ ${lead.mortgageRate || '—'} · ${lead.yearsLeft || '—'}-yr · income ${money(lead.income)} (${lead.marginalTaxRate || '—'} marginal)</p>
          <p style="margin:0;color:#4b5563;">Modeled: pays off <strong>${lead.yearsFaster || '—'} sooner</strong>, est. <strong>${lead.estAnnualRefund || '—'}/yr</strong> refund, ${lead.netWealth || '—'} wealth built.</p></div>` : ''}
        ${e.leadScore ? `<div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e9d5ff;border-radius:8px;">
          <p style="margin:0 0 8px;font-weight:bold;color:#4c1d95;">AI Qualification ${dot} ${(e.priority || '').toUpperCase()} · Score ${e.leadScore}/10</p>
          <p style="margin:0 0 6px;"><strong>Deal size:</strong> ${e.estDealSize || '—'}</p><p style="margin:0 0 6px;"><strong>Suitability:</strong> ${e.suitability || '—'}</p><p style="margin:0;"><strong>Notes:</strong> ${e.qualificationNotes || '—'}</p></div>` : ''}
      </div></div>`,
  });
}

async function sendLeadEmail(m, lead, pdfBuffer) {
  if (!m) return;
  const r = lead.report || {};
  await m.sendMail({
    from: `"${BRAND}" <${process.env.SMTP_USER}>`,
    to: lead.email,
    subject: pdfBuffer ? `${lead.firstName}, your personalized Smith Manoeuvre report is attached 📄` : `We got your request, ${lead.firstName}`,
    attachments: pdfBuffer ? [{ filename: `PurpleDot-Smith-Manoeuvre-Report-${lead.lastName || 'Report'}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }] : [],
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#374151;">
      <div style="background:#4c1d95;padding:24px 32px;border-radius:8px 8px 0 0;"><h1 style="color:#fff;font-size:20px;margin:0;">${BRAND}</h1><p style="color:#d8b4fe;font-size:13px;margin:4px 0 0;">Smart mortgage strategies for Canadian homeowners</p></div>
      <div style="background:#f9fafb;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <h2 style="font-size:18px;color:#111827;margin:0 0 16px;">Thanks, ${lead.firstName} — your report is ready.</h2>
        ${pdfBuffer ? `<p style="margin:0 0 16px;">Your personalized Smith Manoeuvre report is attached as a PDF. Here's the headline:</p>
        <div style="display:flex;gap:12px;margin:0 0 20px;">
          <div style="flex:1;background:#fff;border:1px solid #e9d5ff;border-radius:8px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#059669;">${r.yearsFaster || '—'}</div><div style="font-size:11px;color:#6b7280;">Mortgage-free sooner</div></div>
          <div style="flex:1;background:#fff;border:1px solid #e9d5ff;border-radius:8px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:800;color:#7B2D8B;">${r.annualRefund || '—'}</div><div style="font-size:11px;color:#6b7280;">Est. annual tax refund</div></div>
        </div>` : `<p style="margin:0 0 12px;">We received your request to explore paying off your mortgage faster.</p>`}
        <p style="margin:0 0 12px;"><strong>What happens next:</strong> a licensed mortgage professional will personally review your numbers and reach out (usually within one business day) — no cost, no obligation.</p>
        <p style="margin:0 0 24px;">Questions? Just reply to this email.</p>
        <p style="margin:0;font-size:14px;color:#6b7280;">— The ${BRAND} Team</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">This report is for educational purposes only and is not investment, tax, or legal advice, nor a guarantee of results. The Smith Manoeuvre involves borrowing to invest, which carries risk including possible loss of capital. Figures are illustrative estimates. Consult licensed professionals before proceeding.</p>
      </div></div>`,
  });
}

async function notifyTelegram(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const e = lead.enrichment || {};
  const dot = { hot: '🔴', warm: '🟠', medium: '🟡', cold: '🟢' }[(e.priority || '').toLowerCase()] || '⚪';
  const text = [`💜 *New Refi Lead*`, ``, `👤 *${lead.firstName} ${lead.lastName}* (${lead.province})`, `📞 ${lead.phone}`, `📧 ${lead.email}`, ``,
    `🏠 ${money(lead.propertyValue)} · 🏦 ${money(lead.mortgageBalance)}`, `🎯 ${GOAL_LABELS[lead.goal] || lead.goal}`, ``,
    `${dot} *${(e.priority || 'unknown').toUpperCase()}* · Score ${e.leadScore ?? '—'}/10`].join('\n');
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }) });
  } catch (err) { console.error('Telegram failed:', err.message); }
}

export default async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ success: false, error: 'Method not allowed' }); return; }
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  const required = ['firstName', 'lastName', 'phone', 'email', 'province', 'mortgageBalance'];
  const missing = required.filter((f) => !b[f] || String(b[f]).trim() === '');
  if (missing.length) { res.status(400).json({ success: false, error: `Missing: ${missing.join(', ')}` }); return; }

  const propertyValue   = String(b.propertyValue || b.homeValue || '').replace(/[^\d.]/g, '');
  const mortgageBalance = String(b.mortgageBalance || '').replace(/[^\d.]/g, '');
  const income          = String(b.income || '').replace(/[^\d.]/g, '');
  const mortgageRateNum = parseFloat(String(b.mortgageRate || '').replace(/[^\d.]/g, '')) || 0;
  const yearsLeftNum    = parseInt(b.yearsLeft, 10) || 0;
  const estEquity = propertyValue && mortgageBalance ? String(Math.max(0, Number(propertyValue) - Number(mortgageBalance))) : '';

  const lead = {
    id: `lead_${Date.now()}`,
    firstName: String(b.firstName).trim(), lastName: String(b.lastName).trim(),
    phone: String(b.phone).trim(), email: String(b.email).trim(), province: String(b.province).trim(),
    homeowner: b.homeowner || 'Yes', propertyValue, mortgageBalance, estEquity, income,
    mortgageRate: mortgageRateNum ? mortgageRateNum + '%' : '', yearsLeft: yearsLeftNum ? String(yearsLeftNum) : '',
    goal: b.goal || 'taxsavings', timeframe: b.timeframe || 'exploring', caslConsent: !!b.caslConsent,
    marginalTaxRate: '', estAnnualRefund: '', yearsFaster: '', netWealth: '', report: null,
    source: b.source || 'Residential Refi Page', submittedAt: new Date().toISOString(), pageUrl: b.pageUrl || '', enrichment: null,
  };

  let pdfBuffer = null;
  if (propertyValue && mortgageBalance && mortgageRateNum && yearsLeftNum) {
    try {
      const model = runSmithManoeuvre({ homeValue: propertyValue, mortgageBalance, mortgageRate: mortgageRateNum, yearsLeft: yearsLeftNum, province: lead.province, income });
      lead.marginalTaxRate = (model.marginalRate * 100).toFixed(1) + '%';
      lead.estAnnualRefund = money(model.annualRefundConverted);
      lead.yearsFaster = yrsShort(model.yearsFaster);
      lead.netWealth = money(model.netInvestmentWealth);
      lead.report = { yearsFaster: yrsShort(model.yearsFaster), annualRefund: money(model.annualRefundConverted), payoffYears: Math.round(model.payoffYearsWith) };
      pdfBuffer = await buildReportPDF(lead, model);
    } catch (err) { console.error('Model/PDF failed:', err.message); }
  }

  try { lead.enrichment = await enrichLead(lead); }
  catch (err) { console.error('Enrichment failed:', err.message); lead.enrichment = null; }

  const m = mailer();
  await Promise.all([
    appendToGoogleSheet(lead),
    notifyUnderwriter(m, lead).catch((e) => console.error('Underwriter email:', e.message)),
    sendLeadEmail(m, lead, pdfBuffer).catch((e) => console.error('Lead email:', e.message)),
    notifyTelegram(lead),
  ]).catch(() => {});

  res.status(200).json({ success: true, preview: lead.report });
};
