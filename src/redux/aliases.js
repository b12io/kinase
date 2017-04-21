import isNil from 'lodash.isnil';
import { load, save } from 'api';
import { updateField } from 'redux/proxyActions';
import {
  LOAD_ANNOTATIONS,
  LOAD_ANNOTATIONS_PROXY,
  SAVE_ANNOTATED_ITEMS,
  SAVE_ANNOTATED_ITEMS_PROXY,
  SELECT_ELEMENT_PROXY,
} from 'redux/constants';

// NOTE: The `alias` middleware allows async actions to be triggered from the
// proxy store but carried out on the background page. Read more at:
// https://github.com/tshaddix/react-chrome-redux/wiki/Advanced-Usage
export default {
  [LOAD_ANNOTATIONS_PROXY]: () => (dispatch, getState) => dispatch({
    type: LOAD_ANNOTATIONS.BASE,
    payload: load(getState()),
  }),

  [SAVE_ANNOTATED_ITEMS_PROXY]: () => (dispatch, getState) => dispatch({
    type: SAVE_ANNOTATED_ITEMS,
    payload: save(getState()),
  }),

  [SELECT_ELEMENT_PROXY]: action => (dispatch, getState) => {
    const { currentAnnotation, currentIndex, currentField } = getState();
    if (currentAnnotation && !isNil(currentIndex) && currentField) {
      return dispatch(
        updateField(
          currentAnnotation,
          currentIndex,
          currentField,
          action.content,
          action.content,
          action.selector,
        ),
      );
    }
    return Promise.resolve();
  },
};
