import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import type { Professor, CreateProfessorData, UpdateProfessorData, ProfessorsResponse, ProfessorFilters } from '@/types'

export const useProfessors = (filters?: ProfessorFilters) => {
  const queryClient = useQueryClient()

  const queryParams = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status)
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
  if (filters?.order) queryParams.append('order', filters.order)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())
  if (filters?.department) queryParams.append('department', filters.department)

  const { data, isLoading } = useQuery<ProfessorsResponse>({
    queryKey: ['professors', filters],
    queryFn: async (): Promise<ProfessorsResponse> => {
      const response = await api.get<ProfessorsResponse>(`/professors?${queryParams.toString()}`)
      return response.data
    },
  })

  const professors = data?.professors || []
  const pagination = data?.pagination

  const createProfessor = useMutation({
    mutationFn: async (data: CreateProfessorData): Promise<Professor> => {
      const response = await api.post<Professor>('/professors', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'], exact: false })
      toast.success('Professor created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create professor')
    },
  })

  const updateProfessor = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProfessorData }): Promise<Professor> => {
      const response = await api.put<Professor>(`/professors/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'], exact: false })
      toast.success('Professor updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update professor')
    },
  })

  const deleteProfessor = useMutation({
    mutationFn: async (id: number): Promise<number> => {
      await api.delete(`/professors/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'], exact: false })
      toast.success('Professor deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete professor')
    },
  })

  return {
    professors,
    isLoading,
    pagination,
    createProfessor,
    updateProfessor,
    deleteProfessor,
  }
}
