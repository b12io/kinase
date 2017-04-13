import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AnnotationMapping from 'components/AnnotationMapping';

import styles from './style.scss';

function Sidebar(props) {
  const annotations = Object.keys(props.annotations).map(annotationName => (
    <li key={annotationName}>
      <AnnotationMapping annotationName={annotationName} />
    </li>
  ));
  return (
    <div className={styles.sidebar}>
      <header>Tent</header>
      <ul>{annotations}</ul>
    </div>
  );
}

Sidebar.propTypes = {
  annotations: PropTypes.objectOf(PropTypes.objectOf(PropTypes.objectOf(PropTypes.string))),
};
Sidebar.defaultProps = {
  annotations: {},
};

export default connect(
  state => ({
    annotations: state.annotations,
  }),
)(Sidebar);
