import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ImageField from 'components/ImageField';
import { setCurrentField, updateField } from 'redux/proxyActions';

import styles from './style.scss';

class AnnotatedItemField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.mapping.content || '' });
  }

  getField() {
    switch (this.props.fieldType) {
      case 'text':
        return (
          <textarea
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            onFocus={this.props.setFocus}
          />
        );
      case 'image':
        return (
          <div onClick={this.props.setFocus}>
            <ImageField
              singleFile
              file={this.getMockFile()}
              eventHandlers={{ removedfile: this.removeFile.bind(this) }}
            />
          </div>
        );
      default:
        throw new Error('Invalid field type.');
    }
  }

  getMockFile() {
    const url = this.props.mapping.content;
    if (url) {
      return {
        url,
        size: 0,
      };
    }
    return null;
  }

  removeFile() {
    this.props.updateMapping(null, null);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className={styles.annotatedItemField}>
        <div>{this.props.fieldName}</div>
        <div>{this.props.mapping.source}</div>
        { this.getField() }
      </div>
    );
  }
}

AnnotatedItemField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  mapping: PropTypes.objectOf(PropTypes.string),
  setFocus: PropTypes.func.isRequired,
  updateMapping: PropTypes.func.isRequired,
};

AnnotatedItemField.defaultProps = {
  mapping: {},
};

export default connect(
  (state, ownProps) => ({
    fieldType: state.schema[ownProps.annotationName][ownProps.fieldName],
    isCurrent: (
      state.currentAnnotation === ownProps.annotationName &&
      state.currentField === ownProps.fieldName),
    mapping: state.mappings[ownProps.annotationName][ownProps.fieldName],
  }),
  (dispatch, ownProps) => ({
    setFocus: () => dispatch(
      setCurrentField(ownProps.annotationName, ownProps.fieldName)),
    updateMapping: (content, source) => dispatch(
      updateField(ownProps.annotationName, ownProps.fieldName, content, source)),
  }),
)(AnnotatedItemField);
