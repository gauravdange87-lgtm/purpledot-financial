import ServicePageLayout from '../components/ServicePageLayout'

const features = [
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Up to 90% Financing',
    desc: 'Acquisition loans covering up to 90% of the purchase price for qualified businesses.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    title: 'Seller Finance Bridge',
    desc: 'We structure deals where seller financing bridges the gap between bank financing and purchase price.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    title: 'Business Valuation Support',
    desc: 'We help you assess what the business is truly worth — so you don\'t overpay and the financing makes sense.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Multiple Loan Sources',
    desc: 'We access bank loans, BDC financing, credit union programs, and private capital — layered for the best outcome.',
  },
]

const process = [
  { title: 'Share the Deal', desc: 'Tell us about the business you\'re acquiring — industry, revenue, asking price, and your available down payment.' },
  { title: 'Structure Review', desc: 'We analyze the deal and identify the optimal financing structure — bank, seller carry, or a combination.' },
  { title: 'Lender Presentation', desc: 'We prepare a compelling lender package and approach the right institutions for your specific acquisition.' },
  { title: 'Deal Closes', desc: 'We coordinate through to closing so you can focus on taking ownership and running the business.' },
]

export default function BusinessAcquisition() {
  return (
    <ServicePageLayout
      badge="Business Acquisition Loans"
      headline={`FUND YOUR NEXT BUSINESS ACQUISITION.`}
      highlightedWord="BUSINESS ACQUISITION."
      subheadline="Buying an established business is one of the fastest paths to entrepreneurship. We structure the financing so the deal actually gets done."
      body={{
        heading: "Acquisition Financing That Gets Deals Done",
        copy: "Most business acquisitions fail to close not because of the business itself — but because the financing falls apart. We've structured hundreds of acquisition deals, and we know exactly how to position your file with lenders. Whether it's a franchise, a family-owned business, or a strategic bolt-on — we find a way to make it work.",
      }}
      features={features}
      process={process}
    />
  )
}
