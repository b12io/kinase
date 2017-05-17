/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Main from 'components/Main';
import setupProxyStore from 'redux/proxyStore';
import { loadAnnotations } from 'redux/proxyActions';

const store = setupProxyStore();
store.ready()
  .then(() => store.dispatch(loadAnnotations()))
  .then(() => {
    const innerHTML = document.body.innerHTML;
    document.body.innerHTML = '';

    const reactRoot = document.createElement('div');
    document.body.append(reactRoot);

    // Prevent inheriting styles from parent elements
    reactRoot.style.all = 'initial';
    reactRoot.style.display = 'block';

    ReactDOM.render(
      <Provider store={store}>
        <Main body={innerHTML} />
      </Provider>,
      reactRoot,
    );
  });
