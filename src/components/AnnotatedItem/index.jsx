import Collapse from 'rc-collapse';
import MdAdd from 'react-icons/lib/md/add';
import MdDelete from 'react-icons/lib/md/delete';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AnnotatedItemField from 'components/AnnotatedItemField';
import {
  addCollectionMapping,
  deleteCollectionMapping,
} from 'redux/proxyActions';

import 'rc-collapse/assets/index.css';
import styles from './style.scss';

class AnnotatedItem extends React.Component {
  generateMappingFields(mapping, collectionIndex) {
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

  render() {
    let innerHtml;
    if (this.props.schema.multiple) {
      const mappingHtml = this.props.mappings.map((mapping, collectionIndex) => {
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
              {this.generateMappingFields(mapping, collectionIndex)}
            </Collapse.Panel>
          </Collapse>
        );
      });
      innerHtml = (
        <div className={styles.collapseGroup}>
          {mappingHtml}
        </div>
      );
    } else {
      innerHtml =
        this.generateMappingFields(this.props.mappings[0], 0);
    }

    const headerOptions = (
      this.props.schema.multiple
      ? <span onClick={this.props.addCollectionMapping}><MdAdd /></span>
      : null);

    return (
      <div className={styles.annotatedItem}>
        <div className={styles.annotatedItemHeader}>
          <span>{this.props.annotationName}</span>
          {headerOptions}
        </div>
        {innerHtml}
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
    schema: state.schema[ownProps.annotationName],
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
