module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'eslint:eslint-recommended',
    'plugin: @typescript-eslint/recommended',
    'plugin: prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {},
  ignorePatterns: ['dist/', 'node_modules/'],
};
