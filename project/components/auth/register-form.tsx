'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { PasswordInput } from './password-input'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const roles = [
  { value: 'farmer', label: 'Farmer' },
  { value: 'agronomist', label: 'Agronomist' },
  { value: 'technician', label: 'Hardware technician' },
]

type Errors = Partial<Record<'name' | 'email' | 'password' | 'terms', string>>

export function RegisterForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const next: Errors = {}
    if (String(d.get('name') ?? '').trim().length < 2) next.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(String(d.get('email') ?? ''))) next.email = 'Enter a valid email address.'
    const pw = String(d.get('password') ?? '')
    if (pw.length < 8 || !/\d/.test(pw)) next.password = 'Use at least 8 characters including a number.'
    if (!d.get('terms')) next.terms = 'You must accept the terms to continue.'
    setErrors(next)
    if (Object.keys(next).length) return
    setPending(true)

    const email = String(d.get('email') ?? '')
    const password = String(d.get('password') ?? '')
    const name = String(d.get('name') ?? '')
    const phone = String(d.get('phone') ?? '')
    const role = String(d.get('role') ?? 'farmer')

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role },
      },
    })

    if (signUpError) {
      setPending(false)
      if (signUpError.message.toLowerCase().includes('already')) {
        setErrors({ email: 'An account with this email already exists.' })
      } else {
        toast.error(signUpError.message)
      }
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        phone: phone || null,
        role,
      })
    }

    toast.success('Account created!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name || undefined}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input id="name" name="name" autoComplete="name" placeholder="Nimal Perera" aria-invalid={!!errors.name || undefined} />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@farm.lk" aria-invalid={!!errors.email || undefined} />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="phone">Phone (for SMS)</FieldLabel>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+94 77 123 4567" />
          </Field>
          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Select name="role" defaultValue="farmer" items={roles}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput id="password" name="password" autoComplete="new-password" aria-invalid={!!errors.password || undefined} />
          {errors.password ? (
            <FieldError>{errors.password}</FieldError>
          ) : (
            <FieldDescription>At least 8 characters including a number.</FieldDescription>
          )}
        </Field>
        <Field orientation="horizontal" data-invalid={!!errors.terms || undefined}>
          <Checkbox id="terms" name="terms" aria-invalid={!!errors.terms || undefined} />
          <FieldLabel htmlFor="terms" className="font-normal">
            I agree to the terms and privacy policy
          </FieldLabel>
        </Field>
        {errors.terms && <FieldError>{errors.terms}</FieldError>}
        <Button type="submit" size="lg" className="h-10" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          {pending ? 'Creating account…' : 'Create account'}
        </Button>
      </FieldGroup>
    </form>
  )
}