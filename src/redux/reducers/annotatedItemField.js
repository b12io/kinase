import PropTypes from 'prop-types';

import { UPDATE_FIELD } from 'redux/constants';

const initialState = {
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
        original: action.content,
        source: action.source,
      };
    default:
      return state;
  }
}
