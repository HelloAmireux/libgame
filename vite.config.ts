import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',       // 允许局域网访问
    port: 5173,            // 默认端口
    allowedHosts: [
      '653glhp65391.vicp.fun', // 允许花生壳域名
    ],
  },
});