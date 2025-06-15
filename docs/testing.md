# Testing

This document outlines the testing strategy for the Cepheus Online application.

## End-to-End (E2E) Tests

We use [Playwright](https://playwright.dev/) for end-to-end testing. The tests are located in the `e2e/` directory.

### Running Tests

To run the tests, use the following command:

```bash
npm run test:e2e
```

### Configuration

The Playwright configuration is in `playwright.config.ts`.

#### Local vs. CI Environments

- **Local Development**: When running tests locally, they will be executed against Chrome, Firefox, and Webkit. The development server will be reused if it's already running.
- **CI Environment**: In a Continuous Integration environment (like GitHub Actions), tests are run only against Chromium to save resources. A new server is started for the test run.

### Test Philosophy

- Tests should be self-contained and not rely on external services or websites. This is to prevent brittle tests that can fail due to factors outside of our control.
- An example of this was a test that checked for a heading on the Next.js documentation site. This test was removed because a change on the external site caused our build to fail.
