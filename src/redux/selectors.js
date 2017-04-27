import get from 'lodash.get';
import mapValues from 'lodash.mapvalues';
import pickBy from 'lodash.pickby';
import { createSelector } from 'reselect';

export const annotationContextsSelector = state => state.contexts;
export const currentAnnotationSelector = state => state.currentAnnotation;
export const currentIndexSelector = state => state.currentIndex;
export const currentFieldSelector = state => state.currentField;
export const readySelector = state => state.ready;

export const currentContextKeySelector = state => state.currentContextKey;

export const currentContextSelector = createSelector(
  annotationContextsSelector,
  currentContextKeySelector,
  (contexts, currentContextKey) => get(contexts, currentContextKey),
);

export const currentAnnotatedItemSelector = createSelector(
  currentContextSelector,
  currentAnnotationSelector,
  (context, annotationName) => context[annotationName],
);

export const currentFieldTypeSelector = createSelector(
  currentAnnotatedItemSelector,
  currentFieldSelector,
  (currentAnnotatedItem, currentField) => (
    get(currentAnnotatedItem, ['schema', 'fields', currentField])
  ),
);

export const currentMappingsSelector = createSelector(
  currentContextSelector,
  context => (
    mapValues(
      pickBy(context, annotatedItem => annotatedItem.updated),
      annotatedItem => annotatedItem.collectionMappings)),
);
