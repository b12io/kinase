import PropTypes from 'prop-types';

import { UPDATE_FIELD } from 'redux/constants';

const initialState = {
  // TODO(jrbotros): also store the URL for this selector
  content: null,
  original: null,
  source: null,
};

export const annotatedItemFieldType = PropTypes.shape({
  content: PropTypes.string,
  original: PropTypes.string,
  source: PropTypes.string,
});

export default function annotatedItemField(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        content: action.content,
        original: action.original || state.original,
        source: action.source || state.source,
      };
    default:
      return state;
  }
}
