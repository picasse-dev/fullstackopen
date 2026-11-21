# Full Stack Open — Learning Journal

**A practical journey through modern web development.**

This repository documents my journey through the [Full Stack Open course](https://fullstackopen.com/en/), developed by the University of Helsinki.

It is more than a collection of completed exercises. It is my personal technical notebook: a place to practice, experiment, document concepts, preserve previous implementations, and understand how web applications evolve from frontend fundamentals to full-stack development.

Over the past weeks, I have been building applications, exploring JavaScript and React, learning how frontend applications communicate with servers, and progressively moving into backend development with Node.js and Express.

---

## Repository Philosophy

I organize my learning into three complementary dimensions:

- **Practice:** exercises and applications developed throughout the course.
- **Understanding:** theoretical explanations and executable code examples.
- **Documentation:** technical notes, references, and personal explanations that reinforce what I learn.

An important part of this repository is preserving the evolution of my solutions rather than replacing previous implementations.

### Progressive Exercise Development

Some exercises evolve through multiple requirements. Instead of creating a new project for every update, I preserve previous implementations as commented code and introduce the next version alongside its corresponding exercise statement.

This creates a historical record of how an application develops over time.

Previous implementations are kept for reference, while only the intended current implementation should remain active.

---

## Repository Structure

| Directory | Description |
|---|---|
| `part0/` | Web application fundamentals and architecture diagrams. |
| `part1/` | React fundamentals and introductory exercises. |
| `part2/` | Working with collections, forms, APIs, and server communication. |
| `part3/` | Backend development and full-stack Phonebook application. |
| `fso/` | Technical notebook covering course explanations and practical examples from Parts 0–2. |
| `fsobackend/` | Backend notebook and additional practical implementations from Part 3. |

### Technical Notebooks

The notebooks use a particular documentation approach: explanations and code examples are organized together in source files.

Code sections can be uncommented to experiment with individual examples. Only one independent section should be active at a time, since multiple examples may define conflicting components, variables, or application logic.

Additional technical references:

- [Data Structures and Common Operations in React](fso/GED.md)
- [HTTP Status Codes — Practical Backend Guide](fsobackend/guia_codigos_estado_http.md)

---

## Learning Progress

### Part 0 — Fundamentals of Web Apps

Exploring how web applications work and how browser-server communication takes place.

Topics documented through architectural diagrams:

- Traditional web applications.
- Single Page Applications (SPA).
- Creating and sending data through web applications.

### Part 1 — Introduction to React

First steps into component-based frontend development.

Projects:

- [Courseinfo](part1/courseinfo/)
- [Unicafe](part1/unicafe/)
- [Anecdotes](part1/anecdotes/)

### Part 2 — Communicating with Server

Moving beyond static interfaces and learning how applications manage and retrieve external data.

Projects:

- [Courseinfo P2](part2/courseinfop2/)
- [Data for Countries](part2/data_for_countries/)
- [Phonebook](part2/phonebook/)

### Part 3 — Programming a Server with NodeJS and Express

Beginning backend development and connecting frontend applications with custom APIs.

Project:

- [Phonebook — Full Stack](part3/phonebook/)

---

## Technology Stack

**Frontend**
- JavaScript
- React
- Vite
- Axios

**Backend**
- Node.js
- Express
- Morgan
- CORS

**Development Tools**
- Git and GitHub
- npm
- ESLint
- Oxlint
- JSON Server

---

## Learning Resources

- [Full Stack Open — University of Helsinki](https://fullstackopen.com/en/)
- [React Documentation](https://react.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Express Documentation](https://expressjs.com/)

---

## About This Repository

This is an ongoing learning project. Its purpose is not only to complete course exercises, but also to build a deeper understanding of the technologies, document the learning process, and develop good software engineering habits.

**Learn by building. Understand by experimenting. Improve by documenting.**