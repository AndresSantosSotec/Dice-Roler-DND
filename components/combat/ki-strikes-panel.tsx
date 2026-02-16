"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Zap } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface KiStrikesPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

export function KiStrikesPanel({ onResult, isRolling, setIsRolling }: KiStrikesPanelProps) {
  const [monkLevel, setMonkLevel] = useState(1)
  const [attackModifier, setAttackModifier] = useState(4)
  const [numAttacks, setNumAttacks] = useState(2)
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal")

  const maxAttacks = Math.ceil(monkLevel / 5)
  const kiDamage = Math.ceil(monkLevel / 6)

  const handleKiStrikes = () => {
    setIsRolling(true)

    setTimeout(() => {
      let damageTotal = 0
      const allRolls: number[] = []

      for (let i = 0; i < numAttacks; i++) {
        let attackRoll: number
        if (rollMode !== "normal") {
          const r1 = rollDie(20)
          const r2 = rollDie(20)
          attackRoll = rollMode === "advantage" ? Math.max(r1, r2) : Math.min(r1, r2)
        } else {
          attackRoll = rollDie(20)
        }

        const isCritical = attackRoll === 20
        const attackTotal = attackRoll + attackModifier

        if (attackTotal >= 10) {
          const damageRolls = rollMultiple(1, 6)
          const baseKi = damageRolls[0]
          const bonusKi = i < numAttacks - 1 ? kiDamage : 0
          damageTotal += baseKi + bonusKi
          allRolls.push(baseKi + bonusKi)
        }
      }

      const result: CombatRollResult = {
        id: generateId(),
        action: "ki-strikes",
        timestamp: Date.now(),
        attackModifier,
        isCritical: false,
        isMiss: false,
        rollMode,
        damageRolls: allRolls,
        damageDice: `${numAttacks}d6+${numAttacks - 1}`,
        damageTotal,
        damageType: "force",
        bonusDamage: 0,
        label: `Ataques de Ki (${numAttacks} golpes)`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Ataques de Ki
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monk Level */}
        <div className="space-y-2">
          <Label>Nivel de Monje</Label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 5, 10, 15, 20].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setMonkLevel(level)}
                className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                  monkLevel === level
                    ? "bg-blue-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                N{level}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Attacks */}
        <div className="space-y-2">
          <Label>Número de Ataques (máx {maxAttacks})</Label>
          <div className="flex gap-2">
            {Array.from({ length: maxAttacks }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumAttacks(n)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  numAttacks === n
                    ? "bg-blue-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Attack Modifier */}
        <div className="space-y-2">
          <Label htmlFor="attack-modifier">Modificador de Ataque</Label>
          <input
            id="attack-modifier"
            type="number"
            value={attackModifier}
            onChange={(e) => setAttackModifier(Number(e.target.value))}
            className="w-full rounded border border-input bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Roll Mode */}
        <div className="space-y-2">
          <Label>Modo de Tirada</Label>
          <div className="flex gap-2">
            {[
              { value: "normal", label: "Normal" },
              { value: "advantage", label: "Ventaja" },
              { value: "disadvantage", label: "Desventaja" },
            ].map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setRollMode(mode.value as any)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  rollMode === mode.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Roll Button */}
        <Button
          onClick={handleKiStrikes}
          disabled={isRolling}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          <Zap className="mr-2 h-4 w-4" />
          {isRolling ? "Atacando..." : "Realizar Ataques de Ki"}
        </Button>

        {/* Info */}
        <div className="rounded bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Daño adicional por golpe: {kiDamage} Puntos de Ki
          </p>
          <p className="text-sm text-muted-foreground">
            Total: {numAttacks}d6 daño de fuerza
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
