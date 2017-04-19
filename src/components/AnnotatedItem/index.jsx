import Collapse from 'rc-collapse';
import MdAdd from 'react-icons/lib/md/add';
import MdDelete from 'react-icons/lib/md/delete';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AnnotatedItemField from 'components/AnnotatedItemField';
import { schemaSelector } from 'redux/selectors';
import {
  addCollectionMapping,
  deleteCollectionMapping,
} from 'redux/proxyActions';

import 'rc-collapse/assets/index.css';
import styles from './style.scss';

class AnnotatedItem extends React.Component {
  getCollectionMapping(collectionMapping, collectionIndex) {
    const collectionHeader = (
      <div className={styles.annotatedItemHeader}>
        <span>{collectionIndex}</span>
        <span onClick={event => this.props.deleteCollectionMapping(event, collectionIndex)}>
          <MdDelete />
        </span>
      </div>
    );
    return (
      <Collapse className={styles.mappingCollapse} accordion={false} key={collectionIndex}>
        <Collapse.Panel header={collectionHeader}>
          {this.getMappingFields(collectionMapping, collectionIndex)}
        </Collapse.Panel>
      </Collapse>
    );
  }

  getHeaderOptions() {
    if (this.props.schema.multiple) {
      // Include add button for annotations that support multiple items
      return (
        <span onClick={this.props.addCollectionMapping}>
          <MdAdd />
        </span>
      );
    }
    return null;
  }

  getMappingFields(collectionMapping, collectionIndex) {
    const fields = Object.keys(this.props.schema.fields).map(fieldName => (
      <li key={fieldName}>
        <AnnotatedItemField
          annotationName={this.props.annotationName}
          collectionIndex={collectionIndex}
          fieldName={fieldName}
        />
      </li>
    ));
    return (
      <ul>{fields}</ul>
    );
  }

  getAllMappings() {
    if (this.props.schema.multiple) {
      return (
        <div className={styles.collapseGroup}>
          {this.props.mappings.map(this.getCollectionMapping.bind(this))}
        </div>
      );
    }
    return this.getMappingFields(this.props.mappings[0], 0);
  }

  render() {
    return (
      <div className={styles.annotatedItem}>
        <div className={styles.annotatedItemHeader}>
          <span>{this.props.annotationName}</span>
          {this.getHeaderOptions()}
        </div>
        {this.getAllMappings()}
      </div>
    );
  }
}

AnnotatedItem.propTypes = {
  addCollectionMapping: PropTypes.func.isRequired,
  annotationName: PropTypes.string.isRequired,
  deleteCollectionMapping: PropTypes.func.isRequired,
  mappings: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.shape({
    source: PropTypes.string,
    content: PropTypes.string,
    original: PropTypes.string,
  }))).isRequired,
  schema: PropTypes.shape({
    multiple: PropTypes.bool,
    fields: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default connect(
  (state, ownProps) => ({
    mappings: state.mappings[ownProps.annotationName],
    schema: schemaSelector(state)[ownProps.annotationName],
  }),
  (dispatch, ownProps) => ({
    addCollectionMapping: () => dispatch(addCollectionMapping(ownProps.annotationName)),
    deleteCollectionMapping: (event, collectionIndex) => {
      event.stopPropagation();
      return dispatch(deleteCollectionMapping(
          ownProps.annotationName, collectionIndex));
    },
  }),
)(AnnotatedItem);
