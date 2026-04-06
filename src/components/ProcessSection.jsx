const STEPS = [
  {
    step: '01',
    title: 'Enter Your Numbers',
    desc: 'Input your current mortgage balance, rate, remaining term, and the new rate you\'ve been offered. Takes under 2 minutes.',
  },
  {
    step: '02',
    title: 'See Your Savings',
    desc: 'Instantly see your monthly savings, break-even period, and total interest savings over the life of the loan.',
  },
  {
    step: '03',
    title: 'Book a Free Call',
    desc: 'If the numbers make sense, book a free 20-minute call with our team. We\'ll review your specific situation in detail.',
  },
  {
    step: '04',
    title: 'We Handle Everything',
    desc: 'From lender negotiations to paperwork and closing — our team manages the entire refinance process start to finish.',
  },
]

export default function ProcessSection() {
  return (
    <section id="process" className="py-28 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-tight">
            Four Steps to
            <br />
            <span className="text-gradient">Better Financing.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Step number */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-600/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-black text-sm">{step.step}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="lg:hidden flex-1 h-px bg-gradient-to-r from-purple-600/30 to-transparent" />
                  )}
                </div>

                <h3 className="text-xl font-black text-white uppercase mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
