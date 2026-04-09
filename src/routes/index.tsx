import { Show } from 'solid-js';
import { createStore, produce, reconcile } from 'solid-js/store';
import type { SaveData } from '~/types/save';
import { Navbar } from '~/components/layout/Navbar';
import { Hero } from '~/components/layout/Hero';
import { Footer } from '~/components/layout/Footer';
import { DataInterface } from '~/components/editor/DataInterface';
import { SaveEditor } from '~/components/editor/SaveEditor';

const encodeBase64Save = (data: SaveData): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

const triggerDownload = (content: string, filename: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default () => {
  const [store, setStore] = createStore<{ data: SaveData | null }>({ data: null });

  const set = (fn: (d: SaveData) => void) =>
    setStore(
      produce((s) => {
        if (s.data) fn(s.data);
      })
    );

  const handleParse = (parsed: SaveData) => setStore('data', reconcile(parsed));

  const handleExport = () => {
    if (!store.data) return;
    triggerDownload(encodeBase64Save(store.data), `save-${Date.now()}.txt`);
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
      </main>
      <Footer />
    </>
  );
};
