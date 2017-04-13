/* global chrome */

import { createStore, applyMiddleware } from 'redux';
import { alias, wrapStore } from 'react-chrome-redux';
import thunk from 'redux-thunk';

import aliases from 'redux/aliases';
import annotations from 'redux/annotations';
import { PORT_NAME } from 'redux/constants';

const store = createStore(
  annotations,
  applyMiddleware(
    alias(aliases),
    thunk,
  ),
);
wrapStore(store, { portName: PORT_NAME });

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript(null, {
    file: 'dist/main.js',
  });
});
