/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // COOP / COEP enable SharedArrayBuffer, which @imgly/background-removal
    // uses for multi-threaded WASM. Without these the lib still works but
    // falls back to single-threaded CPU mode.
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
  webpack: (config) => {
    // @imgly/background-removal ships WASM and ONNX assets it loads at runtime
    // from a CDN. Nothing to bundle, but make sure node-only modules don't leak in.
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
