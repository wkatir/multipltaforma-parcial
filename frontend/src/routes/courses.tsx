import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { CourseManagement } from '@/components/courses/CourseManagement'

export const Route = createFileRoute('/courses')({
  component: CoursesPage,
})

function CoursesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
              <p className="text-muted-foreground mt-2">
                Manage course catalog and academic offerings
              </p>
            </div>
            <CourseManagement />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
