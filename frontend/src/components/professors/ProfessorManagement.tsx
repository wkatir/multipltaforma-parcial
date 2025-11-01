import { useState } from 'react'
import { ProfessorList } from './ProfessorList'
import { ProfessorForm } from './ProfessorForm'
import { ProfessorDeleteDialog } from './ProfessorDeleteDialog'
import type { Professor } from '@/types'
import { useProfessors } from '@/hooks/useProfessors'

export const ProfessorManagement = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)

  const { deleteProfessor } = useProfessors()

  const handleCreateProfessor = () => {
    setSelectedProfessor(null)
    setFormOpen(true)
  }

  const handleEditProfessor = (professor: Professor) => {
    setSelectedProfessor(professor)
    setFormOpen(true)
  }

  const handleDeleteProfessor = (professor: Professor) => {
    setSelectedProfessor(professor)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedProfessor) {
      try {
        await deleteProfessor.mutateAsync(selectedProfessor.id)
        setDeleteDialogOpen(false)
        setSelectedProfessor(null)
      } catch (error) {
        console.error('Error deleting professor:', error)
      }
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setSelectedProfessor(null)
  }

  return (
    <div className="space-y-6">
      <ProfessorList
        onCreateProfessor={handleCreateProfessor}
        onEditProfessor={handleEditProfessor}
        onDeleteProfessor={handleDeleteProfessor}
      />

      <ProfessorForm
        open={formOpen}
        onOpenChange={setFormOpen}
        professor={selectedProfessor}
        onSuccess={handleFormSuccess}
      />

      <ProfessorDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        professor={selectedProfessor}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteProfessor.isPending}
      />
    </div>
  )
}
