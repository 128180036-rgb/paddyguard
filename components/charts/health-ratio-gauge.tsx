'use client'

import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { healthRatio } from '@/lib/paddy'

const config = {
  ratio: { label: 'Health ratio', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function HealthRatioGauge({
  healthy,
  diseased,
  invalid,
}: {
  healthy: number
  diseased: number
  invalid: number
}) {
  const ratio = healthRatio(healthy, healthy + diseased)
  const data = [{ name: 'ratio', value: ratio, fill: 'var(--color-ratio)' }]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sample-based health ratio</CardTitle>
        <CardDescription>Healthy ÷ total valid analyzed images</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">
        <div className="relative">
          <ChartContainer config={config} className="aspect-square h-48">
            <RadialBarChart data={data} startAngle={90} endAngle={-270} innerRadius="78%" outerRadius="100%">
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background={{ fill: 'var(--muted)' }} cornerRadius={10} />
            </RadialBarChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tabular-nums">{ratio.toFixed(1)}%</span>
            <span className="text-xs text-muted-foreground">healthy</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 border-t py-3 text-center">
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">{healthy.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Healthy</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">{diseased.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Diseased</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">{invalid.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Invalid</span>
        </div>
      </CardFooter>
    </Card>
  )
}
