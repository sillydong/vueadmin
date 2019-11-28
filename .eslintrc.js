module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': [
    'plugin:vue/recommended',
    'standard'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'parser': "babel-eslint",
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'vue'
  ],
  'rules': {
    'camelcase': 'off',
    'no-new': 'off',
    'no-labels': 'off',
    'vue/no-parsing-error': ['error', { 'x-invalid-end-tag': false }],
    'vue/name-property-casing': 'off'
  }
}
