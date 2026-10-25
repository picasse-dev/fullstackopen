/**/
/**/
/**/
/**/
/**/
/**/
/**/
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

export default Appcopy
The newName state is meant for controlling the form input element.

Sometimes it can be useful to render state and other variables as text for debugging purposes. You can temporarily add the following element to the rendered component:

<div>debug: {newName}</div>copy
It's also important to put what we learned in the debugging React applications chapter of part one into good use. The React developer tools extension is incredibly useful for tracking changes that occur in the application's state.

After finishing this exercise your application should look something like this:

screenshot of 2.6 finished
Note the use of the React developer tools extension in the picture above!

NB:

you can use the person's name as a value of the key property
remember to prevent the default action of submitting HTML forms!
*/
import { useState } from "react";

const App = () => {
  const [persona, setPersona] = useState([{ name: "arto hellas" }]);
  const [newName, setNewName] = useState("");

  return (
    <>
      <h2>Phonebook</h2>

      <form action="">
        <div>
          name: <input />
        </div>
        <div>
          <button type={"submit"}>add</button>
        </div>
      </form>

      <h2>Numbers</h2>
    </>
  );
};
export default App;
