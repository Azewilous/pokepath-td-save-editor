import { For, Index } from 'solid-js';
import type { SaveData } from '~/types/save';
import './css/PlayerTab.css';

interface Props {
  store: { data: SaveData };
  set: (fn: (d: SaveData) => void) => void;
  active: boolean;
}

export const PlayerTab = (props: Props) => (
  <div class={`tab-panel${props.active ? ' active' : ''}`}>
    <div class="panel-group">
      <h3 class="group-label">Profile</h3>
      <div class="fields-row">
        <div class="field">
          <label>Name</label>
          <input
            type="text"
            value={props.store.data.player.name}
            onInput={(e) =>
              props.set((d) => {
                d.player.name = e.currentTarget.value;
              })
            }
          />
        </div>
        <div class="field">
          <label>Portrait</label>
          <input
            type="number"
            value={props.store.data.player.portrait}
            onInput={(e) =>
              props.set((d) => {
                d.player.portrait = Number(e.currentTarget.value);
              })
            }
          />
        </div>
        <div class="field">
          <label>Gold</label>
          <input
            type="number"
            value={props.store.data.player.gold}
            onInput={(e) =>
              props.set((d) => {
                d.player.gold = Number(e.currentTarget.value);
              })
            }
          />
        </div>
        <div class="field">
          <label>Stars</label>
          <input
            type="number"
            value={props.store.data.player.stars}
            onInput={(e) =>
              props.set((d) => {
                d.player.stars = Number(e.currentTarget.value);
              })
            }
          />
        </div>
        <div class="field">
          <label>Team Slots</label>
          <input
            type="number"
            value={props.store.data.player.teamSlots}
            min="6"
            max="10"
            onInput={(e) =>
              props.set((d) => {
                d.player.teamSlots = Number(e.currentTarget.value);
              })
            }
          />
        </div>
        <div class="field">
          <label>Extra Gold</label>
          <input
            type="number"
            value={props.store.data.player.extraGold}
            onInput={(e) =>
              props.set((d) => {
                d.player.extraGold = Number(e.currentTarget.value);
              })
            }
          />
        </div>
        <div class="field">
          <label>Ribbons</label>
          <input
            type="number"
            value={props.store.data.player.ribbons}
            onInput={(e) =>
              props.set((d) => {
                d.player.ribbons = Number(e.currentTarget.value);
              })
            }
          />
        </div>
      </div>
    </div>

    <div class="panel-group two-col">
      <div>
        <h3 class="group-label">
          Health <span class="label-hint">(per route)</span>
        </h3>
        <div class="index-grid">
          <Index each={props.store.data.player.health}>
            {(val, i) => (
              <div class="index-field">
                <label>
                  R{Math.floor(i / 3) + 1}-{(i % 3) + 1}
                </label>
                <input
                  type="number"
                  value={val()}
                  min="0"
                  max="14"
                  onInput={(e) =>
                    props.set((d) => {
                      d.player.health[i] = Number(e.currentTarget.value);
                    })
                  }
                />
              </div>
            )}
          </Index>
        </div>
      </div>
      <div>
        <h3 class="group-label">
          Records <span class="label-hint">(highest wave per route)</span>
        </h3>
        <div class="index-grid">
          <Index each={props.store.data.player.records}>
            {(val, i) => (
              <div class="index-field">
                <label>
                  R{Math.floor(i / 3) + 1}-{(i % 3) + 1}
                </label>
                <input
                  type="number"
                  value={val()}
                  min="0"
                  onInput={(e) =>
                    props.set((d) => {
                      d.player.records[i] = Number(e.currentTarget.value);
                    })
                  }
                />
              </div>
            )}
          </Index>
        </div>
      </div>
    </div>

    <div class="panel-group">
      <h3 class="group-label">Secrets</h3>
      <div class="toggle-row">
        <For each={Object.keys(props.store.data.player.secrets)}>
          {(key) => (
            <label class="toggle-label">
              <input
                type="checkbox"
                checked={props.store.data.player.secrets[key]}
                onChange={(e) =>
                  props.set((d) => {
                    d.player.secrets[key] = e.currentTarget.checked;
                  })
                }
              />
              <span>{key}</span>
            </label>
          )}
        </For>
      </div>
    </div>

    <div class="panel-group">
      <h3 class="group-label">Items</h3>
      <div class="item-grid">
        <For each={props.store.data.player.items}>
          {(item) => (
            <div class="item-card">
              <div class="item-name">{item.name[0]}</div>
              <div class="item-meta">Price: {item.price.toLocaleString()}</div>
              <div class="item-meta muted">
                {item.equipedBy != null ? `Equipped by slot ${item.equipedBy}` : 'Unequipped'}
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  </div>
);
