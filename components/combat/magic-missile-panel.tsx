"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sparkles, Target } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface MagicMissilePanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

const MISSILE_COUNT = 3

export function MagicMissilePanel({ onResult, isRolling, setIsRolling }: MagicMissilePanelProps) {
  const [spellLevel, setSpellLevel] = useState(1)

  const handleMagicMissile = () => {
    setIsRolling(true)

    setTimeout(() => {
      // No attack roll for magic missile
      const damageRolls: number[] = []
      let damageTotal = 0

      for (let i = 0; i < MISSILE_COUNT; i++) {
        const roll = rollDie(4) + 1 // 1d4 + 1
        damageRolls.push(roll)
        damageTotal += roll
      }

      // Bonus missiles at higher levels
      const bonusMissiles = Math.max(0, spellLevel - 1)
      for (let i = 0; i < bonusMissiles; i++) {
        const roll = rollDie(4) + 1
        damageRolls.push(roll)
        damageTotal += roll
      }

      const totalMissiles = MISSILE_COUNT + bonusMissiles

      const result: CombatRollResult = {
        id: generateId(),
        action: "magic-missile",
        timestamp: Date.now(),
        attackModifier: 0, // No attack roll
        isCritical: false,
        isMiss: false,
        rollMode: "normal",
        damageRolls,
        damageDice: `${totalMissiles}d4+${totalMissiles}`,
        damageTotal,
        damageType: "force",
        bonusDamage: 0,
        label: `Proyectil Mágico (Nivel ${spellLevel})`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Proyectil Mágico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spell Level */}
        <div className="space-y-2">
          <Label>Nivel del Conjuro</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSpellLevel(level)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  spellLevel === level
                    ? "bg-purple-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Nivel {level}
              </button>
            ))}
          </div>
        </div>

        {/* Roll Button */}
        <Button
          onClick={handleMagicMissile}
          disabled={isRolling}
          className="w-full bg-purple-500 hover:bg-purple-600"
        >
          <Target className="mr-2 h-4 w-4" />
          {isRolling ? "Lanzando..." : "Lanzar Proyectil Mágico"}
        </Button>

        {/* Damage Preview */}
        <div className="rounded bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            {MISSILE_COUNT + Math.max(0, spellLevel - 1)} proyectiles: {MISSILE_COUNT + Math.max(0, spellLevel - 1)}d4+{MISSILE_COUNT + Math.max(0, spellLevel - 1)} fuerza
          </p>
          <p className="text-sm text-muted-foreground">
            Promedio: {((MISSILE_COUNT + Math.max(0, spellLevel - 1)) * 2.5 + (MISSILE_COUNT + Math.max(0, spellLevel - 1)))}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}