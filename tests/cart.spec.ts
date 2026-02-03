import { test, expect } from "../src/fixtures/test";
import { setAllureMetadata, EPICS, FEATURES } from "../src/utils/allure-helper";
import { URLS, PRODUCTS, URL_PATTERNS } from "../src/constants";

test.describe("Shopping Cart Functionality", () => {
  test("add single product to cart", async ({ page, inventoryPage }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Add product to cart",
      description:
        "Verify that a product can be added to the cart with all UI updates",
      severity: "critical",
    });

    const startTime = Date.now();
    await page.goto(URLS.INVENTORY);

    // Verify product is visible before adding
    await expect(
      inventoryPage.getProductContainer(PRODUCTS.BACKPACK)
    ).toBeVisible();

    // Verify "Add to cart" button is present
    const addButton = inventoryPage.getAddToCartButton(PRODUCTS.BACKPACK);
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText("Add to cart");

    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);

    // Verify button changed to "Remove"
    const removeButton = inventoryPage.getRemoveButton(PRODUCTS.BACKPACK);
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toHaveText("Remove");

    // Verify cart count updated
    const cartCount =
      (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCount).toBe("1");

    // Verify cart badge is visible
    await expect(inventoryPage.shoppingCartBadge).toBeVisible();

    // Performance: Adding to cart should be fast
    const actionTime = Date.now() - startTime;
    expect(actionTime).toBeLessThan(3000);
    console.log(`Add to cart completed in ${actionTime}ms`);
  });

  test("add multiple products to cart", async ({ page, inventoryPage }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Add multiple products to cart",
      description:
        "Verify that multiple products can be added with incremental count updates",
      severity: "critical",
    });

    await page.goto(URLS.INVENTORY);

    // Add products and verify each addition
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    let cartCount =
      (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCount).toBe("1");

    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    cartCount = (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCount).toBe("2");

    await inventoryPage.addProductToCart(PRODUCTS.BOLT_TSHIRT);
    cartCount = (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCount).toBe("3");

    // Verify all buttons changed to "Remove"
    await expect(
      inventoryPage.getRemoveButton(PRODUCTS.BACKPACK)
    ).toBeVisible();
    await expect(
      inventoryPage.getRemoveButton(PRODUCTS.BIKE_LIGHT)
    ).toBeVisible();
    await expect(
      inventoryPage.getRemoveButton(PRODUCTS.BOLT_TSHIRT)
    ).toBeVisible();
  });

  test("remove product from cart on inventory page", async ({
    page,
    inventoryPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Remove product from inventory page",
      description:
        "Verify product removal with button state and cart badge updates",
      severity: "normal",
    });

    await page.goto(URLS.INVENTORY);

    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);

    // Verify item was added
    let cartCount =
      (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCount).toBe("1");
    await expect(
      inventoryPage.getRemoveButton(PRODUCTS.BACKPACK)
    ).toBeVisible();

    await inventoryPage.removeProductFromCart(PRODUCTS.BACKPACK);

    // Verify button changed back to "Add to cart"
    const addButton = inventoryPage.getAddToCartButton(PRODUCTS.BACKPACK);
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText("Add to cart");

    // Cart badge should disappear when count is 0
    const cartBadgeVisible = await inventoryPage.shoppingCartBadge.isVisible();
    expect(cartBadgeVisible).toBe(false);
  });

  test("verify cart contents after adding products", async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Verify cart contents",
      description: "Verify cart displays correct products with all UI elements",
      severity: "critical",
    });

    await page.goto(URLS.INVENTORY);

    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(PRODUCTS.FLEECE_JACKET);

    // Verify cart count before navigating
    const cartCountBefore =
      (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCountBefore).toBe("2");

    await inventoryPage.shoppingCartLink.click();

    // Verify URL changed
    await expect(page).toHaveURL(URL_PATTERNS.CART);

    const itemNames = await cartPage.cartItemNames.allTextContents();

    // Verify correct number of items
    expect(itemNames).toHaveLength(2);

    // Verify specific products are present
    expect(itemNames).toContain(PRODUCTS.BACKPACK);
    expect(itemNames).toContain(PRODUCTS.FLEECE_JACKET);

    // Verify cart header is visible
    await expect(cartPage.cartHeader).toBeVisible();

    // Verify checkout button is available
    await expect(cartPage.checkoutButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeEnabled();
  });

  test("remove product from cart page", async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Remove product from cart page",
      description:
        "Verify product removal from cart page with count and badge updates",
      severity: "normal",
    });

    await page.goto(URLS.INVENTORY);

    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    await inventoryPage.shoppingCartLink.click();

    let itemCount = await cartPage.cartItems.count();
    expect(itemCount).toBe(2);

    await cartPage.removeItem(PRODUCTS.BACKPACK);

    // Verify count decreased
    itemCount = await cartPage.cartItems.count();
    expect(itemCount).toBe(1);

    // Verify correct item was removed
    const itemNames = await cartPage.cartItemNames.allTextContents();
    expect(itemNames).not.toContain(PRODUCTS.BACKPACK);
    expect(itemNames).toContain(PRODUCTS.BIKE_LIGHT);

    // Verify cart badge updated in header
    const cartCount = await page
      .locator('[data-test="shopping-cart-badge"]')
      .textContent();
    expect(cartCount).toBe("1");
  });

  test("continue shopping from cart", async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Continue shopping from cart",
      description: "Verify navigation back to inventory with cart persistence",
      severity: "normal",
    });

    await page.goto(URLS.INVENTORY);

    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.shoppingCartLink.click();

    // Verify we're on cart page
    await expect(page).toHaveURL(URL_PATTERNS.CART);

    await cartPage.continueShoppingButton.click();

    // Verify navigation back to inventory
    await expect(page).toHaveURL(URL_PATTERNS.INVENTORY);
    await expect(inventoryPage.inventoryContainer).toBeVisible();

    // Verify cart count persisted
    const cartCount =
      (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCount).toBe("1");

    // Verify remove button still shows for added product
    await expect(
      inventoryPage.getRemoveButton(PRODUCTS.BACKPACK)
    ).toBeVisible();
  });

  // Data-Driven Tests
  test.describe("Data-Driven: Individual Product Tests", () => {
    const allProducts = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT,
      PRODUCTS.FLEECE_JACKET,
      PRODUCTS.ONESIE,
      PRODUCTS.TSHIRT_RED,
    ];

    for (const product of allProducts) {
      test(`add ${product} to cart`, async ({ page, inventoryPage }) => {
        await setAllureMetadata({
          epic: EPICS.ECOMMERCE,
          feature: FEATURES.SHOPPING_CART,
          story: `Add ${product}`,
          description: `Data-driven test: Verify ${product} can be added to cart`,
          severity: "normal",
          tags: ["data-driven", "products"],
        });

        const startTime = Date.now();
        await page.goto(URLS.INVENTORY);

        // Verify product exists and is visible
        await expect(inventoryPage.getProductContainer(product)).toBeVisible();

        // Verify product has description
        await expect(
          inventoryPage.getProductDescription(product)
        ).toBeVisible();

        // Add to cart
        await inventoryPage.addProductToCart(product);

        // Verify cart updated
        const cartCount =
          (await inventoryPage.shoppingCartBadge.textContent()) || "0";
        expect(cartCount).toBe("1");

        // Verify button changed to Remove
        await expect(inventoryPage.getRemoveButton(product)).toBeVisible();
        await expect(inventoryPage.getRemoveButton(product)).toHaveText(
          "Remove"
        );

        // Performance check - each product should add quickly
        const actionTime = Date.now() - startTime;
        expect(actionTime).toBeLessThan(3000);
      });
    }
  });

  test("boundary: add all 6 products to cart", async ({
    page,
    inventoryPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Add maximum products",
      description:
        "Boundary test: Verify all 6 products can be added simultaneously",
      severity: "normal",
      tags: ["data-driven", "boundary", "performance"],
    });

    const startTime = Date.now();
    await page.goto(URLS.INVENTORY);

    const allProducts = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT,
      PRODUCTS.FLEECE_JACKET,
      PRODUCTS.ONESIE,
      PRODUCTS.TSHIRT_RED,
    ];

    // Add all products with incremental verification
    let expectedCount = 0;
    for (const product of allProducts) {
      await inventoryPage.addProductToCart(product);
      expectedCount++;

      // Verify incremental count
      const cartCount =
        (await inventoryPage.shoppingCartBadge.textContent()) || "0";
      expect(cartCount).toBe(expectedCount.toString());
    }

    // Final verification
    const finalCount =
      (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(finalCount).toBe("6");

    // Verify all buttons changed to Remove
    for (const product of allProducts) {
      await expect(inventoryPage.getRemoveButton(product)).toBeVisible();
    }

    // Performance: Should complete in reasonable time
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(10000); // 10 seconds for all products
    console.log(`Added all 6 products in ${totalTime}ms`);
  });

  test("performance: rapid add and remove operations", async ({
    page,
    inventoryPage,
  }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Rapid cart operations",
      description:
        "Performance test: Verify cart handles rapid add/remove efficiently",
      severity: "normal",
      tags: ["performance", "stress"],
    });

    await page.goto(URLS.INVENTORY);

    const startTime = Date.now();

    // Rapid add operations
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    await inventoryPage.addProductToCart(PRODUCTS.BOLT_TSHIRT);

    // Verify count after adds
    let cartCount =
      (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCount).toBe("3");

    // Rapid remove operations
    await inventoryPage.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
    await inventoryPage.removeProductFromCart(PRODUCTS.BOLT_TSHIRT);

    const operationTime = Date.now() - startTime;

    // Verify final state
    cartCount = (await inventoryPage.shoppingCartBadge.textContent()) || "0";
    expect(cartCount).toBe("1");

    // Verify only correct item remains
    await expect(
      inventoryPage.getRemoveButton(PRODUCTS.BACKPACK)
    ).toBeVisible();
    await expect(
      inventoryPage.getAddToCartButton(PRODUCTS.BIKE_LIGHT)
    ).toBeVisible();
    await expect(
      inventoryPage.getAddToCartButton(PRODUCTS.BOLT_TSHIRT)
    ).toBeVisible();

    // Performance assertion: 5 operations in under 5 seconds
    expect(operationTime).toBeLessThan(5000);
    console.log(
      `5 rapid operations completed in ${operationTime}ms (avg: ${(
        operationTime / 5
      ).toFixed(0)}ms per operation)`
    );
  });

  test("performance: page load time", async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.SHOPPING_CART,
      story: "Inventory page load performance",
      description: "Verify inventory page loads within acceptable time",
      severity: "normal",
      tags: ["performance", "nfr"],
    });

    const startTime = Date.now();

    await page.goto(URLS.INVENTORY);

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
    console.log(`Inventory page loaded in ${loadTime}ms`);
  });
});
