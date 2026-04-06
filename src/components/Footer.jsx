import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size={34} white />
            <p className="text-gray-500 text-sm leading-relaxed mt-5 max-w-sm">
              Helping commercial property owners across Canada refinance smarter for over 10 years.
              Specialists in plazas, warehouses, storefronts, and mixed-use properties.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="tel:6475248645"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium"
              >
                647-524-8645
              </a>
              <span className="text-gray-700">·</span>
              <a
                href="mailto:info@purpledotfinancial.com"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium"
              >
                info@purpledotfinancial.com
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-white font-bold text-xs tracking-widest uppercase mb-5">Services</p>
            <ul className="space-y-3">
              {[
                { label: 'Commercial Refinancing', id: 'services' },
                { label: 'Property Types', id: 'properties' },
                { label: 'Our Process', id: 'process' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="https://calendly.com/purpledotfinancial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Book a Consultation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-xs tracking-widest uppercase mb-5">Tools</p>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/commercial-refinancing#calculator"
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Refinance Calculator
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@purpledotfinancial.com"
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Get a Rate Quote
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a1a1a] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {year} Purple Dot Financial Inc. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs text-center">
            This calculator is for informational purposes only and does not constitute financial advice.
            Always consult a licensed mortgage professional before making financing decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}
