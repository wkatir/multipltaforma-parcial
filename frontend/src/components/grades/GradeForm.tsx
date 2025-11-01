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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UpdateGradeData, Grade } from '@/types'
import { useGrades } from '@/hooks/useGrades'
import { useStudents } from '@/hooks/useStudents'
import { useCourses } from '@/hooks/useCourses'

const gradeSchema = z.object({
  partial1: z.number().min(0).max(100).optional().nullable(),
  partial2: z.number().min(0).max(100).optional().nullable(),
  partial3: z.number().min(0).max(100).optional().nullable(),
  finalGrade: z.number().min(0).max(100).optional().nullable(),
  status: z.enum(['PENDING', 'APPROVED', 'FAILED']),
  comments: z.string().optional(),
})

type GradeFormData = z.infer<typeof gradeSchema>

interface GradeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grade?: Grade | null
  onSuccess?: () => void
}

export const GradeForm = ({ open, onOpenChange, grade, onSuccess }: GradeFormProps) => {
  const { updateGrade } = useGrades()
  const { students } = useStudents({ limit: 1000 })
  const { courses } = useCourses({ limit: 1000 })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      status: 'PENDING',
    },
  })

  useEffect(() => {
    if (grade) {
      setValue('partial1', grade.partial1 || null)
      setValue('partial2', grade.partial2 || null)
      setValue('partial3', grade.partial3 || null)
      setValue('finalGrade', grade.finalGrade || null)
      setValue('status', grade.status)
      setValue('comments', grade.comments || '')
    } else {
      reset({
        status: 'PENDING',
      })
    }
  }, [grade, setValue, reset])

  const onSubmit = async (data: GradeFormData) => {
    if (!grade) return

    try {
      await updateGrade.mutateAsync({
        id: grade.id,
        data: data as UpdateGradeData,
      })
      onOpenChange(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error updating grade:', error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    reset()
  }

  const calculateAverage = () => {
    const partial1 = watch('partial1')
    const partial2 = watch('partial2')
    const partial3 = watch('partial3')

    const grades = [partial1, partial2, partial3].filter(g => g !== null && g !== undefined)
    if (grades.length === 0) return null

    const sum = grades.reduce((acc, grade) => acc + Number(grade), 0)
    return (sum / grades.length).toFixed(1)
  }

  if (!grade) return null

  const student = students.find(s => s.id === grade.studentId)
  const course = courses.find(c => c.id === grade.courseId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Grades</DialogTitle>
          <DialogDescription>
            Update grades for <strong>{student?.firstName} {student?.lastName}</strong> in{' '}
            <strong>{course?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partial1">Partial 1</Label>
              <Input
                id="partial1"
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...register('partial1', { valueAsNumber: true })}
                placeholder="0-100"
              />
              {errors.partial1 && (
                <p className="text-sm text-red-600">{errors.partial1.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="partial2">Partial 2</Label>
              <Input
                id="partial2"
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...register('partial2', { valueAsNumber: true })}
                placeholder="0-100"
              />
              {errors.partial2 && (
                <p className="text-sm text-red-600">{errors.partial2.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="partial3">Partial 3</Label>
              <Input
                id="partial3"
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...register('partial3', { valueAsNumber: true })}
                placeholder="0-100"
              />
              {errors.partial3 && (
                <p className="text-sm text-red-600">{errors.partial3.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="finalGrade">Final Grade</Label>
              <Input
                id="finalGrade"
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...register('finalGrade', { valueAsNumber: true })}
                placeholder="0-100"
              />
              {errors.finalGrade && (
                <p className="text-sm text-red-600">{errors.finalGrade.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Average: {calculateAverage() || 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              {...register('comments')}
              placeholder="Additional comments about the student's performance"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Grade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
