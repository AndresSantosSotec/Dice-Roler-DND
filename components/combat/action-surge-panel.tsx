"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Zap, Swords } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface ActionSurgePanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

export function ActionSurgePanel({ onResult, isRolling, setIsRolling }: ActionSurgePanelProps) {
  const [warriorLevel, setWarriorLevel] = useState(5)
  const [attackModifier, setAttackModifier] = useState(5)
  const [numAttacks, setNumAttacks] = useState(2)
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal")

  const surgeCount = Math.ceil(warriorLevel / 5)
  const maxAttacks = 2 + Math.floor((warriorLevel - 1) / 5)

  const handleActionSurge = () => {
    setIsRolling(true)

    setTimeout(() => {
      let damageTotal = 0
      const allRolls: number[] = []
      let hitCount = 0

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
          let damageRolls = rollMultiple(1, 8)
          let damage = damageRolls.reduce((a, b) => a + b, 0) + attackModifier
          if (isCritical) damage *= 2
          damageTotal += damage
          allRolls.push(damage)
          hitCount++
        }
      }

      const result: CombatRollResult = {
        id: generateId(),
        action: "action-surge",
        timestamp: Date.now(),
        attackModifier,
        isCritical: hitCount === numAttacks,
        isMiss: hitCount === 0,
        rollMode,
        damageRolls: allRolls,
        damageDice: `${hitCount}d8+${hitCount * attackModifier}`,
        damageTotal,
        damageType: "slashing",
        bonusDamage: hitCount * attackModifier,
        label: `Acción Adicional (${hitCount}/${numAttacks} aciertos)`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Acción Adicional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warrior Level */}
        <div className="space-y-2">
          <Label>Nivel de Guerrero</Label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 5, 9, 13, 17, 20].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setWarriorLevel(level)}
                className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                  warriorLevel === level
                    ? "bg-yellow-600 text-white"
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
          <Label>Número de Ataques Adicionales (máx {maxAttacks})</Label>
          <div className="flex gap-2">
            {Array.from({ length: Math.min(maxAttacks, 4) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumAttacks(n)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  numAttacks === n
                    ? "bg-yellow-600 text-white"
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
          onClick={handleActionSurge}
          disabled={isRolling}
          className="w-full bg-yellow-600 hover:bg-yellow-700"
        >
          <Swords className="mr-2 h-4 w-4" />
          {isRolling ? "Atacando..." : "Usar Acción Adicional"}
        </Button>

        {/* Info */}
        <div className="rounded bg-muted p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Usos disponibles por descanso largo: {surgeCount}
          </p>
          <p className="text-sm text-muted-foreground">
            Ataques disponibles esta acción: {numAttacks}
          </p>
          <p className="text-sm text-muted-foreground">
            Daño por ataque: 1d8 + {attackModifier}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
