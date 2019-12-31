const withSass = require('@zeit/next-sass');
const withStyledIcons = require('next-plugin-styled-icons');
const withImages = require('next-images');

module.exports = withImages(withStyledIcons(withSass({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  }
})));
