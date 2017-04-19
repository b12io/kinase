import {
  ADD_COLLECTION_MAPPING,
  DELETE_COLLECTION_MAPPING,
  SELECT_ELEMENT,
  SET_CURRENT_FIELD,
  UPDATE_FIELD,
} from 'redux/constants';

export function addCollectionMapping(annotationName) {
  return {
    annotationName,
    type: ADD_COLLECTION_MAPPING,
  };
}

export function deleteCollectionMapping(annotationName, collectionIndex) {
  return {
    annotationName,
    collectionIndex,
    type: DELETE_COLLECTION_MAPPING,
  };
}

export function selectElement(selector, content) {
  return {
    selector,
    content,
    type: SELECT_ELEMENT,
  };
}

export function setCurrentField(annotationName, collectionIndex, fieldName) {
  return {
    annotationName,
    collectionIndex,
    fieldName,
    type: SET_CURRENT_FIELD,
  };
}

export function updateField(annotationName, collectionIndex, fieldName, content, source) {
  return {
    annotationName,
    collectionIndex,
    fieldName,
    content,
    source,
    type: UPDATE_FIELD,
  };
}
