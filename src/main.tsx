import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getAssetUrl } from './utils/assetPath';
import { registerServiceWorker } from './utils/swUpdateManager';
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

// Service Worker 등록. 새 버전은 배너에서 사용자가 적용을 선택할 때만 반영함
registerServiceWorker(getAssetUrl('sw.js'));
