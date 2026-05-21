'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { getQueryClient } from '@/lib/queryClient';

export function Providers({ children }: { children: ReactNode }) {
  // Theme is set pre-paint by the inline script in app/layout.tsx; nothing to
  // bootstrap here. ThemeToggle owns runtime toggling.
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
