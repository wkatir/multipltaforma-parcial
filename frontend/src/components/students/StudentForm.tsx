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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CreateStudentData, UpdateStudentData, Student } from '@/types'
import { useStudents } from '@/hooks/useStudents'

const studentSchema = z.object({
  carnet: z.string().min(1, 'Carnet is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  career: z.string().min(1, 'Career is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED']).optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

interface StudentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student?: Student | null
  onSuccess?: () => void
}

export const StudentForm = ({ open, onOpenChange, student, onSuccess }: StudentFormProps) => {
  const { createStudent, updateStudent } = useStudents()
  const isEditing = !!student

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: 'ACTIVE',
    },
  })

  useEffect(() => {
    if (student) {
      setValue('carnet', student.carnet)
      setValue('firstName', student.firstName)
      setValue('lastName', student.lastName)
      setValue('email', student.email)
      setValue('phone', student.phone)
      setValue('career', student.career)
      setValue('status', student.status)
    } else {
      reset({
        status: 'ACTIVE',
      })
    }
  }, [student, setValue, reset])

  const onSubmit = async (data: StudentFormData) => {
    try {
      if (isEditing && student) {
        await updateStudent.mutateAsync({
          id: student.id,
          data: data as UpdateStudentData,
        })
      } else {
        await createStudent.mutateAsync(data as CreateStudentData)
      }
      onOpenChange(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving student:', error)
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
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the student information below.'
              : 'Fill in the details to add a new student to the system.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carnet">Carnet *</Label>
              <Input
                id="carnet"
                {...register('carnet')}
                placeholder="e.g., 20240001"
              />
              {errors.carnet && (
                <p className="text-sm text-red-600">{errors.carnet.message}</p>
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
                  <SelectItem value="GRADUATED">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="student@university.edu"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1234567890"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="career">Career *</Label>
              <Input
                id="career"
                {...register('career')}
                placeholder="e.g., Computer Science"
              />
              {errors.career && (
                <p className="text-sm text-red-600">{errors.career.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Student' : 'Create Student'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
