# HR Management Backend API

## Project Overview

This is a fully implemented HR Management Backend API built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL**. The API provides comprehensive features for managing employees, tracking attendance, and generating monthly attendance reports.

## ✅ Implementation Status: COMPLETE

The project includes all required features from the task specification:

- **Authentication**: JWT-based HR user authentication
- **Employee Management**: Full CRUD operations with photo uploads
- **Attendance Tracking**: Complete attendance management with upsert capability
- **Monthly Reports**: Attendance summary with late arrival tracking
- **Code Quality**: ESLint, Prettier, and TypeScript strict typing

## 📁 Project Structure

```
hr-management-apis/
├── src/
│   ├── config/           # Environment and Knex configuration
│   │   ├── env.ts       # Environment variables validation
│   │   └── knexfile.ts  # Database connection configuration
│   ├── controllers/     # Request handlers (OOP pattern)
│   │   ├── auth.controller.ts
│   │   ├── employee.controller.ts
│   │   └── attendance.controller.ts
│   ├── database/        # Database connection and migrations
│   │   ├── index.ts    # Knex connection instance
│   │   └── migrations/ # Database migration files
│   ├── middleware/     # Auth, upload, validation, error handling
│   │   ├── auth.middleware.ts
│   │   ├── upload.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── errors/     # Error handling middleware
│   ├── models/         # Data models and base model
│   │   ├── base-model.ts
│   │   ├── employee.model.ts
│   │   ├── hr-user.model.ts
│   │   └── attendance.model.ts
│   ├── routes/         # Express route definitions
│   │   ├── auth.route.ts
│   │   ├── employee.route.ts
│   │   └── attendance.route.ts
│   ├── services/       # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── employee.service.ts
│   │   └── attendance.service.ts
│   ├── types/         # TypeScript type definitions
│   │   ├── express.d.ts
│   │   └── models.ts
│   ├── utils/        # JWT utilities and exceptions
│   │   ├── jwt.ts
│   │   └── exceptions/
│   ├── validators/   # Joi validation schemas
│   │   ├── auth.validator.ts
│   │   ├── employee.validator.ts
│   │   └── attendance.validator.ts
│   ├── app.ts       # Express app configuration
│   └── index.ts     # Application entry point
├── uploads/         # Employee photo uploads
├── scripts/         # Utility scripts
├── .env.example    # Environment variables template
├── .gitignore
├── knexfile.cjs     # Knex configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Technology Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Runtime          | Node.js                 |
| Language         | TypeScript (ES Modules) |
| Framework        | Express 5.x             |
| Database         | PostgreSQL              |
| Query Builder    | Knex.js                 |
| Validation       | Joi                     |
| Authentication   | JWT (jsonwebtoken)      |
| Password Hashing | bcrypt                  |
| File Upload      | Multer                  |
| Code Quality     | ESLint + Prettier       |

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Bun** (recommended) or **npm**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hr-management-apis
   ```

2. **Install dependencies**

   ```bash
   # Using Bun (recommended)
   bun install

   # Using npm
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your configuration (see Environment Variables below)
   nano .env
   ```

4. **Set up the database**

   ```bash
   # Run migrations
   bun migrate:latest
   # OR
   npm run migrate:latest
   ```

5. **Start the development server**

   ```bash
   # Using Bun
   bun dev

   # Using npm
   npm run dev
   ```

The server will start on `http://localhost:5000`

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5000

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/hr_management

# Authentication
SALT_ROUNDS=10
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### Variable Descriptions

| Variable         | Description                                    | Default               |
| ---------------- | ---------------------------------------------- | --------------------- |
| `PORT`           | Server port number                             | 5000                  |
| `NODE_ENV`       | Environment mode (development/production/test) | development           |
| `CORS_ORIGIN`    | Allowed CORS origin                            | http://localhost:3000 |
| `DATABASE_URL`   | PostgreSQL connection string                   | -                     |
| `DB_HOST`        | Database host                                  | localhost             |
| `DB_PORT`        | Database port                                  | 5432                  |
| `DB_USER`        | Database username                              | -                     |
| `DB_DATABASE`    | Database name                                  | hr_management         |
| `DB_PASSWORD`    | Database password                              | -                     |
| `DB_SSL`         | Enable SSL for database connection             | false                 |
| `SALT_ROUNDS`    | bcrypt password hashing rounds                 | 10                    |
| `JWT_SECRET`     | Secret key for JWT signing                     | -                     |
| `JWT_EXPIRES_IN` | JWT token expiration time                      | 1d                    |
| `UPLOAD_PATH`    | Directory for uploaded files                   | ./uploads             |
| `MAX_FILE_SIZE`  | Maximum file upload size (bytes)               | 5242880 (5MB)         |

## 📚 API Endpoints

### 🔐 Authentication (`/api/auth`)

All authentication endpoints are public and don't require a token.

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register new HR user      |
| POST   | `/api/auth/login`    | Login with email/password |

#### Register Request

```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "your-password",
  "name": "Admin Name"
}
```

#### Login Request

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "your-password"
}
```

#### Login Response

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "Admin Name",
      "email": "admin@company.com"
    }
  }
}
```

#### Protected Routes (require JWT token)

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/api/auth/me`              | Get current user profile |
| PUT    | `/api/auth/change-password` | Change password          |
| POST   | `/api/auth/refresh`         | Refresh JWT token        |
| POST   | `/api/auth/logout`          | Logout user              |

---

### 👥 Employees (`/api/employees`)

All employee routes require JWT authentication (`Authorization: Bearer <token>`).

#### Endpoints

| Method | Endpoint                                    | Description           | Query/Body                     |
| ------ | ------------------------------------------- | --------------------- | ------------------------------ |
| GET    | `/api/employees`                            | List all employees    | `?search=name&page=1&limit=10` |
| GET    | `/api/employees/:id`                        | Get employee by ID    | -                              |
| GET    | `/api/employees/stats/count-by-designation` | Count by designation  | -                              |
| GET    | `/api/employees/designation/:designation`   | Filter by designation | -                              |
| POST   | `/api/employees`                            | Create new employee   | FormData (with photo)          |
| PUT    | `/api/employees/:id`                        | Update employee       | FormData (optional photo)      |
| DELETE | `/api/employees/:id`                        | Soft delete employee  | -                              |
| DELETE | `/api/employees/:id/photo`                  | Remove employee photo | -                              |

#### Create Employee (Multipart FormData)

```
POST /api/employees
Content-Type: multipart/form-data
Authorization: Bearer <token>

name: "John Doe"
age: 30
designation: "Software Engineer"
hiring_date: "2024-01-15"
date_of_birth: "1994-05-20"
salary: 75000
photo: [file upload - optional]
```

#### Get All Employees

```
GET /api/employees?search=john&page=1&limit=10
Authorization: Bearer <token>
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "age": 30,
      "designation": "Software Engineer",
      "hiring_date": "2024-01-15",
      "date_of_birth": "1994-05-20",
      "salary": 75000,
      "photo_path": "/uploads/filename.jpg",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Update Employee

```
PUT /api/employees/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "John Updated"
salary: 80000
photo: [new file - optional]
```

#### Delete Employee (Soft Delete)

```
DELETE /api/employees/:id
Authorization: Bearer <token>
```

Deleted employees are marked with `deleted_at` timestamp and excluded from lists.

---

### 📋 Attendance (`/api/attendance`)

All attendance routes require JWT authentication (`Authorization: Bearer <token>`).

#### Endpoints

| Method | Endpoint                               | Description              | Query/Body                                                        |
| ------ | -------------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| GET    | `/api/attendance`                      | List all attendance      | `?employee_id=uuid&from=2024-01-01&to=2024-01-31&page=1&limit=10` |
| GET    | `/api/attendance/:id`                  | Get by ID                | -                                                                 |
| GET    | `/api/attendance/employee/:employeeId` | Get by employee          | -                                                                 |
| GET    | `/api/attendance/date/:date`           | Get by date              | -                                                                 |
| GET    | `/api/attendance/stats/:employeeId`    | Employee statistics      | `?start_date=2024-01-01&end_date=2024-01-31`                      |
| GET    | `/api/attendance/report/monthly`       | **Monthly Report**       | `?month=2024-01&employee_id=uuid`                                 |
| POST   | `/api/attendance`                      | Create/upsert attendance | `{employee_id, date, check_in_time}`                              |
| PUT    | `/api/attendance/:id`                  | Update attendance        | `{check_in_time}`                                                 |
| DELETE | `/api/attendance/:id`                  | Delete attendance        | -                                                                 |

#### Create Attendance (Upsert)

```json
POST /api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "employee_id": "uuid-of-employee",
  "date": "2024-01-15",
  "check_in_time": "09:30:00"
}
```

**Note**: If attendance already exists for the same employee and date, it will be updated instead of creating a duplicate.

#### Get Monthly Report

```
GET /api/attendance/report/monthly?month=2024-01
Authorization: Bearer <token>
```

#### Monthly Report Response

```json
{
  "success": true,
  "data": [
    {
      "employee_id": "uuid",
      "name": "John Doe",
      "days_present": 22,
      "times_late": 3
    }
  ],
  "month": "2024-01"
}
```

**Late Rule**: Check-in after **09:45:00** is counted as late.

#### Filter Attendance

```
GET /api/attendance?employee_id=uuid&from=2024-01-01&to=2024-01-31&page=1&limit=10
Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

### hr_users

Stores HR user accounts for authentication.

| Column        | Type      | Constraints                            | Description            |
| ------------- | --------- | -------------------------------------- | ---------------------- |
| id            | UUID      | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier      |
| email         | STRING    | NOT NULL, UNIQUE                       | User email address     |
| password_hash | STRING    | NOT NULL                               | bcrypt hashed password |
| name          | STRING    | NOT NULL                               | User's full name       |
| created_at    | TIMESTAMP | DEFAULT NOW()                          | Creation timestamp     |
| updated_at    | TIMESTAMP | DEFAULT NOW()                          | Last update timestamp  |

### employees

Stores employee information with soft delete support.

| Column        | Type          | Constraints                            | Description           |
| ------------- | ------------- | -------------------------------------- | --------------------- |
| id            | UUID          | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier     |
| name          | STRING        | NOT NULL                               | Employee's full name  |
| age           | INTEGER       | NOT NULL                               | Employee's age        |
| designation   | STRING        | NOT NULL                               | Job title/position    |
| hiring_date   | DATE          | NOT NULL                               | Date of hiring        |
| date_of_birth | DATE          | NOT NULL                               | Date of birth         |
| salary        | DECIMAL(12,2) | NOT NULL                               | Salary amount         |
| photo_path    | STRING        | NULL                                   | Local path to photo   |
| deleted_at    | TIMESTAMP     | NULL                                   | Soft delete timestamp |
| created_at    | TIMESTAMP     | DEFAULT NOW()                          | Creation timestamp    |
| updated_at    | TIMESTAMP     | DEFAULT NOW()                          | Last update timestamp |

### attendance

Tracks daily employee attendance with unique constraint per employee per day.

| Column        | Type      | Constraints                                           | Description             |
| ------------- | --------- | ----------------------------------------------------- | ----------------------- |
| id            | UUID      | PRIMARY KEY, DEFAULT gen_random_uuid()                | Unique identifier       |
| employee_id   | UUID      | NOT NULL, REFERENCES employees(id), ON DELETE CASCADE | Foreign key to employee |
| date          | DATE      | NOT NULL                                              | Attendance date         |
| check_in_time | TIME      | NOT NULL                                              | Time of check-in        |
| created_at    | TIMESTAMP | DEFAULT NOW()                                         | Creation timestamp      |
| updated_at    | TIMESTAMP | DEFAULT NOW()                                         | Last update timestamp   |

**Unique Constraint**: (`employee_id`, `date`) - ensures single record per employee per day.

---

## 🧪 Available Scripts

```bash
# Development
bun dev              # Start dev server with hot reload
bun run dev          # Same as above

# Build
bun build            # Build for production (compiles TypeScript)
bun start            # Start production server (runs dist/index.js)

# Database Migrations
bun migrate:latest   # Run all pending migrations
bun migrate:rollback # Rollback last migration batch
bun migrate:status   # Check migration status
bun migrate:make     # Create new migration file

# Code Quality
bun lint             # Run ESLint to check code
bun lint:fix         # Run ESLint with auto-fix
bun format          # Format code with Prettier
bun format:check    # Check Prettier formatting
bun type-check      # Run TypeScript type checking

# Testing
bun test            # Run tests (currently not configured)
```

---

## 🔒 Security Features

- **JWT Authentication**: All protected routes require valid Bearer tokens
- **Password Hashing**: bcrypt with configurable salt rounds
- **Input Validation**: Joi schema validation for all inputs
- **Helmet**: HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- **CORS**: Configurable cross-origin resource sharing
- **Compression**: Response compression for better performance

---

## 📦 Key Dependencies

### Production Dependencies

| Package      | Version | Purpose                       |
| ------------ | ------- | ----------------------------- |
| express      | ^5.2.1  | Web framework                 |
| knex         | ^3.1.0  | SQL query builder             |
| pg           | ^8.18.0 | PostgreSQL driver             |
| joi          | ^18.0.2 | Input validation              |
| jsonwebtoken | ^9.0.3  | JWT authentication            |
| bcrypt       | ^6.0.0  | Password hashing              |
| multer       | ^2.0.2  | File upload handling          |
| helmet       | ^8.1.0  | HTTP security headers         |
| cors         | ^2.8.6  | Cross-origin resource sharing |
| compression  | ^1.8.1  | Response compression          |
| morgan       | ^1.10.1 | HTTP request logging          |
| dotenv       | ^17.2.4 | Environment variables         |
| http-status  | ^2.1.0  | HTTP status codes             |

### Development Dependencies

| Package                          | Version | Purpose                      |
| -------------------------------- | ------- | ---------------------------- |
| typescript                       | ^5.9.3  | TypeScript compiler          |
| @types/node                      | ^25.2.1 | Node.js type definitions     |
| @types/express                   | ^5.0.6  | Express type definitions     |
| @typescript-eslint/eslint-plugin | ^8.54.0 | ESLint plugin for TypeScript |
| @typescript-eslint/parser        | ^8.54.0 | TypeScript parser for ESLint |
| eslint                           | ^9.39.2 | Code linting                 |
| eslint-config-prettier           | ^10.1.8 | Prettier config for ESLint   |
| eslint-plugin-prettier           | ^5.5.5  | Prettier plugin for ESLint   |
| prettier                         | ^3.8.1  | Code formatting              |
| bun-types                        | ^1.3.8  | Bun type definitions         |

---

## 🎯 Features Implemented

### Core Features

- ✅ JWT-based authentication with refresh tokens
- ✅ HR user registration and login
- ✅ Employee CRUD with file upload support
- ✅ Soft delete for employees
- ✅ Attendance tracking with upsert capability
- ✅ Monthly attendance reports
- ✅ Late arrival tracking (after 09:45 AM)
- ✅ Pagination and filtering
- ✅ Search functionality

### Bonus Features

- ✅ Pagination for GET /employees and GET /attendance
- ✅ Search filter for employees by name
- ✅ Date range filtering for attendance
- ✅ Soft delete with deleted_at column
- ✅ Employee count by designation
- ✅ Filter employees by designation

---

## 📊 Error Handling

All errors are handled consistently with the following response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common HTTP status codes:

- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

---

## 📁 Postman Collection

A Postman collection is available in the repository:

- **File**: `Hr-Management.postman_collection.json`
- **Usage**: Import into Postman to test all endpoints

### Import Instructions:

1. Open Postman
2. Click "Import" button
3. Select the JSON file
4. Configure environment variables:
   - `BASE_URL`: `http://localhost:5000`
   - `authorization`: JWT token from login response

---

## 🏗️ Architecture

This project follows a layered architecture pattern:

```
Request → Route → Controller → Service → Model → Database
         ↓
    Middleware (Auth, Validation, Error Handling)
```

### Layer Responsibilities:

- **Routes**: Define API endpoints and map to controllers
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic implementation
- **Models**: Database operations
- **Middleware**: Authentication, validation, error handling
- **Validators**: Joi schemas for input validation

---

## 🧩 TypeScript Configuration

The project uses strict TypeScript with the following features:

- ES Modules (ESM) syntax
- Path aliases (`@/` for src directory)
- Strict type checking
- Type augmentation for Express Request
- Type-safe database models

---

## 📄 License

ISC License

---

## 👤 Author

**Golam Mahabub Redoy**

---

## 🙏 Acknowledgments

- M360 ICT Developer Recruitment Task
- Express.js team
- PostgreSQL team
- TypeScript team
