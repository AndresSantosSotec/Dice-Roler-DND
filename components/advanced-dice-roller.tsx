"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dices, Swords, Shield } from "lucide-react"

type ModifierMode = "each" | "total"
type RollMode = "normal" | "advantage" | "disadvantage"

interface AdvancedDiceRollerProps {
  onRoll: (
    sides: number,
    count: number,
    modifier: number,
    modifierMode: ModifierMode,
    rollMode: RollMode
  ) => void
  isRolling: boolean
}

export function AdvancedDiceRoller({ onRoll, isRolling }: AdvancedDiceRollerProps) {
  const [numDice, setNumDice] = useState(1)
  const [numSides, setNumSides] = useState(20)
  const [modifier, setModifier] = useState(0)
  const [modifierMode, setModifierMode] = useState<ModifierMode>("total")
  const [rollMode, setRollMode] = useState<RollMode>("normal")

  const handleRoll = () => {
    onRoll(numSides, numDice, modifier, modifierMode, rollMode)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Swords className="h-5 w-5 text-accent" />
          Tirada Avanzada
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Dice config row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="numDice" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Dados
            </Label>
            <Input
              id="numDice"
              type="number"
              min={1}
              max={100}
              value={numDice}
              onChange={(e) => setNumDice(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="border-border bg-secondary font-mono text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="numSides" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Caras
            </Label>
            <Input
              id="numSides"
              type="number"
              min={2}
              max={100}
              value={numSides}
              onChange={(e) => setNumSides(Math.max(2, Math.min(100, parseInt(e.target.value) || 20)))}
              className="border-border bg-secondary font-mono text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="modifier" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Modificador
            </Label>
            <Input
              id="modifier"
              type="number"
              min={-99}
              max={99}
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              className="border-border bg-secondary font-mono text-foreground"
            />
          </div>
        </div>

        {/* Modifier mode */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Aplicar modificador
          </Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setModifierMode("total")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                modifierMode === "total"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span className="h-3 w-3 rounded-full border-2 border-current flex items-center justify-center">
                {modifierMode === "total" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              Al total final
            </button>
            <button
              type="button"
              onClick={() => setModifierMode("each")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                modifierMode === "each"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span className="h-3 w-3 rounded-full border-2 border-current flex items-center justify-center">
                {modifierMode === "each" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              A cada dado
            </button>
          </div>
        </div>

        {/* Roll mode (only for d20) */}
        {numSides === 20 && (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Modo de tirada (d20)
            </Label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRollMode("normal")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  rollMode === "normal"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Dices className="h-4 w-4" />
                Normal
              </button>
              <button
                type="button"
                onClick={() => setRollMode("advantage")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  rollMode === "advantage"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Swords className="h-4 w-4" />
                Ventaja
              </button>
              <button
                type="button"
                onClick={() => setRollMode("disadvantage")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  rollMode === "disadvantage"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Shield className="h-4 w-4" />
                Desventaja
              </button>
            </div>
          </div>
        )}

        {/* Roll button */}
        <Button
          size="lg"
          onClick={handleRoll}
          disabled={isRolling}
          className="w-full bg-primary py-6 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
        >
          <Dices className="mr-2 h-6 w-6" />
          {isRolling ? "Tirando..." : `Tirar ${numDice}d${numSides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""}`}
        </Button>
      </CardContent>
    </Card>
  )
}
