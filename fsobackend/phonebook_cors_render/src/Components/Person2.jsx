const Person2 = ({ name, number, handleDelete, id }) => (
  <p>
    {name} — {number}
    <button onClick = {() => handleDelete(id)}>Delete</button>
  </p>
)
export default Person2