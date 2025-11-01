import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { UniversityStats } from '@/types'

export const useUniversityStats = () => {
  const { data, isLoading } = useQuery<UniversityStats>({
    queryKey: ['university-stats'],
    queryFn: async (): Promise<UniversityStats> => {
      const response = await api.get<UniversityStats>('/stats')
      return response.data
    },
  })

  const stats = data || {
    totalStudents: 0,
    totalProfessors: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeCourses: 0,
    graduatedStudents: 0,
  }

  return {
    stats,
    isLoading,
  }
}
