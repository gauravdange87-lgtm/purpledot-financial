/**
 * Generates a branded, personalized Smith Manoeuvre PDF report (Buffer).
 * Uses PDFKit vector drawing for charts — no headless browser dependency.
 */
import PDFDocument from 'pdfkit';

const PURPLE = '#5f1f6d', PURPLE2 = '#7B2D8B', VIOLET = '#9B4DCA', VIOLET_LT = '#ede9fe';
const INK = '#1e1b2e', GRAY = '#6b7280', LIGHT = '#e9d5ff', GREEN = '#059669';

const PROVINCES = { AB:'Alberta', BC:'British Columbia', MB:'Manitoba', NB:'New Brunswick',
  NL:'Newfoundland and Labrador', NS:'Nova Scotia', NT:'Northwest Territories', NU:'Nunavut',
  ON:'Ontario', PE:'Prince Edward Island', QC:'Quebec', SK:'Saskatchewan', YT:'Yukon' };

const money = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('en-CA');
const money0 = (n) => {
  const v = Math.round(Number(n) || 0);
  if (v >= 1000) return '$' + Math.round(v / 1000) + 'k';
  return '$' + v;
};
function yearsLabel(y) {
  const whole = Math.floor(y), mo = Math.round((y - whole) * 12);
  if (mo === 0) return `${whole} yr${whole === 1 ? '' : 's'}`;
  if (mo === 12) return `${whole + 1} yrs`;
  return `${whole} yr${whole === 1 ? '' : 's'} ${mo} mo`;
}

function drawLogo(doc, x, y, r, color) {
  doc.save();
  doc.circle(x, y, r * 0.22).fill(color);
  doc.lineWidth(r * 0.12);
  doc.circle(x, y, r * 0.5).stroke(color);
  doc.circle(x, y, r * 0.78).stroke(color);
  doc.circle(x, y, r).stroke(color);
  doc.restore();
}

// ── Line chart: mortgage balance over time (two series) ──────────────────────
function lineChart(doc, x, y, w, h, seriesA, seriesB, opts) {
  const maxY = Math.max(...seriesA, ...seriesB, 1);
  const n = Math.max(seriesA.length, seriesB.length) - 1;
  const px = (i) => x + (w * i) / n;
  const py = (v) => y + h - (h * v) / maxY;

  // grid + y labels
  doc.save().lineWidth(0.5).strokeColor('#eee');
  doc.font('Helvetica').fontSize(7).fillColor(GRAY);
  for (let g = 0; g <= 4; g++) {
    const gy = y + (h * g) / 4;
    doc.moveTo(x, gy).lineTo(x + w, gy).stroke();
    doc.fillColor(GRAY).text(money0(maxY * (1 - g / 4)), x - 34, gy - 4, { width: 30, align: 'right' });
  }
  doc.restore();

  // x labels (years)
  doc.font('Helvetica').fontSize(7).fillColor(GRAY);
  const step = n <= 12 ? 2 : Math.ceil(n / 8);
  for (let i = 0; i <= n; i += step) {
    doc.text(String(i), px(i) - 6, y + h + 4, { width: 12, align: 'center' });
  }
  doc.fillColor(GRAY).fontSize(7.5).text('Years from now', x, y + h + 16, { width: w, align: 'center' });

  // series A (without SM) — grey dashed
  doc.save().lineWidth(1.5).strokeColor('#9ca3af').dash(3, { space: 2 });
  seriesA.forEach((v, i) => (i === 0 ? doc.moveTo(px(i), py(v)) : doc.lineTo(px(i), py(v))));
  doc.stroke().undash().restore();

  // series B (with SM) — purple solid
  doc.save().lineWidth(2.4).strokeColor(VIOLET);
  seriesB.forEach((v, i) => (i === 0 ? doc.moveTo(px(i), py(v)) : doc.lineTo(px(i), py(v))));
  doc.stroke().restore();

  // mark SM payoff (first year balance hits ~0)
  const payoffIdx = seriesB.findIndex((v, i) => i > 0 && v <= 0.5);
  if (payoffIdx > 0) {
    doc.save().circle(px(payoffIdx), py(0), 3.2).fill(GREEN);
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(GREEN)
      .text(`Paid off ~yr ${payoffIdx}`, px(payoffIdx) - 34, py(0) - 16, { width: 68, align: 'center' });
    doc.restore();
  }

  // legend
  const ly = y - 14;
  doc.save().lineWidth(2.4).strokeColor(VIOLET).moveTo(x, ly).lineTo(x + 16, ly).stroke().restore();
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(INK).text('With Smith Manoeuvre', x + 20, ly - 4);
  doc.save().lineWidth(1.5).strokeColor('#9ca3af').dash(3, { space: 2 }).moveTo(x + 150, ly).lineTo(x + 166, ly).stroke().undash().restore();
  doc.font('Helvetica').fontSize(7.5).fillColor(GRAY).text('Traditional mortgage', x + 170, ly - 4);
}

// ── Bar chart: wealth built comparison ───────────────────────────────────────
function barChart(doc, x, y, w, h, bars) {
  const maxV = Math.max(...bars.map((b) => b.value), 1);
  const bw = w / (bars.length * 2);
  const gap = bw;
  doc.save().lineWidth(0.5).strokeColor('#eee');
  for (let g = 0; g <= 4; g++) {
    const gy = y + (h * g) / 4;
    doc.moveTo(x, gy).lineTo(x + w, gy).stroke();
  }
  doc.restore();
  bars.forEach((b, i) => {
    const bx = x + gap / 2 + i * (bw + gap);
    const bh = (h * b.value) / maxV;
    doc.save().rect(bx, y + h - bh, bw, bh).fill(b.color).restore();
    doc.font('Helvetica-Bold').fontSize(9).fillColor(INK).text(money(b.value), bx - bw / 2, y + h - bh - 14, { width: bw * 2, align: 'center' });
    doc.font('Helvetica').fontSize(7.5).fillColor(GRAY).text(b.label, bx - bw / 2, y + h + 5, { width: bw * 2, align: 'center' });
  });
}

function statTile(doc, x, y, w, big, label, color) {
  doc.save().roundedRect(x, y, w, 62, 8).fill('#faf5ff').restore();
  doc.save().roundedRect(x, y, w, 62, 8).lineWidth(0.8).stroke(LIGHT).restore();
  doc.font('Helvetica-Bold').fontSize(20).fillColor(color).text(big, x + 12, y + 12, { width: w - 24 });
  doc.font('Helvetica').fontSize(8).fillColor(GRAY).text(label, x + 12, y + 38, { width: w - 24 });
}

function buildReportPDF(lead, m) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'LETTER', margin: 0 });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const M = 48;            // page margin
      const W = 612 - M * 2;   // content width
      const name = `${lead.firstName || ''} ${lead.lastName || ''}`.trim();

      // ── Header band ──────────────────────────────────────────────────────
      doc.rect(0, 0, 612, 96).fill(PURPLE);
      doc.rect(0, 96, 612, 4).fill(VIOLET);
      drawLogo(doc, M + 16, 48, 16, '#ffffff');
      doc.font('Helvetica-Bold').fontSize(15).fillColor('#ffffff').text('PURPLE DOT', M + 40, 30, { characterSpacing: 1 });
      doc.font('Helvetica').fontSize(8).fillColor('#d8b4fe').text('FINANCIAL INC.', M + 40, 48, { characterSpacing: 2 });
      doc.font('Helvetica').fontSize(8).fillColor('#e9d5ff').text('647-524-8645  ·  info@purpledotfinancial.com', M, 62, { width: W, align: 'right' });
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff').text('Personalized Smith Manoeuvre Report', M, 44, { width: W, align: 'right' });

      // ════════════════════ PAGE 1 — summary + charts ════════════════════
      let y = 124;
      doc.font('Helvetica-Bold').fontSize(21).fillColor(INK)
        .text('Your Personalized Mortgage Strategy', M, y, { width: W });
      y += 28;
      doc.font('Helvetica').fontSize(10).fillColor(GRAY)
        .text(`Prepared for ${name || 'you'}${lead.province ? ' · ' + (PROVINCES[lead.province] || lead.province) : ''} · ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`, M, y, { width: W });
      y += 24;

      // Headline stat tiles
      const tw = (W - 24) / 3;
      statTile(doc, M, y, tw, yearsLabel(m.yearsFaster) + ' sooner', 'Mortgage-free faster', GREEN);
      statTile(doc, M + tw + 12, y, tw, money(m.annualRefundConverted) + '/yr', 'Est. annual tax refund (once converted)', PURPLE2);
      statTile(doc, M + (tw + 12) * 2, y, tw, yearsLabel(m.payoffYearsWith), 'Your new payoff timeline', INK);
      y += 88;

      // Chart 1: payoff acceleration
      doc.font('Helvetica-Bold').fontSize(13).fillColor(INK).text('How fast your mortgage disappears', M, y);
      y += 40;
      lineChart(doc, M + 40, y, W - 52, 150, m.balWithoutYr, m.balWithYr, {});
      y += 150 + 40;

      // Chart 2: wealth built
      doc.font('Helvetica-Bold').fontSize(13).fillColor(INK).text('The wealth you could build alongside it', M, y);
      doc.font('Helvetica').fontSize(9).fillColor(GRAY).text('Investment portfolio built by re-investing your mortgage paydown, net of the investment loan.', M, y + 18, { width: W });
      y += 44;
      barChart(doc, M + 40, y, W - 80, 110, [
        { label: 'Traditional mortgage', value: 0, color: '#c4b5fd' },
        { label: 'With Smith Manoeuvre', value: m.netInvestmentWealth, color: VIOLET },
      ]);

      // ════════════════════ PAGE 2 — numbers + how it works ══════════════
      doc.addPage();
      doc.rect(0, 0, 612, 8).fill(VIOLET);
      let y2 = 56;
      doc.font('Helvetica-Bold').fontSize(15).fillColor(INK).text('Your numbers', M, y2);
      y2 += 26;
      const rows = [
        ['Home value', money(m.homeValue)],
        ['Mortgage balance', money(m.mortgageBalance)],
        ['Estimated annual tax refund (once fully converted)', money(m.annualRefundConverted)],
        ['Cumulative tax refunds by payoff', money(m.cumRefund)],
        ['Total tax-deductible interest created', money(m.totalDeductibleInterest)],
        ['Investment wealth built (net of loan)', money(m.netInvestmentWealth)],
        ['Mortgage interest saved by paying off early', money(m.mortgageInterestSaved)],
      ];
      doc.fontSize(10);
      rows.forEach((r, i) => {
        if (i % 2 === 0) doc.save().rect(M, y2 - 4, W, 22).fill('#faf5ff').restore();
        doc.font('Helvetica').fillColor(GRAY).text(r[0], M + 10, y2, { width: W - 130 });
        doc.font('Helvetica-Bold').fillColor(INK).text(r[1], M + W - 130, y2, { width: 120, align: 'right' });
        y2 += 22;
      });

      // How it works
      y2 += 20;
      doc.font('Helvetica-Bold').fontSize(15).fillColor(INK).text('How it works', M, y2);
      y2 += 24;
      const steps = [
        ['Refinance into a readvanceable mortgage', 'A single product that bundles your mortgage with a linked line of credit that grows as you pay the mortgage down.'],
        ['Re-borrow and invest as you pay down', 'Every mortgage payment frees up room on the line of credit. You re-borrow it and invest it to earn income.'],
        ['Your interest becomes tax-deductible', 'Because that money is borrowed to earn investment income, the interest is deductible — generating an annual tax refund.'],
        ['Refunds accelerate your payoff', 'The refunds go straight back onto your mortgage, so your home is paid off years sooner while your portfolio grows.'],
      ];
      steps.forEach((s, i) => {
        doc.save().circle(M + 11, y2 + 7, 11).fill(VIOLET_LT).restore();
        doc.font('Helvetica-Bold').fontSize(10).fillColor(PURPLE2).text(String(i + 1), M + 6, y2 + 2, { width: 10, align: 'center' });
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK).text(s[0], M + 32, y2, { width: W - 32 });
        doc.font('Helvetica').fontSize(9).fillColor(GRAY).text(s[1], M + 32, y2 + 14, { width: W - 32 });
        y2 += 44;
      });

      // Assumptions
      y2 += 6;
      doc.save().roundedRect(M, y2, W, 54, 8).fill('#f9fafb').restore();
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(PURPLE2).text('ASSUMPTIONS USED', M + 14, y2 + 11);
      doc.font('Helvetica').fontSize(8.5).fillColor(GRAY).text(
        `Marginal tax rate ${(m.marginalRate * 100).toFixed(1)}% (${PROVINCES[lead.province] || 'ON'}, est. from income)  ·  Mortgage rate ${(m.mortgageRate * 100).toFixed(2)}%  ·  ` +
        `HELOC rate ${(m.helocRate * 100).toFixed(2)}%  ·  Investment return ${(m.investmentReturn * 100).toFixed(1)}%/yr  ·  ${m.yearsLeft}-yr amortization`,
        M + 14, y2 + 27, { width: W - 28 });

      // Footer / disclaimer
      const fy = 672;
      doc.save().roundedRect(M, fy, W, 44, 8).fill(PURPLE).restore();
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff').text('Ready to see your real numbers?', M + 16, fy + 10);
      doc.font('Helvetica').fontSize(9).fillColor('#e9d5ff').text('Book a free, no-obligation review  ·  647-524-8645  ·  info@purpledotfinancial.com', M + 16, fy + 26);
      doc.font('Helvetica').fontSize(6.5).fillColor('#9ca3af').text(
        'Illustrative and educational only — not investment, tax, or legal advice, and not a guarantee of results. The Smith Manoeuvre involves borrowing to invest (leverage), which increases risk and can cause losses greater than your original investment, including loss of capital. Interest is deductible only when borrowed funds are used to earn eligible investment income, subject to CRA rules and proper record-keeping. Tax rates are approximate combined federal/provincial estimates; investment returns are assumed and not guaranteed. Figures depend on your rate, income, returns, fees, and how the strategy is implemented. Confirm deductibility with a CPA. Mortgage products are subject to lender approval. Purple Dot Financial operates as a mortgage agent team under Choice Financial Corp. (Independently Owned & Operated) — Mortgage Agent Licence #M19002147; brokerage licences ON #13564 | QC #13564 | AB RECA | BCFSA #MB605782.',
        M, fy + 56, { width: W, align: 'left', lineGap: 0.5 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export { buildReportPDF };
