// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  const dotenv = require('dotenv')
  const result = dotenv.config()

  if (result.error) {
    throw result.error
  }
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage', 'BrowserStack'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        {type: 'lcov', subdir: '.'},
        {type: 'text-summary'}
      ]
    },
    customLaunchers: {
      bs_chrome_windows: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'chrome'
      },

      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'chrome',
        os: 'OS X',
        os_version: 'Sierra'
      },

      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        os: 'OS X',
        os_version: 'Sierra'
      },

      bs_firefox_windows: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'chrome',
      },

      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '58.0',
        os: 'OS X',
        os_version: 'Sierra'
      },

      bs_ie_windows: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'ie',
        browser_version: '11.0'
      }
    },
    browsers: [
      'bs_chrome_windows'
    ],
    plugins: [
      'karma-browserstack-launcher',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-mocha',
      'karma-sinon-chai',
      'karma-sourcemap-loader',
      'karma-spec-reporter',
      'karma-webpack'
    ],
    browserStack: {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY
    },
    browserNoActivityTimeout: 60000,
    project: 'Fanelli Frontend'
  })
}
