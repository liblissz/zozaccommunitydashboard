import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes } from 'react-router-dom'
import { Route } from 'lucide-react'

createRoot(document.getElementById('root')).render(
  <>
   <StrictMode>
   <App />
      
  </StrictMode>
 

  </>
)
