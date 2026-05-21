'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { trackRemoval } from '@/lib/analytics';

export type RemoveBgResult = {
  /** Object URL for the transparent PNG. Caller is responsible for revoking. */
  resultUrl: string;
  /** Object URL for the original input. */
  originalUrl: string;
  /** Original file metadata. */
  file: { name: string; size: number; type: string };
  /** Processing time in ms (model run, not download). */
  durationMs: number;
};

export type Phase = 'idle' | 'loading-model' | 'processing' | 'done' | 'error';

async function sha256Hex(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function useRemoveBg() {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationKey: ['remove-bg'],
    mutationFn: async (file: File): Promise<RemoveBgResult> => {
      // Cache by content hash — same image, no re-processing.
      const hash = await sha256Hex(file);
      const cached = queryClient.getQueryData<RemoveBgResult>(['remove-bg', hash]);
      if (cached) {
        setPhase('done');
        setProgress(100);
        return cached;
      }

      setPhase('loading-model');
      setProgress(0);

      // Dynamic import keeps the ~30MB WASM/ONNX bundle out of the initial JS payload
      // and avoids any chance of SSR touching browser-only globals.
      const { removeBackground } = await import('@imgly/background-removal');

      const result = await removeBackground(file, {
        debug: false,
        device: 'gpu',
        model: 'isnet_fp16',
        output: { format: 'image/png', quality: 0.8, type: 'foreground' },
        progress: (key, current, total) => {
          if (total > 0) {
            const pct = Math.min(100, Math.round((current / total) * 100));
            setProgress(pct);
          }
          if (key.startsWith('compute:')) setPhase('processing');
        },
      });

      const t0 = performance.now();
      setPhase('processing');
      // removeBackground returns a Blob; resolve URLs synchronously.
      const resultUrl = URL.createObjectURL(result);
      const originalUrl = URL.createObjectURL(file);
      const durationMs = Math.round(performance.now() - t0);

      const payload: RemoveBgResult = {
        resultUrl,
        originalUrl,
        file: { name: file.name, size: file.size, type: file.type },
        durationMs,
      };

      queryClient.setQueryData(['remove-bg', hash], payload);
      void trackRemoval({ bytes: file.size, durationMs, mime: file.type });

      setPhase('done');
      setProgress(100);
      return payload;
    },
    onError: () => setPhase('error'),
  });

  const reset = () => {
    const data = mutation.data;
    if (data) {
      URL.revokeObjectURL(data.resultUrl);
      URL.revokeObjectURL(data.originalUrl);
    }
    mutation.reset();
    setPhase('idle');
    setProgress(0);
  };

  return {
    ...mutation,
    phase,
    progress,
    reset,
  };
}
