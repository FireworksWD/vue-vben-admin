import { defineConfig } from "@vben/vite-config";

export default defineConfig(async () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          "/file/media": {
            changeOrigin: true,
            // 将 /file/media 替换为空，保留后面的路径部分
            rewrite: (path) => path.replace(/^\/file\/media/, "/media"),
            target: isProduction
              ? "http://121.15.197.247:8008" // 生产环境的目标服务器
              : "http://127.0.0.1:8000", // 开发环境的目标服务器
            ws: true
          },
          "/media": {
            changeOrigin: true,
            // 如果路径是 /media 开头，直接将 media 删除
            rewrite: (path) => path.replace(/^\/media/, "/media"),
            target: isProduction
              ? "http://121.15.197.247:8008" // 生产环境的目标服务器
              : "http://127.0.0.1:8000", // 开发环境的目标服务器
            ws: true
          }
        }
      }
    }
  };
});
