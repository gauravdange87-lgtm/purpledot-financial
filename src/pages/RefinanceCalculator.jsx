import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Logo from '../components/Logo'

const HUBSPOT_PORTAL_ID = '342403477'
const HUBSPOT_FORM_ID = 'REPLACE_WITH_YOUR_FORM_ID' // Replace after creating form in HubSpot

function calcMonthlyPayment(principal, annualRate, termYears) {
  if (annualRate === 0) return principal / (termYears * 12)
  const r = annualRate / 100 / 12
  const n = termYears * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function totalInterest(monthlyPayment, termYears, principal) {
  return monthlyPayment * termYears * 12 - principal
}

function fmt(n) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)
}

function InputField({ label, value, onChange, prefix, suffix, type = 'number', hint, min, max, step }) {
  return (
    <div>
      <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">
        {label}
        {hint && <span className="text-gray-600 text-xs font-normal normal-case tracking-normal ml-2">({hint})</span>}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-gray-500 font-bold pointer-events-none">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step || 1}
          className={`w-full bg-[#161616] border border-[#2a2a2a] rounded-lg py-3 text-white font-bold placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors font-mono ${prefix ? 'pl-8 pr-4' : 'pl-4 pr-4'} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && (
          <span className="absolute right-4 text-gray-500 font-bold pointer-events-none">{suffix}</span>
        )}
      </div>
    </div>
  )
}

function ResultRow({ label, value, highlight, large, green }) {
  return (
    <div className={`flex justify-between items-center py-3 ${highlight ? 'bg-purple-600/10 border border-purple-600/30 rounded-xl px-4 -mx-4 my-1' : 'border-b border-[#1e1e1e]'}`}>
      <span className={`${large ? 'text-base font-bold text-white' : 'text-sm text-gray-400'}`}>{label}</span>
      <span className={`font-black ${large ? 'text-2xl' : 'text-lg'} ${green ? 'text-green-400' : highlight ? 'text-purple-300' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}

export default function RefinanceCalculator() {
  const [inputs, setInputs] = useState({
    balance: 2500000,
    currentRate: 6.25,
    currentTerm: 20,
    newRate: 5.5,
    newTerm: 20,
    closingCosts: 15000,
    prepaymentPenalty: 0,
    propertyType: 'Plaza',
  })

  const [results, setResults] = useState(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' })
  const formRef = useRef(null)
  const hsLoaded = useRef(false)

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: parseFloat(val) || 0 }))
  const setStr = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }))

  useEffect(() => {
    const b = inputs.balance
    const cr = inputs.currentRate
    const ct = inputs.currentTerm
    const nr = inputs.newRate
    const nt = inputs.newTerm
    const cc = inputs.closingCosts
    const pp = inputs.prepaymentPenalty

    const currentPayment = calcMonthlyPayment(b, cr, ct)
    const newPayment = calcMonthlyPayment(b, nr, nt)
    const monthlySavings = currentPayment - newPayment
    const totalCosts = cc + pp
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(totalCosts / monthlySavings) : null

    const currentTotalInterest = totalInterest(currentPayment, ct, b)
    const newTotalInterest = totalInterest(newPayment, nt, b)
    const interestSaved = currentTotalInterest - newTotalInterest

    const fiveYearSavings = monthlySavings * 60 - totalCosts

    const shouldRefinance =
      monthlySavings > 0 &&
      (breakEvenMonths === null || breakEvenMonths <= inputs.currentTerm * 12 * 0.5)

    setResults({
      currentPayment,
      newPayment,
      monthlySavings,
      breakEvenMonths,
      totalCosts,
      currentTotalInterest,
      newTotalInterest,
      interestSaved,
      fiveYearSavings,
      shouldRefinance,
    })
  }, [inputs])

  const handleLeadSubmit = (e) => {
    e.preventDefault()
    // In production, this posts to HubSpot via their API
    fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [
          { name: 'firstname', value: leadData.name.split(' ')[0] || leadData.name },
          { name: 'lastname', value: leadData.name.split(' ').slice(1).join(' ') || '' },
          { name: 'email', value: leadData.email },
          { name: 'phone', value: leadData.phone },
          { name: 'property_type', value: inputs.propertyType },
          { name: 'loan_balance', value: String(inputs.balance) },
          { name: 'current_rate', value: String(inputs.currentRate) },
          { name: 'new_rate', value: String(inputs.newRate) },
          { name: 'monthly_savings', value: String(Math.round(results?.monthlySavings || 0)) },
        ],
        context: { pageUri: window.location.href, pageName: 'Refinance Calculator' },
      }),
    }).catch(() => {})
    setLeadSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Free Tool
          </p>
          <h1 className="text-4xl md:text-6xl font-black uppercase text-white leading-tight mb-4">
            Commercial Mortgage
            <br />
            <span className="text-gradient">Refinance Calculator</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Enter your current mortgage details and see instantly whether refinancing makes financial sense.
            No email required to see your results.
          </p>
        </div>

        {/* Main grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* LEFT — Inputs */}
            <div className="lg:col-span-2 bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-6 md:p-8 space-y-6 h-fit">
              <h2 className="text-white font-black text-lg uppercase tracking-wide border-b border-[#1e1e1e] pb-4">
                Your Current Mortgage
              </h2>

              <div>
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">
                  Property Type
                </label>
                <select
                  value={inputs.propertyType}
                  onChange={(e) => setStr('propertyType')(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-600/60 transition-colors"
                >
                  {['Plaza', 'Warehouse', 'Storefront', 'Mixed-Use', 'Other Commercial'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <InputField label="Current Loan Balance" value={inputs.balance} onChange={set('balance')} prefix="$" hint="remaining principal" min={0} />
              <InputField label="Current Interest Rate" value={inputs.currentRate} onChange={set('currentRate')} suffix="%" hint="annual" min={0} max={25} step={0.05} />
              <InputField label="Remaining Term" value={inputs.currentTerm} onChange={set('currentTerm')} suffix="yrs" min={1} max={30} />

              <div className="border-t border-[#1e1e1e] pt-6">
                <h2 className="text-white font-black text-lg uppercase tracking-wide mb-5">
                  New Rate You Were Quoted
                </h2>
                <div className="space-y-5">
                  <InputField label="New Offered Rate" value={inputs.newRate} onChange={set('newRate')} suffix="%" hint="annual" min={0} max={25} step={0.05} />
                  <InputField label="New Term" value={inputs.newTerm} onChange={set('newTerm')} suffix="yrs" min={1} max={30} />
                </div>
              </div>

              <div className="border-t border-[#1e1e1e] pt-6">
                <h2 className="text-white font-black text-lg uppercase tracking-wide mb-5">
                  Refinancing Costs
                </h2>
                <div className="space-y-5">
                  <InputField label="Closing Costs / Lender Fees" value={inputs.closingCosts} onChange={set('closingCosts')} prefix="$" hint="legal, appraisal, etc." min={0} />
                  <InputField label="Prepayment Penalty" value={inputs.prepaymentPenalty} onChange={set('prepaymentPenalty')} prefix="$" hint="if applicable" min={0} />
                </div>
              </div>
            </div>

            {/* RIGHT — Results */}
            <div className="lg:col-span-3 space-y-6">
              {results && (
                <>
                  {/* Verdict */}
                  <div
                    className={`rounded-2xl p-6 border ${
                      results.shouldRefinance
                        ? 'bg-green-900/10 border-green-600/30'
                        : 'bg-red-900/10 border-red-600/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                          results.shouldRefinance ? 'bg-green-600/20' : 'bg-red-600/20'
                        }`}
                      >
                        <svg
                          className={`w-7 h-7 ${results.shouldRefinance ? 'text-green-400' : 'text-red-400'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {results.shouldRefinance ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-2xl font-black uppercase ${results.shouldRefinance ? 'text-green-400' : 'text-red-400'}`}>
                          {results.shouldRefinance ? 'Yes — Refinance Makes Sense' : 'Not Yet — Hold Your Mortgage'}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {results.shouldRefinance
                            ? `You'd break even in ${results.breakEvenMonths} months and save significantly over the loan term.`
                            : 'The cost of refinancing outweighs the savings based on your current inputs.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment comparison */}
                  <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-6 md:p-8">
                    <h3 className="text-white font-black text-base uppercase tracking-wide mb-5">
                      Monthly Payment Comparison
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#161616] border border-[#222] rounded-xl p-4 text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Current Payment</p>
                        <p className="text-2xl font-black text-white">{fmt(results.currentPayment)}</p>
                        <p className="text-gray-600 text-xs mt-1">/month · {inputs.currentRate}%</p>
                      </div>
                      <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">New Payment</p>
                        <p className="text-2xl font-black text-purple-300">{fmt(results.newPayment)}</p>
                        <p className="text-gray-500 text-xs mt-1">/month · {inputs.newRate}%</p>
                      </div>
                    </div>

                    {/* Monthly savings highlight */}
                    <div className={`rounded-xl p-4 flex items-center justify-between ${results.monthlySavings >= 0 ? 'bg-green-900/10 border border-green-600/20' : 'bg-red-900/10 border border-red-600/20'}`}>
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Monthly Savings</p>
                        <p className="text-gray-500 text-xs mt-0.5">per month, every month</p>
                      </div>
                      <p className={`text-4xl font-black ${results.monthlySavings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {results.monthlySavings >= 0 ? '' : '−'}{fmt(Math.abs(results.monthlySavings))}
                      </p>
                    </div>
                  </div>

                  {/* Key metrics */}
                  <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-6 md:p-8">
                    <h3 className="text-white font-black text-base uppercase tracking-wide mb-5">
                      Refinancing Analysis
                    </h3>
                    <div className="space-y-1">
                      <ResultRow
                        label="Total Refinancing Costs"
                        value={fmt(results.totalCosts)}
                      />
                      <ResultRow
                        label="Break-Even Point"
                        value={results.breakEvenMonths ? `${results.breakEvenMonths} months` : 'N/A'}
                      />
                      <ResultRow
                        label="5-Year Net Savings (after costs)"
                        value={fmt(Math.max(0, results.fiveYearSavings))}
                        green={results.fiveYearSavings > 0}
                      />
                      <ResultRow
                        label="Current Total Interest (full term)"
                        value={fmt(results.currentTotalInterest)}
                      />
                      <ResultRow
                        label="New Total Interest (full term)"
                        value={fmt(results.newTotalInterest)}
                      />
                      <div className="pt-2">
                        <ResultRow
                          label="Total Interest Savings"
                          value={results.interestSaved >= 0 ? fmt(results.interestSaved) : `−${fmt(Math.abs(results.interestSaved))}`}
                          large
                          green={results.interestSaved > 0}
                          highlight={results.interestSaved > 0}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lead capture */}
                  {!leadSubmitted ? (
                    <div className="bg-[#0f0f0f] border border-purple-600/30 rounded-2xl p-6 md:p-8">
                      {!showLeadForm ? (
                        <div className="text-center">
                          <h3 className="text-white font-black text-xl uppercase mb-2">
                            Get Your Full Refinance Report
                          </h3>
                          <p className="text-gray-400 text-sm mb-6">
                            We'll email you a personalized PDF with your numbers, lender recommendations,
                            and next steps — completely free.
                          </p>
                          <button
                            onClick={() => setShowLeadForm(true)}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 glow-purple"
                          >
                            Email Me My Report
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                          <h3 className="text-white font-black text-xl uppercase mb-4">
                            Where Should We Send Your Report?
                          </h3>
                          <input
                            required
                            type="text"
                            placeholder="Full Name"
                            value={leadData.name}
                            onChange={(e) => setLeadData((p) => ({ ...p, name: e.target.value }))}
                            className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors"
                          />
                          <input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={leadData.email}
                            onChange={(e) => setLeadData((p) => ({ ...p, email: e.target.value }))}
                            className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors"
                          />
                          <input
                            type="tel"
                            placeholder="Phone (optional)"
                            value={leadData.phone}
                            onChange={(e) => setLeadData((p) => ({ ...p, phone: e.target.value }))}
                            className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors"
                          />
                          <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-200 glow-purple"
                          >
                            Send My Free Report
                          </button>
                          <p className="text-gray-600 text-xs text-center">
                            No spam. We respect your privacy.
                          </p>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-900/10 border border-green-600/30 rounded-2xl p-8 text-center">
                      <div className="w-14 h-14 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">Report On Its Way!</h3>
                      <p className="text-gray-400">Check your inbox. Our team will follow up shortly.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-gray-700 text-xs text-center mt-12 max-w-3xl mx-auto leading-relaxed">
            This calculator provides estimates for informational purposes only based on standard amortization formulas.
            Results do not account for compounding frequency differences (Canadian mortgages typically compound semi-annually),
            variable rate adjustments, or lender-specific terms. Always consult a licensed mortgage professional before making
            financing decisions. Purple Dot Financial Inc. is licensed in Ontario.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
