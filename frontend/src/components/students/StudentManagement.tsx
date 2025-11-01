import { useState } from 'react'
import { StudentList } from './StudentList'
import { StudentForm } from './StudentForm'
import { StudentDeleteDialog } from './StudentDeleteDialog'
import type { Student } from '@/types'
import { useStudents } from '@/hooks/useStudents'

export const StudentManagement = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const { deleteStudent } = useStudents()

  const handleCreateStudent = () => {
    setSelectedStudent(null)
    setFormOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setFormOpen(true)
  }

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedStudent) {
      try {
        await deleteStudent.mutateAsync(selectedStudent.id)
        setDeleteDialogOpen(false)
        setSelectedStudent(null)
      } catch (error) {
        console.error('Error deleting student:', error)
      }
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setSelectedStudent(null)
  }

  return (
    <div className="space-y-6">
      <StudentList
        onCreateStudent={handleCreateStudent}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        student={selectedStudent}
        onSuccess={handleFormSuccess}
      />

      <StudentDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        student={selectedStudent}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteStudent.isPending}
      />
    </div>
  )
}
