/**
 * Smith Manoeuvre simulation engine (approximate, educational).
 *
 * Models the core mechanic:
 *  - Standard mortgage amortization (the "without SM" baseline)
 *  - A readvanceable HELOC: every dollar of principal paid frees an equal
 *    dollar of credit, which is re-borrowed and invested
 *  - The HELOC interest is tax-deductible → annual tax refund
 *  - Refunds are re-applied to the mortgage (cash-flow-diversion accelerator),
 *    which speeds up the payoff and compounds the conversion
 *
 * All figures are approximate and for illustration only — not tax/investment advice.
 */

// Approximate 2025/26 COMBINED (federal + provincial) marginal tax-rate bands.
// Thresholds are taxable-income breakpoints; rates are the marginal rate in each band.
const TAX = {
  thresholds: [55000, 110000, 175000, 250000],
  rates: {
    ON: [0.20, 0.30, 0.43, 0.48, 0.535],
    BC: [0.20, 0.28, 0.38, 0.46, 0.535],
    AB: [0.25, 0.305, 0.36, 0.42, 0.48],
    QC: [0.28, 0.37, 0.46, 0.50, 0.533],
    MB: [0.27, 0.33, 0.43, 0.46, 0.504],
    SK: [0.255, 0.33, 0.385, 0.43, 0.475],
    NS: [0.24, 0.35, 0.43, 0.48, 0.54],
    NB: [0.24, 0.34, 0.43, 0.47, 0.525],
    NL: [0.237, 0.35, 0.43, 0.47, 0.548],
    PE: [0.248, 0.35, 0.44, 0.47, 0.514],
    NT: [0.209, 0.297, 0.36, 0.41, 0.4705],
    NU: [0.19, 0.275, 0.34, 0.405, 0.445],
    YT: [0.214, 0.29, 0.36, 0.4225, 0.48],
  },
};

function combinedMarginalRate(province, income) {
  const bands = TAX.rates[province] || TAX.rates.ON;
  const inc = Number(income) || 90000;
  let i = TAX.thresholds.findIndex((x) => inc <= x);
  if (i < 0) i = TAX.thresholds.length; // top band
  return bands[i];
}

function monthlyPayment(principal, monthlyRate, months) {
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

/**
 * @param {object} p
 *   homeValue, mortgageBalance, mortgageRate (%), yearsLeft, province, income
 *   optional: helocRate (%), investmentReturn (%)
 */
function runSmithManoeuvre(p) {
  const homeValue = Math.max(0, Number(p.homeValue) || 0);
  const P0 = Math.max(1, Number(p.mortgageBalance) || 0);
  const rM = (Number(p.mortgageRate) || 5) / 100;
  const N = Math.min(35, Math.max(1, Number(p.yearsLeft) || 20));
  const rH = (p.helocRate != null ? Number(p.helocRate) / 100 : rM + 0.015); // default prime-ish spread
  const rI = (p.investmentReturn != null ? Number(p.investmentReturn) / 100 : 0.06); // conservative long-term
  const t = combinedMarginalRate(p.province, p.income);

  const iM = rM / 12, iH = rH / 12, iI = rI / 12;
  const totalMonths = Math.round(N * 12);
  const pay = monthlyPayment(P0, iM, totalMonths);

  // ── Baseline: traditional mortgage, no SM ────────────────────────────────
  let bal = P0, totalIntWithout = 0;
  const balWithoutYr = [P0];
  for (let m = 1; m <= totalMonths; m++) {
    const int = bal * iM;
    totalIntWithout += int;
    let prin = pay - int;
    if (prin > bal) prin = bal;
    bal -= prin;
    if (m % 12 === 0) balWithoutYr.push(Math.max(0, bal));
  }

  // ── With the Smith Manoeuvre ─────────────────────────────────────────────
  bal = P0;
  let heloc = 0, port = 0, cumDeduct = 0, cumRefund = 0, totalIntWith = 0, yearHelocInt = 0;
  const balWithYr = [P0], portYr = [0];
  let payoffMonth = totalMonths;
  const cap = Math.round(totalMonths * 1.25);
  for (let m = 1; m <= cap; m++) {
    // Mortgage payment
    const int = bal * iM;
    totalIntWith += int;
    let prin = pay - int;
    if (prin > bal) prin = bal;
    bal -= prin;
    // Re-borrow the freed principal and invest it
    heloc += prin;
    port += prin;
    // Portfolio grows
    port *= (1 + iI);
    // Deductible HELOC interest accrues
    const hInt = heloc * iH;
    cumDeduct += hInt;
    yearHelocInt += hInt;
    // Year end: bank the refund and re-apply it to the mortgage
    if (m % 12 === 0) {
      const refund = yearHelocInt * t;
      cumRefund += refund;
      let rp = Math.min(refund, bal);
      bal -= rp;
      heloc += rp;
      port += rp;
      yearHelocInt = 0;
      balWithYr.push(Math.max(0, bal));
      portYr.push(port);
    }
    if (bal <= 0.5) { payoffMonth = m; break; }
  }
  // pad yearly series to same length for charting
  while (balWithYr.length < balWithoutYr.length) { balWithYr.push(0); portYr.push(port); }

  const payoffYearsWith = payoffMonth / 12;
  const annualRefundConverted = heloc * rH * t; // steady-state once fully converted
  const netInvestmentWealth = Math.max(0, port - heloc); // portfolio net of the investment loan

  return {
    // assumptions
    marginalRate: t, helocRate: rH, investmentReturn: rI, monthlyPayment: pay,
    helocRoomAt80: Math.max(0, homeValue * 0.8 - P0),
    // headline
    payoffYearsWithout: N,
    payoffYearsWith,
    yearsFaster: Math.max(0, N - payoffYearsWith),
    annualRefundConverted,
    // detail
    cumRefund,
    totalDeductibleInterest: cumDeduct,
    totalInterestWithout: totalIntWithout,
    totalInterestWith: totalIntWith,
    mortgageInterestSaved: Math.max(0, totalIntWithout - totalIntWith),
    portfolioAtPayoff: port,
    helocAtPayoff: heloc,
    netInvestmentWealth,
    // series (yearly)
    balWithoutYr, balWithYr, portYr,
    // echo inputs
    homeValue, mortgageBalance: P0, mortgageRate: rM, yearsLeft: N, province: p.province || 'ON', income: Number(p.income) || null,
  };
}

export { runSmithManoeuvre, combinedMarginalRate };
