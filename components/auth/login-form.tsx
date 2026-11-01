'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { PasswordInput } from './password-input'

export function LoginForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      setError('Enter a valid email and a password of at least 8 characters.')
      return
    }
    setError(null)
    setPending(true)
    setTimeout(() => router.push('/dashboard'), 600)
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!error || undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@farm.lk" aria-invalid={!!error || undefined} required />
        </Field>
        <Field data-invalid={!!error || undefined}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" name="password" autoComplete="current-password" aria-invalid={!!error || undefined} required />
          {error && <FieldError>{error}</FieldError>}
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="remember" name="remember" defaultChecked />
          <FieldLabel htmlFor="remember" className="font-normal">
            Keep me signed in
          </FieldLabel>
        </Field>
        <Button type="submit" size="lg" className="h-10" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          {pending ? 'Signing in…' : 'Log in'}
        </Button>
      </FieldGroup>
    </form>
  )
}
