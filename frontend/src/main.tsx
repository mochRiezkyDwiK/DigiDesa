import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import App from './App.tsx'
import './index.css'

function LayoutWithNav() {
  return (
    <>
      <App />
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