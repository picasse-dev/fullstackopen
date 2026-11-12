import Person2 from './Person2'

const Persons2 = ({ filteredPersons, handleDelete }) => (
  filteredPersons.map((person) => (
    <Person2
      key={person.id}
      id={person.id}
      name={person.name}
      number={person.number}
      handleDelete={handleDelete}
    />
  ))
)
export default Persons2