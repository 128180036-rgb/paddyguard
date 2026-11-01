'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PasswordInput } from '@/components/auth/password-input'

function SaveFooter({ label = 'Save changes' }: { label?: string }) {
  return (
    <CardFooter className="justify-end border-t">
      <Button onClick={() => toast.success('Settings saved')}>{label}</Button>
    </CardFooter>
  )
}

function SwitchRow({ id, label, description, defaultChecked }: { id: string; label: string; description: string; defaultChecked?: boolean }) {
  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
      <Switch id={id} defaultChecked={defaultChecked} />
    </Field>
  )
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'si', label: 'සිංහල (Sinhala)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
]
const timezones = [
  { value: 'Asia/Colombo', label: 'Asia/Colombo (UTC+05:30)' },
  { value: 'UTC', label: 'UTC' },
]
const thresholds = [
  { value: '70', label: 'Below 70%' },
  { value: '75', label: 'Below 75%' },
  { value: '80', label: 'Below 80%' },
]

function SimpleSelect({ id, items, defaultValue }: { id: string; items: { value: string; label: string }[]; defaultValue: string }) {
  return (
    <Select defaultValue={defaultValue} items={items}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="gap-6">
      <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="hardware">Hardware</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Language, region and display preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="lang">Language</FieldLabel>
                  <SimpleSelect id="lang" items={languages} defaultValue="en" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tz">Time zone</FieldLabel>
                  <SimpleSelect id="tz" items={timezones} defaultValue="Asia/Colombo" />
                </Field>
              </div>
              <FieldSet>
                <FieldLegend variant="label">Dashboard density</FieldLegend>
                <ToggleGroup defaultValue={['comfortable']} variant="outline">
                  <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
                  <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
                  <ToggleGroupItem value="spacious">Spacious</ToggleGroupItem>
                </ToggleGroup>
              </FieldSet>
              <FieldSeparator />
              <SwitchRow id="units" label="Metric units" description="Show field area in hectares." defaultChecked />
            </FieldGroup>
          </CardContent>
          <SaveFooter />
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose which events reach you and how.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">Channels</FieldLegend>
                <FieldGroup className="gap-4">
                  <SwitchRow id="n-email" label="Email" description="Delivered via the notification service." defaultChecked />
                  <SwitchRow id="n-sms" label="SMS" description="Critical disease alerts only." defaultChecked />
                  <SwitchRow id="n-inapp" label="In-app" description="Real-time WebSocket notifications." defaultChecked />
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldSet>
                <FieldLegend variant="label">Events</FieldLegend>
                <FieldGroup className="gap-4">
                  <SwitchRow id="e-disease" label="Disease detected" description="Any non-healthy classification." defaultChecked />
                  <SwitchRow id="e-robot" label="Robot offline" description="No heartbeat for 10 minutes." defaultChecked />
                  <SwitchRow id="e-hw" label="Hardware failure" description="Gateway, FPGA or job retry errors." defaultChecked />
                  <SwitchRow id="e-digest" label="Weekly digest" description="Summary of crop health trends." />
                </FieldGroup>
              </FieldSet>
              <Field>
                <FieldLabel htmlFor="threshold">Alert when health ratio falls</FieldLabel>
                <SimpleSelect id="threshold" items={thresholds} defaultValue="75" />
              </Field>
            </FieldGroup>
          </CardContent>
          <SaveFooter />
        </Card>
      </TabsContent>

      <TabsContent value="hardware">
        <Card>
          <CardHeader>
            <CardTitle>Hardware & processing</CardTitle>
            <CardDescription>Gateway connection and inference pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Alert>
                <AlertTitle>HARDWARE mode is locked</AlertTitle>
                <AlertDescription>
                  Switching from DEMO requires a verified class mapping and quantization profile from the trained CNN.
                </AlertDescription>
              </Alert>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="gw-url">Gateway endpoint</FieldLabel>
                  <Input id="gw-url" defaultValue="wss://kv260-lab-01.local:8443" className="font-mono" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="gw-timeout">Job timeout (seconds)</FieldLabel>
                  <Input id="gw-timeout" type="number" min={5} max={300} defaultValue={30} />
                </Field>
              </div>
              <FieldSeparator />
              <SwitchRow id="h-retry" label="Automatic retries" description="Retry failed jobs up to 3 times." defaultChecked />
              <SwitchRow id="h-checksum" label="Verify checksums" description="Validate .bin payload before transfer." defaultChecked />
              <SwitchRow id="h-invalid" label="Reject invalid images" description="Exclude non-leaf images from health ratio." defaultChecked />
            </FieldGroup>
          </CardContent>
          <SaveFooter />
        </Card>
      </TabsContent>

      <TabsContent value="security" className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>Use at least 8 characters including a number.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="max-w-md">
              <Field>
                <FieldLabel htmlFor="pw-current">Current password</FieldLabel>
                <PasswordInput id="pw-current" autoComplete="current-password" />
              </Field>
              <Field>
                <FieldLabel htmlFor="pw-new">New password</FieldLabel>
                <PasswordInput id="pw-new" autoComplete="new-password" />
              </Field>
            </FieldGroup>
          </CardContent>
          <SaveFooter label="Update password" />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delete account</CardTitle>
            <CardDescription>Permanently remove your account and access to field data.</CardDescription>
          </CardHeader>
          <CardFooter className="border-t">
            <Button variant="destructive">Delete account</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
