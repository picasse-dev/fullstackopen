# Códigos de estado HTTP: guía práctica para desarrollo backend

## 1. ¿Qué son?

Los códigos de estado HTTP son números que un servidor devuelve para
indicar qué ocurrió al procesar una solicitud.

Por ejemplo:

``` http
GET /api/persons
```

Puede recibir:

``` http
HTTP/1.1 200 OK
Content-Type: application/json
```

El código `200` indica que la solicitud se procesó correctamente.

### Familias de códigos

  -----------------------------------------------------------------------
  Rango                   Categoría               Significado
  ----------------------- ----------------------- -----------------------
  1xx                     Informational           La comunicación
                                                  continúa.

  2xx                     Success                 La solicitud se procesó
                                                  correctamente.

  3xx                     Redirection             Se requiere una acción
                                                  adicional, como seguir
                                                  una redirección o usar
                                                  caché.

  4xx                     Client Error            Hay un problema con la
                                                  solicitud del cliente.

  5xx                     Server Error            El servidor no pudo
                                                  completar una solicitud
                                                  válida.
  -----------------------------------------------------------------------

En el desarrollo de APIs REST, los códigos que más utilizarás son los de
las familias `2xx`, `4xx` y `5xx`.

------------------------------------------------------------------------

## 2. Códigos 1xx --- Informational

Indican que la solicitud fue recibida y que el proceso continúa.
Normalmente los gestiona el protocolo o la infraestructura, no la lógica
habitual de una ruta Express.

  -----------------------------------------------------------------------
  Código                  Nombre                  Uso
  ----------------------- ----------------------- -----------------------
  `100`                   Continue                El cliente puede
                                                  continuar enviando el
                                                  cuerpo de la solicitud.

  `101`                   Switching Protocols     El servidor acepta
                                                  cambiar de protocolo,
                                                  por ejemplo a
                                                  WebSocket.

  `103`                   Early Hints             El servidor envía
                                                  indicaciones
                                                  preliminares para
                                                  preparar recursos.
  -----------------------------------------------------------------------

**En la práctica:** rara vez tendrás que devolver estos códigos
manualmente desde tus rutas.

------------------------------------------------------------------------

## 3. Códigos 2xx --- Success

Indican que la solicitud se procesó correctamente.

  -----------------------------------------------------------------------
  Código                  Nombre                  Cuándo utilizarlo
  ----------------------- ----------------------- -----------------------
  `200`                   OK                      Operación exitosa. Es
                                                  habitual en GET y en
                                                  actualizaciones que
                                                  devuelven el recurso.

  `201`                   Created                 Se creó un recurso
                                                  nuevo, normalmente
                                                  después de POST.

  `202`                   Accepted                El servidor aceptó la
                                                  solicitud, pero todavía
                                                  no terminó de
                                                  procesarla.

  `204`                   No Content              La operación terminó
                                                  correctamente y no hay
                                                  contenido que devolver.
  -----------------------------------------------------------------------

### Ejemplos con Express

**200 --- GET exitoso**

``` javascript
app.get('/api/persons', (request, response) => {
  response.status(200).json(persons)
})
```

También puedes escribir `response.json(persons)`: Express responderá con
`200` si no estableciste otro estado.

**201 --- Recurso creado**

``` javascript
app.post('/api/persons', (request, response) => {
  const person = {
    id: '5',
    name: request.body.name,
    number: request.body.number
  }

  persons = persons.concat(person)
  response.status(201).json(person)
})
```

**202 --- Trabajo aceptado para procesarse después**

``` javascript
response.status(202).json({
  message: 'The request has been accepted for processing'
})
```

Se usa, por ejemplo, cuando una tarea larga se ejecutará en segundo
plano. No significa que el trabajo ya haya terminado.

**204 --- Operación exitosa sin cuerpo**

``` javascript
app.delete('/api/persons/:id', (request, response) => {
  // Eliminar la persona...
  response.status(204).end()
})
```

Con `204` no debes enviar un cuerpo JSON.

------------------------------------------------------------------------

## 4. Códigos 3xx --- Redirection

Indican que el cliente debe realizar otra acción, por ejemplo seguir una
nueva URL o reutilizar una respuesta almacenada en caché.

  -----------------------------------------------------------------------
  Código                  Nombre                  Cuándo utilizarlo
  ----------------------- ----------------------- -----------------------
  `301`                   Moved Permanently       La URL del recurso
                                                  cambió permanentemente.

  `302`                   Found                   El recurso está
                                                  temporalmente en otra
                                                  URL.

  `303`                   See Other               Indica que el cliente
                                                  debe consultar otra
                                                  URL, normalmente
                                                  mediante GET.

  `304`                   Not Modified            El recurso no cambió;
                                                  el cliente puede
                                                  reutilizar su copia en
                                                  caché.

  `307`                   Temporary Redirect      Redirección temporal
                                                  que conserva el método
                                                  HTTP y el cuerpo.

  `308`                   Permanent Redirect      Redirección permanente
                                                  que conserva el método
                                                  HTTP y el cuerpo.
  -----------------------------------------------------------------------

### Diferencias importantes

-   `301` y `308`: redirección permanente.
-   `302` y `307`: redirección temporal.
-   `307` y `308` conservan el método HTTP original.
-   `304` no redirige a otra URL: indica que se puede reutilizar una
    respuesta almacenada en caché.

Ejemplo con Express:

``` javascript
app.get('/old-route', (request, response) => {
  response.redirect(301, '/new-route')
})
```

**En la práctica:** no suelen ser los códigos que más utilizarás en una
API CRUD básica.

------------------------------------------------------------------------

## 5. Códigos 4xx --- Client Error

Indican que existe un problema con la solicitud del cliente. Son
fundamentales para diseñar una API clara.

  -----------------------------------------------------------------------
  Código                  Nombre                  Cuándo utilizarlo
  ----------------------- ----------------------- -----------------------
  `400`                   Bad Request             La solicitud es
                                                  inválida o está mal
                                                  formada; también se usa
                                                  para errores generales
                                                  de validación.

  `401`                   Unauthorized            La solicitud requiere
                                                  autenticación o las
                                                  credenciales no son
                                                  válidas.

  `403`                   Forbidden               El cliente está
                                                  identificado, pero no
                                                  tiene permiso para
                                                  realizar la operación.

  `404`                   Not Found               No se encontró el
                                                  recurso solicitado o la
                                                  ruta no existe.

  `405`                   Method Not Allowed      La ruta existe, pero no
                                                  admite el método HTTP
                                                  utilizado.

  `408`                   Request Timeout         El servidor no recibió
                                                  la solicitud completa
                                                  dentro del tiempo
                                                  permitido.

  `409`                   Conflict                La solicitud entra en
                                                  conflicto con el estado
                                                  actual del recurso o
                                                  del sistema.

  `410`                   Gone                    El recurso ya no está
                                                  disponible y se
                                                  considera eliminado
                                                  permanentemente.

  `413`                   Content Too Large       El cuerpo de la
                                                  solicitud supera el
                                                  tamaño permitido.

  `415`                   Unsupported Media Type  El formato o tipo de
                                                  contenido enviado no es
                                                  compatible.

  `422`                   Unprocessable Content   El contenido está bien
                                                  formado, pero no se
                                                  puede procesar por su
                                                  significado o por
                                                  reglas de validación.

  `429`                   Too Many Requests       El cliente superó el
                                                  límite de solicitudes
                                                  permitido.
  -----------------------------------------------------------------------

### 5.1 Diferencias importantes

#### 400 vs. 422

-   `400 Bad Request`: la solicitud tiene un problema general, por
    ejemplo JSON mal formado o parámetros inválidos.
-   `422 Unprocessable Content`: el servidor entiende el formato, pero
    los datos no cumplen reglas semánticas.

Ejemplo de `400`:

``` javascript
response.status(400).json({
  error: 'Invalid request body'
})
```

Ejemplo de `422`:

``` javascript
response.status(422).json({
  error: 'The email address is not valid'
})
```

Ambos pueden utilizarse para validaciones, según la convención de la
API. Lo importante es mantener un criterio coherente.

#### 401 vs. 403

Imagina una aplicación bancaria:

-   `401 Unauthorized`: el usuario no inició sesión o presentó
    credenciales inválidas.
-   `403 Forbidden`: el usuario inició sesión, pero no tiene permiso
    para consultar esa cuenta.

Para recordarlo:

-   `401`: falta autenticación válida.
-   `403`: hay identidad, pero falta autorización.

#### 404 --- Not Found

Se utiliza cuando el recurso solicitado no existe.

``` javascript
app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === request.params.id)

  if (!person) {
    return response.status(404).end()
  }

  response.json(person)
})
```

#### 409 --- Conflict

Se utiliza cuando la solicitud entra en conflicto con el estado actual
del sistema. Un ejemplo es intentar registrar un nombre que ya existe,
si la aplicación exige nombres únicos.

``` javascript
if (nameExists) {
  return response.status(409).json({
    error: 'The name already exists'
  })
}
```

#### 429 --- Too Many Requests

Se utiliza cuando un cliente supera un límite de solicitudes. Es
habitual en sistemas que implementan *rate limiting* para reducir abusos
o sobrecargas.

------------------------------------------------------------------------

## 6. Códigos 5xx --- Server Error

Indican que el servidor no pudo completar una solicitud que, en
principio, era válida.

  -----------------------------------------------------------------------
  Código                  Nombre                  Cuándo utilizarlo
  ----------------------- ----------------------- -----------------------
  `500`                   Internal Server Error   Error inesperado dentro
                                                  del servidor.

  `501`                   Not Implemented         El servidor no admite
                                                  la funcionalidad
                                                  solicitada.

  `502`                   Bad Gateway             Un servidor
                                                  intermediario recibió
                                                  una respuesta inválida
                                                  de otro servidor.

  `503`                   Service Unavailable     El servidor está
                                                  temporalmente fuera de
                                                  servicio o
                                                  sobrecargado.

  `504`                   Gateway Timeout         Un servidor
                                                  intermediario no
                                                  recibió respuesta a
                                                  tiempo de otro
                                                  servidor.
  -----------------------------------------------------------------------

### Ejemplo de 500 con Express

``` javascript
app.get('/api/example', (request, response) => {
  try {
    // Lógica de la ruta
    response.json({ message: 'Everything is fine' })
  } catch (error) {
    response.status(500).json({
      error: 'Internal Server Error'
    })
  }
})
```

En una aplicación real, suele ser mejor centralizar el manejo de errores
mediante middleware. No es necesario envolver indiscriminadamente cada
ruta en un `try/catch` si ya tienes una estrategia global de errores.

**Importante:** no devuelvas `500` por errores causados por datos
inválidos del cliente. Usa el código 4xx que corresponda.

------------------------------------------------------------------------

## 7. Los 15 códigos que conviene memorizar primero

Esta es una selección práctica para comenzar a desarrollar APIs:

  Código   Nombre                  Ejemplo típico
  -------- ----------------------- ---------------------------------------
  `200`    OK                      GET exitoso.
  `201`    Created                 Recurso creado.
  `204`    No Content              Eliminación exitosa sin respuesta.
  `301`    Moved Permanently       URL cambiada permanentemente.
  `304`    Not Modified            Reutilizar contenido en caché.
  `400`    Bad Request             Solicitud inválida.
  `401`    Unauthorized            Falta autenticación válida.
  `403`    Forbidden               Sin permisos.
  `404`    Not Found               Recurso inexistente.
  `405`    Method Not Allowed      Método HTTP no permitido.
  `409`    Conflict                Conflicto con el estado actual.
  `422`    Unprocessable Content   Datos semánticamente inválidos.
  `429`    Too Many Requests       Demasiadas solicitudes.
  `500`    Internal Server Error   Error interno del servidor.
  `503`    Service Unavailable     Servicio temporalmente no disponible.

No necesitas memorizar todos los códigos. Aprende primero cuándo
utilizar los más habituales y consulta una referencia cuando tengas
dudas.

------------------------------------------------------------------------

## 8. Aplicación práctica en tu Phonebook con Express

Para tu API de contactos, una convención razonable sería:

  -------------------------------------------------------------------------
  Situación               Código                  Ejemplo
  ----------------------- ----------------------- -------------------------
  Listar todas las        `200`                   `GET /api/persons`
  personas correctamente                          

  Consultar una persona   `200`                   `GET /api/persons/1`
  existente                                       

  Crear una persona       `201`                   `POST /api/persons`

  Eliminar una persona    `204`                   `DELETE /api/persons/1`

  Enviar datos            `400`                   `POST /api/persons`
  obligatorios faltantes                          
  o inválidos                                     

  Consultar una persona   `404`                   `GET /api/persons/99`
  inexistente                                     

  Registrar un nombre     `409`                   `POST /api/persons`
  duplicado                                       

  Error inesperado del    `500`                   Cualquier endpoint
  servidor                                        
  -------------------------------------------------------------------------

Ejemplo de un POST con validaciones:

``` javascript
app.post('/api/persons', (request, response) => {
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

  const name = body.name.trim()
  const number = body.number.trim()

  const nameExists = persons.find(
    person => person.name.toLowerCase() === name.toLowerCase()
  )

  if (nameExists) {
    return response.status(409).json({
      error: `The name ${name} already exists`
    })
  }

  const person = {
    id: newId(),
    name,
    number
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})
```

------------------------------------------------------------------------

## 9. Recomendaciones para diseñar APIs

1.  **Sé consistente.** Si decides que los datos inválidos responden con
    `400`, aplica esa convención en toda tu API.
2.  **No uses `200` para todo.** Los códigos ayudan al cliente a
    entender qué ocurrió sin tener que interpretar únicamente el cuerpo
    de la respuesta.
3.  **No confundas autenticación y autorización.** `401` y `403`
    representan situaciones distintas.
4.  **No uses `500` para errores del cliente.** Un dato inválido no es
    un fallo interno del servidor.
5.  **Devuelve mensajes útiles.** Puedes acompañar los códigos con un
    objeto JSON que explique el error.
6.  **Documenta tu API.** Indica qué códigos puede devolver cada
    endpoint.
7.  **No expongas información sensible.** En producción, evita enviar
    trazas internas, rutas privadas o detalles de la infraestructura en
    los mensajes de error.

------------------------------------------------------------------------

## 10. Mini quiz para practicar

Intenta responder estas situaciones antes de consultar las soluciones.

1.  Un cliente consulta `/api/persons/99`, pero esa persona no existe.
2.  Un usuario intenta registrar un nombre que ya está registrado y la
    aplicación exige nombres únicos.
3.  Un usuario intenta acceder a una ruta protegida sin haber iniciado
    sesión.
4.  Un usuario inició sesión, pero no tiene permiso para consultar un
    recurso.
5.  Se crea correctamente una persona nueva.
6.  Se elimina correctamente una persona y no se devuelve contenido.
7.  El servidor encuentra un error inesperado que no puede manejar.
8.  Un cliente realiza demasiadas solicitudes en poco tiempo.

### Soluciones

1.  `404 Not Found`.
2.  `409 Conflict`.
3.  `401 Unauthorized`.
4.  `403 Forbidden`.
5.  `201 Created`.
6.  `204 No Content`.
7.  `500 Internal Server Error`.
8.  `429 Too Many Requests`.

------------------------------------------------------------------------

## 11. Referencia oficial

Para consultar la lista completa y actualizada de códigos de estado
HTTP:

-   [MDN --- HTTP response status
    codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
-   [RFC 9110 --- HTTP
    Semantics](https://www.rfc-editor.org/rfc/rfc9110)

**Idea clave:** los códigos HTTP son parte del estándar HTTP, no de
Express ni de JavaScript. Los encontrarás en prácticamente cualquier
tecnología backend: Node.js, Java, Python, Go, PHP, .NET y muchas más.
