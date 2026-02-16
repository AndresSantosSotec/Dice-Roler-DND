"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Axe, Zap } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface GreatWeaponMasterPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

export function GreatWeaponMasterPanel({ onResult, isRolling, setIsRolling }: GreatWeaponMasterPanelProps) {
  const [warriorLevel, setWarriorLevel] = useState(5)
  const [attackModifier, setAttackModifier] = useState(5)
  const [useGWM, setUseGWM] = useState(true)
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal")

  const handleGreatWeaponMaster = () => {
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

      const gwmPenalty = useGWM ? 5 : 0
      const gwmBonus = useGWM ? 10 : 0
      const isCritical = attackRoll === 20
      const attackTotal = attackRoll + (attackModifier - gwmPenalty)
      const isMiss = attackRoll === 1 || (!isCritical && attackTotal < 10)

      // Base damage (2d6 for greatsword)
      const baseDamageRolls = rollMultiple(2, 6)
      let baseDamageTotal = baseDamageRolls.reduce((a, b) => a + b, 0)

      let damageTotal = baseDamageTotal + attackModifier + gwmBonus
      if (isCritical) damageTotal *= 2

      const result: CombatRollResult = {
        id: generateId(),
        action: "great-weapon-master",
        timestamp: Date.now(),
        attackRoll,
        attackModifier: attackModifier - gwmPenalty,
        attackTotal,
        isCritical,
        isMiss,
        rollMode,
        advantageRolls,
        damageRolls: baseDamageRolls,
        damageDice: `2d6+${attackModifier}${useGWM ? "+10" : ""}`,
        damageTotal,
        damageType: "slashing",
        bonusDamage: gwmBonus,
        label: `${useGWM ? "Maestría de Armas Grandes" : "Ataque Estándar"} (Nivel ${warriorLevel})`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Axe className="h-5 w-5 text-stone-600" />
          Maestría de Armas Grandes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warrior Level */}
        <div className="space-y-2">
          <Label>Nivel de Guerrero</Label>
          <div className="grid grid-cols-5 gap-2">
            {[3, 5, 9, 13, 17, 20].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setWarriorLevel(level)}
                className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                  warriorLevel === level
                    ? "bg-stone-600 text-white"
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

        {/* Use GWM */}
        <div className="space-y-2">
          <Label>Usar Maestría de Armas Grandes</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUseGWM(true)}
              className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                useGWM
                  ? "bg-stone-600 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Sí ({attackModifier - 5} ataque, +10 daño)
            </button>
            <button
              type="button"
              onClick={() => setUseGWM(false)}
              className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                !useGWM
                  ? "bg-stone-600 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              No ({attackModifier} ataque)
            </button>
          </div>
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
          onClick={handleGreatWeaponMaster}
          disabled={isRolling}
          className="w-full bg-stone-600 hover:bg-stone-700"
        >
          <Axe className="mr-2 h-4 w-4" />
          {isRolling ? "Atacando..." : "Realizar Ataque"}
        </Button>

        {/* Info */}
        <div className="rounded bg-muted p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Arma: Espada Grande (2d6) o similar
          </p>
          {useGWM && (
            <p className="text-xs text-yellow-600 font-semibold">
              ⚠️ GWM: -5 a ataque, +10 a daño siempre
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Daño cortante
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
