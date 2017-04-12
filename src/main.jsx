/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';

import Sidebar from './components/Sidebar';
import styles from './main.scss';

if (!document.querySelector('tent-main')) {
  const store = new Store({
    portName: 'TENT',
  });

  const mainContainer = document.createElement('div');
  mainContainer.setAttribute('class', styles.tentMain);
  mainContainer.innerHTML = document.body.innerHTML;

  const sidebarContainer = document.createElement('div');
  sidebarContainer.setAttribute('class', styles.tentSidebar);
  document.body.innerHTML = mainContainer.outerHTML;
  document.body.appendChild(sidebarContainer);

  store.ready().then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Sidebar />
      </Provider>,
      sidebarContainer);
  });
}
