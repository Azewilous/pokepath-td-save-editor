import { Show } from 'solid-js';
import './css/Toast.css';

interface Props {
  message: string | null;
}

export const Toast = (props: Props) => (
  <Show when={props.message}>
    <div class="toast" role="alert">
      {props.message}
    </div>
  </Show>
);
