import testAnnotations from 'redux/testAnnotations.json';

export function load() {
  return Promise.resolve(testAnnotations);
}

export function save() {
  return Promise.resolve();
}
