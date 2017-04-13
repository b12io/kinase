/* global document, HTMLImageElement */

import filter from 'lodash.filter';
import isNil from 'lodash.isnil';
import trim from 'lodash.trim';
import React from 'react';
import ReactDOM from 'react-dom';
import unique from 'unique-selector';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';

import Sidebar from 'components/Sidebar';
import styles from 'main.scss';
import { PORT_NAME } from 'redux/constants';
import { selectElement } from 'redux/proxyActions';

const removeHighlight = (node) => {
  node.classList.remove(styles.tentHighlight);
  node.classList.remove(styles.disableLink);
};

const highlight = (node) => {
  if (node.attributes.href) {
    node.classList.add(styles.disableLink);
  }
  // TODO: Highlight shouldn't interfere with website display
  node.classList.add(styles.tentHighlight);
};

const getWrappedText = (node) => {
  const textNodes = filter(
    node.childNodes, child => child.nodeType === child.TEXT_NODE);
  const combined = trim(
    textNodes.map(textNode => textNode.textContent).join(''));
  return combined || null;
};

const getWrappedImage = node => (
  node instanceof HTMLImageElement && node.src ? node.src : null);

const getWrappedContent = node => getWrappedText(node) || getWrappedImage(node);

if (!document.querySelector('tent-main')) {
  const store = new Store({
    portName: PORT_NAME,
  });

  const mainContainer = document.createElement('div');
  mainContainer.setAttribute('class', styles.tentMain);
  mainContainer.innerHTML = document.body.innerHTML;

  const sidebarContainer = document.createElement('div');
  sidebarContainer.setAttribute('class', styles.tentSidebar);
  document.body.innerHTML = mainContainer.outerHTML;
  document.body.appendChild(sidebarContainer);

  let currentNode = null;
  document.querySelector(`.${styles.tentMain}`)
    .addEventListener('mouseover', (event) => {
      if (currentNode) {
        removeHighlight(currentNode);
      }
      if (getWrappedContent(event.target)) {
        highlight(event.target);
        currentNode = event.target;
      }
    });

  document.querySelector(`.${styles.tentMain}`)
    .addEventListener('click', (event) => {
      const content = getWrappedContent(event.target);
      if (!isNil(content)) {
        store.dispatch(selectElement(unique(event.target), content));
      }
    });

  store.ready().then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Sidebar />
      </Provider>,
      sidebarContainer);
  });
}
