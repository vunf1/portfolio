module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
    },
    cssnano: {
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifySelectors: true,
        mergeRules: true,
        mergeLonghand: true,
        reduceTransforms: true,
        reduceInitial: true,
        reduceIdents: true,
        zindex: false, // Keep z-index values for proper layering
      }]
    }
  }
}
