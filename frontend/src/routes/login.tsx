import { createFileRoute, Navigate } from '@tanstack/react-router'
import { LoginForm } from '@/components/auth/login-form'
import { useAuthStore } from '@/store/authStore'
import { IconChecklist } from '@tabler/icons-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <IconChecklist size={20} />
            </div>
            <span className="text-lg font-semibold">Task Manager</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-3xl font-bold">Organize your tasks</h2>
            <p className="text-muted-foreground text-lg">
              Manage your tasks efficiently and keep control of your projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
