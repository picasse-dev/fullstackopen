// ==========================================
// 3. COUNTRY LIST COMPONENT
// ==========================================
import Country from './Country'

const CountryList = ({ countries }) => {

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country =>
          <li key={country.cca3}>
            {country.name.common}
          </li>
        )}
      </ul>
    )
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return <p>No countries found</p>
}
export default CountryList