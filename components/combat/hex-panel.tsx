"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skull, Target } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, generateId } from "./combat-types"

interface HexPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

const HEX_OPTIONS = [
  { value: "strength", label: "Fuerza", attribute: "STR" },
  { value: "dexterity", label: "Destreza", attribute: "DEX" },
  { value: "constitution", label: "Constitución", attribute: "CON" },
  { value: "intelligence", label: "Inteligencia", attribute: "INT" },
  { value: "wisdom", label: "Sabiduría", attribute: "WIS" },
  { value: "charisma", label: "Carisma", attribute: "CHA" },
]

export function HexPanel({ onResult, isRolling, setIsRolling }: HexPanelProps) {
  const [selectedHex, setSelectedHex] = useState("strength")
  const [targetAC, setTargetAC] = useState(14)
  const [attackModifier, setAttackModifier] = useState(4)

  const handleHex = () => {
    setIsRolling(true)

    setTimeout(() => {
      const attackRoll = rollDie(20) + attackModifier
      const isCritical = attackRoll === 20 + attackModifier
      const isMiss = attackRoll < targetAC

      const hexAttribute = HEX_OPTIONS.find((h) => h.value === selectedHex)

      const result: CombatRollResult = {
        id: generateId(),
        action: "hex",
        timestamp: Date.now(),
        attackRoll,
        attackModifier,
        attackTotal: attackRoll,
        isCritical,
        isMiss,
        rollMode: "normal",
        damageRolls: [4],
        damageDice: "Maldición",
        damageTotal: 4,
        damageType: "necrotic",
        bonusDamage: 0,
        label: `Maldición - ${hexAttribute?.label || "Desconocido"}`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skull className="h-5 w-5 text-red-600" />
          Maldición
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hex Selection */}
        <div className="space-y-2">
          <Label>Atributo Maldecido</Label>
          <div className="grid grid-cols-2 gap-2">
            {HEX_OPTIONS.map((hex) => (
              <button
                key={hex.value}
                type="button"
                onClick={() => setSelectedHex(hex.value)}
                className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                  selectedHex === hex.value
                    ? "bg-red-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {hex.label}
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

        {/* Target AC */}
        <div className="space-y-2">
          <Label htmlFor="target-ac">AC del Objetivo</Label>
          <input
            id="target-ac"
            type="number"
            value={targetAC}
            onChange={(e) => setTargetAC(Number(e.target.value))}
            className="w-full rounded border border-input bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Roll Button */}
        <Button
          onClick={handleHex}
          disabled={isRolling}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          <Target className="mr-2 h-4 w-4" />
          {isRolling ? "Maldeciendo..." : "Lanzar Maldición"}
        </Button>

        {/* Info */}
        <div className="rounded bg-muted p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            El objetivo tiene desventaja en tiradas de {HEX_OPTIONS.find((h) => h.value === selectedHex)?.label}
          </p>
          <p className="text-sm text-muted-foreground">
            Daño adicional: 1d4 necrótico en cada ataque al objetivo
          </p>
          <p className="text-sm text-muted-foreground">
            Duración: 1 hora (o hasta que hechizo sea escindido)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
