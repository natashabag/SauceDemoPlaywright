import { test, expect } from "../src/fixtures/test";
import { setAllureMetadata, EPICS, FEATURES } from "../src/utils/allure-helper";
import { generateCustomerData } from "../src/utils/test-data-generator";
import {
  URLS,
  PRODUCTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  URL_PATTERNS,
} from "../src/constants";

test.describe("Checkout Validation", () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto(URLS.INVENTORY);
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.shoppingCartLink.click();
    await cartPage.checkoutButton.click();
  });

  test("checkout fails when first name is missing", async ({
    checkoutPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.CHECKOUT,
      story: "Form validation - missing first name",
      description:
        "Verify error message when first name is not provided during checkout",
      severity: "critical",
    });

    const customer = generateCustomerData();

    await checkoutPage.fillShippingInformation(
      "",
      customer.lastName,
      customer.zipCode
    );
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText(
      ERROR_MESSAGES.FIRST_NAME_REQUIRED
    );
  });

  test("checkout fails when last name is missing", async ({ checkoutPage }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.CHECKOUT,
      story: "Form validation - missing last name",
      description:
        "Verify error message when last name is not provided during checkout",
      severity: "critical",
    });

    const customer = generateCustomerData();

    await checkoutPage.fillShippingInformation(
      customer.firstName,
      "",
      customer.zipCode
    );
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText(
      ERROR_MESSAGES.LAST_NAME_REQUIRED
    );
  });

  test("checkout fails when postal code is missing", async ({
    checkoutPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.CHECKOUT,
      story: "Form validation - missing postal code",
      description:
        "Verify error message when postal code is not provided during checkout",
      severity: "critical",
    });

    const customer = generateCustomerData();

    await checkoutPage.fillShippingInformation(
      customer.firstName,
      customer.lastName,
      ""
    );
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText(
      ERROR_MESSAGES.POSTAL_CODE_REQUIRED
    );
  });

  test("successful checkout with valid information", async ({
    page,
    checkoutPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.CHECKOUT,
      story: "Successful checkout flow",
      description:
        "Verify that checkout succeeds when all required fields are filled correctly",
      severity: "blocker",
    });

    const customer = generateCustomerData();

    await checkoutPage.fillShippingInformation(
      customer.firstName,
      customer.lastName,
      customer.zipCode
    );
    await checkoutPage.continueButton.click();

    await expect(page).toHaveURL(URL_PATTERNS.CHECKOUT_STEP_TWO);
  });

  test("verify order total calculation on overview page", async ({
    checkoutPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.CHECKOUT,
      story: "Order total calculation",
      description:
        "Verify that order total, tax, and subtotal are displayed correctly on overview page",
      severity: "critical",
    });

    const customer = generateCustomerData();

    await checkoutPage.fillShippingInformation(
      customer.firstName,
      customer.lastName,
      customer.zipCode
    );
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.itemTotal).toBeVisible();
    await expect(checkoutPage.taxLabel).toBeVisible();
    await expect(checkoutPage.total).toBeVisible();

    const totalText = (await checkoutPage.total.textContent()) || "";
    expect(totalText).toContain("Total:");
  });

  test("complete order and verify confirmation page", async ({
    page,
    checkoutPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.CHECKOUT,
      story: "Order completion",
      description:
        "Verify order confirmation after completing checkout process",
      severity: "blocker",
    });

    const customer = generateCustomerData();

    await checkoutPage.fillShippingInformation(
      customer.firstName,
      customer.lastName,
      customer.zipCode
    );
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();

    await expect(page).toHaveURL(URL_PATTERNS.CHECKOUT_COMPLETE);

    const header = (await checkoutPage.completeHeader.textContent()) || "";
    expect(header).toContain(SUCCESS_MESSAGES.ORDER_COMPLETE);

    await expect(checkoutPage.completeText).toBeVisible();
  });

  test("return to products from confirmation page", async ({
    page,
    checkoutPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.CHECKOUT,
      story: "Navigate back to products after purchase",
      description:
        "Verify that user can navigate back to products page after completing order",
    });

    const customer = generateCustomerData();

    await checkoutPage.fillShippingInformation(
      customer.firstName,
      customer.lastName,
      customer.zipCode
    );
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();

    await checkoutPage.backToHomeButton.click();

    await expect(page).toHaveURL(URL_PATTERNS.INVENTORY);
  });
});
