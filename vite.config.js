import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/coins': {
          target: 'https://api.coingecko.com/api/v3/coins/markets',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/coins/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              if (env.COINGECKO_API_KEY) {
                proxyReq.setHeader('x-cg-demo-api-key', env.COINGECKO_API_KEY);
              }
            });
          }
        },
        '/api/coin': {
          target: 'https://api.coingecko.com/api/v3/coins',
          changeOrigin: true,
          rewrite: (path) => {
            if (path.endsWith('/chart')) {
               return path.replace(/^\/api\/coin/, '').replace(/\/chart$/, '/market_chart');
            }
            return path.replace(/^\/api\/coin/, '');
          },
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              if (env.COINGECKO_API_KEY) {
                proxyReq.setHeader('x-cg-demo-api-key', env.COINGECKO_API_KEY);
              }
            });
          }
        }
      }
    }
  }
})
