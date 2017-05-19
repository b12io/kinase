import classNames from 'classnames';
import Collapse from 'rc-collapse';
import PropTypes from 'prop-types';
import React from 'react';
import MdClear from 'react-icons/lib/md/clear';
import MdInput from 'react-icons/lib/md/input';
import { connect } from 'react-redux';

import ImageField from 'forms/ImageField';
import TextField from 'forms/TextField';
import RichTextField from 'forms/RichTextField';
import { annotatedItemFieldType } from 'redux/reducers/annotatedItemField';
import {
  currentAnnotationSelector,
  currentContextSelector,
  currentFieldSelector,
} from 'redux/selectors';
import { setCurrentField, updateField } from 'redux/proxyActions';

import 'react-quill/dist/quill.snow.css';
import 'rc-collapse/assets/index.css';
import styles from './style.scss';

class AnnotatedItemField extends React.Component {
  constructor(props) {
    super(props);
    this.changeFile = this.changeFile.bind(this);
    this.editText = this.editText.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.toggleFocus = this.toggleFocus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.mapping.content || '' });
  }

  getField() {
    switch (this.props.fieldType) {
      case 'rich-text': {
        return (
          <RichTextField value={this.props.mapping.content} onChange={this.editText} />
        );
      }
      case 'text': {
        return (
          <TextField value={this.props.mapping.content} onChange={this.editText} />
        );
      }
      case 'image': {
        const mock = this.getMockFile();
        return (
          <ImageField
            singleFile
            file={mock}
            eventHandlers={{ addedfile: this.changeFile }}
          />
        );
      }
      default: {
        throw new Error('Invalid field type.');
      }
    }
  }

  getMockFile() {
    const url = this.props.mapping.content;
    if (url) {
      return {
        url,
        size: 0,
        name: this.props.mapping.content,
      };
    }
    return null;
  }

  changeFile(file) {
    this.props.editField(file.url);
  }

  editText(text) {
    if (!text) {
      // Implicitly clear the content and annotations if the user has
      // deleted all of their text.
      this.props.clearContent();
    } else {
      this.props.editField(text);
    }
  }

  toggleCollapse(activeKeys) {
    // TODO(jrbotros): Find a nicer way to determine whether collapsed
    if (activeKeys.length && this.props.focused) {
      this.props.resetFocus();
    }
  }

  toggleFocus() {
    if (this.props.focused) {
      this.props.resetFocus();
    } else {
      this.props.setFocus();
    }
  }

  render() {
    return (
      <div
        className={classNames(styles.annotatedItemField, {
          [styles.selectionMode]: this.props.focused,
        })}
      >
        <Collapse accordion={false} onChange={this.toggleCollapse}>
          <Collapse.Panel header={this.props.fieldName}>
            <div className={styles.selectionTools}>
              <MdClear
                className={styles.clearContent}
                onClick={this.props.clearContent}
                title={'Clear Content'}
              />
              <MdInput
                className={styles.selectContent}
                onClick={this.toggleFocus}
                title={this.props.focused ? 'Finished Mapping' : 'Map Content'}
              />
            </div>
            <div className={styles.fieldGroup}>
              {this.getField()}
            </div>
            {
              this.props.focused
              ? <div className={styles.helpText}>cmd + click to select multiple items</div>
              : undefined
            }
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

AnnotatedItemField.propTypes = {
  clearContent: PropTypes.func.isRequired,
  editField: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
  mapping: annotatedItemFieldType.isRequired,
  resetFocus: PropTypes.func.isRequired,
  setFocus: PropTypes.func.isRequired,
};

export default connect(
  (state, ownProps) => ({
    focused: (
      currentAnnotationSelector(state) === ownProps.annotationName &&
      currentFieldSelector(state) === ownProps.fieldName
    ),
    fieldType: currentContextSelector(state)[
      ownProps.annotationName].schema.fields[ownProps.fieldName],
    mapping: currentContextSelector(state)[
      ownProps.annotationName].collectionMappings[ownProps.collectionIndex][ownProps.fieldName],
  }),
  (dispatch, ownProps) => ({
    clearContent: () => dispatch(
      updateField(
        ownProps.annotationName,
        ownProps.collectionIndex,
        ownProps.fieldName,
        {
          content: null,
          original: null,
          sources: [],
        },
      ),
    ),
    editField: content => dispatch(
      updateField(
        ownProps.annotationName,
        ownProps.collectionIndex,
        ownProps.fieldName,
        { content },
      ),
    ),
    resetFocus: () => dispatch(setCurrentField()),
    setFocus: () => dispatch(
      setCurrentField(
        ownProps.annotationName,
        ownProps.collectionIndex,
        ownProps.fieldName,
      ),
    ),
  }),
)(AnnotatedItemField);
