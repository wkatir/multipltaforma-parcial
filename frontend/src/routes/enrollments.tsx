import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { EnrollmentManagement } from '@/components/enrollments/EnrollmentManagement'

export const Route = createFileRoute('/enrollments')({
  component: EnrollmentsPage,
})

function EnrollmentsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Enrollments</h1>
              <p className="text-muted-foreground mt-2">
                Manage student course enrollments and registration
              </p>
            </div>
            <EnrollmentManagement />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
