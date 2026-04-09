import { For } from 'solid-js';
import { SUPPORTED_VERSIONS } from '~/types/versions';
import './css/Navbar.css';

export const Navbar = () => (
  <nav class="navbar">
    <span class="navbar-brand">
      <span class="pokeball-mini" aria-hidden="true" />
      Pokepath TD Editor
    </span>
    <div class="navbar-end">
      <label class="version-label">Game Version</label>
      <select class="version-select">
        <For each={SUPPORTED_VERSIONS}>{(v) => <option value={v}>v{v}</option>}</For>
      </select>
    </div>
  </nav>
);
