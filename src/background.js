/* global chrome */

chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.executeScript(null, {
    file: 'dist/main.js'
  })
})
