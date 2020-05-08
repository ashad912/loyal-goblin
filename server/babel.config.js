// babel.config.js
module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
    plugins: [
      ["module-resolver", {
        "root": ["./"],
        "alias": {
          "@": "./",
          "@src": "./src",
          "@models": "./src/models",
          "@schemas": "./src/schemas",
          "@routes": "./src/routes",
          "@controllers": './src/controllers',
          "@middleware": './src/middleware',
          "@config": "./config",
          "@tests": "./__tests__/",
          "@app": './src/app',
          "@utils": './src/utils',
          "@store": './src/store'
        }
      }]
    ]
};