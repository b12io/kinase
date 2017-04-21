import {
  ADD_COLLECTION_MAPPING,
  CLEAR_ERROR,
  DELETE_COLLECTION_MAPPING,
  LOAD_ANNOTATIONS_PROXY,
  SAVE_ANNOTATED_ITEMS_PROXY,
  SELECT_ELEMENT_PROXY,
  SET_CONTEXT_KEY,
  SET_CURRENT_FIELD,
  UPDATE_FIELD,
} from 'redux/constants';

export function addCollectionMapping(annotationName) {
  return {
    annotationName,
    type: ADD_COLLECTION_MAPPING,
  };
}

export function clearError() {
  return {
    type: CLEAR_ERROR,
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

export function selectElement(selector, content, append = false) {
  return {
    selector,
    content,
    append,
    type: SELECT_ELEMENT_PROXY,
  };
}

export function setContextKey(contextKey) {
  return {
    contextKey,
    type: SET_CONTEXT_KEY,
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

export function updateField(
  annotationName, collectionIndex, fieldName, mapping, append = false,
) {
  return {
    annotationName,
    collectionIndex,
    fieldName,
    mapping,
    append,
    type: UPDATE_FIELD,
  };
}
