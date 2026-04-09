import { For } from 'solid-js';
import type { SaveData } from '~/types/save';
import './css/AchievementsTab.css';

interface Props {
  store: { data: SaveData };
  set: (fn: (d: SaveData) => void) => void;
  active: boolean;
}

export const AchievementsTab = (props: Props) => (
  <div class={`tab-panel${props.active ? ' active' : ''}`}>
    <div class="panel-group">
      <h3 class="group-label">
        Achievements{' '}
        <span class="label-hint">
          ({props.store.data.player.achievements.filter((a) => a.status).length} /{' '}
          {props.store.data.player.achievements.length} unlocked)
        </span>
      </h3>
      <div class="achievement-grid">
        <For each={props.store.data.player.achievements}>
          {(ach, i) => (
            <div class={`achievement-card${ach.status ? ' unlocked' : ''}`}>
              <div class="achievement-badge" aria-hidden="true" />
              <p class="achievement-desc">{ach.description[0]}</p>
              <label class="toggle-label centered">
                <input
                  type="checkbox"
                  checked={ach.status}
                  onChange={(e) =>
                    props.set((d) => {
                      d.player.achievements[i()].status = e.currentTarget.checked;
                    })
                  }
                />
                <span>{ach.status ? 'Unlocked' : 'Locked'}</span>
              </label>
            </div>
          )}
        </For>
      </div>
    </div>
  </div>
);
