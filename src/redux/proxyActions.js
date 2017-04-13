import { SELECT_ELEMENT, SET_CURRENT_FIELD, UPDATE_FIELD } from 'redux/constants';

export function selectElement(selector, content) {
  return {
    selector,
    content,
    type: SELECT_ELEMENT,
  };
}

export function setCurrentField(annotationName, fieldName) {
  return {
    annotationName,
    fieldName,
    type: SET_CURRENT_FIELD,
  };
}

export function updateField(annotationName, fieldName, content, source) {
  return {
    annotationName,
    fieldName,
    content,
    source,
    type: UPDATE_FIELD,
  };
}
