'use client'

import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { diseaseDistribution } from '@/lib/demo-data'

const config = {
  count: { label: 'Detections', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function DiseaseDistributionChart({ compact = false }: { compact?: boolean }) {
  const data = compact ? diseaseDistribution.slice(0, 5) : diseaseDistribution

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Disease distribution</CardTitle>
        <CardDescription>
          {compact ? 'Top 5 detected classes' : 'Detections by class · excluding Normal / Healthy'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto w-full" style={{ height: data.length * 34 + 8 }}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40 }}>
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={compact ? 96 : 150}
              tick={{ fontSize: 12 }}
            />
            <XAxis type="number" dataKey="count" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} barSize={18}>
              <LabelList dataKey="count" position="right" className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
