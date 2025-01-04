import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TrainerBookingApp from './TrainerBookingApp.jsx'
//import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrainerBookingApp />
  </StrictMode>,
)
