import mapValues from 'lodash.mapvalues';

import annotationContext from 'redux/reducers/annotationContext';
import { isRejected } from 'redux/promiseHelpers';
import {
  ADD_COLLECTION_MAPPING,
  CLEAR_ERROR,
  DELETE_COLLECTION_MAPPING,
  LOAD_ANNOTATIONS,
  SET_CONTEXT_KEY,
  SET_CURRENT_FIELD,
  UPDATE_FIELD,
} from 'redux/constants';

const defaultContextKey = 'tentDefault';

const initialState = {
  contexts: {
    [defaultContextKey]: annotationContext(undefined, {}),
  },
  currentContextKey: defaultContextKey,
  currentAnnotation: null,
  currentIndex: null,
  currentField: null,
  error: null,
  ready: false,
};

export default function main(state = initialState, action) {
  if (isRejected(action)) {
    // If a promise payload is rejected, skip logic and return error state
    return {
      ...state,
      error: true,
    };
  }

  switch (action.type) {
    case CLEAR_ERROR: {
      return {
        ...state,
        error: false,
      };
    }
    case LOAD_ANNOTATIONS.FULFILLED: {
      return {
        ...state,
        ready: true,
        contexts: mapValues(
          state.contexts, context => annotationContext(context, action)),
      };
    }
    case SET_CONTEXT_KEY: {
      return {
        ...state,
        contexts: {
          ...state.contexts,
          [action.contextKey]: (
            annotationContext(state.contexts[action.contextKey], action)
          ),
        },
        currentContextKey: action.contextKey,
        currentAnnotation: null,
        currentIndex: null,
        currentField: null,
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

    // Passthrough actions
    case ADD_COLLECTION_MAPPING:
      return {
        ...state,
        contexts: {
          ...state.contexts,
          [state.currentContextKey]: (
            annotationContext(state.contexts[state.currentContextKey], action)
          ),
        },
      };
    case DELETE_COLLECTION_MAPPING:
    case UPDATE_FIELD: {
      return {
        ...state,
        contexts: {
          ...state.contexts,
          [state.currentContextKey]: (
            annotationContext(state.contexts[state.currentContextKey], action)
          ),
        },
      };
    }

    default: {
      return state;
    }
  }
}
