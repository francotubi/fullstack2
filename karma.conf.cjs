const fs = require('node:fs');
const candidates = [
    process.env.CHROME_BIN,
    process.env.PROGRAMFILES &&
        process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['PROGRAMFILES(X86)'] &&
        process.env['PROGRAMFILES(X86)'] +
            '\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA &&
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
];
if (!process.env.CHROME_BIN) {
    const chrome = candidates.find((p) => p && fs.existsSync(p));
    if (chrome) process.env.CHROME_BIN = chrome;
}
module.exports = (config) =>
    config.set({
        frameworks: ['jasmine'],
        files: [
            '.test-build/tests.js',
            {
                pattern: 'public/**/*',
                included: false,
                served: true,
                watched: false,
            },
        ],
        proxies: {
            '/images/': '/base/public/images/',
            '/placeholder.svg': '/base/public/placeholder.svg',
        },
        reporters: ['progress', 'coverage'],
        browsers: [process.env.KARMA_BROWSER || 'ChromeHeadlessLocal'],
        customLaunchers: {
            ChromeHeadlessLocal: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                ],
            },
        },
        singleRun: true,
        client: { jasmine: { random: false } },
        coverageReporter: {
            dir: 'coverage',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'text-summary' },
                { type: 'json-summary', subdir: '.' },
            ],
        },
        browserNoActivityTimeout: 60000,
    });
