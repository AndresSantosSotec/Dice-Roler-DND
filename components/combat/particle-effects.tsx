
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DamageType } from "./combat-types"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
  dx: number
  dy: number
  initialScale: number
  rotate?: number
}

// Configuration based on user request
const ELEMENT_CONFIG: Record<
  string,
  {
    colors: string[]
    shape: "circle" | "diamond" | "spark" | "cloud" | "drop"
    particleCountMod: number
    spread: number
    gravity: number // Positive goes down, negative goes up (like fire)
    hasTrail?: boolean
  }
> = {
  fire: {
    colors: ["#FF4500", "#FF6347", "#FFD700", "#FF8C00"], // Red-Orange-Yellow
    shape: "circle",
    particleCountMod: 1.5,
    spread: 1.2,
    gravity: -40, // Fire rises
    hasTrail: true,
  },
  ice: {
    colors: ["#00FFFF", "#87CEEB", "#B0E0E6", "#FFFFFF"], // Cyan-Blue-White
    shape: "diamond",
    particleCountMod: 1.2,
    spread: 1.0,
    gravity: 10, // Slight fall
  },
  lightning: {
    colors: ["#0000FF", "#4169E1", "#00BFFF", "#FFFFFF"], // Blue-White
    shape: "spark",
    particleCountMod: 0.8,
    spread: 2.0, // Wide burst
    gravity: 0,
  },
  acid: {
    colors: ["#00FF00", "#7FFF00", "#ADFF2F", "#32CD32"], // Lime-Green
    shape: "drop",
    particleCountMod: 1.0,
    spread: 0.8,
    gravity: 80, // Heavy drips
  },
  poison: {
    colors: ["#9400D3", "#8B008B", "#9932CC", "#BA55D3"], // Purple
    shape: "cloud",
    particleCountMod: 2.0, // Dense cloud
    spread: 0.6,
    gravity: -10, // Slow rise
  },
  radiant: {
    colors: ["#f5c842", "#fef08a", "#fde68a", "#ffffff"],
    shape: "diamond",
    particleCountMod: 1.0,
    spread: 1.5,
    gravity: -20,
  },
  force: {
    colors: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ffffff"],
    shape: "circle",
    particleCountMod: 1.0,
    spread: 1.8,
    gravity: 0,
  },
  thunder: {
    colors: ["#f59e0b", "#fbbf24", "#fcd34d", "#ffffff"],
    shape: "circle",
    particleCountMod: 1.0,
    spread: 2.5, // Shockwave
    gravity: 0,
  },
  necrotic: {
    colors: ["#581c87", "#3b0764", "#000000", "#9333ea"], // Dark Purple/Black
    shape: "cloud", // Smokey
    particleCountMod: 1.5,
    spread: 0.5, // Tight
    gravity: -5, // Slow float
  },
  default: {
    colors: ["#94a3b8", "#cbd5e1", "#e2e8f0", "#ffffff"],
    shape: "circle",
    particleCountMod: 1.0,
    spread: 1.0,
    gravity: 20,
  },
}

function createParticles(element: DamageType | string, count: number): Particle[] {
  const config =
    ELEMENT_CONFIG[element as string] ?? ELEMENT_CONFIG.default
  const totalParticles = Math.floor(count * config.particleCountMod)

  return Array.from({ length: totalParticles }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const velocity = Math.random() * 80 * config.spread

    return {
      id: i,
      x: 50 + (Math.random() - 0.5) * 10, // Start near center
      y: 50 + (Math.random() - 0.5) * 10,
      size: 4 + Math.random() * 8,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      duration: 0.6 + Math.random() * 0.8,
      delay: Math.random() * 0.2,
      dx: Math.cos(angle) * velocity,
      dy: Math.sin(angle) * velocity + config.gravity, // Apply gravity/rise
      initialScale: Math.random() * 0.5 + 0.5,
      rotate: Math.random() * 360,
    }
  })
}

export function ParticleExplosion({
  element,
  active,
  count = 30,
}: {
  element: DamageType | string
  active: boolean
  count?: number
}) {
  const [particles, setParticles] = useState<Particle[]>([])

  // Also recreate particles if element changes while active
  useEffect(() => {
    if (active) {
      setParticles(createParticles(element, count))
    } else {
      setParticles([])
    }
  }, [active, element, count])

  const config = ELEMENT_CONFIG[element as string] ?? ELEMENT_CONFIG.default

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              scale: 0,
              opacity: 1,
              rotate: p.rotate,
            }}
            animate={{
              left: `${p.x + p.dx}%`,
              top: `${p.y + p.dy}%`,
              scale: [0, p.initialScale * 1.5, 0],
              opacity: [1, 0.8, 0],
              rotate: p.rotate ? p.rotate + 180 : 0,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              // Different shapes
              borderRadius:
                config.shape === "circle" || config.shape === "cloud"
                  ? "50%"
                  : config.shape === "drop"
                    ? "0% 50% 50% 50%" // Teardrop
                    : "2px", // Diamond/Spark
              transform: config.shape === "drop" ? "rotate(45deg)" : undefined,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              filter: config.shape === "cloud" ? "blur(4px)" : undefined,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export function GroundSigil({ active, color }: { active: boolean; color: string }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.6, 0.3], scale: [0.3, 1.1, 1] }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2"
        >
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
            <ellipse cx="60" cy="20" rx="55" ry="16" stroke={color} strokeWidth="1.5" opacity="0.5" />
            <ellipse cx="60" cy="20" rx="38" ry="11" stroke={color} strokeWidth="1" opacity="0.4" />
            <line x1="60" y1="4" x2="60" y2="36" stroke={color} strokeWidth="0.8" opacity="0.3" />
            <line x1="10" y1="20" x2="110" y2="20" stroke={color} strokeWidth="0.8" opacity="0.3" />
            <line x1="22" y1="8" x2="98" y2="32" stroke={color} strokeWidth="0.5" opacity="0.2" />
            <line x1="22" y1="32" x2="98" y2="8" stroke={color} strokeWidth="0.5" opacity="0.2" />
            <circle cx="22" cy="20" r="3" fill={color} opacity="0.3" />
            <circle cx="98" cy="20" r="3" fill={color} opacity="0.3" />
            <circle cx="60" cy="6" r="2.5" fill={color} opacity="0.3" />
            <circle cx="60" cy="34" r="2.5" fill={color} opacity="0.3" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function FloatingDamageNumber({
  value,
  color,
  delay = 0,
  label,
}: {
  value: number | string
  color: string
  delay?: number
  label?: string
}) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scale: 0.5 }}
      animate={{ y: -40, opacity: [0, 1, 1, 0], scale: [0.5, 1.3, 1.1, 0.9] }}
      transition={{ duration: 1.6, delay, ease: "easeOut" }}
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap"
    >
      <span
        className="font-mono text-3xl font-black drop-shadow-lg"
        style={{ color, textShadow: `0 0 20px ${color}, 0 0 40px ${color}40` }}
      >
        {label && <span className="mr-1 text-sm font-bold uppercase tracking-wider">{label} </span>}
        {value}
      </span>
    </motion.div>
  )
}
