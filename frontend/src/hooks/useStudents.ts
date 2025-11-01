import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Student, CreateStudentData, UpdateStudentData, StudentsResponse, StudentFilters } from '@/types'

export const useStudents = (filters?: StudentFilters) => {
  const queryClient = useQueryClient()

  const queryParams = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status)
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
  if (filters?.order) queryParams.append('order', filters.order)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())
  if (filters?.career) queryParams.append('career', filters.career)

  const { data, isLoading } = useQuery<StudentsResponse>({
    queryKey: ['students', filters],
    queryFn: async (): Promise<StudentsResponse> => {
      const response = await api.get<StudentsResponse>(`/students?${queryParams.toString()}`)
      return response.data
    },
  })

  const students = data?.students || []
  const pagination = data?.pagination

  const createStudent = useMutation({
    mutationFn: async (data: CreateStudentData): Promise<Student> => {
      const response = await api.post<Student>('/students', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false })
      toast.success('Student created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create student')
    },
  })

  const updateStudent = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateStudentData }): Promise<Student> => {
      const response = await api.put<Student>(`/students/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false })
      toast.success('Student updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update student')
    },
  })

  const deleteStudent = useMutation({
    mutationFn: async (id: number): Promise<number> => {
      await api.delete(`/students/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false })
      toast.success('Student deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete student')
    },
  })

  return {
    students,
    isLoading,
    pagination,
    createStudent,
    updateStudent,
    deleteStudent,
  }
}
