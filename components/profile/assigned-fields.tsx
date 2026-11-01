import { Bot, MapPinned } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fields } from '@/lib/demo-data'

export function AssignedFields() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned fields</CardTitle>
        <CardDescription>Fields and robots you can access</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-3">
          {fields.map((f) => (
            <li key={f.id} className="flex flex-col gap-2 rounded-lg border p-4">
              <MapPinned className="size-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">{f.name}</span>
              <span className="text-xs text-muted-foreground">{f.location}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Bot className="size-3.5" aria-hidden="true" />
                {f.robots} {f.robots === 1 ? 'robot' : 'robots'}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
