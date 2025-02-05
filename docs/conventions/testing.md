# Testing Guide

This document outlines the testing strategy for the Transact App, focusing on End-to-End (E2E) testing using Cypress.

## Testing Stack

- **Cypress**: Main E2E testing framework
- **GitHub Actions**: CI pipeline integration
- **Vercel**: CD platform

### Sample Test Structure (WIP)
```
cypress/
├── e2e/                   # E2E test files
│   ├── auth/              # Authentication tests
│   ├── transactions/      # Transaction flow tests
│   └── dashboard/         # Dashboard visualization tests
├── fixtures/              # Test data
└── support/               # Support files and commands
```
### Key Test Scenarios
#### Authentication Flow
- User registration
- User login
- Password reset flow

#### Transaction Management
- Adding new transactions
- Editing existing transactions
- Deleting transactions
- Category assignment
 
#### Dashboard Tests
- Graph rendering
- Data filtering
- Summary calculations

## CI/CD Integration
- GitHub Actions Workflow
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Cypress run
        uses: cypress-io/github-action@v2
        with:
          build: npm run build
          start: npm start
```
- Vercel Integration
  - Tests will run automatically on every deployment preview and production build through the GitHub Actions pipeline.

## Best Practices
1. Write descriptive test cases using BDD syntax
2. Keep tests independent and atomic
3. Use meaningful selectors (data-testid attributes)
4. Maintain test data in fixtures
5. Group related tests in describe 

### Running Tests Locally
```bash
# Run tests in headless mode
npm run test:e2e

# Open Cypress Test Runner
npm run cypress:open
```