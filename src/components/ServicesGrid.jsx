import { Link } from 'react-router-dom'

const SERVICES = [
  {
    number: '01',
    title: 'Commercial Real Estate Purchase Financing',
    desc: 'Acquire your next plaza, warehouse, storefront, or mixed-use property with the right financing structure from day one. We match you with lenders who understand commercial assets.',
    href: '/commercial-purchase-financing',
    tags: ['Plazas', 'Warehouses', 'Storefronts', 'Mixed-Use'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="22" width="36" height="22" rx="2" stroke="#7B2D8B" strokeWidth="2.5" />
        <path d="M4 22L24 8L44 22" stroke="#7B2D8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="32" width="12" height="12" rx="1" stroke="#9B4DCA" strokeWidth="2" />
        <rect x="10" y="28" width="7" height="6" rx="1" stroke="#9B4DCA" strokeWidth="1.5" />
        <rect x="31" y="28" width="7" height="6" rx="1" stroke="#9B4DCA" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Commercial Real Estate Refinancing',
    desc: 'Already own a commercial property? Find out if your current mortgage rate is still competitive. Use our free calculator to see your savings in 60 seconds.',
    href: '/commercial-refinancing',
    tags: ['Rate & Term Refi', 'Cash-Out Refi', 'Free Calculator'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M40 24C40 32.837 32.837 40 24 40C15.163 40 8 32.837 8 24C8 15.163 15.163 8 24 8" stroke="#7B2D8B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 8L40 8L40 16" stroke="#7B2D8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 8L28 20" stroke="#9B4DCA" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 24L22 28L30 20" stroke="#9B4DCA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    highlight: true,
  },
  {
    number: '03',
    title: 'Business Acquisition Loans',
    desc: 'Buying an established business? We structure acquisition financing that bridges the gap between your down payment and the purchase price — getting the deal done.',
    href: '/business-acquisition-loans',
    tags: ['Acquisition Financing', 'Seller Finance Bridge', 'SBA-Style'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="16" width="32" height="24" rx="2" stroke="#7B2D8B" strokeWidth="2.5" />
        <path d="M16 16V12C16 9.791 17.791 8 20 8H28C30.209 8 32 9.791 32 12V16" stroke="#9B4DCA" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 28H40" stroke="#9B4DCA" strokeWidth="2" />
        <circle cx="24" cy="28" r="4" fill="#7B2D8B" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Working Capital for Businesses',
    desc: 'Keep your business moving with flexible working capital solutions. Whether it\'s a seasonal gap, an expansion, or day-to-day operations — we have the right product.',
    href: '/working-capital',
    tags: ['Lines of Credit', 'Term Loans', 'Cash Flow Solutions'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="16" stroke="#7B2D8B" strokeWidth="2.5" />
        <path d="M24 14V24L30 30" stroke="#9B4DCA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8L8 16" stroke="#7B2D8B" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <path d="M32 8L40 16" stroke="#7B2D8B" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" className="py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            What We Do
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-tight">
            Four Ways We
            <br />
            <span className="text-gradient">Fund Your Growth.</span>
          </h2>
          <p className="text-gray-400 text-lg mt-6 max-w-2xl">
            Every financing situation is different. We have dedicated expertise across four
            core areas — each with its own lender network and deal structure.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((s) => (
            <Link
              key={s.href}
              to={s.href}
              className={`group relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                s.highlight
                  ? 'bg-purple-600/10 border-purple-600/40 hover:border-purple-500/70'
                  : 'bg-[#111] border-[#1e1e1e] hover:border-purple-600/40 hover:bg-[#141414]'
              }`}
            >
              {s.highlight && (
                <span className="absolute top-4 right-4 text-xs font-bold text-purple-400 border border-purple-600/40 rounded-full px-3 py-1 uppercase tracking-widest">
                  Free Calculator
                </span>
              )}

              <div className="mb-5">{s.icon}</div>

              <div className="flex items-start gap-4 mb-3">
                <span className="text-4xl font-black text-[#222] group-hover:text-purple-600/20 transition-colors flex-shrink-0 leading-none">
                  {s.number}
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">
                  {s.title}
                </h3>
              </div>

              <p className="text-gray-400 leading-relaxed mb-5 ml-0">{s.desc}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {s.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-purple-400 border border-purple-600/30 rounded-full px-3 py-1 tracking-wide uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-purple-400 text-sm font-bold group-hover:gap-3 transition-all">
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
