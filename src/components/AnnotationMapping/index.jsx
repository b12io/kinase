import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AnnotationMappingField from 'components/AnnotationMappingField';

import styles from './style.scss';

function AnnotationMapping(props) {
  const fields = Object.keys(props.schema).map(fieldName => (
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
  schema: PropTypes.objectOf(PropTypes.string),
  annotationName: PropTypes.string.isRequired,
};
AnnotationMapping.defaultProps = {
  schema: {},
};

export default connect(
  (state, ownProps) => ({
    schema: state.schema[ownProps.annotationName],
  }),
)(AnnotationMapping);
