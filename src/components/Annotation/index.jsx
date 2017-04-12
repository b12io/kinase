import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AnnotationField from 'components/AnnotationField';

import styles from './style.scss';

function Annotation(props) {
  const fields = Object.keys(props.annotation).map(fieldName => (
    <li key={fieldName}>
      <AnnotationField annotationName={props.annotationName} fieldName={fieldName} />
    </li>
  ));
  return (
    <div className={styles.annotation}>
      <span>{props.annotationName}</span>
      <ul>{fields}</ul>
    </div>
  );
}

Annotation.propTypes = {
  annotation: PropTypes.objectOf(PropTypes.string),
  annotationName: PropTypes.string.isRequired,
};
Annotation.defaultProps = {
  annotation: {},
};

const mapStateToProps = (state, ownProps) => ({
  annotation: state.annotations[ownProps.annotationName],
});

export default connect(
  mapStateToProps,
)(Annotation);
