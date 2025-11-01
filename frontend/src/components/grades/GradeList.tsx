import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IconEdit, IconSearch, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useGrades } from '@/hooks/useGrades'
import { useStudents } from '@/hooks/useStudents'
import { useCourses } from '@/hooks/useCourses'
import type { Grade, GradeFilters } from '@/types'

interface GradeListProps {
  onEditGrade: (grade: Grade) => void
}

export const GradeList = ({ onEditGrade }: GradeListProps) => {
  const [filters, setFilters] = useState<GradeFilters>({
    page: 1,
    limit: 10,
  })

  const { grades, isLoading, pagination } = useGrades(filters)
  const { students } = useStudents({ limit: 1000 })
  const { courses } = useCourses({ limit: 1000 })

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status as GradeFilters['status'],
      page: 1
    }))
  }

  const handleStudentFilter = (studentId: string) => {
    setFilters(prev => ({
      ...prev,
      studentId: studentId === 'all' ? undefined : parseInt(studentId),
      page: 1
    }))
  }

  const handleCourseFilter = (courseId: string) => {
    setFilters(prev => ({
      ...prev,
      courseId: courseId === 'all' ? undefined : parseInt(courseId),
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName} (${student.carnet})` : 'Unknown'
  }

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId)
    return course ? `${course.name} (${course.code})` : 'Unknown'
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grade Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search grades..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleStudentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.slice(0, 50).map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.firstName} {student.lastName} ({student.carnet})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleCourseFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.slice(0, 50).map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Partial 1</TableHead>
                  <TableHead>Partial 2</TableHead>
                  <TableHead>Partial 3</TableHead>
                  <TableHead>Final Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20"></div></TableCell>
                    </TableRow>
                  ))
                ) : grades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No grades found
                    </TableCell>
                  </TableRow>
                ) : (
                  grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell className="max-w-xs truncate" title={getStudentName(grade.studentId)}>
                        {getStudentName(grade.studentId)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={getCourseName(grade.courseId)}>
                        {getCourseName(grade.courseId)}
                      </TableCell>
                      <TableCell>{grade.partial1 ?? '-'}</TableCell>
                      <TableCell>{grade.partial2 ?? '-'}</TableCell>
                      <TableCell>{grade.partial3 ?? '-'}</TableCell>
                      <TableCell className="font-semibold">
                        {grade.finalGrade ? `${grade.finalGrade}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(grade.status)}>
                          {grade.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditGrade(grade)}
                        >
                          <IconEdit size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} grades
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <IconChevronLeft size={16} />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <IconChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
