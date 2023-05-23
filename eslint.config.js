import paazmaya from 'eslint-config-paazmaya';
import globals from 'globals';

export default [
  paazmaya, {
    rules: {
      'func-names': 'off'
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jasmine,
        location: false,
        process: false,
        ga: false
      }
    }
  }
];
