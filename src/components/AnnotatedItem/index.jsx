import Collapse from 'rc-collapse';
import MdAdd from 'react-icons/lib/md/add';
import MdDelete from 'react-icons/lib/md/delete';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AnnotatedItemField from 'components/AnnotatedItemField';
import { annotatedItemType } from 'redux/reducers/annotatedItem';
import { currentContextSelector } from 'redux/selectors';
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
        <MdDelete
          className={styles.deleteCollectionMapping}
          onClick={event => this.props.deleteCollectionMapping(event, collectionIndex)}
        />
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
    if (this.props.item.schema.multiple) {
      // Include add button for annotations that support multiple items
      return (
        <MdAdd
          className={styles.addCollectionMapping}
          onClick={this.props.addCollectionMapping}
        />
      );
    }
    return null;
  }

  getMappingFields(collectionMapping, collectionIndex) {
    const fields = Object.keys(this.props.item.schema.fields).map(fieldName => (
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
    if (this.props.item.schema.multiple) {
      return (
        <div className={styles.collapseGroup}>
          {this.props.item.collectionMappings.map(this.getCollectionMapping.bind(this))}
        </div>
      );
    }
    return this.getMappingFields(this.props.item.collectionMappings[0], 0);
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
  item: annotatedItemType.isRequired,
};

export default connect(
  (state, ownProps) => ({
    item: currentContextSelector(state)[ownProps.annotationName],
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
