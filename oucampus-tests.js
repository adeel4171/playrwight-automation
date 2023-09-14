const { chromium } = require('playwright');
const config = require('./config'); // Import configuration file

(async () => {
  const browser = await chromium.launch({
    headless: false
  })

  const page = await browser.newPage();

  const oucampusConfig = config.oucampus;

  const { host, skin, account, site, username, password } = oucampusConfig;

  // Build the URL based on the configuration settings
  const url = `https://${host}/11/#${skin}/${account}/${site}`;
  console.log(url)

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('input[name="username"]', { timeout: 30000 });

    // Fill in the login form
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);

    await page.click('button[type="submit"]');

    await page.waitForSelector('//*[@id="dashboard-view"]/div[1]/div[2]/h2', { timeout: 40000 });

    console.log('Login successful! Test passed.');
  } catch (error) {
    // Check for an error message that indicates an incorrect password

    if (await page.isVisible('//*[@id="login-alert"]')) {
      console.error('Password is incorrect! Test failed.');
    } else {
      console.log(error)
      console.error('Login failed for an unknown reason! Test failed.');
    }
  } finally {
    await browser.close();
  }
})();
