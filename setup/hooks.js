const playwright = require('playwright');
const {BeforeAll, Before, After, AfterAll, Status, setDefaultTimeout} = require('@cucumber/cucumber');
const cucumber = require('../cucumber');

// const { World } = require('@cucumber/cucumber')

//Cucumber Timeout
setDefaultTimeout(60000);

// Launch options.
const run_headless = false
const options = {
    args: ["--start-maximized"], headless: run_headless, slowMo: 100, //devtools: true,
};

// Create a global browser for the test session.
BeforeAll(async () => {
  console.log('before all ...');
  global.browser = await playwright['chromium'].launch(options);
});

AfterAll(async () => {
  console.log('after all ...');
  await global.browser.close();
});

// Create a fresh browser context for each test.
Before(async () => {
  console.log('before ...');
  global.context = await global.browser.newContext();
  global.page = await global.context.newPage();
});

// close the page and context after each test.
// After(async () => {
//   console.log('after pass...');
//   await global.page.close();
//   await global.context.close();
// });


After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    var buffer = await global.page.screenshot({ path: `reports/${scenario.pickle.name}.png`, fullPage: true })
    this.attach(buffer, 'image/png');
  }
});

