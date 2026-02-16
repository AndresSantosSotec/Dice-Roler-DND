
"use client"

import { useState, useCallback } from "react"
import { Sun, Flame, Zap, Sparkles, Sword, Waves, Wind, Snowflake, Star, AlertTriangle, Moon, Hand, Hammer } from "lucide-react"
import { DivineSmitePanel } from "./divine-smite-panel"
import { DragonBreathPanel } from "./dragon-breath-panel"
import { FireBoltPanel } from "./fire-bolt-panel"
import { MagicMissilePanel } from "./magic-missile-panel"
import { SneakAttackPanel } from "./sneak-attack-panel"
import { ThunderousSmitePanel } from "./thunderous-smite-panel"
import { SpellAttackPanel } from "./spell-attack-panel"
import { QuiveringPalmPanel } from "./quivering-palm-panel"
import { CombatResultPanel } from "./combat-result-panel"
import { CombatHistory } from "./combat-history"
import type { CombatRollResult, CombatAction } from "./combat-types"

// Categorized Actions
const MELEE_ACTIONS: { action: CombatAction; label: string; icon: any; color: string }[] = [
  { action: "divine-smite", label: "Castigo Divino", icon: Sun, color: "#f5c842" },
  { action: "sneak-attack", label: "Ataque Furtivo", icon: Sword, color: "#ef4444" },
  { action: "thunderous-smite", label: "Golpe Atronador", icon: Hammer, color: "#f59e0b" },
  { action: "quivering-palm", label: "Palma Vibrante", icon: Hand, color: "#d97706" },
]

const SPELL_ACTIONS: { action: CombatAction; label: string; icon: any; color: string }[] = [
  { action: "fireball", label: "Bola de Fuego", icon: Flame, color: "#ef4444" },
  { action: "chain-lightning", label: "Cadena de Rayos", icon: Zap, color: "#f59e0b" },
  { action: "cone-of-cold", label: "Cono de Frio", icon: Snowflake, color: "#38bdf8" },
  { action: "tsunami", label: "Ola Destructora", icon: Waves, color: "#0ea5e9" },
  { action: "whirlwind", label: "Torbellino", icon: Wind, color: "#94a3b8" },
  { action: "meteor-swarm", label: "Lluvia de Meteoros", icon: AlertTriangle, color: "#f43f5e" },
  { action: "disintegrate", label: "Desintegrar", icon: Star, color: "#10b981" },
  { action: "hunger-of-hadar", label: "Hambre de Hadar", icon: Moon, color: "#4c1d95" },
]

const UTILITY_ACTIONS: { action: CombatAction; label: string; icon: any; color: string }[] = [
  { action: "dragon-breath", label: "Aliento de Dragon", icon: Flame, color: "#ef4444" },
  { action: "fire-bolt", label: "Rayo de Fuego", icon: Flame, color: "#ef4444" },
  { action: "magic-missile", label: "Proyectil Mágico", icon: Sparkles, color: "#8b5cf6" },
]

export function CombatTab() {
  const [selectedAbility, setSelectedAbility] = useState<CombatAction>("divine-smite")
  const [combatHistory, setCombatHistory] = useState<CombatRollResult[]>([])
  const [currentCombatResult, setCurrentCombatResult] = useState<CombatRollResult | null>(null)
  const [isCombatRolling, setIsCombatRolling] = useState(false)

  // Category State
  const [category, setCategory] = useState<"melee" | "spells" | "other">("melee")

  const handleCombatResult = useCallback((result: CombatRollResult) => {
    setCurrentCombatResult(result)
    setCombatHistory((prev) => [...prev, result])
  }, [])

  const handleClearCombatHistory = useCallback(() => {
    setCombatHistory([])
    setCurrentCombatResult(null)
  }, [])

  const currentActions = category === "melee" ? MELEE_ACTIONS : category === "spells" ? SPELL_ACTIONS : UTILITY_ACTIONS

  return (
    <div className="flex flex-col gap-6">

      {/* Category Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-max mx-auto">
        <button
          onClick={() => { setCategory("melee"); setSelectedAbility("divine-smite"); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${category === "melee" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
        >
          ⚔️ Cuerpo a Cuerpo
        </button>
        <button
          onClick={() => { setCategory("spells"); setSelectedAbility("fireball"); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${category === "spells" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
        >
          🔥 Hechizos de area
        </button>
        <button
          onClick={() => { setCategory("other"); setSelectedAbility("dragon-breath"); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${category === "other" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
        >
          ✨ Otros / Utilidad
        </button>
      </div>

      {/* Ability selector (Scrollable) */}
      <div className="flex gap-2 w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent justify-start lg:justify-center">
        {currentActions.map((tab) => (
          <button
            key={tab.action}
            type="button"
            onClick={() => setSelectedAbility(tab.action)}
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all whitespace-nowrap border ${selectedAbility === tab.action
                ? "ring-1 shadow-md scale-105"
                : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80 opacity-70 hover:opacity-100"
              }`}
            style={
              selectedAbility === tab.action
                ? {
                  backgroundColor: tab.color + "15",
                  color: tab.color,
                  boxShadow: `0 0 16px ${tab.color}20`,
                  borderColor: tab.color + "40",
                }
                : undefined
            }
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: ability panel */}
        <div className="lg:col-span-3">
          {selectedAbility === "divine-smite" && (
            <DivineSmitePanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "quivering-palm" && (
            <QuiveringPalmPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "dragon-breath" && (
            <DragonBreathPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "fire-bolt" && (
            <FireBoltPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "magic-missile" && (
            <MagicMissilePanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "sneak-attack" && (
            <SneakAttackPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "thunderous-smite" && (
            <ThunderousSmitePanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}

          {/* Generic Spell Panels */}
          {(selectedAbility === "fireball" ||
            selectedAbility === "chain-lightning" ||
            selectedAbility === "tsunami" ||
            selectedAbility === "whirlwind" ||
            selectedAbility === "cone-of-cold" ||
            selectedAbility === "disintegrate" ||
            selectedAbility === "meteor-swarm" ||
            selectedAbility === "hunger-of-hadar"
          ) && (
              <SpellAttackPanel
                spellId={selectedAbility}
                onResult={handleCombatResult}
                isRolling={isCombatRolling}
                setIsRolling={setIsCombatRolling}
              />
            )}
        </div>

        {/* Right: result + history */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <CombatResultPanel result={currentCombatResult} isRolling={isCombatRolling} />
          <CombatHistory history={combatHistory} onClear={handleClearCombatHistory} />
        </div>
      </div>
    </div>
  )
}
