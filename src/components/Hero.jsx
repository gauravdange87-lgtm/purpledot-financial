import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CYCLING_WORDS = [
  'PURCHASE FINANCING.',
  'REFINANCING.',
  'BUSINESS ACQUISITION.',
  'WORKING CAPITAL.',
]

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % CYCLING_WORDS.length)
        setVisible(true)
      }, 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-grid overflow-hidden">
      {/* Purple radial glows */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,45,139,0.18) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,45,139,0.1) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-purple-600/40 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">
            Commercial Finance Specialists · 10+ Years
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-4 uppercase">
          <span className="text-white">Commercial</span>
          <br />
          <span className="text-white">Financing.</span>
          <br />
          <span className="text-white">Done Right.</span>
        </h1>

        {/* Cycling subtitle */}
        <div className="mt-6 mb-8 h-16 flex items-center">
          <p className="text-2xl md:text-4xl font-bold text-gray-500 uppercase tracking-tight">
            Specialists in&nbsp;
            <span
              className="text-gradient inline-block transition-all duration-300"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
            >
              {CYCLING_WORDS[index]}
            </span>
          </p>
        </div>

        {/* Sub-copy */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          From acquiring your first commercial property to refinancing a portfolio of plazas —
          we structure the right financing for every stage of your real estate journey.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 glow-purple group"
          >
            Explore Our Services
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <a
            href="https://calendly.com/purpledotfinancial/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-gray-700 hover:border-purple-500/60 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:bg-white/5"
          >
            Book a Free Consultation
          </a>
        </div>

        {/* Trust bar */}
        <div className="mt-16 pt-10 border-t border-[#1e1e1e] flex flex-wrap gap-8 md:gap-16">
          {[
            { value: '10+', label: 'Years in Business' },
            { value: '$500M+', label: 'In Commercial Financing' },
            { value: '200+', label: 'Properties Funded' },
            { value: '4', label: 'Core Services' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-black text-gradient">{stat.value}</div>
              <div className="text-gray-500 text-sm font-medium mt-1 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-600 text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
