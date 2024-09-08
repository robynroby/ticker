import './App.css'
import BuyTicket from './BuyTickect'
import Home from './Homepage'
import VerificationPage from './VerificationPage'
import VerifyTicket from './VerifyTickect'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Router>
        <div className="">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/verify-ticket" element={<VerifyTicket />} />
            <Route path="/buy-ticket" element={<BuyTicket />} />
            <Route path="/verification" element={<VerificationPage />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
