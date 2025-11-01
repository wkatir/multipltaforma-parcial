import { useState } from 'react'
import { CourseList } from './CourseList'
import { CourseForm } from './CourseForm'
import { CourseDeleteDialog } from './CourseDeleteDialog'
import type { Course } from '@/types'
import { useCourses } from '@/hooks/useCourses'

export const CourseManagement = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const { deleteCourse } = useCourses()

  const handleCreateCourse = () => {
    setSelectedCourse(null)
    setFormOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setFormOpen(true)
  }

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedCourse) {
      try {
        await deleteCourse.mutateAsync(selectedCourse.id)
        setDeleteDialogOpen(false)
        setSelectedCourse(null)
      } catch (error) {
        console.error('Error deleting course:', error)
      }
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setSelectedCourse(null)
  }

  return (
    <div className="space-y-6">
      <CourseList
        onCreateCourse={handleCreateCourse}
        onEditCourse={handleEditCourse}
        onDeleteCourse={handleDeleteCourse}
      />

      <CourseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        course={selectedCourse}
        onSuccess={handleFormSuccess}
      />

      <CourseDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        course={selectedCourse}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteCourse.isPending}
      />
    </div>
  )
}
