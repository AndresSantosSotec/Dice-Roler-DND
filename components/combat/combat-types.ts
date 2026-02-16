export type DamageType = "radiant" | "fire" | "ice" | "lightning" | "acid" | "poison" | "slashing" | "piercing" | "bludgeoning" | "force" | "thunder" | "necrotic"

export type CombatAction =
  | "attack"
  | "spell"
  | "divine-smite"
  | "dragon-breath"
  | "fire-bolt"
  | "magic-missile"
  | "sneak-attack"
  | "thunderous-smite"
  | "fireball"
  | "chain-lightning"
  | "tsunami"
  | "whirlwind"
  | "prismatic-spray"
  | "blade-storm"
  | "meteor-swarm"
  | "cone-of-cold"
  | "disintegrate"
  | "hunger-of-hadar"
  | "quivering-palm"

export interface CombatRollResult {
  id: string
  action: CombatAction
  timestamp: number

  // Attack roll
  attackRoll?: number
  attackModifier: number
  attackTotal?: number
  isCritical: boolean
  isMiss: boolean
  rollMode: "normal" | "advantage" | "disadvantage"
  advantageRolls?: [number, number]

  // Damage
  damageRolls: number[]
  damageDice: string        // e.g. "2d8"
  damageTotal: number
  damageType: DamageType
  bonusDamage: number

  // Divine Smite specific
  smiteLevel?: number
  isUndead?: boolean

  // Dragon Breath specific
  element?: DamageType
  savingThrowDC?: number
  targetSavingThrow?: number
  targetSaved?: boolean

  // Quivering Palm specific
  isInstantDeath?: boolean

  label: string
}

export const DAMAGE_TYPE_CONFIG: Record<DamageType, { label: string; color: string; icon: string }> = {
  radiant: { label: "Radiante", color: "#f5c842", icon: "Sun" },
  fire: { label: "Fuego", color: "#ef4444", icon: "Flame" },
  ice: { label: "Hielo", color: "#38bdf8", icon: "Snowflake" },
  lightning: { label: "Rayo", color: "#a78bfa", icon: "Zap" },
  acid: { label: "Acido", color: "#4ade80", icon: "Droplets" },
  poison: { label: "Veneno", color: "#a3e635", icon: "Skull" },
  slashing: { label: "Cortante", color: "#94a3b8", icon: "Sword" },
  piercing: { label: "Perforante", color: "#94a3b8", icon: "Crosshair" },
  bludgeoning: { label: "Contundente", color: "#94a3b8", icon: "Hammer" },
  force: { label: "Fuerza", color: "#8b5cf6", icon: "Star" },
  thunder: { label: "Trueno", color: "#f59e0b", icon: "Volume2" },
  necrotic: { label: "Necrotico", color: "#581c87", icon: "Skull" },
}

export const ELEMENTS: DamageType[] = ["fire", "ice", "lightning", "acid", "poison"]

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollMultiple(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}
