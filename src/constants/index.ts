/**
 * Application URLs
 *
 * Centralized URL constants for SauceDemo application.
 * Using constants provides:
 * - Single source of truth for URLs
 * - Type safety and autocomplete
 * - Easy maintenance (change URL in one place)
 * - Clear documentation of available routes
 *
 * Usage:
 *   import { URLS } from '../src/constants';
 *   await page.goto(URLS.INVENTORY);
 */

export const URLS = {
  // Entry points
  LOGIN: "/",

  // Main pages
  INVENTORY: "/inventory.html",
  CART: "/cart.html",

  // Checkout flow
  CHECKOUT_STEP_ONE: "/checkout-step-one.html",
  CHECKOUT_STEP_TWO: "/checkout-step-two.html",
  CHECKOUT_COMPLETE: "/checkout-complete.html",
} as const;

/**
 * URL Patterns (RegExp)
 *
 * Regular expressions for URL matching in assertions.
 * Useful for expect(page).toHaveURL() checks.
 *
 * Usage:
 *   import { URL_PATTERNS } from '../src/constants';
 *   await expect(page).toHaveURL(URL_PATTERNS.INVENTORY);
 */
export const URL_PATTERNS = {
  LOGIN: /.*\/$/,
  INVENTORY: /.*inventory\.html/,
  CART: /.*cart\.html/,
  CHECKOUT_STEP_ONE: /.*checkout-step-one\.html/,
  CHECKOUT_STEP_TWO: /.*checkout-step-two\.html/,
  CHECKOUT_COMPLETE: /.*checkout-complete\.html/,
} as const;

/**
 * Test Users
 *
 * Available test users for SauceDemo.
 * Each user demonstrates different behaviors.
 */
export const TEST_USERS = {
  STANDARD: {
    username: "standard_user",
    password: "secret_sauce",
    description: "Standard user with full access",
  },
  LOCKED_OUT: {
    username: "locked_out_user",
    password: "secret_sauce",
    description: "User that has been locked out",
  },
  PROBLEM: {
    username: "problem_user",
    password: "secret_sauce",
    description: "User that experiences UI issues",
  },
  PERFORMANCE: {
    username: "performance_glitch_user",
    password: "secret_sauce",
    description: "User that experiences performance issues",
  },
  ERROR: {
    username: "error_user",
    password: "secret_sauce",
    description: "User that encounters errors",
  },
  VISUAL: {
    username: "visual_user",
    password: "secret_sauce",
    description: "User for visual regression testing",
  },
} as const;

/**
 * Product Names
 *
 * Available products in the inventory.
 * Prevents typos and provides autocomplete.
 */
export const PRODUCTS = {
  BACKPACK: "Sauce Labs Backpack",
  BIKE_LIGHT: "Sauce Labs Bike Light",
  BOLT_TSHIRT: "Sauce Labs Bolt T-Shirt",
  FLEECE_JACKET: "Sauce Labs Fleece Jacket",
  ONESIE: "Sauce Labs Onesie",
  TSHIRT_RED: "Test.allTheThings() T-Shirt (Red)",
} as const;

/**
 * Alias for TEST_USERS
 * For backwards compatibility and shorter imports
 */
export const USERS = TEST_USERS;

/**
 * Success Messages
 *
 * Expected success messages shown in the application.
 */
export const SUCCESS_MESSAGES = {
  ORDER_COMPLETE: "Thank you for your order",
  ORDER_DISPATCHED: "Your order has been dispatched",
} as const;

/**
 * Error Messages
 *
 * Expected error messages for validation.
 */
export const ERROR_MESSAGES = {
  LOCKED_OUT: "Epic sadface: Sorry, this user has been locked out",
  INVALID_CREDENTIALS:
    "Epic sadface: Username and password do not match any user in this service",
  USERNAME_REQUIRED: "Epic sadface: Username is required",
  PASSWORD_REQUIRED: "Epic sadface: Password is required",
  FIRST_NAME_REQUIRED: "Error: First Name is required",
  LAST_NAME_REQUIRED: "Error: Last Name is required",
  POSTAL_CODE_REQUIRED: "Error: Postal Code is required",
} as const;

/**
 * Sort Options
 *
 * Available sorting options for the product inventory.
 */
export const SORT_OPTIONS = {
  NAME_A_TO_Z: "az",
  NAME_Z_TO_A: "za",
  PRICE_LOW_TO_HIGH: "lohi",
  PRICE_HIGH_TO_LOW: "hilo",
} as const;
