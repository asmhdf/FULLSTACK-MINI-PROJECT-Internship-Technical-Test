# Project Tasks Manager

A full-stack application for managing project tasks, built with **Spring Boot** and **React**.

## Tech Stack

- **Backend**: Java 21, Spring Boot 3/4, Spring Security (JWT), Spring Data JPA, MySQL.
- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
- **Database**: MySQL.

## Features

- **Authentication**: User registration and login with JWT.
- **Projects**: Create, view, and delete projects.
- **Tasks**: Add tasks to projects, mark them as completed, delete tasks.
- **Progress Tracking**: Visual progress bar for project completion.
- **Security**: Data isolation (users only see their own projects).

## Prerequisites

- Java 21+
- Node.js & npm
- MySQL Server (running on port 3307 as per config, or update `application.properties`)

## Setup & Running

### 1. Database Setup

Ensure MySQL is running on port `3307` (or update `backend/src/main/resources/application.properties` if using a different port).

**Option A: Using the provided SQL script**
```bash
mysql -u root -p -P 3307 < database/init.sql
```
Enter password: `123456`

**Option B: Manual setup**
```sql
CREATE DATABASE IF NOT EXISTS taskmanager_db;
```

**Important Notes:**
- The application uses **Hibernate auto-DDL** (`spring.jpa.hibernate.ddl-auto=update`)
- Tables (`users`, `projects`, `tasks`) will be **automatically created** when you first run the backend
- Default credentials: `root` / `123456` on port `3307`
- To change database configuration, edit `backend/src/main/resources/application.properties`

### 2. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

### 4. Docker Compose (Alternative)

You can also run the entire application stack (MySQL, Backend, Frontend) using Docker Compose:

```bash
docker-compose up --build
```

This will:
- Start a MySQL database container on port `3307`
- Build and run the Spring Boot backend on port `8080`
- Build and run the React frontend on port `5173`

To stop all services:
```bash
docker-compose down
```

To remove all containers and volumes:
```bash
docker-compose down -v
```

**Note**: The `docker-compose.yml` file is configured with the same database credentials as the manual setup.

## Unit Tests

The backend includes unit tests for core service layer functionality using **JUnit 5** and **Mockito**.

### Running Tests

From the `backend` directory:

```bash
mvn test
```

### Test Coverage

- **TaskServiceTest**: Tests for task creation, retrieval by project, and finding tasks by ID
- **ProjectServiceTest**: Tests for project creation and retrieval by user email

The tests use Mockito to mock repository dependencies, ensuring isolated unit testing of service logic.

## Usage

1.  Open the frontend URL.
2.  Register a new user.
3.  Login.
4.  Create a project.
5.  Click on the project to manage tasks.

## Demo Video

[Link to Demo Video] (To be recorded)
