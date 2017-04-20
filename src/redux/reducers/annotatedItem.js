import cloneDeep from 'lodash.clonedeep';
import isUndefined from 'lodash.isundefined';
import mapValues from 'lodash.mapvalues';
import PropTypes from 'prop-types';

import annotatedItemField, {
  annotatedItemFieldType,
} from 'redux/reducers/annotatedItemField';
import {
  ADD_COLLECTION_MAPPING,
  DELETE_COLLECTION_MAPPING,
  LOAD_ANNOTATIONS,
  UPDATE_FIELD,
} from 'redux/constants';

export const annotatedItemType = PropTypes.shape({
  schema: PropTypes.shape({
    multiple: PropTypes.bool,
    fields: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  collectionMappings: PropTypes.arrayOf(
    PropTypes.objectOf(annotatedItemFieldType),
  ).isRequired,
});

export default function annotatedItem(state, action) {
  const newCollectionMapping = () => mapValues(state.schema.fields, () => (
    annotatedItemField(undefined, action)
  ));

  switch (action.type) {
    case LOAD_ANNOTATIONS.FULFILLED:
      if (isUndefined(state.collectionMappings)) {
        // State is being loaded for the first time without pre-mapped content
        return {
          ...state,
          collectionMappings: [newCollectionMapping()],
        };
      }
      // Schema is being reloaded
      return {
        ...state,
        collectionMappings: state.collectionMappings.map(
          // Ensure all mappings contain only fields from new schema
          collectionMapping => mapValues(state.schema.fields, (fieldType, fieldName) => (
            annotatedItemField(collectionMapping[fieldName], action)
          )),
        ),
      };

    case ADD_COLLECTION_MAPPING: {
      return {
        ...state,
        collectionMappings: [
          ...state.collectionMappings,
          newCollectionMapping(),
        ],
      };
    }

    case DELETE_COLLECTION_MAPPING: {
      const newState = cloneDeep(state);
      newState.collectionMappings.splice(action.collectionIndex, 1);
      return newState;
    }

    case UPDATE_FIELD: {
      const newState = cloneDeep(state);
      newState.collectionMappings[action.collectionIndex] = {
        ...state.collectionMappings[action.collectionIndex],
        [action.fieldName]: (
          annotatedItemField(
            state.collectionMappings[action.collectionIndex][action.fieldName], action)
        ),
      };
      return newState;
    }

    default: {
      return state;
    }
  }
}
