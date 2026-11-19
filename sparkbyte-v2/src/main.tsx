import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@wokwi/elements';
import { useWorkbenchStore } from './store/useWorkbenchStore';

// Expose store globally for headless testing & telemetry verification
if (typeof window !== 'undefined') {
  (window as unknown as { useWorkbenchStore: typeof useWorkbenchStore }).useWorkbenchStore = useWorkbenchStore;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
