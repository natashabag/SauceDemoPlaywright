import { test, expect } from "@playwright/test";
import { InventoryPage } from "../src/pages/InventoryPage";
import { setAllureMetadata, EPICS, FEATURES } from "../src/utils/allure-helper";
import { URLS, SORT_OPTIONS } from "../src/constants";

test.describe("Product Sorting Functionality", () => {
  test("sort products by name (A to Z)", async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.PRODUCT_CATALOG,
      story: "Sort products alphabetically",
      description:
        "Verify that products can be sorted alphabetically from A to Z",
    });

    await page.goto(URLS.INVENTORY);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.productSortDropdown.selectOption(
      SORT_OPTIONS.NAME_A_TO_Z
    );

    const productNames = await inventoryPage.productItems
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();

    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  test("sort products by name (Z to A)", async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.PRODUCT_CATALOG,
      story: "Sort products reverse alphabetically",
      description:
        "Verify that products can be sorted alphabetically from Z to A",
    });

    await page.goto(URLS.INVENTORY);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.productSortDropdown.selectOption(
      SORT_OPTIONS.NAME_Z_TO_A
    );

    const productNames = await inventoryPage.productItems
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();

    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
  });

  test("sort products by price (low to high)", async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.PRODUCT_CATALOG,
      story: "Sort products by price ascending",
      description:
        "Verify that products can be sorted by price from low to high",
    });

    await page.goto(URLS.INVENTORY);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.productSortDropdown.selectOption(
      SORT_OPTIONS.PRICE_LOW_TO_HIGH
    );

    const priceTexts = await inventoryPage.productItems
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();

    const prices = priceTexts.map((price) =>
      parseFloat(price.replace("$", ""))
    );
    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedPrices);
  });

  test("sort products by price (high to low)", async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.PRODUCT_CATALOG,
      story: "Sort products by price descending",
      description:
        "Verify that products can be sorted by price from high to low",
    });

    await page.goto(URLS.INVENTORY);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.productSortDropdown.selectOption(
      SORT_OPTIONS.PRICE_HIGH_TO_LOW
    );

    const priceTexts = await inventoryPage.productItems
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();

    const prices = priceTexts.map((price) =>
      parseFloat(price.replace("$", ""))
    );
    const sortedPrices = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sortedPrices);
  });

  test("verify product count remains same after sorting", async ({ page }) => {
    await setAllureMetadata({
      epic: EPICS.ECOMMERCE,
      feature: FEATURES.PRODUCT_CATALOG,
      story: "Product count consistency during sorting",
      description:
        "Verify that product count remains unchanged when sorting is applied",
    });

    await page.goto(URLS.INVENTORY);
    const inventoryPage = new InventoryPage(page);

    const initialCount = await inventoryPage.productItems.count();

    // Test all sort options maintain the same product count
    const sortOptions = [
      SORT_OPTIONS.NAME_Z_TO_A,
      SORT_OPTIONS.PRICE_LOW_TO_HIGH,
      SORT_OPTIONS.PRICE_HIGH_TO_LOW,
    ];

    for (const sortOption of sortOptions) {
      await inventoryPage.productSortDropdown.selectOption(sortOption);
      const countAfterSort = await inventoryPage.productItems.count();
      expect(countAfterSort).toBe(initialCount);
    }
  });
});
