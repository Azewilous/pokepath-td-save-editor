import type { SaveData } from '~/types/save';
import './css/AchievementsTab.css';

interface Props {
  store: { data: SaveData };
  set: (fn: (d: SaveData) => void) => void;
  active: boolean;
}

export const AchievementsTab = (props: Props) => (
  <div class={`tab-panel${props.active ? ' active' : ''}`}>
    <div class="panel-group achievements-coming-soon">
      <p class="coming-soon-title">Coming Soon</p>
      <p class="coming-soon-sub">Achievement editing is being worked.</p>
    </div>
  </div>
);
