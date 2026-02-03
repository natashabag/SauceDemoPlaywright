import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { setAllureMetadata, EPICS, FEATURES } from '../src/utils/allure-helper';
import { USERS, ERROR_MESSAGES, URL_PATTERNS } from '../src/constants';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('successful login with valid credentials', async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.AUTHENTICATION,
      feature: FEATURES.LOGIN,
      story: 'User logs in with valid credentials',
      description: 'Verify that a user can successfully log in with valid username and password',
      severity: 'blocker',
    });

    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    
    await expect(page).toHaveURL(URL_PATTERNS.INVENTORY);
    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
  });

  test('login fails with invalid username', async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.AUTHENTICATION,
      feature: FEATURES.LOGIN,
      story: 'User attempts login with invalid username',
      description: 'Verify appropriate error message when invalid username is provided',
      severity: 'critical',
    });

    await loginPage.login('invalid_user', USERS.STANDARD.password);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('login fails with invalid password', async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.AUTHENTICATION,
      feature: FEATURES.LOGIN,
      story: 'User attempts login with invalid password',
      description: 'Verify appropriate error message when invalid password is provided',
      severity: 'critical',
    });

    await loginPage.login(USERS.STANDARD.username, 'wrong_password');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('login fails with empty username', async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.AUTHENTICATION,
      feature: FEATURES.LOGIN,
      story: 'User attempts login without username',
      description: 'Verify error message when username field is left empty',
      severity: 'normal',
    });

    await loginPage.login('', USERS.STANDARD.password);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.USERNAME_REQUIRED);
  });

  test('login fails with empty password', async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.AUTHENTICATION,
      feature: FEATURES.LOGIN,
      story: 'User attempts login without password',
      description: 'Verify error message when password field is left empty',
      severity: 'normal',
    });

    await loginPage.login(USERS.STANDARD.username, '');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.PASSWORD_REQUIRED);
  });

  test('locked out user cannot login', async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.AUTHENTICATION,
      feature: FEATURES.LOGIN,
      story: 'Locked out user attempts to login',
      description: 'Verify that a locked out user receives appropriate error message',
      severity: 'critical',
    });

    await loginPage.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(ERROR_MESSAGES.LOCKED_OUT);
  });
});