import { useState } from 'react'
import { EnrollmentList } from './EnrollmentList'
import { EnrollmentForm } from './EnrollmentForm'
import { EnrollmentDeleteDialog } from './EnrollmentDeleteDialog'
import type { Enrollment } from '@/types'
import { useEnrollments } from '@/hooks/useEnrollments'

export const EnrollmentManagement = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)

  const { deleteEnrollment } = useEnrollments()

  const handleCreateEnrollment = () => {
    setSelectedEnrollment(null)
    setFormOpen(true)
  }

  const handleEditEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setFormOpen(true)
  }

  const handleDeleteEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedEnrollment) {
      try {
        await deleteEnrollment.mutateAsync(selectedEnrollment.id)
        setDeleteDialogOpen(false)
        setSelectedEnrollment(null)
      } catch (error) {
        console.error('Error deleting enrollment:', error)
      }
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setSelectedEnrollment(null)
  }

  return (
    <div className="space-y-6">
      <EnrollmentList
        onCreateEnrollment={handleCreateEnrollment}
        onEditEnrollment={handleEditEnrollment}
        onDeleteEnrollment={handleDeleteEnrollment}
      />

      <EnrollmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        enrollment={selectedEnrollment}
        onSuccess={handleFormSuccess}
      />

      <EnrollmentDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        enrollment={selectedEnrollment}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteEnrollment.isPending}
      />
    </div>
  )
}
