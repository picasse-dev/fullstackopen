import { useState, useEffect } from 'react'
import axios from 'axios'

let renderCounter = 0
const App = () => {
  (console.log('render: ',renderCounter), renderCounter++)
  const [data, setData] = useState([])
  const [value, setValue] = useState('')

  useEffect(()=>{

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        console.log('Data: ', response.data)
        setData(response.data)
      })
      .catch(error => {
        console.log('No data received from server')
      })
  },[])
  
  const handleChange = (event) => setValue(event.target.value)
  
  
  const countries = data.filter(el =>
  el.name.common.toLowerCase().includes(value.trim().toLowerCase())
)

  console.log('value: ', value)
  console.log('countries: ', countries)

  return(
    <>
      <label htmlFor="input_1">find countries</label>
      <input 
        type="text" 
        id="input_1"
        value={value}
        onChange={handleChange}
        />
        {
          countries.length > 10 ? (
            <p>Too many matches, specify another filter</p> 
          ) : countries.length > 1 ? (
            countries.map(country => 
              <p key = {country.name.common}>{country.name.common}</p>
            ) 
          ) : countries.length === 1 ? (
            countries.map(country => 
              <div key = {country.name.common}>
                <h1>{country.name.common}</h1>
                <p>Capital {country.capital}</p>
                <p>Area {country.area} m2</p>
                <h2>Languages</h2>
                <ul>
                  {Object.values(country.languages).map((language, index) => 
                    <li key = {index}>{language}</li>
                  )}
                </ul>
                <img 
                  src={country.flags.png} 
                  alt={country.flags.alt} 
                  width="300"/>
              </div>
            )
          ) : <p>No countries found</p>
        }
    </>
  )
}
export default App
/*
mrds por hacer:
componetizar
modularizar
axioa service
fix useState([])
manejo errores

Object.values convierte un objeto en array pues .> countries[0].languages es un objeto que contiene varia data y no se puede .map //F*CKKK
console.dir('countries: ', countries)//.dir: Muestra el objeto con la jerarquia completa

*/
