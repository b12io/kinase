/* global document, HTMLElement */

import classNames from 'classnames';
import isUndefined from 'lodash.isundefined';
import React from 'react';
import Tether from 'tether';

import styles from './style.scss';

export default class Highlighter extends React.Component {
  constructor(props) {
    super(props);
    this.padding = 5;
  }

  componentDidUpdate() {
    this.clear();
    if (this.props.target) {
      this.highlight(this.props.target);
    }
  }

  clear() {
    if (!isUndefined(this.tether)) {
      this.tether.target.classList.remove(styles.kinaseHighlightTarget);
      this.tether.destroy();
    }
  }

  highlight(target) {
    this.element.style.width = `${target.offsetWidth + this.padding}px`;
    this.element.style.height = `${target.offsetHeight + this.padding}px`;
    target.classList.add(styles.kinaseHighlightTarget);
    this.tether = new Tether({
      target,
      element: this.element,
      attachment: 'center middle',
      targetAttachment: 'center middle',
    });
  }

  render() {
    return (
      <div
        className={classNames(styles.kinaseHighlight, {
          [styles.visible]: this.props.target,
        })}
        ref={(element) => { this.element = element; }}
      />
    );
  }
}

Highlighter.propTypes = {
  target: React.PropTypes.instanceOf(HTMLElement),
};

Highlighter.defaultProps = {
  target: null,
};
