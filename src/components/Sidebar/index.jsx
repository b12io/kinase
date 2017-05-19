import mapValues from 'lodash.mapvalues';
import sortBy from 'lodash.sortby';
import values from 'lodash.values';
import MdSave from 'react-icons/lib/md/save';
import PropTypes from 'prop-types';
import React from 'react';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import SearchInput, {
  createFilter,
} from 'react-search-input';

import manifest from 'manifest.json';
import AnnotatedItem from 'components/AnnotatedItem';
import { saveAnnotatedItems } from 'redux/proxyActions';
import { annotationContextType } from 'redux/reducers/annotationContext';
import { currentContextSelector } from 'redux/selectors';

import 'sweetalert2/dist/sweetalert2.css';
import styles from './style.scss';

class Sidebar extends React.Component {
  state = {
    search: '',
  };

  getAnnotations() {
    const annotations = values(mapValues(this.props.context, (annotation, name) => ({
      ...annotation,
      name,
    })));
    const filteredAnnotations = sortBy(
      annotations.filter(createFilter(this.state.search, 'name')), 'name');
    return filteredAnnotations.map(annotation => (
      <li key={annotation.name}>
        <AnnotatedItem annotationName={annotation.name} />
      </li>
    ));
  }

  searchUpdated = (search) => {
    this.setState({ search });
  }

  render() {
    return (
      <div className={styles.sidebar}>
        <header>
          <span>{ manifest.name }</span>
          <span className={styles.saveIndicator} onClick={this.props.saveAnnotatedItems}>
            {
              this.props.saving
              ? <Spinner className={styles.saveSpinner} noFadeIn spinnerName={'three-bounce'} />
              : <MdSave className={styles.saveButton} />
            }
          </span>
        </header>
        <SearchInput className={styles.searchBox} onChange={this.searchUpdated} />
        <ul className={styles.annotationList}>{this.getAnnotations()}</ul>
      </div>
    );
  }
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
