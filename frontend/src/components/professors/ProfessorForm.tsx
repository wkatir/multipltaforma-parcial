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
import type { CreateProfessorData, UpdateProfessorData, Professor } from '@/types'
import { useProfessors } from '@/hooks/useProfessors'

const professorSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

type ProfessorFormData = z.infer<typeof professorSchema>

interface ProfessorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  professor?: Professor | null
  onSuccess?: () => void
}

export const ProfessorForm = ({ open, onOpenChange, professor, onSuccess }: ProfessorFormProps) => {
  const { createProfessor, updateProfessor } = useProfessors()
  const isEditing = !!professor

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: {
      status: 'ACTIVE',
    },
  })

  useEffect(() => {
    if (professor) {
      setValue('employeeId', professor.employeeId)
      setValue('firstName', professor.firstName)
      setValue('lastName', professor.lastName)
      setValue('email', professor.email)
      setValue('phone', professor.phone)
      setValue('specialty', professor.specialty)
      setValue('department', professor.department)
      setValue('status', professor.status)
    } else {
      reset({
        status: 'ACTIVE',
      })
    }
  }, [professor, setValue, reset])

  const onSubmit = async (data: ProfessorFormData) => {
    try {
      if (isEditing && professor) {
        await updateProfessor.mutateAsync({
          id: professor.id,
          data: data as UpdateProfessorData,
        })
      } else {
        await createProfessor.mutateAsync(data as CreateProfessorData)
      }
      onOpenChange(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving professor:', error)
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
            {isEditing ? 'Edit Professor' : 'Add New Professor'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the professor information below.'
              : 'Fill in the details to add a new professor to the system.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                {...register('employeeId')}
                placeholder="e.g., PROF001"
              />
              {errors.employeeId && (
                <p className="text-sm text-red-600">{errors.employeeId.message}</p>
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
              placeholder="professor@university.edu"
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
              <Label htmlFor="specialty">Specialty *</Label>
              <Input
                id="specialty"
                {...register('specialty')}
                placeholder="e.g., Computer Science"
              />
              {errors.specialty && (
                <p className="text-sm text-red-600">{errors.specialty.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              {...register('department')}
              placeholder="e.g., Engineering"
            />
            {errors.department && (
              <p className="text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Professor' : 'Create Professor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
