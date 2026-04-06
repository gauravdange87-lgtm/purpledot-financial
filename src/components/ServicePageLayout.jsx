import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CTABanner from './CTABanner'
import ContactSection from './ContactSection'

const CALENDLY = 'https://calendly.com/purpledotfinancial/'

export default function ServicePageLayout({ badge, headline, highlightedWord, subheadline, body, features, process, children }) {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col justify-center bg-grid overflow-hidden pt-24">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(123,45,139,0.15) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-8">
            <Link to="/" className="hover:text-gray-400 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-500">{badge}</span>
          </div>

          <div className="inline-flex items-center gap-2 border border-purple-600/40 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">{badge}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-tight mb-6">
            {headline.split(highlightedWord).map((part, i, arr) => (
              <span key={i}>
                <span className="text-white">{part}</span>
                {i < arr.length - 1 && <span className="text-gradient">{highlightedWord}</span>}
              </span>
            ))}
          </h1>

          <p className="text-gray-400 text-xl max-w-2xl leading-relaxed mb-8">{subheadline}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 glow-purple group"
            >
              Book a Free Consultation
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="tel:6475248645"
              className="inline-flex items-center justify-center gap-2 border border-gray-700 hover:border-purple-500/60 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:bg-white/5"
            >
              Call 647-524-8645
            </a>
          </div>
        </div>
      </section>

      {/* About / body */}
      {body && (
        <section className="py-20 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">Overview</p>
                <h2 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight mb-6">{body.heading}</h2>
                <p className="text-gray-400 leading-relaxed text-lg">{body.copy}</p>
              </div>
              {features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((f) => (
                    <div key={f.title} className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5 hover:border-purple-600/30 transition-colors">
                      <div className="text-purple-500 mb-3">{f.icon}</div>
                      <h4 className="text-white font-bold mb-1">{f.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {children}

      {/* Process */}
      {process && (
        <section className="py-20 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">How It Works</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white">The Process</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, i) => (
                <div key={step.title}>
                  <div className="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-600/40 flex items-center justify-center mb-5">
                    <span className="text-purple-400 font-black text-sm">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
      <ContactSection />
      <Footer />
    </>
  )
}
