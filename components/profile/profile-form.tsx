'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { currentUser } from '@/lib/demo-data'

export function ProfileForm() {
  const [pending, setPending] = useState(false)
  const [first, ...rest] = currentUser.name.split(' ')

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setTimeout(() => {
      setPending(false)
      toast.success('Profile updated')
    }, 600)
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
              <Input id="email" name="email" type="email" defaultValue={currentUser.email} autoComplete="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input id="phone" name="phone" type="tel" defaultValue={currentUser.phone} autoComplete="tel" />
              <FieldDescription>Receives SMS disease alerts.</FieldDescription>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="org">Organization</FieldLabel>
            <Input id="org" name="org" defaultValue={currentUser.organization} autoComplete="organization" />
          </Field>
          <Field>
            <FieldLabel htmlFor="bio">Notes</FieldLabel>
            <Textarea id="bio" name="bio" rows={3} placeholder="Crop varieties, irrigation schedule, etc." />
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
