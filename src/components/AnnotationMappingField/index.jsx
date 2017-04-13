import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import updateField from 'redux/actions';

import styles from './style.scss';

function AnnotationMappingField(props) {
  return (
    <div className={styles.annotationField}>
      <span>{props.fieldName}</span>
    </div>
  );
}

AnnotationMappingField.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default connect(
  (state, ownProps) => ({
    mappedId: state.annotations[ownProps.annotationName][ownProps.fieldName],
  }),
  (dispatch, ownProps) => ({
    updateField: value => dispatch(
      updateField(ownProps.annotationName, ownProps.fieldName, value)),
  }),
)(AnnotationMappingField);
