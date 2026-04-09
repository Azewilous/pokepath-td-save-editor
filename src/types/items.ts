import type { ItemEntry } from '~/types/save';

/** Shape of each entry in public/data/items.json */
export interface GameItem {
  name: string;
  effect: string;
  price: number;
  imgSrc: string;
}

/** Derive a camelCase id from an item name (e.g. "Light Clay" → "lightClay", "Shield Breaker Bullet" -> "shieldBreakerBullet", "X-Attack" → "xAttack") */
export const toItemId = (name: string): string => {
  const split = name.split(/[\s-]+/);
  let result = split[0].toLocaleLowerCase();
  for (let i = 1; i < split.length; i++) {
    result += split[i].charAt(0).toUpperCase() + split[i].slice(1);
  }
  return result;
};

/** Convert a GameItem (from items.json) into the ItemEntry shape the save format expects */
export const toItemEntry = (item: GameItem): ItemEntry => ({
  id: toItemId(item.name),
  name: [item.name],
  sprite: item.imgSrc,
  price: item.price,
  description: [item.effect],
  restriction: {},
});
