/* global document, HTMLImageElement */

import filter from 'lodash.filter';
import isNil from 'lodash.isnil';
import trim from 'lodash.trim';
import React from 'react';
import ReactDOM from 'react-dom';
import CssSelectorGenerator from 'css-selector-generator';
import { Provider } from 'react-redux';

import setupProxyStore from 'redux/proxyStore';
import Highlighter from 'highlighter';
import Sidebar from 'components/Sidebar';
import { loadAnnotations, selectElement } from 'redux/proxyActions';
import { currentFieldTypeSelector } from 'redux/selectors';

import styles from 'main.scss';

const selectorGenerator = new CssSelectorGenerator({
  // TODO(jrbotros): Exclude specific classes (e.g., `tether-*`) but allow others
  selectors: ['id', 'tag', 'nthchild'],
});

if (!document.querySelector(styles.tentMain)) {
  const store = setupProxyStore();

  const getWrappedText = (node) => {
    const textNodes = filter(
      node.childNodes, child => child.nodeType === child.TEXT_NODE);
    const combined = trim(
      textNodes.map(textNode => textNode.textContent).join(''));
    return combined || null;
  };

  const getWrappedImage = node => (
    node instanceof HTMLImageElement && node.src ? node.src : null);

  const getWrappedContent = (node) => {
    switch (currentFieldTypeSelector(store.getState())) {
      case 'rich-text':
      case 'text': {
        return getWrappedText(node);
      }
      case 'image': {
        return getWrappedImage(node);
      }
      default: {
        return null;
      }
    }
  };


  const mainContainer = document.createElement('div');
  mainContainer.setAttribute('class', styles.tentMain);
  mainContainer.innerHTML = document.body.innerHTML;

  const sidebarContainer = document.createElement('div');
  sidebarContainer.setAttribute('class', styles.tentSidebar);
  document.body.innerHTML = mainContainer.outerHTML;
  document.body.appendChild(sidebarContainer);

  const reactRoot = sidebarContainer.appendChild(document.createElement('div'));

  // Prevent inheriting styles from parent elements
  reactRoot.style.all = 'initial';

  const highlighter = new Highlighter();

  store.ready()
    .then(() => store.dispatch(loadAnnotations()))
    .then(() => {
      document.querySelector(`.${styles.tentMain}`)
        .addEventListener('mouseover', (event) => {
          if (getWrappedContent(event.target)) {
            highlighter.highlight(event.target);
          }
        });

      document.querySelector(`.${styles.tentMain}`)
        .addEventListener('click', (event) => {
          const content = getWrappedContent(event.target);
          if (!isNil(content)) {
            const selector = selectorGenerator.getSelector(event.target);
            // Append the content if the `cmd` or `windows` key is pressed
            store.dispatch(selectElement(selector, content, event.metaKey));
            event.preventDefault();
            event.stopPropagation();
          }
        });

      ReactDOM.render(
        <Provider store={store}>
          <Sidebar />
        </Provider>,
        reactRoot,
      );
    });
}
