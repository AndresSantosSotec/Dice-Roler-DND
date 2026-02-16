"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { DiceShape } from "@/components/dice-shapes"
import { ParticleExplosion, GroundSigil, FloatingDamageNumber } from "./particle-effects"
import { DAMAGE_TYPE_CONFIG } from "./combat-types"
import type { CombatRollResult } from "./combat-types"

interface CombatResultPanelProps {
  result: CombatRollResult | null
  isRolling: boolean
}

function PhaseLabel({ text, delay }: { text: string; delay: number }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  if (!show) return null
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground"
    >
      {text}
    </motion.span>
  )
}

export function CombatResultPanel({ result, isRolling }: CombatResultPanelProps) {
  const [showParticles, setShowParticles] = useState(false)
  const [showDamage, setShowDamage] = useState(false)
  const [phase, setPhase] = useState<"idle" | "attack" | "damage" | "done">("idle")

  useEffect(() => {
    if (!result) {
      setPhase("idle")
      setShowParticles(false)
      setShowDamage(false)
      return
    }

    setPhase("attack")
    setShowParticles(false)
    setShowDamage(false)

    const t1 = setTimeout(() => {
      setPhase("damage")
      setShowParticles(true)
    }, 400)

    const t2 = setTimeout(() => {
      setShowDamage(true)
    }, 800)

    const t3 = setTimeout(() => {
      setPhase("done")
    }, 1400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [result])

  const typeConfig = result ? DAMAGE_TYPE_CONFIG[result.damageType] : null
  const color = typeConfig?.color ?? "#94a3b8"

  return (
    <Card className="relative overflow-hidden border-border bg-card">
      <CardContent className="relative flex flex-col items-center gap-4 p-6">
        {/* Background glow */}
        <AnimatePresence>
          {result && !isRolling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Particles */}
        {result && (
          <ParticleExplosion
            element={result.damageType}
            active={showParticles}
            count={result.isCritical ? 40 : 24}
          />
        )}

        {/* Dice display */}
        <div className="relative">
          <DiceShape
            sides={result?.action === "dragon-breath" ? 6 : 8}
            className="h-24 w-24"
            isRolling={isRolling}
            color={isRolling ? undefined : color}
          />
          {/* Ground sigil for Divine Smite */}
          {result?.action === "divine-smite" && !isRolling && (
            <GroundSigil active={showParticles} color={color} />
          )}
          {/* Floating damage number */}
          {showDamage && result && !isRolling && (
            <FloatingDamageNumber
              value={result.damageTotal}
              color={color}
              label={result.isCritical ? "CRIT" : undefined}
            />
          )}
        </div>

        {/* Rolling state */}
        {isRolling && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="font-mono text-sm font-bold"
            style={{ color }}
          >
            {result?.action === "divine-smite" && "Invocando poder divino..."}
            {result?.action === "dragon-breath" && "Exhalando aliento..."}
            {!result && "Preparando..."}
          </motion.p>
        )}

        {/* Results */}
        {!isRolling && result && (
          <div className="relative z-10 flex w-full flex-col items-center gap-3">
            {/* Action label */}
            <PhaseLabel
              text={result.label.split("(")[0].trim()}
              delay={0}
            />

            {/* Attack roll (Divine Smite) */}
            {result.action === "divine-smite" && result.attackRoll !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Ataque
                </span>
                <div className="flex items-center gap-2">
                  {result.advantageRolls && (
                    <div className="flex gap-1">
                      {result.advantageRolls.map((r, i) => {
                        const isChosen =
                          (result.rollMode === "advantage" && r === Math.max(...result.advantageRolls!)) ||
                          (result.rollMode === "disadvantage" && r === Math.min(...result.advantageRolls!))
                        return (
                          <span
                            key={i}
                            className={`rounded px-1.5 py-0.5 font-mono text-sm font-bold ${isChosen
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground/40 line-through"
                              }`}
                          >
                            {r}
                          </span>
                        )
                      })}
                      <span className="font-mono text-sm text-muted-foreground">{" → "}</span>
                    </div>
                  )}
                  <span
                    className={`font-mono text-3xl font-black ${result.isCritical
                        ? "text-accent"
                        : result.isMiss
                          ? "text-destructive"
                          : "text-foreground"
                      }`}
                  >
                    {result.attackTotal}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    ({result.attackRoll}{result.attackModifier >= 0 ? "+" : ""}{result.attackModifier})
                  </span>
                </div>
                {result.isCritical && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ delay: 0.2 }}
                    className="rounded-md px-3 py-1 font-mono text-sm font-black uppercase tracking-widest"
                    style={{
                      backgroundColor: `${color}20`,
                      color,
                      textShadow: `0 0 10px ${color}`,
                    }}
                  >
                    GOLPE CRITICO
                  </motion.span>
                )}
                {result.isMiss && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    className="rounded-md bg-destructive/20 px-3 py-1 font-mono text-sm font-black uppercase tracking-widest text-destructive"
                  >
                    PIFIA
                  </motion.span>
                )}
              </motion.div>
            )}

            {/* Saving throw (Dragon Breath) */}
            {result.action === "dragon-breath" && result.targetSavingThrow !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Salvacion del objetivo (DC {result.savingThrowDC})
                </span>
                <span
                  className={`font-mono text-2xl font-black ${result.targetSaved ? "text-primary" : "text-destructive"
                    }`}
                >
                  {result.targetSavingThrow}
                </span>
                <span
                  className={`rounded-md px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${result.targetSaved
                      ? "bg-primary/20 text-primary"
                      : "bg-destructive/20 text-destructive"
                    }`}
                >
                  {result.targetSaved ? "SALVACION EXITOSA (mitad dano)" : "FALLO - DANO COMPLETO"}
                </span>
              </motion.div>
            )}

            {/* Separator */}
            <div className="h-px w-full max-w-[200px] bg-border" />

            {/* Damage total */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {"Daño "}
                <span style={{ color }}>{typeConfig?.label}</span>
              </span>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 1] }}
                transition={{ delay: 0.4, type: "spring" }}
                className="font-mono text-5xl font-black tabular-nums"
                style={{
                  color,
                  textShadow: `0 0 30px ${color}60`,
                }}
              >
                {result.damageTotal}
              </motion.p>
              <span className="font-mono text-xs text-muted-foreground">
                {result.damageDice}
                {result.targetSaved && " (mitad)"}
              </span>
            </motion.div>

            {/* Individual rolls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-1.5"
            >
              {result.damageRolls.map((roll, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded bg-secondary font-mono text-xs font-bold text-foreground"
                >
                  {roll}
                </motion.span>
              ))}
            </motion.div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="max-w-[280px] text-center text-xs text-muted-foreground"
            >
              {result.label}
            </motion.p>
          </div>
        )}

        {/* Empty state */}
        {!isRolling && !result && (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-sm text-muted-foreground">
              Configura y ejecuta una habilidad de combate
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
