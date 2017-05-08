import isEqual from 'lodash.isequal';
import isNil from 'lodash.isnil';
import pick from 'lodash.pick';
import { load, save } from 'api';
import { updateField } from 'redux/proxyActions';
import { currentContextSelector } from 'redux/selectors';
import {
  LOAD_ANNOTATIONS,
  LOAD_ANNOTATIONS_PROXY,
  SAVE_ANNOTATED_ITEMS,
  SAVE_ANNOTATED_ITEMS_PROXY,
  SELECT_ELEMENT_PROXY,
  UPDATE_FIELD,
  UPDATE_FIELD_PROXY,
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
          {
            content: action.content,
            sources: [{
              url: action.url,
              selector: action.selector,
              value: action.content,
            }],
          },
          action.append,
        ),
      );
    }
    return Promise.resolve();
  },

  [UPDATE_FIELD_PROXY]: action => (dispatch, getState) => {
    const currentMapping = currentContextSelector(getState())[
      action.annotationName].collectionMappings[action.collectionIndex][action.fieldName];
    if (!isEqual(action.mapping, pick(currentMapping, Object.keys(action.mapping)))) {
      // Only fire action if something will change
      dispatch({
        ...action,
        type: UPDATE_FIELD,
      });
    }
  },
};
