/* global document, HTMLImageElement */

import classNames from 'classnames';
import map from 'lodash.map';
import trim from 'lodash.trim';
import CssSelectorGenerator from 'css-selector-generator';
import FaTags from 'react-icons/lib/fa/tags';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Highlighter from 'components/Highlighter';
import Sidebar from 'components/Sidebar';
import {
  selectElement as _selectElement,
  setExpanded as _setExpanded,
} from 'redux/proxyActions';
import { currentFieldTypeSelector } from 'redux/selectors';

import styles from './style.scss';

const selectorGenerator = new CssSelectorGenerator({
  // TODO(jrbotros): Exclude specific classes (e.g., `tether-*`) but allow others
  selectors: ['id', 'tag', 'nthchild'],
});

const getWrappedText = (node, rich = false) => {
  if (node.nodeType === node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.tagName === 'BR') {
    return rich ? '<br>' : '\n';
  }
  const text = map(node.childNodes, child => getWrappedText(child, rich));
  return trim(text.join(''));
};

const getWrappedImage = node => (
  node instanceof HTMLImageElement && node.src ? node.src : null);

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightTarget: null,
    };
    this.clickMain = this.clickMain.bind(this);
    this.mouseOverMain = this.mouseOverMain.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  getWrappedContent(node) {
    switch (this.props.currentFieldType) {
      case 'text': {
        return getWrappedText(node);
      }
      case 'rich-text': {
        return getWrappedText(node, true);
      }
      case 'image': {
        return getWrappedImage(node);
      }
      default: {
        return null;
      }
    }
  }

  mouseOverMain(event) {
    if (this.getWrappedContent(event.target)) {
      this.setState({ highlightTarget: event.target });
    }
  }

  clickMain(event) {
    const content = this.getWrappedContent(event.target);
    if (content) {
      const selector = selectorGenerator.getSelector(event.target);
      // Append the content if the `cmd` or `windows` key is pressed
      this.props.selectElement(selector, content, event.metaKey);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  toggleOpen() {
    this.setState({ highlightTarget: null });
    this.props.setExpanded(!this.props.expanded);
  }

  render() {
    return (
      <div>
        <div
          className={
            classNames(styles.kinaseSidebar, {
              [styles.sidebarOpen]: this.props.expanded,
            })
          }
        >
          <Sidebar />
          <div className={styles.sidebarToggle} onClick={this.toggleOpen}>
            <FaTags />
          </div>
        </div>
        <div
          className={
            classNames(styles.kinaseMain, {
              [styles.sidebarOpen]: this.props.expanded,
            })
          }
          onClick={this.clickMain}
          onMouseOver={this.mouseOverMain}
          dangerouslySetInnerHTML={{ __html: this.props.body }}
        />
        <Highlighter target={this.state.highlightTarget} />
      </div>
    );
  }
}

Main.propTypes = {
  body: PropTypes.string.isRequired,
  currentFieldType: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  selectElement: PropTypes.func.isRequired,
  setExpanded: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    currentFieldType: currentFieldTypeSelector(state) || '',
    expanded: state.expanded,
  }),
  dispatch => ({
    selectElement: (selector, content, append) => dispatch(
      _selectElement(selector, content, append)),
    setExpanded: expanded => dispatch(_setExpanded(expanded)),
  }),
)(Main);
