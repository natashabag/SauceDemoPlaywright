import { faker } from '@faker-js/faker';

/**
 * Test Data Generator using Faker
 * Provides consistent, realistic test data for all tests
 */

export interface CustomerData {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  zipCode: string;
  address: string;
  city: string;
  state: string;
}

export interface CreditCardData {
  number: string;
  cvv: string;
  expirationDate: string;
  cardholderName: string;
}

/**
 * Generate random customer data
 */
export function generateCustomerData(): CustomerData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    zipCode: faker.location.zipCode(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
  };
}

/**
 * Generate random credit card data (for testing only - not real cards)
 */
export function generateCreditCardData(): CreditCardData {
  return {
    number: faker.finance.creditCardNumber(),
    cvv: faker.finance.creditCardCVV(),
    expirationDate: faker.date.future().toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }),
    cardholderName: faker.person.fullName(),
  };
}

/**
 * Generate a random username
 */
export function generateUsername(): string {
  return faker.internet.userName();
}

/**
 * Generate a random password
 */
export function generatePassword(length: number = 12): string {
  return faker.internet.password({ length, memorable: false });
}

/**
 * Generate random product review data
 */
export function generateProductReview() {
  return {
    rating: faker.number.int({ min: 1, max: 5 }),
    title: faker.lorem.sentence(),
    comment: faker.lorem.paragraph(),
    reviewerName: faker.person.fullName(),
  };
}

/**
 * Seed Faker for reproducible test data
 * Use this in tests where you need the same data every time
 */
export function seedFaker(seed: number = 12345) {
  faker.seed(seed);
}

/**
 * Get a random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return faker.helpers.arrayElement(array);
}

/**
 * Get multiple random items from an array
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
  return faker.helpers.arrayElements(array, count);
}
