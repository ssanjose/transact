# Testing Guide

This document outlines the testing strategy for the Transact App, focusing on End-to-End (E2E) testing using Playwright.

## Testing Stack

- **Playwright**: Main E2E testing framework
- **GitHub Actions**: CI pipeline integration
- **Vercel**: CD platform

### Test Structure
```
tests/
└── pages/                 # Page-specific tests
   ├── landing.test.ts    # Landing page tests
   ├── accounts.test.ts   # Account management tests
   ├── overview.test.ts   # Overview page tests
   ├── categories.test.ts # Categories page tests
   ├── dashboard.test.ts  # Dashboard tests
   └── settings.test.ts   # Settings page tests
playwright.config.ts   # Playwright configuration
```

### Key Test Scenarios

#### Page Layout Tests
- Title verification
- Heading presence
- Section visibility
- Component rendering

#### Account Management
- Account creation
- Account editing
- Account deletion
- Balance verification

#### Transaction Management
- Transaction creation
- Transaction editing
- Transaction deletion
- Category assignment

#### Settings Management
- Preferences configuration
- Data management
- Notification settings

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Playwright Tests
on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 10
```

## Best Practices
1. Write descriptive test cases using async/await syntax
2. Keep tests independent and atomic
3. Use meaningful selectors (roles, text content, testid)
4. Group related tests using test.describe()
5. Follow page object pattern for better maintainability

## Test Conventions
1. File Naming: `*.test.ts` for test files
2. Test Organization:
   - Group related tests using `test.describe()`
   - Use descriptive test names
   - Keep tests independent

## Running Tests Locally
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test file
npx playwright test tests/pages/landing.test.ts

# Run tests in headless mode
npx playwright test

# Run tests with UI
npx playwright test --ui

# View test report
npx playwright show-report
```