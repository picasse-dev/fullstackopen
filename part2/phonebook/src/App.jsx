/*
Exercises 2.12.-2.15.
2.12: The Phonebook step 7
Let's return to our phonebook application.

Currently, the numbers that are added to the phonebook are not saved to a backend server. Fix this situation.
*/
/**/
import { useState, useEffect } from 'react'
import Filter from './Components/Filter'
import PersonForm from './Components/PersonForm'
import Persons from './Components/Persons'
import axios from 'axios'


const normalizeNumber = (number) =>
  number.replace(/[\s-]/g, '')

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [word, setWord] = useState('')

  const baseUrl = 'http://localhost:3001/persons'
  useEffect(() => {
    axios
      .get(baseUrl)
      .then(res => 
        setPersons(res.data)
      )
  },[])
  
  const handleChangeName = (e) => setNewName(e.target.value)
  const handleChangeNumber = (e) => setNewNumber(e.target.value)
  const handleChangeWord = (e) => setWord(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) return

    const personExists = persons.some(person => 
      person.name.toLowerCase() === name.toLowerCase()
    )
      
    if (personExists) {
      alert(`${newName} is already added`)
      return
    }

    const numberExists = persons.some(person => 
        normalizeNumber(person.number) === normalizeNumber(number)
    )

    if (numberExists) {
      alert(`${number} is already added`)
      return
    }

    const newObject = {
        name, 
        number
      }

    axios
      .post(baseUrl, newObject)
      .then(response => {
        setPersons(prev =>
          [...prev, response.data]
        )
        setNewName('')
        setNewNumber('')
      })
  }

  const searchWord = word.trim().toLowerCase()

  const filteredPersons = persons.filter((el) => 
    el.name.toLowerCase().includes(searchWord))

  return (
    <>
      <h2>Phonebook</h2>

      <Filter value={word} onChange={handleChangeWord}/>

      <h2>Add a new</h2>

      <PersonForm
        onSubmit={handleSubmit}
        valueName={newName}
        onChangeName={handleChangeName}
        valueNumber={newNumber}
        onChangeNumber={handleChangeNumber}
      />

      <h2>Numbers</h2>

      <Persons filteredPersons={filteredPersons}/>
    </>
  )
}
export default App
/**/







































/*
Exercise 2.11.
2.11: The Phonebook Step 6
We continue with developing the phonebook. Store the initial state of the application in the file db.json, which should be placed in the root of the project.

{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
  ]
}
Start json-server on port 3001 and make sure that the server returns the list of people by going to the address http://localhost:3001/persons in the browser.

If you receive the following error message:

events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
it means that port 3001 is already in use by another application, e.g. in use by an already running json-server. Close the other application, or change the port in case that doesn't work.

Modify the application such that the initial state of the data is fetched from the server using the axios-library. Complete the fetching with an Effect hook.
*/
//Revisar si se puede simplificar
/*
import { useState, useEffect } from 'react'
import Filter from './Components/Filter'
import PersonForm from './Components/PersonForm'
import Persons from './Components/Persons'
import axios from 'axios'


const normalizeNumber = (number) =>
  number.replace(/[\s-]/g, '')

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [word, setWord] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(res => 
        setPersons(res.data)
      )
  },[])
  
  const handleChangeName = (e) => setNewName(e.target.value)
  const handleChangeNumber = (e) => setNewNumber(e.target.value)
  const handleChangeWord = (e) => setWord(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) return

    const personExists = persons.some(
        (person) => person.name.toLowerCase() === name.toLowerCase()
      )
      
    if (personExists) {
      alert(`${newName} is already added`)
      return
    }

    const numberExists = persons.some(
      (person) => 
        normalizeNumber(person.number) === normalizeNumber(number)
    )

    if (numberExists) {
      alert(`${number} is already added`)
      return
    }

    setPersons((prev) => [
      ...prev, 
      {
        name, 
        number, 
        id: prev.length > 0 ?
        Math.max(...prev.map( p => p.id)) + 1:
        1,
      }
    ])
    setNewName('')
    setNewNumber('')
  }

  const searchWord = word.trim().toLowerCase()

  const filteredPersons = persons.filter((el) => 
    el.name.toLowerCase().includes(searchWord))

  return (
    <>
      <h2>Phonebook</h2>

      <Filter value={word} onChange={handleChangeWord}/>

      <h2>Add a new</h2>

      <PersonForm
        onSubmit={handleSubmit}
        valueName={newName}
        onChangeName={handleChangeName}
        valueNumber={newNumber}
        onChangeNumber={handleChangeNumber}
      />

      <h2>Numbers</h2>

      <Persons filteredPersons={filteredPersons}/>
    </>
  )
}
export default App
/**/


































/*
2.10: The Phonebook Step 5
If you have implemented your application in a single component, refactor it by extracting suitable parts into new components. Maintain the application's state and all event handlers in the App root component.

It is sufficient to extract three components from the application. Good candidates for separate components are, for example, the search filter, the form for adding new people to the phonebook, a component that renders all people from the phonebook, and a component that renders a single person's details.

The application's root component could look similar to this after the refactoring. The refactored root component below only renders titles and lets the extracted components take care of the rest.

const App = () => {
  // ...

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter ... />

      <h3>Add a new</h3>

      <PersonForm 
        ...
      />

      <h3>Numbers</h3>

      <Persons ... />
    </div>
  )
}
NB: You might run into problems in this exercise if you define your components "in the wrong place". Now would be a good time to rehearse the chapter do not define a component in another component from the last part.
*/
/*
import { useState } from 'react'
import Filter from './Components/Filter'
import PersonForm from './Components/PersonForm'
import Persons from './Components/Persons'


const normalizeNumber = (number) =>
  number.replace(/[\s-]/g, '')

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [word, setWord] = useState('')
  
  const handleChangeName = (e) => setNewName(e.target.value)
  const handleChangeNumber = (e) => setNewNumber(e.target.value)
  const handleChangeWord = (e) => setWord(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) return

    const personExists = persons.some(
        (person) => person.name.toLowerCase() === name.toLowerCase()
      )
      
    if (personExists) {
      alert(`${newName} is already added`)
      return
    }

    const numberExists = persons.some(
      (person) => 
        normalizeNumber(person.number) === normalizeNumber(number)
    )

    if (numberExists) {
      alert(`${number} is already added`)
      return
    }

    setPersons((prev) => [
      ...prev, 
      {
        name, 
        number, 
        id: prev.length > 0 ?
        Math.max(...prev.map( p => p.id)) + 1:
        1,
      }
    ])
    setNewName('')
    setNewNumber('')
  }

  const searchWord = word.trim().toLowerCase()

  const filteredPersons = persons.filter((el) => 
    el.name.toLowerCase().includes(searchWord))

  return (
    <>
      <h2>Phonebook</h2>

      <Filter value={word} onChange={handleChangeWord}/>

      <h2>Add a new</h2>

      <PersonForm
        onSubmit={handleSubmit}
        valueName={newName}
        onChangeName={handleChangeName}
        valueNumber={newNumber}
        onChangeNumber={handleChangeNumber}
      />

      <h2>Numbers</h2>

      <Persons filteredPersons={filteredPersons}/>
    </>
  )
}
export default App
/**/
/*
F*CKKK
1)
const Person = ({ id, name, number }) =>
  <p key={id}>{id} {name} {number}</p>

La key sobra ahí. ¿Por qué? Porque React necesita la key en el elemento que se genera directamente dentro del .map(), y ese elemento ya la recibe desde Persons.

2) Los componentes van asi 
const Component = () => 
  logica
o así 
const Compoent = () => {
  logica
    return(
      <>
        jsx
      </>
    )
  }
pero nunca así
const Component = () => {
    logica
  }
porque?, pues porque las llaves siempre van con el return, no se va a renderizar eso y no da error WTF, queda uno medio loco la verdad

3) la key va en el componente o elemento que devuelve directamente el .map(), no dentro del componente hijo.

Aca sí
const Persons = ({ filteredPersons }) =>
  filteredPersons.map((el) =>
    <Person
      key={el.id}
      id={el.id}
      name={el.name}
      number={el.number}
    />
  )

Aca no wtfffff
const Person = ({ id, name, number }) =>
  <p key={id}>{id} {name} {number}</p>
La key sobra ahí. ¿Por qué? Porque React necesita la key en el elemento que se genera directamente dentro del .map(), y ese elemento ya la recibe desde Persons.

// ✅ Retorno implícito
const Person = () => <p>Hola</p>

// ❌ No devuelve el JSX
const Person = () => {
  <p>Hola</p>
}

// ✅ Retorno explícito
const Person = () => {
  return <p>Hola</p>
}
Esta es la mas WTF de todas para ser honesto, con los ()
const Persons = ({ filteredPersons }) => (
  filteredPersons.map((person) => (
    <Person
      key={person.id}
      name={person.name}
      number={person.number}
    />
  ))
)
/**/
/*
//Chat GPT solution for feedback, al parecer le salio mas corto y bonito...

import { useState } from 'react'

const initialPersons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
]

// Components

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with:{' '}
    <input value={value} onChange={onChange} />
  </div>
)


const PersonForm = ({
  name,
  number,
  onNameChange,
  onNumberChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={name} onChange={onNameChange} />
    </div>

    <div>
      number: <input value={number} onChange={onNumberChange} />
    </div>

    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
)

const Persons = ({ persons }) => (
  <div>
    {persons.map((person) => (
      <Person key={person.id} person={person} />
    ))}
  </div>
)

// App

const App = () => {
  const [persons, setPersons] = useState(initialPersons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) {
      return
    }

    const alreadyExists = persons.some(
      (person) => person.name.toLowerCase() === name.toLowerCase()
    )

    if (alreadyExists) {
      alert(`${name} is already added to phonebook`)
      return
    }

    const person = {
      id: Math.max(0, ...persons.map((person) => person.id)) + 1,
      name,
      number,
    }

    setPersons((previousPersons) => [...previousPersons, person])
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.trim().toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App
/**/












































/*
2.9*: The Phonebook Step 4
Implement a search field that can be used to filter the list of people by name:

2.9 search field
You can implement the search field as an input element that is placed outside the HTML form. The filtering logic shown in the image is case insensitive, meaning that the search term arto also returns results that contain Arto with an uppercase A.

NB: When you are working on new functionality, it's often useful to "hardcode" some dummy data into your application, e.g.

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  // ...
}
This saves you from having to manually input data into your application for testing out your new functionality.
/**/
/*
//LEGIBLE
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [word, setWord] = useState('')
  
  const handleChangeName = (e) => setNewName(e.target.value)
  const handleChangeNumber = (e) => setNewNumber(e.target.value)
  const handleChangeWord = (e) => setWord(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) return

    const personExists = persons.some(
        (person) => person.name.toLowerCase() === name.toLowerCase()
      )

    if (personExists) {
      alert(`${newName} is already added`)
      return
    }

    const numberExists = persons.some(
      (person) => person.number.replace(/[\s-]/g, '') === number.replace(/[\s-]/g, '')
    )

    if (numberExists) {
      alert(`${number} is already added`)
      return
    }

    setPersons((prev) => [
      ...prev, 
      {
        name, 
        number, 
        id: prev.length > 0 ?
        Math.max(...prev.map( p => p.id)) + 1:
        1,
      }
    ])
    setNewName('')
    setNewNumber('')
  }

  const searchWord = word.trim().toLowerCase()

  const filteredPersons = persons.filter((el) => 
    el.name.toLowerCase().includes(searchWord))

  return (
    <>
      <h2>Phonebook</h2>
      <p>Filter shown with:
        <input 
        type="text" 
        value={word}
        onChange={handleChangeWord}
        placeholder="search name"
        />
      </p>

      <h2>Add a new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name:
          <input
            type="text"
            value={newName}
            onChange={handleChangeName}
            placeholder="new name"
            required
          />
        </div>
        <div>
          number:
          <input
            type="tel"
            value={newNumber}
            onChange={handleChangeNumber}
            placeholder="000 000 0000"
            required
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {filteredPersons.map((el) => (<p key={el.id}>{el.id} {el.name} {el.number}</p>))}
    </>
  )
}
export default App
/**/
/*
F*CKKK
1. ¿Por qué Math.max(...prev.map(p => p.id)) lleva ...?
Mira primero qué devuelve cada parte.
Supongamos que prev contiene estos contactos:
const prev = [
  { name: "Arto", id: 1 },
  { name: "Ada", id: 2 },
  { name: "Dan", id: 3 }
]

Paso 1: ejecutamos prev.map(p => p.id).
prev.map(p => p.id) // [1, 2, 3]
map() devuelve un array con los IDs.

Paso 2: ¿qué espera Math.max()?
Math.max() recibe números como argumentos separados:
Math.max(1, 2, 3) // 3

Pero si le pasas directamente el array:
Math.max([1, 2, 3]) // NaN
¿Por qué? Porque Math.max() no está diseñado para recibir un array como argumento único.

Paso 3: aquí entra el operador ..., llamado spread operator.
Math.max(...[1, 2, 3])
JavaScript expande el array y lo convierte en argumentos separados, como si hubieras escrito:
Math.max(1, 2, 3) // 3

Por tanto:
Math.max(...prev.map(p => p.id)) + 1
Significa: obtener todos los IDs, encontrar el mayor y sumarle uno.
También podrías hacerlo sin ..., pero tendrías que buscar el máximo de otra forma, por ejemplo con un bucle.

2. ¿Por qué hay una coma después del 1?
Te refieres a esta parte:
id: prev.length > 0
  ? Math.max(...prev.map(p => p.id)) + 1
  : 1,

Esa coma es una coma final (trailing comma).
Se utiliza para separar las propiedades del objeto. En este caso, separaría id de cualquier propiedad que agregues después.

Por ejemplo, esto es válido:
const persona = {
  name: "Ada",
  number: "12345",
  id: 1,
}

Y esto también:
const persona = {
  name: "Ada",
  number: "12345",
  id: 1
}

//name y number es algo crazy
//name, number, WTFFFFFFFF
//name:{name}, number:{number}, asi le hacia yo todo noob
/**/






































/*
2.8: The Phonebook Step 3
Expand your application by allowing users to add phone numbers to the phone book. You will need to add a second input element to the form (along with its own event handler):

<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
At this point, the application could look something like this. The image also displays the application's state with the help of React developer tools:

2.8 sample screenshot
*/
/*
import { useState } from "react";

const App = () => {
  const [persona, setPersona] = useState([{ name: "arto hellas", number:"777-7777" }]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = newName.trim();
    const number = newNumber.trim().replace(/\s/g, "");

    if (name === "" || number === "") return;

    if (persona.some((obj) => obj.name === name) ) {
      alert(`${newName} is already added to phonebook :D`);
      setNewName("");
      return;
    }
    
    if (persona.some((obj) => obj.number === number) ){
      alert(`${newNumber} is already added to phonebook :D`);
      setNewNumber("");
      return;
    }

    setPersona((prev) => [...prev, { name:name, number:number }]);
    setNewName("");
    setNewNumber("");
  };

  const handleChangeName = (e) => {
    setNewName(e.target.value);
  };

  const handleChangeNumber = (e) => {
    setNewNumber(e.target.value);
  };

  return (
    <>
      <h2>Phonebook</h2>

      <form onSubmit={handleSubmit}>
        <div>
          name:
          <input
            type="text"
            value={newName}
            onChange={handleChangeName}
            placeholder="new name"
          />
        </div>
        <div>
          number:
          <input
            type="tel"
            value={newNumber}
            onChange={handleChangeNumber}
            placeholder="000 000 00 00"
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
        {persona.map((el) => (<p key={el.name}>{el.name} {el.number}</p>))}
    </>
  );
};
export default App;
/**/
/*
//F*CKKK crazy asignment

¡Exacto! 😂 En JavaScript, si la propiedad y la variable tienen el mismo nombre, puedes usar la sintaxis abreviada de propiedades.
setPersona((prev) => [...prev, { name, number }]);


Es equivalente a:
setPersona((prev) => [...prev, { name: name, number: number }]);


Ambas formas funcionan igual. ¡Menos código, misma funcionalidad!
/**/












































/*
2.7: The Phonebook Step 2
Prevent the user from being able to add names that already exist in the phonebook. JavaScript arrays have numerous suitable methods for accomplishing this task. Keep in mind how object equality works in Javascript.

Issue a warning with the alert command when such an action is attempted:

browser alert: "user already exists in the phonebook"
Hint: when you are forming strings that contain values from variables, it is recommended to use a template string:

`${newName} is already added to phonebook`
If the newName variable holds the value Arto Hellas, the template string expression returns the string

`Arto Hellas is already added to phonebook`
The same could be done in a more Java-like fashion by using the plus operator:

newName + ' is already added to phonebook'
Using template strings is the more idiomatic option and the sign of a true JavaScript professional.


*/
/*
import { useState } from "react";

const App = () => {
  const [persona, setPersona] = useState([{ name: "arto hellas" }]);
  const [newName, setNewName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() === "") return;
    if (persona.some((obj) => obj.name === newName.trim())) {
      alert(`${newName} is already added to phonebook :D`);
      setNewName("");
      return;
    }
    setPersona((prev) => [...prev, { name: newName.trim() }]);
    setNewName(""); 
  };

  const handleChange = (e) => {
    setNewName(e.target.value);
  };
  return (
    <>
      <h2>Phonebook</h2>

      <form onSubmit={handleSubmit}>
        <div>
          name:
          <input
            type="text"
            value={newName}
            onChange={handleChange}
            placeholder="new name"
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persona.map((el) => (
          <li key={el.name}>{el.name}</li>
        ))}
      </ul>
    </>
  );
};
export default App;
/**/
/*
//F*CKKK
Buscar un objeto dentro de un vector de objetos con some, no con includes
const vector = [
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" }
];
console.log(vector.includes({ id: 1, nombre: "Ana" })); // false

Aunque el objeto tenga los mismos datos, devuelve false porque es un objeto diferente en memoria.
La solución: usar .some()
Si quieres comprobar si existe un objeto con determinado id y obtener true o false:

const encontrado = vector.some(obj => obj.id === 1);
console.log(encontrado); // true
/**/













































/*
Exercises 2.6.-2.10.
In the first exercise, we will start working on an application that will be further developed in the later exercises. In related sets of exercises, it is sufficient to return the final version of your application. You may also make a separate commit after you have finished each part of the exercise set, but doing so is not required.

2.6: The Phonebook Step 1
Let's create a simple phonebook. In this part, we will only be adding names to the phonebook.

Let us start by implementing the addition of a person to the phonebook.

You can use the code below as a starting point for the App component of your application:

import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App
The newName state is meant for controlling the form input element.

Sometimes it can be useful to render state and other variables as text for debugging purposes. You can temporarily add the following element to the rendered component:

<div>debug: {newName}</div>
It's also important to put what we learned in the debugging React applications chapter of part one into good use. The React developer tools extension is incredibly useful for tracking changes that occur in the application's state.

After finishing this exercise your application should look something like this:

screenshot of 2.6 finished
Note the use of the React developer tools extension in the picture above!

NB:

you can use the person's name as a value of the key property
remember to prevent the default action of submitting HTML forms!
*/
/*
import { useState } from "react";

const App = () => {
  const [persona, setPersona] = useState([{ name: "arto hellas" }]);
  const [newName, setNewName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault()
    if(newName===''){return}
    else{
      setPersona((prev)=>[...prev,{name: newName}])
      setNewName('')
    }
  }
  const handleChange = (e) => {
    setNewName(e.target.value)
  }
  return (
    <>
      <h2>Phonebook</h2>

      <form action="" onSubmit={handleSubmit}>
        <div>name: 
          <input 
          type={'text'} 
          value={newName} 
          onChange={handleChange}
          placeholder='new name'/>
        </div>
        <div>
          <button type={"submit"}>add</button>
        </div>
      </form>
      
      <div>debug: {newName}</div>
      <h2>Numbers</h2>
      <ul>
        {persona.map((el, index) => 
          <li key={index}>{el.name}</li>
        )}
      </ul>
    </>
  );
};
export default App;
/**/
