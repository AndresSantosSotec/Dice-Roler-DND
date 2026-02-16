"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DiceIcon } from "@/components/dice-icon"
import { StatsCards } from "@/components/stats-cards"
import { FrequencyChart } from "@/components/frequency-chart"
import { ResultsTable } from "@/components/results-table"
import { RollHistory } from "@/components/roll-history"
import { RotateCcw, Download, Dices } from "lucide-react"

const ROLL_OPTIONS = [10, 100, 1_000, 10_000]
const THEORETICAL_PERCENT = 5

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1
}

function buildFrequencyData(rolls: number[]) {
  const counts = new Array(20).fill(0)
  for (const roll of rolls) {
    counts[roll - 1]++
  }
  return counts.map((count, i) => ({
    face: i + 1,
    count,
    percent: rolls.length > 0 ? (count / rolls.length) * 100 : 0,
  }))
}

function exportCSV(
  frequencyData: { face: number; count: number; percent: number }[],
  totalRolls: number,
  criticals: number
) {
  const header = "Cara,Conteo,Porcentaje Obtenido,Porcentaje Teorico,Diferencia\n"
  const rows = frequencyData
    .map(
      (r) =>
        `${r.face},${r.count},${r.percent.toFixed(2)}%,5.00%,${(r.percent - 5).toFixed(2)}%`
    )
    .join("\n")
  const summary = `\n\nResumen\nTotal Tiradas,${totalRolls}\nCriticos (20),${criticals}\nPorcentaje Criticos,${totalRolls > 0 ? ((criticals / totalRolls) * 100).toFixed(2) : 0}%\nProbabilidad Teorica,5.00%`
  const blob = new Blob([header + rows + summary], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `d20-resultados-${totalRolls}-tiradas.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function D20Simulator() {
  const [rolls, setRolls] = useState<number[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [lastRoll, setLastRoll] = useState<number | undefined>(undefined)
  const [selectedCount, setSelectedCount] = useState(100)

  const frequencyData = buildFrequencyData(rolls)
  const criticals = frequencyData.find((d) => d.face === 20)?.count ?? 0
  const criticalPercent = rolls.length > 0 ? (criticals / rolls.length) * 100 : 0

  const handleRoll = useCallback(() => {
    setIsRolling(true)
    const newRolls: number[] = []
    for (let i = 0; i < selectedCount; i++) {
      newRolls.push(rollD20())
    }
    setLastRoll(newRolls[newRolls.length - 1])
    setTimeout(() => {
      setRolls((prev) => [...prev, ...newRolls])
      setIsRolling(false)
    }, 600)
  }, [selectedCount])

  const handleReset = useCallback(() => {
    setRolls([])
    setLastRoll(undefined)
  }, [])

  const handleExport = useCallback(() => {
    exportCSV(frequencyData, rolls.length, criticals)
  }, [frequencyData, rolls.length, criticals])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <DiceIcon className="h-10 w-10" value={lastRoll} isRolling={isRolling} />
          <div>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Simulador D20
            </h1>
            <p className="text-sm text-muted-foreground">
              Simula tiradas de dados de 20 caras y analiza la distribucion
            </p>
          </div>
        </div>
      </header>

      {/* Controls */}
      <Card className="border-border bg-card">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <span className="text-sm font-medium text-muted-foreground">Tiradas:</span>
          <div className="flex gap-2">
            {ROLL_OPTIONS.map((count) => (
              <Button
                key={count}
                variant={selectedCount === count ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCount(count)}
                className={
                  selectedCount === count
                    ? "bg-primary font-mono text-primary-foreground hover:bg-primary/90"
                    : "font-mono"
                }
              >
                {count.toLocaleString()}
              </Button>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button
              size="lg"
              onClick={handleRoll}
              disabled={isRolling}
              className="bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              <Dices className="mr-2 h-5 w-5" />
              {isRolling ? "Simulando..." : "Simular Tiradas"}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleReset}
              disabled={rolls.length === 0}
              aria-label="Reiniciar simulacion"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleExport}
              disabled={rolls.length === 0}
              aria-label="Exportar a CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <StatsCards
        totalRolls={rolls.length}
        criticals={criticals}
        criticalPercent={criticalPercent}
        theoreticalPercent={THEORETICAL_PERCENT}
      />

      {/* Chart + Table */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <FrequencyChart frequencyData={frequencyData} totalRolls={rolls.length} />
        </div>
        <div className="lg:col-span-2">
          <ResultsTable frequencyData={frequencyData} totalRolls={rolls.length} />
        </div>
      </div>

      {/* Roll History */}
      <RollHistory rolls={rolls} />
    </div>
  )
}
