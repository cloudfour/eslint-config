const path = require('path');
module.exports = {
  rules: {
    // These rules are disabled because they are very likely to trigger
    // Because the linting files are taken out of context
    '@cloudfour/n/no-extraneous-require': 'off',
    '@cloudfour/n/no-missing-require': 'off',
    '@cloudfour/n/no-missing-import': 'off',
    '@cloudfour/n/no-extraneous-import': 'off',
  },
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
};
