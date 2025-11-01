import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IconPlus, IconEdit, IconTrash, IconSearch, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useProfessors } from '@/hooks/useProfessors'
import type { Professor, ProfessorFilters } from '@/types'
import { format } from 'date-fns'

interface ProfessorListProps {
  onCreateProfessor: () => void
  onEditProfessor: (professor: Professor) => void
  onDeleteProfessor: (professor: Professor) => void
}

export const ProfessorList = ({ onCreateProfessor, onEditProfessor, onDeleteProfessor }: ProfessorListProps) => {
  const [filters, setFilters] = useState<ProfessorFilters>({
    page: 1,
    limit: 10,
  })

  const { professors, isLoading, pagination } = useProfessors(filters)

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status as ProfessorFilters['status'],
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Professors</CardTitle>
            <Button onClick={onCreateProfessor} className="flex items-center gap-2">
              <IconPlus size={16} />
              Add Professor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search professors..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hire Date</TableHead>
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
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-24"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20"></div></TableCell>
                    </TableRow>
                  ))
                ) : professors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No professors found
                    </TableCell>
                  </TableRow>
                ) : (
                  professors.map((professor) => (
                    <TableRow key={professor.id}>
                      <TableCell className="font-medium">{professor.employeeId}</TableCell>
                      <TableCell>{`${professor.firstName} ${professor.lastName}`}</TableCell>
                      <TableCell>{professor.email}</TableCell>
                      <TableCell>{professor.specialty}</TableCell>
                      <TableCell>{professor.department}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(professor.status)}>
                          {professor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(professor.hireDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditProfessor(professor)}
                          >
                            <IconEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteProfessor(professor)}
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
                {pagination.total} professors
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
