import { defineConfig } from "@vben/vite-config";

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          "/media": {
            changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/api/, ''),
            rewrite: (path) => path.replace(/^\/media/, "/media"),
            // mock代理目标地址
            target: "http://127.0.0.1:8008",
            ws: true
          }
        }
      }
    }
  };
});
