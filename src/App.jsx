import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CommercialPurchase from './pages/CommercialPurchase'
import CommercialRefinancing from './pages/CommercialRefinancing'
import BusinessAcquisition from './pages/BusinessAcquisition'
import WorkingCapital from './pages/WorkingCapital'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/commercial-purchase-financing" element={<CommercialPurchase />} />
        <Route path="/commercial-refinancing" element={<CommercialRefinancing />} />
        <Route path="/business-acquisition-loans" element={<BusinessAcquisition />} />
        <Route path="/working-capital" element={<WorkingCapital />} />
      </Routes>
    </BrowserRouter>
  )
}
