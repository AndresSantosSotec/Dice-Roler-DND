
"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { QuickDiceRoller } from "@/components/quick-dice-roller"
import { AdvancedDiceRoller } from "@/components/advanced-dice-roller"
import { ResultDisplay, type RollResult } from "@/components/result-display"
import { DndRollHistory } from "@/components/dnd-roll-history"
import { DndStats } from "@/components/dnd-stats"
import { DiceShape } from "@/components/dice-shapes"
import { CombatTab } from "@/components/combat/combat-tab"
import { Download, RotateCcw, Zap, Settings, Swords } from "lucide-react"

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function DndDiceSimulator() {
  const [history, setHistory] = useState<RollResult[]>([])
  const [currentResult, setCurrentResult] = useState<RollResult | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const performRoll = useCallback(
    (
      sides: number,
      count: number,
      modifier = 0,
      modifierMode: "each" | "total" = "total",
      rollMode: "normal" | "advantage" | "disadvantage" = "normal"
    ) => {
      setIsRolling(true)

      setTimeout(() => {
        let rolls: number[] = []
        let total = 0
        let advantageRolls: number[][] | undefined
        let chosenIndex: number | undefined

        if (rollMode !== "normal" && sides === 20) {
          const set1 = Array.from({ length: count }, () => rollDie(sides))
          const set2 = Array.from({ length: count }, () => rollDie(sides))
          advantageRolls = [set1, set2]

          const sum1 = set1.reduce((a, b) => a + b, 0)
          const sum2 = set2.reduce((a, b) => a + b, 0)

          if (rollMode === "advantage") {
            chosenIndex = sum1 >= sum2 ? 0 : 1
          } else {
            chosenIndex = sum1 <= sum2 ? 0 : 1
          }

          rolls = advantageRolls[chosenIndex]
          if (modifierMode === "each") {
            total = rolls.reduce((acc, r) => acc + r + modifier, 0)
          } else {
            total = rolls.reduce((acc, r) => acc + r, 0) + modifier
          }
        } else {
          rolls = Array.from({ length: count }, () => rollDie(sides))
          if (modifierMode === "each") {
            total = rolls.reduce((acc, r) => acc + r + modifier, 0)
          } else {
            total = rolls.reduce((acc, r) => acc + r, 0) + modifier
          }
        }

        const result: RollResult = {
          id: generateId(),
          sides,
          count,
          rolls,
          modifier,
          modifierMode,
          rollMode,
          total,
          timestamp: Date.now(),
          advantageRolls,
          chosenIndex,
        }

        setCurrentResult(result)
        setHistory((prev) => [...prev, result])
        setIsRolling(false)
      }, 700)
    },
    []
  )

  const handleQuickRoll = useCallback(
    (sides: number, count: number) => {
      performRoll(sides, count)
    },
    [performRoll]
  )

  const handleAdvancedRoll = useCallback(
    (
      sides: number,
      count: number,
      modifier: number,
      modifierMode: "each" | "total",
      rollMode: "normal" | "advantage" | "disadvantage"
    ) => {
      performRoll(sides, count, modifier, modifierMode, rollMode)
    },
    [performRoll]
  )

  const handleClearHistory = useCallback(() => {
    setHistory([])
    setCurrentResult(null)
  }, [])

  const handleExportCSV = useCallback(() => {
    if (history.length === 0) return
    const header = "Tirada,Dados,Caras,Modificador,Modo,Resultado,Detalle,Hora\n"
    const rows = history
      .map((r, i) =>
        [
          i + 1,
          r.count,
          r.sides,
          r.modifier,
          r.rollMode,
          r.total,
          `"[${r.rolls.join(",")}]"`,
          new Date(r.timestamp).toLocaleTimeString("es-ES"),
        ].join(",")
      )
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `dnd-tiradas-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [history])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DiceShape
              sides={currentResult?.sides ?? 20}
              className="h-11 w-11"
              isRolling={isRolling}
              value={isRolling ? undefined : currentResult?.total}
              color={isRolling ? "hsl(142 60% 50%)" : undefined}
            />
            <div>
              <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {"D&D Dice Roller"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Simulador de dados y combate para Dungeons & Dragons
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleClearHistory}
              disabled={history.length === 0}
              aria-label="Reiniciar todo"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleExportCSV}
              disabled={history.length === 0}
              aria-label="Exportar CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <DndStats history={history} />

      {/* Main Tabs: Dice / Combat / Characters / Initiative */}
      <Tabs defaultValue="dice-quick" className="w-full">
        <div className="w-full overflow-x-auto pb-2 scrollbar-none">
          <TabsList className="inline-flex w-full min-w-max items-center justify-start bg-secondary p-1">
            <TabsTrigger
              value="dice-quick"
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Tirada Rápida</span>
              <span className="sm:hidden">Rápida</span>
            </TabsTrigger>
            <TabsTrigger
              value="dice-advanced"
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Avanzado</span>
              <span className="sm:hidden">Adv</span>
            </TabsTrigger>
            <TabsTrigger
              value="combat"
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <Swords className="h-4 w-4" />
              <span>Combate</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dice Quick Tab */}
        <TabsContent value="dice-quick" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <QuickDiceRoller onRoll={handleQuickRoll} isRolling={isRolling} />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-2">
              <ResultDisplay result={currentResult} isRolling={isRolling} />
              <DndRollHistory history={history} onClear={handleClearHistory} />
            </div>
          </div>
        </TabsContent>

        {/* Dice Advanced Tab */}
        <TabsContent value="dice-advanced" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <AdvancedDiceRoller onRoll={handleAdvancedRoll} isRolling={isRolling} />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-2">
              <ResultDisplay result={currentResult} isRolling={isRolling} />
              <DndRollHistory history={history} onClear={handleClearHistory} />
            </div>
          </div>
        </TabsContent>

        {/* Combat Tab */}
        <TabsContent value="combat" className="mt-4">
          <CombatTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
