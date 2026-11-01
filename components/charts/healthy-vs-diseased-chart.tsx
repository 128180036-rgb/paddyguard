'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { dailySamples } from '@/lib/demo-data'

const config = {
  healthy: { label: 'Healthy', color: 'var(--chart-1)' },
  diseased: { label: 'Diseased', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function HealthyVsDiseasedChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Healthy vs diseased samples</CardTitle>
        <CardDescription>Valid images classified per day · this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-60 w-full">
          <BarChart data={dailySamples} margin={{ left: -16, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="healthy" stackId="s" fill="var(--color-healthy)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="diseased" stackId="s" fill="var(--color-diseased)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
