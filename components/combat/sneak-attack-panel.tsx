"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sword, Dice6 } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface SneakAttackPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

const SNEAK_DICE_OPTIONS = [
  { dice: 1, label: "1d6 (Nivel 1-2)" },
  { dice: 2, label: "2d6 (Nivel 3-4)" },
  { dice: 3, label: "3d6 (Nivel 5-6)" },
  { dice: 4, label: "4d6 (Nivel 7-8)" },
  { dice: 5, label: "5d6 (Nivel 9-10)" },
  { dice: 6, label: "6d6 (Nivel 11-12)" },
  { dice: 7, label: "7d6 (Nivel 13-14)" },
  { dice: 8, label: "8d6 (Nivel 15-16)" },
  { dice: 9, label: "9d6 (Nivel 17-18)" },
  { dice: 10, label: "10d6 (Nivel 19-20)" },
]

export function SneakAttackPanel({ onResult, isRolling, setIsRolling }: SneakAttackPanelProps) {
  const [sneakDice, setSneakDice] = useState(1)
  const [attackModifier, setAttackModifier] = useState(5)
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal")

  const handleSneakAttack = () => {
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

      // Base damage (assume 1d8 dagger)
      const baseDamageRolls = rollMultiple(1, 8)
      let baseDamageTotal = baseDamageRolls.reduce((a, b) => a + b, 0)

      // Sneak attack damage
      const sneakRolls = rollMultiple(sneakDice, 6)
      const sneakTotal = sneakRolls.reduce((a, b) => a + b, 0)

      let damageTotal = baseDamageTotal + sneakTotal
      if (isCritical) damageTotal *= 2

      const result: CombatRollResult = {
        id: generateId(),
        action: "sneak-attack",
        timestamp: Date.now(),
        attackRoll,
        attackModifier,
        attackTotal,
        isCritical,
        isMiss,
        rollMode,
        advantageRolls,
        damageRolls: [...baseDamageRolls, ...sneakRolls],
        damageDice: `1d8+${sneakDice}d6`,
        damageTotal,
        damageType: "piercing",
        bonusDamage: sneakTotal,
        label: `Ataque Furtivo (${sneakDice}d6)`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sword className="h-5 w-5 text-red-500" />
          Ataque Furtivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sneak Dice */}
        <div className="space-y-2">
          <Label>Dados de Ataque Furtivo</Label>
          <div className="grid grid-cols-2 gap-2">
            {SNEAK_DICE_OPTIONS.map((option) => (
              <button
                key={option.dice}
                type="button"
                onClick={() => setSneakDice(option.dice)}
                className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                  sneakDice === option.dice
                    ? "bg-red-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {option.label}
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
          onClick={handleSneakAttack}
          disabled={isRolling}
          className="w-full bg-red-500 hover:bg-red-600"
        >
          <Dice6 className="mr-2 h-4 w-4" />
          {isRolling ? "Atacando..." : "Realizar Ataque Furtivo"}
        </Button>

        {/* Damage Preview */}
        <div className="rounded bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Daño base: 1d8 perforante + {sneakDice}d6 daño extra
          </p>
          <p className="text-sm text-muted-foreground">
            Promedio: {4.5 + sneakDice * 3.5}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}