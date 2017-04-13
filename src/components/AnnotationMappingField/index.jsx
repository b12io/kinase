import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import updateField from 'redux/proxyActions';

import styles from './style.scss';

class AnnotationMappingField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.mappedItem.content });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className={styles.annotationField}>
        <div>{this.props.fieldName}</div>
        <div>{this.props.mappedItem.source}</div>
        <textarea type="text" value={this.state.value} onChange={this.handleChange} />
      </div>
    );
  }
}

AnnotationMappingField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  mappedItem: PropTypes.objectOf(PropTypes.string),
};

AnnotationMappingField.defaultProps = {
  mappedItem: {},
};

export default connect(
  (state, ownProps) => ({
    mappedItem: state.annotations[ownProps.annotationName][ownProps.fieldName],
  }),
  (dispatch, ownProps) => ({
    updateField: value => dispatch(
      updateField(ownProps.annotationName, ownProps.fieldName, value)),
  }),
)(AnnotationMappingField);
