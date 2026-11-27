# Phonebook Full Stack Application

A full-stack phonebook application built with **Node.js**, **Express**, and **React** as part of the [Full Stack Open](https://fullstackopen.com/en/) course (Part 3, Exercise 3.11).

The application consists of a RESTful API and a React frontend. The backend handles API requests and serves the production frontend build as static files using Express.

## Live Application

**Deployed Application:** [Phonebook 3.11](https://phonebook-3-11.onrender.com/)

**Contacts API:** [Phonebook API](https://phonebook-3-11.onrender.com//api/persons)


## Technologies

- **Node.js** – JavaScript runtime.
- **Express** – Web framework for building the REST API and serving static files.
- **React** – Library for building the user interface.
- **Vite** – Frontend development server and production build tool.
- **Morgan** – HTTP request logging middleware.

## Features

- Retrieve all phonebook contacts.
- Retrieve a specific contact by ID.
- Display phonebook statistics and server date.
- Create new contacts.
- Update existing contacts using PUT.
- Partially update contacts using PATCH.
- Delete contacts.
- Validate incoming data.
- Prevent duplicate contact names (case-insensitive).
- Handle unknown endpoints with HTTP 404 responses.
- Log HTTP requests and request bodies.
- Serve the React frontend from the Express backend.
- Support both production and local development environments.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Serve the frontend application. |
| GET | `/api` | API welcome page. |
| GET | `/api/persons` | Retrieve all contacts. |
| GET | `/api/persons/info` | Retrieve phonebook statistics. |
| GET | `/api/persons/:id` | Retrieve a contact by ID. |
| POST | `/api/persons` | Create a new contact. |
| PUT | `/api/persons/:id` | Replace a contact's name and number. |
| PATCH | `/api/persons/:id` | Partially update a contact. |
| DELETE | `/api/persons/:id` | Delete a contact. |

## Example Request

Create a new contact:

**POST** `/api/persons`

```json
{
  "name": "John Doe",
  "number": "123-456789"
}
```

The API validates that both fields are present, contain valid strings, and are not empty.

## HTTP Status Codes

| Status | Description |
|---|---|
| 200 | Request successful. |
| 201 | Contact successfully created. |
| 204 | Contact successfully deleted. |
| 400 | Invalid or missing request data. |
| 404 | Contact or endpoint not found. |
| 409 | A contact with the same name already exists. |

## Project Structure

```text
phonebook_3.11/
│
├── Backend/
│   ├── dist/              # Production frontend build
│   ├── index.js            # Express server
│   ├── package.json
│   └── test.rest
│
└── Frontend/
    ├── src/
    │   └── services/
    │       └── persons.js  # API communication
    ├── vite.config.js
    ├── package.json
    └── ...
```

## Local Development

The application supports independent frontend development and backend execution.

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

The backend runs on port `3001` by default.

The application also supports the `PORT` environment variable:

```js
const PORT = process.env.PORT || 3001
```

### 2. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend communicates with the backend through Vite's development proxy.

### 3. Development Proxy Configuration

The `vite.config.js` file redirects API requests to the local Express server:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

The frontend uses a relative API URL:

```js
const baseUrl = '/api/persons'
```

This configuration allows the frontend to communicate with the backend without requiring CORS during local development.

## Production Build

The production frontend is generated using Vite.

From the frontend directory, execute:

```bash
npm run build
```

This generates the optimized production files inside the `dist` directory.

The generated `dist` directory must be copied into the backend repository so Express can serve the frontend.

The backend uses the following middleware:

```js
app.use(express.static('dist'))
```

This allows the Express server to serve the production frontend directly.

### Build Script

A `build:ui` script can be configured in the backend's `package.json` to automate the frontend production build and transfer its generated files into the backend.

```bash
npm run build:ui
```

## Deployment

The application is deployed using [Render](https://render.com/) as a Node.js Web Service.

**Important:** Only the backend repository is deployed. The frontend is not deployed separately. Instead, its production build is included in the backend repository and served by Express.

Deployment configuration:

| Setting | Value |
|---|---|
| Repository | `picasse-dev/phonebook_3.11` |
| Branch | `main` |
| Runtime | Node.js |
| Root Directory | `Backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Render automatically deploys new changes when commits are pushed to the connected GitHub repository.

The production application serves both the React frontend and the REST API from the same origin.

## Testing

The API can be tested using:

- A web browser for GET requests.
- Postman.
- VS Code REST Client.

A `test.rest` file can be used to organize and execute HTTP requests.

## Project Notes

**Data persistence:** Contacts are currently stored in an in-memory JavaScript array. Therefore, changes are not persistent and may be lost when the server restarts or redeploys.

**Frontend development:** The frontend can still be developed independently using `npm run dev`, while Vite proxies API requests to the local backend.

**Production architecture:** The frontend production build is served by Express through the `dist` directory. No separate frontend deployment is required.

**CORS:** The CORS middleware is no longer required because the frontend and backend share the same origin in production. During local development, Vite handles API request forwarding through its proxy configuration.

**Deployment considerations:** The `dist` directory must be included in the backend repository and must not be ignored by Git. Otherwise, the deployed backend will not be able to serve the frontend.

---

Developed as part of the **Full Stack Open** course – Part 3, Exercise 3.11.