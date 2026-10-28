import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios'
import './index.css'

////Normal render
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

////Notes v1 
// const notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true
//   }
// ]
//ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)

//or...

////p2c - Axios and promises
////Notes v2 with axios, when the promise gets response then renders
// axios.get('http://localhost:3001/notes').then(response => {
//   const notes = response.data
//   console.log(notes)
//   ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
// })




///// original solo se importa createRoot, no todo reactDOM 
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(
//     document.getElementById('root')
// ).render(<StrictMode><App /></StrictMode>,)




