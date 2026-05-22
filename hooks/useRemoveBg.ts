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

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  // Touch + small viewport is a more reliable signal than UA sniffing, but UA
  // still catches iPad masquerading as desktop in some configs.
  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
  if (typeof window !== 'undefined' && window.innerWidth < 768 && 'ontouchstart' in window) {
    return true;
  }
  return false;
}

async function hasWebGPU(): Promise<boolean> {
  const nav = navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } };
  if (!nav.gpu) return false;
  try {
    const adapter = await nav.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

function friendlyError(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  if (/Failed to fetch|NetworkError|network|ERR_/i.test(msg)) {
    return new Error(
      "Couldn't download the AI model. Check your internet connection and try again — the first run needs ~10 MB.",
    );
  }
  if (/out of memory|allocation|OOM/i.test(msg)) {
    return new Error('Your device ran out of memory. Try a smaller image.');
  }
  if (/WebGPU|GPU|webgl/i.test(msg)) {
    return new Error("Your browser couldn't use the GPU for this. Try a different browser.");
  }
  return err instanceof Error ? err : new Error(msg);
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
      // and avoids any chance of SSR touching browser-only globals. Chunk-load
      // failures here are usually stale references after a dev rebuild or a
      // newly deployed version; a one-shot hard reload recovers without
      // forcing the user to clear cache manually.
      let lib: typeof import('@imgly/background-removal');
      try {
        lib = await import('@imgly/background-removal');
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/Loading chunk|ChunkLoadError|Loading CSS chunk/i.test(msg)) {
          if (typeof window !== 'undefined' && !sessionStorage.getItem('cutbg-chunk-reload')) {
            sessionStorage.setItem('cutbg-chunk-reload', '1');
            window.location.reload();
            // Reload is async; throw so React Query marks the mutation errored
            // until the reload actually swaps the document.
            throw new Error('Refreshing to pick up the latest build…');
          }
          throw new Error(
            "Couldn't load the background-removal engine. Hard-refresh the page (Ctrl+Shift+R or Cmd+Shift+R) and try again.",
          );
        }
        throw friendlyError(err);
      }
      // Successful load — clear the reload guard.
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('cutbg-chunk-reload');
      }
      const { removeBackground } = lib;

      const mobile = isMobile();
      const gpu = !mobile && (await hasWebGPU());

      // Mobile gets the quantized ~10 MB model and CPU inference — smaller
      // download, lower memory, works on every phone.
      const model = mobile ? 'isnet_quint8' : 'isnet_fp16';
      const device: 'cpu' | 'gpu' = gpu ? 'gpu' : 'cpu';

      const runWith = (dev: 'cpu' | 'gpu') =>
        removeBackground(file, {
          debug: false,
          device: dev,
          model,
          output: { format: 'image/png', quality: 0.8 },
          fetchArgs: { mode: 'cors', credentials: 'omit', cache: 'force-cache' },
          progress: (key, current, total) => {
            if (total > 0) {
              const pct = Math.min(100, Math.round((current / total) * 100));
              setProgress(pct);
            }
            if (key.startsWith('compute:')) setPhase('processing');
          },
        });

      let result: Blob;
      try {
        result = await runWith(device);
      } catch (err) {
        // GPU path can crash mid-inference on some drivers; retry on CPU.
        if (device === 'gpu') {
          result = await runWith('cpu');
        } else {
          throw friendlyError(err);
        }
      }

      const t0 = performance.now();
      setPhase('processing');
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
