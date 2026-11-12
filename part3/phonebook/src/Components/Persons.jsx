import Person from './Person'

const Persons = ({ filteredPersons }) => (
  filteredPersons.map((person) => (
    <Person
      key={person.id}
      name={person.name}
      number={person.number}
    />
  ))
)
export default Persons