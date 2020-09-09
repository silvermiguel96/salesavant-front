module.exports = function (api) {
  api.cache.forever();
  if (process.env.NODE_ENV === "production" || process.env.BABEL_ENV === "production") {
    return {
      presets: ["@vue/app"],
      plugins: [
        "transform-remove-console",
        [
          'babel-plugin-root-import',
          {
            "rootPathSuffix": "./src",
            "rootPathPrefix": "@"
          }
        ]
      ]
    };
  } else {
    return {
      presets: ["@vue/app"],
      plugins: [
        [
          'babel-plugin-root-import',
          {
            "rootPathSuffix": "./src",
            "rootPathPrefix": "@"
          }
        ]
      ]
    };
  }
};
