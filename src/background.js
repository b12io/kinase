/* global chrome */

import { createStore } from 'redux';
import { wrapStore } from 'react-chrome-redux';

import annotations from 'redux/annotations';

const store = createStore(annotations);
wrapStore(store, { portName: 'TENT' });

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript(null, {
    file: 'dist/main.js',
  });
});
