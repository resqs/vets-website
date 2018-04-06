/* eslint-disable camelcase, strict */
'use strict';

const electron = require('electron');
const chromedriver = require('chromedriver');
const seleniumServer = require('selenium-server');

require('babel-core/register');

const selenium_server_port = process.env.SELENIUM_PORT || 4444;

module.exports = {
  src_folders: ['./test', './src'],
  output_folder: './logs/nightwatch',
  custom_commands_path: './test/util/nightwatch-commands',
  custom_assertions_path: './test/util/nightwatch-assertions',
  live_output: true,
  parallel_process_delay: 10,
  disable_colors: process.env.BUILDTYPE === 'production',
  test_workers: false,
  test_settings: {
    'default': {
      launch_url: `localhost:${process.env.WEB_PORT || 3333}`,
      filter: '**/*.e2e.spec.js',
      selenium_host: 'localhost',
      selenium_port: selenium_server_port,
      use_ssl: false,
      silent: true,
      output: true,
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'logs/screenshots'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        webStorageEnabled: true,
        chromeOptions: {
          binary: electron,
          args: ['--window-size=1024,768']
        }
      },
      selenium: {
        cli_args: {
          'webdriver.chrome.driver': chromedriver.path
        },
        start_process: true,
        server_path: seleniumServer.path,
        log_path: './logs/selenium',
        host: '127.0.0.1',
        port: selenium_server_port,
      },
      test_workers: {
        enabled: false,
        workers: parseInt(process.env.CONCURRENCY || 1, 10)
      },
    },
    accessibility: {
      filter: './test/accessibility/*.spec.js'
    },
    bestpractice: {
      globals: {
        rules: ['section508', 'wcag2a', 'wcag2aa', 'best-practice']
      }
    }
  }
};
