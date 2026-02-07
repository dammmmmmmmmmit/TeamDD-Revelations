# TeamDD-Revelations Backend

This is the backend for the TeamDD-Revelations application, built with Node.js, Express, and MongoDB.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
-   [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/) (MongoDB Shell) for database initialization scripts.

## Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Database Setup

Before running the application, you must initialize the database schema and seed initial data.

### 1. Initialize Schema
Run the schema creation script to set up collections, validation rules, and indexes:

```bash
mongosh "your_mongodb_connection_string" create_schema.js
```

### 2. Seed Data (Optional)
Populate the database with initial users (Admin, Organizer, Student) and sample events:

```bash
mongosh "your_mongodb_connection_string" seed_users.js
```

**Default Users:**
-   **Admin**: `admin@example.com` / `password123`
-   **Organizer**: `organizer@example.com` / `password123`
-   **Student**: `student@example.com` / `password123`

## Running the Server

### Development Mode
Runs the server with `nodemon` for hot-reloading (if configured) or standard node execution:

```bash
npm run dev
```

### Production Mode
Starts the server normally:

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login user
-   `GET /api/events` - Get all events
-   `POST /api/events` - Create a new event (Organizer/Admin only)
-   `POST /api/registrations` - Register for an event
-   `GET /api/theme` - Get current theme settings
