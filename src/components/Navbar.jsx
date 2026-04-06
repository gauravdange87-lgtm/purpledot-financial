import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const CALENDLY = 'https://calendly.com/purpledotfinancial/'

const SERVICES = [
  { label: 'Commercial Purchase Financing', href: '/commercial-purchase-financing' },
  { label: 'Commercial Refinancing', href: '/commercial-refinancing' },
  { label: 'Business Acquisition Loans', href: '/business-acquisition-loans' },
  { label: 'Working Capital', href: '/working-capital' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setServicesOpen(false)
  }, [location])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const scrollToContact = () => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      window.location.href = '/#contact'
      return
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1e1e1e]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <Logo size={36} white />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen((o) => !o)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer"
            >
              Services
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-[#111] border border-[#222] rounded-xl shadow-2xl overflow-hidden">
                <div className="p-2">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.href}
                      to={s.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-600/10 hover:text-white text-gray-400 text-sm font-medium transition-all duration-150 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600/50 group-hover:bg-purple-500 flex-shrink-0 transition-colors" />
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/commercial-refinancing#calculator"
            className="text-gray-400 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200"
          >
            Calculator
          </Link>

          <button
            onClick={scrollToContact}
            className="text-gray-400 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer"
          >
            Contact
          </button>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:6475248645" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
            647-524-8645
          </a>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-200 pulse-glow"
          >
            Book a Free Call
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-[#1e1e1e] px-6 py-6 flex flex-col gap-4">
          <button
            className="flex items-center justify-between text-gray-300 text-base font-medium w-full"
            onClick={() => setMobileServicesOpen((o) => !o)}
          >
            Services
            <svg className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileServicesOpen && (
            <div className="pl-4 flex flex-col gap-3 border-l border-purple-600/30">
              {SERVICES.map((s) => (
                <Link key={s.href} to={s.href} className="text-gray-400 hover:text-white text-sm transition-colors" onClick={() => setMenuOpen(false)}>
                  {s.label}
                </Link>
              ))}
            </div>
          )}
          <Link to="/commercial-refinancing#calculator" className="text-gray-300 text-base font-medium" onClick={() => setMenuOpen(false)}>
            Calculator
          </Link>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white font-bold py-3 rounded-lg mt-2 text-center block"
          >
            Book a Free Call
          </a>
        </div>
      )}
    </nav>
  )
}
