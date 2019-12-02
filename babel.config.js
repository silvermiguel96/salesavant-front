module.exports = function() {
  if (process.env.NODE_ENV === "production" || process.env.BABEL_ENV === "production") {
    return {
      presets: ["@vue/app"],
      plugins: ["transform-remove-console"]
    };
  } else {
    return {
      presets: ["@vue/app"]
    };
  }
};
