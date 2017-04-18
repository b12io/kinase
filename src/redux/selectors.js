import get from 'lodash.get';
import { createSelector } from 'reselect';

export const currentFieldTypeSelector = createSelector(
  state => state.schema,
  state => state.currentAnnotation,
  state => state.currentField,
  (schemas, currentAnnotation, currentField) => (
    get(schemas, [currentAnnotation, currentField])),
);
