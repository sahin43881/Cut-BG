/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Push these packages through Next's SWC pipeline so `import.meta.url` and
  // sibling ESM imports inside the prebuilt onnxruntime-web bundle are
  // recognized as module code.
  transpilePackages: ['@imgly/background-removal', 'onnxruntime-web'],

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
    // Node-only ML deps that onnxruntime-web *optionally* requires — don't try
    // to bundle them into the browser.
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node$': false,
      sharp$: false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Allow ESM imports inside node_modules without fully-specified extensions
    // (the imgly bundle uses extensionless internal imports).
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: { fullySpecified: false },
    });

    // The onnxruntime-web bundle ships pre-minified `.mjs` chunks that use
    // `import.meta.url` + `createRequire('module')`. The Next.js minifier
    // tries to re-parse those as plain scripts and throws. Bundle bloat is a
    // non-issue here — the 30 MB WASM model dominates page weight — so we
    // disable JS minification globally for production. CSS minification is
    // unaffected.
    config.optimization.minimize = false;

    return config;
  },
};

module.exports = nextConfig;
