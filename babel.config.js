// babel.config.cjs
module.exports = {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current'
        }
      }],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      // Support for dynamic imports
      '@babel/plugin-syntax-dynamic-import',
      // Support for class properties
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      // Support for object rest/spread
      '@babel/plugin-proposal-object-rest-spread'
    ]
  }