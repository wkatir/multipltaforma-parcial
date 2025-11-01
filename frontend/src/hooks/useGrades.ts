import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Grade, UpdateGradeData, GradesResponse, GradeFilters } from '@/types'

export const useGrades = (filters?: GradeFilters) => {
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

  const { data, isLoading } = useQuery<GradesResponse>({
    queryKey: ['grades', filters],
    queryFn: async (): Promise<GradesResponse> => {
      const response = await api.get<GradesResponse>(`/grades?${queryParams.toString()}`)
      return response.data
    },
  })

  const grades = data?.grades || []
  const pagination = data?.pagination

  const updateGrade = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateGradeData }): Promise<Grade> => {
      const response = await api.put<Grade>(`/grades/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'], exact: false })
      toast.success('Grade updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update grade')
    },
  })

  return {
    grades,
    isLoading,
    pagination,
    updateGrade,
  }
}
