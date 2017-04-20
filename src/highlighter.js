/* global document */

import isUndefined from 'lodash.isundefined';
import Tether from 'tether';

import styles from 'main.scss';

export default class Highlighter {
  constructor() {
    this.padding = 5;
    this.element = document.createElement('div');
    this.element.setAttribute('class', styles.tentHighlight);
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }

  highlight(target) {
    this.element.style.display = 'block';
    this.element.style.width = `${target.offsetWidth + this.padding}px`;
    this.element.style.height = `${target.offsetHeight + this.padding}px`;
    if (!isUndefined(this.tether)) {
      this.tether.target.classList.remove(styles.tentHighlightTarget);
      this.tether.destroy();
    }
    target.classList.add(styles.tentHighlightTarget);
    this.tether = new Tether({
      target,
      element: this.element,
      attachment: 'center middle',
      targetAttachment: 'center middle',
    });
  }
}
