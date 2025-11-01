import { useState } from 'react'
import { GradeList } from './GradeList'
import { GradeForm } from './GradeForm'
import type { Grade } from '@/types'

export const GradeManagement = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)

  const handleEditGrade = (grade: Grade) => {
    setSelectedGrade(grade)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setSelectedGrade(null)
  }

  return (
    <div className="space-y-6">
      <GradeList onEditGrade={handleEditGrade} />

      <GradeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        grade={selectedGrade}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
