import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { ProfessorManagement } from '@/components/professors/ProfessorManagement'

export const Route = createFileRoute('/professors')({
  component: ProfessorsPage,
})

function ProfessorsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Professors</h1>
              <p className="text-muted-foreground mt-2">
                Manage professor information and course assignments
              </p>
            </div>
            <ProfessorManagement />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
