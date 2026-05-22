/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Push these packages through Next's SWC pipeline so `import.meta.url` and
  // sibling ESM imports inside the prebuilt onnxruntime-web bundle are
  // recognized as module code.
  transpilePackages: ['@imgly/background-removal', 'onnxruntime-web'],

  async headers() {
    // COOP / COEP enable SharedArrayBuffer (multi-threaded WASM).
    // `credentialless` is required instead of `require-corp` because the
    // @imgly CDN doesn't set Cross-Origin-Resource-Policy on every edge,
    // and `require-corp` makes those fetches fail on mobile with a
    // generic "Failed to fetch" error.
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
        ],
      },
    ];
  },

  webpack: (config, { dev }) => {
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
    // tries to re-parse those as plain scripts and throws. Only disable in
    // production — dev doesn't minify and toggling the flag there can confuse
    // webpack's chunk graph.
    if (!dev) {
      config.optimization.minimize = false;
    }

    return config;
  },
};

module.exports = nextConfig;
