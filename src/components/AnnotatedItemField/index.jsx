import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'rc-collapse';
import { connect } from 'react-redux';

import ImageField from 'components/ImageField';
import { schemaSelector } from 'redux/selectors';
import { setCurrentField } from 'redux/proxyActions';

import 'rc-collapse/assets/index.css';
import styles from './style.scss';

class AnnotatedItemField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.mapping.content || '' };

    this.handleChange = this.handleChange.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
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
        name: this.props.mapping.content,
      };
    }
    return null;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
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
              {this.getField()}
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Source</div>
              <div className={styles.mappingSourcePath}>
                {this.props.mapping.source}
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

AnnotatedItemField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  mapping: PropTypes.objectOf(PropTypes.string),
  resetFocus: PropTypes.func.isRequired,
  setFocus: PropTypes.func.isRequired,
};

AnnotatedItemField.defaultProps = {
  mapping: {},
};

export default connect(
  (state, ownProps) => ({
    fieldType: schemaSelector(state)[ownProps.annotationName].fields[ownProps.fieldName],
    isCurrent: (
      state.currentAnnotation === ownProps.annotationName &&
      state.currentIndex === ownProps.collectionIndex &&
      state.currentField === ownProps.fieldName),
    mapping: state.mappings[ownProps.annotationName][ownProps.collectionIndex][ownProps.fieldName],
  }),
  (dispatch, ownProps) => ({
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
