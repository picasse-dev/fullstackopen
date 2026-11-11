/*
2.20*: Data for countries, step 3

Add to the view showing the data of a single country, the weather report for the capital of that country. There are dozens of providers for weather data. One suggested API is https://openweathermap.org. Note that it might take some minutes until a generated API key is valid.
weather report added feature

If you use Open weather map, here is the description for how to get weather icons.

NB: In some browsers (such as Firefox) the chosen API might send an error response, which indicates that HTTPS encryption is not supported, although the request URL starts with http://. This issue can be fixed by completing the exercise using Chrome.

NB: You need an api-key to use almost every weather service. Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an environment variable to save the key in this exercise. In real-life applications, it's considered insecure sending these keys directly from the browser, as anyone who can open the dev console would be able to intercept your keys! We will focus on implementing a separate backend in the next part of the course.

Assuming the api-key is 54l41n3n4v41m34rv0, when the application is started like so:

export VITE_SOME_KEY=54l41n3n4v41m34rv0 && npm run dev // For Linux/macOS Bash
($env:VITE_SOME_KEY="54l41n3n4v41m34rv0") -and (npm run dev) // For Windows PowerShell
set "VITE_SOME_KEY=54l41n3n4v41m34rv0" && npm run dev // For Windows cmd.exe
copy

you can access the value of the key from the import.meta.env object:

const api_key = import.meta.env.VITE_SOME_KEY
// variable api_key now has the value set in startup
copy

NB: To prevent accidentally leaking environment variables to the client, only variables prefixed with VITE_ are exposed to Vite.

Also remember that if you make changes to environment variables, you need to restart the development server for the changes to take effect.

This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the exercise submission system.
*/
/**/
import { useState, useEffect } from 'react'
import CountryFilter from './components/CountryFilter'
import CountryList2 from './components/CountryList2'
import countryService from './services/countryService'

const App = () => {

  const [data, setData] = useState([])
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchCountries = async () => {
      try {
        const countries = await countryService.getAll(controller.signal)
        setData(countries)

      } catch (error) {
        if (controller.signal.aborted) return

        console.error('Error fetching countries:', error)
        setError('Unable to retrieve countries from the server.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }

      }
    }

    fetchCountries()

    return () => controller.abort()
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const countries = data.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(value.trim().toLowerCase())
  )

  return (
    <>
      <CountryFilter
        value={value}
        onChange={handleChange}
      />

      {loading ? (
        <p>Loading countries...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <CountryList2 countries={countries} />
      )}
    </>
  )
}
export default App
/**/






































/*
2.19*: Data for countries, step 2

There is still a lot to do in this part, so don't get stuck on this exercise!

Improve on the application in the previous exercise, such that when the names of multiple countries are shown on the page there is a button next to the name of the country, which when pressed shows the view for that country:
attach show buttons for each country feature

In this exercise, it is also enough that your application works for most countries. Countries whose name appears in the name of another country, like Sudan, can be ignored.

*/
/*
import { useState, useEffect } from 'react'
import CountryFilter from './components/CountryFilter'
import CountryList2 from './components/CountryList2'
import countryService from './services/countryService'

const App = () => {

  const [data, setData] = useState([])
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchCountries = async () => {
      try {
        const countries = await countryService.getAll(controller.signal)
        setData(countries)

      } catch (error) {
        if (controller.signal.aborted) return

        console.error('Error fetching countries:', error)
        setError('Unable to retrieve countries from the server.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }

      }
    }

    fetchCountries()

    return () => controller.abort()
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const countries = data.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(value.trim().toLowerCase())
  )

  return (
    <>
      <CountryFilter
        value={value}
        onChange={handleChange}
      />

      {loading ? (
        <p>Loading countries...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <CountryList2 countries={countries} />
      )}
    </>
  )
}
export default App
/**/
/*
3. Comparación funcionamiento modulos
 Característica	   ES Modules	     CommonJS
Exportación	      export	        module.exports
Exportación       predeterminada	export default	module.exports
Importación	      import	        require()
Desestructuración	import { X }	  const { X } = require()
/**/


































/*
2.18* Data for countries, step 1

At https://studies.cs.helsinki.fi/restcountries/ you can find a service that offers a lot of information related to different countries in a so-called machine-readable format via the REST API. Make an application that allows you to view information from different countries.

The user interface is very simple. The country to be shown is found by typing a search query into the search field.

If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific:
too many matches screenshot

If there are ten or fewer countries, but more than one, then all countries matching the query are shown:
matching countries in a list screenshot

When there is only one country matching the query, then the basic data of the country (eg. capital and area), its flag and the languages spoken are shown:
flag and additional attributes screenshot

NB: It is enough that your application works for most countries. Some countries, like Sudan, can be hard to support since the name of the country is part of the name of another country, South Sudan. You don't need to worry about these edge cases.
*/
/*
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
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area} m2</p>
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
area number in m2 ex 1.192.168 m2

Object.values convierte un objeto en array pues .> countries[0].languages es un objeto que contiene varia data y no se puede .map //F*CKKK
console.dir('countries: ', countries)//.dir: Muestra el objeto con la jerarquia completa
*/

////Implementing the changes mentioned before:
/*
import { useState, useEffect } from 'react'
import CountryFilter from './components/CountryFilter'
import CountryList from './components/CountryList'
import countryService from './services/countryService'

const App = () => {

  const [data, setData] = useState([])
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchCountries = async () => {
      try {
        const countries = await countryService.getAll(controller.signal)
        setData(countries)

      } catch (error) {
        if (controller.signal.aborted) return

        console.error('Error fetching countries:', error)
        setError('Unable to retrieve countries from the server.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }

      }
    }

    fetchCountries()

    return () => controller.abort()
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const countries = data.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(value.trim().toLowerCase())
  )

  return (
    <>
      <CountryFilter
        value={value}
        onChange={handleChange}
      />

      {loading ? (
        <p>Loading countries...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <CountryList countries={countries} />
      )}
    </>
  )
}
export default App
/**/