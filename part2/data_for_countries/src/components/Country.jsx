// ==========================================
// 2. COUNTRY COMPONENT (copias este para hacer el 2.20, creo que con solo este puede hacerse lo del weather)
// ==========================================

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital: {country.capital?.join(', ') || 'Unknown'}</p>

      <p>Area: {country.area?.toLocaleString()} km²</p>

      <h2>Languages</h2>

      <ul>
        {Object.entries(country.languages || {}).map(([code, language]) =>
          <li key={code}>{language}</li>
        )}
      </ul>

      <img
        src={country.flags.svg}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="300"
      />
    </div>
  )
}

export default Country