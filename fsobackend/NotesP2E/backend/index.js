const express = require('express')
const morgan = require('morgan')
const app = express()

// ---------- MIDDLEWARES ----------
// Morgan muestra el body solo en POST, PUT y PATCH
morgan.token('body', (request) =>
  ['POST', 'PUT', 'PATCH'].includes(request.method)
    ? JSON.stringify(request.body)
    : '-'
)

// Morgan va antes de express.json para que también registre los JSON mal formados
app.use(morgan(':method :url :status :res[content-length] - :response-time ms | body: :body'))
app.use(express.json())
app.use(express.static('dist'))

// ---------- DATA ----------
let notes = [
  { id: '1', content: 'HTML is easy', important: true },
  { id: '2', content: 'Browser can execute only JavaScript', important: false },
  { id: '3', content: 'GET and POST are the most important methods of HTTP protocol', important: true },
  { id: '4', content: 'Serving static files from the backend', important: true }
]

// ---------- HELPERS ----------
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// excludeId sirve para PUT y PATCH: una nota no cuenta como duplicado de sí misma
const findDuplicateNote = (text, excludeId) =>
  notes.find(n =>
    n.id !== excludeId &&
    n.content.toLowerCase() === text.toLowerCase()
  )

/**
 * Valida el body recibido.
 * - POST:  content obligatorio, important opcional (por defecto false)
 * - PUT:   content e important obligatorios (reemplaza el recurso completo)
 * - PATCH: al menos uno de los dos (actualización parcial)
 * Devuelve { errors, data }. Solo se copian los campos conocidos.
 */
const validateNoteBody = (body, mode) => {
  const errors = []
  const data = {}

  if (!isPlainObject(body)) {
    return { errors: ['Request body must be a JSON object'], data }
  }

  const hasContent = body.content !== undefined
  const hasImportant = body.important !== undefined

  // content
  if (hasContent) {
    if (typeof body.content !== 'string' || body.content.trim() === '') {
      errors.push('"content" must be a non-empty string')
    } else {
      data.content = body.content.trim()
    }
  } else if (mode === 'POST' || mode === 'PUT') {
    errors.push('"content" is required')
  }

  // important
  if (hasImportant) {
    if (typeof body.important !== 'boolean') {
      errors.push('"important" must be a boolean')
    } else {
      data.important = body.important
    }
  } else if (mode === 'PUT') {
    errors.push('"important" is required')
  } else if (mode === 'POST') {
    data.important = false
  }

  if (mode === 'PATCH' && !hasContent && !hasImportant) {
    errors.push('At least one of "content" or "important" must be provided')
  }

  return { errors, data }
}

const sendValidationError = (response, errors) =>
  response.status(400).json({ error: 'Validation failed', details: errors })

const sendNotFound = (response) =>
  response.status(404).json({ error: 'Note not found' })

const sendDuplicate = (response, duplicate) =>
  response.status(409).json({ error: 'Note already exists', existingId: duplicate.id })

// ---------- ROUTES ----------
// GET all -> 200
app.get('/api/notes', (request, response) => {
  response.status(200).json(notes)
})

// GET one -> 200 | 404
app.get('/api/notes/:id', (request, response) => {
  const note = notes.find(n => n.id === request.params.id)
  if (!note) return sendNotFound(response)

  response.status(200).json(note)
})

// POST -> 201 | 400 | 409
app.post('/api/notes', (request, response) => {
  const { errors, data } = validateNoteBody(request.body, 'POST')
  if (errors.length > 0) return sendValidationError(response, errors)

  const duplicate = findDuplicateNote(data.content)
  if (duplicate) return sendDuplicate(response, duplicate)

  const newNote = { id: generateId(), ...data }
  notes = notes.concat(newNote)

  response
    .status(201)
    .location(`/api/notes/${newNote.id}`)
    .json(newNote)
})

// PUT (reemplazo completo) -> 200 | 400 | 404 | 409
app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  if (!notes.some(n => n.id === id)) return sendNotFound(response)

  const { errors, data } = validateNoteBody(request.body, 'PUT')
  if (errors.length > 0) return sendValidationError(response, errors)

  const duplicate = findDuplicateNote(data.content, id)
  if (duplicate) return sendDuplicate(response, duplicate)

  const updatedNote = { id, ...data }
  notes = notes.map(n => (n.id === id ? updatedNote : n))

  response.status(200).json(updatedNote)
})

// PATCH (actualización parcial) -> 200 | 400 | 404 | 409
app.patch('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const existingNote = notes.find(n => n.id === id)
  if (!existingNote) return sendNotFound(response)

  const { errors, data } = validateNoteBody(request.body, 'PATCH')
  if (errors.length > 0) return sendValidationError(response, errors)

  if (data.content !== undefined) {
    const duplicate = findDuplicateNote(data.content, id)
    if (duplicate) return sendDuplicate(response, duplicate)
  }

  const updatedNote = { ...existingNote, ...data }
  notes = notes.map(n => (n.id === id ? updatedNote : n))

  response.status(200).json(updatedNote)
})

// DELETE -> 204 | 404
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  if (!notes.some(n => n.id === id)) return sendNotFound(response)

  notes = notes.filter(n => n.id !== id)
  response.status(204).end()
})

// ---------- ERROR HANDLING ----------
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Unknown endpoint' })
}

// Debe ir después de las rutas y de unknownEndpoint, con 4 parámetros
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // JSON mal formado enviado por el cliente
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Malformed JSON' })
  }

  // Body demasiado grande
  if (error.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Payload too large' })
  }

  // Cualquier otro error inesperado
  response.status(500).json({ error: 'Internal server error' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

// ---------- SERVER ----------
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})









































////Wtf with this code, ugly, complex...
// "use strict";

// const express = require("express");
// const morgan = require("morgan");

// const PORT = process.env.PORT || 3001;
// const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// /* -------------------------------------------------------------------------- */
// /*  Datos (en memoria)                                                        */
// /* -------------------------------------------------------------------------- */

// let notes = [
//   { id: "1", content: "HTML is easy", important: true },
//   { id: "2", content: "Browser can execute only JavaScript", important: false },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true,
//   },
//   { id: "4", content: "Serving static files from the backend", important: true },
// ];

// /* -------------------------------------------------------------------------- */
// /*  Utilidades                                                                */
// /* -------------------------------------------------------------------------- */

// const CONTENT_MIN = 5;
// const CONTENT_MAX = 500;
// const ALLOWED_FIELDS = ["content", "important"];

// class HttpError extends Error {
//   constructor(status, message, details) {
//     super(message);
//     this.status = status;
//     this.details = details;
//   }
// }

// const isPlainObject = (v) =>
//   v !== null && typeof v === "object" && !Array.isArray(v);

// // "  Hola   MUNDO " -> "hola mundo" (para detectar duplicados)
// const normalize = (text) => text.trim().replace(/\s+/g, " ").toLowerCase();

// const generateId = () => {
//   const maxId = notes.reduce((max, n) => Math.max(max, Number(n.id) || 0), 0);
//   return String(maxId + 1);
// };

// const findIndexById = (id) => notes.findIndex((n) => n.id === id);

// const findDuplicate = (content, excludeId = null) => {
//   const target = normalize(content);
//   return notes.find((n) => n.id !== excludeId && normalize(n.content) === target);
// };

// /**
//  * Valida el cuerpo de la petición.
//  * - mode "full"    -> POST / PUT: `content` obligatorio.
//  * - mode "partial" -> PATCH: al menos un campo.
//  * Devuelve { errors, data } con los datos ya saneados.
//  */
// const validateNoteBody = (body, mode) => {
//   const errors = [];
//   const data = {};

//   if (!isPlainObject(body)) {
//     throw new HttpError(400, "El cuerpo debe ser un objeto JSON");
//   }

//   const unknown = Object.keys(body).filter((k) => !ALLOWED_FIELDS.includes(k));
//   if (unknown.length) {
//     errors.push(`Campos no permitidos: ${unknown.join(", ")}`);
//   }

//   if (mode === "partial" && !ALLOWED_FIELDS.some((f) => f in body)) {
//     errors.push("Debes enviar al menos un campo: content o important");
//   }

//   if ("content" in body) {
//     if (typeof body.content !== "string") {
//       errors.push("content debe ser un string");
//     } else {
//       const content = body.content.trim().replace(/\s+/g, " ");
//       if (content.length < CONTENT_MIN) {
//         errors.push(`content debe tener al menos ${CONTENT_MIN} caracteres`);
//       } else if (content.length > CONTENT_MAX) {
//         errors.push(`content no puede superar ${CONTENT_MAX} caracteres`);
//       } else {
//         data.content = content;
//       }
//     }
//   } else if (mode === "full") {
//     errors.push("content es obligatorio");
//   }

//   if ("important" in body) {
//     if (typeof body.important !== "boolean") {
//       errors.push("important debe ser un booleano (true/false)");
//     } else {
//       data.important = body.important;
//     }
//   }

//   return { errors, data };
// };

// /* -------------------------------------------------------------------------- */
// /*  Middlewares                                                               */
// /* -------------------------------------------------------------------------- */

// // Morgan: el body solo se muestra en peticiones que lo llevan
// morgan.token("body", (req) =>
//   ["POST", "PUT", "PATCH"].includes(req.method) && req.body !== undefined
//     ? JSON.stringify(req.body)
//     : "-"
// );

// const cors = (req, res, next) => {
//   res.set({
//     "Access-Control-Allow-Origin": CORS_ORIGIN,
//     "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type",
//   });
//   if (req.method === "OPTIONS") return res.sendStatus(204);
//   next();
// };

// // POST / PUT / PATCH deben enviar application/json
// const requireJson = (req, res, next) => {
//   if (!req.is("application/json")) {
//     return next(
//       new HttpError(415, "Content-Type no soportado. Usa application/json")
//     );
//   }
//   next();
// };

// // Los ids de este recurso son numéricos (guardados como string)
// const validateIdParam = (req, res, next, id) => {
//   if (!/^\d+$/.test(id)) {
//     return next(new HttpError(400, `El id '${id}' no es válido`));
//   }
//   next();
// };

// const methodNotAllowed = (allowed) => (req, res, next) => {
//   res.set("Allow", allowed.join(", "));
//   next(new HttpError(405, `Método ${req.method} no permitido en ${req.baseUrl}${req.path}`));
// };

// /* -------------------------------------------------------------------------- */
// /*  Rutas /api/notes                                                          */
// /* -------------------------------------------------------------------------- */

// const router = express.Router();
// router.param("id", validateIdParam);

// // GET /api/notes?important=true&search=html
// router.get("/", (req, res, next) => {
//   let result = notes;
//   const { important, search } = req.query;

//   if (important !== undefined) {
//     if (important !== "true" && important !== "false") {
//       return next(new HttpError(400, "El filtro important debe ser true o false"));
//     }
//     result = result.filter((n) => n.important === (important === "true"));
//   }

//   if (typeof search === "string" && search.trim()) {
//     const term = search.trim().toLowerCase();
//     result = result.filter((n) => n.content.toLowerCase().includes(term));
//   }

//   res.status(200).json(result);
// });

// // POST /api/notes
// router.post("/", requireJson, (req, res, next) => {
//   const { errors, data } = validateNoteBody(req.body, "full");
//   if (errors.length) {
//     return next(new HttpError(400, "Datos inválidos", errors));
//   }

//   const duplicate = findDuplicate(data.content);
//   if (duplicate) {
//     return next(
//       new HttpError(409, "Ya existe una nota con ese contenido", {
//         existingId: duplicate.id,
//       })
//     );
//   }

//   const note = {
//     id: generateId(),
//     content: data.content,
//     important: data.important ?? false,
//   };
//   notes.push(note);

//   res.status(201).location(`${req.baseUrl}/${note.id}`).json(note);
// });

// router.all("/", methodNotAllowed(["GET", "POST", "OPTIONS"]));

// // GET /api/notes/:id
// router.get("/:id", (req, res, next) => {
//   const note = notes.find((n) => n.id === req.params.id);
//   if (!note) return next(new HttpError(404, `Nota con id ${req.params.id} no encontrada`));
//   res.status(200).json(note);
// });

// // PUT /api/notes/:id  -> reemplazo completo
// router.put("/:id", requireJson, (req, res, next) => {
//   const index = findIndexById(req.params.id);
//   if (index === -1) {
//     return next(new HttpError(404, `Nota con id ${req.params.id} no encontrada`));
//   }

//   const { errors, data } = validateNoteBody(req.body, "full");
//   if (errors.length) {
//     return next(new HttpError(400, "Datos inválidos", errors));
//   }

//   const duplicate = findDuplicate(data.content, req.params.id);
//   if (duplicate) {
//     return next(
//       new HttpError(409, "Ya existe otra nota con ese contenido", {
//         existingId: duplicate.id,
//       })
//     );
//   }

//   const updated = {
//     id: req.params.id,
//     content: data.content,
//     important: data.important ?? false, // PUT reemplaza: lo omitido vuelve al valor por defecto
//   };
//   notes[index] = updated;

//   res.status(200).json(updated);
// });

// // PATCH /api/notes/:id  -> actualización parcial
// router.patch("/:id", requireJson, (req, res, next) => {
//   const index = findIndexById(req.params.id);
//   if (index === -1) {
//     return next(new HttpError(404, `Nota con id ${req.params.id} no encontrada`));
//   }

//   const { errors, data } = validateNoteBody(req.body, "partial");
//   if (errors.length) {
//     return next(new HttpError(400, "Datos inválidos", errors));
//   }

//   if (data.content !== undefined) {
//     const duplicate = findDuplicate(data.content, req.params.id);
//     if (duplicate) {
//       return next(
//         new HttpError(409, "Ya existe otra nota con ese contenido", {
//           existingId: duplicate.id,
//         })
//       );
//     }
//   }

//   const updated = { ...notes[index], ...data };
//   notes[index] = updated;

//   res.status(200).json(updated);
// });

// // DELETE /api/notes/:id
// router.delete("/:id", (req, res, next) => {
//   const index = findIndexById(req.params.id);
//   if (index === -1) {
//     return next(new HttpError(404, `Nota con id ${req.params.id} no encontrada`));
//   }
//   notes.splice(index, 1);
//   res.sendStatus(204);
// });

// router.all("/:id", methodNotAllowed(["GET", "PUT", "PATCH", "DELETE", "OPTIONS"]));

// /* -------------------------------------------------------------------------- */
// /*  App                                                                       */
// /* -------------------------------------------------------------------------- */

// const app = express();
// app.disable("x-powered-by");

// app.use(morgan(":method :url :status :res[content-length] - :response-time ms | body: :body"));
// app.use(cors);
// app.use(express.json({ limit: "10kb" }));

// app.use("/api/notes", router);

// // 404 para cualquier ruta no definida
// app.use((req, res, next) => {
//   next(new HttpError(404, `Ruta ${req.method} ${req.originalUrl} no encontrada`));
// });

// // Manejador central de errores (debe ir al final y tener 4 argumentos)
// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   // Errores del body-parser de Express
//   if (err.type === "entity.parse.failed") {
//     err = new HttpError(400, "JSON malformado");
//   } else if (err.type === "entity.too.large") {
//     err = new HttpError(413, "El cuerpo de la petición es demasiado grande");
//   }

//   const status = err instanceof HttpError ? err.status : 500;
//   if (status === 500) console.error(err);

//   const body = {
//     error: status === 500 ? "Error interno del servidor" : err.message,
//   };
//   if (err.details) body.details = err.details;

//   res.status(status).json(body);
// });

// if (require.main === module) {
//   app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}/api/notes`));
// }

// module.exports = app;





































/*
//Hay q arreglar que esta mierda cuando el front manda el put, aca obviamente aun no se implementó, por lo tanto el servidor manda un error el cual el front va a catchear y va a borrar de la lista local(la del state) el objeto que se solicito actualizar, mientras que en el servidor sigue el objeto, man basicamante hay un conflicto de manejo de codigos de error y solicitudes del front/metodos que las reciben en el backend
const express = require('express')
const app = express()

const requestLogger = (request, response, next) => { 
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
//MIDDLEWARES DECLARATIONS
app.use(express.json())
app.use(requestLogger)


let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  },
  {
    id: "4",
    content: "Serving static files from the backend",
    important: true
  }
]

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id 
  const note = notes.find(note => note.id === id)
  
  if(note){
    response.json(note)
  }else{
    response.status(404).end()
  }
})
 
app.delete('/api/notes/:id', (request, response) => { 
  const id = request.params.id 
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(note => Number(note.id))) 
  : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body 
  if(!body.content){
    return response.status(400).json({
      error: 'conent missing'
    })
  }
  
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }
  
  notes = notes.concat(note)
  
  response.json(note) 
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknowwwwn endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on portt ${PORT}`)
})
*/