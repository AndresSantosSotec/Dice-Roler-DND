"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface FrequencyChartProps {
  frequencyData: { face: number; count: number; percent: number }[]
  totalRolls: number
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: { face: number; count: number; percent: number } }>
  label?: string
}) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
        <p className="font-mono text-sm font-bold text-foreground">
          Cara {data.face}
        </p>
        <p className="text-sm text-muted-foreground">
          Frecuencia: <span className="font-mono text-foreground">{data.count.toLocaleString()}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Porcentaje: <span className="font-mono text-foreground">{data.percent.toFixed(2)}%</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {'Teorico: 5.00%'}
        </p>
      </div>
    )
  }
  return null
}

export function FrequencyChart({ frequencyData, totalRolls }: FrequencyChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          Frecuencia por Cara
          {totalRolls > 0 && (
            <span className="font-mono text-xs font-normal text-muted-foreground">
              ({totalRolls.toLocaleString()} tiradas)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalRolls === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Simula tiradas para ver la distribucion
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={frequencyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 10% 18%)" vertical={false} />
              <XAxis
                dataKey="face"
                tick={{ fill: "hsl(215 15% 55%)", fontSize: 12, fontFamily: "var(--font-jetbrains)" }}
                tickLine={false}
                axisLine={{ stroke: "hsl(228 10% 18%)" }}
              />
              <YAxis
                tick={{ fill: "hsl(215 15% 55%)", fontSize: 12, fontFamily: "var(--font-jetbrains)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(228 10% 14%)" }} />
              <ReferenceLine
                y={totalRolls / 20}
                stroke="hsl(38 90% 55%)"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                label={{
                  value: "Esperado",
                  position: "insideTopRight",
                  fill: "hsl(38 90% 55%)",
                  fontSize: 11,
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {frequencyData.map((entry) => (
                  <Cell
                    key={`cell-${entry.face}`}
                    fill={entry.face === 20 ? "hsl(38 90% 55%)" : "hsl(142 60% 50%)"}
                    fillOpacity={entry.face === 20 ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
