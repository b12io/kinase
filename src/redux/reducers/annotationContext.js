import mapValues from 'lodash.mapvalues';
import PropTypes from 'prop-types';

import annotatedItem, {
  annotatedItemType,
} from 'redux/reducers/annotatedItem';
import {
  ADD_COLLECTION_MAPPING,
  DELETE_COLLECTION_MAPPING,
  LOAD_ANNOTATIONS,
  UPDATE_FIELD,
} from 'redux/constants';

export const annotationContextType = PropTypes.objectOf(annotatedItemType);

export default function annotationContext(state, action) {
  switch (action.type) {
    case LOAD_ANNOTATIONS.FULFILLED: {
      return mapValues(action.payload, schema => (
        annotatedItem({ schema }, action)
      ));
    }

    // Passthrough actions
    case ADD_COLLECTION_MAPPING:
    case DELETE_COLLECTION_MAPPING:
    case UPDATE_FIELD: {
      return {
        ...state,
        [action.annotationName]: (
          annotatedItem(state[action.annotationName], action)
        ),
      };
    }

    default: {
      return state;
    }
  }
}
