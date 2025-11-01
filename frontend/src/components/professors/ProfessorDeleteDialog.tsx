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
import type { Professor } from '@/types'

interface ProfessorDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  professor: Professor | null
  onConfirm: () => void
  isDeleting?: boolean
}

export const ProfessorDeleteDialog = ({
  open,
  onOpenChange,
  professor,
  onConfirm,
  isDeleting = false,
}: ProfessorDeleteDialogProps) => {
  if (!professor) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Professor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <strong>{professor.firstName} {professor.lastName}</strong> (Employee ID: {professor.employeeId})?
            <br />
            <br />
            This action cannot be undone. All associated courses will need to be reassigned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Deleting...' : 'Delete Professor'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
