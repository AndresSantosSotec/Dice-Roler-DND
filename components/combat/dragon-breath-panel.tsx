"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Flame, Snowflake, Zap, Droplets, Skull } from "lucide-react"
import type { CombatRollResult, DamageType } from "./combat-types"
import { ELEMENTS, DAMAGE_TYPE_CONFIG, rollDie, rollMultiple, generateId } from "./combat-types"

interface DragonBreathPanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

const ELEMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fire: Flame,
  ice: Snowflake,
  lightning: Zap,
  acid: Droplets,
  poison: Skull,
}

const BREATH_PRESETS = [
  { label: "Joven", dice: 6, sides: 6, dc: 14 },
  { label: "Adulto", dice: 12, sides: 6, dc: 18 },
  { label: "Anciano", dice: 18, sides: 6, dc: 21 },
  { label: "Personalizado", dice: 0, sides: 0, dc: 0 },
]

export function DragonBreathPanel({ onResult, isRolling, setIsRolling }: DragonBreathPanelProps) {
  const [element, setElement] = useState<DamageType>("fire")
  const [presetIdx, setPresetIdx] = useState(0)
  const [customDice, setCustomDice] = useState(6)
  const [customSides, setCustomSides] = useState(6)
  const [customDC, setCustomDC] = useState(14)
  const [targetSaveMod, setTargetSaveMod] = useState(3)

  const preset = BREATH_PRESETS[presetIdx]
  const isCustom = preset.label === "Personalizado"
  const dice = isCustom ? customDice : preset.dice
  const sides = isCustom ? customSides : preset.sides
  const dc = isCustom ? customDC : preset.dc

  const handleBreath = () => {
    setIsRolling(true)

    setTimeout(() => {
      // Damage dice
      const damageRolls = rollMultiple(dice, sides)
      let damageTotal = damageRolls.reduce((a, b) => a + b, 0)

      // Target saving throw
      const targetSavingThrow = rollDie(20) + targetSaveMod
      const targetSaved = targetSavingThrow >= dc

      // Half damage on save
      if (targetSaved) {
        damageTotal = Math.floor(damageTotal / 2)
      }

      const result: CombatRollResult = {
        id: generateId(),
        action: "dragon-breath",
        timestamp: Date.now(),
        attackModifier: 0,
        isCritical: false,
        isMiss: false,
        rollMode: "normal",
        damageRolls,
        damageDice: `${dice}d${sides}`,
        damageTotal,
        damageType: element,
        bonusDamage: 0,
        element,
        savingThrowDC: dc,
        targetSavingThrow,
        targetSaved,
        label: `Aliento de Dragon (${DAMAGE_TYPE_CONFIG[element].label})${targetSaved ? " - Salvacion exitosa (mitad)" : " - Fallo en salvacion"}`,
      }

      onResult(result)
      setIsRolling(false)
    }, 1100)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Flame className="h-5 w-5" style={{ color: DAMAGE_TYPE_CONFIG[element].color }} />
          Aliento de Dragon (Dragon Breath)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Element selector */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Elemento
          </Label>
          <div className="flex flex-wrap gap-2">
            {ELEMENTS.map((el) => {
              const Icon = ELEMENT_ICONS[el] ?? Flame
              const config = DAMAGE_TYPE_CONFIG[el]
              return (
                <button
                  key={el}
                  type="button"
                  onClick={() => setElement(el)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    element === el
                      ? "ring-1"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  style={
                    element === el
                      ? {
                          backgroundColor: config.color + "20",
                          color: config.color,
                          ringColor: config.color + "60",
                          boxShadow: `0 0 12px ${config.color}20`,
                        }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4" />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dragon age presets */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tipo de dragon
          </Label>
          <div className="flex flex-wrap gap-2">
            {BREATH_PRESETS.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setPresetIdx(i)}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  presetIdx === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <span className="font-bold">{p.label}</span>
                {p.dice > 0 && (
                  <span className="font-mono text-xs opacity-70">{p.dice}d{p.sides} DC {p.dc}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom inputs */}
        {isCustom && (
          <div className="grid grid-cols-3 gap-3 rounded-lg bg-secondary/50 p-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Dados</Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={customDice}
                onChange={(e) => setCustomDice(Math.max(1, parseInt(e.target.value) || 1))}
                className="border-border bg-card font-mono text-foreground"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Caras</Label>
              <Input
                type="number"
                min={4}
                max={12}
                value={customSides}
                onChange={(e) => setCustomSides(Math.max(4, parseInt(e.target.value) || 6))}
                className="border-border bg-card font-mono text-foreground"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">DC Salvacion</Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={customDC}
                onChange={(e) => setCustomDC(Math.max(1, parseInt(e.target.value) || 14))}
                className="border-border bg-card font-mono text-foreground"
              />
            </div>
          </div>
        )}

        {/* Target save modifier */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Modificador de salvacion del objetivo
          </Label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTargetSaveMod((v) => Math.max(-5, v - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-secondary/80"
            >
              -
            </button>
            <span className="flex h-9 w-12 items-center justify-center rounded-md bg-secondary font-mono text-lg font-bold text-foreground">
              {targetSaveMod >= 0 ? "+" : ""}{targetSaveMod}
            </span>
            <button
              type="button"
              onClick={() => setTargetSaveMod((v) => Math.min(15, v + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-secondary/80"
            >
              +
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-center font-mono text-sm text-muted-foreground">
            {"Daño: "}
            <span className="font-bold" style={{ color: DAMAGE_TYPE_CONFIG[element].color }}>
              {dice}d{sides} {DAMAGE_TYPE_CONFIG[element].label.toLowerCase()}
            </span>
            {" | DC "}
            <span className="font-bold text-foreground">{dc}</span>
            {" | Mitad en exito"}
          </p>
        </div>

        {/* Roll button */}
        <Button
          size="lg"
          onClick={handleBreath}
          disabled={isRolling}
          className="w-full py-6 text-lg font-bold shadow-lg"
          style={{
            backgroundColor: DAMAGE_TYPE_CONFIG[element].color,
            color: element === "lightning" || element === "ice" ? "#1a1a2e" : "#ffffff",
            boxShadow: `0 0 20px ${DAMAGE_TYPE_CONFIG[element].color}40`,
          }}
        >
          <Flame className="mr-2 h-6 w-6" />
          {isRolling ? "Invocando aliento..." : "Aliento de Dragon"}
        </Button>
      </CardContent>
    </Card>
  )
}
