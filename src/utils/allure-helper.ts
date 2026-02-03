import { allure } from 'allure-playwright';

export interface AllureMetadata {
  epic?: string;
  feature?: string;
  story?: string;
  description?: string;
  severity?: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
  owner?: string;
  tags?: string[];
}

/**
 * Helper function to set Allure metadata in a single call
 * @param metadata - Object containing epic, feature, story, description, etc.
 * 
 * @example
 * await setAllureMetadata({
 *   epic: 'E-Commerce',
 *   feature: 'Checkout',
 *   story: 'Complete purchase flow',
 *   description: 'Verify user can complete checkout',
 *   severity: 'critical'
 * });
 */
export async function setAllureMetadata(metadata: AllureMetadata): Promise<void> {
  if (metadata.epic) await allure.epic(metadata.epic);
  if (metadata.feature) await allure.feature(metadata.feature);
  if (metadata.story) await allure.story(metadata.story);
  if (metadata.description) await allure.description(metadata.description);
  if (metadata.severity) await allure.severity(metadata.severity);
  if (metadata.owner) await allure.owner(metadata.owner);
  if (metadata.tags) {
    for (const tag of metadata.tags) {
      await allure.tag(tag);
    }
  }
}

// Predefined epic constants for consistency
export const EPICS = {
  ECOMMERCE: 'E-Commerce',
  AUTHENTICATION: 'Authentication',
  USER_MANAGEMENT: 'User Management',
  REPORTING: 'Reporting',
} as const;

// Predefined feature constants
export const FEATURES = {
  LOGIN: 'Login',
  CHECKOUT: 'Checkout',
  SHOPPING_CART: 'Shopping Cart',
  PRODUCT_CATALOG: 'Product Catalog',
  USER_PROFILE: 'User Profile',
} as const;
