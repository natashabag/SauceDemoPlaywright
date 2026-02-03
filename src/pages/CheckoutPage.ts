import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  // Step 1: Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step 2: Overview
  readonly itemTotal: Locator;
  readonly taxLabel: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly cartItems: Locator;

  // Step 3: Complete
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backToHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');

    // Step 3
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backToHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator(".pony_express");
  }

  // Multi-step method - worth keeping
  async fillShippingInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }
}
