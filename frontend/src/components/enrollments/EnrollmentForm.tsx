import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CreateEnrollmentData, UpdateEnrollmentData, Enrollment } from '@/types'
import { useEnrollments } from '@/hooks/useEnrollments'
import { useStudents } from '@/hooks/useStudents'
import { useCourses } from '@/hooks/useCourses'

const enrollmentSchema = z.object({
  studentId: z.number().min(1, 'Student is required'),
  courseId: z.number().min(1, 'Course is required'),
  status: z.enum(['ENROLLED', 'DROPPED', 'COMPLETED']).optional(),
})

type EnrollmentFormData = z.infer<typeof enrollmentSchema>

interface EnrollmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  enrollment?: Enrollment | null
  onSuccess?: () => void
}

export const EnrollmentForm = ({ open, onOpenChange, enrollment, onSuccess }: EnrollmentFormProps) => {
  const { createEnrollment, updateEnrollment } = useEnrollments()
  const { students } = useStudents({ limit: 1000 })
  const { courses } = useCourses({ limit: 1000 })
  const isEditing = !!enrollment

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      status: 'ENROLLED',
    },
  })

  useEffect(() => {
    if (enrollment) {
      setValue('studentId', enrollment.studentId)
      setValue('courseId', enrollment.courseId)
      setValue('status', enrollment.status)
    } else {
      reset({
        status: 'ENROLLED',
      })
    }
  }, [enrollment, setValue, reset])

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      if (isEditing && enrollment) {
        await updateEnrollment.mutateAsync({
          id: enrollment.id,
          data: {
            status: data.status,
          } as UpdateEnrollmentData,
        })
      } else {
        await createEnrollment.mutateAsync({
          studentId: data.studentId,
          courseId: data.courseId,
        } as CreateEnrollmentData)
      }
      onOpenChange(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving enrollment:', error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Enrollment' : 'Add New Enrollment'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the enrollment status.'
              : 'Select a student and course to create a new enrollment.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student *</Label>
            <Select
              value={watch('studentId')?.toString()}
              onValueChange={(value) => setValue('studentId', parseInt(value))}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.firstName} {student.lastName} ({student.carnet})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.studentId && (
              <p className="text-sm text-red-600">{errors.studentId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Course *</Label>
            <Select
              value={watch('courseId')?.toString()}
              onValueChange={(value) => setValue('courseId', parseInt(value))}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name} ({course.code}) - {course.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courseId && (
              <p className="text-sm text-red-600">{errors.courseId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENROLLED">Enrolled</SelectItem>
                <SelectItem value="DROPPED">Dropped</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Enrollment' : 'Create Enrollment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
