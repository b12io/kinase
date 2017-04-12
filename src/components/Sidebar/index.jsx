import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Annotation from 'components/Annotation';

import styles from './style.scss';

function Sidebar(props) {
  const annotations = Object.keys(props.annotations).map(annotationName => (
    <li key={annotationName}>
      <Annotation annotationName={annotationName} />
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
  annotations: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
};
Sidebar.defaultProps = {
  annotations: {},
};

const mapStateToProps = state => ({
  annotations: state.annotations,
});

export default connect(
  mapStateToProps,
)(Sidebar);
