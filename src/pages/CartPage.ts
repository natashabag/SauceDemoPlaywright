import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartItemNames: Locator;
  readonly cartHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartHeader = page.locator('[data-test="title"]');
  }

  // Method with logic - worth keeping
  async removeItem(productName: string) {
    const productNameFormatted = productName.toLowerCase().replace(/\s/g, "-");
    await this.page
      .locator(`[data-test="remove-${productNameFormatted}"]`)
      .click();
  }
}
