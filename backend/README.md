# Backend - Sistem Management Project dan Quotation

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Docker

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Docker (optional)

### Installation
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev

# Start production server
npm start
```

## Project Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
├── migrations/
├── tests/
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Quotations
- `GET /api/quotations` - List all quotations
- `POST /api/quotations` - Create new quotation
- `GET /api/quotations/:id` - Get quotation by ID
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation
- `POST /api/quotations/:id/approve` - Approve quotation
- `POST /api/quotations/:id/reject` - Reject quotation

## Environment Variables
Create `.env` file:
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/project_management
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
```

## Database Setup
```sql
-- Create database
CREATE DATABASE project_management;

-- Run migrations
npm run migrate
```

## Development
- Run `npm run dev` to start development server with nodemon
- Run `npm start` to start production server
- Run `npm test` to run tests
- Run `npm run migrate` to run database migrations 