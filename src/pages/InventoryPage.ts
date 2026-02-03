import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly inventoryContainer: Locator;
  readonly productItems: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly productSortDropdown: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.productItems = page.locator('[data-test="inventory-item"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
    this.removeButtons = page.locator('button[data-test^="remove"]');
    this.productSortDropdown = page.locator(
      '[data-test="product-sort-container"]'
    );
    this.menuButton = page.locator("#react-burger-menu-btn");
  }

  // Methods with logic - worth keeping
  async addProductToCart(productName: string) {
    const productNameFormatted = productName.toLowerCase().replace(/\s/g, "-");
    await this.page
      .locator(`[data-test="add-to-cart-${productNameFormatted}"]`)
      .click();
  }

  async removeProductFromCart(productName: string) {
    const productNameFormatted = productName.toLowerCase().replace(/\s/g, "-");
    await this.page
      .locator(`[data-test="remove-${productNameFormatted}"]`)
      .click();
  }

  // Helper methods that return locators (useful for assertions)
  getProductContainer(productName: string): Locator {
    return this.productItems.filter({ hasText: productName });
  }

  getAddToCartButton(productName: string): Locator {
    const productNameFormatted = productName.toLowerCase().replace(/\s/g, "-");
    return this.page.locator(
      `[data-test="add-to-cart-${productNameFormatted}"]`
    );
  }

  getRemoveButton(productName: string): Locator {
    const productNameFormatted = productName.toLowerCase().replace(/\s/g, "-");
    return this.page.locator(`[data-test="remove-${productNameFormatted}"]`);
  }

  getProductDescription(productName: string): Locator {
    const product = this.productItems.filter({ hasText: productName });
    return product.locator('[data-test="inventory-item-desc"]');
  }
}
