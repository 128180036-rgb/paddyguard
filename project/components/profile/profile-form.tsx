'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

export function ProfileForm() {
  const { profile, user, refreshProfile } = useAuth()
  const [pending, setPending] = useState(false)

  const fullName = profile?.full_name || user?.email || ''
  const [first, ...rest] = fullName.split(' ')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const d = new FormData(e.currentTarget)
    const first = String(d.get('first') ?? '').trim()
    const last = String(d.get('last') ?? '').trim()
    const full_name = [first, last].filter(Boolean).join(' ')
    const phone = String(d.get('phone') ?? '').trim()
    const organization = String(d.get('org') ?? '').trim()
    const bio = String(d.get('bio') ?? '').trim()

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name,
        phone: phone || null,
        organization: organization || null,
        bio: bio || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id ?? '')

    setPending(false)
    if (error) {
      toast.error('Failed to update profile')
      return
    }
    await refreshProfile()
    toast.success('Profile updated')
  }

  return (
    <form onSubmit={onSubmit}>
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>Used for alerts and audit logs.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="first">First name</FieldLabel>
              <Input id="first" name="first" defaultValue={first} autoComplete="given-name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="last">Last name</FieldLabel>
              <Input id="last" name="last" defaultValue={rest.join(' ')} autoComplete="family-name" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" defaultValue={user?.email ?? ''} autoComplete="email" disabled />
              <FieldDescription>Email cannot be changed.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ''} autoComplete="tel" />
              <FieldDescription>Receives SMS disease alerts.</FieldDescription>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="org">Organization</FieldLabel>
            <Input id="org" name="org" defaultValue={profile?.organization ?? ''} autoComplete="organization" />
          </Field>
          <Field>
            <FieldLabel htmlFor="bio">Notes</FieldLabel>
            <Textarea id="bio" name="bio" rows={3} defaultValue={profile?.bio ?? ''} placeholder="Crop varieties, irrigation schedule, etc." />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button type="reset" variant="ghost">
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          Save changes
        </Button>
      </CardFooter>
    </Card>
    </form>
  )
}