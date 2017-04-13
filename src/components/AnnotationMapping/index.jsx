import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AnnotationMappingField from 'components/AnnotationMappingField';

import styles from './style.scss';

function AnnotationMapping(props) {
  const fields = Object.keys(props.annotation).map(fieldName => (
    <li key={fieldName}>
      <AnnotationMappingField annotationName={props.annotationName} fieldName={fieldName} />
    </li>
  ));
  return (
    <div className={styles.annotation}>
      <span>{props.annotationName}</span>
      <ul>{fields}</ul>
    </div>
  );
}

AnnotationMapping.propTypes = {
  annotation: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
  annotationName: PropTypes.string.isRequired,
};
AnnotationMapping.defaultProps = {
  annotation: {},
};

export default connect(
  (state, ownProps) => ({
    annotation: state.annotations[ownProps.annotationName],
  }),
)(AnnotationMapping);
