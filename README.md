# Sistem Management Project dan Quotation

Aplikasi web untuk mengelola proyek dan quotation dengan teknologi modern.

[![CI/CD](https://github.com/muhajirshiddiqaf/project-management/workflows/CI%2FCD/badge.svg)](https://github.com/muhajirshiddiqaf/project-management/actions)
[![Codecov](https://codecov.io/gh/muhajirshiddiqaf/project-management/branch/main/graph/badge.svg)](https://codecov.io/gh/muhajirshiddiqaf/project-management)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://hub.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)

## 🚀 Tech Stack

- **Frontend**: React.js dengan SaaS UI Pro
- **Backend**: Node.js dengan Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Authentication**: JWT

## 📁 Project Structure

```
Final Project/
├── documents/
│   ├── PRD_System_Management_Project_Quotation.md
│   └── History_Prompts.md
├── frontend/
│   ├── README.md
│   ├── Dockerfile
│   └── .dockerignore
├── backend/
│   ├── README.md
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
└── README.md
```

## 🛠️ Quick Start

### Prerequisites

- Docker
- Docker Compose
- Node.js (v18 or higher) - for local development

### Using Docker (Recommended)

1. **Clone repository**

```bash
git clone <repository-url>
cd "Final Project"
```

2. **Start all services**

```bash
docker-compose up -d
```

3. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

### Local Development

1. **Setup Backend**

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

2. **Setup Frontend**

```bash
cd frontend
npm install
npm run dev
```

3. **Setup Database**

```sql
CREATE DATABASE project_management;
```

## 📋 Features

### ✅ Completed

- [x] Project structure setup
- [x] Docker configuration
- [x] PRD documentation
- [x] History prompts tracking
- [x] CI/CD pipeline with GitHub Actions
- [x] Comprehensive test cases (Auth, Client, Project)
- [x] Code coverage reporting with Codecov
- [x] Company configuration module
- [x] Quotation system with billing information
- [x] Frontend routing and authentication

### 🚧 In Progress

- [x] Backend API development
- [x] Frontend React app setup
- [x] Database schema implementation
- [x] Authentication system
- [ ] Advanced quotation features
- [ ] Reporting and analytics

### 📝 Planned

- [ ] User management
- [ ] Project CRUD operations
- [ ] Quotation management
- [ ] Dashboard and analytics
- [ ] File upload functionality
- [ ] Email notifications
- [ ] PDF generation

## 🔧 Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Database Migrations

```bash
cd backend
npm run migrate
```

## 📚 Documentation

- [PRD System](documents/PRD_System_Management_Project_Quotation.md)
- [History Prompts](documents/History_Prompts.md)
- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up --build

# Stop and remove volumes
docker-compose down -v
```

## 🔐 Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password123@localhost:5432/project_management
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Project Management System
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@projectmanagement.com or create an issue in this repository.
