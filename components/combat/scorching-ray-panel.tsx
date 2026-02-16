"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Flame, Zap } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface ScorchingRayPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

export function ScorchingRayPanel({ onResult, isRolling, setIsRolling }: ScorchingRayPanelProps) {
  const [spellLevel, setSpellLevel] = useState(2)
  const [attackModifier, setAttackModifier] = useState(5)
  const [numTargets, setNumTargets] = useState(3)

  const raysPerLevel = 3 + Math.max(0, spellLevel - 2)

  const handleScorchingRay = () => {
    setIsRolling(true)

    setTimeout(() => {
      let totalDamage = 0
      const allRolls: number[] = []
      let hitCount = 0

      for (let i = 0; i < raysPerLevel; i++) {
        const attackRoll = rollDie(20) + attackModifier
        if (attackRoll >= 10) {
          const damageRolls = rollMultiple(2, 6)
          const damage = damageRolls.reduce((a, b) => a + b, 0)
          totalDamage += damage
          allRolls.push(damage)
          hitCount++
        }
      }

      const result: CombatRollResult = {
        id: generateId(),
        action: "scorching-ray",
        timestamp: Date.now(),
        attackModifier,
        isCritical: false,
        isMiss: hitCount === 0,
        rollMode: "normal",
        damageRolls: allRolls,
        damageDice: `${hitCount}d12`,
        damageTotal: totalDamage,
        damageType: "fire",
        bonusDamage: 0,
        label: `Rayos Abrasadores (${hitCount}/${raysPerLevel} aciertos)`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-600" />
          Rayos Abrasadores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spell Level */}
        <div className="space-y-2">
          <Label>Nivel del Conjuro</Label>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSpellLevel(level)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  spellLevel === level
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

        {/* Num Targets */}
        <div className="space-y-2">
          <Label htmlFor="num-targets">Número de Objetivos</Label>
          <input
            id="num-targets"
            type="number"
            min="1"
            max="10"
            value={numTargets}
            onChange={(e) => setNumTargets(Number(e.target.value))}
            className="w-full rounded border border-input bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Roll Button */}
        <Button
          onClick={handleScorchingRay}
          disabled={isRolling}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          <Zap className="mr-2 h-4 w-4" />
          {isRolling ? "Lanzando..." : "Lanzar Rayos Abrasadores"}
        </Button>

        {/* Info */}
        <div className="rounded bg-muted p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Rayos totales: {raysPerLevel} (2d6 cada uno)
          </p>
          <p className="text-sm text-muted-foreground">
            Cada rayo afecta un objetivo individual
          </p>
          <p className="text-sm text-muted-foreground">
            Promedio por rayo: 7 daño de fuego
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
