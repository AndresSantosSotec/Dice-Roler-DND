
"use client"

import { useState, useCallback } from "react"
import { Sun, Flame, Zap, Sparkles, Sword, Waves, Wind, Snowflake, Star, AlertTriangle, Moon, Hand, Hammer, Brain, Volume2, Axe, Skull } from "lucide-react"
import { DivineSmitePanel } from "./divine-smite-panel"
import { DragonBreathPanel } from "./dragon-breath-panel"
import { FireBoltPanel } from "./fire-bolt-panel"
import { MagicMissilePanel } from "./magic-missile-panel"
import { SneakAttackPanel } from "./sneak-attack-panel"
import { ThunderousSmitePanel } from "./thunderous-smite-panel"
import { SpellAttackPanel } from "./spell-attack-panel"
import { QuiveringPalmPanel } from "./quivering-palm-panel"
import { StunningStrikePanel } from "./stunning-strike-panel"
import { KiStrikesPanel } from "./ki-strikes-panel"
import { EldritchBlastPanel } from "./eldritch-blast-panel"
import { HexPanel } from "./hex-panel"
import { ScorchingRayPanel } from "./scorching-ray-panel"
import { PsychicScreamPanel } from "./psychic-scream-panel"
import { GreatWeaponMasterPanel } from "./great-weapon-master-panel"
import { ActionSurgePanel } from "./action-surge-panel"
import { CombatResultPanel } from "./combat-result-panel"
import { CombatHistory } from "./combat-history"
import type { CombatRollResult, CombatAction } from "./combat-types"

// Categorized Actions
const MELEE_ACTIONS: { action: CombatAction; label: string; icon: any; color: string }[] = [
  { action: "divine-smite", label: "Castigo Divino", icon: Sun, color: "#f5c842" },
  { action: "sneak-attack", label: "Ataque Furtivo", icon: Sword, color: "#ef4444" },
  { action: "thunderous-smite", label: "Golpe Atronador", icon: Hammer, color: "#f59e0b" },
  { action: "quivering-palm", label: "Palma Vibrante", icon: Hand, color: "#d97706" },
  { action: "stunning-strike", label: "Golpe Aturdidor", icon: Hand, color: "#ea580c" },
  { action: "ki-strikes", label: "Ataques de Ki", icon: Zap, color: "#3b82f6" },
  { action: "great-weapon-master", label: "Maestría Armas Grandes", icon: Axe, color: "#78716c" },
  { action: "action-surge", label: "Acción Adicional", icon: Zap, color: "#ca8a04" },
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
  { action: "scorching-ray", label: "Rayos Abrasadores", icon: Flame, color: "#ea580c" },
  { action: "psychic-scream", label: "Grito Psíquico", icon: Brain, color: "#9333ea" },
]

const WARLOCK_ACTIONS: { action: CombatAction; label: string; icon: any; color: string }[] = [
  { action: "eldritch-blast", label: "Ráfaga Mística", icon: Sparkles, color: "#9333ea" },
  { action: "hex", label: "Maldición", icon: Skull, color: "#dc2626" },
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
  const [category, setCategory] = useState<"melee" | "spells" | "warlock" | "other">("melee")

  const handleCombatResult = useCallback((result: CombatRollResult) => {
    setCurrentCombatResult(result)
    setCombatHistory((prev) => [...prev, result])
  }, [])

  const handleClearCombatHistory = useCallback(() => {
    setCombatHistory([])
    setCurrentCombatResult(null)
  }, [])

  const currentActions = category === "melee" ? MELEE_ACTIONS : category === "spells" ? SPELL_ACTIONS : category === "warlock" ? WARLOCK_ACTIONS : UTILITY_ACTIONS

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-7xl mx-auto px-2 sm:px-4">

      {/* Category Tabs */}
      <div className="flex gap-1 sm:gap-2 p-1 bg-muted rounded-lg w-full sm:w-max sm:mx-auto flex-wrap justify-center">
        <button
          onClick={() => { setCategory("melee"); setSelectedAbility("divine-smite"); }}
          className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${category === "melee" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
        >
          ⚔️ Cuerpo a Cuerpo
        </button>
        <button
          onClick={() => { setCategory("spells"); setSelectedAbility("fireball"); }}
          className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${category === "spells" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
        >
          🔥 Hechizos
        </button>
        <button
          onClick={() => { setCategory("warlock"); setSelectedAbility("eldritch-blast"); }}
          className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${category === "warlock" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
        >
          🌙 Brujo
        </button>
        <button
          onClick={() => { setCategory("other"); setSelectedAbility("dragon-breath"); }}
          className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${category === "other" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
        >
          ✨ Otros
        </button>
      </div>

      {/* Ability selector - Responsive tabs */}
      <div className="w-full overflow-x-auto pb-2 sm:pb-4 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
        <div className="flex gap-1 sm:gap-2 min-w-min justify-start sm:justify-center px-2 sm:px-0">
          {currentActions.map((tab) => (
            <button
              key={tab.action}
              type="button"
              onClick={() => setSelectedAbility(tab.action)}
              className={`flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${selectedAbility === tab.action
                  ? "ring-1 shadow-md scale-100"
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
              <tab.icon className="h-3 sm:h-4 w-3 sm:w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content grid - Responsive */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
        {/* Left: ability panel */}
        <div className="md:col-span-2 lg:col-span-3">
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
          {selectedAbility === "stunning-strike" && (
            <StunningStrikePanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "ki-strikes" && (
            <KiStrikesPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "great-weapon-master" && (
            <GreatWeaponMasterPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "action-surge" && (
            <ActionSurgePanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "eldritch-blast" && (
            <EldritchBlastPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "hex" && (
            <HexPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "scorching-ray" && (
            <ScorchingRayPanel
              onResult={handleCombatResult}
              isRolling={isCombatRolling}
              setIsRolling={setIsCombatRolling}
            />
          )}
          {selectedAbility === "psychic-scream" && (
            <PsychicScreamPanel
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
        <div className="flex flex-col gap-4 sm:gap-6 md:col-span-1 lg:col-span-2">
          <CombatResultPanel result={currentCombatResult} isRolling={isCombatRolling} />
          <CombatHistory history={combatHistory} onClear={handleClearCombatHistory} />
        </div>
      </div>
    </div>
  )
}
