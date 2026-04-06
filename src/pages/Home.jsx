import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServicesGrid from '../components/ServicesGrid'
import PropertyTypes from '../components/PropertyTypes'
import ProcessSection from '../components/ProcessSection'
import CTABanner from '../components/CTABanner'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesGrid />
      <PropertyTypes />
      <ProcessSection />
      <CTABanner />
      <ContactSection />
      <Footer />
    </>
  )
}
