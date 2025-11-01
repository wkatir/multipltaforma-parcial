export interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'PROFESSOR' | 'STUDENT'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface Student {
  id: number
  carnet: string
  firstName: string
  lastName: string
  email: string
  phone: string
  career: string
  enrollmentDate: string
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
  enrollments?: Enrollment[]
  grades?: Grade[]
  createdAt: string
  updatedAt: string
}

export interface Professor {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialty: string
  department: string
  hireDate: string
  status: 'ACTIVE' | 'INACTIVE'
  courses?: Course[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: number
  code: string
  name: string
  description?: string
  credits: number
  professorId: number
  professor?: Professor
  maxCapacity: number
  currentEnrollment: number
  schedule: string
  semester: string
  status: 'ACTIVE' | 'INACTIVE'
  enrollments?: Enrollment[]
  grades?: Grade[]
  createdAt: string
  updatedAt: string
}

export interface Enrollment {
  id: number
  studentId: number
  student?: Student
  courseId: number
  course?: Course
  enrollmentDate: string
  status: 'ENROLLED' | 'DROPPED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

export interface Grade {
  id: number
  studentId: number
  student?: Student
  courseId: number
  course?: Course
  partial1?: number
  partial2?: number
  partial3?: number
  finalGrade?: number
  status: 'PENDING' | 'APPROVED' | 'FAILED'
  comments?: string
  createdAt: string
  updatedAt: string
}

export interface CreateStudentData {
  carnet: string
  firstName: string
  lastName: string
  email: string
  phone: string
  career: string
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
}

export interface UpdateStudentData {
  carnet?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  career?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
}

export interface CreateProfessorData {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialty: string
  department: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface UpdateProfessorData {
  employeeId?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  specialty?: string
  department?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface CreateCourseData {
  code: string
  name: string
  description?: string
  credits: number
  professorId: number
  maxCapacity: number
  schedule: string
  semester: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface UpdateCourseData {
  code?: string
  name?: string
  description?: string
  credits?: number
  professorId?: number
  maxCapacity?: number
  schedule?: string
  semester?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface CreateEnrollmentData {
  studentId: number
  courseId: number
}

export interface UpdateEnrollmentData {
  status?: 'ENROLLED' | 'DROPPED' | 'COMPLETED'
}

export interface UpdateGradeData {
  partial1?: number
  partial2?: number
  partial3?: number
  finalGrade?: number
  status?: 'PENDING' | 'APPROVED' | 'FAILED'
  comments?: string
}

export interface UniversityStats {
  totalStudents: number
  totalProfessors: number
  totalCourses: number
  totalEnrollments: number
  activeCourses: number
  graduatedStudents: number
}

export interface StudentsResponse {
  students: Student[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ProfessorsResponse {
  professors: Professor[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CoursesResponse {
  courses: Course[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface EnrollmentsResponse {
  enrollments: Enrollment[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface GradesResponse {
  grades: Grade[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface StudentFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'all'
  search?: string
  sortBy?: 'createdAt' | 'firstName' | 'lastName' | 'carnet'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  career?: string
}

export interface ProfessorFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'all'
  search?: string
  sortBy?: 'createdAt' | 'firstName' | 'lastName' | 'employeeId'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  department?: string
}

export interface CourseFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'all'
  search?: string
  sortBy?: 'createdAt' | 'name' | 'code' | 'semester'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  professorId?: number
  semester?: string
}

export interface EnrollmentFilters {
  status?: 'ENROLLED' | 'DROPPED' | 'COMPLETED' | 'all'
  search?: string
  sortBy?: 'enrollmentDate' | 'createdAt'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  studentId?: number
  courseId?: number
}

export interface GradeFilters {
  status?: 'PENDING' | 'APPROVED' | 'FAILED' | 'all'
  search?: string
  sortBy?: 'createdAt' | 'finalGrade'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  studentId?: number
  courseId?: number
}





