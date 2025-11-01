# University Management System - Backend

The Express.js backend API for the comprehensive University Management System. Built with TypeScript, Prisma ORM, and modern security practices.

## 🚀 Tech Stack

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Full type safety
- **Prisma** - Next-generation ORM
- **SQLite** - Lightweight database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - API rate limiting
- **express-validator** - Request validation

## 📁 Project Structure

```
src/
├── config/              # Database and configuration
├── controllers/         # Business logic for each entity
│   ├── authController.ts
│   ├── studentController.ts
│   ├── professorController.ts
│   ├── courseController.ts
│   ├── enrollmentController.ts
│   ├── gradeController.ts
│   └── statsController.ts
├── middleware/          # Express middleware
│   ├── auth.ts         # JWT authentication
│   ├── errorHandler.ts # Error handling
│   └── rateLimiter.ts  # Rate limiting
├── routes/             # API route definitions
│   ├── authRoutes.ts
│   ├── studentRoutes.ts
│   ├── professorRoutes.ts
│   ├── courseRoutes.ts
│   ├── enrollmentRoutes.ts
│   ├── gradeRoutes.ts
│   └── statsRoutes.ts
├── types/              # TypeScript type definitions
└── server.ts           # Application entry point

prisma/
├── schema.prisma       # Database schema
└── migrations/         # Database migrations
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- pnpm package manager

### Installation
```bash
pnpm install
```

### Database Setup
```bash
# Generate Prisma client
pnpm run prisma:generate

# Run database migrations
pnpm run prisma:migrate

# (Optional) Open Prisma Studio
pnpm run prisma:studio
```

### Development Server
```bash
pnpm run dev
```

### Build for Production
```bash
pnpm run build
pnpm run start
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students
- `GET /api/students` - Get all students (with filters/pagination)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Professors
- `GET /api/professors` - Get all professors (with filters/pagination)
- `GET /api/professors/:id` - Get professor by ID
- `POST /api/professors` - Create new professor
- `PUT /api/professors/:id` - Update professor
- `DELETE /api/professors/:id` - Delete professor

### Courses
- `GET /api/courses` - Get all courses (with filters/pagination)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments
- `GET /api/enrollments` - Get all enrollments (with filters/pagination)
- `GET /api/enrollments/:id` - Get enrollment by ID
- `POST /api/enrollments` - Create new enrollment
- `PUT /api/enrollments/:id` - Update enrollment
- `DELETE /api/enrollments/:id` - Delete enrollment

### Grades
- `GET /api/grades` - Get all grades (with filters/pagination)
- `GET /api/grades/:id` - Get grade by ID
- `POST /api/grades` - Create new grade
- `PUT /api/grades/:id` - Update grade
- `DELETE /api/grades/:id` - Delete grade

### Statistics
- `GET /api/stats` - Get university statistics

## 🔍 Query Parameters

### Filtering
All list endpoints support these query parameters:

- `status` - Filter by status (ACTIVE, INACTIVE, etc.)
- `search` - Search across relevant text fields
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field
- `order` - Sort order (asc/desc)

### Entity-Specific Filters
- **Students**: `career`
- **Professors**: `department`
- **Courses**: `professorId`, `semester`
- **Enrollments**: `studentId`, `courseId`
- **Grades**: `studentId`, `courseId`

## 🔐 Authentication

All API endpoints except `/api/auth/*` require authentication:

1. Include `Authorization: Bearer <token>` header
2. Token obtained from login/register endpoints
3. Tokens expire after 7 days

## 📊 Database Schema

The application uses SQLite with the following main entities:

- **User**: Authentication and authorization
- **Student**: Student information and enrollment history
- **Professor**: Professor details and course assignments
- **Course**: Course catalog with professor assignments
- **Enrollment**: Student-course relationships
- **Grade**: Academic performance tracking

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS**: Cross-origin resource sharing configuration

## 🧪 Development Guidelines

### Code Style
- ESLint configuration for consistent code quality
- TypeScript strict mode enabled
- Prettier for code formatting

### API Design
- RESTful conventions
- Consistent error response format
- Pagination for list endpoints
- Proper HTTP status codes

### Error Handling
- Centralized error handling middleware
- Consistent error response format
- Proper logging for debugging

## 🔍 Troubleshooting

### Common Issues

**Database Connection**: Ensure Prisma migrations are run
```bash
pnpm run prisma:migrate
```

**Port Conflicts**: Backend runs on port 3000 by default
```bash
# Change in .env file
PORT=3001
```

**Authentication Errors**: Verify JWT_SECRET is set
```bash
# Check .env file
echo $JWT_SECRET
```

**Migration Issues**: Reset database if needed
```bash
rm prisma/dev.db
pnpm run prisma:migrate
```

## 🤝 Contributing

1. Follow established API patterns
2. Maintain type safety
3. Add proper error handling
4. Update documentation for new endpoints
5. Test endpoints thoroughly
6. Follow security best practices
