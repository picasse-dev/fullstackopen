/**/
/**/
/**/
/**/
/**/
/**/

/**/
/**/
/**/

/**/
/**/
/**/

/**/
/**/
/**/

/**/
/**/
/**/

/**/
/**/
/**/


/**/
/**/
/**/

/**/
/**/
/**/

/**/
/**/
/**/

/**/
/**/
/**/

/*
Promises and Errors
If our application allowed users to delete notes, we could end up in a situation where a user tries to change the importance of a note that has already been deleted from the system.

Let's simulate this situation by making the getAll function of the note service return a "hardcoded" note that does not actually exist on the backend server:

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}copy
When we try to change the importance of the hardcoded note, we see the following error message in the console. The error says that the backend server responded to our HTTP PUT request with a status code 404 not found.

404 not found error in dev tools
The application should be able to handle these types of error situations gracefully. Users won't be able to tell that an error has occurred unless they happen to have their console open. The only way the error can be seen in the application is that clicking the button does not affect the note's importance.

We had previously mentioned that a promise can be in one of three different states. When an axios HTTP request fails, the associated promise is rejected. Our current code does not handle this rejection in any way.

The rejection of a promise is handled by providing the then method with a second callback function, which is called in the situation where the promise is rejected.

The more common way of adding a handler for rejected promises is to use the catch method.

In practice, the error handler for rejected promises is defined like this:

axios
  .get('http://example.com/probably_will_fail')
  .then(response => {
    console.log('success!')
  })
  .catch(error => {
    console.log('fail')
  })copy
If the request fails, the event handler registered with the catch method gets called.

The catch method is often utilized by placing it deeper within the promise chain.

When multiple .then methods are chained together, we are in fact creating a promise chain:

axios
  .get('http://...')
  .then(response => response.data)
  .then(data => {
    // ...
  })copy
The catch method can be used to define a handler function at the end of a promise chain, which is called once any promise in the chain throws an error and the promise becomes rejected.

axios
  .get('http://...')
  .then(response => response.data)
  .then(data => {
    // ...
  })
  .catch(error => {
    console.log('fail')
  })copy
Let's take advantage of this feature. We will place our application's error handler in the App component:

const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })
    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
}copy
The error message is displayed to the user with the trusty old alert dialog popup, and the deleted note gets filtered out from the state.

Removing an already deleted note from the application's state is done with the array filter method, which returns a new array comprising only the items from the list for which the function that was passed as a parameter returns true for:

notes.filter(n => n.id !== id)copy
It's probably not a good idea to use alert in more serious React applications. We will soon learn a more advanced way of displaying messages and notifications to users. There are situations, however, where a simple, battle-tested method like alert can function as a starting point. A more advanced method could always be added in later, given that there's time and energy for it.

The code for the current state of our application can be found in the part2-6 branch on GitHub.
*/
/*
import { useState, useEffect } from 'react'
import Note2 from './components/Note2'//USING NOTE2.JSX
import noteService from './services/notes'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportance = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note =>
           note.id === id ? 
           returnedNote : 
           note))
    })
  }
  
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => setNewNote(event.target.value)
  
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note2 key={note.id} note={note} fun={() => toggleImportance(note.id)}/>
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default App
/**/










































/*
Cleaner Syntax for Defining Object Literals
The module defining note-related services currently exports an object with the properties getAll, create, and update that are assigned to functions for handling notes.

The module definition was:

import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}copy
The module exports the following, rather peculiar looking, object:

{ 
  getAll: getAll, 
  create: create, 
  update: update 
}copy
The labels to the left of the colon in the object definition are the keys of the object, whereas the ones to the right of it are variables that are defined inside the module.

Since the names of the keys and the assigned variables are the same, we can write the object definition with a more compact syntax:

{ 
  getAll, 
  create, 
  update 
}copy
As a result, the module definition gets simplified into the following form:

import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update }
copy
In defining the object using this shorter notation, we make use of a new feature that was introduced to JavaScript through ES6, enabling a slightly more compact way of defining objects using variables.

To demonstrate this feature, let's consider a situation where we have the following values assigned to variables:

const name = 'Leevi'
const age = 0copy
In older versions of JavaScript we had to define an object like this:

const person = {
  name: name,
  age: age
}copy
However, since both the property fields and the variable names in the object are the same, it's enough to simply write the following in ES6 JavaScript:

const person = { name, age }copy
The result is identical for both expressions. They both create an object with a name property with the value Leevi and an age property with the value 0.
*/
/**/
//Just changed notes.js to a more cleaner syntax for defining object literals
/**/
//Aprovecho para modularizar aqui mi TO DO APP
/*
import { useState, useEffect } from 'react'
import axios from 'axios'
import activities from './services/activities'

const App = () => {
  const [activities, setActivities] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/activities')
      .then(res => setActivities(res.data))
    },[])
    
  const changeTask = (event) => setNewTask(event.target.value)
    
  const handleSubmit = (event) => {
    event.preventDefault()

    if(!newTask.trim())return
    const newActivity = {task:newTask, done:false}
    axios
      .post('http://localhost:3001/activities', newActivity)
      .then(res => {
        setActivities(prev => 
          [...prev,res.data]
        )
        setNewTask('')
      })
  }

  const changeCheck = (id) => {
    const activity = activities.find(obj => obj.id === id)
    const updatedActivity = {...activity, done: !activity.done}
    axios
      .patch(`http://localhost:3001/activities/${id}`,
        { done: updatedActivity.done }
      )
      .then(res => 
        setActivities(prev => 
          prev.map((obj) =>
            obj.id === activity.id ?
            res.data :
            obj
          )
        )
      )
  }

  const deleteActivity = (id) => {
    axios
      .delete(`http://localhost:3001/activities/${id}`)
      .then(res => 
        setActivities(prev =>
          prev.filter(obj => 
            obj.id !== res.data.id)
        )
      )
  }

  const editActivity = (id) => console.log('isEditing')


  return(
    <>
    <h1>To Do</h1>
    
    <form onSubmit={handleSubmit}>
      <input type="text" value={newTask} onChange={changeTask} />
      <button type='submit'>Add</button>
    </form>

    <br></br>

    <table>
      <thead>
        <tr>
          <th>Table</th>
          <th>Done</th>
        </tr>
      </thead>
      <tbody>
          {activities.map((activity) => 
          <tr key={activity.id}>
            <td>{activity.task}</td>
            <td><input 
              type="checkbox" 
              checked={activity.done} 
              onChange={() => changeCheck(activity.id)}/>
            </td>
            <td>
              <button onClick={() => deleteActivity(activity.id)}>Delete</button>
            </td>
            <td>
              <button onClick={() => editActivity(activity.id)}>Edit</button>
            </td>
          </tr>)}
      </tbody>
    </table>
    
    </>
  )
}
export default App
//Modularizar componentes, axios
/**/
//OLD CHAT GPT CORRECTION TO DO APP V1
/** */
import { useEffect, useRef, useState } from 'react';

function TaskItem({ task, onEdit, onDelete }) {
  return (
    <li>
      <span>{task.title}</span>{' '}

      <button
        type="button"
        onClick={() => onEdit(task)}
        aria-label={`Editar tarea: ${task.title}`}
      >
        Editar
      </button>{' '}

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Eliminar tarea: ${task.title}`}
      >
        Eliminar
      </button>
    </li>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const inputRef = useRef(null);
  const isEditing = editingTaskId !== null;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    if (isEditing) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title: trimmedTitle }
            : task
        )
      );
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
      };

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);
    }

    cancelEditing();
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setTitle('');
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );

    if (editingTaskId === id) {
      cancelEditing();
    }
  };

  return (
    <main>
      <h1>Lista de tareas</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="task-title">
          {isEditing ? 'Editar tarea ' : 'Nueva tarea '}
        </label>

        <input
          ref={inputRef}
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Escribe una tarea..."
          maxLength={200}
        />

        <button type="submit">
          {isEditing ? 'Guardar cambios' : 'Agregar tarea'}
        </button>

        {isEditing && (
          <button type="button" onClick={cancelEditing}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Tareas ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p>No hay tareas todavía. ¡Agrega la primera!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={startEditing}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
/**/



































/*
Extracting Communication with the Backend into a Separate Module
The App component has become somewhat bloated after adding the code for communicating with the backend server. In the spirit of the single responsibility principle, we deem it wise to extract this communication into its own module.

Let's create a src/services directory and add a file there called notes.js:

import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}copy
The module returns an object that has three functions (getAll, create, and update) as its properties that deal with notes. The functions directly return the promises returned by the axios methods.

The App component uses import to get access to the module:

import noteService from './services/notes'

const App = () => {copy
The functions of the module can be used directly with the imported variable noteService as follows:

const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id === id ? response.data : note))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  // ...
}

export default Appcopy
We could take our implementation a step further. When the App component uses the functions, it receives an object that contains the entire response for the HTTP request:

noteService
  .getAll()
  .then(response => {
    setNotes(response.data)
  })copy
The App component only uses the response.data property of the response object.

The module would be much nicer to use if, instead of the entire HTTP response, we would only get the response data. Using the module would then look like this:

noteService
  .getAll()
  .then(initialNotes => {
    setNotes(initialNotes)
  })copy
We can achieve this by changing the code in the module as follows (the current code contains some copy-paste, but we will tolerate that for now):

import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}copy
We no longer return the promise returned by axios directly. Instead, we assign the promise to the request variable and call its then method:

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}copy
The last row in our function is simply a more compact expression of the same code as shown below:

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => {
    return response.data
  })
}copy
The modified getAll function still returns a promise, as the then method of a promise also returns a promise.

After defining the parameter of the then method to directly return response.data, we have gotten the getAll function to work like we wanted it to. When the HTTP request is successful, the promise returns the data sent back in the response from the backend.

We have to update the App component to work with the changes made to our module. We have to fix the callback functions given as parameters to the noteService object's methods so that they use the directly returned response data:

const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  // ...
}copy
This is all quite complicated and attempting to explain it may just make it harder to understand. The internet is full of material discussing the topic, such as this one.

The "Async and performance" book from the You do not know JS book series explains the topic well, but the explanation is many pages long.

Promises are central to modern JavaScript development and it is highly recommended to invest a reasonable amount of time into understanding them.
*/
/*
import { useState, useEffect } from 'react'
import Note2 from './components/Note2'//USING NOTE2.JSX
import noteService from './services/notes'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportance = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note =>
           note.id === id ? 
           returnedNote : 
           note))
    })
  }
  
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => setNewNote(event.target.value)
  
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note2 key={note.id} note={note} fun={() => toggleImportance(note.id)}/>
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default App
/**/





































/*
Changing the Importance of Notes
Let's add a button to every note that can be used for toggling its importance.

We make the following changes to the Note component:

const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}copy
We add a button to the component and assign its event handler as the toggleImportance function passed in the component's props.

The App component defines an initial version of the toggleImportanceOf event handler function and passes it to every Note component:

const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
  }

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      // ...
    </div>
  )
}copy
Notice how every note receives its own unique event handler function since the id of every note is unique.

E.g., if note.id is 3, the event handler function returned by toggleImportance(note.id) will be:

() => { console.log('importance of 3 needs to be toggled') }copy
A short reminder here. The string printed by the event handler is defined in a Java-like manner by adding the strings:

console.log('importance of ' + id + ' needs to be toggled')copy
The template string syntax added in ES6 can be used to write similar strings in a much nicer way:

console.log(`importance of ${id} needs to be toggled`)copy
We can now use the "dollar-bracket"-syntax to add parts to the string that will evaluate JavaScript expressions, e.g. the value of a variable. Note that we use backticks in template strings instead of quotation marks used in regular JavaScript strings.

Individual notes stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL. We can either replace the entire note with an HTTP PUT request or only change some of the note's properties with an HTTP PATCH request.

The final form of the event handler function is the following:

const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(note => note.id === id ? response.data : note))
  })
}copy
Almost every line of code in the function body contains important details. The first line defines the unique URL for each note resource based on its id.

The array find method is used to find the note we want to modify, and we then assign it to the note variable.

After this, we create a new object that is an exact copy of the old note, apart from the important property that has the value flipped (from true to false or from false to true).

The code for creating the new object that uses the object spread syntax may seem a bit strange at first:

const changedNote = { ...note, important: !note.important }copy
In practice, { ...note } creates a new object with copies of all the properties from the note object. When we add properties inside the curly braces after the spread object, e.g. { ...note, important: true }, then the value of the important property of the new object will be true. In our example, the important property gets the negation of its previous value in the original object.

There are a few things to point out. Why did we make a copy of the note object we wanted to modify when the following code also appears to work?

const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...copy
This is not recommended because the variable note is a reference to an item in the notes array in the component's state, and as we recall we must never mutate state directly in React.

It's also worth noting that the new object changedNote is only a so-called shallow copy, meaning that the values of the new object are the same as the values of the old object. If the values of the old object were objects themselves, then the copied values in the new object would reference the same objects that were in the old object.

The new note is then sent with a PUT request to the backend where it will replace the old object.

The callback function sets the component's notes state to a new array that contains all the items from the previous notes array, except for the old note which is replaced by the updated version of it returned by the server:

axios.put(url, changedNote).then(response => {
  setNotes(notes.map(note => note.id === id ? response.data : note))
})copy
This is accomplished with the map method:

notes.map(note => note.id === id ? response.data : note)copy
The map method creates a new array by mapping every item from the old array into an item in the new array. In our example, the new array is created conditionally so that if note.id === id is true; the note object returned by the server is added to the array. If the condition is false, then we simply copy the item from the old array into the new array instead.

This map trick may seem a bit strange at first, but it's worth spending some time wrapping your head around it. We will be using this method many times throughout the course.
*/
/*
import { useState, useEffect } from 'react'
import axios from 'axios'
import Note2 from './components/Note2'
//USING NOTE2.JSX

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then((response) => {
        console.log('promise fulfilled')
        setNotes(response.data)
    })
  }, [])
  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
    console.log('axios.post')
    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        (console.log('response status created: ',response), console.log('response.data: ',response.data))
        setNotes(prev => prev.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => setNewNote(event.target.value)
  
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const toggleImportance = id => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    axios.put(url, changedNote).then(response => {
      setNotes(notes.map(note => note.id === id ? response.data : note)) //Aquí utilizas notes, que viene del estado capturado cuando se creó o ejecutó la función. Si ocurren varias actualizaciones muy seguidas, podrías trabajar con un valor desactualizado es mejor prev=>prev.map etc.
    })
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note2 key={note.id} note={note} fun={() => toggleImportance(note.id)}/>
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default App
/**/
/*
//PUT VS PATCH, put manda todo el objeto, patch solo la propiedad del objeto a cambiar, ambas devuelven todo el objeto que se modifico. F*CKKK 6647

const toggleImportance = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(note => note.id === id ? response.data : note)) //Aquí utilizas notes, que viene del estado capturado cuando se creó o ejecutó la función. Si ocurren varias actualizaciones muy seguidas, podrías trabajar con un valor desactualizado.
  })
}

const toggleImportance = (id) => {
  const note = notes.find(n => n.id === id)

  axios
    .patch(`http://localhost:3001/notes/${id}`, {
      important: !note.important
    })
    .then(response => {
      setNotes(prev =>
        prev.map(n => n.id === id ? response.data : n)
      )
    })
}

////Ahora... pasarle todo el objeto notes a toggleImportance no es tan buena practica?

Opción A: pasar solo el id (la que tienes ahora y es mejor)
const toggleImportanceOf = (id) => {
  const note = notes.find(n => n.id === id)
  // ...
}

La llamas así:
<Note
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>

Ventajas:
- Pasas un dato pequeño y concreto.
- La función busca la nota en el estado que tiene disponible.
- La interfaz queda desacoplada de la lógica que actualiza los datos.
Es perfectamente válida para el ejercicio de Full Stack Open.

Opción B: pasar la nota completa
const toggleImportanceOf = (note) => {
  const changedNote = {
    ...note,
    important: !note.important
  }

  // petición Axios...
}

La llamada sería:
<Note
  note={note}
  toggleImportance={() => toggleImportanceOf(note)}
/>

También es válida. De hecho, tiene una ventaja: no necesitas buscar la nota con find() porque ya la recibes.

Pero hay un detalle: la nota recibida puede estar desactualizada si el estado ha cambiado desde que se creó esa referencia. Para una aplicación sencilla no suele ser un problema, pero es algo que conviene tener presente.
/**/































/*
Altering data in server
When creating notes in our application, we would naturally want to store them in some backend server. The json-server package claims to be a so-called REST or RESTful API in its documentation:

Get a full fake REST API with zero coding in less than 30 seconds (seriously)

The json-server does not exactly match the description provided by the textbook definition of a REST API, but neither do most other APIs claiming to be RESTful.

We will take a closer look at REST in the next part of the course. But it's important to familiarize ourselves at this point with some of the conventions used by json-server and REST APIs in general. In particular, we will be taking a look at the conventional use of routes, aka URLs and HTTP request types, in REST.



REST
In REST terminology, we refer to individual data objects, such as the notes in our application, as resources. Every resource has a unique address associated with it - its URL. According to a general convention used by json-server, we would be able to locate an individual note at the resource URL notes/3, where 3 is the id of the resource. The notes URL, on the other hand, would point to a resource collection containing all the notes.

Resources are fetched from the server with HTTP GET requests. For instance, an HTTP GET request to the URL notes/3 will return the note that has the id number 3. An HTTP GET request to the notes URL would return a list of all notes.

Creating a new resource for storing a note is done by making an HTTP POST request to the notes URL according to the REST convention that the json-server adheres to. The data for the new note resource is sent in the body of the request.

json-server requires all data to be sent in JSON format. What this means in practice is that the data must be a correctly formatted string and that the request must contain the Content-Type request header with the value application/json.



Sending Data to the Server
Let's make the following changes to the event handler responsible for creating a new note:

const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
    })
}copy
We create a new object for the note but omit the id property since it's better to let the server generate ids for our resources.

The object is sent to the server using the axios post method. The registered event handler logs the response that is sent back from the server to the console.

When we try to create a new note, the following output pops up in the console:

data json output in console
The newly created note resource is stored in the value of the data property of the response object.

Quite often it is useful to inspect HTTP requests in the Network tab of Chrome developer tools, which was used heavily at the beginning of part 0.

We can use the inspector to check that the headers sent in the POST request are what we expected them to be:

dev tools header shows 201 created for localhost:3001/notes
Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate application/json value for the Content-Type header.

The tab payload can be used to check the request data:

devtools payload tab shows content and important fields from above
Also the tab response is useful, it shows what was the data the server responded with:

devtools response tab shows same content as payload but with id field too
The new note is not rendered to the screen yet. This is because we did not update the state of the App component when we created it. Let's fix this:

const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() > 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
}copy
The new note returned by the backend server is added to the list of notes in our application's state in the customary way of using the setNotes function and then resetting the note creation form. An important detail to remember is that the concat method does not change the component's original state, but instead creates a new copy of the list.

Once the data returned by the server starts to have an effect on the behavior of our web applications, we are immediately faced with a whole new set of challenges arising from, for instance, the asynchronicity of communication. This necessitates new debugging strategies, console logging and other means of debugging become increasingly more important. We must also develop a sufficient understanding of the principles of both the JavaScript runtime and React components. Guessing won't be enough.

It's beneficial to inspect the state of the backend server, e.g. through the browser:

JSON data output from backend
This makes it possible to verify that all the data we intended to send was actually received by the server.

In the next part of the course, we will learn to implement our own logic in the backend. We will then take a closer look at tools like Postman that helps us to debug our server applications. However, inspecting the state of the json-server through the browser is sufficient for our current needs.

The code for the current state of our application can be found in the part2-5 branch on GitHub.
*/
/*
import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then((response) => {
        console.log('promise fulfilled')
        setNotes(response.data)
    })
  }, [])
  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
    console.log('axios.post')
    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        (console.log('response status created: ',response), console.log('response.data: ',response.data))
        setNotes(prev => prev.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => setNewNote(event.target.value)
  
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default App
/**/
////CONTENT TYPE Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate application/json value for the Content-Type header. JSON
/*
En un header HTTP, Content-Type indica qué tipo de contenido estás enviando en el cuerpo (body) de una petición o respuesta. Hay varios valores posibles, dependiendo de si envías JSON, texto, archivos, imágenes, etc.

1. Tipos de Content-Type más comunes
Content-Type	¿Para qué sirve?	Ejemplo
application/json	Enviar datos JSON a una API	{"name":"Sebastián"}
application/x-www-form-urlencoded	Enviar datos de formularios como pares clave-valor	name=Sebastian&age=25
multipart/form-data	Subir archivos y enviar campos de formulario	Imagen + nombre
text/plain	Enviar texto sin formato especial	Hola mundo
text/html	Enviar documentos HTML	<h1>Hola</h1>
text/css	Enviar hojas de estilos CSS	body { color: red; }
text/javascript	Enviar código JavaScript	console.log("Hola")
application/xml	Enviar datos XML	<user><name>Ana</name></user>
application/pdf	Enviar un documento PDF	Archivo PDF
application/octet-stream	Enviar datos binarios genéricos	Archivo binario
image/jpeg	Enviar una imagen JPEG	Fotografía
image/png	Enviar una imagen PNG	Imagen con transparencia
image/webp	Enviar una imagen WebP	Imagen optimizada
audio/mpeg	Enviar audio MP3	Archivo de audio
video/mp4	Enviar video MP4	Archivo de video

2. Ejemplos en peticiones HTTP
Enviar JSON a una API
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "Sebastián",
  "age": 25
}


Enviar un formulario tradicional
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

username=sebas&password=12345


Subir una imagen
POST /upload HTTP/1.1
Host: example.com
Content-Type: multipart/form-data; boundary=----abc123


En este último caso, el cliente normalmente genera el boundary automáticamente. Por ejemplo, con JavaScript y FormData, no debes establecer manualmente el Content-Type, porque el navegador necesita incluir ese separador.

3. ¿Qué otros headers HTTP deberías conocer?
No debes confundir Content-Type con otros headers. Estos son algunos de los más importantes:
Header	Función
Accept	Indica qué formatos de respuesta acepta el cliente.
Authorization	Envía credenciales o tokens de autenticación.
Content-Length	Indica el tamaño del cuerpo en bytes.
Content-Encoding	Indica si el cuerpo está comprimido, por ejemplo con gzip.
Cache-Control	Define reglas de almacenamiento en caché.
User-Agent	Identifica al cliente que realiza la petición.
Origin	Indica el origen de una petición, relevante para CORS.
Cookie	Envía cookies al servidor.

4. Diferencia entre Content-Type y Accept
Esta distinción es especialmente importante al desarrollar APIs con JavaScript, Node.js o Express.
POST /api/users HTTP/1.1
Content-Type: application/json
Accept: application/json


- Content-Type: application/json: estoy enviando JSON al servidor.
- Accept: application/json: quiero que el servidor me responda con JSON.

Son independientes: puedes enviar JSON y solicitar una respuesta en otro formato, si el servidor lo admite.

Consejo para Full Stack Open: al trabajar con APIs REST, normalmente usarás Content-Type: application/json y Accept: application/json. En fetch(), recuerda que el header Content-Type no convierte automáticamente un objeto JavaScript en JSON: debes serializarlo con JSON.stringify().
fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    name: "Sebastián"
  })
});


Ten presente que Content-Type describe el cuerpo de la petición o respuesta, no el tipo de petición HTTP: GET, POST, PUT, PATCH y DELETE son métodos HTTP.
/**/
























/*
Exercise 2.11.
*/





















/*
The development runtime environment
The configuration for the whole application has steadily grown more complex. Let's review what happens and where. The following image describes the makeup of the application

diagram of composition of react app
The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the React dev server, which is the application that runs after running the command npm run dev. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We'll discuss the dev-server in more detail in part 7 of the course.

The React application running in the browser fetches the JSON formatted data from json-server running on port 3001 on the machine. The server we query the data from - json-server - gets its data from the file db.json.

At this point in development, all the parts of the application happen to reside on the software developer's machine, otherwise known as localhost. The situation changes when the application is deployed to the internet. We will do this in part 3.
*/
/**/
/**/

























/*
Effect-hooks
We have already used state hooks that were introduced along with React version 16.8.0, which provide state to React components defined as functions - the so-called functional components. Version 16.8.0 also introduces effect hooks as a new feature. As per the official docs:

Effects let a component connect to and synchronize with external systems. This includes dealing with network, browser DOM, animations, widgets written using a different UI library, and other non-React code.

As such, effect hooks are precisely the right tool to use when fetching data from a server.

Let's remove the fetching of data from main.jsx. Since we're going to be retrieving the notes from the server, there is no longer a need to pass data as props to the App component. So main.jsx can be simplified to:

import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);copy
The App component changes as follows:

import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  // ...
}copy
We have also added a few helpful prints, which clarify the progression of the execution.

This is printed to the console:

render 0 notes
effect
promise fulfilled
render 3 notescopy
First, the body of the function defining the component is executed and the component is rendered for the first time. At this point render 0 notes is printed, meaning data hasn't been fetched from the server yet.

The following function, or effect in React parlance:

() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}copy
is executed immediately after rendering. The execution of the function results in effect being printed to the console, and the command axios.get initiates the fetching of data from the server as well as registers the following function as an event handler for the operation:

response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})copy
When data arrives from the server, the JavaScript runtime calls the function registered as the event handler, which prints promise fulfilled to the console and stores the notes received from the server into the state using the function setNotes(response.data).

As always, a call to a state-updating function triggers the re-rendering of the component. As a result, render 3 notes is printed to the console, and the notes fetched from the server are rendered to the screen.

Finally, let's take a look at the definition of the effect hook as a whole:

useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])copy
Let's rewrite the code a bit differently.

const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])copy
Now we can see more clearly that the function useEffect takes two parameters. The first is a function, the effect itself. According to the documentation:

By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.

So by default, the effect is always run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render.

The second parameter of useEffect is used to specify how often the effect is run. If the second parameter is an empty array [], then the effect is only run along with the first render of the component.

There are many possible use cases for an effect hook other than fetching data from the server. However, this use is sufficient for us, for now.

Think back to the sequence of events we just discussed. Which parts of the code are run? In what order? How often? Understanding the order of events is critical!

Note that we could have also written the code for the effect function this way:

useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])copy
A reference to an event handler function is assigned to the variable eventHandler. The promise returned by the get method of Axios is stored in the variable promise. The registration of the callback happens by giving the eventHandler variable, referring to the event-handler function, as an argument to the then method of the promise. It isn't usually necessary to assign functions and promises to variables, and a more compact way of representing things, as seen below, is sufficient.

useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])copy
We still have a problem with our application. When adding new notes, they are not stored on the server.

The code for the application, as described so far, can be found in full on github, on branch part2-4.

The development runtime environment
The configuration for the whole application has steadily grown more complex. Let's review what happens and where. The following image describes the makeup of the application

diagram of composition of react app
The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the React dev server, which is the application that runs after running the command npm run dev. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We'll discuss the dev-server in more detail in part 7 of the course.

The React application running in the browser fetches the JSON formatted data from json-server running on port 3001 on the machine. The server we query the data from - json-server - gets its data from the file db.json.

At this point in development, all the parts of the application happen to reside on the software developer's machine, otherwise known as localhost. The situation changes when the application is deployed to the internet. We will do this in part 3.
*/
/*
//UseEfeect
import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(()=>{
    axios
      .get('http://localhost:3001/notes')
      .then( (response) => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  },[])
  console.log(notes)

  // const hook = () => {
  //   console.log('effect')
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then((response) => {
  //       console.log('promise fulfilled')
  //       setNotes(response.data)
  //     })
  // }
  // useEffect(hook, [])
  //console.log(notes)

  // useEffect(() => {
  //   console.log('effect')

  //   const eventHandler = response => {
  //     console.log('promise fulfilled')
  //     setNotes(response.data)
  //   }

  //   const promise = axios.get('http://localhost:3001/notes')
  //   promise.then(eventHandler)//The registration of the callback happens by giving the eventHandler variable, referring to the event-handler function, as an argument to the then method of the promise
  // },[])
  // console.log(notes)

  const addNote = (event) => {
    event.preventDefault()

    if(newNote === ''){return}
    else{
      const noteObject = {
        content: newNote,
        important: Math.random() < 0.5,id: 
        String(notes.length + 1),}
      setNotes(notes.concat(noteObject))
      setNewNote('')
    }
  }

  const handleNoteChange = event => setNewNote(event.target.value)

  const notesToShow = showAll
    ? notes
    : notes.filter(el => el.important === true)

  return(
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll((prev) => !prev) }>show {showAll ? 'important' : 'all'}</button>
      <ul>
        {notesToShow.map((el)=>
          <Note key={el.id} note={el}></Note>
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} placeholder='a new note...'/>
        <button type="submit">save</button>
      </form> 
    </div>
  )
}
export default App
/**/
/*
//// Los 3 metodos para actualizar estado Array con objetos F*CKKK 6647
Método	                  ¿Funciona?	¿Modifica el array original?
[...users, nuevo]	        Sí	        No
users.concat(nuevo)	      Sí	        No
prev => [...prev, nuevo]	Sí(Mejor) 	No

Qué debes recordar para trabajar en React:
- ... Toma un array y devuelve: a,b,c,d,e,
- ...array → copiar los elementos de un array.
- [...prev, nuevo] → agregar al final.
- [nuevo, ...prev] → agregar al principio.
- concat(nuevo) → crear otro array con elementos adicionales.
- map() → transformar o actualizar elementos.
- filter() → eliminar elementos según una condición.
- Evita push(), pop(), splice() y otros métodos mutables directamente sobre el estado.

La idea fundamental es tratar el estado como inmutable: crear un nuevo array cuando necesites cambiarlo, en vez de modificar el que ya existe.

1. Cuando SÍ usar prev => ...
Úsala cuando necesites consultar el estado anterior para calcular el siguiente.

Agregar un objeto
setUsers(prev => [...prev, newUser]);

Eliminar un objeto
setUsers(prev => prev.filter(user => user.id !== id));

Modificar un objeto
setUsers(prev =>
  prev.map(user =>
    user.id === id
      ? { ...user, name: "Pedro" }
      : user
  )
);

Alternar un booleano
setIsOpen(prev => !prev);

En todos estos casos, el resultado depende del valor anterior del estado.

/**/
//SAME CODE BUT ADDING NOTES IN SERVER AXIOS.POST
/*
import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios.get('http://localhost:3001/notes').then((response) => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
  }, [])
  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
    console.log('axios.post')
    axios.post('http://localhost:3001/notes', noteObject)
      .then(response => {
        (console.log('response status created: ',response), console.log('response.data: ',response.data))
        setNotes(prev => prev.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => setNewNote(event.target.value)
  
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App
/**/
//EX TO DO APP BASIC
/*
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [activities, setActivities] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/activities')
      .then(res => setActivities(res.data))
  },[])
  
  const changeTask = (event) => setNewTask(event.target.value)
  const changeCheck = (activity) => {
    const updatedActivity = {...activity, done: !activity.done}
    axios
      .patch(`http://localhost:3001/activities/${activity.id}`,
        { done: updatedActivity.done }
      )
      .then(res => 
        setActivities(prev => 
          prev.map((obj) =>
            obj.id === activity.id ?
            res.data :
            obj
          )
        )
      )
  }

  const deleteActivity = (activity) => 
    axios
      .delete(`http://localhost:3001/activities/${activity.id}`)
      .then(res => 
        setActivities(prev =>
          prev.filter(obj => 
            obj.id !== activity.id)
        )
      )

  const handleSubmit = (event) => {
    event.preventDefault()

    if(!newTask.trim())return
    const newActivity = {task:newTask, done:false}
    axios
      .post('http://localhost:3001/activities', newActivity)
      .then(res => 
        setActivities(prev => 
          [...prev,res.data]//prev.concat(response.data) opcion 2
          //should put the "setNewTask('')" here ? yes
        )
      )
    setNewTask('')
  }

  return(
    <>
    <h1>To Do</h1>
    
    <form onSubmit={handleSubmit}>
      <input type="text" value={newTask} onChange={changeTask} />
      <button type='submit'>Add</button>
    </form>

    <br></br>

    <table>
      <thead>
        <tr>
          <th>Table</th>
          <th>Done</th>
        </tr>
      </thead>
      <tbody>
          {activities.map((activity) => 
          <tr key={activity.id}>
            <td>{activity.task}</td>
            <td><input 
              type="checkbox" 
              checked={activity.done} 
              onChange={() => changeCheck(activity)}/>
            </td>
            <td>
              <button onClick={() => deleteActivity(activity)}>Delete</button>
            </td>
          </tr>)}
      </tbody>
    </table>
    
    </>
  )
}
export default App
/**/
////ChatGPT enterprise correction del EX TO DO APP BASIC WTF O.o
/*

import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3001/activities'

const App = () => {
  const [activities, setActivities] = useState([])
  const [newTask, setNewTask] = useState('')

  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [busyActivityId, setBusyActivityId] = useState(null)
  const [error, setError] = useState('')

  // Obtener las actividades al montar el componente
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(API_URL)
        setActivities(response.data)
      } catch (err) {
        setError('No se pudieron cargar las actividades.')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  // Crear una actividad
  const handleSubmit = async (event) => {
    event.preventDefault()

    const task = newTask.trim()

    if (!task || creating) return

    setCreating(true)
    setError('')

    try {
      const response = await axios.post(API_URL, {
        task,
        done: false,
      })

      setActivities((prev) => [...prev, response.data])
      setNewTask('')
    } catch (err) {
      setError('No se pudo crear la actividad. Inténtalo de nuevo.')
    } finally {
      setCreating(false)
    }
  }

  // Cambiar el estado de una actividad
  const changeCheck = async (activity) => {
    if (busyActivityId !== null) return

    setBusyActivityId(activity.id)
    setError('')

    try {
      const response = await axios.patch(
        `${API_URL}/${activity.id}`,
        { done: !activity.done }
      )

      setActivities((prev) =>
        prev.map((item) =>
          item.id === activity.id ? response.data : item
        )
      )
    } catch (err) {
      setError('No se pudo actualizar la actividad.')
    } finally {
      setBusyActivityId(null)
    }
  }

  // Eliminar una actividad
  const deleteActivity = async (activity) => {
    if (busyActivityId !== null) return

    setBusyActivityId(activity.id)
    setError('')

    try {
      await axios.delete(`${API_URL}/${activity.id}`)

      setActivities((prev) =>
        prev.filter((item) => item.id !== activity.id)
      )
    } catch (err) {
      setError('No se pudo eliminar la actividad.')
    } finally {
      setBusyActivityId(null)
    }
  }

  return (
    <main>
      <h1>To Do</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="new-task">Nueva actividad</label>

        <input
          id="new-task"
          type="text"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="Ej. Hacer ejercicio"
          disabled={creating}
        />

        <button type="submit" disabled={creating || !newTask.trim()}>
          {creating ? 'Añadiendo...' : 'Añadir'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Cargando actividades...</p>
      ) : activities.length === 0 ? (
        <p>No hay actividades todavía. ¡Añade la primera!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Actividad</th>
              <th scope="col">Completada</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((activity) => {
              const isBusy = busyActivityId === activity.id

              return (
                <tr key={activity.id}>
                  <td>{activity.task}</td>

                  <td>
                    <input
                      type="checkbox"
                      checked={Boolean(activity.done)}
                      onChange={() => changeCheck(activity)}
                      disabled={busyActivityId !== null}
                      aria-label={`Marcar ${activity.task} como completada`}
                    />
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => deleteActivity(activity)}
                      disabled={busyActivityId !== null}
                      aria-label={`Eliminar ${activity.task}`}
                    >
                      {isBusy ? 'Procesando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </main>
  )
}
export default App
/**/






































/*
Axios and promises
Now we are ready to use Axios. Going forward, json-server is assumed to be running on port 3001.

NB: To run json-server and your react app simultaneously, you may need to use two terminal windows. One to keep json-server running and the other to run our React application.

The library can be brought into use the same way other libraries, i.e., by using an appropriate import statement.

Add the following to the file main.jsx:

import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)copy
If you open http://localhost:5173/ in the browser, this should be printed to the console

promises printed to console
Axios' method get returns a promise.

The documentation on Mozilla's site states the following about promises:

A Promise is an object representing the eventual completion or failure of an asynchronous operation.

In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:

The promise is pending: It means that the asynchronous operation corresponding to the promise has not yet finished and the final value is not available yet.
The promise is fulfilled: It means that the operation has been completed and the final value is available, which generally is a successful operation.
The promise is rejected: It means that an error prevented the final value from being determined, which generally represents a failed operation.
There are many details related to promises, but understanding these three states is sufficient for us for now. If you want, you can read more about promises in Mozilla's documentation.

The first promise in our example is fulfilled, representing a successful axios.get('http://localhost:3001/notes') request. The second one, however, is rejected, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.

If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method then:

const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})copy
The following is printed to the console:

json object data printed to console
The JavaScript runtime environment calls the callback function registered by the then method providing it with a response object as a parameter. The response object contains all the essential data related to the response of an HTTP GET request, which would include the returned data, status code, and headers.

Storing the promise object in a variable is generally unnecessary, and it's instead common to chain the then method call to the axios method call, so that it follows it directly:

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})copy
The callback function now takes the data contained within the response, stores it in a variable, and prints the notes to the console.

A more readable way to format chained method calls is to place each call on its own line:

axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })copy
The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is application/json; charset=utf-8 (see the previous image) using the content-type header.

We can finally begin using the data fetched from the server.

Let's try and request the notes from our local server and render them, initially as the App component. Please note that this approach has many issues, as we're rendering the entire App component only when we successfully retrieve a response:

import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})copy
This method could be acceptable in some circumstances, but it's somewhat problematic. Let's instead move the fetching of the data into the App component.

What's not immediately obvious, however, is where the command axios.get should be placed within the component.
*/
/*
import { useState } from 'react'
import Note from './components/Note'
import axios from 'axios'

////Axios
//axios.get return a promise
//A Promise is an object representing the eventual completion or failure of an asynchronous operation. States: pending/fulfilled/rejected

//// State fulfilled
//   axios
//    .get('http://localhost:3001/notes')
//    .then(response => {
//      const notes = response.data
//      console.log(notes)
//   })

////Stated rejected
//const promise2 = axios.get('http://localhost:3001/foobar')
//console.log(promise2)


const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault()

    if(newNote === ''){return}
    else{
      const noteObject = {content: newNote,important: Math.random() < 0.5,id: String(notes.length + 1),}
      setNotes(notes.concat(noteObject))
      setNewNote('')
    }
  }

  const handleNoteChange = (event) => setNewNote(event.target.value)

  const notesToShow = showAll
    ? notes
    : notes.filter(el => el.important === true)

  return(
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll((prev) => !prev) }>show {showAll ? 'important' : 'all'}</button>
      <ul>
        {notesToShow.map((el)=>
          <Note key={el.id} note={el}></Note>
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} placeholder='a new note...'/>
        <button type="submit">save</button>
      </form> 
    </div>
  )
}
export default App
/**/

































/*
npm
Let's get back to the topic of fetching data from the server.

We could use the previously mentioned promise-based function fetch to pull the data from the server. Fetch is a great tool. It is standardized and supported by all modern browsers (excluding IE).

That being said, we will be using the axios library instead for communication between the browser and server. It functions like fetch but is somewhat more pleasant to use. Another good reason to use Axios is that it helps us get familiar with adding external libraries, or npm packages, to React projects.

Nowadays, practically all JavaScript projects are defined using the node package manager, aka npm. The projects created using Vite also follow the npm format. A clear indicator that a project uses npm is the package.json file located at the root of the project:

{
  "name": "part2-notes-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "vite": "^6.0.5"
  }
}copy
At this point, the dependencies part is of most interest to us as it defines what dependencies, or external libraries, the project has.

We now want to use axios. Theoretically, we could define the library directly in the package.json file, but it is better to install it from the command line.

npm install axioscopy
NB npm-commands should always be run in the project root directory, which is where the package.json file can be found.

Axios is now included among the other dependencies:

{
  "name": "part2-notes-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  // ...
}copy
In addition to adding axios to the dependencies, the npm install command also downloaded the library code. As with other dependencies, the code can be found in the node_modules directory located in the root. As one might have noticed, node_modules contains a fair amount of interesting stuff.

Let's make another addition. Install json-server as a development dependency (only used during development) by executing the command:

npm install json-server --save-devcopy
and making a small addition to the scripts part of the package.json file:

{
  // ... 
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "server": "json-server -p 3001 db.json"
  },
}copy
We can now conveniently, without parameter definitions, start the json-server from the project root directory with the command:

npm run servercopy
We will get more familiar with the npm tool in the third part of the course.

NB The previously started json-server must be terminated before starting a new one; otherwise, there will be trouble:

cannot bind to port 3001 error
The red print in the error message informs us about the issue:

Cannot bind to port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file

As we can see, the application is not able to bind itself to the port. The reason being that port 3001 is already occupied by the previously started json-server.

We used the command npm install twice, but with slight differences:

npm install axios
npm install json-server --save-devcopy
There is a fine difference in the parameters. axios is installed as a runtime dependency of the application because the execution of the program requires the existence of the library. On the other hand, json-server was installed as a development dependency (--save-dev), since the program itself doesn't require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course.
*/
/**/
////Json server F*CKKK 6647
//1) npm install json-server --save-dev
//2) in packager.json/scripts add:  
//   "server": "json-server -p 3001 db.json"
//   db.json created in the root dir, and fill with json lol
//3) npm run server
// http://localhost:3001/notes

// or the one use sintex not installing:
// 1, 2 y 3) en un solo comando seria
// npx json-server --port 3001 db.json (Pero esta no la vamos a usar)

//4) Ah y tambien instalamos axios:
//   npm install axios
/**/
































/*
The browser as a runtime environment
Our first task is fetching the already existing notes to our React application from the address http://localhost:3001/notes.

In the part0 example project, we already learned a way to fetch data from a server using JavaScript. The code in the example was fetching the data using XMLHttpRequest, otherwise known as an HTTP request made using an XHR object. This is a technique introduced in 1999, which every browser has supported for a good while now.

The use of XHR is no longer recommended, and browsers already widely support the fetch method, which is based on so-called promises, instead of the event-driven model used by XHR.

As a reminder from part0 (which one should remember to not use without a pressing reason), data was fetched using XHR in the following way:

const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // handle the response that is saved in variable data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()copy
Right at the beginning, we register an event handler to the xhttp object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the xhttp object changes. If the change in state means that the response to the request has arrived, then the data is handled accordingly.

It is worth noting that the code in the event handler is defined before the request is sent to the server. Despite this, the code within the event handler will be executed at a later point in time. Therefore, the code does not execute synchronously "from top to bottom", but does so asynchronously. JavaScript calls the event handler that was registered for the request at some point.

A synchronous way of making requests that's common in Java programming, for instance, would play out as follows (NB, this is not actually working Java code):

HTTPRequest request = new HTTPRequest();

String url = "https://studies.cs.helsinki.fi/exampleapp/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});copy
In Java, the code executes line by line and stops to wait for the HTTP request, which means waiting for the command request.get(...) to finish. The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner.

In contrast, JavaScript engines, or runtime environments follow the asynchronous model. In principle, this requires all IO operations (with some exceptions) to be executed as non-blocking. This means that code execution continues immediately after calling an IO function, without waiting for it to return.

When an asynchronous operation is completed, or, more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.

Currently, JavaScript engines are single-threaded, which means that they cannot execute code in parallel. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.

One consequence of JavaScript engines being single-threaded is that if code execution takes a long time, the browser becomes unresponsive for the duration of the execution. If the following code is added to the beginning of the App component:

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  setTimeout(() => {
    console.log('loop..')
    let i = 0
    while (i < 99999999999) {
      i++
    }
    console.log('end')
  }, 5000)

  // ...
}copy
everything works normally for five seconds. When the function defined as the parameter of setTimeout is executed, the browser page becomes unresponsive for the duration of the long loop. The page freezes completely, meaning you cannot click its buttons or use any other functionality.

For the browser to remain responsive, i.e., to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long.

There is a host of additional material on the subject to be found on the internet. One particularly clear presentation of the topic is the keynote by Philip Roberts called What the heck is the event loop anyway?

In today's browsers, it is possible to run parallelized code with the help of so-called web workers. The event loop of an individual browser window is, however, still only handled by a single thread.
*/
/*
import { useState } from 'react'
import Note from './components/Note'
console.log('Imports')

const App = (props) => {
  console.log('App')
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  console.log('settimeout')
  setTimeout(() => {
    console.log('loop..')
    let i = 0
    while (i < 9) {
      i++
      console.log(i)
    }
    console.log('end')
  }, 5000)

  console.log('functions')
  const addNote = (event) => {
    event.preventDefault()

    if(newNote === ''){return}
    else{
      const noteObject = {content: newNote,important: Math.random() < 0.5,id: String(notes.length + 1),}
      setNotes(notes.concat(noteObject))
      setNewNote('')
    }
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(el => el.important === true)

  console.log('return')
  return(
    <div>
      {console.log('return div')}
      <h1>Notes</h1>
      <button onClick={() => setShowAll((prev) => !prev) }>show {showAll ? 'important' : 'all'}</button>
      <ul>
        {notesToShow.map((el)=>
          <Note key={el.id} note={el}></Note>
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} placeholder='a new note...'/>
        <button type="submit">save</button>
      </form>   

    {console.log('end divs')}
    </div>
  )
}
console.log('export')
export default App
console.log('after export')
/**/






























/*
C
Getting data from server
For a while now we have only been working on "frontend", i.e. client-side (browser) functionality. We will begin working on "backend", i.e. server-side functionality in the third part of this course. Nonetheless, we will now take a step in that direction by familiarizing ourselves with how the code executing in the browser communicates with the backend.

Let's use a tool meant to be used during software development called JSON Server to act as our server.

Create a file named db.json in the root directory of the previous notes project with the following content:

{
  "notes": [
    {
      "id": "1",
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": "2",
      "content": "Browser can execute only JavaScript",
      "important": false
    },
    {
      "id": "3",
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    }
  ]
}
You can start the JSON Server without a separate installation by running the following npx command in the root directory of the application:

npx json-server --port 3001 db.json
The JSON Server starts running on port 3000 by default, but we will now define an alternate port 3001. Let's navigate to the address http://localhost:3001/notes in the browser. We can see that JSON Server serves the notes we previously wrote to the file in JSON format:

notes on json format in the browser at localhost:3001/notes
If your browser doesn't have a way to format the display of JSON-data, then install an appropriate plugin, e.g. JSONView to make your life easier.

Going forward, the idea will be to save the notes to the server, which in this case means saving them to the json-server. The React code fetches the notes from the server and renders them to the screen. Whenever a new note is added to the application, the React code also sends it to the server to make the new note persist in "memory".

json-server stores all the data in the db.json file, which resides on the server. In the real world, data would be stored in some kind of database. However, json-server is a handy tool that enables the use of server-side functionality in the development phase without the need to program any of it.

We will get familiar with the principles of implementing server-side functionality in more detail in part 3 of this course.
*/
/**/

/**/









































/*
Exercises 2.6.-2.10.
*/















//6647
/*
Filtering Displayed Elements 
Let's add some new functionality to our application that allows us to only view the important notes.

Let's add a piece of state to the App component that keeps track of which notes should be displayed:

const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  
  // ...
}
Let's change the component so that it stores a list of all the notes to be displayed in the notesToShow variable. The items on the list depend on the state of the component:

import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // ...

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
The definition of the notesToShow variable is rather compact:

const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
The definition uses the conditional operator also found in many other programming languages.

The operator functions as follows. If we have:

const result = condition ? val1 : val2
the result variable will be set to the value of val1 if condition is true. If condition is false, the result variable will be set to the value ofval2.

If the value of showAll is false, the notesToShow variable will be assigned to a list that only contains notes that have the important property set to true. Filtering is done with the help of the array filter method:

notes.filter(note => note.important === true)
The comparison operator is redundant, since the value of note.important is either true or false, which means that we can simply write:

notes.filter(note => note.important)
We showed the comparison operator first to emphasize an important detail: in JavaScript val1 == val2 does not always work as expected. When performing comparisons, it's therefore safer to exclusively use val1 === val2. You can read more about the topic here.

You can test out the filtering functionality by changing the initial value of the showAll state.

Next, let's add functionality that enables users to toggle the showAll state of the application from the user interface.

The relevant changes are shown below:

import { useState } from 'react' 
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...    
    </div>
  )
}
The displayed notes (all versus important) are controlled with a button. The event handler for the button is so simple that it has been defined directly in the attribute of the button element. The event handler switches the value of showAll from true to false and vice versa:

() => setShowAll(!showAll)
The text of the button depends on the value of the showAll state:

show {showAll ? 'important' : 'all'}
You can find the code for our current application in its entirety in the part2-3 branch of this GitHub repository.
*/
/*
import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault()

    if(newNote === ''){return}
    else{
      const noteObject = {content: newNote,important: Math.random() < 0.5,id: String(notes.length + 1),}
      setNotes(notes.concat(noteObject))
      setNewNote('')
    }
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(el => el.important === true)

  return(
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll((prev) => !prev) }>show {showAll ? 'important' : 'all'}</button>
      <ul>
        {notesToShow.map((el)=>
          <Note key={el.id} note={el}></Note>
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} placeholder='a new note...'/>
        <button type="submit">save</button>
      </form>   

    </div>
  )
}

export default App

/**/
/*
//F*CKKK
En JavaScript, la diferencia entre == y ===, es que == compara los valores permitiendo conversiones de tipo, mientras que === compara el valor y el tipo de dato sin convertirlos.

1. Operador == (igualdad débil)
JavaScript intenta convertir los tipos de datos para poder compararlos.
console.log(5 == "5");       // true
console.log(1 == true);      // true
console.log(0 == false);     // true
console.log(null == undefined); // true


¿Por qué? Porque JavaScript convierte los valores cuando considera que son equivalentes.

Por ejemplo:
5 == "5"

El número 5 es de tipo number y "5" es de tipo string. Sin embargo, == convierte uno de los valores y devuelve true.

2. Operador === (igualdad estricta)
Compara el valor y el tipo de dato. No realiza conversiones de tipo para hacer que coincidan.
console.log(5 === "5");      // false
console.log(1 === true);     // false
console.log(0 === false);    // false
console.log(5 === 5);        // true
console.log("hola" === "hola"); // true

//F*CKKK 2
Sí. React puede volver a renderizar un componente cuando actualizas un estado con setEstado, aunque la variable no se muestre en pantalla ni se utilice en la lógica. Hay un detalle importante: depende de si el nuevo valor es diferente del anterior.

Vamos con ejemplos, porque esto es fundamental para entender React en tu bootcamp de Full Stack Open.
1. Un estado que no se utiliza
import { useState } from "react";

function App() {
  const [contador, setContador] = useState(0);

  return (
    <button onClick={() => setContador(contador + 1)}>
      Haz clic
    </button>
  );
}


Aquí contador nunca se muestra en el JSX ni se usa en otra lógica.

¿Qué ocurre cuando haces clic?
1. setContador solicita actualizar el estado.
2. El valor pasa de 0 a 1.
3. React vuelve a ejecutar la función App.
4. React comprueba el resultado del nuevo renderizado y actualiza el DOM solo si es necesario.
Sí, hay un nuevo renderizado, aunque visualmente el botón no cambie.
2. ¿Y si actualizo el estado con el mismo valor?
const [contador, setContador] = useState(0);

<button onClick={() => setContador(0)}>
  Haz clic
</button>


Si contador ya vale 0, estás solicitando establecerlo nuevamente en 0.

React compara el valor nuevo con el anterior usando una comparación equivalente a Object.is. Si son iguales, React puede omitir el renderizado del componente.

Hay un matiz: en algunas circunstancias React puede llamar al componente antes de descartar el resultado, así que no conviene depender del número exacto de llamadas.
3. ¿Qué pasa si el estado no se utiliza para nada?
Imagina esto:
function App() {
  const [showAll, setShowAll] = useState(false);

  return (
    <button onClick={() => setShowAll((prev) => !prev)}>
      Haz clic
    </button>
  );
}


Aunque showAll no se utilice en ningún otro sitio, al hacer clic React recibe un nuevo valor y vuelve a renderizar App.
*/























































/*
Controlled component
There are many ways to accomplish this; the first method we will take a look at is through the use of so-called controlled components.

Let's add a new piece of state called newNote for storing the user-submitted input and let's set it as the input element's value attribute:

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
The placeholder text stored as the initial value of the newNote state appears in the input element, but the input text can't be edited. The console displays a warning that gives us a clue as to what might be wrong:

provided value to prop without onchange console error
Since we assigned a piece of the App component's state as the value attribute of the input element, the App component now controls the behavior of the input element.

To enable editing of the input element, we have to register an event handler that synchronizes the changes made to the input with the component's state:

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  // ...

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
We have now registered an event handler to the onChange attribute of the form's input element:

<input
  value={newNote}
  onChange={handleNoteChange}
/>
The event handler is called every time a change occurs in the input element. The event handler function receives the event object as its event parameter:

const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
The target property of the event object now corresponds to the controlled input element, and event.target.value refers to the input value of that element.

Note that we did not need to call the event.preventDefault() method like we did in the onSubmit event handler. This is because no default action occurs on an input change, unlike a form submission.

You can follow along in the console to see how the event handler is called:

multiple console calls with typing text
You did remember to install React devtools, right? Good. You can directly view how the state changes from the React Devtools tab:

state changes in react devtools shows typing too
Now the App component's newNote state reflects the current value of the input, which means that we can complete the addNote function for creating new notes:

const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
    id: String(notes.length + 1),
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
First, we create a new object for the note called noteObject that will receive its content from the component's newNote state. The unique identifier id is generated based on the total number of notes. This method works for our application since notes are never deleted. With the help of the Math.random() function, our note has a 50% chance of being marked as important.

The new note is added to the list of notes using the concat array method, introduced in part 1:

setNotes(notes.concat(noteObject))
The method does not mutate the original notes array, but rather creates a new copy of the array with the new item added to the end. This is important since we must never mutate state directly in React!

The event handler also resets the value of the controlled input element by calling the setNewNote function of the newNote state:

setNewNote('')
You can find the code for our current application in its entirety in the part2-2 branch of this GitHub repository.
*/
/*
import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  //(console.clear(), console.log('App funcionando'))
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('') 

  const addNote = (event) => {
    event.preventDefault()//No recargar la pagina al enviar el formulario

    if(newNote === ''){return}
    else{
      console.log('button clicked', event.target)
      const noteObject = {content: newNote,important: Math.random() < 0.5,id: String(notes.length + 1),}
      setNotes(notes.concat(noteObject))
      //Como yo lo hize lpm el mejor te lo juro (LO ES)
      //setNotes((prev)=>[...prev, {id:(prev[prev.length-1].id+1),content:newNote,important:true}])
      setNewNote('')

    }
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  return(
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((el)=>
          <Note key={el.id} note={el}></Note>
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} placeholder={'a new note...'}/>
        <button type="submit">save</button>
      </form>   

    </div>
  )
}

export default App
/**/
/*
//F*CKKK concatenar objetos

const prev = {
  user1: { name: 'Ana' },
  user2: { name: 'Luis' }
}
const next = {
  ...prev,
  user2: { name: 'Carlos' },
  user3: { name: 'Pedro' }
}

¿Cuál será el resultado?:
Tendrá user1, user2 (Carlos) y user3 (Pedro).
...prev copia user1 y user2, pero la propiedad user2 que aparece después reemplaza su valor anterior. user3 se agrega como propiedad nueva.

Solucion: Envolver en parentesis, para que js no detecte las llaves contiguas al igual de next como llaves tipo return, si no como unas llaves de tipo objeto

const next = ({
  ...prev,
  user2: { name: 'Carlos' },
  user3: { name: 'Pedro' })
}
Resultado: Se concatena bien
 {
    user1: { name: 'Ana' },
    user2: { name: 'Luis' },
    user2: { name: 'Carlos' },
    user3: { name: 'Pedro' }
 }
*/




































/*
b Forms
Let's continue expanding our application by allowing users to add new notes. You can find the code for our current application here.

Saving the notes in the component state
To get our page to update when new notes are added it's best to store the notes in the App component's state. Let's import the useState function and use it to define a piece of state that gets initialized with the initial notes array passed in the props.

import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App 
The component uses the useState function to initialize the piece of state stored in notes with the array of notes passed in the props:

const App = (props) => { 
  const [notes, setNotes] = useState(props.notes) 

  // ...
}
We can also use React Developer Tools to see that this really happens:

browser showing dev react tools window
If we wanted to start with an empty list of notes, we would set the initial value as an empty array, and since the props would not be used, we could omit the props parameter from the function definition:

const App = () => { 
  const [notes, setNotes] = useState([]) 

  // ...
}  
Let's stick with the initial value passed in the props for the time being.

Next, let's add an HTML form to the component that will be used for adding new notes.

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
We have added the addNote function as an event handler to the form element that will be called when the form is submitted, by clicking the submit button.

We use the method discussed in part 1 for defining our event handler:

const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
The event parameter is the event that triggers the call to the event handler function:

The event handler immediately calls the event.preventDefault() method, which prevents the default action of submitting a form. The default action would, among other things, cause the page to reload.

The target of the event stored in event.target is logged to the console:

button clicked with form object console
The target in this case is the form that we have defined in our component.

How do we access the data contained in the form's input element?
*/
/*
import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  (console.clear(), console.log('App funcionando'))
  const [notes, setNotes] = useState(props.notes)

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return(
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((el)=>
          <Note key={el.id} note={el}></Note>
        )}
      </ul>

      <form onSubmit={addNote}>
      <input />
      <button type="submit">save</button>
    </form>   



    </div>
  )
}

export default App
/**/







































/*
Exercises 2.1.-2.5.
 */








/*
Web developer's oath
Before the exercises, let me remind what you promised at the end of the previous part.

Programming is hard, that is why I will use all the possible means to make it easier

I will have my browser developer console open all the time
I progress with small steps
I will write lots of console.log statements to make sure I understand how the code behaves and to help pinpoint problems
If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working
When I ask for help in the course Discord channel or elsewhere I formulate my questions properly, see here how to ask for help
*/
/**/

/**/



































/*
When the Application Breaks
Early in your programming career (and even after 30 years of coding like yours truly), what often happens is that the application just completely breaks down. This is even more so the case with dynamically typed languages, such as JavaScript, where the compiler does not check the data type. For instance, function variables or return values.

A "React explosion" can, for example, look like this:

react sample error
In these situations, your best way out is the console.log method.

The piece of code causing the explosion is this:

const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)

const App = () => {
  const course = {
    // ...
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
We'll hone in on the reason for the breakdown by adding console.log commands to the code. Because the first thing to be rendered is the App component, it's worth putting the first console.log there:

const App = () => {
  const course = {
    // ...
  }

  console.log('App works...')

  return (
    // ..
  )
}
To see the printing in the console, we must scroll up over the long red wall of errors.

initial printing of the console
When one thing is found to be working, it's time to log deeper. If the component has been declared as a single statement or a function without a return, it makes printing to the console harder.

const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
The component should be changed to its longer form for us to add the printing:

const Course = ({ course }) => { 
  console.log(course)
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
Quite often the root of the problem is that the props are expected to be of a different type, or called with a different name than they actually have, and destructuring fails as a result. The problem often begins to solve itself when destructuring is removed and we see what the props contain.

const Course = (props) => {
  console.log(props)
  const { course } = props
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
If the problem has still not been resolved, sadly there isn't much to do apart from continuing to bug-hunt by sprinkling more console.log statements around your code.

I added this chapter to the material after the model answer for the next question exploded completely (due to props being of the wrong type), and I had to debug it using console.log.


*/
//// Super F*CKKK
/*
import {useState} from 'react'

//const Course = (props) => { 
const Course = ({course}) => { 
  //console.log(props)
  //console.log(course)
  //¿Para qué sirve quitar la desestructuración? Para inspeccionar qué datos recibe el componente y comprobar si las propiedades tienen los nombres y valores esperados: const Course = (props) => {console.log(props)}, cosa que con: const Course = ({ course }) => {console.log(course)} no se podria ver. claro y el componente Header no esta definido F*CKKK
  return (
    <div>
      <Header course={course} />
    </div>
  )
}

const App = () => {
  const course = {
    // ... ojete, digo objeto vacio *F*CKKK
  }

  console.log('App works...')

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
export default App
/**/
//Fix segun yo, prefiero dejar un programa que funcione jaja
/*
import {useState} from 'react'


const Header = ({course}) => <h1>{course.tittle}</h1>
const Course = ({course}) => <div><Header course={course} /></div>

const App = () => {
  const course = {tittle:"Este es un curso de react"}

  return (
    <div>
      <Course course={course} />
    </div>
    )
}
export default App
/**/









































/*
Refactoring Modules
Let's tidy the code up a bit. We are only interested in the field notes of the props, so let's retrieve that directly using destructuring:

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
If you have forgotten what destructuring means and how it works, please review the section on destructuring.

We'll separate displaying a single note into its own component Note:

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}
Note that the key attribute must now be defined for the Note components, and not for the li tags like before.

A whole React application can be written in a single file. Although that is, of course, not very practical. Common practice is to declare each component in its own file as an ES6-module.

We have been using modules the whole time. The first few lines of the file main.jsx:

import ReactDOM from "react-dom/client"
import App from "./App"
import two modules, enabling them to be used in that file. The module react-dom/client is placed into the variable ReactDOM, and the module that defines the main component of the app is placed into the variable App

Let's move our Note component into its own module.

In smaller applications, components are usually placed in a directory called components within the src directory. The convention is to name the file after the component. A possible directory structure for a project containing multiple components could be as follows:

src/
├── main.jsx
├── App.jsx
└── components/           # Folder for reusable components
    ├── Footer.jsx        # File named after the component
    ├── Note.jsx
    └── Notification.jsx
Now, we'll create a directory called components for our application and place a file named Note.jsx inside. The contents of the file are as follows:

const Note = ({ note }) => {
  return <li>{note.content}</li>
}

export default Note
The last line of the module exports the declared module, the variable Note.

Now the file that is using the component - App.jsx - can import the module:

import Note from './components/Note'

const App = ({ notes }) => {
  // ...
}
The component exported by the module is now available for use in the variable Note, just as it was earlier.

Note that when importing our own components, their location must be given in relation to the importing file:

'./components/Note'
The period - . - in the beginning refers to the current directory, so the module's location is a file called Note.jsx in the components sub-directory of the current directory. The filename extension .jsx can be omitted.

Modules have plenty of other uses other than enabling component declarations to be separated into their own files. We will get back to them later in this course.

The current code of the application can be found on GitHub.

Note that the main branch of the repository contains the code for a later version of the application. The current code is in the branch part2-1:

GitHub branch screenshot
If you clone the project, run the command npm install before starting the application with npm run dev.
*/
////THIS EXAMPLE USES Note.jsx (In the future will existes Note2.jsx)
/*
import {useState} from 'react'
import Note from './components/Note'


const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note}></Note>
        )}
      </ul>
    </div>
  )
}
export default App
/**/









































/*
Anti-pattern: Array Indexes as Keys
We could have made the error message on our console disappear by using the array indexes as keys. The indexes can be retrieved by passing a second parameter to the callback function of the map method:

notes.map((note, i) => ...)
When called like this, i is assigned the value of the index of the position in the array where the note resides.

As such, one way to define the row generation without getting errors is:

<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
This is, however, not recommended and can create undesired problems even if it seems to be working just fine.

Read more about this in this article.
*/
/*
import {useState} from 'react'
const App = (props) => {
  const { notes } = props

  const result = notes.map(note => note.content)
  console.log(result)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note, i) =>
          <li key={i}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
  //F*CKK parcialmente, usar la i de la iteracion como key no es recomendable del todo, lo mejor siempre seran IDS
}
export default App
/**/




























/*
Map
Understanding how the array method map works is crucial for the rest of the course.

The application contains an array called notes:

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]
Let's pause for a moment and examine how map works.

If the following code is added to, let's say, the end of the file:

const result = notes.map(note => note.id)
console.log(result)
[1, 2, 3] will be printed to the console. map always creates a new array, the elements of which have been created from the elements of the original array by mapping: using the function given as a parameter to the map method.

The function is

note => note.id
Which is an arrow function written in compact form. The full form would be:

(note) => {
  return note.id
}
The function gets a note object as a parameter and returns the value of its id field.

Changing the command to:

const result = notes.map(note => note.content)
will give you an array containing the contents of the notes.

This is already pretty close to the React code we used:

notes.map(note =>
  <li key={note.id}>
    {note.content}
  </li>
)
which generates an li tag containing the contents of the note from each note object.

Because the function parameter passed to the map method -

note => <li key={note.id}>{note.content}</li>
 - is used to create view elements, the value of the variable must be rendered inside curly braces. Try to see what happens if the braces are removed.

The use of curly braces will cause some pain in the beginning, but you will get used to them soon enough. The visual feedback from React is immediate.
*/
/*
import {useState} from 'react'
const App = (props) => {
  const { notes } = props

  const result = notes.map(note => note.content)
  console.log(result)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note =>
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
export default App
/**/



































/*
Key-attribute
Even though the application seems to be working, there is a nasty warning in the console:

unique key prop console error
As the linked React page in the error message suggests; the list items, i.e. the elements generated by the map method, must each have a unique key value: an attribute called key.

Let's add the keys:

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
And the error message disappears.

React uses the key attributes of objects in an array to determine how to update the view generated by a component when the component is re-rendered. More about this is in the React documentation.
*/
/*
import {useState} from 'react'
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
export default App
/**/









































/*
Rendering Collections
Now, we will build the frontend, or the user interface (the part users see in their browser), using React, similar to the example application from part 0.

Let's start with the following (the file App.jsx):

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

export default App
The file main.jsx looks like this:

import ReactDOM from 'react-dom/client'
import App from './App'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
Every note contains its textual content, a boolean value for marking whether the note has been categorized as important or not, and also a unique id.

The example above works due to the fact that there are exactly three notes in the array.

A single note is rendered by accessing the objects in the array by referring to a hard-coded index number:

<li>{notes[1].content}</li>
This is, of course, not practical. We can improve on this by generating React elements from the array objects using the map function.

notes.map(note => <li>{note.content}</li>)
The result is an array of li elements.

[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
Which can then be placed inside ul tags:

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
    </div>
  )
}
Because the code generating the li tags is JavaScript, it must be wrapped in curly braces in a JSX template just like all other JavaScript code.

We will also make the code more readable by separating the arrow function's declaration across multiple lines:

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
*/
/*
import {useState} from 'react'
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => 
          <li>{note.content}</li>)}
      </ul>
    </div>
  )
}
export default App
/**/





























/*
P2
Rendering a collection, modules
Before starting a new part, let's recap some of the topics that proved difficult last year.

console.log
What's the difference between an experienced JavaScript programmer and a rookie? The experienced one uses console.log 10-100 times more.

Paradoxically, this seems to be true even though a rookie programmer would need console.log (or any debugging method) more than an experienced one.

When something does not work, don't just guess what's wrong. Instead, log or use some other way of debugging.

NB As explained in part 1, when you use the command console.log for debugging, don't concatenate things 'the Java way' with a plus. Instead of writing:

console.log('props value is ' + props)
separate the things to be printed with a comma:

console.log('props value is', props)
If you concatenate an object with a string and log it to the console (like in our first example), the result will be pretty useless:

props value is [object Object]
On the contrary, when you pass objects as distinct arguments separated by commas to console.log, like in our second example above, the content of the object is printed to the developer console as strings that are insightful. If necessary, read more about debugging React applications.






Protip: Visual Studio Code snippets
With Visual Studio Code it's easy to create 'snippets', i.e., shortcuts for quickly generating commonly re-used portions of code, much like how 'sout' works in Netbeans.

Instructions for creating snippets can be found here.

Useful, ready-made snippets can also be found as VS Code plugins, in the marketplace.

The most important snippet is the one for the console.log() command, for example, clog. This can be created like so:

{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Log output to console"
  }
}
Debugging your code using console.log() is so common that Visual Studio Code has that snippet built in. To use it, type log and hit Tab to autocomplete. More fully featured console.log() snippet extensions can be found in the marketplace.






JavaScript Arrays
From here on out, we will be using the functional programming operators of the JavaScript array, such as find, filter, and map - all of the time.

If operating arrays with functional operators feels foreign to you, it is worth watching at least the first three parts of the YouTube video series Functional Programming in JavaScript:

Higher-order functions
Map
Reduce basics






Event Handlers Revisited
Based on last year's course, event handling has proved to be difficult.

It's worth reading the revision chapter at the end of the previous part - event handlers revisited - if it feels like your own knowledge on the topic needs some brushing up.

Passing event handlers to the child components of the App component has raised some questions. A small revision on the topic can be found here.
*/
/*
import {useState} from 'react'
const App = () => {
  console.clear()

  const objetito = {a:1, b:2, c:3, d:4, e:5}
  const objetito2 = {f:6, g:7, h:8, i:9, j:10}
  const stringsito = "texto12345"

  console.log(objetito +stringsito)//F*CKKK
  console.log(stringsito +objetito)//F*CKKK
  console.log(objetito+ objetito2)//F*CKKK

  console.log(objetito, stringsito)//GOOD
  console.log(objetito, objetito2)//GOOD
  
  return(<><h1>Hola</h1></>)
}
export default App
/**/
































/*
Useful Reading

The internet is full of React-related material. However, we use the new style of React for which a large majority of the material found online is outdated.

You may find the following links useful:

The official React documentation is worth checking out at some point, although most of it will become relevant only later on in the course. Also, everything related to class-based components is irrelevant to us;
Some courses on Egghead.io like Start learning React are of high quality, and the recently updated Beginner's Guide to React is also relatively good; both courses introduce concepts that will also be introduced later on in this course. NB The first one uses class components but the latter uses the new functional ones.







Web Programmer's Oath

Programming is hard. That is why, as a developer, I will use all possible means to make it easier.

I will have my browser's developer console open at all times.
I will progress in small steps, making sure that my code is working at each step.
I will write many console.log statements to make sure I understand how the code behaves and to help pinpointing problems.
If my code does not work, I will not write more code. Instead, I will either start deleting the code until it works or return to a state where my program was working.
When I ask for help in the course Discord channel or elsewhere, I will formulate my questions properly. See this section to learn how to ask for help.







Utilization of Large language models

Large language models such as ChatGPT, Claude and GitHub Copilot have proven to be very useful in software development.

Personally, I mainly use GitHub Copilot, which is now natively integrated into Visual Studio Code As a reminder, if you're a university student, you can access Copilot Pro for free through the GitHub Student Developer Pack.

Copilot is useful in a wide variety of scenarios. For example, Copilot can be asked to generate code for an open file by describing the desired functionality in text:

copilot input on vscode
If the code looks good, Copilot adds it to the file:

code added by copilot
In the case of our example, Copilot only created a button, the event handler handleResetClick is undefined.

An event handler may also be generated. By writing the first line of the function, Copilot offers the functionality to be generated:

copilot´s code suggestion
In Copilot's chat window, it is possible to ask for an explanation of the function of the selected code area:

copilot explaining how the selected code works in the chat window
Copilot is also useful for debugging. If you copy an error message into Copilot's chat, you will get an explanation of the problem and a suggested fix:

copilot explaining the error and suggesting a fix
Copilot's chat also enables the creation of larger set of functionality. For example, the image below shows Copilot creating a login component using the useState hook.

copilot creating a login component on request
The usefulness of Copilot and other language models in programming varies. The biggest problem with language models is hallucination. Large language models sometimes generate answers that may seem correct, but are completely wrong. In programming, errors in hallucinated code are often caught quickly when the code fails to run. However, some code generated by a language model may work at first but still have hidden issues, such as logic errors or security vulnerabilities.

Another problem in applying language models to software development is that it is difficult for language models to "understand" larger projects. One major limitation of language models is that they are unable to implement changes across several files. Language models are also currently unable to generalize code. For example, if the programmer requests for new functionality that can be implemented with existing functions or components (even with minor adjustments), the language model may fail to use them. This deteriorates the code base quality because the language models generate duplicate functions and components. For more information about this, read this article.

If you choose to use language models when programming, remember that its output is your responsibility.

The rapid development of language models puts programming students in a challenging position. Is it worth, or even necessary, to learn programming to a detailed level when you can get almost everything ready-made from language models?

At this point, it is worth remembering the old wisdom of Brian Kerningham, co-author of The C Programming Language:

Everyone knows that debugging is twice as hard as writing a program in the first place. So if you're as clever as you can be when you write it, how will you ever debug it? ― Brian Kernighan
In other words, since debugging is twice as difficult as programming, it is not worth creating code that you barely understand. How can debugging even be possible when the software developer does not understand the debugged code because they outsourced programming to a language model?

So far, the development of language models and artificial intelligence is still at the stage where they are not self-sufficient, and the most difficult problems are left for humans to solve. Because of this, even novice software developers must learn to program really well just in case. It may be that, despite the development of language models, even more in-depth knowledge is needed. Artificial intelligence does the easy things, but a human is needed to sort out the most complicated messes caused by AI. GitHub Copilot is a very well-named product because it's a Copilot; a second pilot who helps the main pilot in an aircraft. The programmer is still the main pilot, the captain, and the one who ultimately bears the responsibility.

Throughout this course, it may be in your own interest that you turn off Copilot by default and only rely on it in a real emergency.
*/





























/*
Do Not Define Components Within Components
Let's start displaying the value of the application in its Display component.

We will change the application by defining a new component inside of the App component.

// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Do not define components inside another component
  const Display = props => <div>{props.value}</div>

  return (
    <div>
      <Display value={value} />
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
The application still appears to work, but do not implement components like this! Never define components inside of other components. The method provides no benefits and only leads to problems. One such problem is that React will treat a component defined inside of another component as a "new component" in every render. This makes it impossible for React to optimize the component.

Let's instead move the Display component function to its correct place, which is outside of the App component function:

const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
*/
/*
import {useState} from 'react'

// This is the right place to define a component
//const Display = props => <div>{props.value}</div>//NICEEE

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Do not define components inside another component
  const Display = props => <div>{props.value}</div>//F*CKKK

  return (
    <div>

      <Display value={value} />
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
export default App
/**/





























/*
Passing Event Handlers to Child Components
Let's extract the button into its own component:

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)
The component gets the event handler function from the onClick prop, and the text of the button from the text prop. Lets use the new component:

const App = (props) => {
  // ...
  return (
    <div>
      {value}
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
Using the Button component is simple, although we have to make sure that we use the correct attribute names when passing props to the component.

using correct attribute names code screenshot
*/
/*
import {useState} from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
export default App
/**/





























/*
A function that returns a function

Another way to define an event handler is to use a function that returns a function.

You probably won't need to use functions that return functions in any of the exercises in this course. If the topic seems particularly confusing, you may skip over this section for now and return to it later.

Let's make the following changes to our code:

const App = () => {
  const [value, setValue] = useState(10)

  const hello = () => {
    const handler = () => console.log('hello world')
    return handler
  }

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
The code functions correctly even though it looks complicated.

The event handler is now set to a function call:

<button onClick={hello()}>button</button>
Earlier, we stated that an event handler may not be a function call; rather, it has to either be a function definition or a reference to one. Why then does a function call work in this case?

When the component is rendered, the following function gets executed:

const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
The return value of the function is another function that is assigned to the handler variable.

When React renders the line:

<button onClick={hello()}>button</button>
It assigns the return value of hello() to the onClick attribute. Essentially the line gets transformed into:

<button onClick={() => console.log('hello world')}>
  button
</button>
Since the hello function returns a function, the event handler is now a function.

What's the point of this concept?

Let's change the code a tiny bit:

const App = () => {
  const [value, setValue] = useState(10)

  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }
    return handler
  }

  return (
    <div>
      {value}
      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
    </div>
  )
}
Now the application has three buttons with event handlers defined by the hello function that accepts a parameter.

The first button is defined as

<button onClick={hello('world')}>button</button>
The event handler is created by executing the function call hello('world'). The function call returns the function:

() => {
  console.log('hello', 'world')
}
The second button is defined as:

<button onClick={hello('react')}>button</button>
The function call hello('react') that creates the event handler returns:

() => {
  console.log('hello', 'react')
}
Both buttons get their individualized event handlers.

Functions returning functions can be utilized in defining generic functionality that can be customized with parameters. The hello function that creates the event handlers can be thought of as a factory that produces customized event handlers meant for greeting users.

Our current definition is slightly verbose:

const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
Let's eliminate the helper variables and directly return the created function:

const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
Since our hello function is composed of a single return command, we can omit the curly braces and use the more compact syntax for arrow functions:

const hello = (who) =>
  () => {
    console.log('hello', who)
  }
Lastly, let's write all of the arrows on the same line:

const hello = (who) => () => {
  console.log('hello', who)
}
We can use the same trick to define event handlers that set the state of the component to a given value. Let's make the following changes to our code:

const App = () => {
  const [value, setValue] = useState(10)
  
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }
  
  return (
    <div>
      {value}
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}
When the component is rendered, the thousand button is created:

<button onClick={setToValue(1000)}>thousand</button>
The event handler is set to the return value of setToValue(1000) which is the following function:

() => {
  console.log('value now', 1000)
  setValue(1000)
}
The increase button is declared as follows:

<button onClick={setToValue(value + 1)}>increment</button>
The event handler is created by the function call setToValue(value + 1) which receives as its parameter the current value of the state variable value increased by one. If the value of value was 10, then the created event handler would be the function:

() => {
  console.log('value now', 11)
  setValue(11)
}
Using functions that return functions is not required to achieve this functionality. Let's return the setToValue function which is responsible for updating state into a normal function:

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
We can now define the event handler as a function that calls the setToValue function with an appropriate parameter. The event handler for resetting the application state would be:

<button onClick={() => setToValue(0)}>reset</button>
Choosing between the two presented ways of defining your event handlers is mostly a matter of taste.
*/
/*
import {useState} from 'react'

const App = () => {
  const [value, setValue] = useState(10)

  //const hello = (who) => () => console.log('hello', who)
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}
export default App
/**/




























/*
Event Handling Revisited

Event handling has proven to be a difficult topic in previous iterations of this course.

For this reason, we will revisit the topic.

Let's assume that we're developing this simple application with the following component App:

const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}
We want the clicking of the button to reset the state stored in the value variable.

In order to make the button react to a click event, we have to add an event handler to it.

Event handlers must always be a function or a reference to a function. The button will not work if the event handler is set to a variable of any other type.

If we were to define the event handler as a string:

<button onClick="crap...">button</button>//F*CKKK
React would warn us about this in the console:

index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
The following attempt would also not work:

<button onClick={value + 1}>button</button>//F*CKKK
We have attempted to set the event handler to value + 1 which simply returns the result of the operation. React will kindly warn us about this in the console:

index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
This attempt would not work either:

<button onClick={value = 0}>button</button>//F*CKKK
The event handler is not a function but a variable assignment, and React will once again issue a warning to the console. This attempt is also flawed in the sense that we must never mutate state directly in React.

What about the following:

<button onClick={console.log('clicked the button')}>//F*CKKK
  button
</button>
The message gets printed to the console once when the component is rendered but nothing happens when we click the button. Why does this not work even when our event handler contains a function console.log?

The issue here is that our event handler is defined as a function call which means that the event handler is assigned the returned value from the function, which in the case of console.log is undefined.

The console.log function call gets executed when the component is rendered and for this reason, it gets printed once to the console.

The following attempt is flawed as well:

<button onClick={setValue(0)}>button</button>//F*CKKK
We have once again tried to set a function call as the event handler. This does not work. This particular attempt also causes another problem. When the component is rendered the function setValue(0) gets executed which in turn causes the component to be re-rendered. Re-rendering in turn calls setValue(0) again, resulting in an infinite recursion.

Executing a particular function call when the button is clicked can be accomplished like this:

<button onClick={() => console.log('clicked the button')}>
  button
</button>
Now the event handler is a function defined with the arrow function syntax () => console.log('clicked the button'). When the component gets rendered, no function gets called and only the reference to the arrow function is set to the event handler. Calling the function happens only once the button is clicked.

We can implement resetting the state in our application with this same technique:

<button onClick={() => setValue(0)}>button</button>
The event handler is now the function () => setValue(0).

Defining event handlers directly in the attribute of the button is not necessarily the best possible idea.

You will often see event handlers defined in a separate place. In the following version of our application we define a function that then gets assigned to the handleClick variable in the body of the component function:

const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () =>
    console.log('clicked the button')

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
The handleClick variable, which references the function definition, is passed to the button as the onClick attribute:

<button onClick={handleClick}>button</button>
Naturally, our event handler function can be composed of multiple commands. In these cases we use the longer curly brace syntax for arrow functions:

const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
*/
/*
import {useState} from 'react'

const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
}
  return (
    <div>
      {value}
      <button onClick={handleClick}>Reset to zero</button>
    </div>
  )
}
export default App
/**/


























/*
Rules of Hooks
There are a few limitations and rules that we have to follow to ensure that our application uses hooks-based state functions correctly.

The useState function (as well as the useEffect function introduced later on in the course) must not be called from inside of a loop, a conditional expression, or any place that is not a function defining a component. This must be done to ensure that the hooks are always called in the same order, and if this isn't the case the application will behave erratically.

To recap, hooks may only be called from the inside of a function body that defines a React component:

const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
*/
/*
import {useState} from 'react'

const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work! F*CKKK
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good F*CKKK
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal F*CKKK
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
export default App
/**/















































/*
Debugging React applications
A large part of a typical developer's time is spent on debugging and reading existing code. Every now and then we do get to write a line or two of new code, but a large part of our time is spent trying to figure out why something is broken or how something works. Good practices and tools for debugging are extremely important for this reason.

Lucky for us, React is an extremely developer-friendly library when it comes to debugging.

Before we move on, let us remind ourselves of one of the most important rules of web development.

The first rule of web development
Keep the browser's developer console open at all times.

The Console tab in particular should always be open, unless there is a specific reason to view another tab.

Keep both your code and the web page open together at the same time, all the time.

If and when your code fails to compile and your browser lights up like a Christmas tree:

screenshot of error pointing at the code line where it has been generated
don't write more code but rather find and fix the problem immediately. There has yet to be a moment in the history of coding where code that fails to compile would miraculously start working after writing large amounts of additional code. I highly doubt that such an event will transpire during this course either.

Old-school, print-based debugging is always a good idea. If the component

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
is not working as intended, it's useful to start printing its variables out to the console. In order to do this effectively, we must transform our function into the less compact form and receive the entire props object without destructuring it immediately:

const Button = (props) => { 
  console.log(props)
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}
This will immediately reveal if, for instance, one of the attributes has been misspelled when using the component.

NB When you use console.log for debugging, don't combine objects in a Java-like fashion by using the plus operator:

console.log('props value is ' + props)//F*CKKK
If you do that, you will end up with a rather uninformative log message:

props value is [object Object]
Instead, separate the things you want to log to the console with a comma:

console.log('props value is', props)
In this way, the separated items will all be available in the browser console for further inspection.

Logging output to the console is by no means the only way of debugging our applications. You can pause the execution of your application code in the Chrome developer console's debugger, by writing the command debugger anywhere in your code.

The execution will pause once it arrives at a point where the debugger command gets executed:

debugger paused in dev tools
By going to the Console tab, it is easy to inspect the current state of variables:

console inspection screenshot
Once the cause of the bug is discovered you can remove the debugger command and refresh the page.

The debugger also enables us to execute our code line by line with the controls found on the right-hand side of the Sources tab.

You can also access the debugger without the debugger command by adding breakpoints in the Sources tab. Inspecting the values of the component's variables can be done in the Scope-section:

breakpoint example in devtools
It is highly recommended to add the React developer tools extension to Chrome. It adds a new Components tab to the developer tools. The new developer tools tab can be used to inspect the different React elements in the application, along with their state and props:

screenshot react developer tools extension
The App component's state is defined like so:

const [left, setLeft] = useState(0)
const [right, setRight] = useState(0)
const [allClicks, setAll] = useState([])
Dev tools show the state of hooks in the order of their definition:

state of hooks in react dev tools
The first State contains the value of the left state, the next contains the value of the right state and the last contains the value of the allClicks state.

You can also learn about debugging JavaScript in Chrome, for example, with the Chrome DevTools guide video.
*/
/**/

/**/


























/*
Old React
In this course, we use the state hook to add state to our React components, which is part of the newer versions of React and is available from version 16.8.0 onwards. Before the addition of hooks, there was no way to add state to functional components. Components that required state had to be defined as class components, using the JavaScript class syntax.

In this course, we have made the slightly radical decision to use hooks exclusively from day one, to ensure that we are learning the current and future variations of React. Even though functional components are the future of React, it is still important to learn the class syntax, as there are billions of lines of legacy React code that you might end up maintaining someday. The same applies to documentation and examples of React that you may stumble across on the internet.

We will learn more about React class components later on in the course.
*/
/**/

/**/

























/*
Conditional rendering
Let's modify our application so that the rendering of the clicking history is handled by a new History component:

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
Now the behavior of the component depends on whether or not any buttons have been clicked. If not, meaning that the allClicks array is empty, the component renders a div element with some instructions instead:

<div>the app is used by pressing the buttons</div>
And in all other cases, the component renders the clicking history:

<div>
  button press history: {props.allClicks.join(' ')}
</div>
The History component renders completely different React elements depending on the state of the application. This is called conditional rendering.

React also offers many other ways of doing conditional rendering. We will take a closer look at this in part 2.

Let's make one last modification to our application by refactoring it to use the Button component that we defined earlier on:

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right' />
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
*/
/*
import {useState} from 'react'

const History = (props) => {
    if (props.allClicks.length === 0) {
      return (
        <div>
          the app is used by pressing the buttons
        </div>
      )
    }
    return (
      <div>
        button press history: {props.allClicks.join(' ')}
      </div>
    )
  }

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  //console.clear()
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right) 
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
    setRight(updatedRight)
    setTotal(left + updatedRight)
  }

  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right' />
      {right}

      <p>{allClicks.join(' ')}</p>
      <p>total {total}</p>
      <History allClicks={allClicks} />
    </div>
  )
}
export default App
/**/




























/*
Update of the state is asynchronous
Let's expand the application so that it keeps track of the total number of button presses in the state total, whose value is always updated when the buttons are pressed:

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
    setTotal(left + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
    setTotal(left + right)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
      <p>total {total}</p>
    </div>
  )
}
The solution does not quite work:

browser showing 2 left|right 1, RLL total 2
The total number of button presses is consistently one less than the actual amount of presses, for some reason.

Let us add couple of console.log statements to the event handler:

const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    console.log('left before', left)
    setLeft(left + 1)
    console.log('left after', left)
    setTotal(left + right) 
  }

  // ...
}
The console reveals the problem

devtools console showing left before 4 and left after 4
Even though a new value was set for left by calling setLeft(left + 1), the old value persists despite the update. As a result, the attempt to count button presses produces a result that is too small:

setTotal(left + right) 
The reason for this is that a state update in React happens asynchronously, i.e. not immediately but "at some point" after the current component function is finished, before the component is rendered again.

We can fix the app as follows:

const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right) 
  }

  // ...
}
So now the number of button presses is definitely based on the correct number of left button presses.

We can also handle asynchronous updates for the right button:

const App = () => {
  // ...
  const handleRightClick = () => {
    setAll(allClicks.concat('R'));
    const updatedRight = right + 1;
    setRight(updatedRight);
    setTotal(left + updatedRight);
  };

  // ...
}
*/
/*
import {useState} from 'react'

const App = () => {
  //console.clear()
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)


//  const handleLeftClick = () => {
//    setAll(allClicks.concat('L'))//allClicks.push('L') F*CKKK
//    console.log('left before', left)
//    setLeft(left + 1)
//    console.log('left after', left)
//    setTotal(left + right)//F*ckk el codigo se ejecuta y muestra en ////pantalla el renderizado anterior, no el que se acaba de hacer son el setTotal, porque el Update of the state is asynchronous, para verlo bien habria que guardar ese estado en una variable e imprimir/mostrar/usar esa variable
//  }

  //Fix as follows
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right) 
  }

  //Fix as follows
  const handleRightClick = () => {
    setAll(allClicks.concat('R'));
    const updatedRight = right + 1;
    setRight(updatedRight);
    setTotal(left + updatedRight);
  };

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}

      <p>{allClicks.join(' ')}</p>
      <p>total {total}</p>
    </div>
  )
}
export default App
/**/

























/*
Handling arrays
Let's add a piece of state to our application containing an array allClicks that remembers every click that has occurred in the application.

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
    </div>
  )
}
Every click is stored in a separate piece of state called allClicks that is initialized as an empty array:

const [allClicks, setAll] = useState([])
When the left button is clicked, we add the letter L to the allClicks array:

const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
The piece of state stored in allClicks is now set to be an array that contains all of the items of the previous state array plus the letter L. Adding the new item to the array is accomplished with the concat method, which does not mutate the existing array but rather returns a new copy of the array with the item added to it.

As mentioned previously, it's also possible in JavaScript to add items to an array with the push method. If we add the item by pushing it to the allClicks array and then updating the state, the application would still appear to work:

const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}
However, don't do this. As mentioned previously, the state of React components, like allClicks, must not be mutated directly. Even if mutating state appears to work in some cases, it can lead to problems that are very hard to debug.

Let's take a closer look at how the clicking is rendered to the page:

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
    </div>
  )
}
We call the join method on the allClicks array, that joins all the items into a single string, separated by the string passed as the function parameter, which in our case is an empty space.
*/
/*
import {useState} from 'react'

const App = () => {
  //console.clear()
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  const [allClicks, setAll] = useState([])


  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))//allClicks.push('L') F*CKKK
    setLeft(left + 1)
  }


  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}

      <p>{allClicks.join(' ')}</p>
    </div>
  )
}
export default App
/**/


























/*
P1
d A more complex state, debugging React apps
Complex state
In our previous example, the application state was simple as it was comprised of a single integer. What if our application requires a more complex state?

In most cases, the easiest and best way to accomplish this is by using the useState function multiple times to create separate "pieces" of state.

In the following code we create two pieces of state for the application named left and right that both get the initial value of 0:

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
The component gets access to the functions setLeft and setRight that it can use to update the two pieces of state.

The component's state or a piece of its state can be of any type. We could implement the same functionality by saving the click count of both the left and right buttons into a single object:

{
  left: 0,
  right: 0
}
In this case, the application would look like this:

const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = { 
      left: clicks.left + 1, 
      right: clicks.right 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = { 
      left: clicks.left, 
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
Now the component only has a single piece of state and the event handlers have to take care of changing the entire application state.

The event handler looks a bit messy. When the left button is clicked, the following function is called:

const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}
The following object is set as the new state of the application:

{
  left: clicks.left + 1,
  right: clicks.right
}
The new value of the left property is now the same as the value of left + 1 from the previous state, and the value of the right property is the same as the value of the right property from the previous state.

We can define the new state object a bit more neatly by using the object spread syntax that was added to the language specification in the summer of 2018:

const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = { 
    ...clicks, 
    right: clicks.right + 1 
  }
  setClicks(newClicks)
}
The syntax may seem a bit strange at first. In practice { ...clicks } creates a new object that has copies of all of the properties of the clicks object. When we specify a particular property - e.g. right in { ...clicks, right: 1 }, the value of the right property in the new object will be 1.

In the example above, this:

{ ...clicks, right: clicks.right + 1 }
creates a copy of the clicks object where the value of the right property is increased by one.

Assigning the object to a variable in the event handlers is not necessary and we can simplify the functions to the following form:

const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
Some readers might be wondering why we didn't just update the state directly, like this:

const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
The application appears to work. However, it is forbidden in React to mutate state directly, since it can result in unexpected side effects. Changing state has to always be done by setting the state to a new object. If properties from the previous state object are not changed, they need to simply be copied, which is done by copying those properties into a new object and setting that as the new state.

Storing all of the state in a single state object is a bad choice for this particular application; there's no apparent benefit and the resulting application is a lot more complex. In this case, storing the click counters into separate pieces of state is a far more suitable choice.

There are situations where it can be beneficial to store a piece of application state in a more complex data structure. The official React documentation contains some helpful guidance on the topic.
*/
/*
import {useState} from 'react'

const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => 
    setClicks({ ...clicks, left: clicks.left + 1 })

  const handleRightClick = () => 
    setClicks({ ...clicks, right: clicks.right + 1 })

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
export default App
/**/



























/*
Refactoring the components
The component displaying the value of the counter is as follows:

const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
The component only uses the counter field of its props. This means we can simplify the component by using destructuring, like so:

const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
The function defining the component contains only the return statement, so we can define the function using the more compact form of arrow functions:

const Display = ({ counter }) => <div>{counter}</div>
We can simplify the Button component as well.

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
We can use destructuring to get only the required fields from props, and use the more compact form of arrow functions:

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
This approach works because the component contains only a single return statement, making it possible to use the concise arrow function syntax.
*/
/*
import {useState} from "react"

const Display = ({ counter }) => <div>{counter}</div>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter)

  const increaseByOne = () => {
    console.log('increasing, value before', counter)
    setCounter(counter + 1)
  }

  const decreaseByOne = () => { 
    console.log('decreasing, value before', counter)
    setCounter(counter - 1)
  }

  const setToZero = () => {
    console.log('resetting to zero, value before', counter)
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
} 
export default App
/**/
//LISTA DE TAREAS 66476647
/*
import {useState} from 'react'

const Button = ({onClick,text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  //console.clear()
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);

  const addTask = () => {
    const newTask = task.trim()
    if(newTask==="") return

    const updatedListTask = [...taskList, newTask]
    setTaskList(updatedListTask)
    setTask("")

    //console.log({updatedListTask})
  }

  const deleteTask = (indexToDelete) => {
    setTaskList((prev) =>
      prev.filter((task, index) => index !== indexToDelete)
    )
  }

  const updateTask = (indexToUpdate) => {
    console.log("update")
  }

  return(
    <>
      <h3>Lista tareas</h3>
      <label htmlFor="task">New task </label>
      <input 
        type="text" 
        id="task"
        value={task}
        onChange={(e)=>setTask(e.target.value)}/>
      <Button onClick={addTask} text="addTask"></Button>

      <ul>
        {taskList.map((el, index)=>{
          return(
              <li key={index}>
                {el}{' '}
                <button onClick={() => updateTask(index)}>
                  Update
                </button>
                <button onClick={() => deleteTask(index)}>
                  Delete
                </button>
              </li>
          )
        })}
      </ul>
    </>
  )
}
export default App
/**/
//Chat gpt correction
/*
import { useEffect, useRef, useState } from 'react';

function TaskItem({ task, onEdit, onDelete }) {
  return (
    <li>
      <span>{task.title}</span>{' '}

      <button
        type="button"
        onClick={() => onEdit(task)}
        aria-label={`Editar tarea: ${task.title}`}
      >
        Editar
      </button>{' '}

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Eliminar tarea: ${task.title}`}
      >
        Eliminar
      </button>
    </li>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const inputRef = useRef(null);
  const isEditing = editingTaskId !== null;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    if (isEditing) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title: trimmedTitle }
            : task
        )
      );
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
      };

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);
    }

    cancelEditing();
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setTitle('');
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );

    if (editingTaskId === id) {
      cancelEditing();
    }
  };

  return (
    <main>
      <h1>Lista de tareas</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="task-title">
          {isEditing ? 'Editar tarea ' : 'Nueva tarea '}
        </label>

        <input
          ref={inputRef}
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Escribe una tarea..."
          maxLength={200}
        />

        <button type="submit">
          {isEditing ? 'Guardar cambios' : 'Agregar tarea'}
        </button>

        {isEditing && (
          <button type="button" onClick={cancelEditing}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Tareas ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p>No hay tareas todavía. ¡Agrega la primera!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={startEditing}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
/**/


























/*
Changes in state cause re-rendering
Let's go over the main principles of how an application works once more.

When the application starts, the code in App is executed. This code uses a useState hook to create the application state, setting an initial value of the variable counter. This component contains the Display component - which displays the counter's value, 0 - and three Button components. The buttons all have event handlers, which are used to change the state of the counter.

When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the App component with the setCounter function. Calling a function that changes the state causes the component to re-render.

So, if a user clicks the plus button, the button's event handler changes the value of counter to 1, and the App component is re-rendered. This causes its subcomponents Display and Button to also be re-rendered. Display receives the new value of the counter, 1, as props. The Button components receive event handlers which can be used to change the state of the counter.

To be sure to understand how the program works, let us add some console.log statements to it

const App = () => {
  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter)

  const increaseByOne = () => {
    console.log('increasing, value before', counter)
    setCounter(counter + 1)
  }

  const decreaseByOne = () => { 
    console.log('decreasing, value before', counter)
    setCounter(counter - 1)
  }

  const setToZero = () => {
    console.log('resetting to zero, value before', counter)
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
}
Let us now see what gets rendered to the console when the buttons plus, zero and minus are pressed:

browser showing console with rendering values highlighted
Do not ever try to guess what your code does. It is just better to use console.log and see with your own eyes what it does.
*/
/*
import { useState } from "react"

const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  const [counter, setCounter] = useState(0)

  console.log('rendering with counter value', counter)

  const increaseByOne = () => {

    console.log('increasing, value before', counter)
    setCounter(counter + 1)
  }

  const decreaseByOne = () => { 

    console.log('decreasing, value before', counter)
    setCounter(counter - 1)
  }

  const setToZero = () => {

    console.log('resetting to zero, value before', counter)
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
} 
export default App
/**/
























/*
Passing state - to child components
It's recommended to write React components that are small and reusable across the application and even across projects. Let's refactor our application so that it's composed of three smaller components, one component for displaying the counter and two components for buttons.

Let's first implement a Display component that's responsible for displaying the value of the counter.

One best practice in React is to lift the state up in the component hierarchy. The documentation says:

Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.

So let's place the application's state in the App component and pass it down to the Display component through props:

const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
Using the component is straightforward, as we only need to pass the state of the counter to it:

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}
Everything still works. When the buttons are clicked and the App gets re-rendered, all of its children including the Display component are also re-rendered.

Next, let's make a Button component for the buttons of our application. We have to pass the event handler as well as the title of the button through the component's props:

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
Our App component now looks like this:

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />     
      <Button
        onClick={decreaseByOne}
        text='minus'
      />           
    </div>
  )
}
Since we now have an easily reusable Button component, we've also implemented new functionality into our application by adding a button that can be used to decrement the counter.

The event handler is passed to the Button component through the onClick prop. When creating your own components, you can theoretically choose the prop name freely. However, our naming choice for the event handler was not entirely arbitrary.

React's own official tutorial suggests: "In React, it’s conventional to use onSomething names for props which take functions which handle events and handleSomething for the actual function definitions which handle those events."
*/
/*
import { useState } from "react"

const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>

      <Display counter={counter}/>
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />     
      <Button
        onClick={decreaseByOne}
        text='minus'
      /> 
    </div>
  )
}
export default App
/**/


























/*
An event handler is a function
We define the event handlers for our buttons where we declare their onClick attributes:

<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
What if we tried to define the event handlers in a simpler form?

<button onClick={setCounter(counter + 1)}> 
  plus
</button>
This would completely break our application:

screenshot of re-renders error
What's going on? An event handler is supposed to be either a function or a function reference, and when we write:

<button onClick={setCounter(counter + 1)}>
the event handler is actually a function call. In many situations this is ok, but not in this particular situation. In the beginning, the value of the counter variable is 0. When React renders the component for the first time, it executes the function call setCounter(0+1), and changes the value of the component's state to 1. This will cause the component to be re-rendered, React will execute the setCounter function call again, and the state will change leading to another re-render...

Let's define the event handlers like we did before:

<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
Now the button's attribute which defines what happens when the button is clicked - onClick - has the value () => setCounter(counter + 1). The setCounter function is called only when a user clicks the button.

Usually defining event handlers within JSX-templates is not a good idea. Here it's ok, because our event handlers are so simple.

Let's separate the event handlers into separate functions anyway:

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}>
        zero
      </button>
    </div>
  )
}
Here, the event handlers have been defined correctly. The value of the onClick attribute is a variable containing a reference to a function:

<button onClick={increaseByOne}> 
  plus
</button>
*/
/*
import {useState} from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)


  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)

  return (
    <div>
      <div>{counter}</div>

      <button onClick={increaseByOne}>
        Sumer geiiiison
      </button>

      <button onClick={setToZero}>
        zero gei
      </button>
    </div>
  )
}
export default App
/**/

























/*
Event handling
We have already mentioned the event handlers that are registered to be called when specific events occur a few times in part 0. A user's interaction with the different elements of a web page can cause a collection of various kinds of events to be triggered.

Let's change the application so that increasing the counter happens when a user clicks a button, which is implemented with the button element.

Button elements support so-called mouse events, of which click is the most common event. The click event on a button can also be triggered with the keyboard or a touch screen despite the name mouse event.

In React, registering an event handler function to the click event happens like this:

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {
    console.log('clicked')
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>
        plus
      </button>
    </div>
  )
}
We set the value of the button's onClick attribute to be a reference to the handleClick function defined in the code.

Now every click of the plus button causes the handleClick function to be called, meaning that every click event will log a clicked message to the browser console.

The event handler function can also be defined directly in the value assignment of the onClick-attribute:

const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}>
        plus
      </button>
    </div>
  )
}
By changing the event handler to the following form

<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
we achieve the desired behavior, meaning that the value of counter is increased by one and the component gets re-rendered.

Let's also add a button for resetting the counter:

const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
    </div>
  )
}
Our application is now ready!
*/
/*
import {useState} from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(prev=>prev + 1)}>
        plus
      </button>

      <button onClick={() => setCounter(0)}> 
        zero
      </button>
    </div>
  )
}
export default App
/**/
/*
//RANDOM COLOR-SIZE-ROTATION COUNTER
import { useState } from 'react'
let bandera = 0
const App = () => {

  const [counter, setCounter] = useState(0)
  

  setTimeout(
    ()=>{
      if(counter>250){ bandera=1 }
      if(counter<0){ bandera=0 }
      if(bandera===0){ setCounter(prev=>prev+1) }
      if(bandera===1){ setCounter(prev=>prev-1) }
      
    },
    20
  )
  console.log('rendering...', counter)

  return (
    <p style={{
        fontSize: `${counter}px`,
        color: `rgb(
          ${counter % 256},
          ${(counter * 2) % 256},
          ${(counter * 3) % 256})`,
        rotate: `${counter*-0.9}deg`,
      }}
    >
    {counter}</p>
  )
}

export default App
/**/
























/*
Stateful component
All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.

Next, let's add state to our application's App component with the help of React's state hook.

We will change the application as follows. main.jsx goes back to:

import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
and App.jsx changes to the following:

import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}

export default App
In the first row, the file imports the useState function:

import { useState } from 'react'
The function body that defines the component begins with the function call:

const [ counter, setCounter ] = useState(0)
The function call adds state to the component and renders it initialized with the value zero. The function returns an array that contains two items. We assign the items to the variables counter and setCounter by using the destructuring assignment syntax shown earlier.

The counter variable is assigned the initial value of state, which is zero. The variable setCounter is assigned a function that will be used to modify the state.

The application calls the setTimeout function and passes it two parameters: a function to increment the counter state and a timeout of one second:

setTimeout(
  () => setCounter(counter + 1),
  1000
)
The function passed as the first parameter to the setTimeout function is invoked one second after calling the setTimeout function

() => setCounter(counter + 1)
When the state modifying function setCounter is called, React re-renders the component which means that the function body of the component function gets re-executed:

() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
The second time the component function is executed it calls the useState function and returns the new value of the state: 1. Executing the function body again also makes a new function call to setTimeout, which executes the one-second timeout and increments the counter state again. Because the value of the counter variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of counter to 2.

() => setCounter(2)
Meanwhile, the old value of counter - "1" - is rendered to the screen.

Every time the setCounter modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.

If the component doesn't render when you think it should, or if it renders at the "wrong time", you can debug the application by logging the values of the component's variables to the console. If we make the following additions to our code:

const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter)

  return (
    <div>{counter}</div>
  )
}
It's easy to follow and track the calls made to the App component's render function:

screenshot of rendering log on dev tools
Was your browser console open? If it wasn't, then promise that this was the last time you need to be reminded about it.
*/
/*
import { useState } from 'react'

const App = () => {

  const [counter, setCounter] = useState(0)


  setTimeout(
    () => {
      console.log("SetCounter")
      setCounter(counter + 1)
    },
    3000
  )

  console.log('rendering...', counter)

  return(
    <><p>{counter}</p></>
  )
}

export default App
/**/

























/*
Page re-rendering
Up to this point, our applications have been static — their appearance remains unchanged after the initial rendering. But what if we wanted to create a counter that increases in value, either over time or when a button is clicked?

Let's start with the following. File App.jsx becomes:

const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
And file main.jsx becomes:

import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App counter={counter} />
)
The App component is given the value of the counter via the counter prop. This component renders the value to the screen. What happens when the value of counter changes? Even if we were to add the following

counter += 1
the component won't re-render. We can get the component to re-render by calling the render method a second time, e.g. in the following way:

let counter = 1

const root = ReactDOM.createRoot(document.getElementById('root'))

const refresh = () => {
  root.render(
    <App counter={counter} />
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
The re-rendering command has been wrapped inside of the refresh function to cut down on the amount of copy-pasted code.

Now the component renders three times, first with the value 1, then 2, and finally 3. However, values 1 and 2 are displayed on the screen for such a short amount of time that they can't be noticed.

We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using setInterval:

setInterval(() => {
  refresh()
  counter += 1
}, 1000)
Making repeated calls to the render method is not the recommended way to re-render components. Next, we'll introduce a better way of accomplishing this effect.
*/
/**/

/**/

























/*
Destructuring
Before we move forward, we will take a look at a small but useful feature of the JavaScript language that was added in the ES6 specification, that allows us to destructure values from objects and arrays upon assignment.

In our previous code, we had to reference the data passed to our component as props.name and props.age. Of these two expressions, we had to repeat props.age twice in our code.

Since props is an object

props = {
  name: 'Arto Hellas',
  age: 35,
}
we can streamline our component by assigning the values of the properties directly into two variables name and age which we can then use in our code:

const Hello = (props) => {
  const name = props.name
  const age = props.age

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
Note that we've also utilized the more compact syntax for arrow functions when defining the bornYear function. As mentioned earlier, if an arrow function consists of a single expression, then the function body does not need to be written inside of curly braces. In this more compact form, the function simply returns the result of the single expression.

To recap, the two function definitions shown below are equivalent:

const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
Destructuring makes the assignment of variables even easier since we can use it to extract and gather the values of an object's properties into separate variables:

const Hello = (props) => {
  const { name, age } = props
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
When the object that we are destructuring has the values

props = {
  name: 'Arto Hellas',
  age: 35,
}
the expression const { name, age } = props assigns the values 'Arto Hellas' to name and 35 to age.

We can take destructuring a step further:

const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
The props that are passed to the component are now directly destructured into the variables, name and age.

This means that instead of assigning the entire props object into a variable called props and then assigning its properties to the variables name and age

const Hello = (props) => {
  const { name, age } = props
we assign the values of the properties directly to variables by destructuring the props object that is passed to the component function as a parameter:

const Hello = ({ name, age }) => {
*/
/*
const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 277

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
export default App
/**/
























/*
Compent helper  functions

Let's expand our Hello component so that it guesses the year of birth of the person being greeted:

const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
The logic for guessing the year of birth is encapsulated within a function of its own, which is invoked when the component is rendered.

The person's age does not need to be explicitly passed as a parameter to this function because the function can directly access all the props provided to the component.

If we examine the current code, we notice that the helper function is defined within another function that determines the component's behavior. In Java programming, defining a function within another function can be complex and is uncommon. However, in JavaScript, defining functions within functions is a common and efficient practice.
*/
/*
const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 27

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
export default App
/**/


























/*
P1
c Component state, event handlers
Let's go back to working with React.

We start with a new example:
*/
/*
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
export default App
/**/























/*
object methods and "this" only is javascript no react component
*/
/*
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  doAddition: function(a, b) {
    console.log(a + b)
  },
}

arto.greet()  // "hello, my name is Arto Hellas" gets printed

arto.growOlder = function() {
  this.age += 1
}

console.log(arto.age)   // 35 is printed
arto.growOlder()
console.log(arto.age)   // 36 is printed

arto.doAddition(1, 4)        // 5 is printed

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // 25 is printed

//Now the object has the method doAddition which calculates the sum of numbers given to it as parameters. The method is called in the usual way, using the object arto.doAddition(1, 4) or by storing a method reference in a variable and calling the method through the variable: referenceToAddition(10, 15).
//If we try to do the same with the method greet we run into an issue:


arto.greet()// "hello, my name is Arto Hellas" gets printed

console.log(" referenceTogreet= arto.greet F*CKKK")
const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"


//When calling the method through a reference, the method loses knowledge of what the original this was. Contrary to other languages, in JavaScript the value of this is defined based on how the method is called. When calling the method through a reference, the value of this becomes the so-called global object and the end result is often not what the software developer had originally intended.
//Losing track of this when writing JavaScript code brings forth a few potential issues. Situations often arise where React or Node (or more specifically the JavaScript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course, we avoid these issues by using "this-less" JavaScript.
//One situation leading to the "disappearance" of this arises when we set a timeout to call the greet function on the arto object, using the setTimeout function.

console.log(" Using set timeout arto.greet F*CKKK")
setTimeout(arto.greet, 1000)

//As mentioned, the value of this in JavaScript is defined based on how the method is being called. When setTimeout is calling the method, it is the JavaScript engine that actually calls the method and, at that point, this refers to the global object.
//There are several mechanisms by which the original this can be preserved. One of these is using a method called bind:

console.log(" Fix Using arto.greet.bind(arto) and setTimeout")
setTimeout(arto.greet.bind(arto), 1000)

//Calling arto.greet.bind(arto) creates a new function where this is bound to point to Arto, independent of where and how the method is being called.
//Using arrow functions it is possible to solve some of the problems related to this. They should not, however, be used as methods for objects because then this does not work at all. We will come back later to the behavior of this in relation to arrow functions.
/**/

































/*
P1
b JavaScript

variables
arrays
objects
functions
Exercises 1.3-1.5
Object methods and "this"
classes
JavaScript materials
*/



























/*
P1
a introduction to react

Component
JSX
Multiple components
props: passing data to components
Possible error message
Some notes
Do not render objects
Exercises 1.1.-1.2.
*/



























/*
P0
a general info
b fundamental of web apps
The 1st rule of web development: Always keep the Developer Console open on your web browser. F12.
Make sure that the Network tab is open, and check the Disable cache option.

HTTP GET:
The browser requested the address https://studies.cs.helsinki.fi/exampleapp, using the GET method, and that the request was successful, because the server response had the Status code 200.

Because of the img tag, the browser does a second HTTP request to fetch the image kuva.png from the server.

Traditional web applications:
In traditional web applications, the browser is "dumb". It only fetches HTML data from the server, and all application logic is on the server. A server can be created using Java Spring , Python Flask or Ruby on Rails to name just a few examples.

Running application logic in the browser:
*/