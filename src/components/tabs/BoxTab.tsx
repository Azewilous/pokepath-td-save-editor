import { For } from 'solid-js';
import type { SaveData } from '~/types/save';
import './css/BoxTab.css';

interface Props {
  store: { data: SaveData };
  set: (fn: (d: SaveData) => void) => void;
  active: boolean;
}

export const BoxTab = (props: Props) => (
  <div class={`tab-panel${props.active ? ' active' : ''}`}>
    <div class="panel-group">
      <h3 class="group-label">
        Box <span class="label-hint">({props.store.data.box.length} Pokémon)</span>
      </h3>
      <div class="pokemon-grid compact">
        <For each={props.store.data.box}>
          {(pokemon, i) => (
            <div class="pokemon-card compact">
              <div class="card-species">{pokemon.specieKey.toUpperCase()}</div>
              <div class="card-fields">
                <div class="field">
                  <label>Lvl</label>
                  <input
                    type="number"
                    value={pokemon.lvl}
                    min="1"
                    max="100"
                    onInput={(e) =>
                      props.set((d) => {
                        d.box[i()].lvl = Number(e.currentTarget.value);
                      })
                    }
                  />
                </div>
              </div>
              <div class="card-toggles">
                <label class="toggle-label">
                  <input
                    type="checkbox"
                    checked={pokemon.isShiny}
                    onChange={(e) =>
                      props.set((d) => {
                        d.box[i()].isShiny = e.currentTarget.checked;
                      })
                    }
                  />
                  <span>Shiny</span>
                </label>
                <label class="toggle-label">
                  <input
                    type="checkbox"
                    checked={pokemon.isMega}
                    onChange={(e) =>
                      props.set((d) => {
                        d.box[i()].isMega = e.currentTarget.checked;
                      })
                    }
                  />
                  <span>Mega</span>
                </label>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  </div>
);
