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
Streamlining deploying of the frontend

To create a new production build of the frontend without extra manual work, let's add some npm-scripts to the package.json of the backend repository.
Fly.io script

The scripts look like this:

{
  "scripts": {
    // ...
    "build:ui": "rm -rf dist && cd ../notes-frontend/ && npm run build && cp -r dist ../notes-backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",    
    "logs:prod": "fly logs"
  }
}
copy

The script npm run build:ui builds the frontend and copies the production version under the backend repository. The script npm run deploy releases the current backend to Fly.io.

npm run deploy:full combines these two scripts, i.e., npm run build:ui and npm run deploy.

There is also a script npm run logs:prod to show the Fly.io logs.

Note that the directory paths in the script build:ui depend on the location of the frontend and backend directories in the file system.
Note for Windows users

Note that the standard shell commands in build:ui do not natively work in Windows. Powershell in Windows works differently, in which case the script could be written as

"build:ui": "@powershell Remove-Item -Recurse -Force dist && cd ../frontend && npm run build && @powershell Copy-Item dist -Recurse ../backend",
copy

If the script does not work on Windows, confirm that you are using Powershell and not Command Prompt. If you have installed Git Bash or another Linux-like terminal, you may be able to run Linux-like commands on Windows as well.
Render

Note: When you attempt to deploy your backend to Render, make sure you have a separate repository for the backend and deploy that github repo through Render, attempting to deploy through your Fullstackopen repository will often throw "ERR path ....package.json".

In case of Render, the scripts look like the following

{
  "scripts": {
    //...
    "build:ui": "rm -rf dist && cd ../frontend && npm run build && cp -r dist ../backend",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
  }
}
copy

The script npm run build:ui builds the frontend and copies the production version under the backend repository. npm run deploy:full contains also the necessary git commands to update the backend repository.

Note that the directory paths in the script build:ui depend on the location of the frontend and backend directories in the file system.

    NB On Windows, npm scripts are executed in cmd.exe as the default shell which does not support bash commands. For the above bash commands to work, you can change the default shell to Bash (in the default Git for Windows installation) as follows:

npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
copy

Another option is the use of shx.
*/
/**/

/**/
































/*
The whole app to the internet

After ensuring that the production version of the application works locally, we are ready to move the whole application to the selected host service.

In the case of Fly.io the new deployment is done with the command

fly deploy
copy

NOTE: The .dockerignore file in your project directory lists files not uploaded during deployment. The dist directory may be included by default. If that's the case, remove its reference from the .dockerignore file, ensuring your app is properly deployed.

In the case of Render, commit the changes, and push the code to GitHub again. Make sure the directory dist is not ignored by git on the backend. A push to GitHub might be enough. If the automatic deployment does not work, select the "manual deploy" from the Render dashboard.

The application works perfectly, except we haven't added the functionality for changing the importance of a note to the backend yet.
screenshot of notes application

NOTE: changing the importance DOES NOT work yet since the backend has no implementation for it yet.

Our application saves the notes to a variable. If the application crashes or is restarted, all of the data will disappear.

The application needs a database. Before we introduce one, let's go through a few things.

The setup now looks like as follows:
diagram of react app on fly.io

The node/express-backend now resides in the Fly.io/Render server. When the root address is accessed, the browser loads and executes the React app that fetches the json-data from the Fly.io/Render server.
*/
/**/

/**/






































/*
Serving static files from the backend

One option for deploying the frontend is to copy the production build (the dist directory) to the root of the backend directory and configure the backend to show the frontend's main page (the file dist/index.html) as its main page.

We begin by copying the production build of the frontend to the root of the backend. With a Mac or Linux computer, the copying can be done from the frontend directory with the command

cp -r dist ../backend
copy

If you are using a Windows computer, you may use either copy or xcopy command instead. Otherwise, simply copy and paste.

The backend directory should now look as follows:
bash screenshot of ls showing dist directory

To make Express show static content, the page index.html and the JavaScript, etc., it fetches, we need a built-in middleware from Express called static.

When we add the following amidst the declarations of middlewares

app.use(express.static('dist'))
copy

whenever Express gets an HTTP GET request it will first check if the dist directory contains a file corresponding to the request's address. If a correct file is found, Express will return it.

Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend. GET requests to the address www.serversaddress.com/api/notes will be handled by the backend code.

Because of our situation, both the frontend and the backend are at the same address, we can declare baseUrl as a relative URL. This means we can leave out the part declaring the server.

import axios from 'axios'
const baseUrl = '/api/notes'
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
copy

After the change, we have to create a new production build of the frontend and copy it to the root of the backend directory.

The application can now be used from the backend address http://localhost:3001:
Notes application in localhost:3001

Our application now works exactly like the single-page app example application we studied in part 0.

When we use a browser to go to the address http://localhost:3001, the server returns the index.html file from the dist directory. The contents of the file are as follows:

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <script type="module" crossorigin src="/assets/index-5f6faa37.js"></script>
    <link rel="stylesheet" href="/assets/index-198af077.css">
  </head>
  <body>
    <div id="root"></div>
    
  </body>
</html>
copy

The file contains instructions to fetch a CSS stylesheet defining the styles of the application, and one script tag that instructs the browser to fetch the JavaScript code of the application - the actual React application.

The React code fetches notes from the server address http://localhost:3001/api/notes and renders them to the screen. The communication between the server and the browser can be seen in the Network tab of the developer console:
Network tab of notes application on backend

The setup that is ready for a product deployment looks as follows:
diagram of deployment ready react app

Unlike when running the app in a development environment, everything is now in the same node/express-backend that runs in localhost:3001. When the browser goes to the page, the file index.html is rendered. That causes the browser to fetch the production version of the React app. Once it starts to run, it fetches the json-data from the address localhost:3001/api/notes.
*/
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
app.use(express.static('dist'))//static files from backend, dist es la carpeta que genero vite al hacer el comando npm run build en el proyecto notes de fso (esta en la parte de INLINE STYLES), tambien hubo que cambiar la ruta del servidor en el front ../services/notes.js por:
//const baseUrl = '/api/notes' //FOR P3B/ Serving static files from the backend (ES UNA RUTA RELATIVA)
//como era antes:
//const baseUrl = 'http://localhost:3001/notes' //NORMAL 


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
/**/






































/*
Frontend production build

So far we have been running React code in development mode. In development mode the application is configured to give clear error messages, immediately render code changes to the browser, and so on.

When the application is deployed, we must create a production build or a version of the application that is optimized for production.

A production build for applications created with Vite can be created with the command npm run build.

Let's run this command from the root of the notes frontend project that we developed in Part 2.

This creates a directory called dist which contains the only HTML file of our application (index.html) and the directory assets. Minified version of our application's JavaScript code will be generated in the dist directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. All of the code from all of the application's dependencies will also be minified into this single file.

The minified code is not very readable. The beginning of the code looks like this:

!function(e){function r(r){for(var n,f,i=r[0],l=r[1],a=r[2],c=0,s=[];c<i.length;c++)f=i[c],o[f]&&s.push(o[f][0]),o[f]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,a||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,i=1;i<t.length;i++){var l=t[i];0!==o[l]&&(n=!1)}n&&(u.splice(r--,1),e=f(f.s=t[0]))}return e}var n={},o={2:0},u=[];function f(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,f),t.l=!0,t.exports}f.m=e,f.c=n,f.d=function(e,r,t){f.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},f.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})
*/
/**/

/**/































/*
Application to the Internet

Now that the whole stack is ready, let's move our application to Internet.

There is an ever-growing number of services that can be used to host an app on the internet. The developer-friendly services like PaaS (i.e. Platform as a Service) take care of installing the execution environment (eg. Node.js) and could also provide various services such as databases.

For a decade, Heroku was dominating the PaaS scene. Unfortunately the free tier Heroku ended at 27th November 2022. This is very unfortunate for many developers, especially students. Heroku is still very much a viable option if you are willing to spend some money. They also have a student program that provides some free credits.

We are now introducing two services Fly.io and Render. Fly.io offers more flexibility as a service, but it has also recently become paid. Render offers some free compute time, so if you want to complete the course without costs, choose Render. Setting up Render might also be easier in some cases, as Render does not require any installations on your own machine.

There are also some other free hosting options that work well for this course, at least for all parts other than part 11 (CI/CD) which might have one tricky exercise for other platforms.

Some course participants have also used the following services:

    Replit
    Railway
    CodeSandBox

If you know easy-to-use and free services for hosting NodeJS, please let us know!

For both Fly.io and Render, we need to change the definition of the port our application uses at the bottom of the index.js file in the backend like so:

const PORT = process.env.PORT || 3001app
.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
copy

Now we are using the port defined in the environment variable PORT or port 3001 if the environment variable PORT is undefined. It is possible to configure the application port based on the environment variable both in Fly.io and in Render.






==========================================
===     Fly.io                        ===
==========================================

Note that you may need to give your credit card number to Fly.io!

If you decide to use Fly.io begin by installing their flyctl executable following this guide. After that, you should create a Fly.io account.

Start by authenticating via the command line with the command

fly auth login
copy

Note if the command fly does not work on your machine, you can try the longer version flyctl. Eg. on MacOS, both forms of the command work.

If you do not get the flyctl to work in your machine, you could try Render (see next section), it does not require anything to be installed in your machine.

Initializing an app happens by running the following command in the root directory of the app

fly launch --no-deploy
copy

Give the app a name or let Fly.io auto-generate one. Pick a region where the app will be run. Do not create a Postgres database for the app and do not create an Upstash Redis database, since these are not needed.

Fly.io creates a file fly.toml in the root of your app where we can configure it. To get the app up and running we might need to do a small addition to the configuration:

[build]

[env]
  PORT = "3001" # add this

[http_service]
  internal_port = 3001 # ensure that this is same as PORT
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]
copy

We have now defined in the part [env] that environment variable PORT will get the correct port (defined in part [http_service]) where the app should create the server.

We are now ready to deploy the app to the Fly.io servers. That is done with the following command:

fly deploy
copy

If all goes well, the app should now be up and running. You can open it in the browser with the command

fly apps open
copy

A particularly important command is fly logs. This command can be used to view server logs. It is best to keep logs always visible!

Note: Fly may create 2 machines for your app, if it does then the state of the data in your app will be inconsistent between requests, i.e. you would have two machines each with its own notes variable, you could POST to one machine then your next GET could go to another machine. You can check the number of machines by using the command "$ fly scale show", if the COUNT is greater than 1 then you can enforce it to be 1 with the command "$ fly scale count 1". The machine count can also be checked on the dashboard.

Note: In some cases (the cause is so far unknown) running Fly.io commands especially on Windows WSL (Windows Subsystem for Linux) has caused problems. If the following command just hangs

flyctl ping -o personal
copy

your computer can not for some reason connect to Fly.io. If this happens to you, this describes one possible way to proceed.

If the output of the below command looks like this:

$ flyctl ping -o personal
35 bytes from fdaa:0:8a3d::3 (gateway), seq=0 time=65.1ms
35 bytes from fdaa:0:8a3d::3 (gateway), seq=1 time=28.5ms
35 bytes from fdaa:0:8a3d::3 (gateway), seq=2 time=29.3ms
...
copy

then there are no connection problems!

Whenever you make changes to the application, you can take the new version to production with a command

fly deploy
copy

==========================================
Render
==========================================
Note that you may need to give your credit card number to Render!

The following assumes that the sign in has been made with a GitHub account.

After signing in, let us create a new "web service":
Image showing the option to create a new Web Service

The app repository is then connected to Render:
Image showing the application repository on Render.

The connection seems to require that the app repository is public.

Next we will define the basic configurations. If the app is not at the root of the repository the Root directory needs to be given a proper value:
image showing the Root Directory field as optional

After this, the app starts up in the Render. The dashboard tells us the app state and the url where the app is running:
The top left corner of the image shows the status of the application and its URL

According to the documentation every commit to GitHub should redeploy the app. For some reason this is not always working.

Fortunately, it is also possible to manually redeploy the app:
Menu with the option to deploy latest commit highlighted

Also, the app logs can be seen in the dashboard:
Image with the logs tab highlighted on the left corner. On the right side, the application logs

We notice now from the logs that the app has been started in the port 10000. The app code gets the right port through the environment variable PORT so it is essential that the file index.js has been updated in the backend as follows:

const PORT = process.env.PORT || 3001app
.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
*/
/**/

/**/






































/*
Same origin policy and CORS

The issue lies with a thing called same origin policy. A URL's origin is defined by the combination of protocol (AKA scheme), hostname, and port.

http://example.com:80/index.html
  
protocol: http
host: example.com
port: 80
copy

When you visit a website (e.g. http://example.com), the browser issues a request to the server on which the website (example.com) is hosted. The response sent by the server is an HTML file that may contain one or more references to external assets/resources hosted either on the same server that example.com is hosted on or a different website. When the browser sees reference(s) to a URL in the source HTML, it issues a request. If the request is issued using the URL that the source HTML was fetched from, then the browser processes the response without any issues. However, if the resource is fetched using a URL that doesn't share the same origin(scheme, host, port) as the source HTML, the browser will have to check the Access-Control-Allow-origin response header. If it contains * on the URL of the source HTML, the browser will process the response, otherwise the browser will refuse to process it and throws an error.

The same-origin policy is a security mechanism implemented by browsers in order to prevent session hijacking among other security vulnerabilities.

In order to enable legitimate cross-origin requests (requests to URLs that don't share the same origin) W3C came up with a mechanism called CORS(Cross-Origin Resource Sharing). According to Wikipedia:

    Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.

The problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same origin. Because our server is in localhost port 3001, while our frontend is in localhost port 5173, they do not have the same origin.

Keep in mind, that same-origin policy and CORS are not specific to React or Node. They are universal principles regarding the safe operation of web applications.

We can allow requests from other origins by using Node's cors middleware.

In your backend repository, install cors with the command

npm install cors
copy

take the middleware to use and allow for requests from all origins:

const cors = require('cors')

app.use(cors())
copy

Note: When you are enabling cors, you should think about how you want to configure it. In the case of our application, since the backend is not expected to be visible to the public in the production environment, it may make more sense to only enable cors from a specific origin (e.g. the front end).

Now most of the features in the frontend work! The functionality for changing the importance of notes has not yet been implemented on the backend so naturally that does not yet work in the frontend. We shall fix that later.

You can read more about CORS from Mozilla's page.

The setup of our app now looks as follows:
diagram of react app and browser

The react app running in the browser now fetches the data from node/express-server that runs in localhost:3001.
*/
/*
////SEE PHONEBOOK_CORS FOLDER
/**/
/*
////CORS F*CKKK
1. ¿Qué pasa cuando visitas una página web?
Imagina que abres esta dirección en tu navegador:

http://example.com

¿Qué sucede realmente?
1. Tu navegador le pide al servidor de example.com que le entregue la página.
2. El servidor recibe la petición.
3. El servidor responde enviando un documento HTML.
4. El navegador interpreta ese HTML y construye la página que ves.
Por ejemplo, el servidor podría responder con este HTML:
<!DOCTYPE html>
<html>
<head>
  <title>Mi página</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h1>Hola mundo</h1>
  <script src="/app.js"></script>
</body>
</html>


Pero fíjate en algo:

El HTML hace referencia a otros archivos:
- styles.css: contiene los estilos.
- app.js: contiene código JavaScript.
Por lo tanto, el navegador necesita realizar más peticiones para obtener esos archivos.

Es decir, una página web no necesariamente se obtiene mediante una sola petición HTTP.
2. ¿Qué es un Origin (origen)?
Aquí empieza lo importante.

Un origen está compuesto por tres elementos:
Anatomía de una URL
https://example.com:443/users
Scheme

https


Host

example.com


Port

443



/users es la ruta (path), no forma parte del origen.

Los tres elementos son:
Elemento	Significado	Ejemplo
Scheme	Protocolo	http o https
Host	Dominio o dirección IP	example.com
Port	Puerto	3000, 5173, 443

Para que dos URLs tengan el mismo origen, deben coincidir los tres elementos.

Veamos algunos ejemplos:
URL A	URL B	¿Mismo origen?
http://example.com	http://example.com/users	Sí
http://example.com	https://example.com	No
http://example.com	http://api.example.com	No
http://localhost:3000	http://localhost:5173	No
http://localhost:3000	http://localhost:3000/users	Sí

Ojo: aunque las dos últimas URLs utilizan localhost, sus puertos son diferentes. Por eso tienen orígenes diferentes.
3. ¿Qué es Same-Origin Policy?
Ahora imagina que tienes una página web maliciosa.

Por ejemplo, visitas una página que parece inofensiva, pero contiene JavaScript diseñado para intentar acceder a información privada de otra página donde tienes una sesión iniciada.

Podría intentar acceder a información de tu banco, correo electrónico u otros servicios.

Para evitar que cualquier página pueda leer libremente información de otras páginas, los navegadores implementan un mecanismo de seguridad llamado:

Same-Origin Policy (política del mismo origen).

En términos sencillos:
El navegador restringe que el JavaScript de una página pueda leer respuestas de otros orígenes sin autorización.

Por ejemplo:
Página A: tu banco
bank.com

Contiene información privada de tu cuenta.

Intento de acceso no autorizado

Página B: sitio malicioso
malicious-site.com

Intenta leer los datos de bank.com mediante JavaScript.

El navegador restringe el acceso.



Esto ayuda a proteger información privada y reducir riesgos de seguridad.

Importante: Same-Origin Policy no impide todas las peticiones entre diferentes orígenes. Lo que principalmente restringe es el acceso de JavaScript a determinadas respuestas y recursos.
4. Entonces, ¿qué es CORS?
Aquí llegamos al punto central.

Imagina que estás desarrollando una aplicación y tienes dos servidores:
Tu aplicación de desarrollo
Frontend
5173
localhost:5173
React / Vite


Backend
3001
localhost:3001
Node / Express



El frontend necesita comunicarse con el backend.

Orígenes diferentes

Tu frontend está funcionando en:
http://localhost:5173


Y tu backend está funcionando en:
http://localhost:3001


Ahora imagina que desde React haces esto:
fetch('http://localhost:3001/api/users')
  .then(response => response.json())
  .then(data => console.log(data))


¿Qué ocurre?
1. React intenta consultar el backend.
2. El navegador detecta que el frontend y backend tienen orígenes diferentes.
3. El navegador comprueba las reglas CORS aplicables.
4. Si el servidor no autoriza ese origen, el navegador bloquea el acceso de JavaScript a la respuesta.
¡Y ahí aparece el famoso error de CORS!

Pero entonces, ¿cómo solucionamos esto?

Utilizando CORS (Cross-Origin Resource Sharing).

CORS es un mecanismo que permite que un servidor indique qué otros orígenes están autorizados para acceder a sus recursos mediante navegadores.
5. ¿Cómo funciona CORS en la práctica?
El servidor puede enviar una cabecera HTTP llamada:
Access-Control-Allow-Origin


Esta cabecera le indica al navegador qué origen está autorizado.

Por ejemplo, tu frontend funciona en localhost:5173.

Tu backend puede responder con:
Access-Control-Allow-Origin: http://localhost:5173


Esto significa:

"Estoy permitiendo que el código ejecutado desde http://localhost:5173 pueda acceder a mis respuestas".

También existe:
Access-Control-Allow-Origin: *


El asterisco significa que cualquier origen puede acceder a los recursos permitidos mediante esa política (no es compatible con solicitudes que incluyen credenciales como cookies).

Ojo: CORS no es un sistema de autenticación. Autorizar un origen no significa que cualquier usuario de ese origen tenga permiso para acceder a tus datos.
6. ¿Cómo implementamos CORS en Express?
Aquí es donde conecta todo lo que estás estudiando.

El texto menciona que existe un middleware de Node llamado cors.

Primero, lo instalas en tu backend:
npm install cors


Después, lo importas:
const cors = require('cors')


Y lo registras en Express:
app.use(cors())


¡Eso es todo!

Con esa configuración básica, Express permite solicitudes CORS desde cualquier origen.

Sin embargo, normalmente es mejor especificar qué frontend puede acceder:
app.use(cors({
  origin: 'http://localhost:5173'
}))


Ahora únicamente autorizas ese origen mediante la política CORS.

Tu backend completo podría verse así:
const express = require('express')
const cors = require('cors')

const app = express()

// Middlewares
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173'
}))

// Routes
app.get('/api/users', (req, res) => {
  res.json([
    { name: 'Sebastian', age: 25 }
  ])
})

app.listen(3001, () => {
  console.log('Server running on port 3001')
})



7. Resumen: ¿qué debes recordar?
Concepto	¿Qué significa?
Origin	Combinación de protocolo, host y puerto.
Same-Origin Policy	Política de seguridad del navegador que restringe el acceso entre orígenes.
CORS	Mecanismo que permite autorizar accesos entre diferentes orígenes.
Access-Control-Allow-Origin	Cabecera que indica los orígenes autorizados.
cors()	Middleware de Express que facilita configurar CORS.

Quédate con esta idea:
- Same-Origin Policy: el navegador protege el acceso a recursos de otros orígenes.
- CORS: permite que el servidor autorice determinados accesos entre orígenes.
- cors(): es la herramienta que utilizamos en Express para configurar esa autorización.
/**/






























/*
p3b
Deploying app to internet

Next, let's connect the frontend we made in part 2 to the Express backend we built in part 3a.

In part 2, the frontend fetched notes from json-server at http://localhost:3001/notes. The Express backend we built in this part has a slightly different URL structure — notes are now at http://localhost:3001/api/notes. Let's change the attribute baseUrl in the frontend notes app at src/services/notes.js like so:

import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...

export default { getAll, create, update }
copy

Now frontend's GET request to http://localhost:3001/api/notes does not work for some reason:
Get request showing error in dev tools

What's going on here? We can access the backend from a browser and from postman without any problems.
*/
/**/

/**/






































/*
Exercises 3.7.-3.8.
*/
/**/

/**/

































/*
Middleware

The Express json-parser used earlier is a middleware.

Middleware are functions that can be used for handling request and response objects.

The json-parser we used earlier takes the raw data from the requests that are stored in the request object, parses it into a JavaScript object and assigns it to the request object as a new property body.

In practice, you can use several middlewares at the same time. When you have more than one, they're executed one by one in the order that they were listed in the application code.

Let's implement our own middleware that prints information about every request that is sent to the server.

Middleware is a function that receives three parameters:

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
copy

At the end of the function body, the next function that was passed as a parameter is called. The next function yields control to the next middleware.

Middleware is used like this:

app.use(express.json())
app.use(requestLogger)
copy

Remember, middleware functions are called in the order that they're encountered by the JavaScript engine. Notice that json-parser is listed before requestLogger , because otherwise request.body will not be initialized when the logger is executed!

Middleware functions have to be used before routes when we want them to be executed by the route event handlers. Sometimes, we want to use middleware functions after routes. We do this when the middleware functions are only called if no route handler processes the HTTP request.

Let's add the following middleware after our routes. This middleware will be used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
copy

You can find the code for our current application in its entirety in the part3-2 branch of this GitHub repository.
*/
/*
//Middleware: Software relacionado al manejo de request y response, en este caso el mas basico e inimaginable, mostrarlos por consola (siempre reciben 3 parametros)
const express = require('express')//common.js modules
const app = express()

const requestLogger = (request, response, next) => { //Our Middleware 
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(express.json())//Middleware
app.use(requestLogger) //Our Middleware Loguea el request que se haga en consola (obviamnete en consola)

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
  }
]

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id //middleware applied
  const note = notes.find(note => note.id === id)
  
  if(note){
    response.json(note)
  }else{
    response.status(404).end()
  }
})
 
app.delete('/api/notes/:id', (request, response) => { //Test this with postman .> Delete ( http://localhost:3001/api/notes/1 ), The result should be a 204 status code in the postman console, and the server should not longer contain the note with ID:1
  const id = request.params.id //middleware applied
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
  const body = request.body //middleware applied
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
app.use(unknownEndpoint) //Our Middleware 

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on portt ${PORT}`)
})
/**/

































/*
About HTTP request types

The HTTP standard talks about two properties related to request types, safety and idempotency.

The HTTP GET request should be safe:

    In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".

Safety means that the executing request must not cause any side effects on the server. By side effects, we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server.

Nothing can ever guarantee that a GET request is safe, this is just a recommendation that is defined in the HTTP standard. By adhering to RESTful principles in our API, GET requests are always used in a way that they are safe.

The HTTP standard also defines the request type HEAD, which ought to be safe. In practice, HEAD should work exactly like GET but it does not return anything but the status code and response headers. The response body will not be returned when you make a HEAD request.

All HTTP requests except POST should be idempotent:

    Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property

This means that if a request does generate side effects, then the result should be the same regardless of how many times the request is sent.

If we make an HTTP PUT request to the URL /api/notes/10 and with the request we send the data { content: "no side effects!", important: true }, the result is the same regardless of how many times the request is sent.

Like safety for the GET request, idempotence is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type. However, when our API adheres to RESTful principles, then GET, HEAD, PUT, and DELETE requests are used in such a way that they are idempotent.

POST is the only HTTP request type that is neither safe nor idempotent. If we send 5 different HTTP POST requests to /api/notes with a body of {content: "many same", important: true}, the resulting 5 notes on the server will all have the same content.
*/
/**/

/**/







































/*
Exercises 3.1.-3.6.

NB: Since this is not about the frontend and React, the application is not created with Vite, but with the npm init command, as described earlier in this part of the material.

Do not add the node_modules directory to version control. The npm init command does not automatically create a .gitignore file, so create one in the root of your project and add the line node_modules to it. This way Git will no longer track that directory in version control.

Strong recommendation: When you are working on backend code, always keep an eye on what's going on in the terminal that is running your application.

*/
/**/

/**/






















/*
Receiving data

Next, let's make it possible to add new notes to the server. Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request body in JSON format.

To access the data easily, we need the help of the Express json-parser that we can use with the command app.use(express.json()).

Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests:

const express = require('express')
const app = express()

app.use(express.json())
//...

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})
copy

The event handler function can access the data from the body property of the request object.

Without the json-parser, the body property would be undefined. The json-parser takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the body property of the request object before the route handler is called.

For the time being, the application does not do anything with the received data besides printing it to the console and sending it back in the response.

Before we implement the rest of the application logic, let's verify with Postman that the data is in fact received by the server. In addition to defining the URL and request type in Postman, we also have to define the data sent in the body:
postman post on api/notes with post content

The application prints the data that we sent in the request to the console:
terminal printing content provided in postman

NOTE: When programming the backend, keep the console running the application visible at all times. The development server will restart if changes are made to the code, so by monitoring the console, you will immediately notice if there is an error in the application's code:
console error about SyntaxError

Similarly, it is useful to check the console to make sure that the backend behaves as we expect it to in different situations, like when we send data with an HTTP POST request. Naturally, it's a good idea to add lots of console.log commands to the code while the application is still being developed.

A potential cause for issues is an incorrectly set Content-Type header in requests. This can happen with Postman if the type of body is not defined correctly:
postman having text as content-type

The Content-Type header is set to text/plain:
postman showing headers and content-type as text/plain

The server appears to only receive an empty object:
console output showing empty curly braces

The server will not be able to parse the data correctly without the correct value in the header. It won't even try to guess the format of the data since there's a massive amount of potential Content-Types.

If you are using VS Code, then you should install the REST client from the previous chapter now, if you haven't already. The POST request can be sent with the REST client like this:
sample post request in vscode with JSON data

We created a new create_note.rest file for the request. The request is formatted according to the instructions in the documentation.

One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. You can also add multiple requests in the same file using ### separators:

GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}
copy

Postman also allows users to save requests, but the situation can get quite chaotic especially when you're working on multiple unrelated projects.

    Important sidenote

    Sometimes when you're debugging, you may want to find out what headers have been set in the HTTP request. One way of accomplishing this is through the get method of the request object, that can be used for getting the value of a single header. The request object also has the headers property, that contains all of the headers of a specific request.

    Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format.

    You will be able to spot this missing Content-Type header if at some point in your code you print all of the request headers with the console.log(request.headers) command.

Let's return to the application. Once we know that the application receives data correctly, it's time to finalize the handling of the request:

app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id))) 
    : 0

  const note = request.body
  note.id = String(maxId + 1)

  notes = notes.concat(note)

  response.json(note)
})
copy

We need a unique id for the note. First, we find out the largest id number in the current list and assign it to the maxId variable. The id of the new note is then defined as maxId + 1 as a string. This method is not recommended, but we will live with it for now as we will replace it soon enough.

The current version still has the problem that the HTTP POST request can be used to add objects with arbitrary properties. Let's improve the application by defining that the content property may not be empty. The important property will be given a default value of false. All other properties are discarded:

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
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
copy

The logic for generating the new id number for notes has been extracted into a separate generateId function.

If the received data is missing a value for the content property, the server will respond to the request with the status code 400 bad request:

if (!body.content) {
  return response.status(400).json({ 
    error: 'content missing' 
  })
}
copy

Notice that calling return is crucial because otherwise the code will execute to the very end and the malformed note gets saved to the application.

If the content property has a value, the note will be based on the received data. If the important property is missing, we will default the value to false. The default value is currently generated in a rather odd-looking way:

important: body.important || false,
copy

If the data saved in the body variable has the important property and its value is truthy, the expression will evaluate to that value. If the property does not exist, its value will be undefined, which is falsy, and the expression will therefore evaluate to false, which is defined on the right-hand side of the vertical lines.

    To be exact, when the important property is false, then the body.important || false expression will in fact return the false from the right-hand side. If the property has any truthy value, that value itself will be returned.

You can find the code for our current application in its entirety in the part3-1 branch of this GitHub repository.
GitHub screenshot of branch 3-1

If you clone the project, run the npm install command before starting the application with npm start or npm run dev.

One more thing before we move on to the exercises. The function for generating IDs looks currently like this:

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}
copy

The function body contains a row that looks a bit intriguing:

Math.max(...notes.map(n => Number(n.id)))
copy

What exactly is happening in that line of code? notes.map(n => Number(n.id)) creates a new array that contains all the ids of the notes in number form. Math.max returns the maximum value of the numbers that are passed to it. However, notes.map(n => Number(n.id)) is an array so it can't directly be given as a parameter to Math.max. The array can be transformed into individual numbers by using the "three dot" spread syntax ....
*/
/*
const express = require('express')//common.js modules
const app = express()
app.use(express.json())

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
 
app.delete('/api/notes/:id', (request, response) => { //Test this with postman .> Delete ( http://localhost:3001/api/notes/1 ), The result should be a 204 status code in the postman console, and the server should not longer contain the note with ID:1
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on portt ${PORT}`)
})
/**/


































/*
The WebStorm HTTP Client

If you use IntelliJ WebStorm instead, you can use a similar procedure with its built-in HTTP Client. Create a new file with extension .rest and the editor will display your options to create and run your requests. You can learn more about it by following this guide.
*/
/**/

/**/




































/*
The Visual Studio Code REST client

If you use Visual Studio Code, you can use the VS Code REST client plugin instead of Postman.

Once the plugin is installed, using it is very simple. We make a directory at the root of the application named requests. We save all the REST client requests in the directory as files that end with the .rest extension.

Let's create a new get_all_notes.rest file and define the request that fetches all notes.
get all notes rest file with get request on notes

By clicking the Send Request text, the REST client will execute the HTTP request and the response from the server is opened in the editor.
*/
/**/

/**/

































/*
Fetching a single resource

Let's expand our application so that it offers a REST interface for operating on individual notes. First, let's create a route for fetching a single resource.

The unique address we will use for an individual note is of the form notes/10, where the number at the end refers to the note's unique id number.

We can define parameters for routes in Express by using the colon syntax:

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
copy

Now app.get('/api/notes/:id', ...) will handle all HTTP GET requests that are of the form /api/notes/SOMETHING, where SOMETHING is an arbitrary string.

The id parameter in the route of a request can be accessed through the request object:

const id = request.params.id
copy

The now familiar find method of arrays is used to find the note with an id that matches the parameter. The note is then returned to the sender of the request.

We can now test our application by going to http://localhost:3001/api/notes/1 in our browser:
api/notes/1 gives a single note as JSON

However, there's another problem with our application.

If we search for a note with an id that does not exist, the server responds with:
network tools showing 200 and content-length 0

The HTTP status code that is returned is 200, which means that the response succeeded. There is no data sent back with the response, since the value of the content-length header is 0, and the same can be verified from the browser.

The reason for this behavior is that the note variable is set to undefined if no matching note is found. The situation needs to be handled on the server in a better way. If no note is found, the server should respond with the status code 404 not found instead of 200.

Let's make the following change to our code:

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
copy

Since no data is attached to the response, we use the status method for setting the status and the end method for responding to the request without sending any data.

The if-condition leverages the fact that all JavaScript objects are truthy, meaning that they evaluate to true in a comparison operation. However, undefined is falsy meaning that it will evaluate to false.

Our application works and sends the error status code if no note is found. However, the application doesn't return anything to show to the user, like web applications normally do when we visit a page that does not exist. We do not need to display anything in the browser because REST APIs are interfaces that are intended for programmatic use, and the error status code is all that is needed.

Anyway, it's possible to give a clue about the reason for sending a 404 error by overriding the default NOT FOUND message.
*/
/*
const express = require('express')//common.js modules
const app = express()

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

app.delete('/api/notes/:id', (request, response) => { //Test this with postman .> Delete ( http://localhost:3001/api/notes/1 ), The result should be a 204 status code in the postman console, and the server should not longer contain the note with ID:1
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on portt ${PORT}`)
})
/**/
/*
'/api/notes/:id' //Siempre empieza con "/" F*CKKK

// JSON.stringify()	Convierte objeto → string
// JSON.parse()	Convierte string JSON → objeto

1. Conversiones mediante funciones
//  Función	          Conversión
// Number(dato)	    A número
// String(dato)	    A string
// Boolean(dato)	  A boolean
// BigInt(dato)	    A BigInt
// parseInt(dato)	  A entero
// parseFloat(dato)	A decimal


2. Conversiones mediante objetos
//   Método	              Conversión
// dato.toString()	    A string
// dato.toFixed(n)	    Número a string con n decimales
// dato.toPrecision(n)	Número a string con n cifras significativas
// dato.valueOf()	    Devuelve el valor primitivo del objeto
/**/






















/*
REST

Let's expand our application so that it provides the same RESTful HTTP API as json-server.

Representational State Transfer, aka REST, was introduced in 2000 in Roy Fielding's dissertation. REST is an architectural style meant for building scalable web applications.

We are not going to dig into Fielding's definition of REST or spend time pondering about what is and isn't RESTful. Instead, we take a more narrow view by only concerning ourselves with how RESTful APIs are typically understood in web applications. The original definition of REST is not even limited to web applications.

We mentioned in the previous part that singular things, like notes in the case of our application, are called resources in RESTful thinking. Every resource has an associated URL which is the resource's unique address.

One convention for creating unique addresses is to combine the name of the resource type with the resource's unique identifier.

Let's assume that the root URL of our service is www.example.com/api.

If we define the resource type of note to be notes, then the address of a note resource with the identifier 10, has the unique address www.example.com/api/notes/10.

The URL for the entire collection of all note resources is www.example.com/api/notes.

We can execute different operations on resources. The operation to be executed is defined by the HTTP verb:
URL 	verb 	functionality
notes/10 	GET 	fetches a single resource
notes 	GET 	fetches all resources in the collection
notes 	POST 	creates a new resource based on the request data
notes/10 	DELETE 	removes the identified resource
notes/10 	PUT 	replaces the entire identified resource with the request data
notes/10 	PATCH 	replaces a part of the identified resource with the request data
		

This is how we manage to roughly define what REST refers to as a uniform interface, which means a consistent way of defining interfaces that makes it possible for systems to cooperate.

This way of interpreting REST falls under the second level of RESTful maturity in the Richardson Maturity Model. According to the definition provided by Roy Fielding, we have not defined a REST API. In fact, a large majority of the world's purported "REST" APIs do not meet Fielding's original criteria outlined in his dissertation.

In some places (see e.g. Richardson, Ruby: RESTful Web Services) you will see our model for a straightforward CRUD API, being referred to as an example of resource-oriented architecture instead of REST. We will avoid getting stuck arguing semantics and instead return to working on our application.
*/
/**/

/**/



































/*
Automatic Change Tracking

If we change the application's code, we first need to stop the application from the console (ctrl + c) and then restart it for the changes to take effect. Restarting feels cumbersome compared to React's smooth workflow, where the browser automatically updates when the code changes.

You can make the server track our changes by starting it with the --watch option:

node --watch index.js
copy

Now, changes to the application's code will cause the server to restart automatically. Note that although the server restarts automatically, you still need to refresh the browser. Unlike with React, we do not have, nor could we have, a hot reload functionality that updates the browser in this scenario (where we return JSON data).

Let's define a custom npm script in the package.json file to start the development server:

{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",    
"test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
copy

We can now start the server in development mode with the command

npm run dev
copy

Unlike when running the start or test scripts, the command must include run. 
*/
/**/
// You can make the server track our changes by starting it with the --watch option:
// node --watch index.js

// Let's define a custom npm script in the package.json file to start the development server:
// {
//   // ..
//   "scripts": {
//     "start": "node index.js",
//     "dev": "node --watch index.js",    //THISSSSSSSSS
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
//   // ..
// }

// We can now start the server in development mode with the command
// npm run dev
// Unlike when running the start or test scripts, the command must include run. 
/**/



































/*
Web and Express

Let's get back to our application and make the following changes:

const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
copy

To get the new version of our application into use, first we have to restart it.

The application did not change a whole lot. Right at the beginning of our code, we're importing express, which this time is a function that is used to create an Express application stored in the app variable:

const express = require('express')
const app = express()
copy

Next, we define two routes to the application. The first one defines an event handler that is used to handle HTTP GET requests made to the application's / root:

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
copy

The event handler function accepts two parameters. The first request parameter contains all of the information of the HTTP request, and the second response parameter is used to define how the request is responded to.

In our code, the request is answered by using the send method of the response object. Calling the method makes the server respond to the HTTP request by sending a response containing the string <h1>Hello World!</h1> that was passed to the send method. Since the parameter is a string, Express automatically sets the value of the Content-Type header to be text/html. The status code of the response defaults to 200.

We can verify this from the Network tab in developer tools:
network tab in dev tools

The second route defines an event handler that handles HTTP GET requests made to the notes path of the application:

app.get('/api/notes', (request, response) => {
  response.json(notes)
})
copy

The request is responded to with the json method of the response object. Calling the method will send the notes array that was passed to it as a JSON formatted string. Express automatically sets the Content-Type header with the appropriate value of application/json.
api/notes gives the formatted JSON data again

Next, let's take a quick look at the data sent in JSON format.

In the earlier version where we were only using Node, we had to transform the data into the JSON formatted string with the JSON.stringify method:

response.end(JSON.stringify(notes))
copy

With Express, this is no longer required, because this transformation happens automatically.

It's worth noting that JSON is a data format. However, it's often represented as a string and is not the same as a JavaScript object, like the value assigned to notes.

The experiment shown below illustrates this point:
node terminal demonstrating json is of type string

The experiment above was done in the interactive node-repl. You can start the interactive node-repl by typing in node in the command line. The repl is particularly useful for testing how commands work while you're writing application code. I highly recommend this!
*/
////The good way, use express
/*
const express = require('express')//common.js modules
const app = express()

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
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
/**/










































/*
Express

Implementing our server code directly with Node's built-in http web server is possible. However, it is cumbersome, especially once the application grows in size.

Many libraries have been developed to ease server-side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is Express.

Let's take Express into use by defining it as a project dependency with the command:

npm install express
copy

The dependency is also added to our package.json file:

{
  // ...
  "dependencies": {
    "express": "^5.1.0"
  }
}
copy

The source code for the dependency is installed in the node_modules directory located at the root of the project. In addition to Express, you can find a great number of other dependencies in the directory:
ls command listing of dependencies in directory

These are the dependencies of the Express library and the dependencies of all of its dependencies, and so forth. These are called the transitive dependencies of our project.

Version 5.1.0 of Express was installed in our project. What does the caret in front of the version number in package.json mean?

"express": "^5.1.0"
copy

The versioning model used in npm is called semantic versioning.

The caret in the front of ^5.1.0 means that if and when the dependencies of a project are updated, the version of Express that is installed will be at least 5.1.0. However, the installed version of Express can also have a larger patch number (the last number), or a larger minor number (the middle number). The major version of the library indicated by the first major number must be the same.

We can update the dependencies of the project with the command:

npm update
copy

Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in package.json by running this next command in the project's root directory:

npm install
copy

If the major number of a dependency does not change, then the newer versions should be backwards compatible. This means that if our application happened to use version 5.99.175 of Express in the future, then all the code implemented in this part would still have to work without making changes to the code. In contrast, the future 6.0.0 version of Express may contain changes that would cause our application to no longer work.
*/
////Basic express instalation and other commands
/**/
// npm install express
// The dependency is also added to our package.json file:
// {
//   // ...
//   "dependencies": {
//     "express": "^5.1.0"
//   }
// }
// also added the folder node_modules in the root folder of the project.

// We can update the dependencies of the project with the command:
// npm update

// Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in package.json by running this next command in the project's root directory:
// npm install
/**/


























/*
Simple web server

Let's change the application into a web server by editing the index.js file as follows:

const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
copy

Once the application is running, the following message is printed in the console:

Server running on port 3001
copy

We can open our humble application in the browser by visiting the address http://localhost:3001:
hello world screen capture

The server works the same way regardless of the latter part of the URL. Also the address http://localhost:3001/foo/bar will display the same content.

NB If port 3001 is already in use by some other application, then starting the server will result in the following error message:

➜  hello npm start

> hello@1.0.0 start /Users/mluukkai/opetus/_2019fullstack-code/part3/hello
> node index.js

Server running on port 3001
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::3001
    at Server.setupListenHandle [as _listen2] (net.js:1330:14)
    at listenInCluster (net.js:1378:12)
copy

You have two options. Either shut down the application using port 3001 (the JSON Server in the last part of the material was using port 3001), or use a different port for this application.

Let's take a closer look at the first line of the code:

const http = require('http')
copy

In the first row, the application imports Node's built-in web server module. This is practically what we have already been doing in our browser-side code, but with a slightly different syntax:

import http from 'http'
copy

These days, code that runs in the browser uses ES6 modules. Modules are defined with an export and included in the current file with an import.

Node.js uses CommonJS modules. The reason for this is that the Node ecosystem needed modules long before JavaScript supported them in the language specification. Currently, Node also supports the use of ES6 modules, but since the support is not quite perfect yet, we'll stick to CommonJS modules.

CommonJS modules function almost exactly like ES6 modules, at least as far as our needs in this course are concerned.

The next chunk in our code looks like this:

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
copy

The code uses the createServer method of the http module to create a new web server. An event handler is registered to the server that is called every time an HTTP request is made to the server's address http://localhost:3001.

The request is responded to with the status code 200, with the Content-Type header set to text/plain, and the content of the site to be returned set to Hello World.

The last rows bind the http server assigned to the app variable, to listen to HTTP requests sent to port 3001:

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
copy

The primary purpose of the backend server in this course is to offer raw data in JSON format to the frontend. For this reason, let's immediately change our server to return a hardcoded list of notes in the JSON format:

const http = require('http')

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
  }
]
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
copy

Let's restart the server (you can shut the server down by pressing Ctrl+C in the console) and let's refresh the browser.

The application/json value in the Content-Type header informs the receiver that the data is in the JSON format. The notes array gets transformed into JSON formatted string with the JSON.stringify(notes) method. This is necessary because the response.end() method expects a string or a buffer to send as the response body.

When we open the browser, the displayed format is exactly the same as in part 2 where we used json-server to serve the list of notes.
*/
/*
const http = require('http')

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
  }
]
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
/**/























/*
P3
Node.js and Express

In this part, our focus shifts towards the backend: that is, towards implementing functionality on the server side of the stack.

We will be building our backend on top of NodeJS, which is a JavaScript runtime based on Google's Chrome V8 JavaScript engine.

This course material was written with version v22.3.0 of Node.js. Please make sure that your version of Node is at least as new as the version used in the material (you can check the version by running node -v in the command line).

As mentioned in part 1, browsers don't yet support the newest features of JavaScript, and that is why the code running in the browser must be transpiled with e.g. babel. The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript, so we can use the latest features without having to transpile our code.

Our goal is to implement a backend that will work with the notes application from part 2. However, let's start with the basics by implementing a classic "hello world" application.

Notice that the applications and exercises in this part are not all React applications, and we will not use the create vite@latest -- --template react utility for initializing the project for this application.

We had already mentioned npm back in part 2, which is a tool used for managing JavaScript packages. In fact, npm originates from the Node ecosystem.

Let's navigate to an appropriate directory, and create a new template for our application with the npm init command. We will answer the questions presented by the utility, and the result will be an automatically generated package.json file at the root of the project that contains information about the project.

{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
copy

The file defines, for instance, that the entry point of the application is the index.js file.

Let's make a small change to the scripts object by adding a new script command.

{
  // ...
  "scripts": {
    "start": "node index.js",    
"test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
copy

Next, let's create the first version of our application by adding an index.js file to the root of the project with the following code:

console.log('hello world')
copy

We can run the program directly with Node from the command line:

node index.js
copy

Or we can run it as an npm script:

npm start
copy

The start npm script works because we defined it in the package.json file:

{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
copy

Even though the execution of the project works when it is started by calling node index.js from the command line, it's customary for npm projects to execute such tasks as npm scripts.

By default, the package.json file also defines another commonly used npm script called npm test. Since our project does not yet have a testing library, the npm test command simply executes the following command:

echo "Error: no test specified" && exit 1
*/
/*
console.log('Hello world')
/**/
////package.json config
/*
normally we can run the program directly with Node from the command line:
node index.js

but if...
in package.json/scripts add this line
"start": "node index.js",
now from the console you use can 
npm start
/**/