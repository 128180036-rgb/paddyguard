'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { healthTrend } from '@/lib/demo-data'

const config = {
  ratio: { label: 'Health ratio', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function HealthTrendChart({ action }: { action?: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Crop health trend</CardTitle>
        <CardDescription>Healthy share of valid samples · last 14 days</CardDescription>
        {action}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-56 w-full md:h-64">
          <AreaChart data={healthTrend} margin={{ left: -16, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillRatio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-ratio)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-ratio)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
            <YAxis domain={[70, 90]} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={48} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" formatter={(v) => `${Number(v).toFixed(1)}%`} />}
            />
            <Area
              dataKey="ratio"
              type="monotone"
              stroke="var(--color-ratio)"
              strokeWidth={2}
              fill="url(#fillRatio)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
