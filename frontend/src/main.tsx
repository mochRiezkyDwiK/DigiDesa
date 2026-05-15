import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import App from './App.tsx'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './index.css'

function LayoutWithNav() {
  const location = useLocation();
  const isDashboardWarga = location.pathname === '/dashboard-warga';

  return (
    <>
      {!isDashboardWarga && <Navbar />}
      <App />
      {!isDashboardWarga && <Footer />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <LayoutWithNav />
    </Router>
  </React.StrictMode>,
)