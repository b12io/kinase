import PropTypes from 'prop-types';

import { UPDATE_FIELD } from 'redux/constants';

const initialState = {
  // TODO(jrbotros): also store the URL for this selector
  content: null,
  original: null,
  sources: [],
};

export const annotatedItemFieldType = PropTypes.shape({
  content: PropTypes.string.isRequired,
  original: PropTypes.string.isRequired,
  sources: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export default function annotatedItemField(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FIELD:
      if (action.append) {
        return {
          ...state,
          content: `${state.content}\n${action.mapping.content}`,
          original: `${state.original}\n${action.mapping.content}`,
          sources: [...state.sources, ...action.mapping.sources],
        };
      }
      return {
        ...state,
        content: action.mapping.content,
        original: action.mapping.content,
        sources: action.mapping.sources,
      };
    default:
      return state;
  }
}
