// ==========================================
// 3. COUNTRY LIST COMPONENT 2.19
// ==========================================
import Country from './Country'
import {useState} from 'react'

const CountryList2 = ({ countries }) => {
  const [aux, setAux] = useState(Array(10).fill(0))

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    const showCountry = (i, name) => {
      setAux(aux.map((nombre, pos) => pos===i? name.toString() : nombre ))
    }
    console.log(aux)
    return (
      <ul>
        {countries.map((country, i) =>{
          return(
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={()=>showCountry(i, country.name.common)}>Show</button>
              {aux[i]===country.name.common && <Country country={country}/>}
            </li>
          )
        })}
      </ul>
    )
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return <p>No countries found</p>
}
export default CountryList2
