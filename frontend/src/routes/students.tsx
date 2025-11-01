import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { StudentManagement } from '@/components/students/StudentManagement'

export const Route = createFileRoute('/students')({
  component: StudentsPage,
})

function StudentsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Students</h1>
              <p className="text-muted-foreground mt-2">
                Manage student information and enrollment records
              </p>
            </div>
            <StudentManagement />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
