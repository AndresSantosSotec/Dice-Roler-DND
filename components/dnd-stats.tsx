"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dices, Target, Percent, Skull } from "lucide-react"
import type { RollResult } from "@/components/result-display"

interface DndStatsProps {
  history: RollResult[]
}

export function DndStats({ history }: DndStatsProps) {
  const totalRolls = history.length
  const d20Rolls = history.filter((r) => r.sides === 20)
  const criticals = d20Rolls.filter((r) => {
    if (r.rollMode !== "normal" && r.advantageRolls) {
      return r.advantageRolls[r.chosenIndex ?? 0].includes(20)
    }
    return r.rolls.includes(20)
  }).length
  const fails = d20Rolls.filter((r) => {
    if (r.rollMode !== "normal" && r.advantageRolls) {
      return r.advantageRolls[r.chosenIndex ?? 0].includes(1)
    }
    return r.rolls.includes(1)
  }).length
  const critPercent = d20Rolls.length > 0 ? (criticals / d20Rolls.length) * 100 : 0
  const failPercent = d20Rolls.length > 0 ? (fails / d20Rolls.length) * 100 : 0

  const stats = [
    {
      icon: Dices,
      label: "Total Tiradas",
      value: totalRolls.toLocaleString(),
      color: "text-foreground",
      borderColor: "",
    },
    {
      icon: Target,
      label: "Criticos (Nat 20)",
      value: criticals.toLocaleString(),
      color: "text-accent",
      borderColor: "border-accent/30",
    },
    {
      icon: Percent,
      label: "% Criticos",
      value: `${critPercent.toFixed(1)}%`,
      color: "text-foreground",
      borderColor: "",
      sub: `Teorico: 5.0% (de ${d20Rolls.length} d20)`,
    },
    {
      icon: Skull,
      label: "Pifias (Nat 1)",
      value: fails.toLocaleString(),
      color: "text-destructive",
      borderColor: "border-destructive/30",
      sub: `${failPercent.toFixed(1)}% de d20`,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={`border-border bg-card ${stat.borderColor}`}>
          <CardContent className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <stat.icon className={`h-4 w-4 ${stat.color !== "text-foreground" ? stat.color : ""}`} />
              <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className={`font-mono text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            {stat.sub && (
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
