import { Link } from 'react-router-dom'

export default function CalculatorTeaser() {
  return (
    <section className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(123,45,139,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="bg-[#0f0f0f] border border-purple-600/20 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center glow-purple">
          {/* Left — copy */}
          <div className="flex-1">
            <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Free Tool
            </p>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white leading-tight mb-6">
              See Your Numbers
              <br />
              In <span className="text-gradient">60 Seconds.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Enter your current mortgage details and a new rate you've been quoted.
              We'll instantly show you your monthly savings, break-even point, and total
              interest difference — for free, no email required to see results.
            </p>
            <Link
              to="/refinance-calculator"
              className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 group"
            >
              Open the Calculator
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right — preview card */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-[#161616] border border-[#222] rounded-2xl p-6 space-y-4">
              {/* Mock inputs */}
              {[
                { label: 'Current Loan Balance', value: '$2,500,000' },
                { label: 'Current Interest Rate', value: '6.25%' },
                { label: 'New Offered Rate', value: '5.50%' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-1.5">
                    {field.label}
                  </label>
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white font-bold font-mono">
                    {field.value}
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-[#222] pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Monthly Savings</span>
                  <span className="text-green-400 font-black text-xl">$1,547</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Break-Even Point</span>
                  <span className="text-white font-bold">14 months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">5-Year Savings</span>
                  <span className="text-green-400 font-black text-xl">$92,820</span>
                </div>
                <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl p-3 mt-2">
                  <p className="text-purple-400 text-sm font-bold text-center">
                    ✓ Yes — You Should Refinance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
