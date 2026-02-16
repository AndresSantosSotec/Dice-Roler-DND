"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Zap, Wand2 } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface EldritchBlastPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

export function EldritchBlastPanel({ onResult, isRolling, setIsRolling }: EldritchBlastPanelProps) {
  const [warlockLevel, setWarlockLevel] = useState(1)
  const [attackModifier, setAttackModifier] = useState(4)
  const [numBlasts, setNumBlasts] = useState(1)

  const maxBlasts = Math.ceil(warlockLevel / 5)
  const damagePerBlast = Math.ceil(warlockLevel / 6) + 1

  const handleEldritchBlast = () => {
    setIsRolling(true)

    setTimeout(() => {
      let totalDamage = 0
      const allRolls: number[] = []
      let hitCount = 0

      for (let i = 0; i < numBlasts; i++) {
        const attackRoll = rollDie(20) + attackModifier
        if (attackRoll >= 10) {
          const damageRolls = rollMultiple(1, 10)
          totalDamage += damageRolls[0]
          allRolls.push(damageRolls[0])
          hitCount++
        }
      }

      const result: CombatRollResult = {
        id: generateId(),
        action: "eldritch-blast",
        timestamp: Date.now(),
        attackModifier,
        isCritical: false,
        isMiss: hitCount === 0,
        rollMode: "normal",
        damageRolls: allRolls,
        damageDice: `${hitCount}d10`,
        damageTotal: totalDamage,
        damageType: "force",
        bonusDamage: 0,
        label: `Ráfaga Mística (${hitCount}/${numBlasts} aciertos)`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          Ráfaga Mística
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warlock Level */}
        <div className="space-y-2">
          <Label>Nivel de Brujo</Label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 5, 10, 15, 20].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setWarlockLevel(level)}
                className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                  warlockLevel === level
                    ? "bg-purple-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                N{level}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Blasts */}
        <div className="space-y-2">
          <Label>Número de Ráfagas (máx {maxBlasts})</Label>
          <div className="flex gap-2">
            {Array.from({ length: maxBlasts }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumBlasts(n)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  numBlasts === n
                    ? "bg-purple-600 text-white"
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

        {/* Roll Button */}
        <Button
          onClick={handleEldritchBlast}
          disabled={isRolling}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Zap className="mr-2 h-4 w-4" />
          {isRolling ? "Lanzando..." : "Lanzar Ráfaga Mística"}
        </Button>

        {/* Info */}
        <div className="rounded bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Daño por ráfaga: 1d10 fuerza
          </p>
          <p className="text-sm text-muted-foreground">
            Ráfagas disponibles: {numBlasts}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
