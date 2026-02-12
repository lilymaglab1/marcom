const { chromium } = require('playwright');

(async () => {
    try {
        console.log('Attempting to launch browser...');
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:5173');
        console.log('Page title:', await page.title());
        await browser.close();
        console.log('Browser test successful!');
    } catch (err) {
        console.error('Browser test failed:', err);
        process.exit(1);
    }
})();
