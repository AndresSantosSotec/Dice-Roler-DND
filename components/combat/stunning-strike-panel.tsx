"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Hand, AlertCircle } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface StunningStrikePanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

export function StunningStrikePanel({ onResult, isRolling, setIsRolling }: StunningStrikePanelProps) {
  const [monkLevel, setMonkLevel] = useState(1)
  const [attackModifier, setAttackModifier] = useState(4)
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal")

  const kiDice = Math.ceil(monkLevel / 5)

  const handleStunningStrike = () => {
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
      const isMiss = attackRoll === 1 || (!isCritical && attackTotal < 10)

      // Base damage (1d8 unarmed)
      const baseDamageRolls = rollMultiple(1, 8)
      let baseDamageTotal = baseDamageRolls.reduce((a, b) => a + b, 0)

      // Martial Arts bonus
      const martialArtsRolls = rollMultiple(kiDice, 4)
      const martialArtsTotal = martialArtsRolls.reduce((a, b) => a + b, 0)

      let damageTotal = baseDamageTotal + martialArtsTotal
      if (isCritical) damageTotal *= 2

      const targetSaveDC = 8 + 2 + attackModifier
      const targetSave = rollDie(20)
      const targetSaved = targetSave >= targetSaveDC

      const result: CombatRollResult = {
        id: generateId(),
        action: "stunning-strike",
        timestamp: Date.now(),
        attackRoll,
        attackModifier,
        attackTotal,
        isCritical,
        isMiss,
        rollMode,
        advantageRolls,
        damageRolls: [...baseDamageRolls, ...martialArtsRolls],
        damageDice: `1d8+${kiDice}d4`,
        damageTotal,
        damageType: "bludgeoning",
        bonusDamage: martialArtsTotal,
        label: `Golpe Aturdidor (Nivel ${monkLevel})`,
        savingThrowDC: targetSaveDC,
        targetSaved,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="h-5 w-5 text-orange-600" />
          Golpe Aturdidor
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
                    ? "bg-orange-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                N{level}
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
          onClick={handleStunningStrike}
          disabled={isRolling}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          {isRolling ? "Golpeando..." : "Lanzar Golpe Aturdidor"}
        </Button>

        {/* Info */}
        <div className="rounded bg-muted p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Daño: 1d8 + {kiDice}d4 contundente
          </p>
          <p className="text-sm text-muted-foreground">
            El objetivo debe pasar una tirada de CON DC {8 + 2 + attackModifier} o queda aturdido hasta el final de tu próximo turno.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
