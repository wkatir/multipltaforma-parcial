import { Card } from '@/components/ui/card'
import { IconUsers, IconUserCheck, IconBook, IconSchool, IconUserCog, IconAward } from '@tabler/icons-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useUniversityStats } from '@/hooks/useUniversityStats'
import { Skeleton } from '@/components/ui/skeleton'

export const UniversityStats = () => {
  const { stats, isLoading } = useUniversityStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20" />
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: IconUsers,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Total Professors',
      value: stats.totalProfessors,
      icon: IconUserCog,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: IconBook,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-950',
    },
    {
      title: 'Active Courses',
      value: stats.activeCourses,
      icon: IconSchool,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-950',
    },
    {
      title: 'Total Enrollments',
      value: stats.totalEnrollments,
      icon: IconUserCheck,
      color: 'text-teal-500',
      bgColor: 'bg-teal-100 dark:bg-teal-950',
    },
    {
      title: 'Graduated Students',
      value: stats.graduatedStudents,
      icon: IconAward,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100 dark:bg-pink-950',
    },
  ]

  // Mock data for charts - in a real app, this would come from the API
  const enrollmentChartData = [
    { name: 'Active', value: stats.totalEnrollments - stats.graduatedStudents, color: '#3b82f6' },
    { name: 'Graduated', value: stats.graduatedStudents, color: '#10b981' },
  ]

  const courseStatusData = [
    { name: 'Active', value: stats.activeCourses, color: '#f59e0b' },
    { name: 'Inactive', value: stats.totalCourses - stats.activeCourses, color: '#6b7280' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Enrollment Status</h3>
          {stats.totalEnrollments > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={enrollmentChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {enrollmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No enrollment data available
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Course Status</h3>
          {stats.totalCourses > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={courseStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {courseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No course data available
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}