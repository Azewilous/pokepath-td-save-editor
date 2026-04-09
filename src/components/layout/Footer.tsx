import './css/Footer.css';

export const Footer = () => (
  <footer class="footer">
    <p class="footer-text">
      This is an unofficial save editor. If you enjoy Pokepath TD, please support the original
      creator.
    </p>
    <div class="footer-group">
      <a class="footer-link" href="https://pokepath.gg/" target="_blank" rel="noopener noreferrer">
        pokepath.gg
      </a>
      <p class="footer-copy">
        &copy; {new Date().getFullYear()} by{' '}
        <a
          class="footer-link"
          href="https://github.com/Azewilous"
          target="_blank"
          rel="noopener noreferrer"
        >
          Azewilous
        </a>
      </p>
    </div>
  </footer>
);
