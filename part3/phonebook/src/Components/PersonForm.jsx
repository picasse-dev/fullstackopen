const PersonForm = ({
  onSubmit,
  valueName,
  onChangeName,
  valueNumber,
  onChangeNumber
}) => {
  return(
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="nameForm">Name: </label>
        <input 
          id="nameForm"
          type="text" 
          value={valueName}
          onChange={onChangeName}
          placeholder="new name"
          required
        />
      </div>

      <div>
        <label htmlFor="numberForm">Number: </label>
        <input 
          id="numberForm"
          type="tel"
          value={valueNumber}
          onChange={onChangeNumber}
          placeholder="new number"
          required
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
export default PersonForm