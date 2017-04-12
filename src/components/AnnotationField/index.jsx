import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import updateField from 'redux/actions';

import styles from './style.scss';

function AnnotationField(props) {
  return (
    <div className={styles.annotationField}>
      <span>{props.fieldName}</span>
    </div>
  );
}

AnnotationField.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  mappedId: state.annotations[ownProps.annotationName][ownProps.fieldName],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateField: value => dispatch(
    updateField(ownProps.annotationName, ownProps.fieldName, value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnotationField);
