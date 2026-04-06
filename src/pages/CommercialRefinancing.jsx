import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ServicePageLayout from '../components/ServicePageLayout'
import WhyRefinance from '../components/WhyRefinance'
import RefinanceCalculatorEmbed from '../components/RefinanceCalculatorEmbed'

const features = [
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
    title: 'Lower Your Rate',
    desc: 'Access today\'s rates and potentially save thousands per year on your mortgage payments.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    title: 'Cash-Out Refinancing',
    desc: 'Pull equity from your property to fund renovations, acquisitions, or business needs.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    title: 'Improve DSCR',
    desc: 'A lower mortgage payment improves your Debt Service Coverage Ratio, strengthening your borrowing position.',
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    title: 'Lock In Stability',
    desc: 'Move from variable to fixed rate before rates move. We time the market with you.',
  },
]

const process = [
  { title: 'Run the Calculator', desc: 'Use our free tool below to see your monthly savings, break-even point, and total interest difference in 60 seconds.' },
  { title: 'Book a Call', desc: 'If the numbers look good, we review your mortgage documents, property details, and current lender relationship.' },
  { title: 'We Go to Market', desc: 'We approach our full lender network — banks, credit unions, and private lenders — to find the best offer for your property.' },
  { title: 'Close & Save', desc: 'We manage the full process to closing. You start saving from month one.' },
]

export default function CommercialRefinancing() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#calculator') {
      setTimeout(() => {
        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }, [location])

  return (
    <ServicePageLayout
      badge="Commercial Refinancing"
      headline={`IS YOUR COMMERCIAL MORTGAGE STILL WORKING FOR YOU?`}
      highlightedWord="WORKING FOR YOU?"
      subheadline="Rates have shifted. Your property has appreciated. Find out in 60 seconds whether refinancing puts more money back in your pocket."
      body={{
        heading: "Commercial Mortgage Refinancing That Makes Financial Sense",
        copy: "Most commercial property owners renew their mortgage on autopilot — with the same lender, at whatever rate they're offered. That's often thousands left on the table every year. We do the analysis, go to market on your behalf, and only recommend refinancing when the numbers genuinely work in your favour.",
      }}
      features={features}
      process={process}
    >
      <WhyRefinance />
      <RefinanceCalculatorEmbed />
    </ServicePageLayout>
  )
}
