# University Management System - Frontend

The React frontend for the comprehensive University Management System. Built with modern React 19, TypeScript, and a complete UI component library.

## 🚀 Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Advanced data fetching and caching
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Hook Form + Zod** - Form validation
- **Recharts** - Data visualization

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── students/        # Student management
│   ├── professors/      # Professor management
│   ├── courses/         # Course management
│   ├── enrollments/     # Enrollment management
│   ├── grades/          # Grade management
│   ├── tasks/           # Dashboard and stats
│   ├── layout/          # Layout components
│   └── ui/              # Base UI components
├── hooks/               # Custom hooks for data operations
├── lib/                 # Utilities and configurations
├── routes/              # Route definitions
├── store/               # Zustand stores
└── types/               # TypeScript type definitions
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- pnpm package manager

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm run dev
```

### Build for Production
```bash
pnpm run build
```

### Preview Production Build
```bash
pnpm run preview
```

## 🎯 Key Features

### Component Architecture
- **Modular Design**: Each feature has its own component directory
- **Reusable Components**: Shared UI components in the `ui/` directory
- **Type-Safe Props**: Full TypeScript integration throughout

### Data Management
- **Optimistic Updates**: Real-time UI updates with rollback on errors
- **Caching Strategy**: Intelligent caching with TanStack Query
- **Background Refetching**: Automatic data synchronization

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant with Radix UI primitives
- **Theme Support**: Dark/light mode with system preference detection
- **Loading States**: Comprehensive loading and error states

### Form Handling
- **Validation**: Zod schemas with React Hook Form
- **Type Safety**: Form data typed end-to-end
- **User Feedback**: Real-time validation and error messages

## 🔌 API Integration

The frontend communicates with the Express backend API through:
- **Centralized API Client**: Configured in `src/lib/api.ts`
- **Interceptors**: Automatic authentication and error handling
- **Type-Safe Requests**: Full TypeScript support for API calls

## 🎨 Styling

- **Tailwind CSS**: Utility-first approach for rapid development
- **Design System**: Consistent spacing, colors, and typography
- **Component Variants**: Flexible component APIs with class-variance-authority
- **Dark Mode**: Complete theme system with CSS variables

## 🧪 Development Guidelines

### Code Style
- ESLint configuration for consistent code quality
- Prettier for automatic code formatting
- TypeScript strict mode enabled

### Component Patterns
- Functional components with hooks
- Custom hooks for business logic
- Separation of concerns between UI and data

### State Management
- Zustand for global app state (auth, theme)
- TanStack Query for server state
- Local component state for UI concerns

## 📱 Pages & Routes

- `/` - Dashboard with university statistics
- `/login` - User authentication
- `/register` - User registration
- `/students` - Student management
- `/professors` - Professor management
- `/courses` - Course management
- `/enrollments` - Enrollment management
- `/grades` - Grade management

## 🔍 Troubleshooting

### Common Issues

**Build Errors**: Ensure all dependencies are installed with `pnpm install`

**Type Errors**: Check TypeScript configuration and type definitions

**Styling Issues**: Verify Tailwind CSS classes and configuration

**API Errors**: Check backend server is running and API endpoints match

## 🤝 Contributing

1. Follow the established code patterns
2. Maintain type safety
3. Test components thoroughly
4. Follow the component architecture guidelines
5. Ensure responsive design works on all screen sizes
