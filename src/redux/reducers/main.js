import mapValues from 'lodash.mapvalues';

import annotatedItem from 'redux/reducers/annotatedItem';
import { schemaSelector } from 'redux/selectors';
import {
  ADD_COLLECTION_MAPPING,
  DELETE_COLLECTION_MAPPING,
  LOAD_ANNOTATIONS,
  SET_CURRENT_FIELD,
  UPDATE_FIELD,
} from 'redux/constants';

const initialState = {
  currentAnnotation: null,
  currentField: null,
  error: null,
  mappings: {},
  schema: {},
};

export default function main(state = initialState, action) {
  if (action.error) {
    // If a promise payload is rejected, skip logic and return error state
    return {
      ...state,
      error: 'Error loading annotations!',
    };
  }

  switch (action.type) {
    case ADD_COLLECTION_MAPPING: {
      return {
        ...state,
        mappings: {
          ...state.mappings,
          [action.annotationName]: annotatedItem(
            state.mappings[action.annotationName], {
              ...action,
              schema: schemaSelector(state)[action.annotationName],
            }),
        },
      };
    }
    case DELETE_COLLECTION_MAPPING: {
      return {
        ...state,
        mappings: {
          ...state.mappings,
          [action.annotationName]: annotatedItem(
            state.mappings[action.annotationName], action),
        },
      };
    }
    case LOAD_ANNOTATIONS: {
      return {
        schema: action.payload,
        mappings: mapValues(action.payload,
          annotationInfo => annotatedItem(undefined, {
            schema: annotationInfo,
          })),
      };
    }
    case SET_CURRENT_FIELD: {
      return {
        ...state,
        currentAnnotation: action.annotationName,
        currentIndex: action.collectionIndex,
        currentField: action.fieldName,
      };
    }
    case UPDATE_FIELD: {
      return {
        ...state,
        mappings: {
          ...state.mappings,
          [action.annotationName]: annotatedItem(
            state.mappings[action.annotationName], action),
        },
      };
    }
    default: {
      return state;
    }
  }
}
