import { For } from 'solid-js';
import type { SaveData } from '~/types/save';
import './css/StatsTab.css';

const STAT_FIELDS = [
  ['Pokémon Owned', 'pokemonOwned'],
  ['Highest Pokémon Lvl', 'highestPokemonLevel'],
  ['Total Pokémon Lvls', 'totalPokemonLevel'],
  ['Total Gold Earned', 'totalGold'],
  ['Waves Completed', 'wavesCompleted'],
  ['Highest Hit', 'highestHit'],
  ['Defeated Enemies', 'defeatedEnemies'],
  ['Stuns Applied', 'appliedStuns'],
  ['Slows Applied', 'appliedSlows'],
  ['Burns Applied', 'appliedBurns'],
  ['Poisons Applied', 'appliedPoisons'],
  ['Curses Applied', 'appliedCurses'],
  ['Resets', 'resets'],
  ['Time Played (min)', 'timePlayed'],
] as const;

interface Props {
  store: { data: SaveData };
  set: (fn: (d: SaveData) => void) => void;
  active: boolean;
}

export const StatsTab = (props: Props) => (
  <div class={`tab-panel${props.active ? ' active' : ''}`}>
    <div class="panel-group">
      <h3 class="group-label">Player Stats</h3>
      <div class="stats-grid">
        <For each={STAT_FIELDS}>
          {([label, key]) => (
            <div class="stat-row">
              <span class="stat-label">{label}</span>
              <input
                class="stat-input"
                type="number"
                value={props.store.data.player.stats[key]}
                onInput={(e) =>
                  props.set((d) => {
                    (d.player.stats as unknown as Record<string, number>)[key] = Number(
                      e.currentTarget.value
                    );
                  })
                }
              />
            </div>
          )}
        </For>
        <div class="stat-row">
          <span class="stat-label">Best Gold/Wave</span>
          <input
            class="stat-input"
            type="text"
            readOnly
            value={`${props.store.data.player.stats.maxGoldPerWave[0].toLocaleString()} (${props.store.data.player.stats.maxGoldPerWave[1]})`}
          />
        </div>
        <div class="stat-row">
          <span class="stat-label">Best Gold/Time</span>
          <input
            class="stat-input"
            type="text"
            readOnly
            value={`${props.store.data.player.stats.maxGoldPerTime[0].toLocaleString()} (${props.store.data.player.stats.maxGoldPerTime[1]})`}
          />
        </div>
      </div>
    </div>
    <div class="panel-group">
      <h3 class="group-label">
        Defeated Species{' '}
        <span class="label-hint">({props.store.data.player.stats.defeatedSpecies.length})</span>
      </h3>
      <div class="species-tags">
        <For each={props.store.data.player.stats.defeatedSpecies}>
          {(s) => <span class="species-tag">{s}</span>}
        </For>
      </div>
    </div>
  </div>
);
