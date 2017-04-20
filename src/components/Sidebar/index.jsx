import MdSave from 'react-icons/lib/md/save';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AnnotatedItem from 'components/AnnotatedItem';
import { saveAnnotatedItems } from 'redux/proxyActions';
import { annotationContextType } from 'redux/reducers/annotationContext';
import { currentContextSelector } from 'redux/selectors';

import 'sweetalert2/dist/sweetalert2.css';
import styles from './style.scss';

function Sidebar(props) {
  const annotatedItems = Object.keys(props.context).map(annotationName => (
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
  context: annotationContextType.isRequired,
};

export default connect(
  state => ({
    context: currentContextSelector(state),
  }),
  dispatch => ({
    saveAnnotatedItems: () => dispatch(saveAnnotatedItems()),
  }),
)(Sidebar);
