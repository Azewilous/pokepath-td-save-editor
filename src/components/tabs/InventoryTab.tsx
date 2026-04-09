import { For, Show, createMemo, createResource } from 'solid-js';
import type { SaveData } from '~/types/save';
import type { GameItem } from '~/types/items';
import { toItemId, toItemEntry } from '~/types/items';
import './css/InventoryTab.css';

const COLS = 12;
const ROWS = 8;
const TOTAL = COLS * ROWS;

const fetchItems = (): Promise<GameItem[]> => fetch('/data/items.json').then((r) => r.json());

interface Props {
  store: { data: SaveData };
  set: (fn: (d: SaveData) => void) => void;
  active: boolean;
}

export const InventoryTab = (props: Props) => {
  const [gameItems] = createResource<GameItem[]>(fetchItems);

  // id → imgSrc lookup from items.json
  const spriteLookup = createMemo(() => {
    const map = new Map<string, string>();
    gameItems()?.forEach((gi) => map.set(toItemId(gi.name), gi.imgSrc));
    return map;
  });

  // Fixed 96-slot array — filled from player.items, null for empty slots
  const slots = createMemo(() =>
    Array.from({ length: TOTAL }, (_, i) => props.store.data.player.items[i] ?? null)
  );

  // Find which Pokémon (team or box) is holding an item by matching item id
  const equippedBy = (itemId: string): string | null => {
    const carrier =
      props.store.data.team.find((p) => p.item?.id === itemId) ??
      props.store.data.box.find((p) => p.item?.id === itemId);
    return carrier?.specieKey ?? null;
  };

  const removeItem = (index: number) =>
    props.set((d) => {
      d.player.items.splice(index, 1);
    });

  const addItem = (e: Event) => {
    const sel = e.currentTarget as HTMLSelectElement;
    const chosen = gameItems()?.find((gi) => gi.name === sel.value);
    if (!chosen) return;
    props.set((d) => {
      d.player.items.push(toItemEntry(chosen));
    });
    sel.value = '';
  };

  return (
    <div class={`tab-panel${props.active ? ' active' : ''}`}>
      <div class="panel-group">
        <h3 class="group-label">
          Inventory{' '}
          <span class="label-hint">
            (<span class="status-val">{props.store.data.player.items.length}</span> / {TOTAL} slots)
          </span>
        </h3>

        <div class="inventory-grid">
          <For each={slots()}>
            {(item, i) => (
              <Show when={item} fallback={<div class="inv-slot empty" />}>
                {(it) => (
                  <div class="inv-slot filled">
                    <Show
                      when={spriteLookup().get(it().id)}
                      fallback={<div class="inv-ball" aria-hidden="true" />}
                    >
                      {(src) => (
                        <img class="inv-sprite" src={src()} alt={it().name[0]} loading="lazy" />
                      )}
                    </Show>
                    <span class="inv-name">{it().name[0]}</span>
                    <Show when={equippedBy(it().id)}>
                      {(name) => <span class="inv-equipped">{name()}</span>}
                    </Show>
                    <button class="inv-remove" title="Remove item" onClick={() => removeItem(i())}>
                      ×
                    </button>
                  </div>
                )} 
              </Show>
            )}
          </For>
        </div>

        <div class="inv-add-row">
          <select
            class="item-select"
            onChange={addItem}
            disabled={props.store.data.player.items.length >= TOTAL}
          >
            <option value="">+ Add item…</option>
            <For each={gameItems()}>{(gi) => <option value={gi.name}>{gi.name}</option>}</For>
          </select>
        </div>
      </div>
    </div>
  );
};
