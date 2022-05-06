module.exports = {
  extends: ['paazmaya'],
  env: {
    browser: true,
    jasmine: true
  },
  globals: {
    jQuery: false,
    $: false,
    location: false,
    process: false,
    ga: false
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'func-names': 'off'
  }
};
