const path = require('path');

module.exports = {
  extends: 'airbnb',
  installedESLint: true,
  settings: {
    'import/resolver': 'webpack',
  },
  rules: {
    // TODO(jrbotros): get better at accessibility!
    'jsx-a11y/no-static-element-interactions': 0,

    // TODO(jrbotros): assign collection items a unique identifier
    'react/no-array-index-key': 0,
  }
};
