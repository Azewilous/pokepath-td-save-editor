import type { SaveData } from "~/types/save";

export const mockSaveData: SaveData = {
  new: false,
  player: {
    update: 1,
    name: "TestPlayer",
    portrait: 1,
    gold: 5000,
    health: [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
    records: [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ribbons: 3,
    stars: 10,
    teamSlots: 6,
    extraGold: 0,
    achievements: [
      { description: ["First catch"], status: true, image: "catch.png" },
      { description: ["Win 10 waves"], status: false, image: "waves.png" },
    ],
    achievementProgress: {
      delibirdCount: 0,
      evolutionCount: 0,
      heartRestore: 0,
      stolenGold: 0,
      count: 0,
    },
    stats: {
      pokemonOwned: 5,
      highestPokemonLevel: 50,
      totalPokemonLevel: 200,
      totalGold: 99999,
      wavesCompleted: 30,
      highestHit: 1200,
      defeatedEnemies: 500,
      defeatedSpecies: ["pikachu", "charmander"],
      appliedStuns: 10,
      appliedSlows: 5,
      appliedBurns: 3,
      appliedPoisons: 2,
      appliedCurses: 1,
      resets: 0,
      timePlayed: 120,
      maxGoldPerWave: [500, "R1-1 W20"],
      maxGoldPerTime: [100, "R1-1 W20"],
    },
    challenges: {
      lvlCap: {},
      slotLimit: {},
      toughEnemies: {},
      draft: {},
      noItems: {},
    },
    sortedBox: 0,
    fossilInTeam: 0,
    megaInTeam: false,
    items: [
      {
        id: "lightClay",
        name: ["Light Clay"],
        sprite: "lightClay.png",
        price: 300,
        description: ["Extends screen duration"],
        restriction: {},
      },
      {
        id: "choiceBand",
        name: ["Choice Band"],
        sprite: "choiceBand.png",
        price: 500,
        description: ["Boosts Attack"],
        restriction: {},
      },
    ],
    secrets: { darkMode: false, speedrun: true },
    redeem: { playerSecret: "abc123", usedRewards: [] },
    rewards: {},
  },
  team: [
    {
      specieKey: "pikachu",
      lvl: 50,
      targetMode: "first",
      favorite: true,
      isShiny: false,
      hideShiny: false,
      isMega: false,
    },
    {
      specieKey: "charmander",
      lvl: 30,
      targetMode: "area",
      favorite: false,
      isShiny: true,
      hideShiny: false,
      isMega: false,
      item: {
        id: "lightClay",
        name: ["Light Clay"],
        sprite: "lightClay.png",
        price: 300,
        description: ["Extends screen duration"],
        restriction: {},
      },
    },
  ],
  box: [
    {
      specieKey: "bulbasaur",
      lvl: 25,
      targetMode: "first",
      favorite: false,
      isShiny: false,
      hideShiny: false,
      isMega: false,
    },
  ],
};

/** Encode a SaveData to base64 the same way the app does */
export const encodeSaveData = (data: SaveData): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

/** Decode a base64 save string back to SaveData */
export const decodeSaveData = (b64: string): SaveData => {
  const binary = atob(b64.replace(/\s+/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as SaveData;
};

