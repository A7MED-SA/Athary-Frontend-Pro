// Patch fetch read-only descriptor inside sandbox window wrapper
try {
  const originalFetch = window.fetch;
  let currentFetch = originalFetch;

  const patchDescriptor = (obj: any) => {
    if (!obj) return;
    try {
      const desc = Object.getOwnPropertyDescriptor(obj, 'fetch');
      if (!desc || desc.configurable) {
        Object.defineProperty(obj, 'fetch', {
          get() { return currentFetch; },
          set(value) { currentFetch = value; },
          configurable: true,
          enumerable: true,
        });
      }
    } catch (err) {
      console.warn("Unable to patch fetch on", obj, err);
    }
  };

  patchDescriptor(window);
  patchDescriptor(globalThis);

  if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
  } else {
    patchDescriptor((window as any).global);
  }
} catch (e) {
  console.warn("Failed standard fetch patching:", e);
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { router } from './router';
import './index.css';

// Immediate theme enforcement to prevent flashing
try {
  const savedMode = localStorage.getItem('theme-mode') || 'light';
  const savedTheme = localStorage.getItem('theme-color') || 'default';

  if (savedMode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  document.documentElement.classList.remove('theme-gold', 'theme-forest', 'theme-graphite');

  let mappedClass = '';
  if (savedTheme === 'gold' || savedTheme === 'theme-gold') mappedClass = 'theme-gold';
  else if (savedTheme === 'forest' || savedTheme === 'theme-forest') mappedClass = 'theme-forest';
  else if (savedTheme === 'graphite' || savedTheme === 'theme-graphite') mappedClass = 'theme-graphite';

  if (mappedClass) {
    document.documentElement.classList.add(mappedClass);
  }
} catch (e) {
  console.warn("Theme preload failed:", e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
