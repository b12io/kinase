import endsWith from 'lodash.endswith';
import mapValues from 'lodash.mapvalues';

// TODO(jrbotros): remove this when we can import from package
// https://github.com/pburtchaell/redux-promise-middleware/issues/143
export const promiseTypeSuffixes = ['PENDING', 'FULFILLED', 'REJECTED'];
const [PENDING, FULFILLED, REJECTED] = promiseTypeSuffixes;
const promiseTypes = {
  PENDING,
  FULFILLED,
  REJECTED,
};

export const promiseActionTypes = baseType => ({
  ...mapValues(promiseTypes, suffix => `${baseType}_${suffix}`),
  BASE: baseType,
});

export const isRejected = action => (
  endsWith(action.type, promiseTypes.REJECTED));
