import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

const projects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
];

// WebKit은 첫 설치 Service Worker 레이스 검증이 필요할 때만 선택적으로 실행함
if (process.env.PW_WEBKIT === '1') {
  projects.push({
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  });
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects,
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
