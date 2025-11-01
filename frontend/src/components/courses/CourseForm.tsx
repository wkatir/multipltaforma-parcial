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
import type { CreateCourseData, UpdateCourseData, Course } from '@/types'
import { useCourses } from '@/hooks/useCourses'
import { useProfessors } from '@/hooks/useProfessors'

const courseSchema = z.object({
  code: z.string().min(1, 'Course code is required'),
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  credits: z.number().min(1, 'Credits must be at least 1'),
  professorId: z.number().min(1, 'Professor is required'),
  maxCapacity: z.number().min(1, 'Capacity must be at least 1'),
  schedule: z.string().min(1, 'Schedule is required'),
  semester: z.string().min(1, 'Semester is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: Course | null
  onSuccess?: () => void
}

export const CourseForm = ({ open, onOpenChange, course, onSuccess }: CourseFormProps) => {
  const { createCourse, updateCourse } = useCourses()
  const { professors } = useProfessors({ limit: 1000 })
  const isEditing = !!course

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      status: 'ACTIVE',
      credits: 3,
      maxCapacity: 30,
    },
  })

  useEffect(() => {
    if (course) {
      setValue('code', course.code)
      setValue('name', course.name)
      setValue('description', course.description || '')
      setValue('credits', course.credits)
      setValue('professorId', course.professorId)
      setValue('maxCapacity', course.maxCapacity)
      setValue('schedule', course.schedule)
      setValue('semester', course.semester)
      setValue('status', course.status)
    } else {
      reset({
        status: 'ACTIVE',
        credits: 3,
        maxCapacity: 30,
      })
    }
  }, [course, setValue, reset])

  const onSubmit = async (data: CourseFormData) => {
    try {
      if (isEditing && course) {
        await updateCourse.mutateAsync({
          id: course.id,
          data: data as UpdateCourseData,
        })
      } else {
        await createCourse.mutateAsync(data as CreateCourseData)
      }
      onOpenChange(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the course information below.'
              : 'Fill in the details to add a new course to the catalog.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="e.g., CS101"
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
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
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Course Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter course name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Course description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professorId">Professor *</Label>
              <Select
                value={watch('professorId')?.toString()}
                onValueChange={(value) => setValue('professorId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select professor" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id.toString()}>
                      {professor.firstName} {professor.lastName} ({professor.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.professorId && (
                <p className="text-sm text-red-600">{errors.professorId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                {...register('credits', { valueAsNumber: true })}
              />
              {errors.credits && (
                <p className="text-sm text-red-600">{errors.credits.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Max Capacity *</Label>
              <Input
                id="maxCapacity"
                type="number"
                min="1"
                {...register('maxCapacity', { valueAsNumber: true })}
              />
              {errors.maxCapacity && (
                <p className="text-sm text-red-600">{errors.maxCapacity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={watch('semester')}
                onValueChange={(value) => setValue('semester', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                  <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                  <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-sm text-red-600">{errors.semester.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule *</Label>
            <Input
              id="schedule"
              {...register('schedule')}
              placeholder="e.g., Mon/Wed 10:00-11:30 AM"
            />
            {errors.schedule && (
              <p className="text-sm text-red-600">{errors.schedule.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
