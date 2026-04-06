import ServicePageLayout from '../components/ServicePageLayout'

const features = [
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    title: 'Lines of Credit',
    desc: 'Flexible revolving credit you draw from as needed — only pay interest on what you use.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    title: 'Term Loans',
    desc: 'Lump-sum financing for specific needs — equipment, inventory, expansion, or renovations.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Fast Access',
    desc: 'Some working capital products fund in as little as 24–48 hours after approval.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    title: 'No Real Estate Required',
    desc: 'Working capital solutions based on your business revenue and cash flow — not just collateral.',
  },
]

const process = [
  { title: 'Tell Us Your Need', desc: 'Share how much capital you need, what it\'s for, and your business\'s revenue and operating history.' },
  { title: 'Product Match', desc: 'We match you with the right product — line of credit, term loan, or short-term financing based on your profile.' },
  { title: 'Application & Approval', desc: 'We prepare your application and liaise with lenders. Most decisions come back within 24–72 hours.' },
  { title: 'Funds In Your Account', desc: 'Once approved, funds are typically disbursed within 1–3 business days.' },
]

export default function WorkingCapital() {
  return (
    <ServicePageLayout
      badge="Working Capital"
      headline={`THE CAPITAL YOUR BUSINESS NEEDS TO GROW.`}
      highlightedWord="GROW."
      subheadline="Cash flow gaps, expansion opportunities, seasonal swings — whatever the need, we connect you with the right working capital product, fast."
      body={{
        heading: "Working Capital Solutions Built Around Your Business",
        copy: "Revenue doesn't always align with expenses. Opportunities don't wait for your bank to process paperwork. We work with a wide network of commercial lenders, fintech platforms, and alternative capital providers to get your business funded — on terms that make sense for your cash flow, not just your balance sheet.",
      }}
      features={features}
      process={process}
    />
  )
}
