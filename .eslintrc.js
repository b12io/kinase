const path = require('path');

module.exports = {
  extends: 'airbnb',
  installedESLint: true,
  settings: {
    'import/resolver': 'webpack',
  },
  rules: {
    // TODO(jrbotros): Get better at accessibility!
    'jsx-a11y/no-static-element-interactions': 0
  }
};
