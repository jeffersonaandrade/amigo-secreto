/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desativado temporariamente para testar login com Google
  // Removido output: 'standalone' - O Netlify gerencia o deploy do Next.js automaticamente
  // Desabilita SSG completamente - todas as páginas serão renderizadas no servidor (SSR) ou cliente
  // Isso é necessário porque usamos tRPC e Firebase Client SDK que só funcionam no cliente
  generateBuildId: async () => {
    return 'build-' + Date.now().toString();
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Headers para permitir popups do Google Auth
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Ignorar source maps de dependências externas
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Ignorar source maps de arquivos que não existem
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;

