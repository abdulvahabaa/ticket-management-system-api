# ticket-management-system-api

## Table of Contents

- [ticket-management-system-api](#ticket-management-system-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation and Setup](#installation-and-setup)
    - [Prerequisites](#prerequisites)
    - [Environment Setup](#environment-setup)
    - [Running the Application](#running-the-application)
  - [Usage](#usage)
    - [API Endpoints](#api-endpoints)
    - [Postgress Schama Create Table](#postgress-schama-create-table)

## Features

- **User Authentication**: Secure registration and login for users.
- **Security**: Implemented with secure authentication and authorization to protect user data. cors protection use helmet and cors options

## Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT

## Installation and Setup

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- PostgreSQL installed and running

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/abdulvahabaa/ticket-management-system-api.git
   cd ticket-management-system-api

   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an `.env` file in the root directory and add the following:

   ```env
   PORT=9002
   PG_USER=postgres
   PG_HOST=localhost
   PG_DATABASE=<Your DataBase Name>
   PG_PASSWORD=<Your Password>
   PG_PORT=5432
   JWT_SECRET=<Your JWT Secret>

   ```

### Running the Application

1. Start the backend server:

   ```bash
   npm run dev
   ```

2. The API should now be running on `http://localhost:9002`.

## Usage

### API Endpoints

- **Create a User**: `POST /users`
- **Authentication**: `POST /auth/login`
- **Assign a User to a Ticket**: `POST /tickets/:ticketId/assign`
- **Get Ticket Details**: `GET /tickets/:ticketId`
- **Ticket History**: `GET /tickets/analytics`
- **Ticket Analytics**: `GET /dashboard/analytics`

### Postgress Schama Create Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('customer', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, 
    venue VARCHAR(255) NOT NULL,
    status VARCHAR(15) CHECK (status IN ('open', 'in-progress', 'closed')) DEFAULT 'open',
    price DECIMAL(10, 2),
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    assigned_users JSONB DEFAULT '[]'::jsonb,
    created_by INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```