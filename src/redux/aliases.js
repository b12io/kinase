import isNil from 'lodash.isnil';
import request from 'superagent';
import testAnnotations from 'redux/testAnnotations.json';
import { getEndpoint, postEndpoint } from 'config';
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
  [LOAD_ANNOTATIONS_PROXY]: () => ({
    type: LOAD_ANNOTATIONS,
    payload: (
        getEndpoint
        ? request.get(getEndpoint)
        : Promise.resolve(testAnnotations)),
  }),

  [SAVE_ANNOTATED_ITEMS_PROXY]: () => (dispatch, getState) => ({
    type: SAVE_ANNOTATED_ITEMS,
    payload: (
        postEndpoint
        ? request.post(postEndpoint).send(getState().mappings)
        : Promise.resolve()),
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
          action.selector,
        ),
      );
    }
    return Promise.resolve();
  },
};
