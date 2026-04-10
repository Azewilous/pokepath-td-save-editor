import { Show, createSignal } from 'solid-js';
import { createStore, produce, reconcile } from 'solid-js/store';
import type { SaveData } from '~/types/save';
import { Navbar } from '~/components/layout/Navbar';
import { Hero } from '~/components/layout/Hero';
import { Footer } from '~/components/layout/Footer';
import { DataInterface } from '~/components/editor/DataInterface';
import { SaveEditor } from '~/components/editor/SaveEditor';
import { ExportModal } from '~/components/shared/ExportModal';

const encodeBase64Save = (data: SaveData): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
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
