import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Course, CreateCourseData, UpdateCourseData, CoursesResponse, CourseFilters } from '@/types'

export const useCourses = (filters?: CourseFilters) => {
  const queryClient = useQueryClient()

  const queryParams = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status)
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
  if (filters?.order) queryParams.append('order', filters.order)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())
  if (filters?.professorId) queryParams.append('professorId', filters.professorId.toString())
  if (filters?.semester) queryParams.append('semester', filters.semester)

  const { data, isLoading } = useQuery<CoursesResponse>({
    queryKey: ['courses', filters],
    queryFn: async (): Promise<CoursesResponse> => {
      const response = await api.get<CoursesResponse>(`/courses?${queryParams.toString()}`)
      return response.data
    },
  })

  const courses = data?.courses || []
  const pagination = data?.pagination

  const createCourse = useMutation({
    mutationFn: async (data: CreateCourseData): Promise<Course> => {
      const response = await api.post<Course>('/courses', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false })
      toast.success('Course created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create course')
    },
  })

  const updateCourse = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCourseData }): Promise<Course> => {
      const response = await api.put<Course>(`/courses/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false })
      toast.success('Course updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update course')
    },
  })

  const deleteCourse = useMutation({
    mutationFn: async (id: number): Promise<number> => {
      await api.delete(`/courses/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false })
      toast.success('Course deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete course')
    },
  })

  return {
    courses,
    isLoading,
    pagination,
    createCourse,
    updateCourse,
    deleteCourse,
  }
}
