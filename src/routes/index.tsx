import { Show, createSignal } from 'solid-js';
import { createStore, produce, reconcile } from 'solid-js/store';
import type { SaveData } from '~/types/save';
import { Navbar } from '~/components/layout/Navbar';
import { Hero } from '~/components/layout/Hero';
import { Footer } from '~/components/layout/Footer';
import { DataInterface } from '~/components/editor/DataInterface';
import { SaveEditor } from '~/components/editor/SaveEditor';
import { ExportModal } from '~/components/shared/ExportModal';

/** Coerce a value to a safe integer, clamped to [min, max]. Falls back to `fallback`. */
const clampInt = (v: unknown, min: number, max: number, fallback = min): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.trunc(n))) : fallback;
};

/** Sanitize a SaveData before export to prevent NaN/negative/out-of-range values
 *  from reaching the game.  Operates on a shallow-cloned copy — does not mutate
 *  the editor store. */
const sanitizeSave = (data: SaveData): SaveData => {
  const p = { ...data.player };

  p.gold       = clampInt(p.gold,       0,  999_999_999);
  p.extraGold  = clampInt(p.extraGold,  0,  999_999_999);
  p.ribbons    = clampInt(p.ribbons,    0,  999_999_999);
  p.portrait   = clampInt(p.portrait,   0,  999);
  p.teamSlots  = clampInt(p.teamSlots,  6,  10);

  p.health  = p.health.map((v) => clampInt(v, 0, 14));
  p.records = p.records.map((v) => clampInt(v, 0, 100));

  // Re-derive stars and teamSlots from records so they're always in sync.
  p.stars     = p.records.reduce((s, r) => s + r, 0);
  p.teamSlots = 6 + [40, 160, 320, 540].filter((t) => p.stars >= t).length;

  const st = { ...p.stats };
  const statKeys: (keyof typeof st)[] = [
    'pokemonOwned', 'highestPokemonLevel', 'totalPokemonLevel',
    'totalGold', 'wavesCompleted', 'highestHit', 'defeatedEnemies',
    'appliedStuns', 'appliedSlows', 'appliedBurns', 'appliedPoisons',
    'appliedCurses', 'resets', 'timePlayed',
  ];
  for (const k of statKeys) (st as unknown as Record<string, number>)[k] = clampInt((st as unknown as Record<string, number>)[k], 0, 999_999_999);
  p.stats = st;

  const sanitizePokemon = (arr: SaveData['team']) =>
    arr
      .filter((pk) => pk.specieKey !== '')
      .map((pk) => ({ ...pk, lvl: clampInt(pk.lvl, 1, 100) }));

  return { ...data, player: p, team: sanitizePokemon(data.team), box: sanitizePokemon(data.box) };
};

const encodeBase64Save = (data: SaveData): string => {
  // Sanitize before serialising: clamps numerics, strips empty-species placeholders.
  // (Empty specieKey crashes the game — Pokemon.fromOriginalData looks up pokemonData['']
  //  → undefined → specie.tiles throws.)
  const clean = sanitizeSave(data);
  const bytes = new TextEncoder().encode(JSON.stringify(clean));
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export default () => {
  const [store, setStore] = createStore<{ data: SaveData | null }>({ data: null });
  const [exportPayload, setExportPayload] = createSignal<string | null>(null);

  const set = (fn: (d: SaveData) => void) =>
    setStore(
      produce((s) => {
        if (s.data) fn(s.data);
      })
    );

  const handleParse = (parsed: SaveData) => setStore('data', reconcile(parsed));

  const handleExport = () => {
    if (!store.data) return;
    setExportPayload(encodeBase64Save(store.data));
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DataInterface onParse={handleParse} />
        <Show when={store.data !== null}>
          <SaveEditor store={store as { data: SaveData }} set={set} onExport={handleExport} />
        </Show>
        <Show when={exportPayload() !== null}>
          <ExportModal payload={exportPayload()!} onClose={() => setExportPayload(null)} />
        </Show>
      </main>
      <Footer />
    </>
  );
};
