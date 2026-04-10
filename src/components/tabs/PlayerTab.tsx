import { For, Index } from 'solid-js';
import type { SaveData } from '~/types/save';
import { SLOT_THRESHOLDS, unlockedSlotCount, emptyPokemon } from '~/types/save';
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
          <label>Stars <span class="label-hint">(from records)</span></label>
          <input
            type="number"
            value={props.store.data.player.stars}
            readOnly
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
        <div class="slot-unlock-row">
          <For each={SLOT_THRESHOLDS}>
            {({ slot, stars }) => {
              const unlocked = () => props.store.data.player.stars >= stars;
              return (
                <div class={`slot-badge${unlocked() ? ' unlocked' : ''}`}>
                  <span class="slot-badge-label">Slot {slot}</span>
                  <span class="slot-badge-status">{unlocked() ? 'Unlocked' : `${stars} ★`}</span>
                </div>
              );
            }}
          </For>
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
          Records <span class="label-hint">(stars per route — sets total stars)</span>
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
                  max="100"
                  onInput={(e) =>
                    props.set((d) => {
                      d.player.records[i] = Number(e.currentTarget.value);
                      d.player.stars = d.player.records.reduce((sum, r) => sum + r, 0);
                      const count = unlockedSlotCount(d.player.stars);
                      while (d.team.length < count) d.team.push(emptyPokemon());
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
