import ReactDOM from 'react-dom/client'
import App from './App'
ReactDOM.createRoot(
    document.getElementById('root')
).render(<App />)


/* original solo se importa create root, no todo reactDOM */
/*
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(
    document.getElementById('root')
).render(<StrictMode><App /></StrictMode>,)
*/