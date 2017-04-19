import cloneDeep from 'lodash.clonedeep';
import isUndefined from 'lodash.isundefined';
import mapValues from 'lodash.mapvalues';

import annotatedItemField from 'redux/reducers/annotatedItemField';
import {
  ADD_COLLECTION_MAPPING,
  DELETE_COLLECTION_MAPPING,
  UPDATE_FIELD,
} from 'redux/constants';

export default function annotatedItem(state, action) {
  const newMapping = () => mapValues(
    action.schema.fields, () => annotatedItemField(undefined, action));

  if (isUndefined(state)) {
    return [newMapping()];
  }

  switch (action.type) {
    case ADD_COLLECTION_MAPPING: {
      return [
        ...state,
        newMapping(),
      ];
    }
    case DELETE_COLLECTION_MAPPING: {
      const newState = cloneDeep(state);
      newState.splice(action.collectionIndex, 1);
      return newState;
    }
    case UPDATE_FIELD: {
      const newState = cloneDeep(state);
      newState[action.collectionIndex] = {
        ...state,
        [action.fieldName]: annotatedItemField(
          state[action.collectionIndex][action.fieldName], action),
      };
      return newState;
    }
    default: {
      return state;
    }
  }
}
