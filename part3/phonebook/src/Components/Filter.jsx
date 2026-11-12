const Filter = ({value, onChange}) => {
  return (
    <div>
      <label htmlFor="filterID">Filter shown with:</label>
      <input
        id="filterID"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search name"
      />
    </div>
  )
}
export default Filter