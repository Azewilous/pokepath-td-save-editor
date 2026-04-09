import { createSignal, For } from 'solid-js';
import type { SaveData } from '~/types/save';
import './css/SaveEditor.css';
import { PlayerTab } from '~/components/tabs/PlayerTab';
import { TeamTab } from '~/components/tabs/TeamTab';
import { BoxTab } from '~/components/tabs/BoxTab';
import { AchievementsTab } from '~/components/tabs/AchievementsTab';
import { StatsTab } from '~/components/tabs/StatsTab';
import { InventoryTab } from '~/components/tabs/InventoryTab';

const TABS = ['Player', 'Inventory', 'Team', 'Box', 'Achievements', 'Stats'] as const;
type Tab = (typeof TABS)[number];

interface Props {
  store: { data: SaveData };
  set: (fn: (d: SaveData) => void) => void;
  onExport: () => void;
}

export const SaveEditor = (props: Props) => {
  const [activeTab, setActiveTab] = createSignal<Tab>('Player');

  return (
    <section id="save-editor" class="save-editor">
      <div class="editor-toolbar">
        <span class="editor-status">
          Save loaded · <span class="status-val">{props.store.data.team.length}</span> team ·{' '}
          <span class="status-val">{props.store.data.box.length}</span> box
        </span>
        <button class="cta-btn" onClick={props.onExport}>
          Export Save
        </button>
      </div>

      <div class="tab-bar">
        <For each={TABS}>
          {(tab) => (
            <button
              class={`tab${activeTab() === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          )}
        </For>
      </div>

      <PlayerTab store={props.store} set={props.set} active={activeTab() === 'Player'} />
      <InventoryTab store={props.store} set={props.set} active={activeTab() === 'Inventory'} />
      <TeamTab store={props.store} set={props.set} active={activeTab() === 'Team'} />
      <BoxTab store={props.store} set={props.set} active={activeTab() === 'Box'} />
      <AchievementsTab
        store={props.store}
        set={props.set}
        active={activeTab() === 'Achievements'}
      />
      <StatsTab store={props.store} set={props.set} active={activeTab() === 'Stats'} />
    </section>
  );
};
