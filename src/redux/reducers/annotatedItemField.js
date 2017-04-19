import isUndefined from 'lodash.isundefined';

import { UPDATE_FIELD } from 'redux/constants';

export default function annotatedItemField(state, action) {
  if (isUndefined(state)) {
    return {
      source: null,
      content: null,
      original: null,
    };
  }

  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        source: action.source,
        content: action.content,
        original: action.content,
      };
    default:
      return state;
  }
}
