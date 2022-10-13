module.exports = {
  parse: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base', 'plugin: @typescript-eslint/recommended'],
  rules: {},
  env: {
    browser: true,
  },
};
