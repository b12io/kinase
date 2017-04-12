/* global chrome */

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript(null, {
    file: 'dist/main.js',
  });
});
