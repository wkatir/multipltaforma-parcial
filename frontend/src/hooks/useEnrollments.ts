import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Enrollment, CreateEnrollmentData, UpdateEnrollmentData, EnrollmentsResponse, EnrollmentFilters } from '@/types'

export const useEnrollments = (filters?: EnrollmentFilters) => {
  const queryClient = useQueryClient()

  const queryParams = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status)
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
  if (filters?.order) queryParams.append('order', filters.order)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())
  if (filters?.studentId) queryParams.append('studentId', filters.studentId.toString())
  if (filters?.courseId) queryParams.append('courseId', filters.courseId.toString())

  const { data, isLoading } = useQuery<EnrollmentsResponse>({
    queryKey: ['enrollments', filters],
    queryFn: async (): Promise<EnrollmentsResponse> => {
      const response = await api.get<EnrollmentsResponse>(`/enrollments?${queryParams.toString()}`)
      return response.data
    },
  })

  const enrollments = data?.enrollments || []
  const pagination = data?.pagination

  const createEnrollment = useMutation({
    mutationFn: async (data: CreateEnrollmentData): Promise<Enrollment> => {
      const response = await api.post<Enrollment>('/enrollments', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false })
      toast.success('Enrollment created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create enrollment')
    },
  })

  const updateEnrollment = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateEnrollmentData }): Promise<Enrollment> => {
      const response = await api.put<Enrollment>(`/enrollments/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false })
      toast.success('Enrollment updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update enrollment')
    },
  })

  const deleteEnrollment = useMutation({
    mutationFn: async (id: number): Promise<number> => {
      await api.delete(`/enrollments/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['courses'], exact: false })
      toast.success('Enrollment deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete enrollment')
    },
  })

  return {
    enrollments,
    isLoading,
    pagination,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
  }
}
