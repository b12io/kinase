import {
  ADD_COLLECTION_MAPPING,
  DELETE_COLLECTION_MAPPING,
  LOAD_ANNOTATIONS_PROXY,
  SAVE_ANNOTATED_ITEMS_PROXY,
  SELECT_ELEMENT_PROXY,
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

export function loadAnnotations() {
  return {
    type: LOAD_ANNOTATIONS_PROXY,
  };
}

export function saveAnnotatedItems() {
  return {
    type: SAVE_ANNOTATED_ITEMS_PROXY,
  };
}

export function selectElement(selector, content) {
  return {
    selector,
    content,
    type: SELECT_ELEMENT_PROXY,
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
