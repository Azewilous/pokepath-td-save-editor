import { createSignal } from 'solid-js';
import type { SaveData } from '~/types/save';
import { Toast } from '~/components/shared/Toast';
import './css/DataInterface.css';

interface Props {
  onParse: (data: SaveData) => void;
}

export const DataInterface = (props: Props) => {
  const [rawInput, setRawInput] = createSignal('');
  const [toast, setToast] = createSignal<string | null>(null);
  let toastTimer: ReturnType<typeof setTimeout>;

  const showToast = (msg: string) => {
    clearTimeout(toastTimer);
    setToast(null);
    // Defer so SolidJS re-creates the element, restarting the CSS animation
    requestAnimationFrame(() => {
      setToast(msg);
      toastTimer = setTimeout(() => setToast(null), 3000);
    });
  };

  const handleFileLoad = (e: Event) => {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRawInput(reader.result as string);
    reader.readAsText(file);
  };

  const handleParse = () => {
    if (!rawInput().trim()) {
      showToast('No save data detected — paste base64 or load a file');
      return;
    }
    try {
      // Strip all whitespace so embedded newlines don't break atob
      const b64 = rawInput().replace(/\s+/g, '');
      const binary = atob(b64);

      let parsed: SaveData;
      try {
        // Try UTF-8 decode first
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        parsed = JSON.parse(new TextDecoder().decode(bytes)) as SaveData;
      } catch {
        // Fall back to treating the binary string as plain ASCII JSON
        parsed = JSON.parse(binary) as SaveData;
      }

      props.onParse(parsed);
      requestAnimationFrame(() => {
        document.getElementById('save-editor')?.scrollIntoView({ behavior: 'smooth' });
      });
    } catch (err) {
      showToast(`Parse failed: ${String(err)}`);
    }
  };

  return (
    <section id="editor" class="editor-section">
      <h2>Data Interface</h2>
      <p>Input base64 save payload to begin decryption sequence</p>
      <textarea
        class="save-input"
        rows={8}
        placeholder="// Paste base64-encoded save data..."
        value={rawInput()}
        onInput={(e) => setRawInput(e.currentTarget.value)}
      />
      <div class="editor-actions">
        <label class="upload-btn">
          Load File
          <input type="file" accept=".txt" hidden onChange={handleFileLoad} />
        </label>
        <button class="cta-btn" onClick={handleParse}>
          Parse Data
        </button>
      </div>
      <Toast message={toast()} />
    </section>
  );
};
