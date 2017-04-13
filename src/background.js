/* global chrome */

import { createStore } from 'redux';
import { wrapStore } from 'react-chrome-redux';

import annotations from 'redux/annotations';
import { PORT_NAME } from 'redux/constants';

const store = createStore(annotations);
wrapStore(store, { portName: PORT_NAME });

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript(null, {
    file: 'dist/main.js',
  });
});
