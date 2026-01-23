import React from 'react'
import ReactDOM from 'react-dom/client'
// Render Home as the new landing page
import Home from './Home';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
)
