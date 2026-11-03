'use client'

import { useEffect, useState } from 'react'
import { Bot, BatteryMedium, MapPin, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

type Robot = {
  id: string
  name: string
  status: string
  battery: number | null
  field: string | null
  firmware: string | null
  last_seen: string | null
  created_at: string
}

const statusOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'charging', label: 'Charging' },
]

function RobotDialog({
  robot,
  onSave,
  children,
}: {
  robot?: Robot
  onSave: () => void
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    setPending(true)
    const d = new FormData(e.currentTarget)
    const payload = {
      name: String(d.get('name') ?? '').trim(),
      status: String(d.get('status') ?? 'offline'),
      battery: d.get('battery') ? Number(d.get('battery')) : null,
      field: String(d.get('field') ?? '').trim() || null,
      firmware: String(d.get('firmware') ?? '').trim() || null,
    }
    if (!payload.name) { setPending(false); return }

    const supabase = createClient()
    const { error } = robot
      ? await supabase.from('robots').update(payload).eq('id', robot.id)
      : await supabase.from('robots').insert(payload)

    setPending(false)
    if (error) { toast.error(error.message); return }
    toast.success(robot ? 'Robot updated' : 'Robot registered')
    setOpen(false)
    onSave()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{robot ? 'Edit robot' : 'Register robot'}</DialogTitle>
          <DialogDescription>Add a field robot to track in PaddyGuard AI.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="r-name">Robot name</FieldLabel>
              <Input id="r-name" name="name" placeholder="Robot-01" defaultValue={robot?.name} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="r-status">Status</FieldLabel>
                <Select name="status" defaultValue={robot?.status ?? 'offline'} items={statusOptions}>
                  <SelectTrigger id="r-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="r-battery">Battery %</FieldLabel>
                <Input id="r-battery" name="battery" type="number" min={0} max={100} placeholder="82" defaultValue={robot?.battery ?? ''} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="r-field">Assigned field</FieldLabel>
              <Input id="r-field" name="field" placeholder="Field-A North" defaultValue={robot?.field ?? ''} />
            </Field>
            <Field>
              <FieldLabel htmlFor="r-fw">Firmware version</FieldLabel>
              <Input id="r-fw" name="firmware" placeholder="gw-0.4.2" defaultValue={robot?.firmware ?? ''} />
            </Field>
            <Button type="submit" disabled={pending}>
              {pending && <Spinner data-icon="inline-start" />}
              {robot ? 'Save changes' : 'Register robot'}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function RobotsPage() {
  const { user } = useAuth()
  const [robots, setRobots] = useState<Robot[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase.from('robots').select('*').order('created_at', { ascending: true })
    setRobots((data as Robot[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  async function deleteRobot(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('robots').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Robot removed')
    load()
  }

  const onlineCount = robots.filter((r) => r.status === 'online').length

  return (
    <>
      <PageHeader
        title="Robots"
        description="Register robots and track heartbeat, battery, missions and upload status."
        actions={
          <RobotDialog onSave={load}>
            <Button><Plus data-icon="inline-start" />Register robot</Button>
          </RobotDialog>
        }
      />

      {!loading && (
        <div className="flex gap-4">
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-semibold tabular-nums">{robots.length}</p>
            <p className="text-xs text-muted-foreground">Total robots</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-semibold tabular-nums text-success">{onlineCount}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-semibold tabular-nums text-muted-foreground">{robots.length - onlineCount}</p>
            <p className="text-xs text-muted-foreground">Offline</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : robots.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
            <Bot className="size-5" />
          </span>
          <div>
            <p className="font-medium">No robots registered</p>
            <p className="text-sm text-muted-foreground">Register your first field robot to start tracking.</p>
          </div>
          <RobotDialog onSave={load}>
            <Button><Plus data-icon="inline-start" />Register robot</Button>
          </RobotDialog>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {robots.map((r) => (
            <Card key={r.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${r.status === 'online' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      <Bot className="size-4" />
                    </span>
                    <CardTitle className="text-base">{r.name}</CardTitle>
                  </div>
                  <StatusBadge tone={r.status === 'online' ? 'success' : r.status === 'charging' ? 'warning' : 'neutral'} className="capitalize">
                    {r.status}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>{r.field ?? 'No field assigned'}</span>
                </div>
                {r.battery != null && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BatteryMedium className="size-3.5 shrink-0" />
                    <span>{r.battery}% battery</span>
                  </div>
                )}
                {r.firmware && (
                  <p className="font-mono text-xs text-muted-foreground">fw {r.firmware}</p>
                )}
                {r.last_seen && (
                  <p className="text-xs text-muted-foreground">
                    Last seen {new Date(r.last_seen).toLocaleString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="mt-auto gap-2 border-t pt-3">
                <RobotDialog robot={r} onSave={load}>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                </RobotDialog>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => deleteRobot(r.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
