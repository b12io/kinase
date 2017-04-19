import get from 'lodash.get';
import { createSelector } from 'reselect';

export const schemaSelector = state => state.schema;
export const mappingsSelector = state => state.mappings;

export const currentFieldTypeSelector = createSelector(
  schemaSelector,
  state => state.currentAnnotation,
  state => state.currentField,
  (schemas, currentAnnotation, currentField) => (
    get(schemas, [currentAnnotation, 'fields', currentField])),
);
