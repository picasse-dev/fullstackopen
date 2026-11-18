/*
3.8*: Phonebook backend step 8

Configure morgan so that it also shows the data sent in HTTP POST requests:
terminal showing post data being sent

Note that logging data even in the console can be dangerous since it can contain sensitive data and may violate local privacy law (e.g. GDPR in EU) or business-standard. In this exercise, you don't have to worry about privacy issues, but in practice, try not to log any sensitive data.

This exercise can be quite challenging, even though the solution does not require a lot of code.

This exercise can be completed in a few different ways. One of the possible solutions utilizes these two techniques:

    creating new tokens
    JSON.stringify

*/
/**/
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')//1. npm install cors, 2. Esto, sí.


const app = express()

app.use(cors())// 3. Esto. 4. en el Archivo del front en ../services/persons.js cambiamos la URL-> const baseUrl = 'http://localhost:3001/api/persons'//4. Cambiamos esto tambien

app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH'
    ? JSON.stringify(req.body)
    : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      id: "2", //Crazy but ok
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "5",
      "name": "Cors Caradvg", 
      "number": "2222222222"
    }
]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/info',(request, response) => {
  const date = new Date()
  const info = `Phonebook has info for ${persons.length} people \n ${date}`
  response.type('text/plain').send(info) //Texto plano para conservar el \n
})

app.get('/api/persons/:id',(request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const deletedPerson = persons.find(person => person.id === id)
  if(!deletedPerson) return response.status(404).end()
  persons = persons.filter(person => person !== deletedPerson)
  response.status(204).end()
})

const newId = () => Math.floor(Math.random()*1e15).toString()

app.post('/api/persons',(request, response) => {

  const body = request.body

  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.number !== 'string' ||
    !body.name.trim() ||
    !body.number.trim()
  ) {
    return response.status(400).json({
      error: 'name or number missing or invalid'
    })
  }

  const nameExists = persons.find(
    person => person.name.trim().toLowerCase() === body.name.trim().toLowerCase()
  )

  if(nameExists) return response.status(409).json({
    error: `Error: The name: ${body.name.trim().toLowerCase()} already exists`
  })

  const person = {
    id: newId(),
    name: body.name.trim(),
    number: body.number.trim()
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

app.put('/api/persons/:id',(request, response) => {

  const id = request.params.id //Viene de la url del put
  const body = request.body

  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.number !== 'string' ||
    !body.name.trim() ||
    !body.number.trim()
  ) {
    return response.status(400).json({ //400 Bad Request: los datos enviados son incorrectos.
      error: 'name or number missing or invalid'
    })
  }

  const personExist = persons.find(person => person.id === id)
  if(!personExist) return response.status(404).json({error:'user id not found'}) //404 Not Found: el recurso que intentas actualizar no existe.

  const updatedPerson = {
    ...personExist,
    name: body.name.trim(),
    number: body.number.trim()
  }

  persons = persons.map(person =>
    person.id === id ?
    updatedPerson :
    person
  )

  response.json(updatedPerson)
})

app.patch('/api/persons/:id',(request, response) => {

  const id = request.params.id //Viene de la url del put
  const body = request.body

  // Validate only the fields provided
  if (
    (body.name !== undefined &&
      (typeof body.name !== 'string' || !body.name.trim())) ||
    (body.number !== undefined &&
      (typeof body.number !== 'string' || !body.number.trim()))
  ) {
    return response.status(400).json({
      error: 'invalid name or number'
    })
  }

  const personExist = persons.find(person => person.id === id)
  if(!personExist) return response.status(404).json({error:'user id not found'}) //404 Not Found: el recurso que intentas actualizar no existe.

  const updatedPerson = { //Claro ahi esta el iio, hay que ser si se envio eso o no y segun eso actualizar
    ...personExist,
    name: body.name ? body.name.trim() : personExist.name,
    number: body.number ? body.number.trim() : personExist.number
  }

  persons = persons.map(person =>
    person.id === id ?
    updatedPerson :
    person
  )

  response.json(updatedPerson)
})

//const PORT = 3001  //normal
const PORT = process.env.PORT || 3001 //for RENDER.COM
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
/**/






























/*
3.7: Phonebook backend step 7

Add the morgan middleware to your application for logging. Configure it to log messages to your console based on the tiny configuration.

The documentation for Morgan is not the best, and you may have to spend some time figuring out how to configure it correctly. However, most documentation in the world falls under the same category, so it's good to learn to decipher and interpret cryptic documentation in any case.

Morgan is installed just like all other libraries with the npm install command. Taking morgan into use happens the same way as configuring any other middleware by using the app.use command.
*/
/*
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('dev'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      id: "2", //Crazy but ok
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/info',(request, response) => {
  const date = new Date()
  const info = `Phonebook has info for ${persons.length} people \n ${date}`
  response.type('text/plain').send(info) //Texto plano para conservar el \n
})

app.get('/api/persons/:id',(request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const deletedPerson = persons.find(person => person.id === id)
  if(!deletedPerson) return response.status(404).end()
  persons = persons.filter(person => person !== deletedPerson)
  response.status(204).end()
})

const newId = () => Math.floor(Math.random()*1e15).toString()

app.post('/api/persons',(request, response) => {

  const body = request.body

  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.number !== 'string' ||
    !body.name.trim() ||
    !body.number.trim()
  ) {
    return response.status(400).json({
      error: 'name or number missing or invalid'
    })
  }

  const nameExists = persons.find(
    person => person.name.trim().toLowerCase() === body.name.trim().toLowerCase()
  )

  if(nameExists) return response.status(409).json({
    error: `Error: The name: ${body.name.trim().toLowerCase()} already exists`
  })

  const person = {
    id: newId(),
    name: body.name.trim(),
    number: body.number.trim()
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

app.put('/api/persons/:id',(request, response) => {

  const id = request.params.id //Viene de la url del put
  const body = request.body

  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.number !== 'string' ||
    !body.name.trim() ||
    !body.number.trim()
  ) {
    return response.status(400).json({ //400 Bad Request: los datos enviados son incorrectos.
      error: 'name or number missing or invalid'
    })
  }

  const personExist = persons.find(person => person.id === id)
  if(!personExist) return response.status(404).json({error:'user id not found'}) //404 Not Found: el recurso que intentas actualizar no existe.

  const updatedPerson = {
    ...personExist,
    name: body.name.trim(),
    number: body.number.trim()
  }

  persons = persons.map(person =>
    person.id === id ?
    updatedPerson :
    person
  )

  response.json(updatedPerson)
})

app.patch('/api/persons/:id',(request, response) => {

  const id = request.params.id //Viene de la url del put
  const body = request.body

  // Validate only the fields provided
  if (
    (body.name !== undefined &&
      (typeof body.name !== 'string' || !body.name.trim())) ||
    (body.number !== undefined &&
      (typeof body.number !== 'string' || !body.number.trim()))
  ) {
    return response.status(400).json({
      error: 'invalid name or number'
    })
  }

  const personExist = persons.find(person => person.id === id)
  if(!personExist) return response.status(404).json({error:'user id not found'}) //404 Not Found: el recurso que intentas actualizar no existe.

  const updatedPerson = { //Claro ahi esta el iio, hay que ser si se envio eso o no y segun eso actualizar
    ...personExist,
    name: body.name ? body.name.trim() : personExist.name,
    number: body.number ? body.number.trim() : personExist.number
  }

  persons = persons.map(person =>
    person.id === id ?
    updatedPerson :
    person
  )

  response.json(updatedPerson)
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
/**/


























/*
3.6: Phonebook backend step 6

Implement error handling for creating new entries. The request is not allowed to succeed, if:

    The name or number is missing
    The name already exists in the phonebook

Respond to requests like these with the appropriate status code, and also send back information that explains the reason for the error, e.g.:

{ error: 'name must be unique' }
*/
/*
const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      id: "2", //Crazy but ok
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/info',(request, response) => {
  const date = new Date()
  const info = `Phonebook has info for ${persons.length} people \n ${date}`
  response.type('text/plain').send(info) //Texto plano para conservar el \n
})

app.get('/api/persons/:id',(request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const deletedPerson = persons.find(person => person.id === id)
  if(!deletedPerson) return response.status(404).end()
  persons = persons.filter(person => person !== deletedPerson)
  response.status(204).end()
})

const newId = () => Math.floor(Math.random()*1e15).toString()

app.post('/api/persons',(request, response) => {

  const body = request.body

  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.number !== 'string' ||
    !body.name.trim() ||
    !body.number.trim()
  ) {
    return response.status(400).json({
      error: 'name or number missing or invalid'
    })
  }

  const nameExists = persons.find(
    person => person.name.trim().toLowerCase() === body.name.trim().toLowerCase()
  )

  if(nameExists) return response.status(409).json({
    error: `Error: The name: ${body.name.trim().toLowerCase()} already exists`
  })

  const person = {
    id: newId(),
    name: body.name.trim(),
    number: body.number.trim()
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

app.put('/api/persons/:id',(request, response) => {

  const id = request.params.id //Viene de la url del put
  const body = request.body

  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.number !== 'string' ||
    !body.name.trim() ||
    !body.number.trim()
  ) {
    return response.status(400).json({ //400 Bad Request: los datos enviados son incorrectos.
      error: 'name or number missing or invalid'
    })
  }

  const personExist = persons.find(person => person.id === id)
  if(!personExist) return response.status(404).json({error:'user id not found'}) //404 Not Found: el recurso que intentas actualizar no existe.

  const updatedPerson = {
    ...personExist,
    name: body.name.trim(),
    number: body.number.trim()
  }

  persons = persons.map(person =>
    person.id === id ?
    updatedPerson :
    person
  )

  response.json(updatedPerson)
})

app.patch('/api/persons/:id',(request, response) => {

  const id = request.params.id //Viene de la url del put
  const body = request.body

  // Validate only the fields provided
  if (
    (body.name !== undefined &&
      (typeof body.name !== 'string' || !body.name.trim())) ||
    (body.number !== undefined &&
      (typeof body.number !== 'string' || !body.number.trim()))
  ) {
    return response.status(400).json({
      error: 'invalid name or number'
    })
  }

  const personExist = persons.find(person => person.id === id)
  if(!personExist) return response.status(404).json({error:'user id not found'}) //404 Not Found: el recurso que intentas actualizar no existe.

  const updatedPerson = { //Claro ahi esta el iio, hay que ser si se envio eso o no y segun eso actualizar
    ...personExist,
    name: body.name ? body.name.trim() : personExist.name,
    number: body.number ? body.number.trim() : personExist.number
  }

  persons = persons.map(person =>
    person.id === id ?
    updatedPerson :
    person
  )

  response.json(updatedPerson)
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
/**/












































/*
3.5: Phonebook backend step 5

Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address http://localhost:3001/api/persons.

Generate a new id for the phonebook entry with the Math.random function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.
*/
/**
const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      id: "2", //Crazy but ok
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/info',(request, response) => {
  const date = new Date()
  const info = `Phonebook has info for ${persons.length} people \n ${date}`
  response.type('text/plain').send(info) //Texto plano para conservar el \n
})

app.get('/api/persons/:id',(request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const deletedPerson = persons.find(person => person.id === id)
  if(!deletedPerson) return response.status(404).end()
  persons = persons.filter(person => person !== deletedPerson)
  response.status(204).end()
})

const newId = () => Math.floor(Math.random()*1e15).toString()

app.post('/api/persons',(request, response) => {
  const body = request.body

  const person = {
    id: newId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
/**/

































/*
3.4: Phonebook backend step 4

Implement functionality that makes it possible to delete a single phonebook entry by making an HTTP DELETE request to the unique URL of that phonebook entry.

Test that your functionality works with either Postman or the Visual Studio Code REST client.
*/
/*
const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      id: "2", //Crazy but ok
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/info',(request, response) => {
  const date = new Date()
  const info = `Phonebook has info for ${persons.length} people \n ${date}`
  response.type('text/plain').send(info) //Texto plano para conservar el \n
})

app.get('/api/persons/:id',(request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const deletedPerson = persons.find(person => person.id === id)
  if(!deletedPerson) return response.status(404).end()
  persons = persons.filter(person => person !== deletedPerson)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
/**/


































/*
3.3: Phonebook backend step 3

Implement the functionality for displaying the information for a single phonebook entry. The url for getting the data for a person with the id 5 should be http://localhost:3001/api/persons/5

If an entry for the given id is not found, the server has to respond with the appropriate status code.
*/
/*
const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      id: "2", //Crazy but ok
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/info',(request, response) => {
  const date = new Date()
  const info = `Phonebook has info for ${persons.length} people \n ${date}`
  response.type('text/plain').send(info) //Texto plano para conservar el \n
})

app.get('/api/persons/:id',(request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(!person) return response.status(404).end()
  response.json(person)
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
/**/



























/*
3.2: Phonebook backend step 2

Implement a page at the address http://localhost:3001/info that looks roughly like this:
Screenshot for 3.2

The page has to show the time that the request was received and how many entries are in the phonebook at the time of processing the request.
*/
/*
const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      id: "2", //Crazy but ok
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/info',(request, response) => {
  const date = new Date()
  const info = `Phonebook has info for ${persons.length} people \n ${date}`
  response.type('text/plain').send(info) //Texto plano para conservar el \n
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
/**/




























/*
3.1: Phonebook backend step 1

Implement a Node application that returns a hardcoded list of phonebook entries from the address http://localhost:3001/api/persons.

Data:

[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
copy

Output in the browser after GET request:
JSON data of 4 people in browser from api/persons

Notice that the forward slash in the route api/persons is not a special character, and is just like any other character in the string.

The application must be started with the command npm start.

The application must also offer an npm run dev command that will run the application and restart the server whenever changes are made and saved to a file in the source code.
*/
/*
const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      id: "2", //Crazy but ok
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
/**/



