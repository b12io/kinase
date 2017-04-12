import testAnnotations from 'test-annotations.json';
import UPDATE_FIELD from 'redux/constants';

const initialState = {
  annotations: testAnnotations,
};

function annotation(state, action) {
  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        [action.fieldName]: action.value,
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
        [action.annotationName]: annotation(state[action.annotationName]),
      };
    default:
      return state;
  }
}
