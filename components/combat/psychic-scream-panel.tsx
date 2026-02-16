"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Volume2, Brain } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface PsychicScreamPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

export function PsychicScreamPanel({ onResult, isRolling, setIsRolling }: PsychicScreamPanelProps) {
  const [spellLevel, setSpellLevel] = useState(4)
  const [saveDC, setSaveDC] = useState(15)
  const [numTargets, setNumTargets] = useState(6)

  const diceByLevel: Record<number, number> = {
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
  }

  const damageDice = diceByLevel[spellLevel] || 4

  const handlePsychicScream = () => {
    setIsRolling(true)

    setTimeout(() => {
      let damageTotal = 0
      let failCount = 0
      const allRolls: number[] = []

      for (let i = 0; i < numTargets; i++) {
        const savingThrow = rollDie(20)
        if (savingThrow < saveDC) {
          const damageRolls = rollMultiple(damageDice, 6)
          const damage = damageRolls.reduce((a, b) => a + b, 0)
          damageTotal += damage
          allRolls.push(damage)
          failCount++
        }
      }

      const result: CombatRollResult = {
        id: generateId(),
        action: "psychic-scream",
        timestamp: Date.now(),
        attackModifier: 0,
        isCritical: failCount === numTargets,
        isMiss: failCount === 0,
        rollMode: "normal",
        damageRolls: allRolls,
        damageDice: `${failCount}d${damageDice * 6}`,
        damageTotal,
        damageType: "force",
        bonusDamage: 0,
        savingThrowDC: saveDC,
        label: `Grito Psíquico (${failCount}/${numTargets} fallos)`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Grito Psíquico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spell Level */}
        <div className="space-y-2">
          <Label>Nivel del Conjuro</Label>
          <div className="flex gap-2">
            {[4, 5, 6, 7, 8, 9].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSpellLevel(level)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  spellLevel === level
                    ? "bg-purple-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                N{level}
              </button>
            ))}
          </div>
        </div>

        {/* Save DC */}
        <div className="space-y-2">
          <Label htmlFor="save-dc">DC de Tirada de Salvación</Label>
          <input
            id="save-dc"
            type="number"
            value={saveDC}
            onChange={(e) => setSaveDC(Number(e.target.value))}
            className="w-full rounded border border-input bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Num Targets */}
        <div className="space-y-2">
          <Label htmlFor="num-targets">Número de Objetivos en el Área</Label>
          <input
            id="num-targets"
            type="number"
            min="1"
            max="20"
            value={numTargets}
            onChange={(e) => setNumTargets(Number(e.target.value))}
            className="w-full rounded border border-input bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Roll Button */}
        <Button
          onClick={handlePsychicScream}
          disabled={isRolling}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Volume2 className="mr-2 h-4 w-4" />
          {isRolling ? "Gritando..." : "Lanzar Grito Psíquico"}
        </Button>

        {/* Info */}
        <div className="rounded bg-muted p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Daño: {damageDice}d6 fuerza mental
          </p>
          <p className="text-sm text-muted-foreground">
            Éreas de efecto: Área de 60 pies
          </p>
          <p className="text-sm text-muted-foreground">
            Los objetivos que fallen la tirada de salvación sufren daño completo
          </p>
          <p className="text-sm text-muted-foreground">
            Promedio de daño: {damageDice * 3.5}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
