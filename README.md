# Playwright Test Automation Portfolio

## About This Project

I realized my GitHub didn't have a Playwright project even though it's the tool I'm most comfortable with and have been using for a while. So I built this test suite to showcase what I can do with modern test automation.

## Tech Stack

- **Playwright** - Test automation framework
- **TypeScript** - For type safety and better IDE support
- **Allure** - Test reporting and analytics
- **Faker.js** - Dynamic test data generation
- **GitHub Actions** - CI/CD pipeline

## Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in UI mode
npm run test:ui

# View Allure report
npm run allure:open
```

## Key Features

### Authentication Optimization

- Storage state saved after login to avoid repeated authentication
- Tests start from already-logged-in state

### Custom Fixtures

- Auto-injected page objects for cleaner test code
- Automatic lifecycle management (setup/teardown)

### Data-Driven Testing

- Parameterized product tests using Faker.js
- Dynamic test data generation for realistic scenarios
- One test template runs against all products individually

### Performance Tracking

- Response time assertions on critical operations
- Page load performance monitoring
- Helps catch performance regressions early

### Comprehensive Reporting

- Allure reports with detailed test analytics
- Test execution trends and statistics
- Step-by-step test execution visualization

### CI/CD Pipeline

- Automated testing on every push
- Desktop Chrome testing (optimized for speed)
- Scheduled runs with email notifications
- Reports published to GitHub Pages

## Test Coverage

- **35 automated tests** covering:
  - Login flows (valid/invalid, locked users)
  - Shopping cart operations
  - Product sorting and filtering
  - Checkout process validation
  - End-to-end purchase flow

---

Built with Playwright + TypeScript
