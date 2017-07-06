/* eslint no-unused-vars: "off" */

/**
 * This file represents an API stub to be overwritten by derived extensions.
 */

import testAnnotations from 'redux/testAnnotations.json';

export function load(contextKey) {
  return Promise.resolve(testAnnotations);
}

export function save(updatedMappings, contextKey) {
  return Promise.resolve();
}
