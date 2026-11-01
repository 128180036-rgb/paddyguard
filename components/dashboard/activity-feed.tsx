import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { activity } from '@/lib/demo-data'

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>System activity</CardTitle>
        <CardDescription>Audit log of recent events</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative flex flex-col gap-4 border-l pl-5">
          {activity.map((a) => (
            <li key={a.id} className="relative flex flex-col gap-0.5">
              <span className="absolute top-1.5 -left-[25px] size-2 rounded-full bg-primary ring-4 ring-card" aria-hidden="true" />
              <span className="text-sm">{a.text}</span>
              <time className="font-mono text-xs text-muted-foreground">{a.time}</time>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
