import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

/**
 * Page Fixtures - Auto-inject Page Objects
 *
 * Instead of manually creating page objects in every test:
 *   const loginPage = new LoginPage(page);
 *
 * You can now inject them directly:
 *   test('my test', async ({ loginPage, inventoryPage }) => { ... })
 *
 * Benefits:
 * - Cleaner, more readable tests
 * - Less boilerplate code
 * - Automatic lifecycle management
 * - Easier to maintain
 */

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
  /**
   * Login Page Fixture
   * Automatically creates and provides LoginPage instance
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
    // Cleanup happens automatically after test
  },

  /**
   * Inventory Page Fixture
   * Automatically creates and provides InventoryPage instance
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Cart Page Fixture
   * Automatically creates and provides CartPage instance
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * Checkout Page Fixture
   * Automatically creates and provides CheckoutPage instance
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { expect } from "@playwright/test";
