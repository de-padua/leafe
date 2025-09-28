
![Alt text](https://raw.githubusercontent.com/toniswx/leafe/41be72c73970fd74f24fd43b2465f596ff0e26c9/frontend/public/logo.svg)

> **Leafe** 
is a real estate platform where users can **buy and sell houses, land, apartments, or any type of property you can live on**.  
The project aims to provide a modern and reliable way to connect buyers and sellers in the real estate market, with features like property listings, image uploads, authentication.
The app does not provide any form of transaction, aiming to let it to the users to negotiate in their way.




IF YOU WANT TO SEE DETAILS IN EACH AREA
- [FRONT END DETAILS](https://github.com/toniswx/leafe/tree/main/frontend)
- [BACK END DETAILS](https://github.com/toniswx/leafe/tree/main/backend)



## Table of Contents

- [About](#about)  
- [Architecture](#architecture)  
- [Features](#features)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Configuration](#configuration)  
  - [Running Locally](#running-locally)  
  - [Running with Docker / Docker Compose](#running-with-docker--docker-compose)  
- [Project Structure](#project-structure)  
- [Environment Variables](#environment-variables)  
- [Database Migrations](#database-migrations)  
- [Scripts](#scripts)  
- [Contributing](#contributing)  
- [License](#license)

---

## About

*leafe* is a modular application built with:

- **Backend**: TypeScript, Node.js (with Prisma for ORM)  
- **Frontend**: Likely a web UI (in TypeScript, CSS/SCSS)  
- **Messaging**: RabbitMQ for async communication between components  
- **Deployment**: Docker + Docker Compose  

> This project is under active development. Some parts (migrations, environment configs) require setup.

---

## Architecture

```text
┌────────────┐     ┌────────────┐     ┌──────────────┐
│  Frontend  │ ←→  │  Backend   │ ←→  │  RabbitMQ     │
└────────────┘     └────────────┘     └──────────────┘
      ↑                   ↑                  ↑
   Docker containers & networking via compose
```
---

## Features


- RESTful API backend with JWT based authentication  
- Database schema managed with Prisma  
- Asynchronous tasks via RabbitMQ  
- Frontend UI with shadcn and react  
- Containerization with Docker for consistent local/dev environment  

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (v20+)  
- npm or yarn 22 
- Docker & Docker Compose (if you plan to use containers)  
- Access to a PostgreSQL database (or whichever DB you configure)  

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/toniswx/leafe.git
   cd leafe
   ```

2. Install dependencies:

   ```bash
   # in backend
   cd backend
   npm install

   # in frontend
   cd ../frontend
   npm install
   ```

3. Setup database migrations:

   ```bash
   # back in backend folder
   npx prisma migrate dev --name init
   ```

### Configuration

Create a `.env` file (or similar) in the backend with settings like:

```env
# .env

# URI
DATABASE_URL="postgresql://user:password@host:port/db-name?schema=public"

# credentials
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...

PORT=5000

JWT_SECRET=YOUR_JWT_SECRET
JWT_SECRET_REFRESH=YOUR_REFRESH_SECRET
JWT_ADM_SECRET=YOUR_ADMIN_SECRET
JWT_VERIFY_CODE=YOUR_VERIFY_CODE_SECRET
```

Also configure any RabbitMQ connection settings if required (host, port, user, pass).

### Running Locally

```bash
# From the root:

# run backend
cd backend
npm run dev

# run frontend
cd ../frontend
npm run dev
```

Frontend will likely be served on something like `http://localhost:3000` (or similar), backend on `http://localhost:5000`, etc.

### Running with Docker / Docker Compose

There's a `docker-compose.yml` in the root:

```bash
docker-compose up --build
```

---

## Project Structure

Here’s the high‑level layout:

```
├── backend/         
├── frontend/        
├── rabbitmq/          
├── Dockerfile         
├── docker-compose.yml 
├── .env / .env.example 
├── README.Docker.md   
├── package.json
└── etc.
```

---

## Environment Variables

Here are the main ones needed in `.env` (backend):

| Variable               | Purpose                                             |
|------------------------|-----------------------------------------------------|
| `DATABASE_URL`         | DB connection string                                |
| `POSTGRES_USER`        | DB user                                            |
| `POSTGRES_PASSWORD`    | DB password                                        |
| `POSTGRES_DB`          | DB name                                            |
| `PORT`                 | Port number backend listens on                    |
| `JWT_SECRET`           | Secret for signing JWT access tokens               |
| `JWT_SECRET_REFRESH`   | For refresh tokens                                 |
| `JWT_ADM_SECRET`        | For admin role or privileged auth                  |
| `JWT_VERIFY_CODE`      | For verification flows (email, SMS, etc.)          |

---

## Scripts

Some useful scripts (in `package.json`) include:

- `npm run dev` — start in development mode  
- `npm run build` — build for production  
- `npm start` — run the built production server  
- etc.

---

## Contributing

If you’d like to contribute: This is a solo dev project, keep it in mind.

---


For questions, suggestions, or issues, contact the maintainer: 

- Open a issue in this repo or mail me at toninhoport3@outlook.com
- GitHub: [toniswx](https://github.com/toniswx)  
