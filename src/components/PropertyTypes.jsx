const PROPERTIES = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="20" width="40" height="24" rx="2" stroke="#7B2D8B" strokeWidth="2.5" />
        <rect x="8" y="26" width="8" height="10" rx="1" stroke="#9B4DCA" strokeWidth="2" />
        <rect x="20" y="26" width="8" height="10" rx="1" stroke="#9B4DCA" strokeWidth="2" />
        <rect x="32" y="26" width="8" height="10" rx="1" stroke="#9B4DCA" strokeWidth="2" />
        <path d="M2 20L24 6L46 20" stroke="#7B2D8B" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="18" y="34" width="12" height="10" rx="1" stroke="#9B4DCA" strokeWidth="2" />
      </svg>
    ),
    title: 'Plazas',
    desc: 'Strip malls and retail plazas with multiple tenants. We understand cap rates, anchor tenants, and the financing nuances that banks often miss.',
    tags: ['Strip Mall', 'Retail Plaza', 'Anchor Tenant'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="14" width="40" height="28" rx="2" stroke="#7B2D8B" strokeWidth="2.5" />
        <path d="M4 22h40" stroke="#9B4DCA" strokeWidth="2" />
        <rect x="10" y="28" width="6" height="8" rx="1" stroke="#9B4DCA" strokeWidth="2" />
        <rect x="32" y="26" width="10" height="4" rx="1" stroke="#9B4DCA" strokeWidth="1.5" />
        <path d="M4 14l8-8h24l8 8" stroke="#7B2D8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Warehouses',
    desc: 'Industrial and logistics properties. From cold storage to distribution centres, we secure financing tailored to industrial asset classes.',
    tags: ['Industrial', 'Distribution', 'Cold Storage'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="10" width="32" height="34" rx="2" stroke="#7B2D8B" strokeWidth="2.5" />
        <rect x="14" y="18" width="8" height="6" rx="1" stroke="#9B4DCA" strokeWidth="2" />
        <rect x="26" y="18" width="8" height="6" rx="1" stroke="#9B4DCA" strokeWidth="2" />
        <rect x="17" y="32" width="14" height="12" rx="1" stroke="#9B4DCA" strokeWidth="2" />
        <path d="M8 10L24 4L40 10" stroke="#7B2D8B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Storefronts',
    desc: 'Single and multi-unit retail storefronts in urban and suburban markets. Get the financing structure that maximizes your property\'s potential.',
    tags: ['Retail', 'Urban', 'Ground Floor'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="24" width="20" height="20" rx="2" stroke="#7B2D8B" strokeWidth="2.5" />
        <rect x="26" y="24" width="18" height="20" rx="2" stroke="#7B2D8B" strokeWidth="2.5" />
        <rect x="14" y="8" width="20" height="16" rx="2" stroke="#9B4DCA" strokeWidth="2.5" />
        <rect x="20" y="14" width="8" height="6" rx="1" stroke="#9B4DCA" strokeWidth="1.5" />
        <rect x="8" y="30" width="6" height="8" rx="1" stroke="#9B4DCA" strokeWidth="1.5" />
        <rect x="30" y="30" width="8" height="8" rx="1" stroke="#9B4DCA" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Mixed-Use',
    desc: 'Retail below, residential above. Mixed-use properties have unique financing needs — we have the lender relationships to make it work.',
    tags: ['Retail + Residential', 'Multi-Income', 'Urban Core'],
  },
]

export default function PropertyTypes() {
  return (
    <section id="properties" className="py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Property Types We Finance
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-tight">
            We Know Your
            <br />
            <span className="text-gradient">Property Type.</span>
          </h2>
          <p className="text-gray-400 text-lg mt-6 max-w-2xl">
            Commercial mortgage refinancing isn't one-size-fits-all. Each property class has its own
            lender requirements, DSCR thresholds, and rate structures. We know them all.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROPERTIES.map((prop) => (
            <div
              key={prop.title}
              className="group bg-[#111] border border-[#1e1e1e] hover:border-purple-600/50 rounded-2xl p-8 transition-all duration-300 hover:bg-[#141414]"
            >
              <div className="mb-5">{prop.icon}</div>
              <h3 className="text-2xl font-black text-white uppercase mb-3 tracking-tight">
                {prop.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-5">{prop.desc}</p>
              <div className="flex flex-wrap gap-2">
                {prop.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-purple-400 border border-purple-600/30 rounded-full px-3 py-1 tracking-wide uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
