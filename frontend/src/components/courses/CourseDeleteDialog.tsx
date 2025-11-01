import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Course } from '@/types'

interface CourseDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onConfirm: () => void
  isDeleting?: boolean
}

export const CourseDeleteDialog = ({
  open,
  onOpenChange,
  course,
  onConfirm,
  isDeleting = false,
}: CourseDeleteDialogProps) => {
  if (!course) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Course</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <strong>{course.name}</strong> ({course.code})?
            <br />
            <br />
            This action cannot be undone. All enrollments and grades for this course will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Deleting...' : 'Delete Course'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
