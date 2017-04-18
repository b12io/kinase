import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'rc-collapse';
import { connect } from 'react-redux';

import AnnotatedItemField from 'components/AnnotatedItemField';

import 'rc-collapse/assets/index.css';
import styles from './style.scss';

function AnnotatedItem(props) {
  const fields = Object.keys(props.schema).map(fieldName => (
    <li key={fieldName}>
      <AnnotatedItemField annotationName={props.annotationName} fieldName={fieldName} />
    </li>
  ));
  return (
    <div className={styles.annotatedItem}>
      <Collapse accordion={false}>
        <Collapse.Panel header={props.annotationName}>
          <ul>{fields}</ul>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}

AnnotatedItem.propTypes = {
  schema: PropTypes.objectOf(PropTypes.string),
  annotationName: PropTypes.string.isRequired,
};
AnnotatedItem.defaultProps = {
  schema: {},
};

export default connect(
  (state, ownProps) => ({
    schema: state.schema[ownProps.annotationName],
  }),
)(AnnotatedItem);
