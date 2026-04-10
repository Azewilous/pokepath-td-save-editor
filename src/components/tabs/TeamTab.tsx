import { For, Show, createResource } from 'solid-js';
import type { SaveData, TargetMode } from '~/types/save';
import { unlockedSlotCount } from '~/types/save';
import type { GameItem } from '~/types/items';
import { toItemEntry } from '~/types/items';
import type { PokedexEntry } from '~/types/pokedex';
import './css/TeamTab.css';

const TARGET_MODES: TargetMode[] = [
  'first',
  'area',
  'invisible',
  'aura',
  'curseable',
  'random',
  'available',
  'notBurned',
  'highArmor',
  'lowHP',
];

const fetchItems = (): Promise<GameItem[]> =>
  fetch(`${import.meta.env.BASE_URL}data/items.json`).then((r) => r.json());

const fetchPokedex = (): Promise<PokedexEntry[]> =>
  fetch(`${import.meta.env.BASE_URL}data/pokedex.json`).then((r) => r.json());

interface Props {
  store: { data: SaveData };
  set: (fn: (d: SaveData) => void) => void;
  active: boolean;
}

export const TeamTab = (props: Props) => {
  const [items] = createResource<GameItem[]>(fetchItems);
  const [pokedex] = createResource<PokedexEntry[]>(fetchPokedex);

  return (
    <div class={`tab-panel${props.active ? ' active' : ''}`}>
      <div class="panel-group">
        <h3 class="group-label">
          Active Team{' '}
          <span class="label-hint">
            ({props.store.data.team.filter((p) => p.specieKey !== '').length} /{' '}
            {unlockedSlotCount(props.store.data.player.stars)} slots)
          </span>
        </h3>
        <div class="pokemon-grid">
          <For each={props.store.data.team}>
            {(pokemon, i) => (
              <div class="pokemon-card">
                <div class="card-slot">#{i() + 1}</div>
                <div class="field">
                  <label>Species</label>
                  <select
                    class="item-select"
                    onChange={(e) =>
                      props.set((d) => {
                        d.team[i()].specieKey = e.currentTarget.value;
                      })
                    }
                  >
                    <option value="" selected={pokemon.specieKey === ''}>
                      — choose species —
                    </option>
                    <For each={pokedex()}>
                      {(entry) => (
                        <option
                          value={entry.name.toLowerCase()}
                          selected={pokemon.specieKey === entry.name.toLowerCase()}
                        >
                          {entry.name}
                        </option>
                      )}
                    </For>
                  </select>
                </div>
                <Show when={pokemon.specieKey !== ''}>
                  <div class="card-fields">
                    <div class="field">
                      <label>Level</label>
                      <input
                        type="number"
                        value={pokemon.lvl}
                        min="1"
                        max="100"
                        onInput={(e) =>
                          props.set((d) => {
                            d.team[i()].lvl = Number(e.currentTarget.value);
                          })
                        }
                      />
                    </div>
                    <div class="field">
                      <label>Target</label>
                      <select
                        onChange={(e) =>
                          props.set((d) => {
                            d.team[i()].targetMode = e.currentTarget.value;
                          })
                        }
                      >
                        <For each={TARGET_MODES}>
                          {(t) => <option selected={t === pokemon.targetMode}>{t}</option>}
                        </For>
                      </select>
                    </div>
                  </div>
                  <div class="card-item">
                    <label>Item</label>
                    <select
                      class="item-select"
                      onChange={(e) =>
                        props.set((d) => {
                          const chosen = items()?.find((it) => it.name === e.currentTarget.value);
                          d.team[i()].item = chosen ? toItemEntry(chosen) : undefined;
                        })
                      }
                    >
                      <option value="" selected={!pokemon.item}>
                        None
                      </option>
                      <For each={items()}>
                        {(it) => (
                          <option value={it.name} selected={pokemon.item?.name[0] === it.name}>
                            {it.name}
                          </option>
                        )}
                      </For>
                    </select>
                  </div>
                  <div class="card-toggles">
                    <label class="toggle-label">
                      <input
                        type="checkbox"
                        checked={pokemon.isShiny}
                        onChange={(e) =>
                          props.set((d) => {
                            d.team[i()].isShiny = e.currentTarget.checked;
                          })
                        }
                      />
                      <span>Shiny</span>
                    </label>
                    <label class="toggle-label">
                      <input
                        type="checkbox"
                        checked={pokemon.hideShiny}
                        onChange={(e) =>
                          props.set((d) => {
                            d.team[i()].hideShiny = e.currentTarget.checked;
                          })
                        }
                      />
                      <span>Hide</span>
                    </label>
                    <label class="toggle-label">
                      <input
                        type="checkbox"
                        checked={pokemon.isMega}
                        onChange={(e) =>
                          props.set((d) => {
                            d.team[i()].isMega = e.currentTarget.checked;
                          })
                        }
                      />
                      <span>Mega</span>
                    </label>
                    <label class="toggle-label">
                      <input
                        type="checkbox"
                        checked={pokemon.favorite}
                        onChange={(e) =>
                          props.set((d) => {
                            d.team[i()].favorite = e.currentTarget.checked;
                          })
                        }
                      />
                      <span>Fav</span>
                    </label>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
