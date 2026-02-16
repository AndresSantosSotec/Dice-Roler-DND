"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dices, Target, Percent, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  totalRolls: number
  criticals: number
  criticalPercent: number
  theoreticalPercent: number
}

export function StatsCards({
  totalRolls,
  criticals,
  criticalPercent,
  theoreticalPercent,
}: StatsCardsProps) {
  const deviation = totalRolls > 0 ? criticalPercent - theoreticalPercent : 0

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Dices className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Tiradas</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">
            {totalRolls.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="border-accent/30 bg-card">
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-accent">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Criticos (20)</span>
          </div>
          <p className="font-mono text-2xl font-bold text-accent">
            {criticals.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Percent className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">% Criticos</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">
            {criticalPercent.toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground">
            {'Teorico: '}
            {theoreticalPercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Desviacion</span>
          </div>
          <p
            className={`font-mono text-2xl font-bold ${
              deviation > 0 ? "text-primary" : deviation < 0 ? "text-destructive" : "text-foreground"
            }`}
          >
            {deviation > 0 ? "+" : ""}
            {deviation.toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground">vs probabilidad teorica</p>
        </CardContent>
      </Card>
    </div>
  )
}
