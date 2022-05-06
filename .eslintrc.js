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
    ecmaVersion: 'latest'
  },
  rules: {
    'func-names': 'off'
  }
};
