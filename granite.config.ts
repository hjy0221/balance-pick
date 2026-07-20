import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "balance-pick",
  brand: {
    displayName: "밸런스픽",
    primaryColor: "#6C5CE7",
    icon: "https://static.toss.im/appsintoss/60821/f05a2147-2895-447c-8c99-94167c4e02bf.png",
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  webViewProps: {
    type: "partner",
    pullToRefreshEnabled: false,
    overScrollMode: "never",
  },
  navigationBar: {
    withHomeButton: true,
  },
  permissions: [],
  outdir: "dist",
});
