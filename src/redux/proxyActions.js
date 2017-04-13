import { SELECT_ELEMENT, UPDATE_FIELD } from 'redux/constants';

export function updateField(annotationName, fieldName, content, source) {
  return {
    annotationName,
    fieldName,
    content,
    source,
    type: UPDATE_FIELD,
  };
}

export function selectElement(selector, content) {
  return {
    selector,
    content,
    type: SELECT_ELEMENT,
  };
}
