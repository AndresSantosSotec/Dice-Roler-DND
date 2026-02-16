"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Flame, Zap } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface FireBoltPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

const SPELL_LEVELS = [
  { level: 1, label: "Nivel 1", dice: 1 },
  { level: 2, label: "Nivel 2", dice: 2 },
  { level: 3, label: "Nivel 3", dice: 3 },
  { level: 4, label: "Nivel 4", dice: 4 },
  { level: 5, label: "Nivel 5", dice: 5 },
]

export function FireBoltPanel({ onResult, isRolling, setIsRolling }: FireBoltPanelProps) {
  const [spellLevel, setSpellLevel] = useState(1)
  const [attackModifier, setAttackModifier] = useState(5)
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal")

  const selectedLevel = SPELL_LEVELS.find((s) => s.level === spellLevel) ?? SPELL_LEVELS[0]

  const handleFireBolt = () => {
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
      const isMiss = attackRoll === 1 || (!isCritical && attackTotal < 10) // Assume AC 10 for demo

      // Damage
      const damageRolls = rollMultiple(selectedLevel.dice, 10)
      let damageTotal = damageRolls.reduce((a, b) => a + b, 0)
      if (isCritical) damageTotal *= 2

      const result: CombatRollResult = {
        id: generateId(),
        action: "fire-bolt",
        timestamp: Date.now(),
        attackRoll,
        attackModifier,
        attackTotal,
        isCritical,
        isMiss,
        rollMode,
        advantageRolls,
        damageRolls,
        damageDice: `${selectedLevel.dice}d10`,
        damageTotal,
        damageType: "fire",
        bonusDamage: 0,
        label: `Rayo de Fuego (Nivel ${spellLevel})`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Rayo de Fuego
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spell Level */}
        <div className="space-y-2">
          <Label>Nivel del Conjuro</Label>
          <div className="flex gap-2">
            {SPELL_LEVELS.map((level) => (
              <button
                key={level.level}
                type="button"
                onClick={() => setSpellLevel(level.level)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  spellLevel === level.level
                    ? "bg-orange-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {level.label}
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
          onClick={handleFireBolt}
          disabled={isRolling}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          <Zap className="mr-2 h-4 w-4" />
          {isRolling ? "Lanzando..." : "Lanzar Rayo de Fuego"}
        </Button>

        {/* Damage Preview */}
        <div className="rounded bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Daño: {selectedLevel.dice}d10 fuego
            {selectedLevel.dice > 1 && ` (${selectedLevel.dice * 5.5} promedio)`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}