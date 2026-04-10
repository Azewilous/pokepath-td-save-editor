import { createSignal } from 'solid-js';
import './css/ExportModal.css';

interface Props {
  payload: string;
  onClose: () => void;
}

export const ExportModal = (props: Props) => {
  const [copied, setCopied] = createSignal(false);

  const handleDownload = () => {
    const url = URL.createObjectURL(new Blob([props.payload], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `save-${Date.now()}.txt`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    props.onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(props.payload).then(() => {
      setCopied(true);
      setTimeout(props.onClose, 900);
    });
  };

  return (
    <div class="modal-backdrop" onClick={(e) => e.target === e.currentTarget && props.onClose()}>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 class="modal-title" id="modal-title">Export Ready</h2>
        <div class="modal-warnings">
          <p class="modal-warning">
            <strong>Backup first.</strong> Save your original data before importing.
          </p>
          <p class="modal-warning">
            <strong>Game won't load?</strong> Reload the browser tab and re-paste the save.
          </p>
        </div>
        <div class="modal-actions">
          <button class="cta-btn" onClick={handleDownload}>
            Download
          </button>
          <button class="cta-btn" onClick={handleCopy}>
            {copied() ? 'Copied!' : 'Copy'}
          </button>
          <button class="modal-cancel" onClick={props.onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
