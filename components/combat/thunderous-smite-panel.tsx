"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Zap, Swords } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface ThunderousSmitePanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

export function ThunderousSmitePanel({ onResult, isRolling, setIsRolling }: ThunderousSmitePanelProps) {
  const [attackModifier, setAttackModifier] = useState(5)
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal")

  const handleThunderousSmite = () => {
    setIsRolling(true)

    setTimeout(() => {
      // Attack roll
      let attackRoll: number
      let advantageRolls: [number, number] | undefined

      if (rollMode !== "normal") {
        const r1 = rollDie(20)
        const r2 = rollDie(20)
        advantageRolls = [r1, r2]
        attackRoll = rollMode === "advantage" ? Math.max(r1, r2) : Math.min(r1, r2)
      } else {
        attackRoll = rollDie(20)
      }

      const isCritical = attackRoll === 20
      const attackTotal = attackRoll + attackModifier
      const isMiss = attackRoll === 1 || (!isCritical && attackTotal < 10) // Assume AC 10

      // Base damage (assume 1d8 sword)
      const baseDamageRolls = rollMultiple(1, 8)
      let baseDamageTotal = baseDamageRolls.reduce((a, b) => a + b, 0)

      // Thunder damage
      const thunderRolls = rollMultiple(2, 6)
      const thunderTotal = thunderRolls.reduce((a, b) => a + b, 0)

      let damageTotal = baseDamageTotal + thunderTotal
      if (isCritical) damageTotal *= 2

      const result: CombatRollResult = {
        id: generateId(),
        action: "thunderous-smite",
        timestamp: Date.now(),
        attackRoll,
        attackModifier,
        attackTotal,
        isCritical,
        isMiss,
        rollMode,
        advantageRolls,
        damageRolls: [...baseDamageRolls, ...thunderRolls],
        damageDice: `1d8+2d6`,
        damageTotal,
        damageType: "thunder",
        bonusDamage: thunderTotal,
        label: `Golpe Atronador`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Golpe Atronador
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Attack Modifier */}
        <div className="space-y-2">
          <Label htmlFor="attack-modifier">Modificador de Ataque</Label>
          <input
            id="attack-modifier"
            type="number"
            value={attackModifier}
            onChange={(e) => setAttackModifier(Number(e.target.value))}
            className="w-full rounded border px-3 py-2"
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
          onClick={handleThunderousSmite}
          disabled={isRolling}
          className="w-full bg-yellow-500 hover:bg-yellow-600"
        >
          <Swords className="mr-2 h-4 w-4" />
          {isRolling ? "Golpeando..." : "Realizar Golpe Atronador"}
        </Button>

        {/* Damage Preview */}
        <div className="rounded bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Daño: 1d8 + 2d6 trueno + empuje 10 pies
          </p>
          <p className="text-sm text-muted-foreground">
            Promedio: {4.5 + 7}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}