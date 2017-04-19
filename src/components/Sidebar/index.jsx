import MdSave from 'react-icons/lib/md/save';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AnnotatedItem from 'components/AnnotatedItem';
import { saveAnnotatedItems } from 'redux/proxyActions';
import { schemaSelector } from 'redux/selectors';

import 'sweetalert2/dist/sweetalert2.css';
import styles from './style.scss';

function Sidebar(props) {
  const annotatedItems = Object.keys(props.schema).map(annotationName => (
    <li key={annotationName}>
      <AnnotatedItem annotationName={annotationName} />
    </li>
  ));
  return (
    <div className={styles.sidebar}>
      <header>
        <span>Tent</span>
        <span onClick={props.saveAnnotatedItems}><MdSave /></span>
      </header>
      <ul>{annotatedItems}</ul>
    </div>
  );
}

Sidebar.propTypes = {
  saveAnnotatedItems: PropTypes.func.isRequired,
  schema: PropTypes.objectOf(PropTypes.shape({
    multiple: PropTypes.bool,
    fields: PropTypes.objectOf(PropTypes.string),
  })).isRequired,
};

export default connect(
  state => ({
    schema: schemaSelector(state),
  }),
  dispatch => ({
    saveAnnotatedItems: () => dispatch(saveAnnotatedItems()),
  }),
)(Sidebar);
