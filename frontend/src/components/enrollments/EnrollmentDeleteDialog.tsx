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
import type { Enrollment } from '@/types'
import { useStudents } from '@/hooks/useStudents'
import { useCourses } from '@/hooks/useCourses'

interface EnrollmentDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  enrollment: Enrollment | null
  onConfirm: () => void
  isDeleting?: boolean
}

export const EnrollmentDeleteDialog = ({
  open,
  onOpenChange,
  enrollment,
  onConfirm,
  isDeleting = false,
}: EnrollmentDeleteDialogProps) => {
  const { students } = useStudents({ limit: 1000 })
  const { courses } = useCourses({ limit: 1000 })

  if (!enrollment) return null

  const student = students.find(s => s.id === enrollment.studentId)
  const course = courses.find(c => c.id === enrollment.courseId)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Enrollment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the enrollment for{' '}
            <strong>{student?.firstName} {student?.lastName}</strong> in{' '}
            <strong>{course?.name}</strong> ({course?.code})?
            <br />
            <br />
            This action cannot be undone. All associated grades will also be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Deleting...' : 'Delete Enrollment'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
