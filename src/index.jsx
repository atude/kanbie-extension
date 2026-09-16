import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Global patch for Chrome Extension popup resize bug
(function blockFakeChromePopupResizes() {
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  window.addEventListener(
    'resize',
    (e) => {
      // Check if the viewport dimensions actually changed
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      if (currentWidth === lastWidth && currentHeight === lastHeight) {
        // It's a spurious Chrome popup reflow event, kill it instantly
        e.stopImmediatePropagation();
        e.stopPropagation();
      } else {
        lastWidth = currentWidth;
        lastHeight = currentHeight;
      }
    },
    true
  );
})();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);