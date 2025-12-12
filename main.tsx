import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { SupabaseProvider } from './contexts/SupabaseContext.tsx';
import './index.css';

// Suppress specific React Router 'Future Flag' warnings which are benign
// These warnings originate from React Router v6 notifying about optional v7 behaviors
// We filter them here to keep the dev console focused on actionable warnings.
const _origConsoleWarn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  try {
    if (args && args.length > 0 && typeof args[0] === 'string') {
      const msg = args[0] as string;
      if (
        msg.includes('React Router Future Flag Warning') ||
        msg.includes('v7_startTransition') ||
        msg.includes('v7_relativeSplatPath')
      ) {
        return; // swallow this specific router deprecation/flag notice
      }
    }
  } catch {
    // fallback to original if anything goes wrong
    _origConsoleWarn(...args);
    return;
  }
  _origConsoleWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <App />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1F2937',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </SupabaseProvider>
    </BrowserRouter>
  </StrictMode>
);

// Enregistrement du service worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        // service worker registered
      })
      .catch(() => {
        // service worker registration failed
      });
  });
}