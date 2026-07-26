/**
 * Debt-consolidation model (approximate, educational) — ESM for Vercel.
 *
 * Rolls high-interest consumer debt (~19-25%) into mortgage-secured borrowing
 * (~5-6%). Honest, conservative outputs:
 *   1. New monthly payment on that debt (amortized at the mortgage rate)
 *   2. Monthly cash freed up  = current debt payments − new debt payment
 *   3. First-year interest saved = balance × (old rate − new rate)
 *
 * We do NOT promise a payoff date or a changed core mortgage payment. All
 * figures are illustrative estimates only.
 */

function amortPayment(principal, monthlyRate, months) {
  if (months <= 0) return principal;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function simulatePayoff(balance, monthlyRate, payment) {
  if (payment <= balance * monthlyRate + 0.01) {
    return { months: Infinity, interest: Infinity, neverPaysOff: true };
  }
  let bal = balance, interest = 0, months = 0;
  const cap = 12 * 60;
  while (bal > 0.5 && months < cap) {
    const int = bal * monthlyRate;
    interest += int;
    let prin = payment - int;
    if (prin > bal) prin = bal;
    bal -= prin;
    months++;
  }
  return { months, interest, neverPaysOff: false };
}

function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

/**
 * @param {object} p
 *   totalDebt, debtRate (%), debtPayment, homeValue, mortgageBalance,
 *   optional: newRate (%), newAmortYears, mortgageRate (%)
 */
function runDebtConsolidation(p) {
  const D  = Math.max(0, Number(p.totalDebt) || 0);
  const rD = clamp(Number(p.debtRate) || 19.99, 1, 60) / 100;
  const rN = clamp(p.newRate != null ? Number(p.newRate) : 5.49, 1, 15) / 100;
  const Nn = clamp(Number(p.newAmortYears) || 25, 5, 30);
  const homeValue = Math.max(0, Number(p.homeValue) || 0);
  const M = Math.max(0, Number(p.mortgageBalance) || 0);

  const minFloor = D * (rD / 12) * 1.02;
  const Pd = Math.max(
    Number(p.debtPayment) || Math.max(D * 0.03, minFloor),
    minFloor + 1
  );

  const Pdn = amortPayment(D, rN / 12, Nn * 12);
  const monthlyFreed = Pd - Pdn;

  const currentAnnualInterest = D * rD;
  const newAnnualInterest = D * rN;
  const firstYearInterestSaved = Math.max(0, currentAnnualInterest - newAnnualInterest);

  const nowPath = simulatePayoff(D, rD / 12, Pd);

  const equityAvailableAt80 = Math.max(0, homeValue * 0.8 - M);
  const fitsInEquity = homeValue > 0 && M > 0 ? D <= equityAvailableAt80 : null;

  const blendedBefore = (M + D) > 0 ? ((M * (Number(p.mortgageRate) / 100 || rN)) + D * rD) / (M + D) : rD;

  return {
    totalDebt: D, debtRate: rD, newRate: rN, newAmortYears: Nn,
    currentDebtPayment: Pd,
    homeValue, mortgageBalance: M,
    newDebtPayment: Pdn,
    monthlyFreed,
    firstYearInterestSaved,
    currentAnnualInterest, newAnnualInterest,
    currentPayoffMonths: nowPath.months,
    currentPayoffInterest: nowPath.interest,
    neverPaysOff: nowPath.neverPaysOff,
    equityAvailableAt80, fitsInEquity,
    blendedBefore,
  };
}

export { runDebtConsolidation, amortPayment, simulatePayoff };
