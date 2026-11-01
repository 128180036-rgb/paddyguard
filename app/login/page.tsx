import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Log in to monitor your paddy fields and disease alerts."
      footer={
        <>
          {"Don't have an account? "}
          <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
