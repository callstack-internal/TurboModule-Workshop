module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['react-hooks'],
  rules: {
    'no-unused-vars': 'error',
    curly: 'error',
    'prefer-const': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
