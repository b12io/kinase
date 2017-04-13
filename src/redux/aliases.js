import { SELECT_ELEMENT } from 'redux/constants';
import { updateField } from 'redux/proxyActions';

export default {
  [SELECT_ELEMENT]: action => (dispatch, getState) => {
    const { currentAnnotation, currentField } = getState();
    if (currentAnnotation && currentField) {
      return dispatch(updateField(
        currentAnnotation, currentField, action.content, action.selector));
    }
    return Promise.resolve();
  },
};
