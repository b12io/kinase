import testAnnotations from 'test-annotations.json';
import { UPDATE_FIELD } from 'redux/constants';

const initialState = {
  annotations: testAnnotations,
  currentAnnotation: 'about',
  currentField: 'text',
};

function annotation(state, action) {
  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        [action.fieldName]: {
          source: action.source,
          content: action.content,
        },
      };
    default:
      return state;
  }
}

export default function annotations(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        annotations: {
          ...state.annotations,
          [action.annotationName]: annotation(
            state.annotations[action.annotationName], action),
        },
      };
    default:
      return state;
  }
}
