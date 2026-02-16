
export type CharacterClass =
    | "Barbarian"
    | "Bard"
    | "Cleric"
    | "Druid"
    | "Fighter"
    | "Monk"
    | "Paladin"
    | "Ranger"
    | "Rogue"
    | "Sorcerer"
    | "Warlock"
    | "Wizard"

export interface Attributes {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
}

export interface SpellSlots {
    level1: { current: number; max: number }
    level2: { current: number; max: number }
    level3: { current: number; max: number }
    level4: { current: number; max: number }
    level5: { current: number; max: number }
}

export interface Character {
    id: string
    name: string
    class: CharacterClass
    level: number
    maxHp: number
    currentHp: number
    attributes: Attributes
    spellSlots: SpellSlots
    proficiencyBonus: number
    createdAt: number
}
