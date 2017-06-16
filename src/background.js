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

// Store per-tab setup listeners to keep kinase active on refresh
const updatedListeners = {};

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true }, tabs => tabs.forEach((activeTab) => {
    // Toggle active state for active tab
    const kinaseActiveOnTab = store.getState().active[activeTab.id];
    store.dispatch(setActive(activeTab.id, !kinaseActiveOnTab));

    if (kinaseActiveOnTab) {
      // Tear down extension on active tab
      tearDown(activeTab.id);

      // Prevent set up when page is refreshed
      chrome.tabs.onUpdated.removeListener(updatedListeners[activeTab.id]);
      delete updatedListeners[activeTab.id];
    } else {
      // Set up extension on active tab
      setUp(activeTab.id);

      // Set up extension when page is refreshed
      updatedListeners[activeTab.id] = (tabId) => {
        if (tabId === activeTab.id) {
          setUp(tabId);
        }
      };
      chrome.tabs.onUpdated.addListener(updatedListeners[activeTab.id]);
    }
  }));
});
