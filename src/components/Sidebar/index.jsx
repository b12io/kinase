import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AnnotatedItem from 'components/AnnotatedItem';

import styles from './style.scss';

function Sidebar(props) {
  const annotatedItems = Object.keys(props.schema).map(annotationName => (
    <li key={annotationName}>
      <AnnotatedItem annotationName={annotationName} />
    </li>
  ));
  return (
    <div className={styles.sidebar}>
      <header>Tent</header>
      <ul>{annotatedItems}</ul>
    </div>
  );
}

Sidebar.propTypes = {
  schema: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
};
Sidebar.defaultProps = {
  schema: {},
};

export default connect(
  state => ({
    schema: state.schema,
  }),
)(Sidebar);
