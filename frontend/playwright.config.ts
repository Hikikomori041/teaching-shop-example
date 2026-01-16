import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration
 *
 * This configures how Playwright runs your E2E tests.
 * Copy this file to frontend/playwright.config.ts
 */
export default defineConfig({
    // Directory where test files are located
    testDir: './e2e',

    // Run tests in parallel
    fullyParallel: true,

    // Fail the build on CI if test.only is accidentally left in
    forbidOnly: !!process.env.CI,

    // Retry failed tests (useful for flaky tests)
    retries: process.env.CI ? 2 : 0,

    // Reporter configuration
    reporter: 'html',

    // Shared settings for all tests
    use: {
        // Base URL for navigation
        baseURL: process.env.CI ? 'http://localhost:8080' : 'http://localhost:8080',

        // Capture screenshot on failure
        screenshot: 'only-on-failure',

        // Record video on failure
        video: 'retain-on-failure',

        // Trace collection for debugging
        trace: 'on-first-retry',
    },

    // Configure browser(s) to test
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Uncomment to test in more browsers:
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],

    // Run backend and frontend servers before tests (optional, for CI)
    // Uncomment if you want Playwright to start servers automatically
    // webServer: [
    //   {
    //     command: 'cd ../backend/core && uv run python manage.py runserver',
    //     url: 'http://localhost:8000/api/products/',
    //     reuseExistingServer: !process.env.CI,
    //   },
    //   {
    //     command: 'npm run dev -- --port 8080',
    //     url: 'http://localhost:8080',
    //     reuseExistingServer: !process.env.CI,
    //   },
    // ],
})
