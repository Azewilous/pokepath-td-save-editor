/** A single entry from pokedex.json */
export interface PokedexEntry {
  id: string;
  name: string;
  ability: string;
  acquisition: string;
  critChance: string;
  range: string;
  attackSpeed: string;
  damage: string;
  dps: string;
  /** Terrain types this pokemon can be placed on: 1=field 2=grass 3=water 4=air/mountain */
  tiles: number[];
  /** Attack type — 'area' and 'aura' lock the target mode in-game */
  attackType: 'single' | 'area' | 'aura';
}
