'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { processingActivity } from '@/lib/demo-data'

const config = {
  uploaded: { label: 'Uploaded', color: 'var(--chart-5)' },
  processed: { label: 'Processed', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function ProcessingActivityChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Image processing activity</CardTitle>
        <CardDescription>Uploads vs completed inference jobs · today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-60 w-full">
          <LineChart data={processingActivity} margin={{ left: -16, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line dataKey="uploaded" type="monotone" stroke="var(--color-uploaded)" strokeWidth={2} dot={false} />
            <Line dataKey="processed" type="monotone" stroke="var(--color-processed)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
