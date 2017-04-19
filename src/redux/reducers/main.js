import mapValues from 'lodash.mapvalues';

import testAnnotations from 'redux/testAnnotations.json';
import annotatedItem from 'redux/reducers/annotatedItem';
import {
  ADD_COLLECTION_MAPPING,
  DELETE_COLLECTION_MAPPING,
  SET_CURRENT_FIELD,
  UPDATE_FIELD,
} from 'redux/constants';

const initialState = {
  schema: testAnnotations,
  mappings: mapValues(testAnnotations,
    (annotationName, annotationInfo) => annotatedItem(undefined, {
      schema: annotationInfo,
    })),
  currentAnnotation: null,
  currentField: null,
};

export default function main(state = initialState, action) {
  switch (action.type) {
    case ADD_COLLECTION_MAPPING: {
      return {
        ...state,
        mappings: {
          ...state.mappings,
          [action.annotationName]: annotatedItem(
            state.mappings[action.annotationName], {
              ...action,
              schema: state.schema[action.annotationName],
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
