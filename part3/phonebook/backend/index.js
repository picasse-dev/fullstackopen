/*
3.2: Phonebook backend step 2

Implement a page at the address http://localhost:3001/info that looks roughly like this:
Screenshot for 3.2

The page has to show the time that the request was received and how many entries are in the phonebook at the time of processing the request.
*/
/**/
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



