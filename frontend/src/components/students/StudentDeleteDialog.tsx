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
import type { Student } from '@/types'

interface StudentDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
  onConfirm: () => void
  isDeleting?: boolean
}

export const StudentDeleteDialog = ({
  open,
  onOpenChange,
  student,
  onConfirm,
  isDeleting = false,
}: StudentDeleteDialogProps) => {
  if (!student) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <strong>{student.firstName} {student.lastName}</strong> (Carnet: {student.carnet})?
            <br />
            <br />
            This action cannot be undone. All associated enrollments and grades will also be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Deleting...' : 'Delete Student'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
