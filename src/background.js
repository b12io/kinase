/* global chrome */

import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { alias, wrapStore } from 'react-chrome-redux';

import aliases from 'redux/aliases';
import main from 'redux/reducers/main';
import { promiseTypeSuffixes, PORT_NAME } from 'redux/constants';
import { setActive, setContextKey } from 'redux/proxyActions';

const store = createStore(
  main,
  applyMiddleware(
    alias(aliases),
    thunk,
    promiseMiddleware({
      promiseTypeSuffixes,
    }),
  ),
);
wrapStore(store, { portName: PORT_NAME });
export default store;

chrome.runtime.onMessageExternal.addListener((request) => {
  if (request.data.contextKey) {
    store.dispatch(setContextKey(request.data.contextKey));
  }
});

const setUp = (tabId = null) => {
  chrome.tabs.executeScript(tabId, {
    file: 'dist/setUp.js',
  });
};

const tearDown = (tabId = null) => {
  chrome.tabs.executeScript(tabId, {
    file: 'dist/tearDown.js',
  });
};

chrome.browserAction.onClicked.addListener(() => {
  const active = store.getState().active;
  store.dispatch(setActive(!active));

  let tabCallback;
  if (active) {
    // Tear down extension on all tabs
    tabCallback = tab => tearDown(tab.id);

    // Prevent set up when page is refreshed
    chrome.tabs.onUpdated.removeListener(setUp);
  } else {
    // Set up extension on all tabs
    tabCallback = tab => setUp(tab.id);

    // Set up extension when page is refreshed
    chrome.tabs.onUpdated.addListener(setUp);
  }
  chrome.tabs.query({}, tabs => tabs.forEach(tabCallback));
});
