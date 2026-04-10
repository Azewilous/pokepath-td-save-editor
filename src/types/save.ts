/** Restriction rules on which Pokémon can hold an item */
export interface ItemRestriction {
  /** Allowed Pokémon IDs (whitelist) */
  id?: number[];
  /** Forbidden Pokémon IDs (blacklist) */
  idForbidden?: number[];
}

/** An item in the player's bag or equipped by a Pokémon */
export interface ItemEntry {
  id: string;
  /** Localised name — index 0 is English */
  name: string[];
  sprite: string;
  price: number;
  /** Localised description — index 0 is English */
  description: string[];
  restriction: ItemRestriction;
  /** Box/team slot index this item is currently equipped by, if any */
  equipedBy?: number;
}

/** A single achievement */
export interface Achievement {
  /** Localised description strings — index 0 is English */
  description: string[];
  status: boolean;
  image: string;
}

/** Progress counters used to track achievement milestones */
export interface AchievementProgress {
  delibirdCount: number;
  evolutionCount: number;
  heartRestore: number;
  stolenGold: number;
  count: number;
}

/** Per-run player stats */
export interface PlayerStats {
  pokemonOwned: number;
  highestPokemonLevel: number;
  totalPokemonLevel: number;
  totalGold: number;
  wavesCompleted: number;
  highestHit: number;
  defeatedEnemies: number;
  /** List of enemy species keys that have been defeated at least once */
  defeatedSpecies: string[];
  appliedStuns: number;
  appliedSlows: number;
  appliedBurns: number;
  appliedPoisons: number;
  appliedCurses: number;
  resets: number;
  /** Minutes played */
  timePlayed: number;
  /** [goldAmount, "R{r}-{s} W{wave}"] */
  maxGoldPerWave: [number, string];
  /** [goldPerMinute, "R{r}-{s} W{wave}"] */
  maxGoldPerTime: [number, string];
}

/** Active challenge modifiers */
export interface Challenges {
  lvlCap: Record<string, unknown>;
  slotLimit: Record<string, unknown>;
  toughEnemies: Record<string, unknown>;
  draft: Record<string, unknown>;
  noItems: Record<string, unknown>;
}

/** Redeem / reward codes state */
export interface Redeem {
  playerSecret: string;
  usedRewards: string[];
}

/** The main player object */
export interface Player {
  update: number;
  name: string;
  portrait: number;
  gold: number;
  /**
   * Hearts remaining per route slot.
   * 12 entries: indices 0–2 = R1-1…R1-3, 3–5 = R2-1…R2-3, etc.
   */
  health: number[];
  /**
   * Highest wave reached per route slot.
   * Same layout as health.
   */
  records: number[];
  ribbons: number;
  stars: number;
  teamSlots: number;
  extraGold: number;
  achievements: Achievement[];
  achievementProgress: AchievementProgress;
  stats: PlayerStats;
  challenges: Challenges;
  sortedBox: number;
  fossilInTeam: number;
  megaInTeam: boolean;
  items: ItemEntry[];
  secrets: Record<string, boolean>;
  redeem: Redeem;
  rewards: Record<string, Record<string, unknown>>;
}

/** Target-mode options for a Pokémon on the field */
export type TargetMode =
  | 'first'
  | 'area'
  | 'invisible'
  | 'aura'
  | 'curseable'
  | 'random'
  | 'available'
  | 'notBurned'
  | 'highArmor'
  | 'lowHP';

/** A Pokémon in the team or box */
export interface PokemonEntry {
  specieKey: string;
  lvl: number;
  targetMode: TargetMode | string;
  favorite: boolean;
  /** Held item, absent when no item is equipped */
  item?: ItemEntry;
  isShiny: boolean;
  /** Hide the shiny sprite effect */
  hideShiny: boolean;
  isMega: boolean;
}

/** Star thresholds that unlock extra team slots 7–10 (first 6 are always available) */
export const SLOT_THRESHOLDS: { slot: number; stars: number }[] = [
  { slot: 7, stars: 40 },
  { slot: 8, stars: 160 },
  { slot: 9, stars: 320 },
  { slot: 10, stars: 540 },
];

/** Returns the number of team slots unlocked for a given star count (base 6 + extras) */
export const unlockedSlotCount = (stars: number): number =>
  6 + SLOT_THRESHOLDS.filter((t) => stars >= t.stars).length;

/** A default empty Pokémon entry for newly unlocked team slots */
export const emptyPokemon = (): PokemonEntry => ({
  specieKey: '',
  lvl: 1,
  targetMode: 'first',
  favorite: false,
  isShiny: false,
  hideShiny: false,
  isMega: false,
});

/** Root save-file structure */
export interface SaveData {
  new: boolean;
  player: Player;
  team: PokemonEntry[];
  box: PokemonEntry[];
}
