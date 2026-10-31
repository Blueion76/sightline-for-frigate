import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser', fullyParallel:true,
  use:{baseURL:'http://127.0.0.1:5173',trace:'retain-on-failure',screenshot:'only-on-failure'},
  webServer:{command:'node dev/server.mjs --no-watch',url:'http://127.0.0.1:5173/dev/bootstrap',reuseExistingServer:!process.env.CI},
  projects:[{name:'chromium',use:{browserName:'chromium',viewport:{width:1500,height:1000}}}],
});
