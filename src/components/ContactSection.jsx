import { useState } from 'react'
import { submitLead } from '../lib/submitLead'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', propertyType: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    submitLead({ form: 'contact', ...formData })
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(123,45,139,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Free Consultation
            </p>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-tight mb-6">
              Ready to
              <br />
              <span className="text-gradient">Stop Overpaying?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Book a free 20-minute call with our commercial mortgage team. No obligation.
              No pitch. Just honest advice on whether refinancing makes sense for your property.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  label: 'Phone',
                  value: '647-524-8645',
                  href: 'tel:6475248645',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: 'Email',
                  value: 'info@purpledotfinancial.com',
                  href: 'mailto:info@purpledotfinancial.com',
                },
              ].map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-purple-600/10 border border-purple-600/30 rounded-lg flex items-center justify-center">
                    {contact.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">{contact.label}</p>
                    <p className="text-white font-semibold group-hover:text-purple-400 transition-colors">{contact.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — Contact form */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">First Name</label>
                    <input
                      required
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={set('firstName')}
                      className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">Last Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={set('lastName')}
                      className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={set('email')}
                    className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="(416) 555-0000"
                    value={formData.phone}
                    onChange={set('phone')}
                    className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={set('propertyType')}
                    className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-600/60 transition-colors"
                  >
                    <option value="">Select property type</option>
                    <option>Plaza</option>
                    <option>Warehouse</option>
                    <option>Storefront</option>
                    <option>Mixed-Use</option>
                    <option>Other Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest block mb-2">Message (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your property and what you're looking for..."
                    value={formData.message}
                    onChange={set('message')}
                    className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/60 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="block w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-base py-4 rounded-xl transition-all duration-200 glow-purple text-center"
                >
                  Book My Free Consultation
                </button>
                <p className="text-gray-600 text-xs text-center">
                  No spam. No obligation. We typically respond within 2 business hours.
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-600/10 border border-purple-600/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">We'll Be In Touch!</h3>
                <p className="text-gray-400 mb-6">Our team will reach out within 2 business hours.</p>
                <a
                  href="https://calendly.com/purpledotfinancial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
                >
                  Or Book a Call Now
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
