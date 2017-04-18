import mapValues from 'lodash.mapvalues';
import testAnnotations from 'test-annotations.json';
import { SET_CURRENT_FIELD, UPDATE_FIELD } from 'redux/constants';

const initialState = {
  schema: testAnnotations,
  mappings: (
    mapValues(testAnnotations, (annotationName, fields) => (
        mapValues(fields, () => ({
          source: null,
          content: null,
        }))))),
  currentAnnotation: null,
  currentField: null,
};

function annotatedItem(state, action) {
  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        [action.fieldName]: {
          source: action.source,
          content: action.content,
          original: action.content,
        },
      };
    default:
      return state;
  }
}

export default function annotatedItems(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_FIELD:
      return {
        ...state,
        currentAnnotation: action.annotationName,
        currentField: action.fieldName,
      };
    case UPDATE_FIELD:
      return {
        ...state,
        mappings: {
          ...state.mappings,
          [action.annotationName]: annotatedItem(
            state.mappings[action.annotationName], action),
        },
      };
    default:
      return state;
  }
}
