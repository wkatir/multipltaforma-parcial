# University Management System - Full Stack Application

A comprehensive full-stack university management system built with modern technologies. Manage students, professors, courses, enrollments, and grades with a beautiful, responsive interface.

## Project Structure

```
├── backend/          # Express API server with Prisma ORM
│   ├── src/         # TypeScript source files
│   │   ├── controllers/  # Business logic for each entity
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Authentication, rate limiting, error handling
│   │   └── config/       # Database configuration
│   ├── prisma/      # Database schema and migrations
│   └── package.json
│
└── frontend/        # React application with Vite
    ├── src/         # TypeScript source files
    ├── components/  # Reusable React components
    ├── hooks/       # Custom hooks for data fetching
    ├── lib/         # Utilities and API client
    └── package.json
```

## Tech Stack Overview

### Backend
- **Express**: REST API server with middleware support
- **Prisma**: Type-safe ORM with SQLite database
- **JWT**: Secure authentication and authorization
- **bcryptjs**: Password hashing
- **express-rate-limit**: API rate limiting
- **express-validator**: Request validation
- **TypeScript**: Type safety and better developer experience

### Frontend
- **React 19**: Latest React version with improved performance
- **Vite**: Lightning-fast build tool and development server
- **TanStack Router**: Type-safe routing with file-based routing
- **TanStack Query**: Powerful data fetching and caching
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible, customizable UI components
- **React Hook Form + Zod**: Form handling with validation
- **Recharts**: Data visualization components
- **TypeScript**: Type safety across the entire frontend

## Quick Start Guide

### Prerequisites

Before running the project, make sure you have:

- **Node.js** (v18 or higher)
- **pnpm** package manager

To install pnpm globally:
```bash
npm install -g pnpm
```

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Generate Prisma client
pnpm run prisma:generate

# Run database migrations
pnpm run prisma:migrate

# Start backend server
pnpm run dev
```

The backend will start on `http://localhost:3000`

### Step 2: Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Start frontend development server
pnpm run dev
```

The frontend will start on `http://localhost:5173`

### Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You can now:
1. Register a new admin user account
2. Login with your credentials
3. Manage students, professors, and courses
4. Create and track enrollments
5. Record and manage grades
6. View comprehensive statistics and analytics
7. Toggle between light/dark themes

## Development Workflow

### Running Both Servers

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
pnpm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm run dev
```

### Database Management

View and edit database with Prisma Studio:
```bash
cd backend
pnpm run prisma:studio
```

This opens a GUI at `http://localhost:5555`

## Production Build

### Build Backend
```bash
cd backend
pnpm run build
pnpm run start
```

### Build Frontend
```bash
cd frontend
pnpm run build
pnpm run preview
```

## API Configuration

The frontend connects to the backend API at `http://localhost:3000/api`

If you need to change the API URL, update the configuration in:
```
frontend/src/lib/api.ts
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

**Backend:** Change PORT in backend/.env
**Frontend:** Vite will automatically use next available port

### Database Issues

Reset database:
```bash
cd backend
rm prisma/dev.db
pnpm run prisma:migrate
```

### Dependencies Issues

Clear node_modules and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Features

### 🎓 Student Management
- Complete CRUD operations for students
- Advanced filtering by status, career, enrollment date
- Search functionality across multiple fields
- Detailed student profiles with enrollment history

### 👨‍🏫 Professor Management
- Full professor lifecycle management
- Department and specialty tracking
- Course assignment capabilities
- Status management (Active/Inactive)

### 📚 Course Management
- Comprehensive course catalog
- Professor assignment and capacity management
- Semester and schedule tracking
- Enrollment monitoring

### 📝 Enrollment System
- Student-course enrollment management
- Enrollment status tracking (Enrolled/Dropped/Completed)
- Capacity validation
- Historical enrollment data

### 📊 Grade Management
- Multi-partial grade recording
- Final grade calculation and approval
- Grade status tracking (Pending/Approved/Failed)
- Detailed grade comments and feedback

### 📈 Analytics & Statistics
- University-wide statistics dashboard
- Enrollment trends and patterns
- Course utilization metrics
- Student performance analytics

### 🔐 Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- API rate limiting
- Request validation and sanitization

### 🎨 User Experience
- Modern, responsive design
- Dark/Light theme support
- Accessible UI components
- Real-time data updates
- Comprehensive error handling

## Architecture Highlights

### Why These Technologies?

**Express + Prisma**: Robust backend foundation with type-safe database operations, perfect for complex university data relationships and business logic.

**React 19 + TypeScript**: Latest React features with complete type safety, ensuring reliable frontend development for complex forms and data management.

**TanStack Query**: Essential for handling complex server state in educational applications with real-time updates and caching.

**Tailwind CSS + Radix UI**: Beautiful, accessible design system that works perfectly for administrative interfaces requiring both functionality and aesthetics.

**Zustand + TanStack Router**: Lightweight, performant state management and routing that scales well with growing application complexity.

This technology stack provides the reliability, performance, and developer experience needed for a production university management system.

