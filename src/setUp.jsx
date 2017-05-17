/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Main from 'components/Main';
import setupProxyStore from 'redux/proxyStore';
import { loadAnnotations } from 'redux/proxyActions';

import styles from 'main.scss';

const store = setupProxyStore();
store.ready()
  .then(() => store.dispatch(loadAnnotations()))
  .then(() => {
    if (!document.getElementsByClassName(styles.reactRoot).length) {
      const innerHTML = document.body.innerHTML;
      document.body.innerHTML = '';

      const reactRoot = document.createElement('div');
      reactRoot.classList.add(styles.reactRoot);
      document.body.append(reactRoot);

      ReactDOM.render(
        <Provider store={store}>
          <Main body={innerHTML} />
        </Provider>,
        reactRoot,
      );
    }
  });
