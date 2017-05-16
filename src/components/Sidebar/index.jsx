import MdSave from 'react-icons/lib/md/save';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';

import manifest from 'manifest.json';
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
        <span>{ manifest.name }</span>
        <span onClick={props.saveAnnotatedItems}>
          {
            props.saving
            ? <Spinner className={styles.saveSpinner} noFadeIn spinnerName={'three-bounce'} />
            : <MdSave className={styles.saveButton} />
          }
        </span>
      </header>
      <ul className={styles.annotationList}>{annotatedItems}</ul>
    </div>
  );
}

Sidebar.propTypes = {
  saveAnnotatedItems: PropTypes.func.isRequired,
  context: annotationContextType.isRequired,
  saving: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    context: currentContextSelector(state),
    saving: state.saving,
  }),
  dispatch => ({
    saveAnnotatedItems: () => dispatch(saveAnnotatedItems()),
  }),
)(Sidebar);
