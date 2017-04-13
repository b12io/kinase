import UPDATE_FIELD from 'redux/constants';

export function updateField(annotationName, fieldName, value) {
  return {
    annotationName,
    fieldName,
    value,
    type: UPDATE_FIELD,
  };
}

export function test() {}
