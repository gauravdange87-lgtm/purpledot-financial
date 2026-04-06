const REASONS = [
  {
    number: '01',
    title: 'Lower Your Monthly Payments',
    desc: "Even a 0.5% rate reduction on a $2M commercial mortgage saves you over $10,000 per year. That's real money back in your business.",
  },
  {
    number: '02',
    title: 'Improve Your DSCR',
    desc: 'A better Debt Service Coverage Ratio opens doors to future financing. Refinancing now can position your portfolio for its next acquisition.',
  },
  {
    number: '03',
    title: 'Access Your Equity',
    desc: 'Your property has appreciated. Refinancing lets you pull out equity for renovations, expansion, or your next investment — without selling.',
  },
  {
    number: '04',
    title: 'Lock In Before Rates Move',
    desc: "Rate environments shift fast. If you're holding a variable rate or coming up on renewal, now is the time to run the numbers.",
  },
]

export default function WhyRefinance() {
  return (
    <section id="services" className="py-28 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div className="sticky top-32">
            <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Why Refinance
            </p>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-tight mb-6">
              Is It Time
              <br />
              To <span className="text-gradient">Refinance?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Most commercial property owners are leaving thousands on the table every year.
              The market has shifted. Your mortgage terms shouldn't stay the same.
            </p>
            <div className="border-l-2 border-purple-600 pl-6">
              <p className="text-white font-semibold text-lg italic">
                "We ran the numbers for a plaza owner in Mississauga and found $47,000 in annual savings they hadn't considered."
              </p>
              <p className="text-gray-500 text-sm mt-3 font-medium">— PurpleDot Financial Team</p>
            </div>
          </div>

          {/* Right column — reasons */}
          <div className="flex flex-col gap-8">
            {REASONS.map((r) => (
              <div
                key={r.number}
                className="flex gap-6 group"
              >
                <div className="flex-shrink-0">
                  <span className="text-5xl font-black text-[#1e1e1e] group-hover:text-purple-600/30 transition-colors duration-300 leading-none">
                    {r.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{r.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
