import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { GradeManagement } from '@/components/grades/GradeManagement'

export const Route = createFileRoute('/grades')({
  component: GradesPage,
})

function GradesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Grades</h1>
              <p className="text-muted-foreground mt-2">
                Manage student grades and academic performance records
              </p>
            </div>
            <GradeManagement />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
