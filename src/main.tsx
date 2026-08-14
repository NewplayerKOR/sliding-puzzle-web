import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getAssetUrl } from './utils/assetPath';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for offline PWA capabilities
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(getAssetUrl('sw.js')).catch((err) => {
      console.log('[SW] Registration failed:', err);
    });
  });
}

