import { useState, useEffect } from 'react'
import { submitLead } from '../lib/submitLead'

function calcMonthlyPayment(principal, annualRate, termYears) {
  if (annualRate === 0) return principal / (termYears * 12)
  const r = annualRate / 100 / 12
  const n = termYears * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function fmt(n) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)
}

function fmtK(n) {
  if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return fmt(n)
}


function InputField({ label, value, onChange, prefix, suffix, hint, min, max, step }) {
  return (
    <div>
      <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">
        {label}
        {hint && <span className="text-gray-600 text-xs font-normal normal-case tracking-normal ml-2">({hint})</span>}
      </label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-4 text-gray-500 font-bold pointer-events-none">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step || 1}
          className={`w-full bg-[#161616] border border-[#2a2a2a] rounded-lg py-3 text-white font-bold placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors font-mono ${prefix ? 'pl-8 pr-4' : 'pl-4'} ${suffix ? 'pr-10' : 'pr-4'}`}
        />
        {suffix && <span className="absolute right-4 text-gray-500 font-bold pointer-events-none">{suffix}</span>}
      </div>
    </div>
  )
}


export default function RefinanceCalculatorEmbed() {
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

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: parseFloat(val) || 0 }))
  const setStr = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }))

  useEffect(() => {
    const { balance: b, currentRate: cr, currentTerm: ct, newRate: nr, newTerm: nt, closingCosts: cc, prepaymentPenalty: pp } = inputs

    const currentPayment = calcMonthlyPayment(b, cr, ct)
    const newPayment = calcMonthlyPayment(b, nr, nt)
    const monthlySavings = currentPayment - newPayment
    const totalCosts = cc + pp
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(totalCosts / monthlySavings) : null
    const currentTotalInterest = currentPayment * ct * 12 - b
    const newTotalInterest = newPayment * nt * 12 - b
    const interestSaved = currentTotalInterest - newTotalInterest
    const fiveYearSavings = monthlySavings * 60 - totalCosts
    const shouldRefinance = monthlySavings > 0 && (breakEvenMonths === null || breakEvenMonths <= ct * 12 * 0.5)

    // Savings over time chart data
    const maxYears = Math.min(ct, nt, 25)
    const savingsData = []
    for (let year = 0; year <= maxYears; year++) {
      const gross = monthlySavings * year * 12
      const net = gross - totalCosts
      savingsData.push({
        year: year === 0 ? 'Now' : `Yr ${year}`,
        'Gross Savings': Math.max(0, Math.round(gross)),
        'Net Savings': Math.round(net),
      })
    }

    // Payment comparison bar data
    const paymentData = [
      { name: 'Monthly Payment', 'Current': Math.round(currentPayment), 'New': Math.round(newPayment) },
    ]

    // Cumulative interest comparison (5-year chunks)
    const interestData = []
    const years = [1, 2, 3, 5, 10, Math.min(ct, 20)].filter((y, i, arr) => arr.indexOf(y) === i && y <= maxYears)
    for (const y of years) {
      interestData.push({
        year: `${y}yr`,
        'Current Interest': Math.round(currentPayment * y * 12 - (b - calcMonthlyPayment(b, cr, ct) * y * 12 * 0)),
        'New Interest': Math.round(newPayment * y * 12 - (b - calcMonthlyPayment(b, nr, nt) * y * 12 * 0)),
      })
    }

    // Simplified: just total interest paid over N years
    const interestCompData = [1, 3, 5, 10].filter(y => y <= maxYears).map(y => ({
      year: `${y} yr`,
      'Current': Math.round(currentPayment * y * 12),
      'Refinanced': Math.round(newPayment * y * 12),
    }))

    setResults({
      currentPayment, newPayment, monthlySavings, breakEvenMonths, totalCosts,
      currentTotalInterest, newTotalInterest, interestSaved, fiveYearSavings,
      shouldRefinance, savingsData, paymentData, interestCompData,
    })
  }, [inputs])

  const handleLeadSubmit = (e) => {
    e.preventDefault()
    submitLead({
      form: 'calculator',
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      propertyType: inputs.propertyType,
      loanBalance: inputs.balance,
      currentRate: inputs.currentRate,
      newRate: inputs.newRate,
      monthlySavings: Math.round(results?.monthlySavings || 0),
    })
    setLeadSubmitted(true)
  }

  return (
    <section id="calculator" className="py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">Free Tool</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white leading-tight mb-4">
            Refinance <span className="text-gradient">Calculator</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Enter your numbers and get an instant verdict. Enter your email to receive the
            full analysis — charts, breakdown, and lender recommendations — as a free PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT — Inputs */}
          <div className="lg:col-span-2 bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-6 md:p-8 space-y-6 h-fit">
            <h3 className="text-white font-black text-base uppercase tracking-wide border-b border-[#1e1e1e] pb-4">Your Current Mortgage</h3>

            <div>
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">Property Type</label>
              <select
                value={inputs.propertyType}
                onChange={(e) => setStr('propertyType')(e.target.value)}
                className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-600/60 transition-colors"
              >
                {['Plaza', 'Warehouse', 'Storefront', 'Mixed-Use', 'Other Commercial'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <InputField label="Current Loan Balance" value={inputs.balance} onChange={set('balance')} prefix="$" hint="remaining principal" min={0} />
            <InputField label="Current Interest Rate" value={inputs.currentRate} onChange={set('currentRate')} suffix="%" hint="annual" min={0} max={25} step={0.05} />
            <InputField label="Remaining Term" value={inputs.currentTerm} onChange={set('currentTerm')} suffix="yrs" min={1} max={30} />

            <div className="border-t border-[#1e1e1e] pt-6 space-y-5">
              <h3 className="text-white font-black text-base uppercase tracking-wide">New Rate Quoted</h3>
              <InputField label="New Offered Rate" value={inputs.newRate} onChange={set('newRate')} suffix="%" hint="annual" min={0} max={25} step={0.05} />
              <InputField label="New Term" value={inputs.newTerm} onChange={set('newTerm')} suffix="yrs" min={1} max={30} />
            </div>

            <div className="border-t border-[#1e1e1e] pt-6 space-y-5">
              <h3 className="text-white font-black text-base uppercase tracking-wide">Refinancing Costs</h3>
              <InputField label="Closing Costs / Fees" value={inputs.closingCosts} onChange={set('closingCosts')} prefix="$" hint="legal, appraisal, etc." min={0} />
              <InputField label="Prepayment Penalty" value={inputs.prepaymentPenalty} onChange={set('prepaymentPenalty')} prefix="$" hint="if applicable" min={0} />
            </div>
          </div>

          {/* RIGHT — Charts & Results */}
          <div className="lg:col-span-3 space-y-6">
            {results && (
              <>
                {/* Verdict */}
                <div className={`rounded-2xl p-6 border ${results.shouldRefinance ? 'bg-green-900/10 border-green-600/30' : 'bg-red-900/10 border-red-600/30'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${results.shouldRefinance ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
                      <svg className={`w-7 h-7 ${results.shouldRefinance ? 'text-green-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {results.shouldRefinance
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />}
                      </svg>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-black uppercase ${results.shouldRefinance ? 'text-green-400' : 'text-red-400'}`}>
                        {results.shouldRefinance ? 'Yes — Refinance Makes Sense' : 'Not Yet — Hold Your Mortgage'}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {results.shouldRefinance
                          ? `Monthly savings of ${fmt(results.monthlySavings)} · Break-even in ${results.breakEvenMonths} months`
                          : 'The refinancing costs outweigh the savings based on your current inputs.'}
                      </p>
                    </div>
                  </div>

                  {/* Key numbers row */}
                  <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10">
                    {[
                      { label: 'Monthly Savings', value: fmt(Math.abs(results.monthlySavings)), green: results.monthlySavings > 0 },
                      { label: 'Break-Even', value: results.breakEvenMonths ? `${results.breakEvenMonths} mo` : 'N/A', green: false },
                      { label: '5-Year Net', value: fmtK(results.fiveYearSavings), green: results.fiveYearSavings > 0 },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <p className={`text-xl font-black ${s.green ? 'text-green-400' : 'text-white'}`}>{s.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead capture */}
                {!leadSubmitted ? (
                  <div className="bg-[#0f0f0f] border border-purple-600/30 rounded-2xl p-6 md:p-8">
                    {!showLeadForm ? (
                      <div className="text-center">
                        <h3 className="text-white font-black text-xl uppercase mb-2">Get the Full Analysis PDF</h3>
                        <p className="text-gray-400 text-sm mb-6">
                          We'll email you a detailed refinance report with your full breakdown, lender recommendations, and next steps — completely free.
                        </p>
                        <button onClick={() => setShowLeadForm(true)} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 glow-purple">
                          Email Me the Full Analysis
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleLeadSubmit} className="space-y-4">
                        <h3 className="text-white font-black text-xl uppercase mb-4">Where Should We Send It?</h3>
                        <input required type="text" placeholder="Full Name" value={leadData.name} onChange={(e) => setLeadData((p) => ({ ...p, name: e.target.value }))} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors" />
                        <input required type="email" placeholder="Email Address" value={leadData.email} onChange={(e) => setLeadData((p) => ({ ...p, email: e.target.value }))} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors" />
                        <input type="tel" placeholder="Phone (optional)" value={leadData.phone} onChange={(e) => setLeadData((p) => ({ ...p, phone: e.target.value }))} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors" />
                        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-200 glow-purple">Send My Free Report</button>
                        <p className="text-gray-600 text-xs text-center">No spam. We respect your privacy.</p>
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
                    <a
                      href="https://calendly.com/purpledotfinancial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-5 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
                    >
                      Book a Free Consultation
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <p className="text-gray-700 text-xs text-center mt-12 max-w-3xl mx-auto leading-relaxed">
          This calculator provides estimates for informational purposes only. Canadian mortgages typically compound semi-annually.
          Always consult a licensed mortgage professional before making financing decisions. Purple Dot Financial Inc. is licensed in Ontario.
        </p>
      </div>
    </section>
  )
}
