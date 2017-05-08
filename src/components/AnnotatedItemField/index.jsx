import Collapse from 'rc-collapse';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ImageField from 'forms/ImageField';
import TextField from 'forms/TextField';
import RichTextField from 'forms/RichTextField';
import { annotatedItemFieldType } from 'redux/reducers/annotatedItemField';
import { currentContextSelector } from 'redux/selectors';
import { setCurrentField, updateField } from 'redux/proxyActions';

import 'react-quill/dist/quill.snow.css';
import 'rc-collapse/assets/index.css';
import styles from './style.scss';

class AnnotatedItemField extends React.Component {
  constructor(props) {
    super(props);
    this.changeFile = this.changeFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRichTextChange = this.handleRichTextChange.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.mapping.content || '' });
  }

  getField() {
    switch (this.props.fieldType) {
      case 'rich-text': {
        return (
          <RichTextField value={this.props.mapping.content} onChange={this.props.editField} />
        );
      }
      case 'text': {
        return (
          <TextField value={this.props.mapping.content} onChange={this.props.editField} />
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

  handleChange(event) {
    this.props.editField(event.target.value);
  }

  handleRichTextChange(value) {
    this.props.editField(value);
  }

  toggleCollapse(activeKeys) {
    // TODO(jrbotros): Find a nicer way to determine whether collapsed
    return activeKeys.length ? Promise.resolve() : this.props.resetFocus();
  }

  render() {
    return (
      <div className={styles.annotatedItemField}>
        <Collapse accordion={false} onChange={this.toggleCollapse}>
          <Collapse.Panel header={this.props.fieldName}>
            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Content</div>
              <div onClick={this.props.setFocus}>
                {this.getField()}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Sources</div>
              <ul className={styles.mappingSourcePath}>
                {
                  this.props.mapping.sources.map(
                    source => (
                      <li
                        className={styles.mappingSource}
                        key={`${source.url}-${source.selector}`}
                      >
                        <div>{source.url}</div>
                        <div>{source.selector}</div>
                      </li>
                    ),
                  )
                }
              </ul>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

AnnotatedItemField.propTypes = {
  editField: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  mapping: annotatedItemFieldType.isRequired,
  resetFocus: PropTypes.func.isRequired,
  setFocus: PropTypes.func.isRequired,
};

export default connect(
  (state, ownProps) => ({
    fieldType: currentContextSelector(state)[
      ownProps.annotationName].schema.fields[ownProps.fieldName],
    mapping: currentContextSelector(state)[
      ownProps.annotationName].collectionMappings[ownProps.collectionIndex][ownProps.fieldName],
  }),
  (dispatch, ownProps) => ({
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
