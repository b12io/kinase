import defaults from 'lodash.defaults';
import PropTypes from 'prop-types';

import { LOAD_ANNOTATIONS, UPDATE_FIELD } from 'redux/constants';

const initialState = {
  // TODO(jrbotros): also store the URL for this selector
  content: '',
  original: '',
  sources: [],
};

export const annotatedItemFieldType = PropTypes.shape({
  content: PropTypes.string,
  original: PropTypes.string,
  sources: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    selector: PropTypes.string.isRequired,
  })),
});

export default function annotatedItemField(state = initialState, action) {
  switch (action.type) {
    case LOAD_ANNOTATIONS.FULFILLED:
      return defaults(state, initialState);
    case UPDATE_FIELD:
      if (action.append) {
        return {
          ...state,
          content: `${state.content}\n${action.mapping.content}`,
          original: `${state.original}\n${action.mapping.content}`,
          sources: [...state.sources, ...action.mapping.sources],
        };
      }
      return defaults({
        ...state,
        content: action.mapping.content,
        original: action.mapping.content,
        sources: action.mapping.sources,
      }, initialState);
    default:
      return state;
  }
}
