import ServicePageLayout from '../components/ServicePageLayout'
import PropertyTypes from '../components/PropertyTypes'

const features = [
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Up to 75% LTV',
    desc: 'Competitive loan-to-value ratios on commercial properties across all asset classes.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Competitive Rates',
    desc: 'Access to 50+ commercial lenders — banks, credit unions, and private lenders.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    title: 'Flexible Terms',
    desc: '5 to 25-year amortization, fixed and variable rate options available.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: 'Fast Closings',
    desc: 'Streamlined process with dedicated support from application to closing.',
  },
]

const process = [
  { title: 'Initial Consultation', desc: 'We review your target property, financial position, and purchase goals to identify the right lenders.' },
  { title: 'Lender Matching', desc: 'We approach our network of 50+ lenders to find the best rate and terms for your specific property and profile.' },
  { title: 'Application & Approval', desc: 'We prepare and submit your application package, managing back-and-forth with the lender on your behalf.' },
  { title: 'Close & Fund', desc: 'Once approved, we coordinate with your lawyer to ensure a smooth closing. You get the keys.' },
]

export default function CommercialPurchase() {
  return (
    <ServicePageLayout
      badge="Commercial Purchase Financing"
      headline={`BUY YOUR NEXT COMMERCIAL PROPERTY. THE RIGHT WAY.`}
      highlightedWord="COMMERCIAL PROPERTY."
      subheadline="Whether you're acquiring your first plaza or adding a warehouse to your portfolio, we structure the purchase financing that gets the deal done."
      body={{
        heading: "Purchase Financing Built for Commercial Real Estate",
        copy: "Buying a commercial property is different from residential. Lenders look at income, occupancy, DSCR, and the property's potential — not just your personal credit. We know how to position your file to get approval and the best possible rate. Our relationships span major banks, credit unions, insurance companies, and private lenders across Canada.",
      }}
      features={features}
      process={process}
    >
      <PropertyTypes />
    </ServicePageLayout>
  )
}
