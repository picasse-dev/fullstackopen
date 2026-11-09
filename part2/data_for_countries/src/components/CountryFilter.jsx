// ==========================================
// 4. COUNTRY FILTER COMPONENT
// ==========================================

const CountryFilter = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="input_1">Find countries: </label>

      <input
        type="text"
        id="input_1"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
export default CountryFilter