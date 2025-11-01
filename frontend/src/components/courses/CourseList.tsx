import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IconPlus, IconEdit, IconTrash, IconSearch, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useCourses } from '@/hooks/useCourses'
import { useProfessors } from '@/hooks/useProfessors'
import type { Course, CourseFilters } from '@/types'

interface CourseListProps {
  onCreateCourse: () => void
  onEditCourse: (course: Course) => void
  onDeleteCourse: (course: Course) => void
}

export const CourseList = ({ onCreateCourse, onEditCourse, onDeleteCourse }: CourseListProps) => {
  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 10,
  })

  const { courses, isLoading, pagination } = useCourses(filters)
  const { professors } = useProfessors({ limit: 1000 })

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status as CourseFilters['status'],
      page: 1
    }))
  }

  const handleProfessorFilter = (professorId: string) => {
    setFilters(prev => ({
      ...prev,
      professorId: professorId === 'all' ? undefined : parseInt(professorId),
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      INACTIVE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getProfessorName = (professorId: number) => {
    const professor = professors.find(p => p.id === professorId)
    return professor ? `${professor.firstName} ${professor.lastName}` : 'Unknown'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Courses</CardTitle>
            <Button onClick={onCreateCourse} className="flex items-center gap-2">
              <IconPlus size={16} />
              Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search courses..."
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleProfessorFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Professor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Professors</SelectItem>
                {professors.map((professor) => (
                  <SelectItem key={professor.id} value={professor.id.toString()}>
                    {professor.firstName} {professor.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Semester</TableHead>
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
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20"></div></TableCell>
                    </TableRow>
                  ))
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium font-mono">{course.code}</TableCell>
                      <TableCell className="max-w-xs truncate" title={course.name}>
                        {course.name}
                      </TableCell>
                      <TableCell>{getProfessorName(course.professorId)}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>{course.maxCapacity}</TableCell>
                      <TableCell>{course.currentEnrollment}</TableCell>
                      <TableCell>{course.semester}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(course.status)}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCourse(course)}
                          >
                            <IconEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteCourse(course)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <IconTrash size={16} />
                          </Button>
                        </div>
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
                {pagination.total} courses
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
