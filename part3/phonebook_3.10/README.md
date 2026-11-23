# Phonebook Backend

A RESTful API built with **Node.js** and **Express** as part of the [Full Stack Open](https://fullstackopen.com/en/) course (Part 3, Exercise 3.10).

The application provides endpoints to manage phonebook contacts, including creating, retrieving, updating, and deleting entries.

## Live Application

**Deployed API:** https://phonebook-3-10-x8q3.onrender.com

**Contacts endpoint:** https://phonebook-3-10-x8q3.onrender.com/api/persons

## Technologies

- **Node.js** – JavaScript runtime.
- **Express** – Web framework for building the REST API.
- **Morgan** – HTTP request logging middleware.
- **CORS** – Cross-Origin Resource Sharing middleware.

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

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Root welcome page. |
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

## Local Development

Clone the repository:

```bash
git clone https://github.com/picasse-dev/phonebook_3.10.git
```

Navigate to the backend directory:

```bash
cd phonebook_3.10/Backend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The server runs on port `3001` by default.

The application also supports the `PORT` environment variable:

```js
const PORT = process.env.PORT || 3001
```

## Deployment

The backend is deployed using [Render](https://render.com/) as a Web Service.

Deployment configuration:

| Setting | Value |
|---|---|
| Repository | `picasse-dev/phonebook_3.10` |
| Branch | `main` |
| Runtime | Node.js |
| Root Directory | `Backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Render automatically deploys new changes when commits are pushed to the connected GitHub repository.

## Testing

The deployed API can be tested using:

- A web browser for GET requests.
- Postman.
- VS Code REST Client.

A `test.rest` file can be used to organize and execute HTTP requests.

## Project Notes

**Data persistence:** Contacts are currently stored in an in-memory JavaScript array. Therefore, changes are not persistent and may be lost when the server restarts or redeploys.

**Repository structure:** The backend is maintained in the `Backend` directory of the repository.

**Deployment considerations:** The deployment is connected to the original GitHub repository. Moving the project or removing its Git configuration may interrupt automatic deployments. To continue development, preserve the repository connection or configure a new deployment source.

---

Developed as part of the **Full Stack