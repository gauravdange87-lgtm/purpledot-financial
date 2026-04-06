import { Link } from 'react-router-dom'

const CALENDLY = 'https://calendly.com/purpledotfinancial/'

export default function CTABanner() {
  return (
    <section className="py-24 bg-purple-600 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at right center, rgba(0,0,0,0.2) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-7xl font-black uppercase text-white leading-tight mb-6">
          Ready to Get
          <br />
          Financed?
        </h2>
        <p className="text-purple-100 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Book a free consultation with our team or use our refinance calculator to run the numbers yourself — no obligation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/commercial-refinancing#calculator"
            className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 font-black text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:bg-gray-100 group"
          >
            Run the Numbers Free
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:bg-white/10"
          >
            Book a Free Call
          </a>
        </div>
      </div>
    </section>
  )
}
