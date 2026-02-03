import { test as setup } from "@playwright/test";
import { LoginPage } from "../../src/pages/LoginPage";
import { TEST_USERS, URL_PATTERNS } from "../../src/constants";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigateToLogin();
  await loginPage.login(
    TEST_USERS.STANDARD.username,
    TEST_USERS.STANDARD.password
  );

  // Wait for successful login by checking for inventory page
  await page.waitForURL(URL_PATTERNS.INVENTORY);

  // Save signed-in state
  await page.context().storageState({ path: authFile });
});
