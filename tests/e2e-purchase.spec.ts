import { test, expect } from "../src/fixtures/test";
import { allure } from "allure-playwright";
import { faker } from "@faker-js/faker";
import { setAllureMetadata, EPICS, FEATURES } from "../src/utils/allure-helper";
import {
  USERS,
  PRODUCTS,
  SUCCESS_MESSAGES,
  URL_PATTERNS,
} from "../src/constants";

test.describe("End-to-End Purchase Flow", () => {
  test("complete purchase flow - from login to order confirmation", async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Generate random customer data using Faker
    const customerData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode(),
    };

    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: "Purchase Flow",
      story: "Complete checkout process",
      description: `E2E test validating entire purchase journey with dynamic data: ${customerData.firstName} ${customerData.lastName}`,
      severity: "blocker",
      tags: ["e2e", "smoke", "critical-path", "performance"],
    });

    const testStartTime = Date.now();

    await allure.step("Login to application", async () => {
      const stepStart = Date.now();

      await loginPage.navigateToLogin();
      await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);

      // Verify successful login
      await expect(page).toHaveURL(URL_PATTERNS.INVENTORY);
      await expect(inventoryPage.inventoryContainer).toBeVisible();

      // Verify burger menu is available (user is logged in)
      await expect(inventoryPage.menuButton).toBeVisible();

      const stepTime = Date.now() - stepStart;
      console.log(`Login completed in ${stepTime}ms`);
    });

    await allure.step("Add multiple products to cart", async () => {
      const stepStart = Date.now();

      // Verify products are visible before adding
      await expect(
        inventoryPage.getProductContainer(PRODUCTS.BACKPACK)
      ).toBeVisible();
      await expect(
        inventoryPage.getProductContainer(PRODUCTS.BIKE_LIGHT)
      ).toBeVisible();

      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);

      // Verify first product added
      let cartCount = await (inventoryPage.shoppingCartBadge.textContent() ||
        Promise.resolve("0"));
      expect(cartCount).toBe("1");
      await expect(
        inventoryPage.getRemoveButton(PRODUCTS.BACKPACK)
      ).toBeVisible();

      await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);

      // Verify second product added
      cartCount = await (inventoryPage.shoppingCartBadge.textContent() ||
        Promise.resolve("0"));
      expect(cartCount).toBe("2");
      await expect(
        inventoryPage.getRemoveButton(PRODUCTS.BIKE_LIGHT)
      ).toBeVisible();

      const stepTime = Date.now() - stepStart;
      console.log(`Added products in ${stepTime}ms`);
    });

    await allure.step("Navigate to cart and verify items", async () => {
      const stepStart = Date.now();

      await inventoryPage.shoppingCartLink.click();

      // Verify navigation
      await expect(page).toHaveURL(URL_PATTERNS.CART);

      const itemCount = await cartPage.cartItems.count();
      expect(itemCount).toBe(2);

      const itemNames = await cartPage.cartItemNames.allTextContents();
      expect(itemNames).toHaveLength(2);
      expect(itemNames).toContain(PRODUCTS.BACKPACK);
      expect(itemNames).toContain(PRODUCTS.BIKE_LIGHT);

      // Verify cart UI elements
      await expect(cartPage.cartHeader).toBeVisible();
      await expect(cartPage.checkoutButton).toBeVisible();
      await expect(cartPage.checkoutButton).toBeEnabled();
      await expect(cartPage.continueShoppingButton).toBeVisible();

      const stepTime = Date.now() - stepStart;
      console.log(`Cart verification completed in ${stepTime}ms`);
    });

    await allure.step(
      `Fill checkout information for ${customerData.firstName} ${customerData.lastName}`,
      async () => {
        const stepStart = Date.now();

        await cartPage.checkoutButton.click();

        // Verify we're on checkout page
        await expect(page).toHaveURL(URL_PATTERNS.CHECKOUT_STEP_ONE);

        await checkoutPage.fillShippingInformation(
          customerData.firstName,
          customerData.lastName,
          customerData.postalCode
        );

        // Verify form was filled
        await expect(checkoutPage.firstNameInput).toHaveValue(
          customerData.firstName
        );
        await expect(checkoutPage.lastNameInput).toHaveValue(
          customerData.lastName
        );
        await expect(checkoutPage.postalCodeInput).toHaveValue(
          customerData.postalCode
        );

        await checkoutPage.continueButton.click();

        const stepTime = Date.now() - stepStart;
        console.log(`Checkout form completed in ${stepTime}ms`);
      }
    );

    await allure.step("Review order on overview page", async () => {
      const stepStart = Date.now();

      await expect(page).toHaveURL(URL_PATTERNS.CHECKOUT_STEP_TWO);

      // Verify order summary elements are visible
      await expect(checkoutPage.itemTotal).toBeVisible();
      await expect(checkoutPage.taxLabel).toBeVisible();
      await expect(checkoutPage.total).toBeVisible();

      const total = await (checkoutPage.total.textContent() ||
        Promise.resolve(""));
      expect(total).toContain("Total");
      expect(total).toContain("$");

      // Verify cancel and finish buttons are available
      await expect(checkoutPage.cancelButton).toBeVisible();
      await expect(checkoutPage.finishButton).toBeVisible();
      await expect(checkoutPage.finishButton).toBeEnabled();

      await checkoutPage.finishButton.click();

      const stepTime = Date.now() - stepStart;
      console.log(`Order review completed in ${stepTime}ms`);
    });

    await allure.step("Verify order confirmation", async () => {
      const stepStart = Date.now();

      await expect(page).toHaveURL(URL_PATTERNS.CHECKOUT_COMPLETE);

      const header = await (checkoutPage.completeHeader.textContent() ||
        Promise.resolve(""));
      expect(header).toContain(SUCCESS_MESSAGES.ORDER_COMPLETE);

      // Verify completion message and image
      await expect(checkoutPage.completeText).toBeVisible();
      await expect(checkoutPage.ponyExpressImage).toBeVisible();

      // Verify back home button is available
      await expect(checkoutPage.backToHomeButton).toBeVisible();

      const stepTime = Date.now() - stepStart;
      console.log(`Order confirmation verified in ${stepTime}ms`);
    });

    // Overall performance assertion
    const totalTestTime = Date.now() - testStartTime;
    console.log(`\n=== E2E Test Performance ===`);
    console.log(`Total test execution time: ${totalTestTime}ms`);
    console.log(`Average time per step: ${(totalTestTime / 6).toFixed(0)}ms`);

    // E2E flow should complete in under 15 seconds
    expect(totalTestTime).toBeLessThan(15000);

    await allure.attachment(
      "Test Performance Metrics",
      JSON.stringify(
        {
          totalTime: `${totalTestTime}ms`,
          customerData: customerData,
          productsOrdered: [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT],
        },
        null,
        2
      ),
      "application/json"
    );
  });
});
