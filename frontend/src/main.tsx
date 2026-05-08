import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import App from './App.tsx'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './index.css'

function Layout() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <App />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Layout />
    </Router>
  </React.StrictMode>,
)