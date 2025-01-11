const puppeteer = require('puppeteer');

(async () => {
  // Launch headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the URL from the command-line arguments
  const url = process.argv[2];  // Accept the URL from PHP via command-line
  const questionImage = process.argv[3]; // Get the dynamic question image filename
  const answerImage = process.argv[4]; // Get the dynamic answer image filename

  // Navigate to the URL
  await page.goto(url, { waitUntil: 'networkidle0' });

  try {
    // Wait for the question and answer divs to load
    await page.waitForSelector('.qa-q-view-main form');  // Update with the actual selector for question div
    await page.waitForSelector('article.qa-a-list-item');    // Update with the actual selector for answer div

    // Capture screenshots of the question and answer divs
    const questionDiv = await page.$('.qa-q-view-main form'); // Adjust the selector
    if (questionDiv) {
      await questionDiv.screenshot({ path: questionImage });
    }

    const answerDiv = await page.$('article.qa-a-list-item .qa-a-item-main form'); // Adjust the selector
    if (answerDiv) {
      await answerDiv.screenshot({ path: answerImage });
    } else {
      const fallbackDiv = await page.$('article.qa-a-list-item .qa-a-item-main form');
      await fallbackDiv.screenshot({ path: answerImage });
    }

  } catch (e) {
    console.error('Error capturing the page: ', url);
    console.error('Error capturing the page: ', e.message);
  }

  // Close the browser
  await browser.close();
})();